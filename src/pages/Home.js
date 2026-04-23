import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TeamLayout.css';
import '../styles/TrainingDashboard.css';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const FILE_ICONS = { pdf:'📄', ppt:'📊', pptx:'📊', doc:'📝', docx:'📝', video:'🎥', mp4:'🎥' };

export default function Home() {
  const navigate = useNavigate();

  // nav: 'tests' | 'support' | 'deployment'
  const [activeNav,      setActiveNav]     = useState('tests');
  const [trainingOpen,   setTrainingOpen]  = useState(false);

  // Drill-down level: 0=categories, 1=content list, 2=viewer
  const [drillLevel,     setDrillLevel]    = useState(0);

  // Tests
  const [tests,          setTests]         = useState([]);
  const [testsLoading,   setTestsLoading]  = useState(true);

  // Training data
  const [categories,     setCategories]    = useState([]);
  const [catsLoading,    setCatsLoading]   = useState(false);
  const [selectedCat,    setSelectedCat]   = useState(null);

  const [modules,        setModules]       = useState([]);
  const [modsLoading,    setModsLoading]   = useState(false);
  const [selectedModule, setSelectedModule]= useState(null);

  const [filterDate,     setFilterDate]    = useState('');

  // Load tests once
  useEffect(() => {
    fetch(`${BASE}/api/public/tests`)
      .then(r => r.json())
      .then(d => setTests(d.data || []))
      .catch(() => {})
      .finally(() => setTestsLoading(false));
  }, []);

  // Load categories when training nav selected
  useEffect(() => {
    if (activeNav !== 'support' && activeNav !== 'deployment') return;
    setCategories([]);
    setSelectedCat(null);
    setModules([]);
    setSelectedModule(null);
    setFilterDate('');
    setDrillLevel(0);
    setCatsLoading(true);

    const type = activeNav === 'support' ? 'wati_training' : 'new_deployment';
    fetch(`${BASE}/api/public/categories`)
      .then(r => r.json())
      .then(d => setCategories((d.data || []).filter(c => c.type === type)))
      .catch(() => {})
      .finally(() => setCatsLoading(false));
  }, [activeNav]); // eslint-disable-line

  // Step 1→2: Select category → load its modules, show content list
  function handleSelectCategory(cat) {
    setSelectedCat(cat);
    setSelectedModule(null);
    setModules([]);
    setFilterDate('');
    setModsLoading(true);
    setDrillLevel(1);

    fetch(`${BASE}/api/public/categories/${cat._id}/modules`)
      .then(r => r.json())
      .then(d => setModules(d.data || []))
      .catch(() => {})
      .finally(() => setModsLoading(false));
  }

  // Step 2→3: Select module → show viewer
  function handleSelectModule(mod) {
    setSelectedModule(mod);
    setDrillLevel(2);
  }

  // Back handlers
  function goBack() {
    if (drillLevel === 2) {
      setDrillLevel(1);
      setSelectedModule(null);
    } else if (drillLevel === 1) {
      setDrillLevel(0);
      setSelectedCat(null);
      setModules([]);
    }
  }

  // Group by demoDate for New Deployment
  function groupByDemoDate(mods) {
    const groups = {};
    mods.forEach(m => {
      const key = m.demoDate
        ? new Date(m.demoDate).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
        : 'No Date Set';
      if (!groups[key]) groups[key] = [];
      groups[key].push(m);
    });
    return Object.entries(groups).sort(([a],[b]) => {
      if (a === 'No Date Set') return 1;
      if (b === 'No Date Set') return -1;
      return new Date(b) - new Date(a);
    });
  }

  const deploymentGroups  = groupByDemoDate(modules);
  const filteredGroups    = filterDate === 'latest' ? deploymentGroups.slice(0,1) : deploymentGroups;

  // Breadcrumb label
  const navLabel = activeNav === 'support' ? 'Support Training' : 'New Deployment';

  return (
    <div className="team-shell">

      {/* ── NAV SIDEBAR ── */}
      <aside className="team-sidebar">
        <div className="team-sidebar-logo">
          <div className="team-sidebar-logo-icon">⬡</div>
          <div>
            <div className="team-sidebar-logo-text">Habuild</div>
            <div className="team-sidebar-logo-sub">Training Portal</div>
          </div>
        </div>
        <nav className="team-nav">
          <button
            className={`team-nav-item ${activeNav==='tests'?'active':''}`}
            onClick={() => { setActiveNav('tests'); setTrainingOpen(false); }}
          >
            <span className="team-nav-icon">✓</span>
            <span className="team-nav-label">Tests</span>
          </button>
          <button
            className={`team-nav-item ${(activeNav==='support'||activeNav==='deployment')?'active':''}`}
            onClick={() => setTrainingOpen(o => !o)}
          >
            <span className="team-nav-icon">▦</span>
            <span className="team-nav-label">Training Modules</span>
            <span style={{marginLeft:'auto',fontSize:10,opacity:.6}}>{trainingOpen?'▾':'▸'}</span>
          </button>
          {trainingOpen && (
            <div className="team-sidebar-sub-menu">
              <button
                className={`sub-menu-item ${activeNav==='support'?'active':''}`}
                onClick={() => setActiveNav('support')}
              >
                <span className="sub-icon">▦</span>
                <span>Support Training</span>
              </button>
              <button
                className={`sub-menu-item ${activeNav==='deployment'?'active':''}`}
                onClick={() => setActiveNav('deployment')}
              >
                <span className="sub-icon">◈</span>
                <span>New Deployment</span>
              </button>
            </div>
          )}
        </nav>
        <div className="team-nav" style={{marginTop:'auto',paddingTop:16,borderTop:'1px solid rgba(255,255,255,0.08)'}}>
          <a href="/admin/login" className="team-nav-item" style={{textDecoration:'none'}}>
            <span className="team-nav-icon">⚙</span>
            <span className="team-nav-label">Admin</span>
          </a>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="team-main">

        {/* ── TESTS ── */}
        {activeNav === 'tests' && (
          <>
            <div className="team-topbar"><span className="team-topbar-title">Tests</span></div>
            <div className="team-content">
              <div className="team-page-heading">
                <h2>Available Tests</h2>
                <p>Select a test below to begin your assessment</p>
              </div>
              {testsLoading ? (
                <div className="team-cards-grid">{[1,2,3].map(i=><div key={i} className="team-shimmer"/>)}</div>
              ) : tests.length === 0 ? (
                <div className="team-empty">
                  <div className="team-empty-icon">📋</div>
                  <h3>No tests available</h3>
                  <p>No active tests right now. Check back later.</p>
                </div>
              ) : (
                <div className="team-cards-grid">
                  {tests.map(test => (
                    <div key={test._id} className="team-test-card">
                      <div className="team-test-card-stripe"/>
                      <div className="team-test-card-body">
                        <div className="team-test-card-head">
                          <div className="team-test-icon">📋</div>
                          <span className="team-badge-active">Active</span>
                        </div>
                        <h3 className="team-test-card-title">{test.title}</h3>
                        <p className="team-test-card-desc">{test.description||'Click Start Test to begin.'}</p>
                        <div className="team-test-stats">
                          <div className="team-stat"><span className="team-stat-val">{test.timeLimit}</span><span className="team-stat-label">Minutes</span></div>
                          <div className="team-stat"><span className="team-stat-val">{test.totalMarks}</span><span className="team-stat-label">Marks</span></div>
                          <div className="team-stat"><span className="team-stat-val">{test.passingMarks}</span><span className="team-stat-label">Pass</span></div>
                        </div>
                      </div>
                      <div className="team-test-card-footer">
                        <button className="team-start-btn" onClick={()=>navigate(`/test-gate?testId=${test._id}`)}>Start Test →</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ── TRAINING DRILL-DOWN ── */}
        {(activeNav==='support'||activeNav==='deployment') && (
          <div className="td-drill-shell">

            {/* Topbar with breadcrumb */}
            <div className="team-topbar">
              {drillLevel > 0 && (
                <button className="td-topbar-back" onClick={goBack}>←</button>
              )}
              <span className="team-topbar-title">
                {drillLevel === 0 && navLabel}
                {drillLevel === 1 && <><span className="td-breadcrumb">{navLabel} /</span> {selectedCat?.name}</>}
                {drillLevel === 2 && <><span className="td-breadcrumb">{selectedCat?.name} /</span> {selectedModule?.title}</>}
              </span>
            </div>

            {/* ── LEVEL 0: Category Grid ── */}
            {drillLevel === 0 && (
              <div className="td-content-scroll">
                {catsLoading ? (
                  <div className="td-cat-grid">{[1,2,3,4,5,6].map(i=><div key={i} className="td-cat-shimmer"/>)}</div>
                ) : categories.length === 0 ? (
                  <div className="team-empty">
                    <div className="team-empty-icon">📂</div>
                    <h3>No modules available</h3>
                    <p>Check back later or contact your admin.</p>
                  </div>
                ) : (
                  <div className="td-cat-grid">
                    {categories.map(cat => (
                      <button key={cat._id} className="td-cat-card" onClick={()=>handleSelectCategory(cat)}>
                        <div className="td-cat-card-icon">▦</div>
                        <div className="td-cat-card-name">{cat.name}</div>
                        <div className="td-cat-card-arrow">View content →</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── LEVEL 1: Content List ── */}
            {drillLevel === 1 && (
              <div className="td-content-scroll">
                {/* Filter for New Deployment */}
                {activeNav==='deployment' && modules.length>0 && (
                  <div className="td-filter-bar">
                    <button className={`td-filter-btn ${filterDate===''?'active':''}`} onClick={()=>setFilterDate('')}>All</button>
                    <button className={`td-filter-btn ${filterDate==='latest'?'active':''}`} onClick={()=>setFilterDate('latest')}>Latest</button>
                  </div>
                )}

                {modsLoading ? (
                  <div className="td-mod-grid">{[1,2,3].map(i=><div key={i} className="td-mod-shimmer"/>)}</div>
                ) : modules.length===0 ? (
                  <div className="team-empty">
                    <div className="team-empty-icon">📄</div>
                    <h3>No content in {selectedCat?.name}</h3>
                    <p>Admin hasn't added any active content here yet.</p>
                  </div>
                ) : activeNav==='deployment' ? (
                  // Grouped by date
                  filteredGroups.map(([date, mods]) => (
                    <div key={date}>
                      <div className="td-date-header">📅 {date}</div>
                      <div className="td-mod-grid">
                        {mods.map(mod => <ModCard key={mod._id} mod={mod} onClick={()=>handleSelectModule(mod)}/>)}
                      </div>
                    </div>
                  ))
                ) : (
                  // Flat grid for Support Training
                  <div className="td-mod-grid">
                    {modules.map(mod => <ModCard key={mod._id} mod={mod} onClick={()=>handleSelectModule(mod)}/>)}
                  </div>
                )}
              </div>
            )}

            {/* ── LEVEL 2: Content Viewer ── */}
            {drillLevel === 2 && selectedModule && (
              <div className="td-content-scroll">
                <ContentViewer module={selectedModule}/>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Module card for grid ── */
function ModCard({ mod, onClick }) {
  const contentIcon = mod.contentType === 'canva' ? '🎨'
    : mod.contentType === 'drive' ? '📁'
    : mod.contentType === 'youtube' ? '🎥'
    : mod.contentType === 'link' ? '🔗'
    : null;
  const fileIcon = contentIcon || FILE_ICONS[mod.fileType?.toLowerCase()] || '📄';
  const kp  = mod.keyPoints?.length || 0;
  const faq = mod.faqs?.length || 0;
  const hasContent = mod.fileUrl || mod.contentUrl;
  const total = kp + faq + (hasContent ? 1 : 0);
  return (
    <button className="td-mod-card" onClick={onClick}>
      <div className="td-mod-card-icon">{fileIcon}</div>
      <div className="td-mod-card-body">
        <div className="td-mod-card-title">{mod.title}</div>
        {mod.description && <div className="td-mod-card-desc">{mod.description}</div>}
        <div className="td-mod-card-meta">
          {kp > 0 && <span>{kp} key points</span>}
          {faq > 0 && <span>{faq} FAQs</span>}
          {mod.fileUrl && <span>{mod.fileType?.toUpperCase()} file</span>}
          {mod.contentUrl && !mod.fileUrl && (
            <span>
              {mod.contentType === 'canva' ? 'Canva'
               : mod.contentType === 'drive' ? 'Google Drive'
               : mod.contentType === 'youtube' ? 'Video'
               : 'External Link'}
            </span>
          )}
          {total === 0 && <span className="td-no-content">No content yet</span>}
        </div>
      </div>
      <div className="td-mod-card-arrow">→</div>
    </button>
  );
}

/* ── Content viewer ── */
function ContentViewer({ module }) {
  const [openFaq, setOpenFaq] = useState(null);
  const contentIcon = module.contentType === 'canva' ? '🎨'
    : module.contentType === 'drive' ? '📁'
    : module.contentType === 'youtube' ? '🎥'
    : module.contentType === 'link' ? '🔗'
    : null;
  const fileIcon = contentIcon || FILE_ICONS[module.fileType?.toLowerCase()] || '📎';
  const badgeLabel = module.contentType === 'canva' ? 'Canva'
    : module.contentType === 'drive' ? 'Drive'
    : module.contentType === 'youtube' ? 'Video'
    : module.contentType === 'link' ? 'Link'
    : module.fileType?.toUpperCase() || 'Content';
  const kpCount  = module.keyPoints?.length || 0;
  const faqCount = module.faqs?.length || 0;

  return (
    <div className="td-viewer-page">
      <div className="td-viewer-hero">
        <div className="td-viewer-badge">{fileIcon} {badgeLabel}</div>
        <h2>{module.title}</h2>
        {module.description && <p>{module.description}</p>}
        <div className="td-viewer-chips">
          <span className={`td-stat-chip ${kpCount>0?'active':''}`}>📌 {kpCount} Key Points</span>
          <span className={`td-stat-chip ${faqCount>0?'active':''}`}>❓ {faqCount} FAQs</span>
          {module.fileUrl && <span className="td-stat-chip active">{fileIcon} File Available</span>}
          {module.contentUrl && !module.fileUrl && <span className="td-stat-chip active">{fileIcon} Content Available</span>}
        </div>
      </div>

      <div className="td-viewer-body">
        {/* External content URL (Canva, Google Drive, etc.) */}
        {module.contentUrl && (
          <div className="td-section">
            <div className="td-section-head">Training Material</div>
            <div className="td-file-row">
              <div className="td-file-info">
                <span className="td-file-icon">
                  {module.contentType === 'canva' ? '🎨' :
                   module.contentType === 'drive' ? '📁' :
                   module.contentType === 'youtube' ? '🎥' : '🔗'}
                </span>
                <div>
                  <div className="td-file-name">{module.title}</div>
                  <div className="td-file-type">
                    {module.contentType === 'canva' ? 'Canva Presentation' :
                     module.contentType === 'drive' ? 'Google Drive' :
                     module.contentType === 'youtube' ? 'Video' : 'External Link'}
                  </div>
                </div>
              </div>
              <a href={module.contentUrl} target="_blank" rel="noopener noreferrer" className="td-view-btn">
                Open →
              </a>
            </div>
          </div>
        )}
        {module.fileUrl && (
          <div className="td-section">
            <div className="td-section-head">{module.contentUrl ? 'Uploaded File' : 'Training Material'}</div>
            <div className="td-file-row">
              <div className="td-file-info">
                <span className="td-file-icon">{fileIcon}</span>
                <div>
                  <div className="td-file-name">{module.title}</div>
                  <div className="td-file-type">{module.fileType?.toUpperCase()}</div>
                </div>
              </div>
              <a href={module.fileUrl} target="_blank" rel="noopener noreferrer" className="td-view-btn">
                View / Download
              </a>
            </div>
          </div>
        )}

        <div className="td-section">
          <div className="td-section-head">Key Points</div>
          {kpCount > 0 ? (
            <ul className="td-key-points">
              {module.keyPoints.map((pt,i) => (
                <li key={i} className="td-key-point">
                  <span className="td-kp-num">{i+1}</span>
                  <span className="td-kp-text">{pt}</span>
                </li>
              ))}
            </ul>
          ) : <p className="td-empty-text">Key points will appear once content is generated.</p>}
        </div>

        <div className="td-section">
          <div className="td-section-head">FAQs</div>
          {faqCount > 0 ? (
            <div className="td-faqs">
              {module.faqs.map((faq,i) => (
                <div key={i} className={`td-faq ${openFaq===i?'open':''}`} onClick={()=>setOpenFaq(openFaq===i?null:i)}>
                  <div className="td-faq-q">
                    <span>{faq.question}</span>
                    <span className="td-faq-arrow">{openFaq===i?'▲':'▼'}</span>
                  </div>
                  {openFaq===i && <div className="td-faq-a">{faq.answer}</div>}
                </div>
              ))}
            </div>
          ) : <p className="td-empty-text">FAQs will appear once content is generated.</p>}
        </div>
      </div>
    </div>
  );
}
