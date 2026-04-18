import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import performanceService from '../../services/performanceService';
import useFetch from '../../hooks/useFetch';
import '../../styles/user/MyScoresPage.css';

const MyScoresPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});

  const { data: scoresData, status } = useFetch(
    () => performanceService.getMyScores(filters),
    [filters]
  );

  const scores = scoresData?.data || [];

  const columns = [
    {
      key: 'moduleName',
      label: 'Module',
      sortable: true,
    },
    {
      key: 'testName',
      label: 'Test',
      sortable: true,
    },
    {
      key: 'score',
      label: 'Score',
      sortable: true,
      render: (value, row) => `${value || 0} / ${row.totalMarks || 0}`,
    },
    {
      key: 'percentage',
      label: 'Percentage',
      sortable: true,
      render: (value) => `${value || 0}%`,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <span className={`status-badge status-${value?.toLowerCase() || 'pending'}`}>
          {value || 'Pending'}
        </span>
      ),
    },
    {
      key: 'attemptDate',
      label: 'Attempted',
      sortable: true,
      render: (value) => {
        if (!value) return '-';
        return new Date(value).toLocaleDateString();
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <Button
          size="small"
          variant="outline"
          onClick={() => navigate(`/test-result/${row.attemptId}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="my-scores-page">
      <Header
        title="📊 My Scores"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'My Scores' }]}
      />

      <div className="page-content">
        <div className="filters-bar">
          <input
            type="text"
            placeholder="Search by module or test..."
            className="filter-input"
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <select
            className="filter-select"
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="pass">Passed</option>
            <option value="fail">Failed</option>
          </select>
          <select
            className="filter-select"
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
          >
            <option value="">Sort By</option>
            <option value="date">Date (Newest)</option>
            <option value="score">Score (Highest)</option>
            <option value="module">Module</option>
          </select>
        </div>

        <Table
          columns={columns}
          data={scores}
          loading={status === 'loading'}
          pageSize={15}
          emptyMessage="No test attempts yet"
        />
      </div>
    </div>
  );
};

export default MyScoresPage;
