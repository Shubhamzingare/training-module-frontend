import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import '../../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { logout, user } = useAuth();

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>🎓 Admin Dashboard</h1>
        <div className="header-actions">
          <span>Welcome, {user?.name}</span>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <nav className="admin-nav">
        <Link to="/admin/modules">📚 Modules</Link>
        <Link to="/admin/tests">📝 Tests</Link>
        <Link to="/admin/batches">👥 Batches</Link>
        <Link to="/admin/performance">📊 Performance</Link>
      </nav>

      <main className="admin-content">
        <Routes>
          <Route path="/" element={<AdminHome />} />
          <Route path="/modules" element={<div>Modules Management - Coming Soon</div>} />
          <Route path="/tests" element={<div>Tests Management - Coming Soon</div>} />
          <Route path="/batches" element={<div>Batches Management - Coming Soon</div>} />
          <Route path="/performance" element={<div>Performance Dashboard - Coming Soon</div>} />
        </Routes>
      </main>
    </div>
  );
};

const AdminHome = () => {
  return (
    <div className="admin-home">
      <h2>Welcome to Admin Panel</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>0</h3>
          <p>Total Modules</p>
        </div>
        <div className="stat-card">
          <h3>0</h3>
          <p>Active Tests</p>
        </div>
        <div className="stat-card">
          <h3>0</h3>
          <p>Team Members</p>
        </div>
        <div className="stat-card">
          <h3>0%</h3>
          <p>Avg. Completion</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
