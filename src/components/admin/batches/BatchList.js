import React from 'react';
import Table from '../../common/Table';
import Button from '../../common/Button';

const BatchList = ({
  batches = [],
  loading = false,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      key: 'name',
      label: 'Batch Name',
      sortable: true,
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (value) => {
        const types = {
          new_hires: 'New Hires',
          existing_team: 'Existing Team',
          specific: 'Specific',
        };
        return types[value] || value;
      },
    },
    {
      key: 'memberCount',
      label: 'Members',
      sortable: true,
      render: (value) => value || 0,
    },
    {
      key: 'moduleCount',
      label: 'Modules',
      sortable: true,
      render: (value) => value || 0,
    },
    {
      key: 'createdAt',
      label: 'Created',
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
        <div className="action-buttons">
          <Button
            size="small"
            variant="outline"
            onClick={() => onEdit(row)}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="danger"
            onClick={() => onDelete(row.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="batch-list">
      <Table
        columns={columns}
        data={batches}
        loading={loading}
        pageSize={10}
        emptyMessage="No batches found"
      />
    </div>
  );
};

export default BatchList;
