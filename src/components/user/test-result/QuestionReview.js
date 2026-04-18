import React, { useState } from 'react';

const QuestionReview = ({ questions = [] }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  return (
    <div className="question-review">
      {questions.map((question, idx) => (
        <div key={idx} className="review-item">
          <button
            className={`review-question ${
              question.isCorrect ? 'correct' : 'incorrect'
            }`}
            onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
          >
            <span className="review-icon">
              {question.isCorrect ? '✓' : '✗'}
            </span>
            <span className="review-text">
              Q{idx + 1}: {question.text}
            </span>
            <span className="review-arrow">
              {expandedIndex === idx ? '▼' : '▶'}
            </span>
          </button>

          {expandedIndex === idx && (
            <div className="review-answer">
              <div className="answer-section">
                <h4>Your Answer:</h4>
                <p className={question.isCorrect ? 'correct' : 'incorrect'}>
                  {question.userAnswer || 'No answer provided'}
                </p>
              </div>

              {!question.isCorrect && (
                <div className="answer-section">
                  <h4>Correct Answer:</h4>
                  <p className="correct">{question.correctAnswer}</p>
                </div>
              )}

              {question.explanation && (
                <div className="answer-section">
                  <h4>Explanation:</h4>
                  <p>{question.explanation}</p>
                </div>
              )}

              {question.marks !== undefined && (
                <div className="answer-section">
                  <h4>Marks:</h4>
                  <p>
                    {question.obtainedMarks || 0} / {question.marks}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuestionReview;
