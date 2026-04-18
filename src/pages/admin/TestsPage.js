import React, { useState } from 'react';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Toast from '../../components/common/Toast';
import TestList from '../../components/admin/tests/TestList';
import TestForm from '../../components/admin/tests/TestForm';
import testService from '../../services/testService';
import useFetch from '../../hooks/useFetch';
import '../../styles/admin/TestsPage.css';

const TestsPage = () => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({});

  const { data: tests, status, error, refetch } = useFetch(
    () => testService.getAllTests(filters),
    [filters]
  );

  const handleCreateClick = () => {
    setEditingTest(null);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (test) => {
    setEditingTest(test);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = async (testId) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      try {
        await testService.deleteTest(testId);
        setToast({
          message: 'Test deleted successfully',
          type: 'success',
        });
        refetch();
      } catch (err) {
        setToast({
          message: 'Error deleting test',
          type: 'error',
        });
      }
    }
  };

  const handlePublishToggle = async (testId, isPublished) => {
    try {
      await testService.toggleTestPublish(testId, !isPublished);
      setToast({
        message: 'Test publication status updated',
        type: 'success',
      });
      refetch();
    } catch (err) {
      setToast({
        message: 'Error updating test',
        type: 'error',
      });
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingTest) {
        await testService.updateTest(editingTest.id, formData);
        setToast({
          message: 'Test updated successfully',
          type: 'success',
        });
      } else {
        await testService.createTest(formData);
        setToast({
          message: 'Test created successfully',
          type: 'success',
        });
      }
      setIsFormModalOpen(false);
      refetch();
    } catch (err) {
      setToast({
        message: err.message || 'Error saving test',
        type: 'error',
      });
    }
  };

  return (
    <div className="tests-page">
      <Header
        title="📝 Test Management"
        breadcrumbs={[{ label: 'Admin' }, { label: 'Tests' }]}
        actions={<Button onClick={handleCreateClick}>+ Add Test</Button>}
      />

      <div className="page-content">
        <div className="filters-bar">
          <input
            type="text"
            placeholder="Search tests..."
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
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <TestList
          tests={tests?.data || []}
          loading={status === 'loading'}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onPublishToggle={handlePublishToggle}
        />
      </div>

      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingTest ? 'Edit Test' : 'Add New Test'}
        size="large"
      >
        <TestForm
          test={editingTest}
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

export default TestsPage;
