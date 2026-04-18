import React, { useState } from 'react';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Toast from '../../components/common/Toast';
import ModuleList from '../../components/admin/modules/ModuleList';
import ModuleForm from '../../components/admin/modules/ModuleForm';
import moduleService from '../../services/moduleService';
import useFetch from '../../hooks/useFetch';
import '../../styles/admin/ModulesPage.css';

const ModulesPage = () => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({});

  const { data: modules, status, error, refetch } = useFetch(
    () => moduleService.getAllModules(filters),
    [filters]
  );

  const handleCreateClick = () => {
    setEditingModule(null);
    setIsFormModalOpen(true);
  };

  const handleViewClick = (module) => {
    setSelectedModule(module);
    setIsDetailModalOpen(true);
  };

  const handleEditClick = (module) => {
    setEditingModule(module);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = async (moduleId) => {
    if (window.confirm('Are you sure you want to delete this module?')) {
      try {
        await moduleService.deleteModule(moduleId);
        setToast({
          message: 'Module deleted successfully',
          type: 'success',
        });
        refetch();
      } catch (err) {
        setToast({
          message: 'Error deleting module',
          type: 'error',
        });
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingModule) {
        await moduleService.updateModule(editingModule.id, formData);
        setToast({
          message: 'Module updated successfully',
          type: 'success',
        });
      } else {
        await moduleService.createModule(formData);
        setToast({
          message: 'Module created successfully',
          type: 'success',
        });
      }
      setIsFormModalOpen(false);
      refetch();
    } catch (err) {
      setToast({
        message: err.message || 'Error saving module',
        type: 'error',
      });
    }
  };

  const handleToggleStatus = async (moduleId, currentStatus) => {
    try {
      await moduleService.toggleModuleStatus(moduleId, !currentStatus);
      setToast({
        message: 'Module status updated',
        type: 'success',
      });
      refetch();
    } catch (err) {
      setToast({
        message: 'Error updating module status',
        type: 'error',
      });
    }
  };

  return (
    <div className="modules-page">
      <Header
        title="📚 Module Management"
        breadcrumbs={[{ label: 'Admin' }, { label: 'Modules' }]}
        actions={<Button onClick={handleCreateClick}>+ Add Module</Button>}
      />

      <div className="page-content">
        <div className="filters-bar">
          <input
            type="text"
            placeholder="Search modules..."
            className="filter-input"
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <select
            className="filter-select"
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">All Types</option>
            <option value="new_deployment">New Deployment</option>
            <option value="wati_training">WATI Training</option>
          </select>
          <select
            className="filter-select"
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <ModuleList
          modules={modules?.data || []}
          loading={status === 'loading'}
          onView={handleViewClick}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onToggleStatus={handleToggleStatus}
        />
      </div>

      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingModule ? 'Edit Module' : 'Add New Module'}
        size="large"
      >
        <ModuleForm
          module={editingModule}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedModule(null);
        }}
        title={selectedModule?.title || 'Module Details'}
        size="large"
      >
        {selectedModule && (
          <div className="module-detail-content">
            <div className="detail-section">
              <h3>Module Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Module Name</label>
                  <p>{selectedModule.title}</p>
                </div>
                <div className="detail-item">
                  <label>Category</label>
                  <p>{selectedModule.categoryId?.name || '-'}</p>
                </div>
                <div className="detail-item">
                  <label>Content Type</label>
                  <p>{selectedModule.fileType || '-'}</p>
                </div>
                <div className="detail-item">
                  <label>Status</label>
                  <p className={`status-badge status-${selectedModule.status}`}>
                    {selectedModule.status?.charAt(0).toUpperCase() + selectedModule.status?.slice(1)}
                  </p>
                </div>
              </div>
            </div>

            {selectedModule.description && (
              <div className="detail-section">
                <h3>Description</h3>
                <p>{selectedModule.description}</p>
              </div>
            )}

            {selectedModule.fileUrl && (
              <div className="detail-section">
                <h3>Uploaded File</h3>
                <p>
                  <a href={selectedModule.fileUrl} target="_blank" rel="noopener noreferrer" className="file-link">
                    {selectedModule.fileUrl.split('/').pop()}
                  </a>
                </p>
              </div>
            )}

            <div className="detail-actions">
              <Button
                variant="secondary"
                onClick={() => {
                  handleEditClick(selectedModule);
                  setIsDetailModalOpen(false);
                }}
              >
                Edit Module
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsDetailModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

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

export default ModulesPage;
