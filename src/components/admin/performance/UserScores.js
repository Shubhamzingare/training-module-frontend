import React from 'react';
import Table from '../../common/Table';

const UserScores = ({ data = [], loading = false }) => {
  const columns = [
    {
      key: 'userName',
      label: 'User Name',
      sortable: true,
    },
    {
      key: 'email',
      label: 'Email',
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
      render: (value, row) => {
        return `${value || 0} / ${row.totalMarks || 0}`;
      },
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
      label: 'Attempted On',
      sortable: true,
      render: (value) => {
        if (!value) return '-';
        return new Date(value).toLocaleDateString();
      },
    },
  ];

  return (
    <div className="user-scores">
      <Table
        columns={columns}
        data={data}
        loading={loading}
        pageSize={15}
        emptyMessage="No score data available"
      />
    </div>
  );
};

export default UserScores;
