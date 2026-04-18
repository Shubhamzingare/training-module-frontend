import React from 'react';
import Table from '../../common/Table';
import Button from '../../common/Button';

const ModuleList = ({
  modules = [],
  loading = false,
  onEdit,
  onDelete,
  onToggleStatus,
  onView,
}) => {
  const getContentTypeLabel = (fileType) => {
    const typeMap = {
      pdf: 'PDF',
      ppt: 'PPT',
      pptx: 'PowerPoint',
      doc: 'Document',
      docx: 'Word',
      video: 'Video',
      mp4: 'Video',
      mov: 'Video',
      avi: 'Video',
      mkv: 'Video',
      webm: 'Video',
    };
    return typeMap[fileType?.toLowerCase()] || fileType || '-';
  };

  const getFileName = (fileUrl) => {
    if (!fileUrl) return '-';
    const parts = fileUrl.split('/');
    return parts[parts.length - 1];
  };

  const columns = [
    {
      key: 'title',
      label: 'Module Name',
      sortable: true,
      width: '200px',
    },
    {
      key: 'categoryId',
      label: 'Category',
      sortable: true,
      render: (value) => {
        if (!value) return '-';
        return typeof value === 'object' ? value.name : value;
      },
    },
    {
      key: 'fileType',
      label: 'Content Type',
      sortable: true,
      render: (value) => getContentTypeLabel(value),
    },
    {
      key: 'fileUrl',
      label: 'File Name',
      sortable: false,
      render: (value) => {
        const fileName = getFileName(value);
        return fileName === '-' ? (
          <span className="no-file">-</span>
        ) : (
          <a href={value} target="_blank" rel="noopener noreferrer" className="file-link">
            {fileName}
          </a>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Uploaded Date',
      sortable: true,
      render: (value) => {
        if (!value) return '-';
        return new Date(value).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      },
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <span className={`status-badge status-${value}`}>
          {value === 'active' ? 'Active' : value === 'inactive' ? 'Inactive' : 'Draft'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="action-buttons">
          <Button
            size="small"
            variant="outline"
            onClick={() => onView && onView(row)}
            title="View module details"
          >
            View
          </Button>
          <Button
            size="small"
            variant="secondary"
            onClick={() => onToggleStatus(row._id, row.status === 'active')}
            title={row.status === 'active' ? 'Deactivate module' : 'Activate module'}
          >
            {row.status === 'active' ? 'Deactivate' : 'Activate'}
          </Button>
          <Button
            size="small"
            variant="danger"
            onClick={() => onDelete(row._id)}
            title="Delete module"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="module-list">
      <Table
        columns={columns}
        data={modules}
        loading={loading}
        pageSize={10}
        emptyMessage="No modules found"
      />
    </div>
  );
};

export default ModuleList;
