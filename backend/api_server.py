"""
FastAPI Backend - API Integration Layer
Connects React frontend with Python automation backend
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional, Dict
import asyncio
from pathlib import Path
import json
from datetime import datetime

from resume_tailor import ResumeTailor
from human_emulator import HumanEmulator
from database_manager import ApplicationDatabase
from stealth_applicant import StealthJobApplicant


app = FastAPI(title="StreamlineRemote API", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global instances
resume_tailor = ResumeTailor()
human_emulator = HumanEmulator()
db = ApplicationDatabase()
applicant: Optional[StealthJobApplicant] = None

# Store master resume in memory
master_resume: Optional[Dict] = None


# ============================================================================
# Pydantic Models
# ============================================================================

class JobData(BaseModel):
    url: str
    company: str
    title: str
    location: Optional[str] = "Remote"
    jd: str
    key_requirements: List[str]


class MasterResumeData(BaseModel):
    version: str
    contact: Dict
    experience: List[Dict]
    skills: Dict


class ApplicationRequest(BaseModel):
    job: JobData
    auto_submit: bool = False


class PulseStatus(BaseModel):
    status: str
    cooldown_remaining: int
    batch_progress: str
    next_action_eta: Optional[int]
    health_score: int
    reason: Optional[str]


class ApplicationResult(BaseModel):
    application_id: str
    company: str
    job_title: str
    status: str
    resume_path: str
    cover_letter: str
    tailoring_score: int


# ============================================================================
# API Endpoints
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Initialize browser automation on startup."""
    global applicant
    applicant = StealthJobApplicant(headless=False)
    await applicant.initialize()
    print("✅ Browser automation initialized")


@app.on_event("shutdown")
async def shutdown_event():
    """Clean up browser on shutdown."""
    if applicant:
        await applicant.close()
    print("✅ Browser closed")


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "StreamlineRemote API",
        "version": "1.0.0"
    }


@app.post("/api/master-resume")
async def upload_master_resume(data: MasterResumeData):
    """Upload or update master resume."""
    global master_resume
    
    master_resume = data.dict()
    
    # Save to disk
    resume_path = Path("resumes/master/master_resume.json")
    resume_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(resume_path, 'w') as f:
        json.dump(master_resume, f, indent=2)
    
    return {
        "message": "Master resume uploaded successfully",
        "version": data.version
    }


@app.get("/api/master-resume")
async def get_master_resume():
    """Get current master resume."""
    if not master_resume:
        # Try to load from disk
        resume_path = Path("resumes/master/master_resume.json")
        if resume_path.exists():
            with open(resume_path, 'r') as f:
                return json.load(f)
        raise HTTPException(status_code=404, detail="Master resume not found")
    
    return master_resume


@app.get("/api/pulse-status", response_model=PulseStatus)
async def get_pulse_status():
    """Get current human emulation pulse status."""
    status = human_emulator.get_pulse_status()
    return PulseStatus(**status)


@app.post("/api/reset-batch")
async def reset_batch():
    """Reset batch counter after human approval."""
    human_emulator.reset_batch()
    return {"message": "Batch reset successfully"}


@app.post("/api/tailor-resume")
async def tailor_resume(job: JobData):
    """
    Tailor resume for a specific job.
    Returns tailored resume and cover letter.
    """
    if not master_resume:
        raise HTTPException(status_code=400, detail="Master resume not uploaded")
    
    # Tailor resume
    tailored = resume_tailor.tailor_resume(
        master_resume,
        job.dict()
    )
    
    # Generate cover letter
    cover_letter = resume_tailor.generate_cover_letter(
        tailored,
        job.dict()
    )
    
    # Save tailored version
    job_hash = resume_tailor.generate_job_hash(job.dict())
    output_path = Path(f"resumes/tailored/resume_{job.company}_{job_hash}.json")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w') as f:
        json.dump(tailored, f, indent=2)
    
    # Track in database
    version_id = db.add_resume_version({
        'job_hash': job_hash,
        'base_resume': master_resume['version'],
        'company': job.company,
        'title': job.title,
        'file_path': str(output_path)
    })
    
    return {
        "tailored_resume": tailored,
        "cover_letter": cover_letter,
        "version_id": version_id,
        "file_path": str(output_path)
    }


