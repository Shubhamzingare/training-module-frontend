import React, { useState } from 'react';

const KeyPoints = ({ keyPoints = [], loading = false }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (loading) {
    return <div className="key-points-loading">Loading key points...</div>;
  }

  if (!keyPoints || keyPoints.length === 0) {
    return null;
  }

  return (
    <div className="key-points-section">
      <h2>Key Points</h2>
      <div className="key-points-list">
        {keyPoints.map((point, idx) => (
          <div key={idx} className="key-point-item">
            <button
              className="key-point-trigger"
              onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
            >
              <span className="key-point-icon">
                {expandedIndex === idx ? '▼' : '▶'}
              </span>
              <span className="key-point-title">{point.title || `Point ${idx + 1}`}</span>
            </button>
            {expandedIndex === idx && (
              <div className="key-point-content">
                <p>{point.content || point.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyPoints;
