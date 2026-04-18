import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import ResultSummary from '../../components/user/test-result/ResultSummary';
import QuestionReview from '../../components/user/test-result/QuestionReview';
import testService from '../../services/testService';
import useFetch from '../../hooks/useFetch';
import '../../styles/user/TestResultPage.css';

const TestResultPage = () => {
  const { attemptId } = useParams();
  const { testId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('summary');

  const { data: attempt, status } = useFetch(
    () => testService.getTestAttempt(testId, attemptId),
    [attemptId, testId]
  );

  if (status === 'loading') {
    return <div className="loading-state">Loading results...</div>;
  }

  if (status === 'error') {
    return (
      <div className="error-state">
        Error loading results. Please try again.
      </div>
    );
  }

  const isPassed = attempt?.percentage >= attempt?.passingMarks;

  return (
    <div className="test-result-page">
      <Header
        title="Test Results"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'My Scores', path: '/my-scores' },
          { label: 'Results' },
        ]}
      />

      <div className="page-content">
        {/* Result Summary */}
        <ResultSummary
          score={attempt?.score}
          totalMarks={attempt?.totalMarks}
          percentage={attempt?.percentage}
          passingMarks={attempt?.passingMarks}
          isPassed={isPassed}
          attemptDate={attempt?.attemptDate}
        />

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            Summary
          </button>
          <button
            className={`tab-button ${activeTab === 'review' ? 'active' : ''}`}
            onClick={() => setActiveTab('review')}
          >
            Review Answers
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'summary' && (
            <div className="summary-content">
              <div className="result-stats">
                <div className="stat-item">
                  <span className="stat-label">Questions Attempted</span>
                  <span className="stat-value">
                    {attempt?.questionsAttempted || 0} / {attempt?.totalQuestions || 0}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Correct Answers</span>
                  <span className="stat-value" style={{ color: '#10b981' }}>
                    {attempt?.correctAnswers || 0}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Wrong Answers</span>
                  <span className="stat-value" style={{ color: '#ef4444' }}>
                    {attempt?.wrongAnswers || 0}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Time Taken</span>
                  <span className="stat-value">
                    {attempt?.timeTaken || 0} minutes
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'review' && (
            <QuestionReview questions={attempt?.questions || []} />
          )}
        </div>

        {/* Actions */}
        <div className="result-actions">
          <Button
            onClick={() => navigate('/modules')}
            variant="outline"
            size="large"
          >
            ← Back to Modules
          </Button>
          <Button onClick={() => navigate('/my-scores')} size="large">
            View All Scores →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestResultPage;
