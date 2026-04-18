import React, { useState } from 'react';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Toast from '../../components/common/Toast';
import UserScores from '../../components/admin/performance/UserScores';
import ModuleAnalytics from '../../components/admin/performance/ModuleAnalytics';
import performanceService from '../../services/performanceService';
import useFetch from '../../hooks/useFetch';
import '../../styles/admin/PerformancePage.css';

const PerformancePage = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({});

  const { data: scoresData, status, refetch } = useFetch(
    () => performanceService.getUserScores(filters),
    [filters, activeTab]
  );

  const { data: statsData } = useFetch(
    () => performanceService.getStatistics(filters),
    [filters]
  );

  const handleExportCSV = async () => {
    try {
      const csvData = await performanceService.exportScoresAsCSV(filters);
      const url = window.URL.createObjectURL(new Blob([csvData]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'scores.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      setToast({
        message: 'Scores exported successfully',
        type: 'success',
      });
    } catch (err) {
      setToast({
        message: 'Error exporting scores',
        type: 'error',
      });
    }
  };

  return (
    <div className="performance-page">
      <Header
        title="📊 Performance Dashboard"
        breadcrumbs={[{ label: 'Admin' }, { label: 'Performance' }]}
        actions={<Button onClick={handleExportCSV}>📥 Export CSV</Button>}
      />

      <div className="page-content">
        {/* Statistics Cards */}
        {statsData && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{statsData.totalUsers || 0}</div>
              <div className="stat-label">Total Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{statsData.avgScore || 0}%</div>
              <div className="stat-label">Average Score</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{statsData.passRate || 0}%</div>
              <div className="stat-label">Pass Rate</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{statsData.completionRate || 0}%</div>
              <div className="stat-label">Completion Rate</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="filters-bar">
          <input
            type="text"
            placeholder="Search users..."
            className="filter-input"
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <select
            className="filter-select"
            onChange={(e) => setFilters({ ...filters, module: e.target.value })}
          >
            <option value="">All Modules</option>
          </select>
          <select
            className="filter-select"
            onChange={(e) => setFilters({ ...filters, batch: e.target.value })}
          >
            <option value="">All Batches</option>
          </select>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            User Scores
          </button>
          <button
            className={`tab-button ${activeTab === 'modules' ? 'active' : ''}`}
            onClick={() => setActiveTab('modules')}
          >
            Module Analytics
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'users' && (
            <UserScores
              data={scoresData?.data || []}
              loading={status === 'loading'}
            />
          )}
          {activeTab === 'modules' && (
            <ModuleAnalytics
              data={scoresData?.data || []}
              loading={status === 'loading'}
            />
          )}
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default PerformancePage;
