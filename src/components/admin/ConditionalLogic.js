import React, { useState } from 'react';
import '../../styles/AdvancedOptions.css';

const ConditionalLogic = ({ conditions = [], questions = [], onUpdate }) => {
  const [expandedSection, setExpandedSection] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    triggerQuestionId: '',
    condition: 'equals',
    value: '',
    targetQuestionId: '',
    action: 'show',
  });

  const CONDITION_TYPES = [
    { value: 'equals', label: 'Equals' },
    { value: 'notEquals', label: 'Not Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'greaterThan', label: 'Greater Than' },
    { value: 'lessThan', label: 'Less Than' },
    { value: 'greaterThanOrEqual', label: 'Greater Than or Equal' },
    { value: 'lessThanOrEqual', label: 'Less Than or Equal' },
  ];

  const ACTION_TYPES = [
    { value: 'show', label: 'Show' },
    { value: 'hide', label: 'Hide' },
    { value: 'require', label: 'Make Required' },
  ];

  const handleAddCondition = () => {
    if (
      !formData.triggerQuestionId ||
      !formData.value ||
      !formData.targetQuestionId
    ) {
      return;
    }

    const newCondition = {
      id: `condition-${Date.now()}`,
      triggerQuestionId: formData.triggerQuestionId,
      condition: formData.condition,
      value: formData.value,
      targetQuestionId: formData.targetQuestionId,
      action: formData.action,
    };

    const updatedConditions = [...conditions, newCondition];
    onUpdate(updatedConditions);

    setFormData({
      triggerQuestionId: '',
      condition: 'equals',
      value: '',
      targetQuestionId: '',
      action: 'show',
    });
    setShowForm(false);
  };

  const handleDeleteCondition = (conditionId) => {
    const updatedConditions = conditions.filter((c) => c.id !== conditionId);
    onUpdate(updatedConditions);
  };

  const getTriggerQuestionLabel = (questionId) => {
    const question = questions.find((q) => q.id === questionId);
    return question ? question.questionText : 'Unknown Question';
  };

  const getConditionLabel = (conditionValue) => {
    const condition = CONDITION_TYPES.find((c) => c.value === conditionValue);
    return condition ? condition.label : conditionValue;
  };

  const getActionLabel = (actionValue) => {
    const action = ACTION_TYPES.find((a) => a.value === actionValue);
    return action ? action.label : actionValue;
  };

  const getTargetQuestionLabel = (questionId) => {
    const question = questions.find((q) => q.id === questionId);
    return question ? question.questionText : 'Unknown Question';
  };

  const availableQuestions = questions.filter((q) => q.questionText);

  return (
    <div className="advanced-options-container">
      <div className="advanced-header">
        <h3>Conditional Logic</h3>
        <p>Show, hide, or require questions based on previous answers</p>
      </div>

      {/* Conditions List */}
      {conditions.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          {conditions.map((condition) => (
            <div key={condition.id} className="condition-item">
              <div className="item-content">
                <div className="item-text">
                  If answer to "<strong>{getTriggerQuestionLabel(condition.triggerQuestionId)}</strong>" {getConditionLabel(condition.condition)} "<strong>{condition.value}</strong>"
                </div>
                <div className="item-subtext">
                  Then {getActionLabel(condition.action).toLowerCase()} "
                  <strong>{getTargetQuestionLabel(condition.targetQuestionId)}</strong>"
                </div>
              </div>
              <div className="item-actions">
                <button
                  className="item-btn delete"
                  onClick={() => handleDeleteCondition(condition.id)}
                  title="Delete condition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {conditions.length === 0 && !showForm && (
        <div className="empty-state-message">
          No conditional logic rules created yet. Add a rule to control question visibility.
        </div>
      )}

      {/* Add Condition Form */}
      {showForm && (
        <div className="condition-builder">
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#202124' }}>
              Add Conditional Logic
            </h4>
          </div>

          {availableQuestions.length === 0 ? (
            <p className="help-text" style={{ color: '#d33b27' }}>
              No questions available yet. Create at least two questions before adding conditional logic.
            </p>
          ) : (
            <>
              {/* Trigger Question */}
              <div className="condition-row">
                <div className="condition-field">
                  <label>If answer to</label>
                  <select
                    value={formData.triggerQuestionId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        triggerQuestionId: e.target.value,
                      })
                    }
                  >
                    <option value="">Select question...</option>
                    {availableQuestions.map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.questionText}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Condition Type */}
              <div className="condition-row">
                <div className="condition-field">
                  <label>Condition</label>
                  <select
                    value={formData.condition}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        condition: e.target.value,
                      })
                    }
                  >
                    {CONDITION_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Value */}
                <div className="condition-field">
                  <label>Value</label>
                  <input
                    type="text"
                    placeholder="e.g., Yes, Option A, 5"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        value: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Target Question and Action */}
              <div className="condition-row">
                <div className="condition-field">
                  <label>Then</label>
                  <select
                    value={formData.action}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        action: e.target.value,
                      })
                    }
                  >
                    {ACTION_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target Question */}
                <div className="condition-field">
                  <label>This question</label>
                  <select
                    value={formData.targetQuestionId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        targetQuestionId: e.target.value,
                      })
                    }
                  >
                    <option value="">Select question...</option>
                    {availableQuestions
                      .filter(
                        (q) => q.id !== formData.triggerQuestionId
                      )
                      .map((q) => (
                        <option key={q.id} value={q.id}>
                          {q.questionText}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Form Actions */}
              <div
                className="form-actions"
                style={{ marginTop: '16px' }}
              >
                <button
                  className="btn-submit"
                  onClick={handleAddCondition}
                  disabled={
                    !formData.triggerQuestionId ||
                    !formData.value ||
                    !formData.targetQuestionId
                  }
                >
                  Add Condition
                </button>
                <button
                  className="btn-cancel"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({
                      triggerQuestionId: '',
                      condition: 'equals',
                      value: '',
                      targetQuestionId: '',
                      action: 'show',
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Add Button */}
      {!showForm && availableQuestions.length > 0 && (
        <button
          className="btn-add"
          onClick={() => setShowForm(true)}
        >
          + Add Conditional Logic
        </button>
      )}

      {!showForm && availableQuestions.length === 0 && (
        <p
          className="help-text"
          style={{ marginTop: '12px', color: '#5f6368' }}
        >
          Create at least two questions to use conditional logic
        </p>
      )}
    </div>
  );
};

export default ConditionalLogic;
