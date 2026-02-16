import React, { useState, useEffect } from 'react';
import './App.css';

// Human Pulse Indicator Component
const HumanPulseIndicator = ({ status, batchProgress, healthScore, cooldownRemaining }) => {
  const getStatusColor = () => {
    switch(status) {
      case 'active': return '#34C759';
      case 'cooldown': return '#FF9500';
      case 'waiting_approval': return '#FF3B30';
      default: return '#8E8E93';
    }
  };

  const getStatusIcon = () => {
    switch(status) {
      case 'active': return '✓';
      case 'cooldown': return '⏸';
      case 'waiting_approval': return '✋';
      default: return '●';
    }
  };

  return (
    <div className="pulse-container">
      <div className="pulse-header">
        <div className="pulse-icon" style={{ backgroundColor: getStatusColor() }}>
          <span>{getStatusIcon()}</span>
        </div>
        <div className="pulse-info">
          <h3 className="pulse-title">Human Pulse</h3>
          <p className="pulse-status">{status.replace('_', ' ').toUpperCase()}</p>
        </div>
      </div>
      
      <div className="pulse-metrics">
        <div className="metric">
          <span className="metric-label">Batch</span>
          <span className="metric-value">{batchProgress}</span>
        </div>
        <div className="metric">
          <span className="metric-label">Health</span>
          <span className="metric-value">{healthScore}/100</span>
        </div>
        {cooldownRemaining > 0 && (
          <div className="metric">
            <span className="metric-label">Cooldown</span>
            <span className="metric-value">{Math.floor(cooldownRemaining / 60)}m {cooldownRemaining % 60}s</span>
          </div>
        )}
      </div>

      {/* Health Score Visual */}
      <div className="health-bar">
        <div 
          className="health-fill" 
          style={{ 
            width: `${healthScore}%`,
            backgroundColor: healthScore > 70 ? '#34C759' : healthScore > 40 ? '#FF9500' : '#FF3B30'
          }}
        />
      </div>
    </div>
  );
};

// Tailoring Progress Component
const TailoringProgress = ({ progress, currentStep, totalSteps }) => {
  const steps = [
    'Analyzing JD',
    'Mapping Skills',
    'Rephrasing Bullets',
    'Generating Cover Letter',
    'Creating PDF'
  ];

  return (
    <div className="tailoring-progress">
      <h4>Tailoring Resume</h4>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="progress-text">{steps[currentStep - 1]} ({currentStep}/{totalSteps})</p>
    </div>
  );
};

