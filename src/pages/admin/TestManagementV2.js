import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../../styles/admin/TestManagementV2.css';

const API = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin`;

const BLANK_FORM = {
  title: '', description: '',
  totalMarks: 100, passingMarks: 50, timeLimit: 30,
  moduleType: '', categoryId: '',
  googleFormUrl: '',
  shuffleQuestions: false, shuffleOptions: false,
  allowMultipleAttempts: false, maxAttempts: 1,
  responseVisibility: 'score_only',
  autoSubmitOnTimeEnd: true, showProgressBar: true, requireEmail: false,
};

const BLANK_QUESTION = {
  id: null, questionText: '', type: 'mcq', marks: 1, isRequired: false,
  options: [
    { id: 'a', text: '', isCorrect: false },
    { id: 'b', text: '', isCorrect: false },
    { id: 'c', text: '', isCorrect: false },
    { id: 'd', text: '', isCorrect: false },
  ],
};

const Q_TYPES = [
  { value: 'mcq',         label: 'Multiple Choice'  },
  { value: 'checkbox',    label: 'Checkboxes'        },
  { value: 'shortAnswer', label: 'Short Answer'      },
  { value: 'paragraph',   label: 'Paragraph'         },
  { value: 'dropdown',    label: 'Dropdown'          },
  { value: 'linearScale', label: 'Linear Scale'      },
  { value: 'date',        label: 'Date'              },
  { value: 'time',        label: 'Time'              },
];
const HAS_OPTIONS = ['mcq', 'checkbox', 'dropdown'];

const MODULE_LABELS = { wati_training: 'Support Training', new_deployment: 'New Deployment' };

// mode: 'library' | 'create'
export default function TestManagementV2({ mode = 'library', onModeChange }) {
  const H = () => ({
    Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
    'Content-Type': 'application/json',
  });

  const [view,        setView]        = useState('list');
  const [tab,         setTab]         = useState('questions');
  const [tests,       setTests]       = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [saveMsg,     setSaveMsg]     = useState('');
  const [editTest,    setEditTest]    = useState(null);   // existing test being edited
  const [form,        setForm]        = useState({ ...BLANK_FORM });
  const [questions,   setQuestions]   = useState([]);     // local question list
  const [categories,  setCategories]  = useState([]);
  const prevMode = useRef(mode);

  /* ── load tests list ── */
  const loadTests = useCallback(async () => {
    setListLoading(true);
    try {
      const r = await fetch(`${API}/tests`, { headers: H() });
      const d = await r.json();
      setTests(d.data || []);
    } catch { /* ignore */ }
    setListLoading(false);
  }, []); // eslint-disable-line

  useEffect(() => {
    loadTests();
    fetch(`${API}/categories`, { headers: H() })
      .then(r => r.json()).then(d => setCategories(d.data || [])).catch(() => {});
  }, [loadTests]); // eslint-disable-line

  /* ── sidebar mode changes ── */
  useEffect(() => {
    if (prevMode.current === mode) return;
    prevMode.current = mode;
    if (mode === 'create') openCreate();
    else if (mode === 'library') goLibrary();
    // eslint-disable-next-line
  }, [mode]);

  /* ── open blank create form (NO api call) ── */
  function openCreate() {
    setEditTest(null);
    setForm({ ...BLANK_FORM });
    setQuestions([{ ...BLANK_QUESTION, id: `q_${Date.now()}` }]);
    setTab('questions');
    setView('builder');
  }

  /* ── open existing test for editing ── */
  async function openExisting(id) {
    try {
      const r = await fetch(`${API}/tests/${id}`, { headers: H() });
      const d = await r.json();
      const t = d.data;
      setEditTest(t);
      setForm({
        title: t.title || '', description: t.description || '',
        totalMarks: t.totalMarks || 100, passingMarks: t.passingMarks || 50,
        timeLimit: t.timeLimit || 30, moduleType: t.moduleType || '',
        categoryId: t.categoryId?._id || t.categoryId || '',
        googleFormUrl: t.googleFormUrl || '',
        shuffleQuestions: t.shuffleQuestions || false,
        shuffleOptions: t.shuffleOptions || false,
        allowMultipleAttempts: t.allowMultipleAttempts || false,
        maxAttempts: t.maxAttempts || 1,
        responseVisibility: t.responseVisibility || 'score_only',
        autoSubmitOnTimeEnd: t.autoSubmitOnTimeEnd !== false,
        showProgressBar: t.showProgressBar !== false,
        requireEmail: t.requireEmail || false,
      });
      // Load questions and map to local format
      const qs = (t.questions || []).map(q => ({
        id: q._id,
        _id: q._id,
        questionText: q.questionText || '',
        type: q.type || 'mcq',
        marks: q.marks || 1,
        isRequired: q.isRequired || false,
        options: (q.options || []).length > 0
          ? q.options.map((o, i) => ({ id: o.id || String.fromCharCode(97+i), text: o.text || '', isCorrect: !!o.isCorrect }))
          : [
              { id: 'a', text: '', isCorrect: false },
              { id: 'b', text: '', isCorrect: false },
            ],
      }));
      setQuestions(qs.length > 0 ? qs : [{ ...BLANK_QUESTION, id: `q_${Date.now()}` }]);
      setTab('questions');
      setView('builder');
    } catch { alert('Could not load test.'); }
  }

  function goLibrary() {
    setView('list');
    setEditTest(null);
    setQuestions([]);
    onModeChange?.('library');
    loadTests();
  }

  /* ── form change ── */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const v = type === 'checkbox' ? checked
      : ['totalMarks','passingMarks','timeLimit','maxAttempts'].includes(name)
        ? (parseInt(value) || 0) : value;
    if (name === 'moduleType') {
      setForm(p => ({ ...p, moduleType: v, categoryId: '' }));
    } else {
      setForm(p => ({ ...p, [name]: v }));
    }
  };

  /* ── question helpers ── */
  const addQuestion = () => {
    setQuestions(prev => [...prev, {
      ...BLANK_QUESTION,
      id: `q_${Date.now()}`,
      options: [
        { id: 'a', text: '', isCorrect: false },
        { id: 'b', text: '', isCorrect: false },
        { id: 'c', text: '', isCorrect: false },
        { id: 'd', text: '', isCorrect: false },
      ],
    }]);
  };

  const removeQuestion = (qid) => {
    if (questions.length <= 1) return;
    setQuestions(prev => prev.filter(q => q.id !== qid));
  };

  const updateQuestion = (qid, patch) =>
    setQuestions(prev => prev.map(q => q.id === qid ? { ...q, ...patch } : q));

  const changeQType = (qid, newType) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== qid) return q;
      const opts = HAS_OPTIONS.includes(newType)
        ? [{ id:'a',text:'',isCorrect:false },{ id:'b',text:'',isCorrect:false }]
        : [];
      return { ...q, type: newType, options: opts };
    }));
  };

  const updateOption = (qid, oid, field, value) =>
    setQuestions(prev => prev.map(q =>
      q.id !== qid ? q : {
        ...q,
        options: q.options.map(o => o.id === oid ? { ...o, [field]: value } : o),
      }
    ));

  const markCorrect = (qid, oid) =>
    setQuestions(prev => prev.map(q =>
      q.id !== qid ? q : {
        ...q,
        options: q.options.map(o => ({ ...o, isCorrect: o.id === oid })),
      }
    ));

  const toggleCorrect = (qid, oid) =>
    setQuestions(prev => prev.map(q =>
      q.id !== qid ? q : {
        ...q,
        options: q.options.map(o => o.id === oid ? { ...o, isCorrect: !o.isCorrect } : o),
      }
    ));

  const addOption = (qid) =>
    setQuestions(prev => prev.map(q =>
      q.id !== qid ? q : {
        ...q,
        options: [...q.options, { id: `o_${Date.now()}`, text: '', isCorrect: false }],
      }
    ));

  const removeOption = (qid, oid) =>
    setQuestions(prev => prev.map(q =>
      q.id !== qid || q.options.length <= 2 ? q : {
        ...q,
        options: q.options.filter(o => o.id !== oid),
      }
    ));

  /* ══════════════════════════════════════
     SAVE TEST — single explicit save
  ══════════════════════════════════════ */
  async function handleSaveTest() {
    if (!form.title.trim()) { alert('Please enter a test title'); return; }
    if (questions.some(q => !q.questionText.trim())) {
      alert('Please fill in all question texts before saving');
      return;
    }

    setSaving(true);
    setSaveMsg('');
    try {
      let testId = editTest?._id;

      // 1. Create or update test
      const testPayload = {
        title: form.title, description: form.description,
        totalMarks: form.totalMarks, passingMarks: form.passingMarks,
        timeLimit: form.timeLimit, status: editTest?.status || 'draft',
        moduleType: form.moduleType, categoryId: form.categoryId || undefined,
        googleFormUrl: form.googleFormUrl || null,
        shuffleQuestions: form.shuffleQuestions, shuffleOptions: form.shuffleOptions,
        allowMultipleAttempts: form.allowMultipleAttempts, maxAttempts: form.maxAttempts,
        responseVisibility: form.responseVisibility,
        autoSubmitOnTimeEnd: form.autoSubmitOnTimeEnd,
        showProgressBar: form.showProgressBar, requireEmail: form.requireEmail,
      };

      if (testId) {
        // Update existing
        await fetch(`${API}/tests/${testId}`, {
          method: 'PUT', headers: H(), body: JSON.stringify(testPayload),
        });
      } else {
        // Create new
        const r = await fetch(`${API}/tests`, {
          method: 'POST', headers: H(), body: JSON.stringify(testPayload),
        });
        if (!r.ok) { const e = await r.json(); throw new Error(e.error?.message || 'Failed to create test'); }
        const d = await r.json();
        testId = d.data._id;
      }

      // 2. Delete old questions (if editing)
      if (editTest?._id) {
        const existing = editTest.questions || [];
        for (const q of existing) {
          if (q._id) await fetch(`${API}/tests/${testId}/questions/${q._id}`, {
            method: 'DELETE', headers: H(),
          }).catch(() => {});
        }
      }

      // 3. Save all questions
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        await fetch(`${API}/tests/${testId}/questions`, {
          method: 'POST', headers: H(),
          body: JSON.stringify({
            questionText: q.questionText, type: q.type, marks: q.marks,
            isRequired: q.isRequired, options: q.options, order: i,
          }),
        });
      }

      setSaveMsg('Test saved successfully!');
      setTimeout(() => {
        setSaveMsg('');
        goLibrary();
      }, 1500);
    } catch (e) {
      alert('Error saving test: ' + e.message);
    } finally {
      setSaving(false);
    }
  }

  /* ── toggle publish ── */
  async function toggleStatus(testId, currentStatus) {
    const next = currentStatus === 'draft' ? 'active' : 'draft';
    await fetch(`${API}/tests/${testId}`, {
      method: 'PUT', headers: H(), body: JSON.stringify({ status: next }),
    });
    loadTests();
    if (editTest?._id === testId) setEditTest(t => ({ ...t, status: next }));
  }

  /* ── delete ── */
  async function deleteTest(id, e) {
    e.stopPropagation();
    if (!window.confirm('Delete this test? This cannot be undone.')) return;
    await fetch(`${API}/tests/${id}`, { method: 'DELETE', headers: H() });
    // ONLY reload list — do NOT create anything
    loadTests();
    if (editTest?._id === id) goLibrary();
  }

  const filteredCategories = categories.filter(c => !form.moduleType || c.type === form.moduleType);
  const currentStatus = editTest?.status || 'draft';

  /* ══════════════════════════════════════
     LIBRARY VIEW
  ══════════════════════════════════════ */
  if (view === 'list') return (
    <div className="tm-library">
      <div className="tm-library-head">
        <div>
          <h2>Test Library</h2>
          <p>{tests.length} test{tests.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="tm-btn-primary" onClick={openCreate}>+ New Test</button>
      </div>

      {listLoading && (
        <div className="tm-shimmer-wrap">{[1,2,3].map(i => <div key={i} className="tm-shimmer" />)}</div>
      )}

      {!listLoading && tests.length === 0 && (
        <div className="tm-empty">
          <div className="tm-empty-icon">📋</div>
          <p className="tm-empty-title">No tests yet</p>
          <p className="tm-empty-sub">Click "Create Test" in the sidebar or "+ New Test" above</p>
          <button className="tm-btn-primary" onClick={openCreate}>+ Create Test</button>
        </div>
      )}

      {!listLoading && tests.length > 0 && (
        <div className="tm-table-wrap">
          <table className="tm-table">
            <thead>
              <tr>
                <th>Test Name</th>
                <th>Module</th>
                <th>Category</th>
                <th>Marks</th>
                <th>Questions</th>
                <th>Status</th>
                <th>Created By</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map(t => {
                const catName = t.categoryId?.name || (categories.find(c => c._id === t.categoryId)?.name) || '—';
                return (
                  <tr key={t._id} className="tm-table-row" onClick={() => openExisting(t._id)}>
                    <td className="tm-col-name">{t.title || 'Untitled'}</td>
                    <td className="tm-col-muted">{MODULE_LABELS[t.moduleType] || '—'}</td>
                    <td className="tm-col-muted">{catName}</td>
                    <td className="tm-col-center">{t.totalMarks}</td>
                    <td className="tm-col-center">{(t.questions||[]).length}</td>
                    <td><span className={`tm-badge tm-badge-${t.status}`}>{t.status}</span></td>
                    <td className="tm-col-muted">{t.createdBy?.name || '—'}</td>
                    <td className="tm-col-muted">{t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) : '—'}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <div className="tm-tbl-actions">
                        <button className="tm-edit-btn" onClick={() => openExisting(t._id)}>Edit</button>
                        <button
                          className={`tm-edit-btn ${t.status==='active'?'tm-unpublish-btn':''}`}
                          onClick={e => { e.stopPropagation(); toggleStatus(t._id, t.status); }}
                        >
                          {t.status === 'draft' ? 'Publish' : 'Unpublish'}
                        </button>
                        <button className="tm-del-btn" onClick={e => deleteTest(t._id, e)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  /* ══════════════════════════════════════
     BUILDER VIEW
  ══════════════════════════════════════ */
  return (
    <div className="tm-builder">

      {/* Top bar */}
      <div className="tm-bar">
        <button className="tm-bar-back" onClick={goLibrary}>← Test Library</button>
        <div className="tm-bar-tabs">
          <button className={`tm-tab ${tab==='questions'?'active':''}`} onClick={() => setTab('questions')}>Questions</button>
          <button className={`tm-tab ${tab==='settings'?'active':''}`} onClick={() => setTab('settings')}>Settings</button>
        </div>
        <div className="tm-bar-end">
          {saveMsg && <span className="tm-saved">{saveMsg}</span>}
          {editTest && (
            <button
              className={`tm-publish-btn ${currentStatus === 'active' ? 'tm-publish-active' : 'tm-publish-draft'}`}
              onClick={() => toggleStatus(editTest._id, currentStatus)}
            >
              {currentStatus === 'draft' ? 'Publish' : 'Unpublish'}
            </button>
          )}
          <button className="tm-save-test-btn" onClick={handleSaveTest} disabled={saving}>
            {saving ? 'Saving…' : editTest ? 'Save Changes' : 'Save Test'}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="tm-builder-body">
        <div className="tm-form-area">

          {/* ── QUESTIONS TAB ── */}
          {tab === 'questions' && (
            <>
              {/* Title card */}
              <div className="tm-title-card">
                <div className="tm-title-stripe" />
                <div className="tm-title-inner">
                  <input
                    className="tm-title-inp"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Enter test title *"
                  />
                  <textarea
                    className="tm-desc-inp"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Description (optional)"
                    rows={2}
                  />

                  {/* Module + Category */}
                  <div className="tm-meta-fields">
                    <div className="tm-meta-field">
                      <label>Module</label>
                      <select name="moduleType" value={form.moduleType} onChange={handleChange}>
                        <option value="">— Select Module —</option>
                        <option value="wati_training">Support Training</option>
                        <option value="new_deployment">New Deployment</option>
                      </select>
                    </div>
                    <div className="tm-meta-field">
                      <label>Category</label>
                      <select name="categoryId" value={form.categoryId} onChange={handleChange} disabled={!form.moduleType}>
                        <option value="">— Select Category —</option>
                        {filteredCategories.map(c => (
                          <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="tm-meta-field" style={{gridColumn: '1 / -1'}}>
                      <label>Google Form URL (optional)</label>
                      <input
                        type="url"
                        name="googleFormUrl"
                        value={form.googleFormUrl || ''}
                        onChange={handleChange}
                        placeholder="https://forms.gle/... or https://docs.google.com/forms/..."
                      />
                      <small style={{fontSize:11,color:'#718096',marginTop:4,display:'block'}}>
                        Paste a Google Form link to use it instead of the question builder
                      </small>
                    </div>
                  </div>

                  <div className="tm-title-meta">
                    <span>{form.totalMarks} marks</span>
                    <span className="tm-dot">·</span>
                    <span>{form.timeLimit} min</span>
                    <span className="tm-dot">·</span>
                    <span>{questions.length} question{questions.length!==1?'s':''}</span>
                    {editTest && <span className={`tm-status-tag tm-status-${currentStatus}`}>{currentStatus}</span>}
                    {!editTest && <span className="tm-status-tag" style={{background:'#fef3c7',color:'#92400e'}}>Not saved yet</span>}
                  </div>
                </div>
              </div>

              {/* Questions */}
              <div className="tm-questions-list">
                {questions.map((q, idx) => (
                  <div key={q.id} className="tm-q-card">
                    <div className="tm-q-header">
                      <span className="tm-q-num">Q{idx + 1}</span>
                      <select
                        className="tm-q-type-select"
                        value={q.type}
                        onChange={e => changeQType(q.id, e.target.value)}
                      >
                        {Q_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                      <input
                        type="number"
                        className="tm-q-marks"
                        value={q.marks}
                        min="1"
                        onChange={e => updateQuestion(q.id, { marks: parseInt(e.target.value)||1 })}
                        title="Points"
                      />
                      <span className="tm-q-marks-label">pts</span>
                      <label className="tm-q-required">
                        <input type="checkbox" checked={q.isRequired} onChange={e => updateQuestion(q.id, { isRequired: e.target.checked })} />
                        Required
                      </label>
                      {questions.length > 1 && (
                        <button className="tm-q-del" onClick={() => removeQuestion(q.id)} title="Delete question">✕</button>
                      )}
                    </div>

                    <input
                      className="tm-q-text"
                      placeholder={`Question ${idx + 1}`}
                      value={q.questionText}
                      onChange={e => updateQuestion(q.id, { questionText: e.target.value })}
                    />

                    {/* Options for MCQ / Checkbox / Dropdown */}
                    {HAS_OPTIONS.includes(q.type) && (
                      <div className="tm-q-options">
                        {q.options.map((opt, oi) => (
                          <div key={opt.id} className="tm-q-option-row">
                            {q.type === 'mcq' ? (
                              <input
                                type="radio"
                                name={`correct_${q.id}`}
                                checked={opt.isCorrect}
                                onChange={() => markCorrect(q.id, opt.id)}
                                className="tm-q-radio"
                                title="Mark as correct answer"
                              />
                            ) : q.type === 'checkbox' ? (
                              <input
                                type="checkbox"
                                checked={opt.isCorrect}
                                onChange={() => toggleCorrect(q.id, opt.id)}
                                className="tm-q-radio"
                                title="Mark as correct answer"
                              />
                            ) : (
                              <span className="tm-q-opt-num">{oi + 1}.</span>
                            )}
                            <input
                              className={`tm-q-opt-input ${opt.isCorrect ? 'correct' : ''}`}
                              placeholder={`Option ${oi + 1}`}
                              value={opt.text}
                              onChange={e => updateOption(q.id, opt.id, 'text', e.target.value)}
                            />
                            {q.options.length > 2 && (
                              <button className="tm-q-opt-del" onClick={() => removeOption(q.id, opt.id)}>✕</button>
                            )}
                          </div>
                        ))}
                        <button className="tm-q-add-opt" onClick={() => addOption(q.id)}>+ Add option</button>
                        <p className="tm-q-hint">
                          {q.type === 'mcq' ? '● Click radio button to mark correct answer' : '☑ Check boxes to mark correct answers'}
                        </p>
                      </div>
                    )}

                    {/* Short answer preview */}
                    {q.type === 'shortAnswer' && (
                      <div className="tm-q-preview">Short answer text field</div>
                    )}
                    {q.type === 'paragraph' && (
                      <div className="tm-q-preview">Long answer text area</div>
                    )}
                    {q.type === 'date' && (
                      <div className="tm-q-preview">📅 Date picker</div>
                    )}
                    {q.type === 'time' && (
                      <div className="tm-q-preview">⏰ Time picker</div>
                    )}
                    {q.type === 'linearScale' && (
                      <div className="tm-q-preview">Linear scale 1 → 5</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Question + Save */}
              <div className="tm-q-actions">
                <button className="tm-add-q-btn" onClick={addQuestion}>
                  + Add Question
                </button>
                <button className="tm-save-test-btn tm-save-test-btn-lg" onClick={handleSaveTest} disabled={saving}>
                  {saving ? 'Saving…' : editTest ? '💾 Save Changes' : '💾 Save Test'}
                </button>
              </div>
            </>
          )}

          {/* ── SETTINGS TAB ── */}
          {tab === 'settings' && (
            <>
              <div className="tm-set-card">
                <div className="tm-set-head">Scoring & Time</div>
                <div className="tm-set-row">
                  {[
                    { name:'totalMarks',   label:'Total Marks'    },
                    { name:'passingMarks', label:'Passing Marks'  },
                    { name:'timeLimit',    label:'Time (minutes)' },
                  ].map(f => (
                    <div className="tm-set-field" key={f.name}>
                      <label>{f.label}</label>
                      <input type="number" name={f.name} value={form[f.name]} onChange={handleChange} min="1" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="tm-set-card">
                <div className="tm-set-head">Question Options</div>
                {[
                  { name:'shuffleQuestions', label:'Shuffle question order' },
                  { name:'shuffleOptions',   label:'Shuffle answer options' },
                  { name:'showProgressBar',  label:'Show progress bar'      },
                ].map(o => <ToggleRow key={o.name} label={o.label} on={form[o.name]} onToggle={() => setForm(p => ({...p,[o.name]:!p[o.name]}))} />)}
              </div>

              <div className="tm-set-card">
                <div className="tm-set-head">Response Settings</div>
                {[
                  { name:'allowMultipleAttempts', label:'Allow multiple attempts'    },
                  { name:'autoSubmitOnTimeEnd',   label:'Auto-submit when time ends' },
                  { name:'requireEmail',          label:'Require email to start'     },
                ].map(o => <ToggleRow key={o.name} label={o.label} on={form[o.name]} onToggle={() => setForm(p => ({...p,[o.name]:!p[o.name]}))} />)}
                <div className="tm-set-field tm-set-solo">
                  <label>Show respondents</label>
                  <select name="responseVisibility" value={form.responseVisibility} onChange={handleChange}>
                    <option value="score_only">Only their score</option>
                    <option value="score_and_answers">Score + correct answers</option>
                    <option value="full_feedback">Full feedback</option>
                  </select>
                </div>
              </div>

              <div className="tm-q-actions">
                <button className="tm-save-test-btn tm-save-test-btn-lg" onClick={handleSaveTest} disabled={saving}>
                  {saving ? 'Saving…' : editTest ? '💾 Save Changes' : '💾 Save Test'}
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, on, onToggle }) {
  return (
    <div className="tm-toggle-row" onClick={onToggle}>
      <span>{label}</span>
      <div className={`tm-toggle ${on ? 'on' : ''}`}>
        <div className="tm-toggle-knob" />
      </div>
    </div>
  );
}
