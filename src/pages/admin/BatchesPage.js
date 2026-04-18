import React, { useState } from 'react';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Toast from '../../components/common/Toast';
import BatchList from '../../components/admin/batches/BatchList';
import BatchForm from '../../components/admin/batches/BatchForm';
import batchService from '../../services/batchService';
import useFetch from '../../hooks/useFetch';
import '../../styles/admin/BatchesPage.css';

const BatchesPage = () => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({});

  const { data: batches, status, error, refetch } = useFetch(
    () => batchService.getAllBatches(filters),
    [filters]
  );

  const handleCreateClick = () => {
    setEditingBatch(null);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (batch) => {
    setEditingBatch(batch);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = async (batchId) => {
    if (window.confirm('Are you sure you want to delete this batch?')) {
      try {
        await batchService.deleteBatch(batchId);
        setToast({
          message: 'Batch deleted successfully',
          type: 'success',
        });
        refetch();
      } catch (err) {
        setToast({
          message: 'Error deleting batch',
          type: 'error',
        });
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingBatch) {
        await batchService.updateBatch(editingBatch.id, formData);
        setToast({
          message: 'Batch updated successfully',
          type: 'success',
        });
      } else {
        await batchService.createBatch(formData);
        setToast({
          message: 'Batch created successfully',
          type: 'success',
        });
      }
      setIsFormModalOpen(false);
      refetch();
    } catch (err) {
      setToast({
        message: err.message || 'Error saving batch',
        type: 'error',
      });
    }
  };

  return (
    <div className="batches-page">
      <Header
        title="👥 Batch Management"
        breadcrumbs={[{ label: 'Admin' }, { label: 'Batches' }]}
        actions={<Button onClick={handleCreateClick}>+ Add Batch</Button>}
      />

      <div className="page-content">
        <div className="filters-bar">
          <input
            type="text"
            placeholder="Search batches..."
            className="filter-input"
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <select
            className="filter-select"
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">All Types</option>
            <option value="new_hires">New Hires</option>
            <option value="existing_team">Existing Team</option>
            <option value="specific">Specific</option>
          </select>
        </div>

        <BatchList
          batches={batches?.data || []}
          loading={status === 'loading'}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </div>

      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingBatch ? 'Edit Batch' : 'Add New Batch'}
        size="large"
      >
        <BatchForm
          batch={editingBatch}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormModalOpen(false)}
        />
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

export default BatchesPage;
