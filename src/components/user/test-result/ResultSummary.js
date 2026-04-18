import React from 'react';

const ResultSummary = ({
  score,
  totalMarks,
  percentage,
  passingMarks,
  isPassed,
  attemptDate,
}) => {
  return (
    <div className={`result-summary ${isPassed ? 'passed' : 'failed'}`}>
      <div className="result-icon">
        {isPassed ? '✓' : '✗'}
      </div>

      <div className="result-header">
        <h1>{isPassed ? 'Congratulations!' : 'Not Passed'}</h1>
        <p>
          {isPassed
            ? 'You have successfully completed this test!'
            : 'You need to improve your score to pass the test.'}
        </p>
      </div>

      <div className="result-score">
        <div className="score-display">
          <div className="score-number">{score}</div>
          <div className="score-total">/ {totalMarks}</div>
        </div>
        <div className="score-percentage">{percentage}%</div>
        <div className="score-label">Score</div>
      </div>

      <div className="result-details">
        <div className="detail-row">
          <span className="detail-label">Passing Marks:</span>
          <span className="detail-value">{passingMarks}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Obtained Marks:</span>
          <span className="detail-value" style={{ color: isPassed ? '#10b981' : '#ef4444' }}>
            {score}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Status:</span>
          <span className={`status-badge status-${isPassed ? 'pass' : 'fail'}`}>
            {isPassed ? 'PASSED' : 'FAILED'}
          </span>
        </div>
        {attemptDate && (
          <div className="detail-row">
            <span className="detail-label">Attempted On:</span>
            <span className="detail-value">
              {new Date(attemptDate).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultSummary;
