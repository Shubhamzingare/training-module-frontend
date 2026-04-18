import React from 'react';
import { FormCheckbox, FormTextarea } from '../../common/Form';

const TestQuestion = ({ question, answer, onAnswerChange }) => {
  if (!question) return null;

  return (
    <div className="test-question">
      <div className="question-text">
        <h2>{question.text || question.title}</h2>
        {question.marks && (
          <div className="question-marks">Marks: {question.marks}</div>
        )}
      </div>

      {question.type === 'mcq' && (
        <div className="question-options">
          {question.options?.map((option, idx) => (
            <label key={idx} className="option-label">
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option}
                checked={answer === option}
                onChange={(e) => onAnswerChange(e.target.value)}
                className="option-radio"
              />
              <span className="option-text">{option}</span>
            </label>
          ))}
        </div>
      )}

      {question.type === 'descriptive' && (
        <FormTextarea
          name={`question-${question.id}`}
          value={answer || ''}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder="Enter your answer here..."
          rows={6}
        />
      )}
    </div>
  );
};

export default TestQuestion;
