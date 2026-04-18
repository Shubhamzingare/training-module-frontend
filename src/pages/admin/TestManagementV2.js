import React, { useState, useEffect, useRef, useCallback } from 'react';
import GoogleFormBuilder from '../../components/admin/GoogleFormBuilder';
import '../../styles/admin/TestManagementV2.css';

const API = `${process.env.REACT_APP_API_URL || (process.env.REACT_APP_API_URL || 'http://localhost:5000')}/api/admin`;

const BLANK = {
  title: 'Untitled Test',
  description: '',
  totalMarks: 100,
  passingMarks: 50,
  timeLimit: 30,
  status: 'draft',
  shuffleQuestions: false,
  shuffleOptions: false,
  allowMultipleAttempts: false,
  maxAttempts: 1,
  responseVisibility: 'score_only',
  autoSubmitOnTimeEnd: true,
  showProgressBar: true,
  requireEmail: false,
};

// mode: 'library' | 'create'
export default function TestManagementV2({ mode = 'library', onModeChange }) {
  // Always get fresh token from localStorage
  const getHdr = () => ({
    Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
    'Content-Type': 'application/json',
  });
  const hdr = { current: getHdr() };
  // Refresh headers before every use
  const H = () => getHdr();

  const [view,        setView]        = useState('list');
  const [tab,         setTab]         = useState('questions');
  const [tests,       setTests]       = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [savingQ,     setSavingQ]     = useState(false);
  const [autoSaveMsg, setAutoSaveMsg] = useState('');
  const [test,        setTest]        = useState(null);
  const [form,        setForm]        = useState(BLANK);
  const [categories,  setCategories]  = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [modules,     setModules]     = useState([]);
  const saveTimer   = useRef(null);
  const creatingRef = useRef(false);
  const prevMode    = useRef(mode);

  /* ── load tests, categories, modules ── */
  const loadTests = useCallback(async () => {
    setListLoading(true);
    try {
      const r = await fetch(`${API}/tests`, { headers: H() });
      const d = await r.json();
      setTests(d.data || []);
    } catch { /* ignore */ }
    setListLoading(false);
  }, []);

  useEffect(() => {
    loadTests();
    // load categories
    fetch(`${API}/categories`, { headers: H() })
      .then(r => r.json()).then(d => setCategories(d.data || [])).catch(() => {});
    // load modules
    fetch(`${API}/modules`, { headers: H() })
      .then(r => r.json()).then(d => setModules(d.data || [])).catch(() => {});
  }, [loadTests]);

  /* ── respond to sidebar mode changes ── */
  useEffect(() => {
    if (prevMode.current === mode) return;
    prevMode.current = mode;
    if (mode === 'create') {
      handleNewTest();
    } else if (mode === 'library') {
      // go back to list without re-creating
      setView('list');
      setTest(null);
      loadTests();
    }
    // eslint-disable-next-line
  }, [mode]);

  /* ── create test ── */
  async function handleNewTest() {
    if (creatingRef.current) return;
    creatingRef.current = true;
    try {
      const r = await fetch(`${API}/tests`, {
        method: 'POST',
        headers: H(),
        body: JSON.stringify({
          title: 'Untitled Test', description: '',
          totalMarks: 100, passingMarks: 50, timeLimit: 30, status: 'draft',
        }),
      });
      if (!r.ok) {
        const err = await r.json();
        throw new Error(err.message || err.error?.message || `Server error (${r.status})`);
      }
      const d = await r.json();
      openBuilder(d.data);
    } catch (e) {
      alert('Could not create test: ' + e.message);
      onModeChange?.('library');
    } finally {
      creatingRef.current = false;
    }
  }

  /* ── open existing ── */
  async function openExisting(id) {
    try {
      const r = await fetch(`${API}/tests/${id}`, { headers: H() });
      const d = await r.json();
      openBuilder(d.data);
    } catch { alert('Could not load test.'); }
  }

  function openBuilder(testData) {
    setTest(testData);
    setForm({ ...BLANK, ...testData });
    setTab('questions');
    setView('builder');
  }

  /* ── settings auto-save ── */
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const v = type === 'checkbox' ? checked
      : ['totalMarks','passingMarks','timeLimit','maxAttempts'].includes(name)
        ? (parseInt(value) || 0) : value;
    const updated = { ...form, [name]: v };
    setForm(updated);
    scheduleSave(updated);
  }

  function toggleField(name) {
    const updated = { ...form, [name]: !form[name] };
    setForm(updated);
    scheduleSave(updated);
  }

  function scheduleSave(updated) {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      if (!test?._id) return;
      try {
        await fetch(`${API}/tests/${test._id}`, {
          method: 'PUT', headers: H(),
          body: JSON.stringify(updated),
        });
        setAutoSaveMsg('Saved');
        setTimeout(() => setAutoSaveMsg(''), 2000);
      } catch { /* ignore */ }
    }, 700);
  }

  /* ── save questions ── */
  async function handleSaveQuestions(questions) {
    if (!test?._id) return;
    setSavingQ(true);
    try {
      // delete old
      for (const q of (test.questions || [])) {
        if (q._id) await fetch(`${API}/tests/${test._id}/questions/${q._id}`, {
          method: 'DELETE', headers: H(),
        }).catch(() => {});
      }
      // add new
      for (let i = 0; i < questions.length; i++) {
        await fetch(`${API}/tests/${test._id}/questions`, {
          method: 'POST', headers: H(),
          body: JSON.stringify({ ...questions[i], order: i }),
        });
      }
      // reload test
      const r = await fetch(`${API}/tests/${test._id}`, { headers: H() });
      const d = await r.json();
      setTest(d.data);
    } catch (e) {
      alert('Error saving questions: ' + e.message);
    } finally {
      setSavingQ(false);
    }
  }

  /* ── toggle publish ── */
  async function toggleStatus() {
    if (!test?._id) return;
    const next = test.status === 'draft' ? 'active' : 'draft';
    await fetch(`${API}/tests/${test._id}`, {
      method: 'PUT', headers: H(),
      body: JSON.stringify({ status: next }),
    });
    setTest(t => ({ ...t, status: next }));
    setForm(f => ({ ...f, status: next }));
    loadTests();
  }

  /* ── delete ── */
  async function deleteTest(id, e) {
    e.stopPropagation();
    if (!window.confirm('Delete this test?')) return;
    await fetch(`${API}/tests/${id}`, { method: 'DELETE', headers: H() });
    setTests(prev => prev.filter(t => t._id !== id));
    if (test?._id === id) { setView('list'); setTest(null); }
  }

  /* ── back ── */
  function goBack() {
    setView('list');
    setTest(null);
    onModeChange?.('library');
    loadTests();
  }

  const currentStatus = test?.status || 'draft';
  const questionCount = (test?.questions || []).length;

  /* ── filter state ── */
  const [filterModule,   setFilterModule]   = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const MODULE_LABELS = { wati_training: 'Support Training', new_deployment: 'New Deployment' };

  const filteredTests = tests.filter(t => {
    if (filterModule && t.moduleType !== filterModule) return false;
    if (filterCategory && (t.categoryId?._id || t.categoryId) !== filterCategory) return false;
    return true;
  });

  const filteredCategories = categories.filter(c =>
    !filterModule || c.type === filterModule
  );

  /* ════════ LIBRARY VIEW ════════ */
  if (view === 'list') return (
    <div className="tm-library">
      <div className="tm-library-head">
        <div>
          <h2>Test Library</h2>
          <p>{filteredTests.length} of {tests.length} test{tests.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="tm-btn-primary" onClick={handleNewTest}>+ New Test</button>
      </div>

      {/* ── Filters ── */}
      <div className="tm-filters">
        <select
          className="tm-filter-select"
          value={filterModule}
          onChange={e => { setFilterModule(e.target.value); setFilterCategory(''); }}
        >
          <option value="">All Modules</option>
          <option value="wati_training">Support Training</option>
          <option value="new_deployment">New Deployment</option>
        </select>

        <select
          className="tm-filter-select"
          value={filterCategory}
          disabled={!filterModule}
          onChange={e => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {filteredCategories.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        {(filterModule || filterCategory) && (
          <button className="tm-filter-clear" onClick={() => { setFilterModule(''); setFilterCategory(''); }}>
            ✕ Clear
          </button>
        )}
      </div>

      {listLoading && (
        <div className="tm-shimmer-wrap">
          {[1,2,3].map(i => <div key={i} className="tm-shimmer" />)}
        </div>
      )}

      {!listLoading && tests.length === 0 && (
        <div className="tm-empty">
          <div className="tm-empty-icon">📋</div>
          <p className="tm-empty-title">No tests yet</p>
          <p className="tm-empty-sub">Click "Create Test" in the left sidebar or the button above</p>
          <button className="tm-btn-primary" onClick={handleNewTest}>+ Create Test</button>
        </div>
      )}

      {!listLoading && tests.length > 0 && filteredTests.length === 0 && (
        <div className="tm-empty">
          <div className="tm-empty-icon">🔍</div>
          <p className="tm-empty-title">No tests match filters</p>
          <button className="tm-filter-clear" onClick={() => { setFilterModule(''); setFilterCategory(''); }}>
            Clear Filters
          </button>
        </div>
      )}

      {!listLoading && filteredTests.length > 0 && (
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
              {filteredTests.map(t => {
                const catName = t.categoryId?.name || (categories.find(c => c._id === t.categoryId)?.name) || '—';
                const modLabel = MODULE_LABELS[t.moduleType] || '—';
                return (
                  <tr key={t._id} className="tm-table-row" onClick={() => openExisting(t._id)}>
                    <td className="tm-col-name">{t.title || 'Untitled Test'}</td>
                    <td className="tm-col-muted">{modLabel}</td>
                    <td className="tm-col-muted">{catName}</td>
                    <td className="tm-col-center">{t.totalMarks}</td>
                    <td className="tm-col-center">{(t.questions || []).length}</td>
                    <td><span className={`tm-badge tm-badge-${t.status}`}>{t.status}</span></td>
                    <td className="tm-col-muted">{t.createdBy?.name || '—'}</td>
                    <td className="tm-col-muted">{t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—'}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <div className="tm-tbl-actions">
                        <button className="tm-edit-btn" onClick={() => openExisting(t._id)}>Edit</button>
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

  /* ════════ BUILDER VIEW ════════ */
  return (
    <div className="tm-builder">

      {/* top bar */}
      <div className="tm-bar">
        <button className="tm-bar-back" onClick={goBack}>← Test Library</button>

        <div className="tm-bar-tabs">
          <button className={`tm-tab ${tab==='questions'?'active':''}`} onClick={() => setTab('questions')}>Questions</button>
          <button className={`tm-tab ${tab==='settings'?'active':''}`}  onClick={() => setTab('settings')}>Settings</button>
        </div>

        <div className="tm-bar-end">
          {(autoSaveMsg || savingQ) && (
            <span className="tm-saved">{savingQ ? 'Saving…' : autoSaveMsg}</span>
          )}
          <button className={`tm-publish-btn tm-publish-${currentStatus}`} onClick={toggleStatus}>
            {currentStatus === 'draft' ? 'Publish' : 'Unpublish'}
          </button>
        </div>
      </div>

      {/* body */}
      <div className="tm-builder-body">
        <div className="tm-form-area">

          {tab === 'questions' && (
            <>
              <div className="tm-title-card">
                <div className="tm-title-stripe" />
                <div className="tm-title-inner">
                  <input
                    className="tm-title-inp"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Test title"
                  />
                  <textarea
                    className="tm-desc-inp"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Description (optional)"
                    rows={2}
                  />

                  {/* Module Type → Category → Module hierarchy */}
                  <div className="tm-meta-fields">
                    <div className="tm-meta-field">
                      <label>Module</label>
                      <select
                        name="moduleType"
                        value={form.moduleType || ''}
                        onChange={e => {
                          const updated = { ...form, moduleType: e.target.value, categoryId: '', moduleId: '' };
                          setForm(updated);
                          scheduleSave(updated);
                        }}
                      >
                        <option value="">— Select Module —</option>
                        <option value="wati_training">Support Training</option>
                        <option value="new_deployment">New Deployment</option>
                      </select>
                    </div>

                    <div className="tm-meta-field">
                      <label>Category</label>
                      <select
                        name="categoryId"
                        value={form.categoryId || ''}
                        disabled={!form.moduleType}
                        onChange={e => {
                          const updated = { ...form, categoryId: e.target.value, moduleId: '' };
                          setForm(updated);
                          scheduleSave(updated);
                        }}
                      >
                        <option value="">— Select Category —</option>
                        {categories
                          .filter(c => !form.moduleType || c.type === form.moduleType)
                          .map(c => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                          ))}
                      </select>
                    </div>

                  </div>

                  <div className="tm-title-meta">
                    <span>{form.totalMarks} marks</span>
                    <span className="tm-dot">·</span>
                    <span>{form.timeLimit} min</span>
                    <span className="tm-dot">·</span>
                    <span>{questionCount} question{questionCount!==1?'s':''}</span>
                    <span className={`tm-status-tag tm-status-${currentStatus}`}>{currentStatus}</span>
                  </div>
                </div>
              </div>

              <GoogleFormBuilder
                testId={test?._id}
                initialQuestions={test?.questions || []}
                onSave={handleSaveQuestions}
              />
            </>
          )}

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
                ].map(o => <ToggleRow key={o.name} label={o.label} on={form[o.name]} onToggle={() => toggleField(o.name)} />)}
              </div>

              <div className="tm-set-card">
                <div className="tm-set-head">Response Settings</div>
                {[
                  { name:'allowMultipleAttempts', label:'Allow multiple attempts'    },
                  { name:'autoSubmitOnTimeEnd',   label:'Auto-submit when time ends' },
                  { name:'requireEmail',          label:'Require email to start'     },
                ].map(o => <ToggleRow key={o.name} label={o.label} on={form[o.name]} onToggle={() => toggleField(o.name)} />)}

                {form.allowMultipleAttempts && (
                  <div className="tm-set-field tm-set-sub">
                    <label>Max Attempts</label>
                    <input type="number" name="maxAttempts" value={form.maxAttempts} onChange={handleChange} min="1" />
                  </div>
                )}

                <div className="tm-set-field tm-set-solo">
                  <label>Show respondents</label>
                  <select name="responseVisibility" value={form.responseVisibility} onChange={handleChange}>
                    <option value="score_only">Only their score</option>
                    <option value="score_and_answers">Score + correct answers</option>
                    <option value="full_feedback">Full feedback</option>
                  </select>
                </div>
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
