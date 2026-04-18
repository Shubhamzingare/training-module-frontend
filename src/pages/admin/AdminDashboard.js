import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import '../../styles/AdminDashboard.css';
import TestMonitoring from './TestMonitoring';
import ReportCard from './ReportCard';
import ContentManagement from './ContentManagement';
import TestManagement from './TestManagement';
import SettingsManagement from './SettingsManagement';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem('adminUser') || '{}'));

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>🎓 Admin Dashboard</h1>
        <div className="header-actions">
          <span>Welcome, {user?.name || 'Admin'}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <nav className="admin-nav">
        <Link to="/admin">📊 Dashboard</Link>
        <Link to="/admin/content">📄 Content</Link>
        <Link to="/admin/tests">📝 Tests</Link>
        <Link to="/admin/performance">⭐ Performance</Link>
        <Link to="/admin/settings">⚙️ Settings</Link>
        <Link to="/admin/logs">🔍 Access Logs</Link>
      </nav>

      <main className="admin-content">
        <Routes>
          <Route path="/" element={<AdminHome />} />
          <Route path="/content" element={<ContentPage />} />
          <Route path="/tests" element={<TestsPage />} />
          <Route path="/performance" element={<PerformancePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/logs" element={<LogsPage />} />
        </Routes>
      </main>
    </div>
  );
};

const AdminHome = () => {
  const [stats, setStats] = useState({
    totalSessions: 0,
    activeSessions: 0,
    completedSessions: 0,
    passRate: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch('http://localhost:5000/api/admin/performance/overview', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-home">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.totalSessions}</h3>
          <p>Total Sessions</p>
        </div>
        <div className="stat-card">
          <h3>{stats.activeSessions}</h3>
          <p>Active Tests</p>
        </div>
        <div className="stat-card">
          <h3>{stats.completedSessions}</h3>
          <p>Completed Tests</p>
        </div>
        <div className="stat-card">
          <h3>{stats.passRate}%</h3>
          <p>Pass Rate</p>
        </div>
      </div>
    </div>
  );
};

const ContentPage = () => {
  return <ContentManagement />;
};

const TestsPage = () => {
  return <TestManagement />;
};

const PerformancePage = () => {
  const [perfTab, setPerfTab] = useState('monitoring');

  return (
    <div className="performance-page">
      <div className="perf-tabs">
        <button
          className={`perf-tab-btn ${perfTab === 'monitoring' ? 'active' : ''}`}
          onClick={() => setPerfTab('monitoring')}
        >
          🔴 Live Monitoring
        </button>
        <button
          className={`perf-tab-btn ${perfTab === 'report' ? 'active' : ''}`}
          onClick={() => setPerfTab('report')}
        >
          📊 Report Card
        </button>
      </div>
      {perfTab === 'monitoring' && <TestMonitoring />}
      {perfTab === 'report' && <ReportCard />}
    </div>
  );
};

const SettingsPage = () => {
  return <SettingsManagement />;
};

const LogsPage = () => {
  return <div className="page-placeholder"><h2>🔍 Access Logs</h2><p>TODO: View admin access history</p></div>;
};

export default AdminDashboard;
