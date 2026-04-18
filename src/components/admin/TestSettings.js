import React, { useState } from 'react';
import '../../styles/AdvancedOptions.css';

const TestSettings = ({ test = {}, onUpdate }) => {
  const [expandedSection, setExpandedSection] = useState('general');

  const handleSettingChange = (field, value) => {
    onUpdate({
      ...test,
      [field]: value,
    });
  };

  const handleNestedChange = (parent, field, value) => {
    const parentData = test[parent] || {};
    onUpdate({
      ...test,
      [parent]: {
        ...parentData,
        [field]: value,
      },
    });
  };

  const testSettings = {
    general: {
      title: test.title || '',
      description: test.description || '',
      totalMarks: test.totalMarks || 100,
      passingMarks: test.passingMarks || 50,
      timeLimit: test.timeLimit || 0, // 0 = no limit
    },
    questionOptions: {
      shuffleQuestions: test.shuffleQuestions || false,
      shuffleAnswers: test.shuffleAnswers || false,
      showQuestionNumbers: test.showQuestionNumbers !== false,
    },
    responseSettings: {
      allowMultipleAttempts: test.allowMultipleAttempts || false,
      maxAttempts: test.maxAttempts || 1,
      responseVisibility: test.responseVisibility || 'scoreOnly', // scoreOnly, scoreAndAnswers, fullFeedback
      autoSubmitOnTimeEnd: test.autoSubmitOnTimeEnd || false,
      requireEmailBeforeTest: test.requireEmailBeforeTest || false,
    },
    display: {
      showProgressBar: test.showProgressBar !== false,
      randomizeOrder: test.randomizeOrder || false,
      showCorrectAnswer: test.showCorrectAnswer || false,
    },
    feedback: {
      customFeedbackText: test.customFeedbackText || '',
    },
  };

  const renderSection = (sectionKey, sectionData, sectionTitle, sectionIcon) => {
    const isExpanded = expandedSection === sectionKey;

    return (
      <div key={sectionKey} className="collapsible-section">
        <div
          className="section-toggle"
          onClick={() =>
            setExpandedSection(isExpanded ? '' : sectionKey)
          }
        >
          <div className="section-toggle-content">
            <span className="section-icon">{sectionIcon}</span>
            <span className="section-label">{sectionTitle}</span>
          </div>
          <span
            className={`toggle-arrow ${isExpanded ? 'open' : ''}`}
          >
            ⌄
          </span>
        </div>

        {isExpanded && (
          <div className="section-body">
            {sectionKey === 'general' && (
              <>
                <div className="form-group">
                  <label>Test Title *</label>
                  <input
                    type="text"
                    placeholder="Enter test title"
                    value={sectionData.title}
                    onChange={(e) =>
                      handleSettingChange('title', e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Description (Optional)</label>
                  <textarea
                    placeholder="Add instructions or context about the test"
                    value={sectionData.description}
                    onChange={(e) =>
                      handleSettingChange('description', e.target.value)
                    }
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Total Marks</label>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={sectionData.totalMarks}
                      onChange={(e) =>
                        handleSettingChange(
                          'totalMarks',
                          parseInt(e.target.value) || 1
                        )
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Passing Marks</label>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={sectionData.passingMarks}
                      onChange={(e) =>
                        handleSettingChange(
                          'passingMarks',
                          parseInt(e.target.value) || 1
                        )
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Time Limit (Minutes)</label>
                  <input
                    type="number"
                    min="0"
                    max="600"
                    placeholder="0 = No time limit"
                    value={sectionData.timeLimit}
                    onChange={(e) =>
                      handleSettingChange(
                        'timeLimit',
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                  <p className="help-text">
                    Leave at 0 for no time limit
                  </p>
                </div>
              </>
            )}

            {sectionKey === 'questionOptions' && (
              <>
                <div className="checkbox-group">
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={sectionData.shuffleQuestions}
                      onChange={(e) =>
                        handleSettingChange(
                          'shuffleQuestions',
                          e.target.checked
                        )
                      }
                    />
                    <span>Shuffle question order</span>
                  </label>
                  <p className="checkbox-description">
                    Randomize question order for each respondent
                  </p>
                </div>

                <div className="checkbox-group">
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={sectionData.shuffleAnswers}
                      onChange={(e) =>
                        handleSettingChange(
                          'shuffleAnswers',
                          e.target.checked
                        )
                      }
                    />
                    <span>Shuffle answer options</span>
                  </label>
                  <p className="checkbox-description">
                    Randomize answer order for MCQ and checkbox questions
                  </p>
                </div>

                <div className="checkbox-group">
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={sectionData.showQuestionNumbers}
                      onChange={(e) =>
                        handleSettingChange(
                          'showQuestionNumbers',
                          e.target.checked
                        )
                      }
                    />
                    <span>Show question numbers</span>
                  </label>
                  <p className="checkbox-description">
                    Display question number (Q1, Q2, etc.)
                  </p>
                </div>
              </>
            )}

            {sectionKey === 'responseSettings' && (
              <>
                <div className="checkbox-group">
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={sectionData.allowMultipleAttempts}
                      onChange={(e) =>
                        handleSettingChange(
                          'allowMultipleAttempts',
                          e.target.checked
                        )
                      }
                    />
                    <span>Allow multiple attempts</span>
                  </label>
                  <p className="checkbox-description">
                    Respondents can retake the test
                  </p>
                </div>

                {sectionData.allowMultipleAttempts && (
                  <div className="form-group" style={{ marginLeft: '26px' }}>
                    <label>Maximum Attempts</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      placeholder="Leave empty for unlimited"
                      value={sectionData.maxAttempts}
                      onChange={(e) =>
                        handleNestedChange(
                          'responseSettings',
                          'maxAttempts',
                          parseInt(e.target.value) || 1
                        )
                      }
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Response Visibility</label>
                  <select
                    value={sectionData.responseVisibility}
                    onChange={(e) =>
                      handleSettingChange(
                        'responseVisibility',
                        e.target.value
                      )
                    }
                  >
                    <option value="scoreOnly">
                      Score Only
                    </option>
                    <option value="scoreAndAnswers">
                      Score & Answers
                    </option>
                    <option value="fullFeedback">
                      Full Feedback
                    </option>
                  </select>
                  <p className="help-text">
                    What respondents see after submission
                  </p>
                </div>

                <div className="checkbox-group">
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={sectionData.autoSubmitOnTimeEnd}
                      onChange={(e) =>
                        handleSettingChange(
                          'autoSubmitOnTimeEnd',
                          e.target.checked
                        )
                      }
                    />
                    <span>Auto-submit when time ends</span>
                  </label>
                  <p className="checkbox-description">
                    Automatically submit test when time limit is reached
                  </p>
                </div>

                <div className="checkbox-group">
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={sectionData.requireEmailBeforeTest}
                      onChange={(e) =>
                        handleSettingChange(
                          'requireEmailBeforeTest',
                          e.target.checked
                        )
                      }
                    />
                    <span>Require email before test</span>
                  </label>
                  <p className="checkbox-description">
                    Collect email address before respondent starts
                  </p>
                </div>
              </>
            )}

            {sectionKey === 'display' && (
              <>
                <div className="checkbox-group">
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={sectionData.showProgressBar}
                      onChange={(e) =>
                        handleSettingChange(
                          'showProgressBar',
                          e.target.checked
                        )
                      }
                    />
                    <span>Show progress bar</span>
                  </label>
                  <p className="checkbox-description">
                    Display progress indicator during test
                  </p>
                </div>

                <div className="checkbox-group">
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={sectionData.randomizeOrder}
                      onChange={(e) =>
                        handleSettingChange(
                          'randomizeOrder',
                          e.target.checked
                        )
                      }
                    />
                    <span>Randomize display order</span>
                  </label>
                  <p className="checkbox-description">
                    Randomize order of questions and options
                  </p>
                </div>

                <div className="checkbox-group">
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={sectionData.showCorrectAnswer}
                      onChange={(e) =>
                        handleSettingChange(
                          'showCorrectAnswer',
                          e.target.checked
                        )
                      }
                    />
                    <span>Show correct answers</span>
                  </label>
                  <p className="checkbox-description">
                    Display correct answers in feedback (if enabled)
                  </p>
                </div>
              </>
            )}

            {sectionKey === 'feedback' && (
              <>
                <div className="form-group">
                  <label>Custom Feedback Text (Optional)</label>
                  <textarea
                    placeholder="Message shown to respondents after test submission. Can include encouragement, next steps, or resources."
                    value={sectionData.customFeedbackText}
                    onChange={(e) =>
                      handleSettingChange(
                        'customFeedbackText',
                        e.target.value
                      )
                    }
                  />
                  <p className="help-text">
                    Displayed after test submission
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="test-settings-panel">
      <div className="advanced-header">
        <h3>Test Settings</h3>
        <p>Configure test behavior, display options, and feedback</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {renderSection(
          'general',
          testSettings.general,
          'General Settings',
          '⚙'
        )}
        {renderSection(
          'questionOptions',
          testSettings.questionOptions,
          'Question Options',
          '❓'
        )}
        {renderSection(
          'responseSettings',
          testSettings.responseSettings,
          'Response Settings',
          '✓'
        )}
        {renderSection(
          'display',
          testSettings.display,
          'Display',
          '👁'
        )}
        {renderSection(
          'feedback',
          testSettings.feedback,
          'Feedback',
          '💬'
        )}
      </div>
    </div>
  );
};

export default TestSettings;
