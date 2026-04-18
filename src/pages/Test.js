import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/TestTakingInterface.css';

const Test = ({ testId: propTestId }) => {
  const { testId: paramTestId } = useParams();
  const testId = propTestId || paramTestId;

  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState([]);

  // Fetch test and questions
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || (process.env.REACT_APP_API_URL || 'http://localhost:5000')}$1`);
        if (response.ok) {
          const data = await response.json();
          setTest(data.data);
          setTimeLeft(data.data.timeLimit * 60);
        }
      } catch (error) {
        console.error('Error fetching test:', error);
      }
      setLoading(false);
    };

    if (testId) {
      fetchTest();
    }
  }, [testId]);

  // Fetch questions
  useEffect(() => {
    if (test) {
      const fetchQuestions = async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL || (process.env.REACT_APP_API_URL || 'http://localhost:5000')}$1`
          );
          if (response.ok) {
            const data = await response.json();
            const shuffled = test.shuffleQuestions
              ? shuffleArray([...data.data])
              : data.data;
            setQuestions(shuffled);

            const initialAnswers = {};
            shuffled.forEach((q) => {
              if (q.type === 'mcq' || q.type === 'checkbox') {
                initialAnswers[q._id] = q.type === 'checkbox' ? [] : null;
              } else {
                initialAnswers[q._id] = '';
              }
            });
            setAnswers(initialAnswers);
          }
        } catch (error) {
          console.error('Error fetching questions:', error);
        }
      };

      fetchQuestions();
    }
  }, [test, testId]);

  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();

    const newErrors = [];
    questions.forEach((q, idx) => {
      if (!answers[q._id] || answers[q._id].length === 0) {
        newErrors.push(idx);
      }
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitted(true);
    // TODO: Submit to API
  }, [questions, answers]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || submitted) return;

    if (timeLeft <= 0) {
      if (test?.autoSubmitOnTimeEnd) {
        handleSubmit();
      }
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, submitted, test, handleSubmit]);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    });
  };

  const handleCheckboxChange = (questionId, optionIndex) => {
    const currentAnswers = answers[questionId] || [];
    const newAnswers = currentAnswers.includes(optionIndex)
      ? currentAnswers.filter((i) => i !== optionIndex)
      : [...currentAnswers, optionIndex];

    setAnswers({
      ...answers,
      [questionId]: newAnswers,
    });
  };

  const getAnsweredCount = () => {
    return questions.filter((q) => answers[q._id] && answers[q._id].length > 0)
      .length;
  };

  const isQuestionAnswered = (questionId) => {
    const answer = answers[questionId];
    if (answer === null || answer === '') return false;
    if (Array.isArray(answer)) return answer.length > 0;
    return true;
  };

  if (loading) {
    return <div className="test-loading">Loading test...</div>;
  }

  if (!test) {
    return <div className="test-error">Test not found</div>;
  }

  if (submitted) {
    return (
      <div className="test-container">
        <div className="submission-success">
          <div className="success-icon">✓</div>
          <h2>Test Submitted</h2>
          <p>Your answers have been recorded successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="test-interface">
      {/* Sticky Header */}
      <header className="test-header">
        <div className="header-title">
          <h1>{test.title}</h1>
        </div>
        <div className="header-timer">
          <span className={`timer ${timeLeft < 300 ? 'warning' : ''}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </header>

      <div className="test-container">
        {/* Main Content */}
        <div className="test-content">
          {/* Instructions */}
          <div className="instructions-card">
            <h3>Instructions</h3>
            <p>{test.description || 'Answer all questions to the best of your knowledge.'}</p>
            <p className="test-info">
              Total Questions: <strong>{questions.length}</strong> |
              Total Marks: <strong>{test.totalMarks}</strong> |
              Passing Marks: <strong>{test.passingMarks}</strong>
            </p>
          </div>

          {/* Error Alert */}
          {errors.length > 0 && (
            <div className="error-alert">
              <strong>Please answer all questions before submitting.</strong>
              <p>{errors.length} question(s) not answered.</p>
            </div>
          )}

          {/* Questions */}
          <div className="questions-container">
            {questions.map((question, idx) => (
              <div
                key={question._id}
                className={`question-card ${
                  errors.includes(idx) ? 'error' : ''
                } ${isQuestionAnswered(question._id) ? 'answered' : ''}`}
                id={`question-${idx}`}
              >
                {/* Question Header */}
                <div className="question-header">
                  <span className="question-number">Q{idx + 1}</span>
                  <span className="question-marks">{question.marks} marks</span>
                </div>

                {/* Question Text */}
                <p className="question-text">{question.questionText}</p>

                {/* Answer Section */}
                <div className="answer-section">
                  {/* MCQ */}
                  {question.type === 'mcq' && (
                    <div className="options-group">
                      {question.options.map((option, optIdx) => (
                        <label key={optIdx} className="option-label">
                          <input
                            type="radio"
                            name={`question-${question._id}`}
                            value={optIdx}
                            checked={answers[question._id] === optIdx}
                            onChange={() => handleAnswerChange(question._id, optIdx)}
                          />
                          <span className="option-text">{option.text}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Checkbox */}
                  {question.type === 'checkbox' && (
                    <div className="options-group">
                      {question.options.map((option, optIdx) => (
                        <label key={optIdx} className="option-label">
                          <input
                            type="checkbox"
                            checked={(answers[question._id] || []).includes(optIdx)}
                            onChange={() => handleCheckboxChange(question._id, optIdx)}
                          />
                          <span className="option-text">{option.text}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Short Answer */}
                  {question.type === 'short_answer' && (
                    <input
                      type="text"
                      className="short-answer-input"
                      placeholder="Type your answer here"
                      value={answers[question._id] || ''}
                      onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                    />
                  )}

                  {/* Descriptive */}
                  {question.type === 'descriptive' && (
                    <textarea
                      className="descriptive-answer-input"
                      placeholder="Type your answer here"
                      rows="4"
                      value={answers[question._id] || ''}
                      onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Section */}
          <div className="submit-section">
            <p className="answered-count">
              Answered: <strong>{getAnsweredCount()} / {questions.length}</strong>
            </p>
            <button className="btn btn-submit" onClick={handleSubmit}>
              Submit Test
            </button>
          </div>
        </div>

        {/* Question Navigator */}
        <aside className="question-navigator">
          <div className="nav-header">
            <h4>Questions</h4>
            <span className="nav-count">{getAnsweredCount()}/{questions.length}</span>
          </div>

          <div className="nav-list">
            {questions.map((question, idx) => (
              <a
                key={idx}
                href={`#question-${idx}`}
                className={`nav-item ${
                  isQuestionAnswered(question._id) ? 'answered' : 'unanswered'
                } ${errors.includes(idx) ? 'error' : ''}`}
                title={question.questionText.substring(0, 50)}
              >
                <span className="nav-number">{idx + 1}</span>
              </a>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="progress-section">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${(getAnsweredCount() / questions.length) * 100}%`,
                }}
              ></div>
            </div>
            <small className="progress-text">
              {Math.round((getAnsweredCount() / questions.length) * 100)}% complete
            </small>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Test;