@app.post("/api/submit-application", response_model=ApplicationResult)
async def submit_application(
    request: ApplicationRequest,
    background_tasks: BackgroundTasks
):
    """
    Submit job application.
    Can run in background if auto_submit is True.
    """
    
    # Check if we can proceed
    can_proceed, reason = human_emulator.can_proceed()
    if not can_proceed:
        raise HTTPException(status_code=429, detail=reason)
    
    # First tailor the resume
    tailored_response = await tailor_resume(request.job)
    
    # Create application record
    app_id = db.add_application({
        'company': request.job.company,
        'job_title': request.job.title,
        'job_url': request.job.url,
        'location': request.job.location,
        'resume_version': tailored_response['version_id'],
        'resume_path': tailored_response['file_path'],
        'cover_letter_used': True,
        'tailoring_score': tailored_response['tailored_resume']['metadata'].get('alignment_score', 85),
        'key_matches': tailored_response['tailored_resume']['metadata'].get('key_matches', []),
        'notes': f"Auto-submitted via StreamlineRemote"
    })
    
    if request.auto_submit:
        # Submit in background
        background_tasks.add_task(
            submit_application_async,
            request.job.dict(),
            tailored_response['file_path'],
            tailored_response['cover_letter']
        )
        
        return ApplicationResult(
            application_id=app_id,
            company=request.job.company,
            job_title=request.job.title,
            status='submitting',
            resume_path=tailored_response['file_path'],
            cover_letter=tailored_response['cover_letter'],
            tailoring_score=tailored_response['tailored_resume']['metadata'].get('alignment_score', 85)
        )
    
    return ApplicationResult(
        application_id=app_id,
        company=request.job.company,
        job_title=request.job.title,
        status='ready',
        resume_path=tailored_response['file_path'],
        cover_letter=tailored_response['cover_letter'],
        tailoring_score=tailored_response['tailored_resume']['metadata'].get('alignment_score', 85)
    )


async def submit_application_async(job_data: Dict, resume_path: str, cover_letter: str):
    """Background task for submitting application."""
    try:
        success = await applicant.apply_to_job(
            job_data,
            resume_path,
            cover_letter
        )
        
        # Update database
        if success:
            print(f"✅ Successfully applied to {job_data['company']}")
        else:
            print(f"❌ Failed to apply to {job_data['company']}")
            
    except Exception as e:
        print(f"Error in background submission: {str(e)}")


@app.get("/api/applications")
async def get_applications(status: Optional[str] = None, limit: int = 50):
    """Get list of applications with optional status filter."""
    
    if status:
        apps = db.get_applications_by_status(status)
    else:
        apps = db.df.head(limit)
    
    return apps.to_dict(orient='records')


@app.get("/api/statistics")
async def get_statistics():
    """Get application statistics."""
    return db.get_summary_stats()


@app.post("/api/applications/{app_id}/status")
async def update_application_status(
    app_id: str,
    status: str,
    notes: Optional[str] = None
):
    """Update application status."""
    db.update_status(app_id, status, notes or "")
    return {"message": f"Status updated to {status}"}


@app.get("/api/resume/{version_id}")
async def get_resume_version(version_id: str):
    """Download specific resume version."""
    
    # Find resume in database
    versions_df = pd.read_excel(db.db_path, sheet_name='Resume_Versions')
    version = versions_df[versions_df['Version_ID'] == version_id]
    
    if version.empty:
        raise HTTPException(status_code=404, detail="Resume version not found")
    
    file_path = Path(version.iloc[0]['File_Path'])
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Resume file not found")
    
    return FileResponse(
        file_path,
        media_type='application/json',
        filename=f"{version_id}.json"
    )


@app.post("/api/health-check")
async def health_check():
    """Check system health and browser status."""
    
    browser_status = "connected" if applicant and applicant.browser else "disconnected"
    
    return {
        "api": "healthy",
        "browser": browser_status,
        "database": "connected",
        "emulator": {
            "status": human_emulator.get_pulse_status()['status'],
            "health_score": human_emulator.get_pulse_status()['health_score']
        }
    }


# ============================================================================
# WebSocket for Real-time Updates (Optional Enhancement)
# ============================================================================

from fastapi import WebSocket

@app.websocket("/ws/pulse")
async def websocket_pulse(websocket: WebSocket):
    """WebSocket endpoint for real-time pulse status updates."""
    await websocket.accept()
    
    try:
        while True:
            status = human_emulator.get_pulse_status()
            await websocket.send_json(status)
            await asyncio.sleep(2)  # Update every 2 seconds
    except Exception as e:
        print(f"WebSocket error: {str(e)}")
    finally:
        await websocket.close()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "api_server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
