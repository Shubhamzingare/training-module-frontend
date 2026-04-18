import React, { useState, useEffect } from 'react';
import '../../styles/admin/TestManagement.css';

const TestManagement = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTestForm, setShowTestForm] = useState(false);
  const [selectedTestDetail, setSelectedTestDetail] = useState(null);
  const [activeTab, setActiveTab] = useState('list');

  const [testForm, setTestForm] = useState({
    title: '',
    description: '',
    totalMarks: 100,
    passingMarks: 50,
    timeLimit: 45,
    status: 'draft',
    // Advanced Settings
    shuffleQuestions: false,
    shuffleOptions: false,
    allowMultipleAttempts: false,
    maxAttempts: 1,
    responseVisibility: 'score_only', // 'score_only', 'score_and_answers', 'full_feedback'
    autoSubmitOnTimeEnd: true,
  });

  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    questionText: '',
    type: 'mcq',
    marks: 1,
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ],
  });

  // Edit states
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingTestSettings, setEditingTestSettings] = useState(false);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch('http://localhost:5000/api/admin/tests', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setTests(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
    }

    setLoading(false);
  };

  const fetchTestDetail = async (testId) => {
    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`http://localhost:5000/api/admin/tests/${testId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedTestDetail(data.data);

        // Fetch questions
        const qRes = await fetch(`http://localhost:5000/api/admin/questions?testId=${testId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (qRes.ok) {
          const qData = await qRes.json();
          setQuestions(qData.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching test detail:', error);
    }
  };

  const handleCreateTest = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch('http://localhost:5000/api/admin/tests', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testForm),
      });

      if (response.ok) {
        alert('Test created successfully!');
        setTestForm({
          title: '',
          description: '',
          totalMarks: 100,
          passingMarks: 50,
          timeLimit: 45,
          status: 'draft',
          shuffleQuestions: false,
          shuffleOptions: false,
          allowMultipleAttempts: false,
          maxAttempts: 1,
          responseVisibility: 'score_only',
          autoSubmitOnTimeEnd: true,
        });
        setShowTestForm(false);
        fetchTests();
      } else {
        alert('Failed to create test');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating test');
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!selectedTestDetail) return;

    const token = localStorage.getItem('adminToken');
    const testId = selectedTestDetail._id;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/tests/${testId}/questions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newQuestion),
      });

      if (response.ok) {
        alert('Question added successfully!');
        setNewQuestion({
          questionText: '',
          type: 'mcq',
          marks: 1,
          options: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
          ],
        });
        fetchTestDetail(testId);
      } else {
        alert('Failed to add question');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding question');
    }
  };

  const handleToggleStatus = async (testId, currentStatus) => {
    const token = localStorage.getItem('adminToken');
    const newStatus = currentStatus === 'draft' ? 'active' : 'draft';

    try {
      const response = await fetch(`http://localhost:5000/api/admin/tests/${testId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        alert(`Test status changed to ${newStatus}`);
        fetchTests();
        if (selectedTestDetail?._id === testId) {
          fetchTestDetail(testId);
        }
      } else {
        alert('Failed to toggle test status');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error toggling status');
    }
  };

  const handleDeleteTest = async (testId) => {
    if (!window.confirm('Are you sure you want to delete this test?')) return;

    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`http://localhost:5000/api/admin/tests/${testId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        alert('Test deleted successfully!');
        fetchTests();
        setSelectedTestDetail(null);
      } else {
        alert('Failed to delete test');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error deleting test');
    }
  };

  // Edit Question Handler
  const handleEditQuestion = (question) => {
    setEditingQuestionId(question._id);
    setEditingQuestion({ ...question });
  };

  // Save Edited Question
  const handleSaveEditedQuestion = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const testId = selectedTestDetail._id;

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/tests/${testId}/questions/${editingQuestionId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingQuestion),
        }
      );

      if (response.ok) {
        alert('Question updated successfully!');
        setEditingQuestionId(null);
        setEditingQuestion(null);
        fetchTestDetail(testId);
      } else {
        alert('Failed to update question');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating question');
    }
  };

  // Delete Question
  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;

    const token = localStorage.getItem('adminToken');
    const testId = selectedTestDetail._id;

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/tests/${testId}/questions/${questionId}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );

      if (response.ok) {
        alert('Question deleted successfully!');
        fetchTestDetail(testId);
      } else {
        alert('Failed to delete question');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error deleting question');
    }
  };

  // Reorder Questions
  const handleReorderQuestion = async (questionId, direction) => {
    const token = localStorage.getItem('adminToken');
    const testId = selectedTestDetail._id;
    const currentIndex = questions.findIndex((q) => q._id === questionId);

    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === questions.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const newOrder = [...questions];
    [newOrder[currentIndex], newOrder[newIndex]] = [
      newOrder[newIndex],
      newOrder[currentIndex],
    ];

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/tests/${testId}/reorder-questions`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            questionIds: newOrder.map((q) => q._id),
          }),
        }
      );

      if (response.ok) {
        setQuestions(newOrder);
      } else {
        alert('Failed to reorder questions');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error reordering questions');
    }
  };

  const getStatusBadge = (status) => {
    return status === 'active' ? 'Active' : 'Draft';
  };

  return (
    <div className="test-management">
      <div className="test-header">
        <h2>Test Management</h2>
        <p>Create and manage training tests</p>
      </div>

      <div className="test-tabs">
        <button
          className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          Tests List
        </button>
        <button
          className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Create Test
        </button>
        {selectedTestDetail && (
          <button
            className={`tab-btn ${activeTab === 'detail' ? 'active' : ''}`}
            onClick={() => setActiveTab('detail')}
          >
            Test Detail
          </button>
        )}
      </div>

      {/* Tests List Tab */}
      {activeTab === 'list' && (
        <div className="tab-content">
          <div className="tests-table-container">
            {loading ? (
              <p className="loading-text">Loading tests...</p>
            ) : tests.length === 0 ? (
              <p className="empty-state">No tests yet. Create one to get started!</p>
            ) : (
              <table className="tests-table">
                <thead>
                  <tr>
                    <th>Test Name</th>
                    <th>Module Name</th>
                    <th>Created Date</th>
                    <th>Questions</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tests.map((test) => (
                    <tr key={test._id}>
                      <td className="test-name">{test.title}</td>
                      <td className="module-name">
                        {test.moduleId ? (typeof test.moduleId === 'object' ? test.moduleId.title : test.moduleId) : '-'}
                      </td>
                      <td className="created-date">
                        {new Date(test.createdAt).toLocaleDateString()}
                      </td>
                      <td className="questions-count">
                        {test.questions ? test.questions.length : 0}
                      </td>
                      <td className="status">
                        <span className={`status-badge ${test.status}`}>
                          {getStatusBadge(test.status)}
                        </span>
                      </td>
                      <td className="actions">
                        <button
                          className="btn-view"
                          onClick={() => {
                            fetchTestDetail(test._id);
                            setActiveTab('detail');
                          }}
                        >
                          Edit Questions
                        </button>
                        <button
                          className={`btn-toggle ${test.status}`}
                          onClick={() => handleToggleStatus(test._id, test.status)}
                        >
                          {test.status === 'draft' ? 'Publish' : 'Draft'}
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteTest(test._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Create Test Tab */}
      {activeTab === 'create' && (
        <div className="tab-content">
          <div className="create-test-container">
            <form onSubmit={handleCreateTest} className="create-test-form">
              {/* Test Name & Description Card */}
              <div className="form-card">
                <div className="form-group">
                  <label>Test Name *</label>
                  <input
                    type="text"
                    value={testForm.title}
                    onChange={(e) => setTestForm({ ...testForm, title: e.target.value })}
                    placeholder="e.g., CRM Training Assessment"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={testForm.description}
                    onChange={(e) => setTestForm({ ...testForm, description: e.target.value })}
                    placeholder="Describe what this test is about"
                    rows="3"
                  />
                </div>
              </div>

              {/* Test Configuration Card */}
              <div className="form-card">
                <h4>Test Configuration</h4>
                <div className="form-group">
                  <label>Total Marks</label>
                  <input
                    type="number"
                    value={testForm.totalMarks}
                    onChange={(e) => setTestForm({ ...testForm, totalMarks: parseInt(e.target.value) })}
                    min="10"
                  />
                </div>

                <div className="form-group">
                  <label>Passing Marks</label>
                  <input
                    type="number"
                    value={testForm.passingMarks}
                    onChange={(e) => setTestForm({ ...testForm, passingMarks: parseInt(e.target.value) })}
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Time Limit (minutes)</label>
                  <input
                    type="number"
                    value={testForm.timeLimit}
                    onChange={(e) => setTestForm({ ...testForm, timeLimit: parseInt(e.target.value) })}
                    min="5"
                  />
                </div>
              </div>

              {/* Advanced Settings Card */}
              <div className="form-card">
                <h4>Advanced Settings</h4>

                <div className="settings-group">
                  <h5>Test Behavior</h5>
                  <div className="checkbox-group">
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        checked={testForm.shuffleQuestions}
                        onChange={(e) => setTestForm({ ...testForm, shuffleQuestions: e.target.checked })}
                      />
                      Shuffle Questions
                    </label>
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        checked={testForm.shuffleOptions}
                        onChange={(e) => setTestForm({ ...testForm, shuffleOptions: e.target.checked })}
                      />
                      Shuffle Options
                    </label>
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        checked={testForm.autoSubmitOnTimeEnd}
                        onChange={(e) => setTestForm({ ...testForm, autoSubmitOnTimeEnd: e.target.checked })}
                      />
                      Auto-submit When Time Ends
                    </label>
                  </div>
                </div>

                <div className="settings-group">
                  <h5>Attempt Settings</h5>
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={testForm.allowMultipleAttempts}
                      onChange={(e) => setTestForm({ ...testForm, allowMultipleAttempts: e.target.checked })}
                    />
                    Allow Multiple Attempts
                  </label>
                  {testForm.allowMultipleAttempts && (
                    <div className="form-group">
                      <label>Maximum Attempts</label>
                      <input
                        type="number"
                        value={testForm.maxAttempts}
                        onChange={(e) => setTestForm({ ...testForm, maxAttempts: parseInt(e.target.value) })}
                        min="2"
                        max="10"
                      />
                    </div>
                  )}
                </div>

                <div className="settings-group">
                  <h5>Response Visibility</h5>
                  <p className="setting-desc">What should students see after submitting the test?</p>
                  <div className="radio-group">
                    <label className="radio">
                      <input
                        type="radio"
                        name="responseVisibility"
                        value="score_only"
                        checked={testForm.responseVisibility === 'score_only'}
                        onChange={(e) => setTestForm({ ...testForm, responseVisibility: e.target.value })}
                      />
                      <span>Score Only</span>
                      <span className="desc">Only show the final score</span>
                    </label>
                    <label className="radio">
                      <input
                        type="radio"
                        name="responseVisibility"
                        value="score_and_answers"
                        checked={testForm.responseVisibility === 'score_and_answers'}
                        onChange={(e) => setTestForm({ ...testForm, responseVisibility: e.target.value })}
                      />
                      <span>Score + Correct Answers</span>
                      <span className="desc">Show score and correct answers</span>
                    </label>
                    <label className="radio">
                      <input
                        type="radio"
                        name="responseVisibility"
                        value="full_feedback"
                        checked={testForm.responseVisibility === 'full_feedback'}
                        onChange={(e) => setTestForm({ ...testForm, responseVisibility: e.target.value })}
                      />
                      <span>Full Feedback</span>
                      <span className="desc">Show all: student answers, correct answers, and explanations</span>
                    </label>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-success btn-create-test">
                Create Test
              </button>
            </form>

            <p className="info-text">
              After creating the test, you can add questions from the Test Detail view.
            </p>
          </div>
        </div>
      )}

      {/* Test Detail Tab */}
      {activeTab === 'detail' && selectedTestDetail && (
        <div className="tab-content">
          <div className="test-detail-container">
            {/* Test Header with Title and Status */}
            <div className="test-header-card">
              <div className="header-top">
                <h2>{selectedTestDetail.title}</h2>
                <span className={`status-badge ${selectedTestDetail.status}`}>
                  {getStatusBadge(selectedTestDetail.status)}
                </span>
              </div>
              <p className="test-description">{selectedTestDetail.description}</p>
            </div>

            {/* Test Settings in Vertical List */}
            <div className="test-settings-card">
              <h3>Test Settings</h3>
              <div className="settings-list">
                <div className="setting-row">
                  <span className="setting-label">Total Questions:</span>
                  <span className="setting-value">{questions.length}</span>
                </div>
                <div className="setting-row">
                  <span className="setting-label">Total Marks:</span>
                  <span className="setting-value">{selectedTestDetail.totalMarks}</span>
                </div>
                <div className="setting-row">
                  <span className="setting-label">Passing Marks:</span>
                  <span className="setting-value">{selectedTestDetail.passingMarks}</span>
                </div>
                <div className="setting-row">
                  <span className="setting-label">Time Limit:</span>
                  <span className="setting-value">{selectedTestDetail.timeLimit} minutes</span>
                </div>
                <div className="setting-row">
                  <span className="setting-label">Shuffle Questions:</span>
                  <span className="setting-value">{selectedTestDetail.shuffleQuestions ? 'Yes' : 'No'}</span>
                </div>
                <div className="setting-row">
                  <span className="setting-label">Shuffle Options:</span>
                  <span className="setting-value">{selectedTestDetail.shuffleOptions ? 'Yes' : 'No'}</span>
                </div>
                <div className="setting-row">
                  <span className="setting-label">Multiple Attempts:</span>
                  <span className="setting-value">
                    {selectedTestDetail.allowMultipleAttempts
                      ? `Yes (Max: ${selectedTestDetail.maxAttempts})`
                      : 'No'}
                  </span>
                </div>
                <div className="setting-row">
                  <span className="setting-label">Response Visibility:</span>
                  <span className="setting-value">
                    {selectedTestDetail.responseVisibility === 'score_only' && 'Score Only'}
                    {selectedTestDetail.responseVisibility === 'score_and_answers' &&
                      'Score + Correct Answers'}
                    {selectedTestDetail.responseVisibility === 'full_feedback' && 'Full Feedback'}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: Questions */}
            <div className="questions-section">
              <h3>Questions ({questions.length})</h3>

              {questions.length === 0 ? (
                <p className="empty-state">No questions yet. Add one below.</p>
              ) : (
                <div className="questions-list">
                  {questions.map((q, idx) => (
                    <div key={q._id} className="question-item">
                      <div className="question-header">
                        <div className="question-info">
                          <span className="q-number">Q{idx + 1}</span>
                          <span className="q-type">{q.type === 'mcq' ? 'MCQ' : 'Descriptive'}</span>
                          <span className="q-marks">{q.marks} marks</span>
                        </div>
                        <div className="question-actions">
                          <button
                            className="btn-reorder"
                            onClick={() => handleReorderQuestion(q._id, 'up')}
                            disabled={idx === 0}
                            title="Move up"
                          >
                            ▲
                          </button>
                          <button
                            className="btn-reorder"
                            onClick={() => handleReorderQuestion(q._id, 'down')}
                            disabled={idx === questions.length - 1}
                            title="Move down"
                          >
                            ▼
                          </button>
                          <button
                            className="btn-edit-question"
                            onClick={() => handleEditQuestion(q)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-delete-question"
                            onClick={() => handleDeleteQuestion(q._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="question-text">{q.questionText}</p>

                      {q.type === 'mcq' && q.options && q.options.length > 0 && (
                        <div className="options-list">
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx} className={`option ${opt.isCorrect ? 'correct' : ''}`}>
                              <span className="option-label">{String.fromCharCode(65 + oIdx)}.</span>
                              <span className="option-text">{opt.text}</span>
                              {opt.isCorrect && <span className="correct-badge">Correct</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Edit Question Form - Google Forms Style */}
            {editingQuestionId && editingQuestion && (
              <div className="edit-question-section">
                <h3>Edit Question</h3>
                <form onSubmit={handleSaveEditedQuestion} className="question-form google-forms-style">

                  {/* Question Text */}
                  <div className="question-text-group">
                    <textarea
                      value={editingQuestion.questionText}
                      onChange={(e) =>
                        setEditingQuestion({ ...editingQuestion, questionText: e.target.value })
                      }
                      placeholder="Question"
                      rows="2"
                      className="question-input"
                      required
                    />
                  </div>

                  {/* Question Type & Marks Row */}
                  <div className="type-marks-row">
                    <div className="form-group">
                      <label>Type</label>
                      <select
                        value={editingQuestion.type}
                        onChange={(e) =>
                          setEditingQuestion({ ...editingQuestion, type: e.target.value })
                        }
                        className="type-select"
                      >
                        <option value="mcq">Multiple Choice</option>
                        <option value="descriptive">Descriptive</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Points</label>
                      <input
                        type="number"
                        value={editingQuestion.marks}
                        onChange={(e) =>
                          setEditingQuestion({
                            ...editingQuestion,
                            marks: parseInt(e.target.value),
                          })
                        }
                        min="1"
                        className="marks-input"
                      />
                    </div>
                  </div>

                  {/* MCQ Options */}
                  {editingQuestion.type === 'mcq' && (
                    <div className="mcq-options-container">
                      <div className="options-header">
                        <span>Options</span>
                        <small>Select the correct answer</small>
                      </div>

                      {editingQuestion.options.map((opt, idx) => (
                        <div key={idx} className="option-card">
                          <div className="option-radio">
                            <input
                              type="radio"
                              name="correctOption"
                              value={idx}
                              checked={opt.isCorrect}
                              onChange={() => {
                                const updated = editingQuestion.options.map((o, i) => ({
                                  ...o,
                                  isCorrect: i === idx,
                                }));
                                setEditingQuestion({
                                  ...editingQuestion,
                                  options: updated,
                                });
                              }}
                              id={`edit-option-${idx}`}
                            />
                            <label htmlFor={`edit-option-${idx}`} className="option-letter">
                              {String.fromCharCode(65 + idx)}
                            </label>
                          </div>
                          <input
                            type="text"
                            value={opt.text}
                            onChange={(e) => {
                              const updated = [...editingQuestion.options];
                              updated[idx].text = e.target.value;
                              setEditingQuestion({
                                ...editingQuestion,
                                options: updated,
                              });
                            }}
                            placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                            className="option-text-input"
                          />
                        </div>
                      ))}

                      <div className="options-actions">
                        {editingQuestion.options.length < 5 && (
                          <button
                            type="button"
                            className="btn-add-option"
                            onClick={() => {
                              setEditingQuestion({
                                ...editingQuestion,
                                options: [
                                  ...editingQuestion.options,
                                  { text: '', isCorrect: false },
                                ],
                              });
                            }}
                          >
                            + Add option
                          </button>
                        )}
                        {editingQuestion.options.length > 2 && (
                          <button
                            type="button"
                            className="btn-remove-option"
                            onClick={() => {
                              setEditingQuestion({
                                ...editingQuestion,
                                options: editingQuestion.options.slice(0, -1),
                              });
                            }}
                          >
                            Remove last option
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Form Actions */}
                  <div className="question-form-actions">
                    <button type="submit" className="btn btn-success">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setEditingQuestionId(null);
                        setEditingQuestion(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Add Question Form - Google Forms Style */}
            {!editingQuestionId && (
            <div className="add-question-section">
              <h3>Add Question</h3>
              <form onSubmit={handleAddQuestion} className="question-form google-forms-style">

                {/* Question Text */}
                <div className="question-text-group">
                  <textarea
                    value={newQuestion.questionText}
                    onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
                    placeholder="Question"
                    rows="2"
                    className="question-input"
                    required
                  />
                </div>

                {/* Question Type & Marks Row */}
                <div className="type-marks-row">
                  <div className="form-group">
                    <label>Type</label>
                    <select
                      value={newQuestion.type}
                      onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
                      className="type-select"
                    >
                      <option value="mcq">Multiple Choice</option>
                      <option value="descriptive">Descriptive</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Points</label>
                    <input
                      type="number"
                      value={newQuestion.marks}
                      onChange={(e) => setNewQuestion({ ...newQuestion, marks: parseInt(e.target.value) })}
                      min="1"
                      className="marks-input"
                    />
                  </div>
                </div>

                {/* MCQ Options Section */}
                {newQuestion.type === 'mcq' && (
                  <div className="mcq-options-container">
                    <div className="options-header">
                      <span>Options</span>
                      <small>Select the correct answer</small>
                    </div>

                    {newQuestion.options.map((opt, idx) => (
                      <div key={idx} className="option-card">
                        <div className="option-radio">
                          <input
                            type="radio"
                            name="correctOption"
                            value={idx}
                            checked={opt.isCorrect}
                            onChange={() => {
                              const updated = newQuestion.options.map((o, i) => ({
                                ...o,
                                isCorrect: i === idx
                              }));
                              setNewQuestion({ ...newQuestion, options: updated });
                            }}
                            id={`option-${idx}`}
                          />
                          <label htmlFor={`option-${idx}`} className="option-letter">
                            {String.fromCharCode(65 + idx)}
                          </label>
                        </div>
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => {
                            const updated = [...newQuestion.options];
                            updated[idx].text = e.target.value;
                            setNewQuestion({ ...newQuestion, options: updated });
                          }}
                          placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                          className="option-text-input"
                        />
                      </div>
                    ))}

                    {/* Add/Remove Options Buttons */}
                    <div className="options-actions">
                      {newQuestion.options.length < 5 && (
                        <button
                          type="button"
                          className="btn-add-option"
                          onClick={() => {
                            setNewQuestion({
                              ...newQuestion,
                              options: [...newQuestion.options, { text: '', isCorrect: false }]
                            });
                          }}
                        >
                          + Add option
                        </button>
                      )}
                      {newQuestion.options.length > 2 && (
                        <button
                          type="button"
                          className="btn-remove-option"
                          onClick={() => {
                            setNewQuestion({
                              ...newQuestion,
                              options: newQuestion.options.slice(0, -1)
                            });
                          }}
                        >
                          Remove last option
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Descriptive Question Note */}
                {newQuestion.type === 'descriptive' && (
                  <div className="descriptive-note">
                    <p>Students will provide text answers to this question. Answers will need to be evaluated manually.</p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="question-form-actions">
                  <button type="submit" className="btn btn-success btn-add-question">
                    Add Question
                  </button>
                </div>
              </form>
            </div>
            )}

            {/* Test Actions */}
            <div className="test-actions">
              <button
                className={`btn btn-toggle ${selectedTestDetail.status}`}
                onClick={() => handleToggleStatus(selectedTestDetail._id, selectedTestDetail.status)}
              >
                {selectedTestDetail.status === 'draft' ? 'Publish Test' : 'Move to Draft'}
              </button>
              <button
                className="btn btn-delete"
                onClick={() => {
                  handleDeleteTest(selectedTestDetail._id);
                  setActiveTab('list');
                }}
              >
                Delete Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestManagement;
