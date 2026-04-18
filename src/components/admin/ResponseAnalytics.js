import React, { useState, useMemo } from 'react';
import '../../styles/Phase3Components.css';

/**
 * ResponseAnalytics Component
 *
 * Dashboard showing test response analytics with charts and statistics
 *
 * Props:
 *   - responses: Array of response objects. Expected structure:
 *       [{
 *         id: string,
 *         questionId: string,
 *         questionType: string (mcq, text, checkbox, etc),
 *         answer: any,
 *         isCorrect: boolean,
 *         score: number,
 *         timeTaken: number (in seconds),
 *         timestamp: ISO string
 *       }]
 *   - questions: Array of question objects. Expected structure:
 *       [{
 *         id: string,
 *         text: string,
 *         type: string,
 *         options: [{text: string, isCorrect: boolean}],
 *         correctAnswer: any
 *       }]
 *   - usesMockData: Show indicator if using mock data (default: true)
 *
 * Returns: { analyticsData, charts, summaryStats }
 */
const ResponseAnalytics = ({
  responses = [],
  questions = [],
  usesMockData = true,
}) => {
  const [filterDateRange, setFilterDateRange] = useState('all');
  const [filterQuestionType, setFilterQuestionType] = useState('all');
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  // Mock data for demo
  const mockResponses = [
    { id: '1', questionId: 'q1', questionType: 'mcq', answer: 'Option A', isCorrect: true, score: 5, timeTaken: 12, timestamp: '2024-04-15T10:30:00Z' },
    { id: '2', questionId: 'q1', questionType: 'mcq', answer: 'Option B', isCorrect: false, score: 0, timeTaken: 8, timestamp: '2024-04-15T10:35:00Z' },
    { id: '3', questionId: 'q1', questionType: 'mcq', answer: 'Option A', isCorrect: true, score: 5, timeTaken: 15, timestamp: '2024-04-15T10:40:00Z' },
    { id: '4', questionId: 'q2', questionType: 'text', answer: 'React is...', isCorrect: true, score: 3, timeTaken: 45, timestamp: '2024-04-15T10:30:00Z' },
    { id: '5', questionId: 'q2', questionType: 'text', answer: 'JavaScript library', isCorrect: true, score: 3, timeTaken: 32, timestamp: '2024-04-15T10:35:00Z' },
    { id: '6', questionId: 'q2', questionType: 'text', answer: 'Code', isCorrect: false, score: 0, timeTaken: 20, timestamp: '2024-04-15T10:40:00Z' },
    { id: '7', questionId: 'q3', questionType: 'checkbox', answer: ['A', 'B'], isCorrect: true, score: 4, timeTaken: 25, timestamp: '2024-04-15T10:30:00Z' },
    { id: '8', questionId: 'q3', questionType: 'checkbox', answer: ['A'], isCorrect: false, score: 0, timeTaken: 18, timestamp: '2024-04-15T10:35:00Z' },
  ];

  const mockQuestions = [
    { id: 'q1', text: 'What is React?', type: 'mcq', options: [{ text: 'Option A', isCorrect: true }, { text: 'Option B', isCorrect: false }, { text: 'Option C', isCorrect: false }] },
    { id: 'q2', text: 'Explain React in detail', type: 'text', correctAnswer: 'JavaScript library' },
    { id: 'q3', text: 'Select correct features', type: 'checkbox', options: [{ text: 'A', isCorrect: true }, { text: 'B', isCorrect: true }, { text: 'C', isCorrect: false }] },
  ];

  const activeResponses = usesMockData ? mockResponses : responses;
  const activeQuestions = usesMockData ? mockQuestions : questions;

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    if (activeResponses.length === 0) {
      return {
        totalResponses: 0,
        passRate: 0,
        averageScore: 0,
        averageTime: 0,
      };
    }

    const correctResponses = activeResponses.filter((r) => r.isCorrect).length;
    const totalScore = activeResponses.reduce((sum, r) => sum + (r.score || 0), 0);
    const totalTime = activeResponses.reduce((sum, r) => sum + (r.timeTaken || 0), 0);

    return {
      totalResponses: activeResponses.length,
      passRate: Math.round((correctResponses / activeResponses.length) * 100),
      averageScore: (totalScore / activeResponses.length).toFixed(2),
      averageTime: Math.round(totalTime / activeResponses.length),
    };
  }, [activeResponses]);

  // Calculate question-wise analytics
  const questionAnalytics = useMemo(() => {
    return activeQuestions.map((question) => {
      const questionResponses = activeResponses.filter((r) => r.questionId === question.id);

      if (questionResponses.length === 0) {
        return {
          questionId: question.id,
          questionText: question.text,
          questionType: question.type,
          totalResponses: 0,
          correctResponses: 0,
          correctnessRate: 0,
          averageTime: 0,
          answerDistribution: {},
        };
      }

      const correctResponses = questionResponses.filter((r) => r.isCorrect).length;
      const totalTime = questionResponses.reduce((sum, r) => sum + (r.timeTaken || 0), 0);

      // Build answer distribution
      const answerDistribution = {};
      questionResponses.forEach((response) => {
        const answer = Array.isArray(response.answer)
          ? response.answer.join(', ')
          : response.answer;
        answerDistribution[answer] = (answerDistribution[answer] || 0) + 1;
      });

      return {
        questionId: question.id,
        questionText: question.text,
        questionType: question.type,
        totalResponses: questionResponses.length,
        correctResponses,
        correctnessRate: Math.round((correctResponses / questionResponses.length) * 100),
        averageTime: Math.round(totalTime / questionResponses.length),
        answerDistribution,
      };
    });
  }, [activeResponses, activeQuestions]);

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  // Simple bar chart implementation using CSS
  const BarChart = ({ data, title }) => {
    const maxValue = Math.max(...Object.values(data), 1);

    return (
      <div className="analytics-chart">
        <h4 className="chart-title">{title}</h4>
        <div className="bar-chart">
          {Object.entries(data).map(([label, value]) => (
            <div key={label} className="bar-item">
              <div className="bar-label">{label.substring(0, 20)}...</div>
              <div className="bar-container">
                <div
                  className="bar-fill"
                  style={{ width: `${(value / maxValue) * 100}%` }}
                ></div>
              </div>
              <div className="bar-value">{value}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Simple pie chart implementation using SVG
  const PieChart = ({ data, title }) => {
    const values = Object.values(data);
    const total = values.reduce((a, b) => a + b, 0);
    const colors = ['#4285f4', '#34a853', '#fbbc04', '#ea4335', '#9c27b0', '#00bcd4'];

    let currentAngle = 0;
    const slices = Object.entries(data).map(([label, value], index) => {
      const sliceAngle = (value / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;
      currentAngle = endAngle;

      const radius = 45;
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = 50 + radius * Math.cos(startRad);
      const y1 = 50 + radius * Math.sin(startRad);
      const x2 = 50 + radius * Math.cos(endRad);
      const y2 = 50 + radius * Math.sin(endRad);

      const largeArc = sliceAngle > 180 ? 1 : 0;
      const pathData = [
        `M 50 50`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
        'Z',
      ].join(' ');

      return { label, value, pathData, color: colors[index % colors.length] };
    });

    return (
      <div className="analytics-chart">
        <h4 className="chart-title">{title}</h4>
        <div className="pie-chart-container">
          <svg viewBox="0 0 100 100" className="pie-chart">
            {slices.map((slice, index) => (
              <path
                key={index}
                d={slice.pathData}
                fill={slice.color}
                stroke="white"
                strokeWidth="0.5"
              />
            ))}
          </svg>
          <div className="pie-legend">
            {slices.map((slice, index) => (
              <div key={index} className="legend-item">
                <span
                  className="legend-color"
                  style={{ backgroundColor: slice.color }}
                ></span>
                <span className="legend-label">
                  {slice.label.substring(0, 15)}: {slice.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="response-analytics">
      {usesMockData && (
        <div className="mock-data-notice">
          ⚠️ Using mock data for demonstration. Connect to real API for actual responses.
        </div>
      )}

      {/* Summary Stats */}
      <div className="analytics-header">
        <h2>Response Analytics</h2>
        <div className="analytics-filters">
          <div className="filter-group">
            <label>Date Range:</label>
            <select
              value={filterDateRange}
              onChange={(e) => setFilterDateRange(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Question Type:</label>
            <select
              value={filterQuestionType}
              onChange={(e) => setFilterQuestionType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="mcq">MCQ</option>
              <option value="text">Text</option>
              <option value="checkbox">Checkbox</option>
            </select>
          </div>
        </div>
      </div>

      <div className="summary-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <p className="stat-label">Total Responses</p>
            <p className="stat-value">{summaryStats.totalResponses}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <p className="stat-label">Pass Rate</p>
            <p className="stat-value">{summaryStats.passRate}%</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <p className="stat-label">Average Score</p>
            <p className="stat-value">{summaryStats.averageScore}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <p className="stat-label">Average Time</p>
            <p className="stat-value">{formatTime(summaryStats.averageTime)}</p>
          </div>
        </div>
      </div>

      {/* Question-wise Analytics */}
      <div className="question-analytics-section">
        <h3>Question-wise Analytics</h3>

        {questionAnalytics.length === 0 ? (
          <div className="empty-analytics">
            <p>No responses yet. Questions will appear here once responses are submitted.</p>
          </div>
        ) : (
          <div className="question-analytics-list">
            {questionAnalytics.map((qa) => (
              <div key={qa.questionId} className="question-analytics-card">
                <div
                  className="question-analytics-header"
                  onClick={() =>
                    setExpandedQuestion(
                      expandedQuestion === qa.questionId ? null : qa.questionId
                    )
                  }
                >
                  <div className="question-analytics-title">
                    <span className="question-number">Q{questionAnalytics.indexOf(qa) + 1}</span>
                    <span className="question-text">{qa.questionText}</span>
                    <span className="question-type-badge">{qa.questionType}</span>
                  </div>
                  <div className="question-analytics-stats">
                    <span className="stat-mini">
                      ✓ {qa.correctResponses}/{qa.totalResponses}
                    </span>
                    <span className="stat-mini">{qa.correctnessRate}%</span>
                    <span className="stat-mini">{formatTime(qa.averageTime)}</span>
                    <span className="expand-icon">
                      {expandedQuestion === qa.questionId ? '▼' : '▶'}
                    </span>
                  </div>
                </div>

                {expandedQuestion === qa.questionId && (
                  <div className="question-analytics-details">
                    <div className="analytics-grid">
                      <div className="analytics-stat">
                        <p className="stat-label">Correctness Rate</p>
                        <div className="stat-bar">
                          <div
                            className="stat-bar-fill"
                            style={{ width: `${qa.correctnessRate}%` }}
                          ></div>
                        </div>
                        <p className="stat-text">{qa.correctnessRate}%</p>
                      </div>
                      <div className="analytics-stat">
                        <p className="stat-label">Average Time</p>
                        <p className="stat-value">{formatTime(qa.averageTime)}</p>
                      </div>
                      <div className="analytics-stat">
                        <p className="stat-label">Total Responses</p>
                        <p className="stat-value">{qa.totalResponses}</p>
                      </div>
                    </div>

                    {/* Answer Distribution Chart */}
                    {Object.keys(qa.answerDistribution).length > 0 && (
                      <>
                        {qa.questionType === 'mcq' || qa.questionType === 'checkbox' ? (
                          <PieChart
                            data={qa.answerDistribution}
                            title="Answer Distribution"
                          />
                        ) : (
                          <BarChart
                            data={qa.answerDistribution}
                            title="Common Answers"
                          />
                        )}
                      </>
                    )}

                    <button className="export-question-btn">
                      ⬇️ Export Question Data
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponseAnalytics;
