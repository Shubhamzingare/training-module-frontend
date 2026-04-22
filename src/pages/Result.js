import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Result.css';

export default function Result() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // If no state, redirect home
  if (!state) {
    navigate('/');
    return null;
  }

  const { score, totalMarks, passingMarks, isPassed, name, testTitle, totalQuestions, answeredCorrect } = state;
  const percentage = Math.round((score / totalMarks) * 100);

  return (
    <div className="result-page">
      <div className="result-header">
        <a href="/" className="result-back">← Home</a>
        <div className="result-logo">
          <div className="result-logo-icon">⬡</div>
          <span>Habuild</span>
        </div>
      </div>

      <div className="result-container">
        <div className="result-card">
          {/* Pass/Fail banner */}
          <div className={`result-banner ${isPassed ? 'pass' : 'fail'}`}>
            <div className="result-icon">{isPassed ? '🎉' : '📚'}</div>
            <h1>{isPassed ? 'Congratulations!' : 'Keep Practicing'}</h1>
            <p>{isPassed ? 'You passed the test!' : 'You did not pass this time. Review and try again.'}</p>
          </div>

          <div className="result-body">
            <p className="result-name">Hi, <strong>{name}</strong></p>
            <p className="result-test">{testTitle}</p>

            {/* Score circle */}
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
                <span className="result-stat-val">{answeredCorrect || '—'}</span>
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
              <button className="result-home-btn" onClick={() => navigate('/')}>
                Back to Home
              </button>
              <button className="result-retry-btn" onClick={() => navigate('/test-gate')}>
                Take Another Test
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
