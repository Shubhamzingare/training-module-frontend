import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TeamLayout.css';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const NAV = [
  { id: 'tests',    icon: '✓', label: 'Tests'             },
  { id: 'training', icon: '▦', label: 'Training Material' },
];

const FILE_ICONS = {
  pdf:   '📄',
  pptx:  '📊',
  video: '🎬',
  doc:   '📝',
};

export default function Home() {
  const navigate = useNavigate();
  const [active,  setActive]  = useState('tests');
  const [tests,   setTests]   = useState([]);
  const [loading, setLoading] = useState(true);

  // Training tab state
  const [trainingCategories, setTrainingCategories]   = useState({ support: [], deployment: [] });
  const [selectedCategory,   setSelectedCategory]     = useState(null);
  const [categoryModules,    setCategoryModules]       = useState([]);
  const [loadingModules,     setLoadingModules]        = useState(false);

  useEffect(() => {
    fetch(`${BASE}/api/public/tests`)
      .then(r => r.json())
      .then(d => setTests((d.data || []).filter(t => t.status === 'active')))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Fetch categories when training tab is first opened
  useEffect(() => {
    if (active !== 'training') return;
    if (trainingCategories.support.length > 0 || trainingCategories.deployment.length > 0) return;
    fetch(`${BASE}/api/public/categories`)
      .then(r => r.json())
      .then(d => {
        const all = d.data || [];
        setTrainingCategories({
          support:    all.filter(c => c.type === 'wati_training'),
          deployment: all.filter(c => c.type === 'new_deployment'),
        });
      })
      .catch(() => {});
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setCategoryModules([]);
    setLoadingModules(true);
    fetch(`${BASE}/api/public/categories/${cat._id}/modules`)
      .then(r => r.json())
      .then(d => setCategoryModules(d.data || []))
      .catch(() => {})
      .finally(() => setLoadingModules(false));
  };

  return (
    <div className="team-shell">

      {/* ── Sidebar ── */}
      <aside className="team-sidebar">
        <div className="team-sidebar-logo">
          <div className="team-sidebar-logo-icon">⬡</div>
          <div>
            <div className="team-sidebar-logo-text">Habuild</div>
            <div className="team-sidebar-logo-sub">Training Portal</div>
          </div>
        </div>

        <nav className="team-nav">
          {NAV.map(item => (
            <button
              key={item.id}
              className={`team-nav-item ${active === item.id ? 'active' : ''}`}
              onClick={() => setActive(item.id)}
            >
              <span className="team-nav-icon">{item.icon}</span>
              <span className="team-nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main ── */}
      <div className="team-main">

        {/* Top bar */}
        <div className="team-topbar">
          <span className="team-topbar-title">
            {NAV.find(n => n.id === active)?.label}
          </span>
          <div className="team-topbar-right">
            <a href="/admin/login" style={{ fontSize: 12, color: '#718096', textDecoration: 'none' }}>
              Admin →
            </a>
          </div>
        </div>

        {/* Content */}
        <div className="team-content">

          {/* ── TESTS TAB ── */}
          {active === 'tests' && (
            <>
              <div className="team-page-heading">
                <h2>Available Tests</h2>
                <p>Select a test to begin your assessment</p>
              </div>

              {loading && (
                <div className="team-cards-grid">
                  {[1,2,3].map(i => <div key={i} className="team-shimmer" />)}
                </div>
              )}

              {!loading && (
                <div className="team-cards-grid">
                  {tests.length === 0 ? (
                    <div className="team-empty">
                      <div className="team-empty-icon">📋</div>
                      <h3>No tests available</h3>
                      <p>No active tests right now. Check back later.</p>
                    </div>
                  ) : tests.map(test => (
                    <div key={test._id} className="team-test-card">
                      <div className="team-test-card-stripe" />
                      <div className="team-test-card-body">
                        <div className="team-test-card-head">
                          <div className="team-test-icon">📋</div>
                          <span className="team-badge-active">Active</span>
                        </div>
                        <h3 className="team-test-card-title">{test.title}</h3>
                        <p className="team-test-card-desc">
                          {test.description || 'Click Start Test to begin this assessment.'}
                        </p>
                        <div className="team-test-stats">
                          <div className="team-stat">
                            <span className="team-stat-val">{test.timeLimit}</span>
                            <span className="team-stat-label">Minutes</span>
                          </div>
                          <div className="team-stat">
                            <span className="team-stat-val">{test.totalMarks}</span>
                            <span className="team-stat-label">Marks</span>
                          </div>
                          <div className="team-stat">
                            <span className="team-stat-val">{test.passingMarks}</span>
                            <span className="team-stat-label">Pass</span>
                          </div>
                        </div>
                      </div>
                      <div className="team-test-card-footer">
                        <button
                          className="team-start-btn"
                          onClick={() => navigate(`/test-gate?testId=${test._id}`)}
                        >
                          Start Test →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── TRAINING TAB ── */}
          {active === 'training' && (
            <>
              <div className="team-page-heading">
                <h2>Training Material</h2>
                <p>Select a category to browse training modules</p>
              </div>

              {/* Category sections */}
              {!selectedCategory && (
                <>
                  {/* Support Training */}
                  <div style={{ marginBottom: 32 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2c3e50', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>📚</span> Support Training
                    </h3>
                    {trainingCategories.support.length === 0 ? (
                      <div className="team-empty" style={{ padding: '28px 24px' }}>
                        <p style={{ margin: 0 }}>No support training categories yet.</p>
                      </div>
                    ) : (
                      <div className="team-cards-grid">
                        {trainingCategories.support.map(cat => (
                          <div key={cat._id} className="team-test-card" style={{ cursor: 'pointer' }} onClick={() => handleSelectCategory(cat)}>
                            <div className="team-test-card-stripe" />
                            <div className="team-test-card-body">
                              <div className="team-test-card-head">
                                <div className="team-test-icon">{cat.icon || '📚'}</div>
                                <span className="team-badge-active">Training</span>
                              </div>
                              <h3 className="team-test-card-title">{cat.name}</h3>
                              <p className="team-test-card-desc">{cat.description || 'Click to view modules in this category.'}</p>
                            </div>
                            <div className="team-test-card-footer">
                              <button className="team-start-btn" onClick={e => { e.stopPropagation(); handleSelectCategory(cat); }}>
                                View Modules →
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* New Deployment */}
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2c3e50', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>🚀</span> New Deployment
                    </h3>
                    {trainingCategories.deployment.length === 0 ? (
                      <div className="team-empty" style={{ padding: '28px 24px' }}>
                        <p style={{ margin: 0 }}>No new deployment categories yet.</p>
                      </div>
                    ) : (
                      <div className="team-cards-grid">
                        {trainingCategories.deployment.map(cat => (
                          <div key={cat._id} className="team-test-card" style={{ cursor: 'pointer' }} onClick={() => handleSelectCategory(cat)}>
                            <div className="team-test-card-stripe" style={{ background: 'linear-gradient(90deg,#1a6b4a 0%,#27ae60 100%)' }} />
                            <div className="team-test-card-body">
                              <div className="team-test-card-head">
                                <div className="team-test-icon">{cat.icon || '🚀'}</div>
                                <span className="team-badge-active">Deployment</span>
                              </div>
                              <h3 className="team-test-card-title">{cat.name}</h3>
                              <p className="team-test-card-desc">{cat.description || 'Click to view modules in this category.'}</p>
                            </div>
                            <div className="team-test-card-footer">
                              <button className="team-start-btn" onClick={e => { e.stopPropagation(); handleSelectCategory(cat); }}>
                                View Modules →
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Modules list for selected category */}
              {selectedCategory && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <button
                      onClick={() => { setSelectedCategory(null); setCategoryModules([]); }}
                      style={{ background: 'none', border: 'none', color: '#2c3e50', fontWeight: 600, fontSize: 14, cursor: 'pointer', padding: '6px 0' }}
                    >
                      ← Back
                    </button>
                    <span style={{ color: '#718096', fontSize: 14 }}>/</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#2c3e50' }}>{selectedCategory.name}</span>
                  </div>

                  {loadingModules && (
                    <div className="team-cards-grid">
                      {[1,2,3].map(i => <div key={i} className="team-shimmer" />)}
                    </div>
                  )}

                  {!loadingModules && (
                    <div className="team-cards-grid">
                      {categoryModules.length === 0 ? (
                        <div className="team-empty">
                          <div className="team-empty-icon">📂</div>
                          <h3>No modules available</h3>
                          <p>No active modules in this category yet.</p>
                        </div>
                      ) : categoryModules.map(mod => (
                        <div key={mod._id} className="team-test-card">
                          <div className="team-test-card-stripe" />
                          <div className="team-test-card-body">
                            <div className="team-test-card-head">
                              <div className="team-test-icon">{FILE_ICONS[mod.fileType] || '📄'}</div>
                              <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#4a6278', letterSpacing: '.4px' }}>
                                {mod.fileType?.toUpperCase() || 'PDF'}
                              </span>
                            </div>
                            <h3 className="team-test-card-title">{mod.title}</h3>
                            <p className="team-test-card-desc">{mod.description || 'Click View to open this training module.'}</p>
                            <div className="team-test-stats">
                              <div className="team-stat">
                                <span className="team-stat-val">{mod.keyPoints?.length ?? 0}</span>
                                <span className="team-stat-label">Key Points</span>
                              </div>
                              <div className="team-stat">
                                <span className="team-stat-val">{mod.faqs?.length ?? 0}</span>
                                <span className="team-stat-label">FAQs</span>
                              </div>
                            </div>
                          </div>
                          <div className="team-test-card-footer">
                            <button
                              className="team-start-btn"
                              onClick={() => navigate(`/modules/${mod._id}`)}
                            >
                              View →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
