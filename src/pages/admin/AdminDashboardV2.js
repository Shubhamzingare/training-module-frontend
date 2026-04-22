import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin/AdminDashboardV2.css';

// Import all admin pages
import TestMonitoring from './TestMonitoring';
import ReportCard from './ReportCard';
import ModuleManagement from './ModuleManagement';
import TestManagementV2 from './TestManagementV2';
import SettingsManagement from './SettingsManagement';

const AdminDashboardV2 = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [testMode, setTestMode] = useState('library');
  const [testsOpen, setTestsOpen] = useState(false);
  const [testKey, setTestKey] = useState(0); // force remount to reload
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem('adminUser') || '{}'));

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const topMenuItems = [
    { id: 'dashboard',  label: 'Dashboard',       icon: '◆', description: 'Overview & Stats' },
    { id: 'training',   label: 'Training Modules', icon: '▦', description: 'Manage content'  },
    { id: 'performance',label: 'Performance',      icon: '▲', description: 'Live monitoring' },
    { id: 'reports',    label: 'Report Card',      icon: '▬', description: 'Analytics'       },
    { id: 'logs',       label: 'Action Logs',      icon: '◎', description: 'Admin activity'  },
    { id: 'settings',   label: 'Admin Settings',   icon: '⚙', description: 'Configuration'  },
  ];

  const handleMenuClick = (id) => {
    if (id === 'tests') {
      setTestsOpen(o => !o);
      setActiveSection('tests');
      setTestMode('library');
      setTestKey(k => k + 1);
    } else if (id === 'test-lib') {
      setTestMode('library');
      setActiveSection('tests');
      setTestsOpen(true);
      setTestKey(k => k + 1); // force reload
    } else if (id === 'test-create') {
      setTestMode('create');
      setActiveSection('tests');
      setTestsOpen(true);
      setTestKey(k => k + 1);
    } else {
      setActiveSection(id);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':  return <AdminHome />;
      case 'training':   return <ModuleManagement />;
      case 'tests':      return <TestManagementV2 key={testKey} mode={testMode} onModeChange={(m) => { setTestMode(m); if (m === 'library') setTestKey(k => k + 1); }} />;
      case 'performance':return <PerformancePage />;
      case 'reports':    return <ReportCard />;
      case 'settings':   return <SettingsManagement />;
      case 'logs':       return <LogsPage />;
      default:           return <AdminHome />;
    }
  };

  return (
    <div className="admin-dashboard-v2">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarExpanded ? 'expanded' : ''}`}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      >
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">⬡</div>
          {sidebarExpanded && <div className="logo-text">Habuild</div>}
        </div>

        {/* Menu Items */}
        <nav className="sidebar-menu">
          {/* Dashboard & Training */}
          {topMenuItems.slice(0, 2).map((item) => (
            <button
              key={item.id}
              className={`menu-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => handleMenuClick(item.id)}
              title={item.label}
            >
              <span className="menu-icon">{item.icon}</span>
              {sidebarExpanded && (
                <div className="menu-label">
                  <span className="menu-title">{item.label}</span>
                  <span className="menu-desc">{item.description}</span>
                </div>
              )}
            </button>
          ))}

          {/* Tests parent item with sub-menu */}
          <button
            className={`menu-item ${activeSection === 'tests' ? 'active' : ''}`}
            onClick={() => handleMenuClick('tests')}
            title="Tests"
          >
            <span className="menu-icon">✓</span>
            {sidebarExpanded && (
              <div className="menu-label">
                <span className="menu-title">Tests</span>
                <span className="menu-desc">Create & manage</span>
              </div>
            )}
            {sidebarExpanded && (
              <span className="menu-arrow">{testsOpen ? '▾' : '▸'}</span>
            )}
          </button>

          {/* Sub-items shown when Tests is expanded */}
          {sidebarExpanded && testsOpen && (
            <div className="sidebar-sub-menu">
              <button
                className={`sub-menu-item ${activeSection === 'tests' && testMode === 'library' ? 'active' : ''}`}
                onClick={() => handleMenuClick('test-lib')}
              >
                <span className="sub-icon">▤</span>
                <span>Test Library</span>
              </button>
              <button
                className={`sub-menu-item ${activeSection === 'tests' && testMode === 'create' ? 'active' : ''}`}
                onClick={() => handleMenuClick('test-create')}
              >
                <span className="sub-icon">＋</span>
                <span>Create Test</span>
              </button>
            </div>
          )}

          {/* Remaining items */}
          {topMenuItems.slice(2).map((item) => (
            <button
              key={item.id}
              className={`menu-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => handleMenuClick(item.id)}
              title={item.label}
            >
              <span className="menu-icon">{item.icon}</span>
              {sidebarExpanded && (
                <div className="menu-label">
                  <span className="menu-title">{item.label}</span>
                  <span className="menu-desc">{item.description}</span>
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* User Section */}
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">○</div>
            {sidebarExpanded && (
              <div className="user-details">
                <span className="user-name">{user.name || 'Admin'}</span>
                <span className="user-role">{user.role || 'admin'}</span>
              </div>
            )}
          </div>
          <button
            className="logout-btn"
            onClick={handleLogout}
            title="Logout"
          >
            ⊗
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="content-header">
          <div className="header-title">
            <h1>
              {activeSection === 'tests'
                ? (testMode === 'create' ? 'Create Test' : 'Test Library')
                : (topMenuItems.find(m => m.id === activeSection)?.label || 'Dashboard')}
            </h1>
            <p className="header-subtitle">
              {activeSection === 'tests'
                ? (testMode === 'create' ? 'New test' : 'All tests')
                : (topMenuItems.find(m => m.id === activeSection)?.description || 'Overview & Stats')}
            </p>
          </div>
          <div className="header-actions">
            <span className="time">{new Date().toLocaleTimeString()}</span>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-wrapper">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

// Dashboard Home Component
const AdminHome = () => {
  const [stats, setStats] = useState({
    teamActive: 0,
    testCompletedWeek: 0,
    completionRate: 0,
    avgTime: 0,
  });
  const [systemStatus, setSystemStatus] = useState({
    trainingActive: true,
    testActive: false,
  });

  const handleToggleTrainingMode = () => {
    setSystemStatus({
      trainingActive: true,
      testActive: false,
    });
  };

  const handleToggleTestMode = () => {
    setSystemStatus({
      trainingActive: false,
      testActive: true,
    });
  };

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/performance/overview`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setStats({
            teamActive: data.data?.activeSessions || 0,
            testCompletedWeek: data.data?.completedSessions || 0,
            completionRate: data.data?.passRate || 0,
            avgTime: data.data?.avgCompletionTime || 0,
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-home minimal">
      <div className="welcome-section">
        <h2>Dashboard</h2>
        <p>System overview and quick navigation</p>
      </div>

      {/* Key Metrics - 4 Cards */}
      <div className="dashboard-section">
        <h3>Key Metrics</h3>
        <div className="metrics-grid compact">
          <div className="metric-card">
            <div className="metric-value">{stats.teamActive}</div>
            <div className="metric-label">Team Active</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{stats.testCompletedWeek}</div>
            <div className="metric-label">Tests Completed (Week)</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{stats.completionRate}%</div>
            <div className="metric-label">Completion Rate</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{stats.avgTime}m</div>
            <div className="metric-label">Avg Time Taken</div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="dashboard-section">
        <h3>Current System Status</h3>
        <div className="system-status-cards">
          <div
            className={`status-card ${systemStatus.trainingActive ? 'active' : 'locked'}`}
            onClick={handleToggleTrainingMode}
            style={{ cursor: 'pointer' }}
          >
            <div className="status-indicator"></div>
            <div className="status-content">
              <h4>Training Mode</h4>
              <p>{systemStatus.trainingActive ? 'Active' : 'Locked'}</p>
            </div>
          </div>
          <div
            className={`status-card ${systemStatus.testActive ? 'active' : 'locked'}`}
            onClick={handleToggleTestMode}
            style={{ cursor: 'pointer' }}
          >
            <div className="status-indicator"></div>
            <div className="status-content">
              <h4>Test Mode</h4>
              <p>{systemStatus.testActive ? 'Active' : 'Locked'}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

// Performance Page with Tabs
const PerformancePage = () => {
  const [perfTab, setPerfTab] = React.useState('monitoring');

  return (
    <div className="performance-page">
      <div className="perf-tabs">
        <button
          className={`perf-tab-btn ${perfTab === 'monitoring' ? 'active' : ''}`}
          onClick={() => setPerfTab('monitoring')}
        >
          ● Live Monitoring
        </button>
        <button
          className={`perf-tab-btn ${perfTab === 'report' ? 'active' : ''}`}
          onClick={() => setPerfTab('report')}
        >
          ▲ Report Card
        </button>
      </div>
      {perfTab === 'monitoring' && <TestMonitoring />}
      {perfTab === 'report' && <ReportCard />}
    </div>
  );
};

// Logs Page Component
const LogsPage = () => {
  return (
    <div className="logs-page">
      <div className="coming-soon">
        <span className="icon">◎</span>
        <h3>Access Logs</h3>
        <p>Activity and access history coming soon</p>
      </div>
    </div>
  );
};

export default AdminDashboardV2;
