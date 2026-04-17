import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import '../../styles/UserDashboard.css';

const UserDashboard = () => {
  const { logout, user } = useAuth();

  return (
    <div className="user-dashboard">
      <header className="user-header">
        <h1>📚 Training Module Platform</h1>
        <div className="header-actions">
          <span>Welcome, {user?.name}</span>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <nav className="user-nav">
        <Link to="/">🏠 Home</Link>
        <Link to="/modules">📖 Modules</Link>
        <Link to="/my-scores">⭐ My Scores</Link>
      </nav>

      <main className="user-content">
        <Routes>
          <Route path="/" element={<UserHome />} />
          <Route path="/modules" element={<div>Available Modules - Coming Soon</div>} />
          <Route path="/my-scores" element={<div>My Test Scores - Coming Soon</div>} />
        </Routes>
      </main>
    </div>
  );
};

const UserHome = () => {
  return (
    <div className="user-home">
      <h2>Welcome to Training Module</h2>
      <p>Complete your training modules and take tests to track your progress.</p>

      <div className="progress-section">
        <h3>Your Progress</h3>
        <div className="progress-card">
          <div className="progress-stat">
            <span className="number">0</span>
            <span className="label">Modules Completed</span>
          </div>
          <div className="progress-stat">
            <span className="number">0</span>
            <span className="label">Tests Passed</span>
          </div>
          <div className="progress-stat">
            <span className="number">0%</span>
            <span className="label">Overall Progress</span>
          </div>
        </div>
      </div>

      <div className="modules-section">
        <h3>Available Modules</h3>
        <p>No modules available yet. Check back soon!</p>
      </div>
    </div>
  );
};

export default UserDashboard;
