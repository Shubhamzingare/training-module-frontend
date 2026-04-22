import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/TeamLayout.css';
import '../styles/Result.css';

export default function Result() {
  const navigate  = useNavigate();
  const { state } = useLocation();

  if (!state) { navigate('/'); return null; }

  const { score, totalMarks, passingMarks, isPassed, name, testTitle, totalQuestions, answeredCorrect } = state;
  const percentage = Math.round((score / totalMarks) * 100);

  return (
    <div className="team-shell">

      {/* Sidebar */}
      <aside className="team-sidebar">
        <div className="team-sidebar-logo">
          <div className="team-sidebar-logo-icon">⬡</div>
          <div>
            <div className="team-sidebar-logo-text">Habuild</div>
            <div className="team-sidebar-logo-sub">Training Portal</div>
          </div>
        </div>
        <nav className="team-nav">
          <button className="team-nav-item" onClick={() => navigate('/')}>
            <span className="team-nav-icon">✓</span>
            <span className="team-nav-label">Tests</span>
          </button>
          <button className="team-nav-item" onClick={() => navigate('/')}>
            <span className="team-nav-icon">▦</span>
            <span className="team-nav-label">Training Material</span>
          </button>
        </nav>
      </aside>

      {/* Main */}
      <div className="team-main">
        <div className="team-topbar">
          <span className="team-topbar-title">Test Result</span>
        </div>

        <div className="team-content">
          <div className="team-start-screen">
            <div className="result-card">
              {/* Banner */}
              <div className={`result-banner ${isPassed ? 'pass' : 'fail'}`}>
                <div className="result-icon">{isPassed ? '🎉' : '📚'}</div>
                <h1>{isPassed ? 'Congratulations!' : 'Keep Practicing'}</h1>
                <p>{isPassed ? 'You passed the test!' : 'You did not pass this time. Review and try again.'}</p>
              </div>

              <div className="result-body">
                <p className="result-name">Hi, <strong>{name}</strong></p>
                <p className="result-test">{testTitle}</p>

                {/* Score */}
                <div className="result-score-circle">
                  <div className={`result-circle ${isPassed ? 'pass' : 'fail'}`}>
                    <span className="result-score-num">{score}</span>
                    <span className="result-score-total">/ {totalMarks}</span>
                  </div>
                  <p className="result-percent">{percentage}%</p>
                </div>

                {/* Stats */}
                <div className="result-stats">
                  <div className="result-stat">
                    <span className="result-stat-val">{totalQuestions || '—'}</span>
                    <span className="result-stat-label">Questions</span>
                  </div>
                  <div className="result-stat">
                    <span className="result-stat-val">{answeredCorrect ?? '—'}</span>
                    <span className="result-stat-label">Correct</span>
                  </div>
                  <div className="result-stat">
                    <span className="result-stat-val">{passingMarks}</span>
                    <span className="result-stat-label">Pass Mark</span>
                  </div>
                  <div className="result-stat">
                    <span className={`result-stat-val ${isPassed ? 'green' : 'red'}`}>
                      {isPassed ? 'PASS' : 'FAIL'}
                    </span>
                    <span className="result-stat-label">Result</span>
                  </div>
                </div>

                <div className="result-actions">
                  <button className="team-start-btn" onClick={() => navigate('/')}>
                    Back to Home
                  </button>
                  <button
                    style={{ padding:'12px 20px', background:'white', color:'#2c3e50', border:'1px solid #2c3e50', borderRadius:6, fontSize:14, fontWeight:600, cursor:'pointer' }}
                    onClick={() => navigate('/test-gate')}
                  >
                    Take Another Test
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
