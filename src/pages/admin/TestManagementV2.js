import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../../styles/admin/TestManagementV2.css';
import QuestionBuilder from '../../components/admin/QuestionBuilder';

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


const MODULE_LABELS = { wati_training: 'Support Training', new_deployment: 'New Deployment' };

// mode: 'library' | 'create'
export default function TestManagementV2({ mode = 'library', onModeChange }) {
  const H = () => ({
    Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
    'Content-Type': 'application/json',
  });

  const [view,        setView]        = useState('list');
  const [tab,         setTab]         = useState('questions');
  const [responses,   setResponses]   = useState([]);
  const [resLoading,  setResLoading]  = useState(false);
  const [resFilter,   setResFilter]   = useState({ dept: '', result: '' });
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
    const realCount = questions.filter(q => !q._isSection).length;
    if (realCount <= 1) return; // keep at least one real question
    setQuestions(prev => prev.filter(q => q.id !== qid));
  };

  const updateQuestion = (qid, patch) =>
    setQuestions(prev => prev.map(q => q.id === qid ? { ...q, ...patch } : q));


  const duplicateQuestion = (qid) => {
    setQuestions(prev => {
      const idx = prev.findIndex(q => q.id === qid);
      if (idx === -1) return prev;
      const original = prev[idx];
      const copy = {
        ...original,
        id: `q_${Date.now()}`,
        _id: undefined,
        options: (original.options || []).map(o => ({ ...o, id: `o_${Date.now()}_${o.id}` })),
      };
      const next = [...prev];
      next.splice(idx + 1, 0, copy);
      return next;
    });
  };

  const moveQuestion = (qid, direction) => {
    setQuestions(prev => {
      const idx = prev.findIndex(q => q.id === qid);
      if (idx === -1) return prev;
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
      return next;
    });
  };

  /* ══════════════════════════════════════
     SAVE TEST — single explicit save
  ══════════════════════════════════════ */
  async function handleSaveTest() {
    if (!form.title.trim()) { alert('Please enter a test title'); return; }
    const realQuestions = questions.filter(q => !q._isSection && q.questionText?.trim());

    // If Google Form URL is provided, questions are optional
    if (!form.googleFormUrl && realQuestions.length === 0) {
      alert('Please add at least one question or enter a Google Form URL');
      return;
    }
    // If using our builder, validate question texts
    if (!form.googleFormUrl && questions.filter(q => !q._isSection).some(q => !q.questionText?.trim())) {
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

      // 3. Save all questions (exclude section dividers)
      let order = 0;
      for (const q of questions) {
        if (q._isSection) continue; // skip section dividers
        await fetch(`${API}/tests/${testId}/questions`, {
          method: 'POST', headers: H(),
          body: JSON.stringify({
            questionText: q.questionText, type: q.type, marks: q.marks,
            isRequired: q.isRequired, options: q.options, order: order++,
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
  /* ── load responses ── */
  async function loadResponses() {
    if (!editTest?._id) return;
    setResLoading(true);
    try {
      const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const r = await fetch(`${BASE}/api/admin/performance/sessions?testId=${editTest._id}&limit=500`, { headers: H() });
      const d = await r.json();
      setResponses(d.data || []);
    } catch { setResponses([]); }
    setResLoading(false);
  }

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
      <div className="tm-builder-body tm-builder-body--gf">

          {/* ── QUESTIONS TAB ── */}
          {tab === 'questions' && (
            <div className="gf-form-layout">
              {/* ── Left: form content ── */}
              <div className="gf-form-content">

                {/* Title card */}
                <div className="gf-title-card">
                  <div className="gf-title-inner">
                    <input
                      className="gf-title-inp"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="Untitled form"
                    />
                    <textarea
                      className="gf-desc-inp"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Form description"
                      rows={2}
                    />

                    {/* Module + Category + Google Form URL */}
                    <div className="gf-meta-fields">
                      <div className="gf-meta-field">
                        <label>Module</label>
                        <select name="moduleType" value={form.moduleType} onChange={handleChange}>
                          <option value="">— Select Module —</option>
                          <option value="wati_training">Support Training</option>
                          <option value="new_deployment">New Deployment</option>
                        </select>
                      </div>
                      <div className="gf-meta-field">
                        <label>Category</label>
                        <select name="categoryId" value={form.categoryId} onChange={handleChange} disabled={!form.moduleType}>
                          <option value="">— Select Category —</option>
                          {filteredCategories.map(c => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="gf-meta-field gf-meta-full">
                        <label>Google Form URL (optional)</label>
                        <input
                          type="url"
                          name="googleFormUrl"
                          value={form.googleFormUrl || ''}
                          onChange={handleChange}
                          placeholder="https://forms.gle/... or https://docs.google.com/forms/..."
                        />
                      </div>
                    </div>

                    <div className="gf-title-meta">
                      <span>{form.totalMarks} marks</span>
                      <span className="tm-dot">·</span>
                      <span>{form.timeLimit} min</span>
                      <span className="tm-dot">·</span>
                      <span>{questions.filter(q => !q._isSection).length} question{questions.filter(q => !q._isSection).length !== 1 ? 's' : ''}</span>
                      {editTest && <span className={`tm-status-tag tm-status-${currentStatus}`}>{currentStatus}</span>}
                      {!editTest && <span className="tm-status-tag" style={{background:'#fef3c7',color:'#92400e'}}>Not saved yet</span>}
                    </div>
                  </div>
                </div>

                {/* Google Form URL indicator */}
                {form.googleFormUrl && (
                  <div style={{background:'#d1fae5',border:'1px solid #6ee7b7',borderRadius:8,padding:'14px 20px',display:'flex',alignItems:'center',gap:12,margin:'0 0 4px'}}>
                    <span style={{fontSize:20}}>📋</span>
                    <div>
                      <div style={{fontSize:13,fontWeight:700,color:'#065f46'}}>Using Google Form</div>
                      <div style={{fontSize:12,color:'#047857',marginTop:2}}>Team will see the embedded Google Form. Questions below are optional.</div>
                    </div>
                    <a href={form.googleFormUrl} target="_blank" rel="noopener noreferrer" style={{marginLeft:'auto',fontSize:12,color:'#065f46',fontWeight:600}}>Preview →</a>
                  </div>
                )}

                {/* Question cards */}
                <div className="gf-questions-wrap">
                  {questions.map((q, idx) => {
                    // Section divider
                    if (q._isSection) {
                      return (
                        <div key={q.id} className="gf-section-card">
                          <div className="gf-section-label">
                            Section {questions.slice(0, idx).filter(x => x._isSection).length + 2} of {questions.filter(x => x._isSection).length + 1}
                          </div>
                          <input
                            className="gf-section-title-inp"
                            placeholder="Section title"
                            value={q.sectionTitle || ''}
                            onChange={e => setQuestions(prev => prev.map(x => x.id === q.id ? { ...x, sectionTitle: e.target.value } : x))}
                          />
                          <textarea
                            className="gf-section-desc-inp"
                            placeholder="Section description (optional)"
                            value={q.sectionDesc || ''}
                            rows={2}
                            onChange={e => setQuestions(prev => prev.map(x => x.id === q.id ? { ...x, sectionDesc: e.target.value } : x))}
                          />
                          <button
                            className="gf-section-del"
                            onClick={() => setQuestions(prev => prev.filter(x => x.id !== q.id))}
                            title="Remove section"
                            type="button"
                          >✕</button>
                        </div>
                      );
                    }

                    // Regular question
                    return (
                      <QuestionBuilder
                        key={q.id}
                        question={q}
                        index={idx}
                        onUpdate={(updated) => updateQuestion(q.id, updated)}
                        onDelete={() => removeQuestion(q.id)}
                        onDuplicate={() => duplicateQuestion(q.id)}
                        onMoveUp={() => moveQuestion(q.id, 'up')}
                        onMoveDown={() => moveQuestion(q.id, 'down')}
                        canMoveUp={idx > 0}
                        canMoveDown={idx < questions.length - 1}
                      />
                    );
                  })}
                </div>

                {/* Bottom add question button */}
                <button className="gf-add-q-bottom" onClick={addQuestion} type="button">
                  + Add Question
                </button>

                {/* Save row */}
                <div className="gf-save-row">
                  <button className="gf-save-btn" onClick={handleSaveTest} disabled={saving}>
                    {saving ? 'Saving…' : editTest ? 'Save Changes' : 'Save Test'}
                  </button>
                </div>
              </div>

              {/* ── Right floating toolbar ── */}
              <div className="gf-right-toolbar">
                <button
                  className="gf-rt-btn"
                  onClick={addQuestion}
                  title="Add question"
                  type="button"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>

                <div className="gf-rt-divider" />

                <button
                  className="gf-rt-btn"
                  onClick={() => {
                    const title = window.prompt('Section title (optional):', '');
                    if (title === null) return; // cancelled
                    setQuestions(prev => [
                      ...prev,
                      {
                        id: `s_${Date.now()}`,
                        _isSection: true,
                        sectionTitle: title || '',
                        sectionDesc: '',
                      }
                    ]);
                  }}
                  title="Add section"
                  type="button"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* ── RESPONSES TAB ── */}
          {tab === 'responses' && (
            <div className="tm-responses">
              {/* Summary cards */}
              <div className="tm-res-summary">
                <div className="tm-res-stat">
                  <div className="tm-res-stat-val">{responses.length}</div>
                  <div className="tm-res-stat-label">Total Responses</div>
                </div>
                <div className="tm-res-stat">
                  <div className="tm-res-stat-val" style={{color:'#27ae60'}}>
                    {responses.filter(r => r.isPassed).length}
                  </div>
                  <div className="tm-res-stat-label">Passed</div>
                </div>
                <div className="tm-res-stat">
                  <div className="tm-res-stat-val" style={{color:'#e53e3e'}}>
                    {responses.filter(r => !r.isPassed).length}
                  </div>
                  <div className="tm-res-stat-label">Failed</div>
                </div>
                <div className="tm-res-stat">
                  <div className="tm-res-stat-val">
                    {responses.length > 0
                      ? Math.round(responses.reduce((s,r) => s + (r.score||0), 0) / responses.length)
                      : 0}
                  </div>
                  <div className="tm-res-stat-label">Avg Score</div>
                </div>
                <div className="tm-res-stat">
                  <div className="tm-res-stat-val">
                    {responses.length > 0
                      ? Math.round(responses.filter(r => r.isPassed).length / responses.length * 100)
                      : 0}%
                  </div>
                  <div className="tm-res-stat-label">Pass Rate</div>
                </div>
              </div>

              {/* Filters */}
              <div className="tm-res-filters">
                <select
                  value={resFilter.dept}
                  onChange={e => setResFilter(f => ({...f, dept: e.target.value}))}
                  className="tm-res-filter-select"
                >
                  <option value="">All Departments</option>
                  {[...new Set(responses.map(r => r.departmentId?.name).filter(Boolean))].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <select
                  value={resFilter.result}
                  onChange={e => setResFilter(f => ({...f, result: e.target.value}))}
                  className="tm-res-filter-select"
                >
                  <option value="">All Results</option>
                  <option value="pass">Pass Only</option>
                  <option value="fail">Fail Only</option>
                </select>
                {(resFilter.dept || resFilter.result) && (
                  <button className="tm-res-clear" onClick={() => setResFilter({dept:'',result:''})}>✕ Clear</button>
                )}
                <button
                  className="tm-res-export"
                  onClick={() => {
                    const filtered = responses.filter(r =>
                      (!resFilter.dept || r.departmentId?.name === resFilter.dept) &&
                      (!resFilter.result || (resFilter.result === 'pass' ? r.isPassed : !r.isPassed))
                    );
                    const csv = ['Name,Department,Shift,Phone,Score,Total,Pass/Fail,Date',
                      ...filtered.map(r => `${r.name},${r.departmentId?.name||''},${r.shiftId?.name||''},${r.phone||''},${r.score||0},${r.totalMarks||0},${r.isPassed?'Pass':'Fail'},${r.completedAt?new Date(r.completedAt).toLocaleDateString('en-IN'):''}`)
                    ].join('\n');
                    const a = document.createElement('a');
                    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
                    a.download = `${editTest?.title||'test'}-responses.csv`;
                    a.click();
                  }}
                >
                  ↓ Export CSV
                </button>
              </div>

              {/* Response table */}
              {resLoading ? (
                <div className="tm-shimmer-wrap">{[1,2,3].map(i=><div key={i} className="tm-shimmer"/>)}</div>
              ) : responses.length === 0 ? (
                <div className="tm-empty">
                  <div className="tm-empty-icon">📊</div>
                  <p className="tm-empty-title">No responses yet</p>
                  <p className="tm-empty-sub">Responses will appear here once team members take this test.</p>
                </div>
              ) : (
                <div className="tm-table-wrap">
                  <table className="tm-table" style={{tableLayout:'auto'}}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Shift</th>
                        <th>Score</th>
                        <th>Result</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {responses
                        .filter(r =>
                          (!resFilter.dept || r.departmentId?.name === resFilter.dept) &&
                          (!resFilter.result || (resFilter.result === 'pass' ? r.isPassed : !r.isPassed))
                        )
                        .map((r, i) => (
                          <tr key={i} className="tm-table-row">
                            <td className="tm-col-name">{r.name}</td>
                            <td className="tm-col-muted">{r.departmentId?.name || '—'}</td>
                            <td className="tm-col-muted">{r.shiftId?.name || '—'}</td>
                            <td><strong>{r.score||0}</strong>/{r.totalMarks||0}</td>
                            <td>
                              <span style={{
                                padding:'3px 10px', borderRadius:12, fontSize:11, fontWeight:700,
                                background: r.isPassed ? '#d1fae5' : '#fee2e2',
                                color: r.isPassed ? '#065f46' : '#7f1d1d'
                              }}>
                                {r.isPassed ? 'PASS' : 'FAIL'}
                              </span>
                            </td>
                            <td className="tm-col-muted">
                              {r.completedAt ? new Date(r.completedAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) : '—'}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── SETTINGS TAB ── */}
          {tab === 'settings' && (
            <div className="tm-form-area">
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
                  {saving ? 'Saving…' : editTest ? 'Save Changes' : 'Save Test'}
                </button>
              </div>
            </div>
          )}

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
