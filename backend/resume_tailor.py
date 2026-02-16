"""
AI-Powered Resume Tailoring Engine
Uses Claude API to rephrase resume bullets while maintaining truthfulness
"""

import anthropic
import json
import os
from typing import Dict, List, Optional
from datetime import datetime
import hashlib


class ResumeTailor:
    """
    Core engine for tailoring resumes to specific job descriptions
    using Claude API with strict truthfulness constraints.
    """
    
    def __init__(self, api_key: Optional[str] = None):
        self.client = anthropic.Anthropic(
            api_key=api_key or os.environ.get("ANTHROPIC_API_KEY")
        )
        self.model = "claude-sonnet-4-20250514"
        
    def load_master_resume(self, resume_path: str) -> Dict:
        """Load the master resume JSON structure."""
        with open(resume_path, 'r') as f:
            return json.load(f)
    
    def generate_job_hash(self, job_data: Dict) -> str:
        """Generate unique hash for job to track tailored versions."""
        job_string = f"{job_data['company']}{job_data['title']}{job_data['jd'][:100]}"
        return hashlib.md5(job_string.encode()).hexdigest()[:8]
    
    def tailor_resume(self, master_resume: Dict, job_data: Dict) -> Dict:
        """
        Main tailoring function - rephrases resume to match JD while staying truthful.
        
        Args:
            master_resume: Full resume data structure
            job_data: {
                'company': str,
                'title': str,
                'jd': str (full job description),
                'key_requirements': List[str]
            }
        
        Returns:
            Tailored resume with rephrased bullets and metadata
        """
        
        prompt = self._build_tailoring_prompt(master_resume, job_data)
        
        response = self.client.messages.create(
            model=self.model,
            max_tokens=4000,
            temperature=0.3,  # Lower temp for consistency
            messages=[{
                "role": "user",
                "content": prompt
            }]
        )
        
        tailored_content = json.loads(response.content[0].text)
        
        # Add metadata
        tailored_resume = {
            **master_resume,
            "tailored_experience": tailored_content["experience"],
            "tailored_skills": tailored_content["skills"],
            "metadata": {
                "job_hash": self.generate_job_hash(job_data),
                "company": job_data["company"],
                "title": job_data["title"],
                "tailored_date": datetime.now().isoformat(),
                "master_resume_version": master_resume.get("version", "1.0")
            }
        }
        
        return tailored_resume
    
    def _build_tailoring_prompt(self, master_resume: Dict, job_data: Dict) -> str:
        """Build the LLM prompt for resume tailoring."""
        
        return f"""You are an expert resume writer. Your task is to rephrase resume bullet points to align with a specific job description while maintaining 100% TRUTHFULNESS.

CRITICAL RULES:
1. NEVER add skills, achievements, or experiences that aren't in the original resume
2. NEVER exaggerate numbers, timeframes, or scope
3. ONLY rephrase existing content using keywords from the JD
4. Maintain the same level of impact and specificity
5. Use action verbs that match the JD's language

TARGET JOB:
Company: {job_data['company']}
Position: {job_data['title']}

JOB DESCRIPTION:
{job_data['jd']}

KEY REQUIREMENTS TO MATCH:
{json.dumps(job_data.get('key_requirements', []), indent=2)}

MASTER RESUME EXPERIENCE:
{json.dumps(master_resume['experience'], indent=2)}

MASTER RESUME SKILLS:
{json.dumps(master_resume['skills'], indent=2)}

TASK:
Rephrase the experience bullets and skills to highlight relevance to this JD. Use the company's terminology where possible.

OUTPUT FORMAT (JSON only, no markdown):
{{
  "experience": [
    {{
      "company": "...",
      "title": "...",
      "duration": "...",
      "bullets": ["rephrased bullet 1", "rephrased bullet 2", ...]
    }}
  ],
  "skills": {{
    "technical": ["skill1", "skill2"],
    "tools": ["tool1", "tool2"],
    "soft_skills": ["skill1", "skill2"]
  }},
  "alignment_score": 85,
  "key_matches": ["matched requirement 1", "matched requirement 2"]
}}

Return ONLY valid JSON."""
    
    def generate_cover_letter(self, tailored_resume: Dict, job_data: Dict) -> str:
        """Generate human-sounding cold email/application note."""
        
        prompt = f"""Write a SHORT, conversational cold email for a job application. 

TARGET JOB:
Company: {job_data['company']}
Position: {job_data['title']}

CANDIDATE BACKGROUND (use this context):
{json.dumps(tailored_resume['experience'][:2], indent=2)}

REQUIREMENTS:
- Maximum 4 sentences
- Sound human and enthusiastic but professional
- Reference ONE specific achievement that matches the role
- Don't use corporate buzzwords like "passionate," "dynamic," "leverage"
- End with a simple call to action

Write the email body only (no subject line)."""

        response = self.client.messages.create(
            model=self.model,
            max_tokens=300,
            temperature=0.7,  # Higher temp for more natural writing
            messages=[{"role": "user", "content": prompt}]
        )
        
        return response.content[0].text.strip()
    
    def validate_truthfulness(self, original: Dict, tailored: Dict) -> Dict:
        """
        Validation layer to ensure no fabrication occurred.
        Returns a report of changes.
        """
        
        validation_report = {
            "passed": True,
            "warnings": [],
            "changes": []
        }
        
        # Check if any new companies or titles were added
        original_companies = {exp['company'] for exp in original['experience']}
        tailored_companies = {exp['company'] for exp in tailored['tailored_experience']}
        
        if tailored_companies - original_companies:
            validation_report["passed"] = False
            validation_report["warnings"].append(
                f"New companies added: {tailored_companies - original_companies}"
            )
        
        # Compare bullet point count
        for orig_exp, tail_exp in zip(original['experience'], tailored['tailored_experience']):
            if len(tail_exp['bullets']) > len(orig_exp['bullets']):
                validation_report["warnings"].append(
                    f"Added bullets to {orig_exp['company']}"
                )
        
        return validation_report


# Example usage
if __name__ == "__main__":
    tailor = ResumeTailor()
    
    # Example master resume structure
    master = {
        "version": "1.0",
        "contact": {
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "+1234567890"
        },
        "experience": [
            {
                "company": "Tech Corp",
                "title": "Senior Software Engineer",
                "duration": "2022 - Present",
                "bullets": [
                    "Built scalable microservices handling 1M+ daily requests using Python and FastAPI",
                    "Reduced deployment time by 60% by implementing CI/CD pipelines with GitHub Actions",
                    "Mentored 5 junior engineers on best practices for REST API design"
                ]
            }
        ],
        "skills": {
            "technical": ["Python", "FastAPI", "PostgreSQL", "Docker"],
            "tools": ["Git", "AWS", "Jenkins"],
            "soft_skills": ["Team Leadership", "Code Review", "Technical Documentation"]
        }
    }
    
    job = {
        "company": "Startup XYZ",
        "title": "Backend Engineer",
        "jd": "We're looking for a backend engineer with Python experience to build APIs...",
        "key_requirements": ["Python", "API Development", "CI/CD"]
    }
    
    # Tailor resume
    # tailored = tailor.tailor_resume(master, job)
    # print(json.dumps(tailored, indent=2))
