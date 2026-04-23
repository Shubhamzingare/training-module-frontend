import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TeamLayout.css';
import '../styles/TrainingDashboard.css';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const FILE_ICONS = { pdf:'📄', ppt:'📊', pptx:'📊', doc:'📝', docx:'📝', video:'🎥', mp4:'🎥', canva:'🎨', drive:'📁', link:'🔗' };

export default function Home() {
  const navigate = useNavigate();

  // 'tests' | 'support' | 'deployment'
  const [activeNav,      setActiveNav]     = useState('tests');
  const [trainingOpen,   setTrainingOpen]  = useState(false);

  // Drill level: 0=categories, 1=modules, 2=content
  const [drillLevel,     setDrillLevel]    = useState(0);

  // Data
  const [tests,          setTests]         = useState([]);
  const [testsLoading,   setTestsLoading]  = useState(true);
  const [categories,     setCategories]    = useState([]);
  const [catsLoading,    setCatsLoading]   = useState(false);
  const [selectedCat,    setSelectedCat]   = useState(null);
  const [modules,        setModules]       = useState([]);
  const [modsLoading,    setModsLoading]   = useState(false);
  const [selectedModule, setSelectedModule]= useState(null);
  const [filterDate,     setFilterDate]    = useState('');

  // Load tests
  useEffect(() => {
    fetch(`${BASE}/api/public/tests`)
      .then(r => r.json())
      .then(d => setTests(d.data || []))
      .catch(() => {})
      .finally(() => setTestsLoading(false));
  }, []);

  // Load categories when training section opens
  useEffect(() => {
    if (activeNav !== 'support' && activeNav !== 'deployment') return;
    setCategories([]); setSelectedCat(null);
    setModules([]); setSelectedModule(null);
    setDrillLevel(0); setCatsLoading(true);
    const type = activeNav === 'support' ? 'wati_training' : 'new_deployment';
    fetch(`${BASE}/api/public/categories`)
      .then(r => r.json())
      .then(d => setCategories((d.data||[]).filter(c => c.type === type)))
      .catch(() => {})
      .finally(() => setCatsLoading(false));
  }, [activeNav]); // eslint-disable-line

  function selectCategory(cat) {
    setSelectedCat(cat); setSelectedModule(null);
    setModules([]); setModsLoading(true); setDrillLevel(1);
    fetch(`${BASE}/api/public/categories/${cat._id}/modules`)
      .then(r => r.json())
      .then(d => setModules(d.data || []))
      .catch(() => {})
      .finally(() => setModsLoading(false));
  }

  function goBack() {
    if (drillLevel === 2) { setDrillLevel(1); setSelectedModule(null); }
    else if (drillLevel === 1) { setDrillLevel(0); setSelectedCat(null); setModules([]); }
  }

  // Group by demoDate
  function groupByDate(mods) {
    const g = {};
    mods.forEach(m => {
      const k = m.demoDate
        ? new Date(m.demoDate).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})
        : 'No Date';
      if (!g[k]) g[k] = [];
      g[k].push(m);
    });
    return Object.entries(g).sort(([a],[b]) => {
      if (a==='No Date') return 1; if (b==='No Date') return -1;
      return new Date(b)-new Date(a);
    });
  }

  const groups = groupByDate(modules);
  const filteredGroups = filterDate === 'latest' ? groups.slice(0,1) : groups;
  const navLabel = activeNav === 'support' ? 'Support Training' : 'New Deployment';

  return (
    <div className="team-shell">
      {/* ── Sidebar ── */}
      <aside className="team-sidebar">
        <div className="team-sidebar-logo">
          <div className="team-sidebar-logo-icon">⬡</div>
          <div>
            <div className="team-sidebar-logo-text">Habuild</div>
            <div className="team-sidebar-logo-sub">Wati Training</div>
          </div>
        </div>
        <nav className="team-nav">
          <button className={`team-nav-item ${activeNav==='tests'?'active':''}`}
            onClick={() => { setActiveNav('tests'); setTrainingOpen(false); }}>
            <span className="team-nav-icon">✓</span>
            <span className="team-nav-label">Tests</span>
          </button>
          <button className={`team-nav-item ${(activeNav==='support'||activeNav==='deployment')?'active':''}`}
            onClick={() => setTrainingOpen(o => !o)}>
            <span className="team-nav-icon">▦</span>
            <span className="team-nav-label">Training Material</span>
            <span style={{marginLeft:'auto',fontSize:10,opacity:.6}}>{trainingOpen?'▾':'▸'}</span>
          </button>
          {trainingOpen && (
            <div className="team-sidebar-sub-menu">
              <button className={`sub-menu-item ${activeNav==='support'?'active':''}`}
                onClick={() => setActiveNav('support')}>
                <span className="sub-icon">▦</span><span>Support Training</span>
              </button>
              <button className={`sub-menu-item ${activeNav==='deployment'?'active':''}`}
                onClick={() => setActiveNav('deployment')}>
                <span className="sub-icon">◈</span><span>New Deployment</span>
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

      {/* ── Main ── */}
      <div className="team-main">

        {/* TESTS */}
        {activeNav === 'tests' && (
          <>
            <div className="team-topbar"><span className="team-topbar-title">Tests</span></div>
            <div className="team-content">
              <div className="team-page-heading">
                <h2>Available Tests</h2>
                <p>Click a test to begin. Tests are linked to Google Forms.</p>
              </div>
              {testsLoading ? (
                <div className="team-cards-grid">{[1,2,3].map(i=><div key={i} className="team-shimmer" style={{height:180}}/>)}</div>
              ) : tests.length === 0 ? (
                <div className="team-empty">
                  <div className="team-empty-icon">📋</div>
                  <h3>No tests available</h3>
                  <p>Admin hasn't activated any tests yet.</p>
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
                        <p className="team-test-card-desc">{test.description || 'Click Start Test to open the form.'}</p>
                        <div className="team-test-stats">
                          <div className="team-stat"><span className="team-stat-val">{test.timeLimit}</span><span className="team-stat-label">Minutes</span></div>
                          <div className="team-stat"><span className="team-stat-val">{test.totalMarks}</span><span className="team-stat-label">Marks</span></div>
                          <div className="team-stat"><span className="team-stat-val">{test.passingMarks}</span><span className="team-stat-label">Pass</span></div>
                        </div>
                      </div>
                      <div className="team-test-card-footer">
                        <button className="team-start-btn"
                          onClick={() => navigate(`/test-gate?testId=${test._id}`)}>
                          Start Test →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* TRAINING MATERIAL */}
        {(activeNav==='support'||activeNav==='deployment') && (
          <div className="td-drill-shell">
            <div className="team-topbar">
              {drillLevel > 0 && (
                <button className="td-topbar-back" onClick={goBack}>←</button>
              )}
              <span className="team-topbar-title">
                {drillLevel===0 && navLabel}
                {drillLevel===1 && <><span className="td-breadcrumb">{navLabel} /</span> {selectedCat?.name}</>}
                {drillLevel===2 && <><span className="td-breadcrumb">{selectedCat?.name} /</span> {selectedModule?.title}</>}
              </span>
            </div>

            {/* Level 0 — Category cards */}
            {drillLevel===0 && (
              <div className="td-content-scroll">
                {catsLoading ? (
                  <div className="td-cat-grid">{[1,2,3,4].map(i=><div key={i} className="td-cat-shimmer"/>)}</div>
                ) : categories.length===0 ? (
                  <div className="team-empty">
                    <div className="team-empty-icon">📂</div>
                    <h3>No modules available</h3>
                    <p>Admin hasn't added any content here yet.</p>
                  </div>
                ) : (
                  <div className="td-cat-grid">
                    {categories.map(cat => (
                      <button key={cat._id} className="td-cat-card" onClick={()=>selectCategory(cat)}>
                        <div className="td-cat-card-icon">▦</div>
                        <div className="td-cat-card-name">{cat.name}</div>
                        <div className="td-cat-card-arrow">View content →</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Level 1 — Module list */}
            {drillLevel===1 && (
              <div className="td-content-scroll">
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
                  filteredGroups.map(([date,mods])=>(
                    <div key={date}>
                      <div className="td-date-header">📅 {date}</div>
                      <div className="td-mod-grid">
                        {mods.map(mod=><ModCard key={mod._id} mod={mod} onClick={()=>{setSelectedModule(mod);setDrillLevel(2);}}/>)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="td-mod-grid">
                    {modules.map(mod=><ModCard key={mod._id} mod={mod} onClick={()=>{setSelectedModule(mod);setDrillLevel(2);}}/>)}
                  </div>
                )}
              </div>
            )}

            {/* Level 2 — Content viewer */}
            {drillLevel===2 && selectedModule && (
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

function ModCard({ mod, onClick }) {
  const icon = FILE_ICONS[mod.contentType || mod.fileType?.toLowerCase()] || '📄';
  const kp = mod.keyPoints?.length || 0;
  const faq = mod.faqs?.length || 0;
  const hasContent = !!(mod.fileUrl || mod.contentUrl);
  return (
    <button className="td-mod-card" onClick={onClick}>
      <div className="td-mod-card-icon">{icon}</div>
      <div className="td-mod-card-body">
        <div className="td-mod-card-title">{mod.title}</div>
        {mod.description && <div className="td-mod-card-desc">{mod.description}</div>}
        <div className="td-mod-card-meta">
          {kp > 0 && <span>📌 {kp} key points</span>}
          {faq > 0 && <span>❓ {faq} FAQs</span>}
          {hasContent && <span>{mod.contentType==='canva'?'🎨 Canva':mod.contentType==='drive'?'📁 Drive':mod.fileType?.toUpperCase()||'File'}</span>}
          {!kp && !faq && !hasContent && <span className="td-no-content">No content yet</span>}
        </div>
      </div>
      <div className="td-mod-card-arrow">→</div>
    </button>
  );
}

function ContentViewer({ module }) {
  const [openFaq, setOpenFaq] = useState(null);
  const icon = FILE_ICONS[module.contentType || module.fileType?.toLowerCase()] || '📎';
  const kpCount = module.keyPoints?.length || 0;
  const faqCount = module.faqs?.length || 0;
  const contentUrl = module.contentUrl || module.fileUrl;

  return (
    <div className="td-viewer-page">
      <div className="td-viewer-hero">
        <div className="td-viewer-badge">{icon} {module.contentType?.toUpperCase() || module.fileType?.toUpperCase() || 'MODULE'}</div>
        <h2>{module.title}</h2>
        {module.description && <p>{module.description}</p>}
        <div className="td-viewer-chips">
          <span className={`td-stat-chip ${kpCount>0?'active':''}`}>📌 {kpCount} Key Points</span>
          <span className={`td-stat-chip ${faqCount>0?'active':''}`}>❓ {faqCount} FAQs</span>
          {contentUrl && <span className="td-stat-chip active">📎 Material Available</span>}
        </div>
      </div>
      <div className="td-viewer-body">
        {contentUrl && (
          <div className="td-section">
            <div className="td-section-head">Training Material</div>
            <div className="td-file-row">
              <div className="td-file-info">
                <span className="td-file-icon">{icon}</span>
                <div>
                  <div className="td-file-name">{module.title}</div>
                  <div className="td-file-type">
                    {module.contentType==='canva'?'Canva Presentation':
                     module.contentType==='drive'?'Google Drive':
                     module.fileType?.toUpperCase()||'File'}
                  </div>
                </div>
              </div>
              <a href={contentUrl} target="_blank" rel="noopener noreferrer" className="td-view-btn">
                Open →
              </a>
            </div>
          </div>
        )}
        <div className="td-section">
          <div className="td-section-head">Key Points</div>
          {kpCount>0 ? (
            <ul className="td-key-points">
              {module.keyPoints.map((pt,i)=>(
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
          {faqCount>0 ? (
            <div className="td-faqs">
              {module.faqs.map((faq,i)=>(
                <div key={i} className={`td-faq ${openFaq===i?'open':''}`} onClick={()=>setOpenFaq(openFaq===i?null:i)}>
                  <div className="td-faq-q"><span>{faq.question}</span><span className="td-faq-arrow">{openFaq===i?'▲':'▼'}</span></div>
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
