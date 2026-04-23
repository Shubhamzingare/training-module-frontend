import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TeamLayout.css';
import '../styles/TeamDashboard.css';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const FILE_ICONS = { pdf:'📄', ppt:'📊', pptx:'📊', doc:'📝', docx:'📝', video:'🎥', mp4:'🎥', canva:'🎨', drive:'📁', link:'🔗' };

export default function Home() {
  const navigate = useNavigate();
  const panelRef = useRef(null);

  const [activeSection, setActiveSection] = useState('tests'); // 'tests' | 'support' | 'deployment'
  const [openCatId,     setOpenCatId]     = useState(null);    // expanded category in sidebar
  const [openDateKey,   setOpenDateKey]   = useState(null);    // expanded date group for deployment
  const [selectedMod,   setSelectedMod]   = useState(null);    // module shown in right panel
  const [panelOpen,     setPanelOpen]     = useState(false);

  // Data
  const [tests,         setTests]         = useState([]);
  const [testsLoading,  setTestsLoading]  = useState(true);
  const [categories,    setCategories]    = useState([]);
  const [catModules,    setCatModules]    = useState({});       // categoryId → modules[]
  const [catsLoading,   setCatsLoading]   = useState(false);

  const [openFaq,       setOpenFaq]       = useState(null);

  // Load tests
  useEffect(() => {
    fetch(`${BASE}/api/public/tests`)
      .then(r => r.json()).then(d => setTests(d.data || [])).catch(() => {})
      .finally(() => setTestsLoading(false));
  }, []);

  // Load categories + their modules when section changes
  useEffect(() => {
    if (activeSection !== 'support' && activeSection !== 'deployment') return;
    setCatsLoading(true);
    setOpenCatId(null); setOpenDateKey(null);
    setSelectedMod(null); setPanelOpen(false);
    const type = activeSection === 'support' ? 'wati_training' : 'new_deployment';

    fetch(`${BASE}/api/public/categories`)
      .then(r => r.json())
      .then(async d => {
        const cats = (d.data || []).filter(c => c.type === type);
        setCategories(cats);
        // Preload all category modules
        const modMap = {};
        await Promise.all(cats.map(cat =>
          fetch(`${BASE}/api/public/categories/${cat._id}/modules`)
            .then(r => r.json())
            .then(md => { modMap[cat._id] = md.data || []; })
            .catch(() => { modMap[cat._id] = []; })
        ));
        setCatModules(modMap);
      })
      .catch(() => {})
      .finally(() => setCatsLoading(false));
  }, [activeSection]); // eslint-disable-line

  // Close panel on outside click
  useEffect(() => {
    function handleClick(e) {
      if (panelOpen && panelRef.current && !panelRef.current.contains(e.target)) {
        const sidebar = document.querySelector('.td-expanded-sidebar');
        if (sidebar && sidebar.contains(e.target)) return;
        setPanelOpen(false);
        setSelectedMod(null);
        setOpenFaq(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [panelOpen]);

  function openModule(mod) {
    setSelectedMod(mod);
    setPanelOpen(true);
    setOpenFaq(null);
  }

  // Group by demoDate for New Deployment
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

  // All modules flat for deployment, grouped by date
  const allDeploymentMods = categories.flatMap(cat =>
    (catModules[cat._id] || []).map(m => ({ ...m, categoryName: cat.name }))
  );
  const deploymentGroups = groupByDate(allDeploymentMods);

  return (
    <div className="team-shell" style={{ position: 'relative' }}>

      {/* ══ LEFT SIDEBAR ══ */}
      <aside className="td-sidebar">
        <div className="td-logo">
          <div className="td-logo-icon">⬡</div>
          <div>
            <div className="td-logo-text">Habuild</div>
            <div className="td-logo-sub">Wati Training</div>
          </div>
        </div>

        <nav className="td-nav">

          {/* Tests */}
          <button
            className={`td-nav-item ${activeSection==='tests'?'active':''}`}
            onClick={() => { setActiveSection('tests'); setPanelOpen(false); setSelectedMod(null); }}
          >
            <span className="td-nav-icon">✓</span>
            <span>Tests</span>
          </button>

          {/* Support Training */}
          <button
            className={`td-nav-item ${activeSection==='support'?'active':''}`}
            onClick={() => setActiveSection('support')}
          >
            <span className="td-nav-icon">▦</span>
            <span>Support Training</span>
          </button>

          {/* Support Training categories */}
          {activeSection === 'support' && (
            <div className="td-cat-tree">
              {catsLoading ? (
                <div className="td-tree-loading">Loading…</div>
              ) : categories.map(cat => (
                <div key={cat._id} className="td-tree-cat">
                  <button
                    className={`td-tree-cat-btn ${openCatId===cat._id?'open':''}`}
                    onClick={() => setOpenCatId(openCatId===cat._id ? null : cat._id)}
                  >
                    <span>▦ {cat.name}</span>
                    <span className="td-tree-arrow">{openCatId===cat._id?'▾':'▸'}</span>
                  </button>
                  {openCatId === cat._id && (
                    <div className="td-tree-modules">
                      {(catModules[cat._id] || []).length === 0 ? (
                        <div className="td-tree-empty">No content yet</div>
                      ) : (catModules[cat._id] || []).map(mod => (
                        <button
                          key={mod._id}
                          className={`td-tree-mod ${selectedMod?._id===mod._id?'active':''}`}
                          onClick={() => openModule(mod)}
                        >
                          <span>{FILE_ICONS[mod.contentType||mod.fileType] || '📄'}</span>
                          <span className="td-tree-mod-name">{mod.title}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* New Deployment */}
          <button
            className={`td-nav-item ${activeSection==='deployment'?'active':''}`}
            onClick={() => setActiveSection('deployment')}
          >
            <span className="td-nav-icon">◈</span>
            <span>New Deployment</span>
          </button>

          {/* New Deployment — date groups */}
          {activeSection === 'deployment' && (
            <div className="td-cat-tree">
              {catsLoading ? (
                <div className="td-tree-loading">Loading…</div>
              ) : deploymentGroups.length === 0 ? (
                <div className="td-tree-empty">No deployments yet</div>
              ) : deploymentGroups.map(([date, mods]) => (
                <div key={date} className="td-tree-cat">
                  <button
                    className={`td-tree-cat-btn ${openDateKey===date?'open':''}`}
                    onClick={() => setOpenDateKey(openDateKey===date ? null : date)}
                  >
                    <span>📅 {date}</span>
                    <span className="td-tree-arrow">{openDateKey===date?'▾':'▸'}</span>
                  </button>
                  {openDateKey === date && (
                    <div className="td-tree-modules">
                      {mods.map(mod => (
                        <button
                          key={mod._id}
                          className={`td-tree-mod ${selectedMod?._id===mod._id?'active':''}`}
                          onClick={() => openModule(mod)}
                        >
                          <span>{FILE_ICONS[mod.contentType||mod.fileType] || '📄'}</span>
                          <span className="td-tree-mod-name">{mod.title}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </nav>

        <div className="td-nav" style={{marginTop:'auto',paddingTop:12,borderTop:'1px solid rgba(255,255,255,0.08)'}}>
          <a href="/admin/login" className="td-nav-item" style={{textDecoration:'none'}}>
            <span className="td-nav-icon">⚙</span>
            <span>Admin</span>
          </a>
        </div>
      </aside>

      {/* ══ MAIN CONTENT ══ */}
      <div className="team-main">
        <div className="team-topbar">
          <span className="team-topbar-title">
            {activeSection==='tests' && 'Tests'}
            {activeSection==='support' && 'Support Training'}
            {activeSection==='deployment' && 'New Deployment'}
          </span>
        </div>

        <div className="team-content">

          {/* TESTS */}
          {activeSection === 'tests' && (
            <>
              <div className="team-page-heading">
                <h2>Available Tests</h2>
                <p>Click a test to begin</p>
              </div>
              {testsLoading ? (
                <div className="team-cards-grid">{[1,2,3].map(i=><div key={i} className="team-shimmer" style={{height:200}}/>)}</div>
              ) : tests.length === 0 ? (
                <div className="team-empty">
                  <div className="team-empty-icon">📋</div>
                  <h3>No tests available</h3>
                  <p>Admin hasn't activated any tests yet.</p>
                </div>
              ) : (
                <div className="team-cards-grid">
                  {tests.map(t => (
                    <div key={t._id} className="team-test-card">
                      <div className="team-test-card-stripe"/>
                      <div className="team-test-card-body">
                        <div className="team-test-card-head">
                          <div className="team-test-icon">📋</div>
                          <span className="team-badge-active">Active</span>
                        </div>
                        <h3 className="team-test-card-title">{t.title}</h3>
                        <p className="team-test-card-desc">{t.description||'Click Start Test to open the form.'}</p>
                        <div className="team-test-stats">
                          <div className="team-stat"><span className="team-stat-val">{t.timeLimit}</span><span className="team-stat-label">Min</span></div>
                          <div className="team-stat"><span className="team-stat-val">{t.totalMarks}</span><span className="team-stat-label">Marks</span></div>
                          <div className="team-stat"><span className="team-stat-val">{t.passingMarks}</span><span className="team-stat-label">Pass</span></div>
                        </div>
                      </div>
                      <div className="team-test-card-footer">
                        <button className="team-start-btn" onClick={()=>navigate(`/test-gate?testId=${t._id}`)}>
                          Start Test →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* SUPPORT TRAINING — instruction */}
          {activeSection === 'support' && !panelOpen && (
            <div className="td-main-hint">
              <div className="td-hint-icon">👈</div>
              <h3>Select a topic from the sidebar</h3>
              <p>Expand a category to see available training modules</p>
            </div>
          )}

          {/* NEW DEPLOYMENT — instruction */}
          {activeSection === 'deployment' && !panelOpen && (
            <div className="td-main-hint">
              <div className="td-hint-icon">👈</div>
              <h3>Select a deployment from the sidebar</h3>
              <p>New deployments are added every 15 days. Expand a date to view content.</p>
            </div>
          )}

        </div>
      </div>

      {/* ══ RIGHT CONTENT PANEL (slides in) ══ */}
      <div ref={panelRef} className={`td-content-panel ${panelOpen?'open':''}`}>
        {selectedMod && (
          <>
            <div className="td-panel-bar">
              <div className="td-panel-bar-title">{selectedMod.title}</div>
              <button className="td-panel-close" onClick={()=>{setPanelOpen(false);setSelectedMod(null);setOpenFaq(null);}}>✕</button>
            </div>

            <div className="td-panel-body">
              {/* File */}
              {(selectedMod.contentUrl || selectedMod.fileUrl) && (
                <div className="td-panel-section">
                  <div className="td-panel-sec-head">Training Material</div>
                  <div className="td-panel-file">
                    <span className="td-panel-file-icon">
                      {FILE_ICONS[selectedMod.contentType||selectedMod.fileType]||'📄'}
                    </span>
                    <div>
                      <div className="td-panel-file-name">{selectedMod.title}</div>
                      <div className="td-panel-file-type">
                        {selectedMod.contentType==='canva'?'Canva Presentation':
                         selectedMod.fileType?.toUpperCase()||'File'}
                      </div>
                    </div>
                    <a
                      href={selectedMod.contentUrl||selectedMod.fileUrl}
                      target="_blank" rel="noopener noreferrer"
                      className="td-panel-open-btn"
                    >Open →</a>
                  </div>
                </div>
              )}

              {/* Key Points */}
              <div className="td-panel-section">
                <div className="td-panel-sec-head">Key Points</div>
                {(selectedMod.keyPoints||[]).length > 0 ? (
                  <ul className="td-panel-kp">
                    {selectedMod.keyPoints.map((pt,i)=>(
                      <li key={i} className="td-panel-kp-item">
                        <span className="td-panel-kp-num">{i+1}</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                ) : <p className="td-panel-empty">Key points will appear once content is generated.</p>}
              </div>

              {/* FAQs */}
              <div className="td-panel-section">
                <div className="td-panel-sec-head">FAQs</div>
                {(selectedMod.faqs||[]).length > 0 ? (
                  <div className="td-panel-faqs">
                    {selectedMod.faqs.map((faq,i)=>(
                      <div key={i} className={`td-panel-faq ${openFaq===i?'open':''}`} onClick={()=>setOpenFaq(openFaq===i?null:i)}>
                        <div className="td-panel-faq-q">
                          <span>{faq.question}</span>
                          <span>{openFaq===i?'▲':'▼'}</span>
                        </div>
                        {openFaq===i && <div className="td-panel-faq-a">{faq.answer}</div>}
                      </div>
                    ))}
                  </div>
                ) : <p className="td-panel-empty">FAQs will appear once content is generated.</p>}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Overlay when panel open */}
      {panelOpen && <div className="td-overlay" onClick={()=>{setPanelOpen(false);setSelectedMod(null);setOpenFaq(null);}}/>}
    </div>
  );
}
