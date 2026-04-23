import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TeamLayout.css';
import '../styles/TrainingDashboard.css';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const FILE_ICONS = { pdf:'📄', ppt:'📊', pptx:'📊', doc:'📝', docx:'📝', video:'🎥', mp4:'🎥' };

export default function Home() {
  const navigate = useNavigate();

  // nav: 'tests' | 'support' | 'deployment'
  const [activeNav,       setActiveNav]       = useState('tests');
  const [trainingOpen,    setTrainingOpen]     = useState(false);

  // Tests
  const [tests,           setTests]           = useState([]);
  const [testsLoading,    setTestsLoading]     = useState(true);

  // Panel 1 — Category list
  const [categories,      setCategories]       = useState([]);
  const [catsLoading,     setCatsLoading]      = useState(false);
  const [selectedCat,     setSelectedCat]      = useState(null);

  // Panel 2 — Module list under selected category
  const [modules,         setModules]          = useState([]);
  const [modsLoading,     setModsLoading]      = useState(false);
  const [selectedModule,  setSelectedModule]   = useState(null);

  // New Deployment filter
  const [filterDate,      setFilterDate]       = useState('');

  // Load tests once
  useEffect(() => {
    fetch(`${BASE}/api/public/tests`)
      .then(r => r.json())
      .then(d => setTests(d.data || []))
      .catch(() => {})
      .finally(() => setTestsLoading(false));
  }, []);

  // Load categories when training nav changes
  useEffect(() => {
    if (activeNav !== 'support' && activeNav !== 'deployment') return;
    setCategories([]);
    setSelectedCat(null);
    setModules([]);
    setSelectedModule(null);
    setFilterDate('');
    setCatsLoading(true);

    const type = activeNav === 'support' ? 'wati_training' : 'new_deployment';
    fetch(`${BASE}/api/public/categories`)
      .then(r => r.json())
      .then(d => {
        const filtered = (d.data || []).filter(c => c.type === type);
        setCategories(filtered);
        if (filtered.length > 0) handleSelectCategory(filtered[0]);
      })
      .catch(() => {})
      .finally(() => setCatsLoading(false));
  }, [activeNav]); // eslint-disable-line

  // Load modules when category selected
  function handleSelectCategory(cat) {
    setSelectedCat(cat);
    setSelectedModule(null);
    setModules([]);
    setModsLoading(true);
    fetch(`${BASE}/api/public/categories/${cat._id}/modules`)
      .then(r => r.json())
      .then(d => {
        const mods = d.data || [];
        setModules(mods);
        if (mods.length > 0) setSelectedModule(mods[0]);
      })
      .catch(() => {})
      .finally(() => setModsLoading(false));
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
    return Object.entries(groups).sort(([a], [b]) => {
      if (a === 'No Date Set') return 1;
      if (b === 'No Date Set') return -1;
      return new Date(b) - new Date(a);
    });
  }

  const deploymentGroups = groupByDemoDate(modules);
  const filteredGroups   = filterDate === 'latest' ? deploymentGroups.slice(0, 1) : deploymentGroups;

  return (
    <div className="team-shell">

      {/* ══ NAV SIDEBAR ══ */}
      <aside className="team-sidebar">
        <div className="team-sidebar-logo">
          <div className="team-sidebar-logo-icon">⬡</div>
          <div>
            <div className="team-sidebar-logo-text">Habuild</div>
            <div className="team-sidebar-logo-sub">Training Portal</div>
          </div>
        </div>

        <nav className="team-nav">
          {/* Tests */}
          <button
            className={`team-nav-item ${activeNav === 'tests' ? 'active' : ''}`}
            onClick={() => { setActiveNav('tests'); setTrainingOpen(false); }}
          >
            <span className="team-nav-icon">✓</span>
            <span className="team-nav-label">Tests</span>
          </button>

          {/* Training Modules parent */}
          <button
            className={`team-nav-item ${(activeNav === 'support' || activeNav === 'deployment') ? 'active' : ''}`}
            onClick={() => setTrainingOpen(o => !o)}
          >
            <span className="team-nav-icon">▦</span>
            <span className="team-nav-label">Training Modules</span>
            <span style={{marginLeft:'auto',fontSize:10,opacity:.6}}>{trainingOpen ? '▾' : '▸'}</span>
          </button>

          {trainingOpen && (
            <div className="team-sidebar-sub-menu">
              <button
                className={`sub-menu-item ${activeNav === 'support' ? 'active' : ''}`}
                onClick={() => setActiveNav('support')}
              >
                <span className="sub-icon">▦</span>
                <span>Support Training</span>
              </button>
              <button
                className={`sub-menu-item ${activeNav === 'deployment' ? 'active' : ''}`}
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

      {/* ══ MAIN ══ */}
      <div className="team-main">

        {/* ── TESTS ── */}
        {activeNav === 'tests' && (
          <>
            <div className="team-topbar">
              <span className="team-topbar-title">Tests</span>
            </div>
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
                        <p className="team-test-card-desc">{test.description || 'Click Start Test to begin.'}</p>
                        <div className="team-test-stats">
                          <div className="team-stat"><span className="team-stat-val">{test.timeLimit}</span><span className="team-stat-label">Minutes</span></div>
                          <div className="team-stat"><span className="team-stat-val">{test.totalMarks}</span><span className="team-stat-label">Marks</span></div>
                          <div className="team-stat"><span className="team-stat-val">{test.passingMarks}</span><span className="team-stat-label">Pass</span></div>
                        </div>
                      </div>
                      <div className="team-test-card-footer">
                        <button className="team-start-btn" onClick={() => navigate(`/test-gate?testId=${test._id}`)}>
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

        {/* ── TRAINING (3-PANEL LAYOUT) ── */}
        {(activeNav === 'support' || activeNav === 'deployment') && (
          <div className="td-three-panel">

            {/* ── PANEL 1: Category List (Modules in user's terms) ── */}
            <div className="td-panel td-panel-cats">
              <div className="td-panel-head">
                {activeNav === 'support' ? 'Support Training' : 'New Deployment'}
              </div>

              {catsLoading ? (
                <div className="td-panel-shimmer">{[1,2,3,4].map(i=><div key={i} className="td-item-shimmer"/>)}</div>
              ) : categories.length === 0 ? (
                <div className="td-panel-empty">No modules available yet.</div>
              ) : (
                <div className="td-panel-list">
                  {categories.map(cat => (
                    <button
                      key={cat._id}
                      className={`td-cat-item ${selectedCat?._id === cat._id ? 'active' : ''}`}
                      onClick={() => handleSelectCategory(cat)}
                    >
                      <span className="td-cat-icon">▦</span>
                      <span className="td-cat-name">{cat.name}</span>
                      {selectedCat?._id === cat._id && <span className="td-cat-arrow">›</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── PANEL 2: Module List (Content items under category) ── */}
            <div className="td-panel td-panel-mods">
              {!selectedCat ? (
                <div className="td-panel-empty-center">
                  <p>Select a module from the left</p>
                </div>
              ) : (
                <>
                  <div className="td-panel-head">
                    {selectedCat.name}
                    {activeNav === 'deployment' && modules.length > 0 && (
                      <div className="td-filter-bar-inline">
                        <button className={`td-filter-btn ${filterDate===''?'active':''}`} onClick={()=>setFilterDate('')}>All</button>
                        <button className={`td-filter-btn ${filterDate==='latest'?'active':''}`} onClick={()=>setFilterDate('latest')}>Latest</button>
                      </div>
                    )}
                  </div>

                  {modsLoading ? (
                    <div className="td-panel-shimmer">{[1,2,3].map(i=><div key={i} className="td-item-shimmer"/>)}</div>
                  ) : modules.length === 0 ? (
                    <div className="td-panel-empty">No content in this module yet.</div>
                  ) : activeNav === 'deployment' ? (
                    /* Grouped by date for New Deployment */
                    <div className="td-panel-list">
                      {filteredGroups.map(([date, mods]) => (
                        <div key={date}>
                          <div className="td-date-header">📅 {date}</div>
                          {mods.map(mod => (
                            <ModuleItem
                              key={mod._id}
                              mod={mod}
                              selected={selectedModule?._id === mod._id}
                              onClick={() => setSelectedModule(mod)}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Flat list for Support Training */
                    <div className="td-panel-list">
                      {modules.map(mod => (
                        <ModuleItem
                          key={mod._id}
                          mod={mod}
                          selected={selectedModule?._id === mod._id}
                          onClick={() => setSelectedModule(mod)}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ── PANEL 3: Content Viewer ── */}
            <div className="td-panel td-panel-content">
              {!selectedModule ? (
                <div className="td-panel-empty-center">
                  <div style={{fontSize:40,marginBottom:12}}>👈</div>
                  <p>Select content to view</p>
                </div>
              ) : (
                <ContentViewer module={selectedModule} />
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

/* ── Module item in list ── */
function ModuleItem({ mod, selected, onClick }) {
  const fileIcon = FILE_ICONS[mod.fileType?.toLowerCase()] || '📄';
  const kp  = mod.keyPoints?.length || 0;
  const faq = mod.faqs?.length || 0;
  const hasFile = !!mod.fileUrl;
  const total = kp + faq + (hasFile ? 1 : 0);

  return (
    <button className={`td-mod-item ${selected ? 'active' : ''}`} onClick={onClick}>
      <div className="td-mod-item-row">
        <span className="td-mod-icon">{fileIcon}</span>
        <span className="td-mod-name">{mod.title}</span>
      </div>
      <div className="td-mod-meta">
        <span className={`td-content-badge ${total > 0 ? 'has-content' : ''}`}>
          {total > 0 ? `${total} items` : 'No content'}
        </span>
      </div>
    </button>
  );
}

/* ── Content viewer panel ── */
function ContentViewer({ module }) {
  const [openFaq, setOpenFaq] = useState(null);
  const fileIcon = FILE_ICONS[module.fileType?.toLowerCase()] || '📎';
  const kpCount  = module.keyPoints?.length || 0;
  const faqCount = module.faqs?.length || 0;
  const hasFile  = !!module.fileUrl;

  return (
    <div className="td-viewer-wrap">
      {/* Header */}
      <div className="td-viewer-head-bar">
        <span className="td-viewer-badge">{fileIcon} {module.fileType?.toUpperCase() || 'MODULE'}</span>
        <h2 className="td-viewer-title">{module.title}</h2>
        {module.description && <p className="td-viewer-desc">{module.description}</p>}
        <div className="td-viewer-chips">
          <span className={`td-stat-chip ${kpCount>0?'active':''}`}>📌 {kpCount} Key Points</span>
          <span className={`td-stat-chip ${faqCount>0?'active':''}`}>❓ {faqCount} FAQs</span>
          {hasFile && <span className="td-stat-chip active">{fileIcon} File Available</span>}
        </div>
      </div>

      <div className="td-viewer-sections">
        {/* File */}
        {hasFile && (
          <div className="td-section">
            <div className="td-section-head">Training Material</div>
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

        {/* Key Points */}
        <div className="td-section">
          <div className="td-section-head">Key Points</div>
          {kpCount > 0 ? (
            <ul className="td-key-points">
              {module.keyPoints.map((pt, i) => (
                <li key={i} className="td-key-point">
                  <span className="td-kp-num">{i+1}</span>
                  <span className="td-kp-text">{pt}</span>
                </li>
              ))}
            </ul>
          ) : <p className="td-empty-text">Key points will appear once content is generated.</p>}
        </div>

        {/* FAQs */}
        <div className="td-section">
          <div className="td-section-head">FAQs</div>
          {faqCount > 0 ? (
            <div className="td-faqs">
              {module.faqs.map((faq, i) => (
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
