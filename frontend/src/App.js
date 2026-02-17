import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18 }) => {
  const icons = {
    upload: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
    briefcase: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
    filter: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
    analytics: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    download: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    location: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    globe: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    clock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    linkedin: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
    indeed: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>,
    naukri: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 11.5v-3h-6v3H7v-8h2v3h6v-3h2v8h-2z"/></svg>,
    heart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    trending: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    zap: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    refresh: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  };
  return icons[name] || null;
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const JOB_SOURCES = [
  { id: 'all',           label: 'All Sources' },
  { id: 'linkedin',      label: 'LinkedIn' },
  { id: 'indeed',        label: 'Indeed' },
  { id: 'naukri',        label: 'Naukri' },
  { id: 'weworkremotely',label: 'WeWorkRemotely' },
  { id: 'remotive',      label: 'Remotive' },
  { id: 'wellfound',     label: 'Wellfound' },
  { id: 'glassdoor',     label: 'Glassdoor' },
  { id: 'angellist',     label: 'AngelList' },
];

const MOCK_JOBS = [
  { id: 1,  title: 'Senior Product Manager',        company: 'Razorpay',        location: 'Bangalore, IN',  type: 'Hybrid',          source: 'linkedin',       sourceLabel: 'LinkedIn',       salary: '₹25-35 LPA',  posted: '2h ago',  tags: ['Product', 'Fintech', 'B2B'],          match: 94, saved: false },
  { id: 2,  title: 'Product Specialist - Payroll',  company: 'Zoho Payroll',    location: 'Chennai, IN',    type: 'Remote',          source: 'naukri',         sourceLabel: 'Naukri',         salary: '₹18-24 LPA',  posted: '5h ago',  tags: ['Payroll', 'HR Tech', 'SaaS'],         match: 91, saved: false },
  { id: 3,  title: 'Integration Engineer',          company: 'Stripe India',    location: 'Bangalore, IN',  type: 'Remote',          source: 'linkedin',       sourceLabel: 'LinkedIn',       salary: '₹30-42 LPA',  posted: '1d ago',  tags: ['API', 'Python', 'Fintech'],           match: 88, saved: true  },
  { id: 4,  title: 'Technical Account Manager',     company: 'Salesforce',      location: 'Mumbai, IN',     type: 'Work from Office',source: 'indeed',         sourceLabel: 'Indeed',         salary: '₹22-30 LPA',  posted: '2d ago',  tags: ['CRM', 'B2B', 'SaaS'],                match: 82, saved: false },
  { id: 5,  title: 'Solutions Engineer',            company: 'Freshworks',      location: 'Chennai, IN',    type: 'Remote',          source: 'naukri',         sourceLabel: 'Naukri',         salary: '₹20-28 LPA',  posted: '3d ago',  tags: ['Solutions', 'Pre-sales', 'SaaS'],    match: 79, saved: false },
  { id: 6,  title: 'Product Operations Manager',   company: 'CRED',            location: 'Bangalore, IN',  type: 'Hybrid',          source: 'linkedin',       sourceLabel: 'LinkedIn',       salary: '₹28-38 LPA',  posted: '4d ago',  tags: ['Operations', 'Fintech', 'Growth'],   match: 76, saved: false },
  { id: 7,  title: 'Remote Product Lead',           company: 'Doist',           location: 'Worldwide',      type: 'Remote',          source: 'weworkremotely', sourceLabel: 'WeWorkRemotely', salary: '$80-110K',     posted: '1h ago',  tags: ['Product', 'Remote', 'Async'],        match: 85, saved: false },
  { id: 8,  title: 'Senior Backend Engineer',       company: 'Loom',            location: 'Worldwide',      type: 'Remote',          source: 'remotive',       sourceLabel: 'Remotive',       salary: '$90-130K',     posted: '3h ago',  tags: ['Python', 'API', 'Remote'],           match: 83, saved: false },
  { id: 9,  title: 'Full Stack Developer',          company: 'Buffer',          location: 'Worldwide',      type: 'Remote',          source: 'weworkremotely', sourceLabel: 'WeWorkRemotely', salary: '$70-100K',     posted: '6h ago',  tags: ['React', 'Node', 'Remote'],           match: 77, saved: false },
  { id: 10, title: 'Growth PM',                     company: 'Groww',           location: 'Bangalore, IN',  type: 'Hybrid',          source: 'wellfound',      sourceLabel: 'Wellfound',      salary: '₹22-32 LPA',  posted: '8h ago',  tags: ['Growth', 'Product', 'Fintech'],      match: 86, saved: false },
  { id: 11, title: 'DevRel Engineer',               company: 'Postman',         location: 'Remote',         type: 'Remote',          source: 'wellfound',      sourceLabel: 'Wellfound',      salary: '$85-115K',     posted: '12h ago', tags: ['Developer Relations', 'API', 'Community'], match: 80, saved: false },
  { id: 12, title: 'Product Analyst',               company: 'PhonePe',         location: 'Bangalore, IN',  type: 'Work from Office',source: 'glassdoor',      sourceLabel: 'Glassdoor',      salary: '₹16-22 LPA',  posted: '1d ago',  tags: ['Analytics', 'Fintech', 'SQL'],       match: 74, saved: false },
  { id: 13, title: 'Engineering Manager',           company: 'BrowserStack',    location: 'Mumbai, IN',     type: 'Hybrid',          source: 'glassdoor',      sourceLabel: 'Glassdoor',      salary: '₹45-65 LPA',  posted: '2d ago',  tags: ['Engineering', 'Leadership', 'SaaS'], match: 71, saved: false },
  { id: 14, title: 'Founding Product Engineer',     company: 'Stealth Startup', location: 'Remote',         type: 'Remote',          source: 'angellist',      sourceLabel: 'AngelList',      salary: '$70-100K + Equity', posted: '2d ago', tags: ['Startup', 'Product', 'Equity'], match: 78, saved: false },
  { id: 15, title: 'Technical PM',                  company: 'Setu',            location: 'Bangalore, IN',  type: 'Hybrid',          source: 'angellist',      sourceLabel: 'AngelList',      salary: '₹20-30 LPA + ESOPs', posted: '3d ago', tags: ['Fintech', 'API', 'B2B'],     match: 89, saved: false },
];

const MOCK_APPLICATIONS = [
  { id: 'APP_001', company: 'Anthropic', title: 'Product Specialist', date: '2026-02-15', status: 'Interview', score: 92, source: 'LinkedIn' },
  { id: 'APP_002', company: 'OpenAI', title: 'Integration Engineer', date: '2026-02-14', status: 'Applied', score: 87, source: 'Indeed' },
  { id: 'APP_003', company: 'Stripe', title: 'Solutions Engineer', date: '2026-02-13', status: 'Response', score: 84, source: 'Naukri' },
  { id: 'APP_004', company: 'Razorpay', title: 'PM - Payroll', date: '2026-02-12', status: 'Applied', score: 91, source: 'LinkedIn' },
  { id: 'APP_005', company: 'Zoho', title: 'Product Manager', date: '2026-02-11', status: 'Rejected', score: 78, source: 'Naukri' },
  { id: 'APP_006', company: 'Freshworks', title: 'TAM', date: '2026-02-10', status: 'Interview', score: 89, source: 'LinkedIn' },
];

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

// NAV TAB
const NavTab = ({ id, label, icon, active, onClick, badge }) => (
  <button className={`nav-tab ${active ? 'active' : ''}`} onClick={() => onClick(id)}>
    <Icon name={icon} size={16} />
    <span>{label}</span>
    {badge && <span className="nav-badge">{badge}</span>}
  </button>
);

// SOURCE BADGE
const SOURCE_ICONS = {
  linkedin: 'linkedin', indeed: 'indeed', naukri: 'naukri',
  weworkremotely: 'globe', remotive: 'globe',
  wellfound: 'zap', glassdoor: 'briefcase', angellist: 'trending',
};

const SourceBadge = ({ source, label }) => (
  <span className={`source-badge source-${source}`}>
    <Icon name={SOURCE_ICONS[source] || 'globe'} size={12} />
    {label}
  </span>
);

// WORK TYPE BADGE
const WorkTypeBadge = ({ type }) => {
  const colors = {
    'Remote': 'badge-green',
    'Hybrid': 'badge-blue',
    'Work from Office': 'badge-orange',
  };
  return <span className={`work-badge ${colors[type] || 'badge-gray'}`}>{type}</span>;
};

// STATUS BADGE
const StatusBadge = ({ status }) => {
  const config = {
    'Applied': { cls: 'status-applied', icon: 'clock' },
    'Response': { cls: 'status-response', icon: 'zap' },
    'Interview': { cls: 'status-interview', icon: 'trending' },
    'Rejected': { cls: 'status-rejected', icon: 'x' },
  };
  const { cls, icon } = config[status] || config['Applied'];
  return (
    <span className={`status-badge ${cls}`}>
      <Icon name={icon} size={11} />
      {status}
    </span>
  );
};

// PULSE INDICATOR
const PulseIndicator = ({ status, batch, health, cooldown }) => {
  const color = status === 'active' ? '#00D084' : status === 'cooldown' ? '#FFB800' : '#FF4757';
  return (
    <div className="pulse-widget">
      <div className="pulse-top">
        <div className="pulse-dot-wrap">
          <div className="pulse-dot" style={{ background: color }} />
          <div className="pulse-ring" style={{ borderColor: color }} />
        </div>
        <div>
          <p className="pulse-label">Human Pulse</p>
          <p className="pulse-val" style={{ color }}>{status === 'waiting_approval' ? 'NEEDS APPROVAL' : status.toUpperCase()}</p>
        </div>
      </div>
      <div className="pulse-row">
        <div className="pulse-stat">
          <span className="ps-label">Batch</span>
          <span className="ps-val">{batch}/3</span>
        </div>
        <div className="pulse-stat">
          <span className="ps-label">Health</span>
          <span className="ps-val">{health}%</span>
        </div>
        {cooldown > 0 && (
          <div className="pulse-stat">
            <span className="ps-label">Cooldown</span>
            <span className="ps-val" style={{ color: '#FFB800' }}>{Math.floor(cooldown / 60)}m</span>
          </div>
        )}
      </div>
      <div className="health-track">
        <div className="health-fill" style={{ width: `${health}%`, background: health > 70 ? '#00D084' : health > 40 ? '#FFB800' : '#FF4757' }} />
      </div>
    </div>
  );
};

// JOB CARD
const JobCard = ({ job, onApply, onSave }) => {
  const [saved, setSaved] = useState(job.saved);
  const handleSave = () => { setSaved(!saved); onSave?.(job.id, !saved); };
  return (
    <div className="job-card">
      <div className="jc-top">
        <div className="jc-header">
          <div className="jc-company-logo">{job.company[0]}</div>
          <div>
            <h3 className="jc-title">{job.title}</h3>
            <p className="jc-company">{job.company}</p>
          </div>
        </div>
        <button className={`save-btn ${saved ? 'saved' : ''}`} onClick={handleSave}>
          <Icon name="heart" size={16} />
        </button>
      </div>

      <div className="jc-meta">
        <span className="jc-location"><Icon name="location" size={13} />{job.location}</span>
        <span className="jc-salary">{job.salary}</span>
      </div>

      <div className="jc-badges">
        <WorkTypeBadge type={job.type} />
        <SourceBadge source={job.source} label={job.sourceLabel} />
        <span className="jc-posted"><Icon name="clock" size={12} />{job.posted}</span>
      </div>

      <div className="jc-tags">
        {job.tags.map(t => <span key={t} className="jc-tag">{t}</span>)}
      </div>

      <div className="jc-footer">
        <div className="match-score">
          <div className="match-ring">
            <svg viewBox="0 0 36 36" className="match-svg">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e2433" strokeWidth="3"/>
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#00D084" strokeWidth="3"
                strokeDasharray={`${job.match} ${100 - job.match}`} strokeDashoffset="25" strokeLinecap="round"/>
            </svg>
            <span className="match-num">{job.match}%</span>
          </div>
          <span className="match-label">Match</span>
        </div>
        <button className="apply-btn" onClick={() => onApply(job)}>
          <Icon name="zap" size={14} /> Apply with AI
        </button>
      </div>
    </div>
  );
};

// RESUME UPLOAD PANEL
const ResumeUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleFile = (f) => {
    setFile(f);
    setTimeout(() => {
      setUploaded(true);
      onUpload?.(f);
    }, 1500);
  };

  if (uploaded && file) return (
    <div className="resume-uploaded">
      <div className="ru-icon"><Icon name="check" size={20} /></div>
      <div>
        <p className="ru-name">{file.name}</p>
        <p className="ru-size">{(file.size / 1024).toFixed(1)} KB · Resume active</p>
      </div>
      <button className="ru-change" onClick={() => { setFile(null); setUploaded(false); }}>
        <Icon name="refresh" size={14} /> Change
      </button>
    </div>
  );

  return (
    <div className={`resume-dropzone ${dragging ? 'dragging' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}>
      <input ref={inputRef} type="file" accept=".pdf,.doc,.docx,.json,.jpg,.jpeg,.png" hidden onChange={e => handleFile(e.target.files[0])} />
      {file ? (
        <div className="dz-processing">
          <div className="dz-spinner" />
          <p>Processing {file.name}…</p>
        </div>
      ) : (
        <>
          <div className="dz-icon"><Icon name="upload" size={28} /></div>
          <p className="dz-title">Upload Your Resume</p>
          <p className="dz-sub">PDF, DOC, DOCX, JPG, JPEG, PNG · Drag & drop or click</p>
        </>
      )}
    </div>
  );
};

// FILTERS PANEL
const FiltersPanel = ({ filters, onChange }) => {
  const sources = ['All', 'LinkedIn', 'Indeed', 'Naukri', 'WeWorkRemotely', 'Remotive', 'Wellfound', 'Glassdoor', 'AngelList'];
  const types = ['All', 'Remote', 'Hybrid', 'Work from Office'];
  const locations = ['All', 'Bangalore', 'Mumbai', 'Chennai', 'Delhi', 'Hyderabad', 'Worldwide'];

  return (
    <div className="filters-panel">
      <div className="fp-group">
        <label className="fp-label"><Icon name="globe" size={13} /> Source</label>
        <div className="fp-pills">
          {sources.map(s => (
            <button key={s} className={`fp-pill ${filters.source === s ? 'active' : ''}`} onClick={() => onChange({ ...filters, source: s })}>{s}</button>
          ))}
        </div>
      </div>
      <div className="fp-group">
        <label className="fp-label"><Icon name="briefcase" size={13} /> Work Type</label>
        <div className="fp-pills">
          {types.map(t => (
            <button key={t} className={`fp-pill ${filters.type === t ? 'active' : ''}`} onClick={() => onChange({ ...filters, type: t })}>{t}</button>
          ))}
        </div>
      </div>
      <div className="fp-group">
        <label className="fp-label"><Icon name="location" size={13} /> Location</label>
        <div className="fp-pills">
          {locations.map(l => (
            <button key={l} className={`fp-pill ${filters.location === l ? 'active' : ''}`} onClick={() => onChange({ ...filters, location: l })}>{l}</button>
          ))}
        </div>
      </div>
      <div className="fp-group">
        <label className="fp-label">Min Match %: <strong>{filters.minMatch}%</strong></label>
        <input type="range" min="50" max="100" value={filters.minMatch}
          onChange={e => onChange({ ...filters, minMatch: Number(e.target.value) })} className="fp-range" />
      </div>
    </div>
  );
};

// ANALYTICS PANEL
const AnalyticsPanel = ({ applications }) => {
  const total = applications.length;
  const interviews = applications.filter(a => a.status === 'Interview').length;
  const responses = applications.filter(a => a.status === 'Response' || a.status === 'Interview').length;
  const avgScore = Math.round(applications.reduce((s, a) => s + a.score, 0) / total);
  const bySource = applications.reduce((acc, a) => { acc[a.source] = (acc[a.source] || 0) + 1; return acc; }, {});
  const byStatus = applications.reduce((acc, a) => { acc[a.status] = (acc[a.status] || 0) + 1; return acc; }, {});

  const exportToCSV = () => {
    const headers = ['ID', 'Company', 'Title', 'Date', 'Status', 'Match Score', 'Source'];
    const rows = applications.map(a => [a.id, a.company, a.title, a.date, a.status, a.score + '%', a.source]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'job_applications.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="analytics-panel">
      {/* Header */}
      <div className="ap-header">
        <h2 className="ap-title">Analytics Dashboard</h2>
        <button className="export-btn" onClick={exportToCSV}>
          <Icon name="download" size={14} /> Export to Excel/CSV
        </button>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {[
          { label: 'Total Applied', value: total, icon: 'briefcase', color: '#6C63FF' },
          { label: 'Responses', value: responses, icon: 'zap', color: '#00D084' },
          { label: 'Interviews', value: interviews, icon: 'trending', color: '#FFB800' },
          { label: 'Avg Match', value: avgScore + '%', icon: 'analytics', color: '#FF6B6B' },
        ].map(k => (
          <div key={k.label} className="kpi-card" style={{ '--kpi-color': k.color }}>
            <div className="kpi-icon"><Icon name={k.icon} size={20} /></div>
            <div className="kpi-val">{k.value}</div>
            <div className="kpi-label">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        {/* By Source */}
        <div className="chart-card">
          <h4 className="chart-title">Applications by Source</h4>
          {Object.entries(bySource).map(([src, count]) => (
            <div key={src} className="bar-row">
              <span className="bar-label">{src}</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${(count / total) * 100}%` }} />
              </div>
              <span className="bar-count">{count}</span>
            </div>
          ))}
        </div>

        {/* By Status */}
        <div className="chart-card">
          <h4 className="chart-title">Status Breakdown</h4>
          {Object.entries(byStatus).map(([status, count]) => {
            const colors = { Applied: '#6C63FF', Response: '#00D084', Interview: '#FFB800', Rejected: '#FF4757' };
            return (
              <div key={status} className="bar-row">
                <span className="bar-label">{status}</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${(count / total) * 100}%`, background: colors[status] }} />
                </div>
                <span className="bar-count">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Applications Table */}
      <div className="table-card">
        <div className="table-header">
          <h4 className="chart-title">All Applications</h4>
          <span className="table-count">{total} total</span>
        </div>
        <div className="table-wrap">
          <table className="app-table">
            <thead>
              <tr>
                <th>ID</th><th>Company</th><th>Role</th><th>Date</th><th>Source</th><th>Match</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(a => (
                <tr key={a.id}>
                  <td className="td-id">{a.id}</td>
                  <td className="td-company">{a.company}</td>
                  <td>{a.title}</td>
                  <td className="td-date">{a.date}</td>
                  <td>{a.source}</td>
                  <td><span className="td-score">{a.score}%</span></td>
                  <td><StatusBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// APPLY MODAL
const ApplyModal = ({ job, onClose, onSubmit }) => {
  const [step, setStep] = useState(0);
  const [coverLetter, setCoverLetter] = useState('');
  const steps = ['Analyzing JD', 'Mapping Skills', 'Rephrasing Bullets', 'Writing Cover Letter', 'Ready to Submit'];

  useEffect(() => {
    if (step < 4) {
      const t = setTimeout(() => setStep(s => s + 1), 900);
      return () => clearTimeout(t);
    }
    if (step === 4) {
      setCoverLetter(`I came across the ${job.title} role at ${job.company} and it aligns well with my background. At RazorpayX, I managed merchant onboarding increasing adoption by 45% while implementing complex GST integrations. I'd love to bring this experience to ${job.company}'s team.`);
    }
  }, [step]);

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div>
            <h3 className="modal-title">Applying to {job.title}</h3>
            <p className="modal-sub">{job.company} · {job.location}</p>
          </div>
          <button className="modal-close" onClick={onClose}><Icon name="x" size={18} /></button>
        </div>

        {/* Progress Steps */}
        <div className="modal-steps">
          {steps.map((s, i) => (
            <div key={s} className={`ms-step ${i < step ? 'done' : i === step ? 'active' : ''}`}>
              <div className="ms-dot">{i < step ? <Icon name="check" size={10} /> : i + 1}</div>
              <span className="ms-label">{s}</span>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="modal-progress-track">
          <div className="modal-progress-fill" style={{ width: `${(step / 4) * 100}%` }} />
        </div>

        {step === 4 && (
          <>
            {/* Score */}
            <div className="modal-score-row">
              <div className="ms-score-card">
                <span className="msc-val" style={{ color: '#00D084' }}>{job.match}%</span>
                <span className="msc-label">JD Match</span>
              </div>
              <div className="ms-score-card">
                <span className="msc-val" style={{ color: '#6C63FF' }}>3</span>
                <span className="msc-label">Bullets Rephrased</span>
              </div>
              <div className="ms-score-card">
                <span className="msc-val" style={{ color: '#FFB800' }}>AI</span>
                <span className="msc-label">Cover Letter</span>
              </div>
            </div>

            {/* Cover Letter */}
            <div className="modal-cl">
              <label className="modal-cl-label">Generated Cover Letter</label>
              <textarea className="modal-cl-area" value={coverLetter} onChange={e => setCoverLetter(e.target.value)} rows={4} />
            </div>

            {/* Actions */}
            <div className="modal-actions">
              <button className="btn-skip" onClick={onClose}>Skip</button>
              <button className="btn-submit" onClick={() => { onSubmit(job); onClose(); }}>
                <Icon name="zap" size={15} /> Approve & Submit
              </button>
            </div>
          </>
        )}

        {step < 4 && (
          <div className="modal-loading">
            <div className="loading-spinner" />
            <p className="loading-text">{steps[step]}…</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState('jobs');
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ source: 'All', type: 'All', location: 'All', minMatch: 70 });
  const [applyingJob, setApplyingJob] = useState(null);
  const [applications, setApplications] = useState(MOCK_APPLICATIONS);
  const [pulse] = useState({ status: 'active', batch: 1, health: 94, cooldown: 0 });
  const [autoApply, setAutoApply] = useState(false);
  const [autoApplySpeed, setAutoApplySpeed] = useState('safe');
  const [autoApplyLog, setAutoApplyLog] = useState([]);
  const [autoApplyRunning, setAutoApplyRunning] = useState(false);
  const autoApplyRef = useRef(false);

  const filteredJobs = MOCK_JOBS.filter(j => {
    if (filters.source !== 'All' && j.sourceLabel !== filters.source) return false;
    if (filters.type !== 'All' && j.type !== filters.type) return false;
    if (filters.location !== 'All' && !j.location.includes(filters.location)) return false;
    if (j.match < filters.minMatch) return false;
    if (search && !j.title.toLowerCase().includes(search.toLowerCase()) &&
        !j.company.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleSubmitApplication = (job) => {
    const newApp = {
      id: `APP_${String(applications.length + 1).padStart(3, '0')}`,
      company: job.company, title: job.title,
      date: new Date().toISOString().split('T')[0],
      status: 'Applied', score: job.match, source: job.sourceLabel
    };
    setApplications(prev => [newApp, ...prev]);
    setActiveTab('analytics');
  };

  // ── AUTO APPLY ENGINE ─────────────────────────────────────────────────────
  const SPEED_DELAYS = { safe: 8000, normal: 4000, fast: 2000 };

  const startAutoApply = async () => {
    if (!resumeUploaded) {
      alert('⚠️ Please upload your resume first before using Auto-Apply!');
      return;
    }
    setAutoApplyRunning(true);
    autoApplyRef.current = true;
    const pending = filteredJobs.filter(
      j => !applications.find(a => a.company === j.company && a.title === j.title)
    );
    for (let i = 0; i < pending.length; i++) {
      if (!autoApplyRef.current) break;
      const job = pending[i];
      setAutoApplyLog(prev => [
        { id: Date.now() + i, company: job.company, title: job.title, status: 'applying', time: new Date().toLocaleTimeString() },
        ...prev
      ]);
      await new Promise(r => setTimeout(r, SPEED_DELAYS[autoApplySpeed]));
      if (!autoApplyRef.current) break;
      const newApp = {
        id: `APP_${String(applications.length + i + 1).padStart(3, '0')}`,
        company: job.company, title: job.title,
        date: new Date().toISOString().split('T')[0],
        status: 'Applied', score: job.match, source: job.sourceLabel
      };
      setApplications(prev => [newApp, ...prev]);
      setAutoApplyLog(prev =>
        prev.map(l => l.company === job.company && l.title === job.title ? { ...l, status: 'done' } : l)
      );
    }
    setAutoApplyRunning(false);
    autoApplyRef.current = false;
  };

  const stopAutoApply = () => {
    autoApplyRef.current = false;
    setAutoApplyRunning(false);
    setAutoApply(false);
    setAutoApplyLog([]);
  };

  return (
    <div className="app">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><Icon name="zap" size={20} /></div>
          <span className="brand-name">StreamlineRemote</span>
        </div>

        <nav className="nav">
          <NavTab id="jobs" label="Job Board" icon="briefcase" active={activeTab === 'jobs'} onClick={setActiveTab} badge={filteredJobs.length} />
          <NavTab id="resume" label="My Resume" icon="upload" active={activeTab === 'resume'} onClick={setActiveTab} badge={resumeUploaded ? '✓' : null} />
          <NavTab id="analytics" label="Analytics" icon="analytics" active={activeTab === 'analytics'} onClick={setActiveTab} badge={applications.length} />
        </nav>

        {/* AUTO APPLY TOGGLE in sidebar */}
        <div className="auto-apply-sidebar">
          <div className="aas-header">
            <div className="aas-label-row">
              <Icon name="zap" size={14} />
              <span className="aas-label">Auto-Apply</span>
              <button
                className={`aas-toggle ${autoApply ? 'on' : 'off'}`}
                onClick={() => {
                  if (autoApply) { stopAutoApply(); }
                  else { setAutoApply(true); setAutoApplyLog([]); }
                }}
              >
                <span className="aas-knob" />
              </button>
            </div>
            {autoApply && (
              <div className="aas-speed">
                {['safe','normal','fast'].map(s => (
                  <button key={s} className={`speed-btn ${autoApplySpeed === s ? 'active' : ''} speed-${s}`}
                    onClick={() => setAutoApplySpeed(s)} disabled={autoApplyRunning}>
                    {s === 'safe' ? '🐢 Safe' : s === 'normal' ? '🚶 Normal' : '⚡ Fast'}
                  </button>
                ))}
              </div>
            )}
            {autoApply && !autoApplyRunning && (
              <button className="aas-start" onClick={startAutoApply}>
                <Icon name="zap" size={13} /> Start Auto-Apply ({filteredJobs.length} jobs)
              </button>
            )}
            {autoApplyRunning && (
              <button className="aas-stop" onClick={stopAutoApply}>
                <Icon name="x" size={13} /> Stop
              </button>
            )}
          </div>
          {autoApplyLog.length > 0 && (
            <div className="aas-log">
              {autoApplyLog.slice(0, 5).map(l => (
                <div key={l.id} className={`aas-log-row ${l.status}`}>
                  <span className="aas-log-icon">{l.status === 'done' ? '✓' : '⋯'}</span>
                  <span className="aas-log-text">{l.company}</span>
                  <span className="aas-log-time">{l.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sidebar-bottom">
          <PulseIndicator {...pulse} />
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">
        {/* ── JOB BOARD ── */}
        {activeTab === 'jobs' && (
          <div className="page">
            <div className="page-header">
              <div>
                <h1 className="page-title">Job Board</h1>
                <p className="page-sub">AI-matched opportunities from LinkedIn, Indeed & Naukri</p>
              </div>
              <div className="page-actions">
                <div className="search-box">
                  <Icon name="search" size={16} />
                  <input placeholder="Search jobs or companies…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <button className={`filter-toggle ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}>
                  <Icon name="filter" size={15} /> Filters
                </button>
              </div>
            </div>

            {showFilters && <FiltersPanel filters={filters} onChange={setFilters} />}

            <div className="jobs-grid">
              {filteredJobs.length === 0 ? (
                <div className="empty-state">
                  <Icon name="search" size={40} />
                  <p>No jobs match your filters</p>
                  <button onClick={() => setFilters({ source: 'All', type: 'All', location: 'All', minMatch: 70 })}>Reset Filters</button>
                </div>
              ) : filteredJobs.map(job => (
                <JobCard key={job.id} job={job} onApply={setApplyingJob} />
              ))}
            </div>
          </div>
        )}

        {/* ── RESUME ── */}
        {activeTab === 'resume' && (
          <div className="page">
            <div className="page-header">
              <div>
                <h1 className="page-title">My Resume</h1>
                <p className="page-sub">Upload your resume — AI will tailor it for each application</p>
              </div>
            </div>
            <div className="resume-page">
              <div className="resume-upload-section">
                <h3 className="section-label">Master Resume</h3>
                <ResumeUpload onUpload={() => setResumeUploaded(true)} />
                {resumeUploaded && (
                  <div className="resume-info-cards">
                    <div className="ric">
                      <Icon name="check" size={16} />
                      <div><p className="ric-title">AI Ready</p><p className="ric-sub">Resume processed and indexed</p></div>
                    </div>
                    <div className="ric">
                      <Icon name="zap" size={16} />
                      <div><p className="ric-title">Auto-Tailor Active</p><p className="ric-sub">Will rephrase for each job</p></div>
                    </div>
                    <div className="ric">
                      <Icon name="analytics" size={16} />
                      <div><p className="ric-title">Skills Extracted</p><p className="ric-sub">12 skills detected</p></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="resume-tips">
                <h3 className="section-label">Tips for Best Results</h3>
                {[
                  ['Use metrics', 'Add numbers to achievements: "increased X by 40%"'],
                  ['Action verbs', 'Start bullets with Led, Built, Managed, Implemented'],
                  ['Keep it concise', '1-2 pages max for best AI parsing'],
                  ['PDF format', 'Upload as PDF for best compatibility'],
                ].map(([t, d]) => (
                  <div key={t} className="tip-row">
                    <div className="tip-dot" />
                    <div><p className="tip-title">{t}</p><p className="tip-desc">{d}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ANALYTICS ── */}
        {activeTab === 'analytics' && (
          <div className="page">
            <AnalyticsPanel applications={applications} />
          </div>
        )}
      </main>

      {/* APPLY MODAL */}
      {applyingJob && (
        <ApplyModal
          job={applyingJob}
          onClose={() => setApplyingJob(null)}
          onSubmit={handleSubmitApplication}
        />
      )}
    </div>
  );
}
