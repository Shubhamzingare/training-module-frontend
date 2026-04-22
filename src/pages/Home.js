import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TeamLayout.css';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const NAV = [
  { id: 'tests',    icon: '✓', label: 'Tests'             },
  { id: 'training', icon: '▦', label: 'Training Material' },
];

export default function Home() {
  const navigate = useNavigate();
  const [active,  setActive]  = useState('tests');
  const [tests,   setTests]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE}/api/public/tests`)
      .then(r => r.json())
      .then(d => setTests((d.data || []).filter(t => t.status === 'active')))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
                <p>Study materials for Support Training and New Deployment</p>
              </div>
              <div className="team-empty" style={{ marginTop: 0 }}>
                <div className="team-empty-icon">📚</div>
                <h3>Coming Soon</h3>
                <p>Training materials will be available here soon.</p>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
