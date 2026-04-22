import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Home() {
  const navigate = useNavigate();
  const [tests, setTests]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE}/api/admin/tests`)
      .then(r => r.json())
      .then(d => setTests((d.data || []).filter(t => t.status === 'active')))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      <header className="home-header">
        <div className="home-logo">
          <div className="home-logo-icon">⬡</div>
          <span>Habuild</span>
        </div>
        <a href="/admin/login" className="home-admin-link">Admin Login</a>
      </header>

      <section className="home-hero">
        <div className="home-hero-content">
          <h1>Training & Assessment Platform</h1>
          <p>Complete your assessments to track your progress</p>
          <button className="home-cta-btn" onClick={() => navigate('/test-gate')}>
            Take a Test →
          </button>
        </div>
      </section>

      <section className="home-section">
        <div className="home-container">
          <h2>Available Tests</h2>
          {loading && (
            <div className="home-shimmer-wrap">
              {[1,2,3].map(i => <div key={i} className="home-shimmer" />)}
            </div>
          )}
          {!loading && tests.length === 0 && (
            <div className="home-empty">
              <p>No active tests available right now.</p>
              <p>Check back with your admin.</p>
            </div>
          )}
          {!loading && tests.length > 0 && (
            <div className="home-tests-grid">
              {tests.map(test => (
                <div key={test._id} className="home-test-card">
                  <div className="home-test-card-top">
                    <div className="home-test-icon">📋</div>
                    <span className="home-test-badge">Active</span>
                  </div>
                  <h3>{test.title}</h3>
                  <p>{test.description || 'Click below to start this assessment'}</p>
                  <div className="home-test-meta">
                    <span>⏱ {test.timeLimit} min</span>
                    <span>📝 {test.totalMarks} marks</span>
                    <span>Pass: {test.passingMarks}</span>
                  </div>
                  <button
                    className="home-start-btn"
                    onClick={() => navigate(`/test-gate?testId=${test._id}`)}
                  >
                    Start Test
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="home-info-section">
        <div className="home-container">
          <div className="home-info-grid">
            <div className="home-info-card">
              <div className="home-info-icon">📚</div>
              <h3>Training Modules</h3>
              <p>Access content for Support Training and New Deployment</p>
            </div>
            <div className="home-info-card">
              <div className="home-info-icon">⏱</div>
              <h3>Timed Tests</h3>
              <p>Complete tests within the allotted time</p>
            </div>
            <div className="home-info-card">
              <div className="home-info-icon">📊</div>
              <h3>Instant Results</h3>
              <p>Get your score immediately after submission</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <p>© 2026 Habuild · Training & Assessment Platform</p>
      </footer>
    </div>
  );
}
