import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TeamLayout.css';
import '../styles/TrainingDashboard.css';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const FILE_ICONS = { pdf:'📄', ppt:'📊', pptx:'📊', doc:'📝', docx:'📝', video:'🎥', mp4:'🎥' };

export default function Home() {
  const navigate = useNavigate();

  // Main nav: 'tests' | 'support' | 'deployment'
  const [activeNav,      setActiveNav]      = useState('tests');
  const [trainingOpen,   setTrainingOpen]   = useState(false);

  // Tests
  const [tests,          setTests]          = useState([]);
  const [testsLoading,   setTestsLoading]   = useState(true);

  // Training — module list
  const [modules,        setModules]        = useState([]);
  const [modulesLoading, setModulesLoading] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

  // Load tests on mount
  useEffect(() => {
    fetch(`${BASE}/api/public/tests`)
      .then(r => r.json())
      .then(d => setTests(d.data || []))
      .catch(() => {})
      .finally(() => setTestsLoading(false));
  }, []);

  // Load modules when nav changes to support or deployment
  useEffect(() => {
    if (activeNav !== 'support' && activeNav !== 'deployment') return;
    setModules([]);
    setSelectedModule(null);
    setModulesLoading(true);

    const type = activeNav === 'support' ? 'wati_training' : 'new_deployment';

    // Get categories of this type, then get modules for each
    fetch(`${BASE}/api/public/categories`)
      .then(r => r.json())
      .then(async d => {
        const cats = (d.data || []).filter(c => c.type === type);
        // Fetch modules for all categories in parallel
        const results = await Promise.all(
          cats.map(cat =>
            fetch(`${BASE}/api/public/categories/${cat._id}/modules`)
              .then(r => r.json())
              .then(md => (md.data || []).map(m => ({ ...m, categoryName: cat.name })))
              .catch(() => [])
          )
        );
        const allModules = results.flat();
        setModules(allModules);
        if (allModules.length > 0) setSelectedModule(allModules[0]);
      })
      .catch(() => {})
      .finally(() => setModulesLoading(false));
  }, [activeNav]);

  return (
    <div className="team-shell">

      {/* ── Left Nav Sidebar ── */}
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
            onClick={() => setActiveNav('tests')}
          >
            <span className="team-nav-icon">✓</span>
            <span className="team-nav-label">Tests</span>
          </button>

          {/* Training Modules — collapsible parent */}
          <button
            className={`team-nav-item ${(activeNav === 'support' || activeNav === 'deployment') ? 'active' : ''}`}
            onClick={() => setTrainingOpen(o => !o)}
          >
            <span className="team-nav-icon">▦</span>
            <span className="team-nav-label">Training Modules</span>
            <span style={{marginLeft:'auto', fontSize:10, opacity:.6}}>{trainingOpen ? '▾' : '▸'}</span>
          </button>

          {/* Sub-items under Training Modules */}
          {trainingOpen && (
            <div className="team-sidebar-sub-menu">
              <button
                className={`sub-menu-item ${activeNav === 'support' ? 'active' : ''}`}
                onClick={() => { setActiveNav('support'); }}
              >
                <span className="sub-icon">▦</span>
                <span>Support Training</span>
              </button>
              <button
                className={`sub-menu-item ${activeNav === 'deployment' ? 'active' : ''}`}
                onClick={() => { setActiveNav('deployment'); }}
              >
                <span className="sub-icon">◈</span>
                <span>New Deployment</span>
              </button>
            </div>
          )}
        </nav>
        <div className="team-nav" style={{marginTop:'auto', paddingTop:16, borderTop:'1px solid rgba(255,255,255,0.08)'}}>
          <a href="/admin/login" className="team-nav-item" style={{textDecoration:'none'}}>
            <span className="team-nav-icon">⚙</span>
            <span className="team-nav-label">Admin</span>
          </a>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <div className="team-main">

        {/* ════ TESTS TAB ════ */}
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
                <div className="team-cards-grid">
                  {[1,2,3].map(i => <div key={i} className="team-shimmer" />)}
                </div>
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
                      <div className="team-test-card-stripe" />
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

        {/* ════ TRAINING TABS (Support / New Deployment) ════ */}
        {(activeNav === 'support' || activeNav === 'deployment') && (
          <div className="td-layout">

            {/* Module List Panel */}
            <div className="td-list-panel">
              <div className="td-list-header">
                <h3>{activeNav === 'support' ? 'Support Training' : 'New Deployment'}</h3>
                <span className="td-list-count">{modules.length} modules</span>
              </div>

              {modulesLoading ? (
                <div className="td-list-shimmer">
                  {[1,2,3,4].map(i => <div key={i} className="td-module-shimmer" />)}
                </div>
              ) : modules.length === 0 ? (
                <div className="td-list-empty">
                  <p>No active modules yet.</p>
                  <p>Ask your admin to upload and activate content.</p>
                </div>
              ) : (
                <div className="td-module-list">
                  {modules.map(mod => {
                    const kpCount = mod.keyPoints?.length || 0;
                    const faqCount = mod.faqs?.length || 0;
                    const hasFile = !!mod.fileUrl;
                    const total = kpCount + faqCount + (hasFile ? 1 : 0);
                    return (
                      <button
                        key={mod._id}
                        className={`td-module-item ${selectedModule?._id === mod._id ? 'active' : ''}`}
                        onClick={() => setSelectedModule(mod)}
                      >
                        <div className="td-module-item-top">
                          <span className="td-module-icon">
                            {FILE_ICONS[mod.fileType?.toLowerCase()] || '📄'}
                          </span>
                          <span className="td-module-title">{mod.title}</span>
                        </div>
                        <div className="td-module-item-meta">
                          <span className="td-module-cat">{mod.categoryName}</span>
                          <span className={`td-content-badge ${total > 0 ? 'has-content' : ''}`}>
                            {total} items
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Content Area */}
            <div className="td-content-panel">
              {!selectedModule ? (
                <div className="td-select-prompt">
                  <div className="td-prompt-icon">👈</div>
                  <h3>Select a module</h3>
                  <p>Choose a module from the list to view its content</p>
                </div>
              ) : (
                <ModuleViewer module={selectedModule} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Module Content Viewer ── */
function ModuleViewer({ module }) {
  const [openFaq, setOpenFaq] = useState(null);

  const kpCount  = module.keyPoints?.length || 0;
  const faqCount = module.faqs?.length || 0;
  const hasFile  = !!module.fileUrl;
  const fileIcon = FILE_ICONS[module.fileType?.toLowerCase()] || '📎';

  return (
    <div className="td-viewer">
      {/* Header */}
      <div className="td-viewer-header">
        <div className="td-viewer-badge">
          {fileIcon} {module.fileType?.toUpperCase() || 'MODULE'}
        </div>
        <h2 className="td-viewer-title">{module.title}</h2>
        {module.description && (
          <p className="td-viewer-desc">{module.description}</p>
        )}
        <div className="td-viewer-stats">
          <div className={`td-stat-chip ${kpCount > 0 ? 'active' : ''}`}>
            📌 {kpCount} Key Points
          </div>
          <div className={`td-stat-chip ${faqCount > 0 ? 'active' : ''}`}>
            ❓ {faqCount} FAQs
          </div>
          {hasFile && (
            <div className="td-stat-chip active">
              {fileIcon} 1 File
            </div>
          )}
        </div>
      </div>

      {/* File Download */}
      {hasFile && (
        <div className="td-section">
          <div className="td-section-head">Training Material</div>
          <div className="td-file-row">
            <div className="td-file-info">
              <span className="td-file-icon">{fileIcon}</span>
              <div>
                <div className="td-file-name">{module.title}</div>
                <div className="td-file-type">{module.fileType?.toUpperCase()} File</div>
              </div>
            </div>
            <a
              href={module.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="td-view-btn"
            >
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
                <span className="td-kp-num">{i + 1}</span>
                <span className="td-kp-text">{pt}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="td-empty-text">Key points will appear here once content is generated.</p>
        )}
      </div>

      {/* FAQs */}
      <div className="td-section">
        <div className="td-section-head">FAQs</div>
        {faqCount > 0 ? (
          <div className="td-faqs">
            {module.faqs.map((faq, i) => (
              <div
                key={i}
                className={`td-faq ${openFaq === i ? 'open' : ''}`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="td-faq-q">
                  <span>{faq.question}</span>
                  <span className="td-faq-arrow">{openFaq === i ? '▲' : '▼'}</span>
                </div>
                {openFaq === i && (
                  <div className="td-faq-a">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="td-empty-text">FAQs will appear here once content is generated.</p>
        )}
      </div>
    </div>
  );
}
