import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/TeamLayout.css';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function TestGate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedTestId = searchParams.get('testId');

  const [form, setForm] = useState({
    name: '', departmentId: '', designation: '', shiftId: '', phone: '',
    testId: preselectedTestId || '',
  });
  const [departments,   setDepartments]   = useState([]);
  const [shifts,        setShifts]        = useState([]);
  const [tests,         setTests]         = useState([]);
  const [selectedTest,  setSelectedTest]  = useState(null);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState('');

  useEffect(() => {
    Promise.all([
      fetch(`${BASE}/api/public/departments`).then(r => r.json()),
      fetch(`${BASE}/api/public/shifts`).then(r => r.json()),
      fetch(`${BASE}/api/public/tests`).then(r => r.json()),
    ]).then(([depts, shifts, tests]) => {
      setDepartments(depts.data || []);
      setShifts(shifts.data || []);
      const active = (tests.data || []).filter(t => t.status === 'active');
      setTests(active);
      if (preselectedTestId) {
        setSelectedTest(active.find(t => t._id === preselectedTestId) || null);
      }
    }).catch(console.error);
  }, [preselectedTestId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'testId') setSelectedTest(tests.find(t => t._id === value) || null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim())    { setError('Please enter your full name'); return; }
    if (!form.departmentId)   { setError('Please select your department'); return; }
    if (!form.shiftId)        { setError('Please select your shift'); return; }
    if (!form.phone.trim())   { setError('Please enter your phone or employee ID'); return; }
    if (!form.testId)         { setError('Please select a test'); return; }

    setLoading(true);
    try {
      const r = await fetch(`${BASE}/api/public/tests/${form.testId}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, departmentId: form.departmentId,
          shiftId: form.shiftId, designation: form.designation, phone: form.phone,
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error?.message || 'Could not start test');
      sessionStorage.setItem('testUser', JSON.stringify({ name: form.name, phone: form.phone }));
      navigate(`/test/${data.data.sessionId || data.data._id}?testId=${form.testId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="team-shell">

      {/* Sidebar */}
      <aside className="team-sidebar">
        <div className="team-sidebar-logo">
          <div className="team-sidebar-logo-icon">⬡</div>
          <div>
            <div className="team-sidebar-logo-text">Habuild</div>
            <div className="team-sidebar-logo-sub">Training Portal</div>
          </div>
        </div>
        <nav className="team-nav">
          <button className="team-nav-item" onClick={() => navigate('/')}>
            <span className="team-nav-icon">✓</span>
            <span className="team-nav-label">Tests</span>
          </button>
          <button className="team-nav-item" onClick={() => navigate('/')}>
            <span className="team-nav-icon">▦</span>
            <span className="team-nav-label">Training Material</span>
          </button>
        </nav>
      </aside>

      {/* Main */}
      <div className="team-main">

        <div className="team-topbar">
          <span className="team-topbar-title">Start Test</span>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'none', border: 'none', fontSize: 13, color: '#718096', cursor: 'pointer' }}
          >
            ← Back
          </button>
        </div>

        <div className="team-content">
          <div className="team-start-screen">

            {/* Welcome card */}
            <div className="team-start-welcome">
              <div className="team-start-welcome-top">
                <h1>Hello! Let's start 👋</h1>
                <p>Fill in your details below to begin your assessment</p>
              </div>

              {selectedTest && (
                <div className="team-start-test-info">
                  <div className="team-start-test-icon">📋</div>
                  <div className="team-start-test-details">
                    <h3>{selectedTest.title}</h3>
                    <div className="team-start-test-meta">
                      <span>⏱ {selectedTest.timeLimit} min</span>
                      <span>📝 {selectedTest.totalMarks} marks</span>
                      <span>✓ Pass: {selectedTest.passingMarks}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Form card */}
            <div className="team-start-form-card">
              <div className="team-start-form-head">
                <h3>Your Details</h3>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="team-start-form-body">
                  {error && <div className="team-error">{error}</div>}

                  <div className="team-field">
                    <label>Full Name *</label>
                    <input
                      type="text" name="name" placeholder="Enter your full name"
                      value={form.name} onChange={handleChange} required
                    />
                  </div>

                  <div className="team-form-row">
                    <div className="team-field">
                      <label>Department *</label>
                      <select name="departmentId" value={form.departmentId} onChange={handleChange} required>
                        <option value="">Select department</option>
                        {departments.map(d => (
                          <option key={d._id} value={d._id}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="team-field">
                      <label>Shift *</label>
                      <select name="shiftId" value={form.shiftId} onChange={handleChange} required>
                        <option value="">Select shift</option>
                        {shifts.map(s => (
                          <option key={s._id} value={s._id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="team-form-row">
                    <div className="team-field">
                      <label>Designation</label>
                      <input
                        type="text" name="designation" placeholder="Your role / designation"
                        value={form.designation} onChange={handleChange}
                      />
                    </div>
                    <div className="team-field">
                      <label>Phone / Employee ID *</label>
                      <input
                        type="text" name="phone" placeholder="Phone or Emp ID"
                        value={form.phone} onChange={handleChange} required
                      />
                    </div>
                  </div>

                  {!preselectedTestId && (
                    <div className="team-field">
                      <label>Select Test *</label>
                      <select name="testId" value={form.testId} onChange={handleChange} required>
                        <option value="">Choose a test</option>
                        {tests.map(t => (
                          <option key={t._id} value={t._id}>{t.title}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="team-start-form-footer">
                  <p>All fields marked * are required</p>
                  <button type="submit" className="team-final-btn" disabled={loading}>
                    {loading ? 'Starting…' : 'Start Test →'}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
