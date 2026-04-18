import React, { useState } from 'react';
import '../../styles/AdvancedOptions.css';

const AdvancedQuestionOptions = ({ question, onUpdate }) => {
  const [expandedSection, setExpandedSection] = useState('');
  const [activeValidationTab, setActiveValidationTab] = useState('email');

  const handleAnswerKeyChange = (e) => {
    onUpdate({
      ...question,
      answerKey: e.target.value,
    });
  };

  const handleFeedbackChange = (e) => {
    onUpdate({
      ...question,
      feedback: e.target.value,
    });
  };

  const handleValidationChange = (field, value) => {
    const validation = question.validation || {};
    const updatedValidation = {
      ...validation,
      [field]: value,
    };
    onUpdate({
      ...question,
      validation: updatedValidation,
    });
  };

  const handleValidationTypeChange = (type) => {
    const validation = {
      type: type,
    };
    // Reset other fields
    switch (type) {
      case 'email':
        break;
      case 'number':
        validation.minValue = '';
        validation.maxValue = '';
        break;
      case 'url':
        break;
      case 'regex':
        validation.pattern = '';
        break;
      case 'text':
        validation.minLength = '';
        validation.maxLength = '';
        break;
      case 'file':
        validation.allowedFileTypes = [];
        break;
      default:
        break;
    }
    onUpdate({
      ...question,
      validation,
    });
  };

  const validation = question.validation || {};

  const renderValidationContent = () => {
    switch (activeValidationTab) {
      case 'email':
        return (
          <div className="validation-tab-content">
            <div className="form-group">
              <label>Email Validation</label>
              <p className="help-text">
                Requires valid email format (example@domain.com)
              </p>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={validation.type === 'email'}
                  onChange={() =>
                    handleValidationTypeChange(
                      validation.type === 'email' ? '' : 'email'
                    )
                  }
                />
                <span>Enable email validation</span>
              </label>
            </div>
          </div>
        );

      case 'number':
        return (
          <div className="validation-tab-content">
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={validation.type === 'number'}
                onChange={() =>
                  handleValidationTypeChange(
                    validation.type === 'number' ? '' : 'number'
                  )
                }
              />
              <span>Enable number range validation</span>
            </label>
            {validation.type === 'number' && (
              <div className="range-input-group" style={{ marginTop: '12px' }}>
                <div className="form-group">
                  <label>Minimum Value (Optional)</label>
                  <input
                    type="number"
                    placeholder="e.g., 0"
                    value={validation.minValue || ''}
                    onChange={(e) =>
                      handleValidationChange('minValue', e.target.value)
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Maximum Value (Optional)</label>
                  <input
                    type="number"
                    placeholder="e.g., 100"
                    value={validation.maxValue || ''}
                    onChange={(e) =>
                      handleValidationChange('maxValue', e.target.value)
                    }
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 'url':
        return (
          <div className="validation-tab-content">
            <div className="form-group">
              <label>URL Validation</label>
              <p className="help-text">
                Requires valid URL format (https://example.com)
              </p>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={validation.type === 'url'}
                  onChange={() =>
                    handleValidationTypeChange(
                      validation.type === 'url' ? '' : 'url'
                    )
                  }
                />
                <span>Enable URL validation</span>
              </label>
            </div>
          </div>
        );

      case 'regex':
        return (
          <div className="validation-tab-content">
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={validation.type === 'regex'}
                onChange={() =>
                  handleValidationTypeChange(
                    validation.type === 'regex' ? '' : 'regex'
                  )
                }
              />
              <span>Enable custom pattern validation</span>
            </label>
            {validation.type === 'regex' && (
              <div className="form-group" style={{ marginTop: '12px' }}>
                <label>Regular Expression Pattern</label>
                <input
                  type="text"
                  placeholder="e.g., ^[A-Z]{3}[0-9]{5}$"
                  value={validation.pattern || ''}
                  onChange={(e) =>
                    handleValidationChange('pattern', e.target.value)
                  }
                />
                <p className="help-text">
                  Enter valid regex pattern for validation
                </p>
              </div>
            )}
          </div>
        );

      case 'text':
        return (
          <div className="validation-tab-content">
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={validation.type === 'text'}
                onChange={() =>
                  handleValidationTypeChange(
                    validation.type === 'text' ? '' : 'text'
                  )
                }
              />
              <span>Enable text length validation</span>
            </label>
            {validation.type === 'text' && (
              <div className="range-input-group" style={{ marginTop: '12px' }}>
                <div className="form-group">
                  <label>Minimum Characters (Optional)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g., 10"
                    value={validation.minLength || ''}
                    onChange={(e) =>
                      handleValidationChange('minLength', e.target.value)
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Maximum Characters (Optional)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g., 500"
                    value={validation.maxLength || ''}
                    onChange={(e) =>
                      handleValidationChange('maxLength', e.target.value)
                    }
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 'file':
        return (
          <div className="validation-tab-content">
            {question.type === 'fileUpload' ? (
              <>
                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={validation.type === 'file'}
                    onChange={() =>
                      handleValidationTypeChange(
                        validation.type === 'file' ? '' : 'file'
                      )
                    }
                  />
                  <span>Enable file type restriction</span>
                </label>
                {validation.type === 'file' && (
                  <div className="form-group" style={{ marginTop: '12px' }}>
                    <label>Allowed File Types (comma-separated)</label>
                    <input
                      type="text"
                      placeholder="e.g., pdf, doc, docx, jpg, png"
                      value={
                        Array.isArray(validation.allowedFileTypes)
                          ? validation.allowedFileTypes.join(', ')
                          : ''
                      }
                      onChange={(e) => {
                        const types = e.target.value
                          .split(',')
                          .map((t) => t.trim())
                          .filter((t) => t);
                        handleValidationChange('allowedFileTypes', types);
                      }}
                    />
                    <p className="help-text">
                      Restrict uploads to specific file types
                    </p>
                  </div>
                )}
              </>
            ) : (
              <p className="help-text">
                File type validation is only available for File Upload questions
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="advanced-options-container">
      <div className="advanced-header">
        <h3>Advanced Options</h3>
        <p>Answer key, feedback, and validation settings (optional)</p>
      </div>

      {/* Answer Key Section */}
      <div className="collapsible-section">
        <div
          className="section-toggle"
          onClick={() =>
            setExpandedSection(
              expandedSection === 'answerKey' ? '' : 'answerKey'
            )
          }
        >
          <div className="section-toggle-content">
            <span className="section-icon">🔑</span>
            <span className="section-label">Answer Key & Explanation</span>
          </div>
          {question.answerKey && (
            <span className="section-status">Added</span>
          )}
          <span
            className={`toggle-arrow ${
              expandedSection === 'answerKey' ? 'open' : ''
            }`}
          >
            ⌄
          </span>
        </div>

        {expandedSection === 'answerKey' && (
          <div className="section-body">
            <div className="form-group">
              <label>Answer Key</label>
              <textarea
                placeholder="Explain the correct answer. This helps instructors and can be shown to students in feedback."
                value={question.answerKey || ''}
                onChange={handleAnswerKeyChange}
              />
              <p className="help-text">
                Optional explanation of the correct answer
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Feedback Section */}
      <div className="collapsible-section">
        <div
          className="section-toggle"
          onClick={() =>
            setExpandedSection(
              expandedSection === 'feedback' ? '' : 'feedback'
            )
          }
        >
          <div className="section-toggle-content">
            <span className="section-icon">💬</span>
            <span className="section-label">Feedback Text</span>
          </div>
          {question.feedback && (
            <span className="section-status">Added</span>
          )}
          <span
            className={`toggle-arrow ${
              expandedSection === 'feedback' ? 'open' : ''
            }`}
          >
            ⌄
          </span>
        </div>

        {expandedSection === 'feedback' && (
          <div className="section-body">
            <div className="form-group">
              <label>Feedback Message</label>
              <textarea
                placeholder="Feedback shown to respondents after they answer this question. Can include encouragement, hints, or explanation."
                value={question.feedback || ''}
                onChange={handleFeedbackChange}
              />
              <p className="help-text">
                Shown to respondents based on test settings (score only, answers, or full feedback)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Validation Section */}
      <div className="collapsible-section">
        <div
          className="section-toggle"
          onClick={() =>
            setExpandedSection(
              expandedSection === 'validation' ? '' : 'validation'
            )
          }
        >
          <div className="section-toggle-content">
            <span className="section-icon">✓</span>
            <span className="section-label">Answer Validation</span>
          </div>
          {validation.type && (
            <span className="section-status">Active</span>
          )}
          <span
            className={`toggle-arrow ${
              expandedSection === 'validation' ? 'open' : ''
            }`}
          >
            ⌄
          </span>
        </div>

        {expandedSection === 'validation' && (
          <div className="section-body">
            <p
              style={{
                fontSize: '13px',
                color: '#5f6368',
                marginBottom: '16px',
              }}
            >
              Configure validation rules for the answer. Choose one validation type.
            </p>

            <div className="validation-tabs">
              <button
                className={`validation-tab ${
                  activeValidationTab === 'email' ? 'active' : ''
                }`}
                onClick={() => setActiveValidationTab('email')}
              >
                Email
              </button>
              <button
                className={`validation-tab ${
                  activeValidationTab === 'number' ? 'active' : ''
                }`}
                onClick={() => setActiveValidationTab('number')}
              >
                Number
              </button>
              <button
                className={`validation-tab ${
                  activeValidationTab === 'url' ? 'active' : ''
                }`}
                onClick={() => setActiveValidationTab('url')}
              >
                URL
              </button>
              <button
                className={`validation-tab ${
                  activeValidationTab === 'regex' ? 'active' : ''
                }`}
                onClick={() => setActiveValidationTab('regex')}
              >
                Pattern
              </button>
              <button
                className={`validation-tab ${
                  activeValidationTab === 'text' ? 'active' : ''
                }`}
                onClick={() => setActiveValidationTab('text')}
              >
                Text
              </button>
              {question.type === 'fileUpload' && (
                <button
                  className={`validation-tab ${
                    activeValidationTab === 'file' ? 'active' : ''
                  }`}
                  onClick={() => setActiveValidationTab('file')}
                >
                  File
                </button>
              )}
            </div>

            {renderValidationContent()}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedQuestionOptions;
