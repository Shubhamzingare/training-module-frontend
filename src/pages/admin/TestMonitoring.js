import React, { useState, useEffect } from 'react';
import '../../styles/TestMonitoring.css';

const TestMonitoring = () => {
  const [activeSessions, setActiveSessions] = useState([]);
  const [selectedTest, setSelectedTest] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/performance/sessions`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setActiveSessions(data.data || []);
        } else {
          console.error('Failed to fetch sessions:', response.statusText);
          // Fallback to mock data
          setActiveSessions(getMockSessions());
        }
      } catch (error) {
        console.error('Error fetching sessions:', error);
        // Fallback to mock data
        setActiveSessions(getMockSessions());
      }
    };

    fetchSessions();

    // Refresh every 30 seconds if auto-refresh is enabled
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchSessions();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getMockSessions = () => [
    {
      id: 'session_1',
      userId: 'user_1',
      userName: 'Komal Sharma',
      email: 'komal@habuild.in',
      testName: 'CRM Basics Test',
      department: 'Sales',
      shift: '6 AM - 2 PM',
      currentQuestion: 5,
      totalQuestions: 10,
      timeSpent: '5:30',
      timeRemaining: '24:30',
      status: 'in_progress',
      progressPercent: 18,
    },
    {
      id: 'session_2',
      userId: 'user_2',
      userName: 'Priya Singh',
      email: 'priya@habuild.in',
      testName: 'Growth Marketing Test',
      department: 'Marketing',
      shift: '2 PM - 10 PM',
      currentQuestion: 8,
      totalQuestions: 15,
      timeSpent: '12:00',
      timeRemaining: '33:00',
      status: 'in_progress',
      progressPercent: 27,
    },
    {
      id: 'session_3',
      userId: 'user_3',
      userName: 'Amit Kumar',
      email: 'amit@habuild.in',
      testName: 'CRM Basics Test',
      department: 'Support',
      shift: '6 AM - 2 PM',
      currentQuestion: 10,
      totalQuestions: 10,
      timeSpent: '28:00',
      timeRemaining: '2:00',
      status: 'near_completion',
      progressPercent: 93,
    },
  ];


  const filteredSessions = selectedTest === 'all'
    ? activeSessions
    : activeSessions.filter(s => s.testName === selectedTest);

  const uniqueTests = [...new Set(activeSessions.map(s => s.testName))];

  return (
    <div className="test-monitoring-page">
      <h2>📊 Live Test Monitoring</h2>

      <div className="monitoring-controls">
        <div className="filter-section">
          <label>Filter by Test:</label>
          <select value={selectedTest} onChange={(e) => setSelectedTest(e.target.value)}>
            <option value="all">All Tests</option>
            {uniqueTests.map((test) => (
              <option key={test} value={test}>
                {test}
              </option>
            ))}
          </select>
        </div>

        <div className="refresh-section">
          <label>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto-refresh every 30s
          </label>
        </div>

        <div className="stats">
          <div className="stat">
            <span className="label">Active Sessions</span>
            <span className="value">{filteredSessions.length}</span>
          </div>
          <div className="stat">
            <span className="label">In Progress</span>
            <span className="value">
              {filteredSessions.filter(s => s.status === 'in_progress').length}
            </span>
          </div>
          <div className="stat">
            <span className="label">Near Completion</span>
            <span className="value">
              {filteredSessions.filter(s => s.status === 'near_completion').length}
            </span>
          </div>
        </div>
      </div>

      <div className="sessions-list">
        {filteredSessions.length > 0 ? (
          <table className="sessions-table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Test</th>
                <th>Department</th>
                <th>Question Progress</th>
                <th>Time Spent</th>
                <th>Time Remaining</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map((session) => {
                const questionProgressPercent = session.totalQuestions > 0
                  ? (session.currentQuestion / session.totalQuestions) * 100
                  : 0;
                const progressPercent = session.progressPercent || 0;

                return (
                  <tr key={session.id} className={`session-row ${session.status}`}>
                    <td>
                      <strong>{session.userName}</strong>
                    </td>
                    <td>{session.email}</td>
                    <td>{session.testName}</td>
                    <td>{session.department}</td>
                    <td>
                      <div className="progress-container">
                        <div className="progress-bar">
                          <div
                            className="progress-fill question"
                            style={{ width: `${questionProgressPercent}%` }}
                          />
                        </div>
                        <span className="progress-text">
                          Q {session.currentQuestion}/{session.totalQuestions}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="time-spent">{session.timeSpent}</span>
                    </td>
                    <td>
                      <span className={`time-remaining ${progressPercent > 80 ? 'warning' : ''}`}>
                        {session.timeRemaining}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${session.status}`}>
                        {session.status === 'in_progress' && '🔵 In Progress'}
                        {session.status === 'near_completion' && '🟡 Nearly Done'}
                        {session.status === 'completed' && '✓ Completed'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <p>No active test sessions</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestMonitoring;
