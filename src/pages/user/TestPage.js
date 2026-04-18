import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import TestQuestion from '../../components/user/test/TestQuestion';
import TestTimer from '../../components/user/test/TestTimer';
import testService from '../../services/testService';
import useFetch from '../../hooks/useFetch';
import '../../styles/user/TestPage.css';

const TestPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isStarted, setIsStarted] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const { data: test, status: testStatus } = useFetch(
    () => testService.getTestById(testId),
    [testId]
  );

  const questions = test?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerChange = (answer) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: answer,
    });
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitTest = async () => {
    try {
      const result = await testService.submitTest(testId, answers);
      navigate(`/test-result/${result.attemptId}`);
    } catch (error) {
      console.error('Error submitting test:', error);
    }
  };

  if (testStatus === 'loading') {
    return <div className="loading-state">Loading test...</div>;
  }

  if (testStatus === 'error') {
    return (
      <div className="error-state">
        Error loading test. Please try again.
        <Button onClick={() => navigate('/modules')}>Back to Modules</Button>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="test-page">
        <Header
          title={test?.title}
          breadcrumbs={[
            { label: 'Home', path: '/' },
            { label: 'Modules', path: '/modules' },
            { label: test?.title },
          ]}
        />

        <div className="test-start-container">
          <div className="test-instructions">
            <h2>Test Instructions</h2>
            <div className="instructions-content">
              <p>
                <strong>Test Name:</strong> {test?.title}
              </p>
              <p>
                <strong>Total Questions:</strong> {questions.length}
              </p>
              <p>
                <strong>Total Marks:</strong> {test?.totalMarks}
              </p>
              <p>
                <strong>Passing Marks:</strong> {test?.passingMarks}
              </p>
              <p>
                <strong>Duration:</strong> {test?.duration} minutes
              </p>

              <div className="instructions-rules">
                <h3>Please note:</h3>
                <ul>
                  <li>You will have {test?.duration} minutes to complete this test</li>
                  <li>You can navigate between questions</li>
                  <li>All answers must be submitted before the timer ends</li>
                  <li>Once submitted, you cannot modify your answers</li>
                  <li>You need to score at least {test?.passingMarks} marks to pass</li>
                </ul>
              </div>
            </div>

            <div className="test-actions">
              <Button onClick={() => setIsStarted(true)} size="large">
                Start Test
              </Button>
              <Button
                onClick={() => navigate('/modules')}
                variant="outline"
                size="large"
              >
                Back to Modules
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="test-page">
      <Header
        title={test?.title}
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Modules', path: '/modules' },
          { label: test?.title },
        ]}
      />

      <div className="test-container">
        <div className="test-sidebar">
          <TestTimer duration={test?.duration} onTimeEnd={handleSubmitTest} />

          <div className="question-navigator">
            <h3>Questions</h3>
            <div className="question-buttons">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  className={`question-btn ${
                    idx === currentQuestionIndex ? 'active' : ''
                  } ${answers[q.id] ? 'answered' : ''}`}
                  onClick={() => setCurrentQuestionIndex(idx)}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="test-main">
          <div className="question-counter">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>

          <TestQuestion
            question={currentQuestion}
            answer={answers[currentQuestion?.id]}
            onAnswerChange={handleAnswerChange}
          />

          <div className="test-navigation">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              variant="secondary"
            >
              ← Previous
            </Button>

            {!isLastQuestion ? (
              <Button onClick={handleNext}>Next →</Button>
            ) : (
              <Button
                onClick={() => setShowSubmitConfirm(true)}
                variant="success"
              >
                Submit Test
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h2>Submit Test?</h2>
            </div>
            <div className="modal-content">
              <p>Are you sure you want to submit your test?</p>
              <p>
                You have answered{' '}
                <strong>{Object.keys(answers).length}</strong> out of{' '}
                <strong>{questions.length}</strong> questions.
              </p>
              <p>Once submitted, you cannot modify your answers.</p>
            </div>
            <div className="modal-footer">
              <Button
                variant="secondary"
                onClick={() => setShowSubmitConfirm(false)}
              >
                Continue Test
              </Button>
              <Button onClick={handleSubmitTest}>Submit Test</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPage;
