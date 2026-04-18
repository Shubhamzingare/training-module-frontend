import React from 'react';
import Table from '../../common/Table';
import Button from '../../common/Button';

const TestList = ({
  tests = [],
  loading = false,
  onEdit,
  onDelete,
  onPublishToggle,
}) => {
  const columns = [
    {
      key: 'title',
      label: 'Test Title',
      sortable: true,
    },
    {
      key: 'moduleName',
      label: 'Module',
      sortable: true,
    },
    {
      key: 'totalQuestions',
      label: 'Questions',
      sortable: true,
      render: (value) => value || 0,
    },
    {
      key: 'totalMarks',
      label: 'Total Marks',
      sortable: true,
      render: (value) => value || 0,
    },
    {
      key: 'isPublished',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <span className={`status-badge status-${value ? 'published' : 'draft'}`}>
          {value ? 'Published' : 'Draft'}
        </span>
      ),
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
            variant="secondary"
            onClick={() => onPublishToggle(row.id, row.isPublished)}
          >
            {row.isPublished ? 'Unpublish' : 'Publish'}
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
    <div className="test-list">
      <Table
        columns={columns}
        data={tests}
        loading={loading}
        pageSize={10}
        emptyMessage="No tests found"
      />
    </div>
  );
};

export default TestList;
