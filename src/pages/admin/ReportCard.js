import React, { useState, useEffect, useCallback } from 'react';
import '../../styles/admin/ReportCard.css';

const ReportCard = () => {
  const [activeTab, setActiveTab] = useState('user-report');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [sessions, setSessions] = useState([]);
  const [deptStats, setDeptStats] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedUser, setExpandedUser] = useState(null);

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/public/departments`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setDepartments(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchReportData = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');

    try {
      // Fetch all sessions
      const sessionsRes = await fetch(
        `${process.env.REACT_APP_API_URL || (process.env.REACT_APP_API_URL || 'http://localhost:5000')}$1`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json();
        setSessions(sessionsData.data || []);
      }

      // Fetch department stats
      const deptRes = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/performance/departments`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (deptRes.ok) {
        const deptData = await deptRes.json();
        setDeptStats(deptData.data || []);
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
    }

    setLoading(false);
  }, [startDate, endDate]);

  // Set default date range (last 30 days)
  useEffect(() => {
    const end = new Date();
    const start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    setEndDate(end.toISOString().split('T')[0]);
    setStartDate(start.toISOString().split('T')[0]);
    fetchDepartments();
  }, []);

  // Fetch data when dates change
  useEffect(() => {
    if (startDate && endDate) {
      fetchReportData();
    }
  }, [startDate, endDate, fetchReportData]);

  // Group sessions by user
  const userSessions = sessions.reduce((acc, session) => {
    const key = session.email || session.name;
    if (!acc[key]) {
      acc[key] = {
        name: session.name,
        email: session.email,
        employeeId: session.employeeId,
        department: session.department,
        tests: [],
      };
    }
    acc[key].tests.push(session);
    return acc;
  }, {});

  // Filter users by selected department
  let filteredUserList = Object.values(userSessions);
  if (selectedDepartment !== 'all') {
    filteredUserList = filteredUserList.filter(
      user => user.department === selectedDepartment
    );
  }

  // Filter sessions by department for stats
  const filteredSessions = selectedDepartment === 'all'
    ? sessions
    : sessions.filter(s => s.department === selectedDepartment);

  const totalTestsInRange = filteredSessions.length;
  const completedTests = filteredSessions.filter(s => s.status === 'completed').length;
  const completionRate = totalTestsInRange > 0
    ? ((completedTests / totalTestsInRange) * 100).toFixed(1)
    : 0;

  const handleExportCSV = () => {
    let csv = 'User Name,Email,Employee ID,Department,Total Tests,Completed,Test Names,Scores,Status\n';

    filteredUserList.forEach(user => {
      const testNames = user.tests.map(t => t.testName).join('; ');
      const scores = user.tests.map(t => t.score).join('; ');
      const statuses = user.tests.map(t => t.isPassed ? 'Pass' : 'Fail').join('; ');
      const completedCount = user.tests.filter(t => t.status === 'completed').length;

      csv += `"${user.name}","${user.email}","${user.employeeId}","${user.department}",${user.tests.length},${completedCount},"${testNames}","${scores}","${statuses}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-report-${startDate}-to-${endDate}.csv`;
    a.click();
  };

  return (
    <div className="report-card">
      <div className="report-header">
        <h2>📊 Performance Report Card</h2>
        <p>Track team performance and generate detailed report cards</p>
      </div>

      {/* Date Filter */}
      <div className="date-filter">
        <div className="filter-group">
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Department</label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept._id || dept.name} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary" onClick={fetchReportData}>
          ◆ Refresh Report
        </button>
        <button className="btn btn-export" onClick={handleExportCSV}>
          ▼ Export CSV
        </button>
      </div>

      {/* Summary Stats */}
      <div className="summary-stats">
        <div className="stat-card">
          <div className="stat-value">{totalTestsInRange}</div>
          <div className="stat-label">Total Tests</div>
          <div className="stat-detail">In selected period</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{completedTests}</div>
          <div className="stat-label">Completed</div>
          <div className="stat-detail">Finished tests</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{completionRate}%</div>
          <div className="stat-label">Completion Rate</div>
          <div className="stat-detail">Overall progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{filteredUserList.length}</div>
          <div className="stat-label">Participants</div>
          <div className="stat-detail">Team members</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="report-tabs">
        <button
          className={`tab-btn ${activeTab === 'user-report' ? 'active' : ''}`}
          onClick={() => setActiveTab('user-report')}
        >
          👤 User Report
        </button>
        <button
          className={`tab-btn ${activeTab === 'department' ? 'active' : ''}`}
          onClick={() => setActiveTab('department')}
        >
          🏢 Department Summary
        </button>
      </div>

      {/* User Report Tab */}
      {activeTab === 'user-report' && (
        <div className="report-content">
          <div className="report-title">
            <h3>User-Wise Performance Report</h3>
            <span className="badge-count">{filteredUserList.length} Users</span>
          </div>

          {loading ? (
            <div className="loading">Loading report...</div>
          ) : filteredUserList.length > 0 ? (
            <div className="users-table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>User Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Total Tests</th>
                    <th>Completed</th>
                    <th>Completion %</th>
                    <th>Avg Score</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUserList.map((user, idx) => {
                    const completedCount = user.tests.filter(t => t.status === 'completed').length;
                    const completionPct = user.tests.length > 0
                      ? ((completedCount / user.tests.length) * 100).toFixed(0)
                      : 0;
                    const avgScore = user.tests.length > 0
                      ? (user.tests.reduce((sum, t) => sum + (t.score || 0), 0) / user.tests.length).toFixed(1)
                      : '-';

                    return (
                      <React.Fragment key={idx}>
                        <tr className="user-row">
                          <td className="user-name">
                            <strong>{user.name}</strong>
                          </td>
                          <td className="user-email">{user.email || '-'}</td>
                          <td className="user-dept">{user.department || '-'}</td>
                          <td className="test-count">{user.tests.length}</td>
                          <td className="completed-count">{completedCount}</td>
                          <td>
                            <div className="progress-bar-small">
                              <div className="progress-fill" style={{ width: `${completionPct}%` }}></div>
                              <span className="progress-text">{completionPct}%</span>
                            </div>
                          </td>
                          <td className="avg-score">
                            <strong>{avgScore}</strong>
                          </td>
                          <td className="action-cell">
                            <button
                              className="btn-expand"
                              onClick={() => setExpandedUser(expandedUser === idx ? null : idx)}
                            >
                              {expandedUser === idx ? '▼ Hide' : '▶ Show'}
                            </button>
                          </td>
                        </tr>

                        {/* Expandable Test History */}
                        {expandedUser === idx && (
                          <tr className="expand-row">
                            <td colSpan="8">
                              <div className="test-history">
                                <h4>📋 Test History for {user.name}</h4>
                                <div className="history-table-wrapper">
                                  <table className="history-table">
                                    <thead>
                                      <tr>
                                        <th>Test Name</th>
                                        <th>Date</th>
                                        <th>Score</th>
                                        <th>Total Marks</th>
                                        <th>Status</th>
                                        <th>Time Spent</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {user.tests.map((test, tidx) => (
                                        <tr key={tidx} className={test.isPassed ? 'passed' : 'failed'}>
                                          <td className="test-name">{test.testName}</td>
                                          <td className="test-date">
                                            {test.completedAt
                                              ? new Date(test.completedAt).toLocaleDateString()
                                              : '-'
                                            }
                                          </td>
                                          <td className="test-score"><strong>{test.score || 0}</strong></td>
                                          <td className="test-total">{test.totalMarks || 0}</td>
                                          <td className="test-status">
                                            <span className={`badge ${test.isPassed ? 'passed' : 'failed'}`}>
                                              {test.isPassed ? '✓ Pass' : '✗ Fail'}
                                            </span>
                                          </td>
                                          <td className="test-time">
                                            {test.completedAt && test.startedAt
                                              ? Math.floor((new Date(test.completedAt) - new Date(test.startedAt)) / 60000) + ' min'
                                              : '-'
                                            }
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <p>No test data available for the selected date range</p>
            </div>
          )}
        </div>
      )}

      {/* Department Summary Tab */}
      {activeTab === 'department' && (
        <div className="report-content">
          <div className="report-title">
            <h3>Department-Wise Performance</h3>
            <span className="badge-count">{deptStats.length} Departments</span>
          </div>

          {loading ? (
            <div className="loading">Loading report...</div>
          ) : deptStats.length > 0 ? (
            <div className="dept-grid">
              {deptStats.map((dept, idx) => (
                <div key={idx} className="dept-card">
                  <h4>{dept.department}</h4>
                  <div className="dept-stat">
                    <span className="label">Total Tests</span>
                    <span className="value">{dept.totalAttempts}</span>
                  </div>
                  <div className="dept-stat">
                    <span className="label">Passed</span>
                    <span className="value">{dept.passedAttempts}</span>
                  </div>
                  <div className="dept-stat">
                    <span className="label">Pass Rate</span>
                    <span className="value">{dept.passRate}%</span>
                  </div>
                  <div className="dept-stat">
                    <span className="label">Avg Score</span>
                    <span className="value">{dept.averageScore}</span>
                  </div>
                  <div className="progress-bar-dept">
                    <div className="progress-fill" style={{ width: `${dept.passRate}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No department data available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportCard;