// Review Panel Component
const ReviewPanel = ({ resume, coverLetter, onApprove, onEdit, onReject }) => {
  return (
    <div className="review-panel">
      <div className="review-header">
        <h3>Review Tailored Application</h3>
        <button className="close-btn" onClick={onReject}>✕</button>
      </div>

      <div className="review-content">
        {/* Resume Preview */}
        <div className="resume-section">
          <h4>Tailored Resume Highlights</h4>
          <div className="resume-bullets">
            {resume.tailored_experience?.slice(0, 1).map((exp, idx) => (
              <div key={idx} className="experience-block">
                <h5>{exp.company} - {exp.title}</h5>
                <ul>
                  {exp.bullets.slice(0, 3).map((bullet, bIdx) => (
                    <li key={bIdx}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Alignment Score */}
          <div className="alignment-score">
            <span className="score-label">JD Alignment</span>
            <span className="score-value">{resume.metadata?.alignment_score || 85}%</span>
          </div>
        </div>

        {/* Cover Letter Preview */}
        <div className="cover-letter-section">
          <h4>Generated Cover Letter</h4>
          <div className="cover-letter-preview">
            {coverLetter}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="review-actions">
        <button className="btn-secondary" onClick={onEdit}>
          Edit
        </button>
        <button className="btn-reject" onClick={onReject}>
          Skip
        </button>
        <button className="btn-primary" onClick={onApprove}>
          Approve & Submit
        </button>
      </div>
    </div>
  );
};

// Job Card Component
const JobCard = ({ job, onApply, onSkip }) => {
  return (
    <div className="job-card">
      <div className="job-header">
        <h3 className="job-title">{job.title}</h3>
        <p className="company-name">{job.company}</p>
      </div>
      
      <div className="job-meta">
        <span className="location">{job.location || 'Remote'}</span>
        <span className="posted">{job.posted_date || 'Recently'}</span>
      </div>

      {job.key_requirements && (
        <div className="requirements">
          {job.key_requirements.slice(0, 4).map((req, idx) => (
            <span key={idx} className="requirement-tag">{req}</span>
          ))}
        </div>
      )}

      <div className="job-actions">
        <button className="btn-text" onClick={onSkip}>Skip</button>
        <button className="btn-primary" onClick={onApply}>Review & Apply</button>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [jobs, setJobs] = useState([]);
  const [pulseStatus, setPulseStatus] = useState({
    status: 'active',
    batchProgress: '0/3',
    healthScore: 100,
    cooldownRemaining: 0
  });
  const [isTailoring, setIsTailoring] = useState(false);
  const [tailoringProgress, setTailoringProgress] = useState({ progress: 0, currentStep: 0, totalSteps: 5 });
  const [showReview, setShowReview] = useState(false);
  const [currentReview, setCurrentReview] = useState({ resume: {}, coverLetter: '' });
  const [applicationStats, setApplicationStats] = useState({
    total: 0,
    thisWeek: 0,
    responseRate: '0%',
    interviewRate: '0%'
  });

  // Mock API calls
  useEffect(() => {
    // Load initial data
    fetchJobs();
    fetchPulseStatus();
    fetchStats();

    // Poll pulse status every 5 seconds
    const interval = setInterval(fetchPulseStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchJobs = async () => {
    // Mock job data
    setJobs([
      {
        id: 1,
        company: 'Anthropic',
        title: 'Senior Backend Engineer',
        location: 'Remote',
        posted_date: '2 days ago',
        key_requirements: ['Python', 'FastAPI', 'PostgreSQL', 'AWS'],
        jd: 'Full JD text here...'
      },
      {
        id: 2,
        company: 'OpenAI',
        title: 'ML Infrastructure Engineer',
        location: 'San Francisco, CA',
        posted_date: '1 week ago',
        key_requirements: ['Python', 'Kubernetes', 'TensorFlow', 'Distributed Systems'],
        jd: 'Full JD text here...'
      }
    ]);
  };

  const fetchPulseStatus = async () => {
    // Mock API call
    // const response = await fetch('/api/pulse-status');
    // const data = await response.json();
    // setPulseStatus(data);
  };

  const fetchStats = async () => {
    // Mock stats
    setApplicationStats({
      total: 24,
      thisWeek: 8,
      responseRate: '12.5%',
      interviewRate: '8.3%'
    });
  };

  const handleApply = async (job) => {
    // Start tailoring process
    setIsTailoring(true);
    setTailoringProgress({ progress: 0, currentStep: 1, totalSteps: 5 });

    // Simulate tailoring steps
    for (let step = 1; step <= 5; step++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setTailoringProgress({
        progress: (step / 5) * 100,
        currentStep: step,
        totalSteps: 5
      });
    }

    // Show review panel
    setIsTailoring(false);
    setCurrentReview({
      resume: {
        tailored_experience: [
          {
            company: 'Previous Company',
            title: 'Software Engineer',
            bullets: [
              'Designed and implemented RESTful APIs serving 1M+ requests/day using Python and FastAPI',
              'Reduced database query latency by 60% through PostgreSQL optimization and indexing strategies',
              'Led migration to AWS infrastructure, reducing hosting costs by 40%'
            ]
          }
        ],
        metadata: {
          alignment_score: 87,
          company: job.company
        }
      },
      coverLetter: `I noticed ${job.company}'s opening for ${job.title} and was particularly drawn to your focus on building scalable backend systems. At my current role, I've built APIs that handle over 1 million requests daily while maintaining sub-100ms response times. I'd love to discuss how my experience with Python and FastAPI could contribute to your team's goals.`
    });
    setShowReview(true);
  };

  const handleApprove = async () => {
    // Submit application
    setShowReview(false);
    // Call backend API to submit
    // await fetch('/api/submit-application', { method: 'POST', body: ... });
    
    // Refresh data
    fetchPulseStatus();
    fetchStats();
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1 className="app-title">StreamlineRemote</h1>
        <p className="app-subtitle">AI-Powered Job Search Automation</p>
      </header>

      {/* Dashboard */}
      <div className="dashboard">
        <div className="sidebar">
          {/* Human Pulse Widget */}
          <HumanPulseIndicator {...pulseStatus} />

          {/* Stats */}
          <div className="stats-card">
            <h4>Application Stats</h4>
            <div className="stat">
              <span className="stat-label">Total Applications</span>
              <span className="stat-value">{applicationStats.total}</span>
            </div>
            <div className="stat">
              <span className="stat-label">This Week</span>
              <span className="stat-value">{applicationStats.thisWeek}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Response Rate</span>
              <span className="stat-value">{applicationStats.responseRate}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Interview Rate</span>
              <span className="stat-value">{applicationStats.interviewRate}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Tailoring Progress Overlay */}
          {isTailoring && (
            <div className="tailoring-overlay">
              <TailoringProgress {...tailoringProgress} />
            </div>
          )}

          {/* Review Panel */}
          {showReview && (
            <div className="review-overlay">
              <ReviewPanel
                resume={currentReview.resume}
                coverLetter={currentReview.coverLetter}
                onApprove={handleApprove}
                onEdit={() => alert('Edit functionality coming soon!')}
                onReject={() => setShowReview(false)}
              />
            </div>
          )}

          {/* Job List */}
          <div className="jobs-container">
            <h2 className="section-title">Available Opportunities</h2>
            <div className="jobs-grid">
              {jobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApply={() => handleApply(job)}
                  onSkip={() => console.log('Skipped', job.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
