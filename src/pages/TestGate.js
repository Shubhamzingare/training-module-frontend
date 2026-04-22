import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/TestGate.css';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function TestGate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedTestId = searchParams.get('testId');

  const [form, setForm] = useState({ name: '', departmentId: '', designation: '', shiftId: '', phone: '', testId: preselectedTestId || '' });
  const [departments, setDepartments] = useState([]);
  const [shifts,      setShifts]      = useState([]);
  const [tests,       setTests]       = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');

  useEffect(() => {
    // Load departments, shifts, and active tests
    Promise.all([
      fetch(`${BASE}/api/public/departments`).then(r => r.json()),
      fetch(`${BASE}/api/public/shifts`).then(r => r.json()),
      fetch(`${BASE}/api/admin/tests`).then(r => r.json()),
    ]).then(([depts, shifts, tests]) => {
      setDepartments(depts.data || []);
      setShifts(shifts.data || []);
      const active = (tests.data || []).filter(t => t.status === 'active');
      setTests(active);
      if (preselectedTestId) {
        const t = active.find(t => t._id === preselectedTestId);
        setSelectedTest(t || null);
      }
    }).catch(console.error);
  }, [preselectedTestId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'testId') {
      setSelectedTest(tests.find(t => t._id === value) || null);
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Please enter your name'); return; }
    if (!form.departmentId) { setError('Please select your department'); return; }
    if (!form.shiftId)      { setError('Please select your shift'); return; }
    if (!form.phone.trim()) { setError('Please enter your phone number'); return; }
    if (!form.testId)       { setError('Please select a test'); return; }

    setLoading(true);
    try {
      const r = await fetch(`${BASE}/api/public/tests/${form.testId}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          departmentId: form.departmentId,
          shiftId: form.shiftId,
          designation: form.designation,
          phone: form.phone,
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error?.message || 'Could not start test');

      // Store user info for results page
      sessionStorage.setItem('testUser', JSON.stringify({ name: form.name, phone: form.phone }));
      navigate(`/test/${data.data._id}?testId=${form.testId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gate-page">
      <div className="gate-header">
        <a href="/" className="gate-back">← Back</a>
        <div className="gate-logo">
          <div className="gate-logo-icon">⬡</div>
          <span>Habuild</span>
        </div>
      </div>

      <div className="gate-container">
        <div className="gate-card">
          <div className="gate-card-top" />
          <div className="gate-card-body">
            <h2>Before you begin</h2>
            <p className="gate-subtitle">Please fill in your details to start the test</p>

            {selectedTest && (
              <div className="gate-test-info">
                <div className="gate-test-name">📋 {selectedTest.title}</div>
                <div className="gate-test-meta">
                  <span>⏱ {selectedTest.timeLimit} min</span>
                  <span>·</span>
                  <span>📝 {selectedTest.totalMarks} marks</span>
                  <span>·</span>
                  <span>Pass: {selectedTest.passingMarks}</span>
                </div>
              </div>
            )}

            {error && <div className="gate-error">{error}</div>}

            <form className="gate-form" onSubmit={handleSubmit}>
              <div className="gate-field">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="gate-row">
                <div className="gate-field">
                  <label>Department *</label>
                  <select name="departmentId" value={form.departmentId} onChange={handleChange} required>
                    <option value="">Select department</option>
                    {departments.map(d => (
                      <option key={d._id} value={d._id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="gate-field">
                  <label>Shift *</label>
                  <select name="shiftId" value={form.shiftId} onChange={handleChange} required>
                    <option value="">Select shift</option>
                    {shifts.map(s => (
                      <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="gate-row">
                <div className="gate-field">
                  <label>Designation</label>
                  <input
                    type="text"
                    name="designation"
                    placeholder="Your designation"
                    value={form.designation}
                    onChange={handleChange}
                  />
                </div>
                <div className="gate-field">
                  <label>Phone / EmpID *</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone or Employee ID"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {!preselectedTestId && (
                <div className="gate-field">
                  <label>Select Test *</label>
                  <select name="testId" value={form.testId} onChange={handleChange} required>
                    <option value="">Choose a test</option>
                    {tests.map(t => (
                      <option key={t._id} value={t._id}>{t.title}</option>
                    ))}
                  </select>
                </div>
              )}

              <button type="submit" className="gate-submit-btn" disabled={loading}>
                {loading ? 'Starting…' : 'Start Test →'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
