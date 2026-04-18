import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/TestGate.css';

const TestGate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const testId = searchParams.get('testId');

  const [formData, setFormData] = useState({
    name: '',
    department: '',
    designation: '',
    shift: '',
    phone: '',
  });

  const [departments, setDepartments] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // TODO: Fetch departments and shifts from API
    const mockDepartments = [
      { id: '1', name: 'Payment' },
      { id: '2', name: 'DM' },
      { id: '3', name: 'Yoga & Physio' },
      { id: '4', name: 'Calling' },
      { id: '5', name: 'QC Team' },
      { id: '6', name: 'Interns' },
    ];

    const mockShifts = [
      { id: '1', name: '6 AM – 2 PM', timeRange: '6am-2pm' },
      { id: '2', name: '2 PM – 10 PM', timeRange: '2pm-10pm' },
    ];

    setDepartments(mockDepartments);
    setShifts(mockShifts);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.department) {
      setError('Department is required');
      return;
    }
    if (!formData.designation.trim()) {
      setError('Designation is required');
      return;
    }
    if (!formData.shift) {
      setError('Shift is required');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Phone/Employee ID is required');
      return;
    }

    setLoading(true);

    try {
      // TODO: POST to /api/public/tests/:testId/start with formData
      // This should return a testSessionId
      const mockSessionId = 'session_' + Date.now();

      // Store session data in localStorage for test page to access
      localStorage.setItem('testSession', JSON.stringify({
        sessionId: mockSessionId,
        testId: testId,
        ...formData,
      }));

      // Navigate to test page
      navigate(`/test/${mockSessionId}`);
    } catch (err) {
      setError(err.message || 'Failed to start test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="test-gate-page">
      <div className="test-gate-container">
        <div className="test-gate-card">
          <h1>📝 Test Information</h1>
          <p className="subtitle">Please provide your information to start the test</p>

          <form onSubmit={handleSubmit} className="test-gate-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                disabled={loading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone / Employee ID *</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g., 9876543210"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="designation">Designation *</label>
                <input
                  type="text"
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  placeholder="Your job title"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="department">Department *</label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  <option value="">Select your department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="shift">Shift *</label>
                <select
                  id="shift"
                  name="shift"
                  value={formData.shift}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  <option value="">Select your shift</option>
                  {shifts.map((shift) => (
                    <option key={shift.id} value={shift.id}>
                      {shift.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Starting test...' : 'Start Test'}
            </button>

            <p className="form-note">
              * All fields are required to proceed with the test
            </p>
          </form>
        </div>

        <div className="test-info-card">
          <h3>📌 Test Guidelines</h3>
          <ul>
            <li>Ensure you have a stable internet connection</li>
            <li>The test timer will start once you click "Start Test"</li>
            <li>You can navigate between questions</li>
            <li>Your answers are auto-saved</li>
            <li>Review your answers before submitting</li>
            <li>Results will be displayed immediately after submission</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestGate;
