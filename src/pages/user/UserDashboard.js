import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import ModulesPage from './ModulesPage';
import ModuleViewPage from './ModuleViewPage';
import TestPage from './TestPage';
import TestResultPage from './TestResultPage';
import MyScoresPage from './MyScoresPage';
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
        <Link to="/">📖 Training Modules</Link>
        <Link to="/modules">📝 Tests</Link>
      </nav>

      <main className="user-content">
        <Routes>
          <Route path="/" element={<UserHome />} />
          <Route path="/modules" element={<ModulesPage />} />
          <Route path="/modules/*" element={<ModulesPage />} />
          <Route path="/modules/:moduleId" element={<ModuleViewPage />} />
          <Route path="/test/:testId" element={<TestPage />} />
          <Route path="/test-result/:attemptId" element={<TestResultPage />} />
          <Route path="/my-scores" element={<MyScoresPage />} />
          <Route path="/my-scores/*" element={<MyScoresPage />} />
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
        <p>Click on "Modules" in the navigation to get started!</p>
      </div>
    </div>
  );
};

export default UserDashboard;
