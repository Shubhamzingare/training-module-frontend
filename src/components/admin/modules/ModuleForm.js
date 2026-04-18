import React, { useState } from 'react';
import { FormInput, FormSelect, FormTextarea } from '../../common/Form';
import Button from '../../common/Button';
import useForm from '../../../hooks/useForm';

const ModuleForm = ({ module, onSubmit, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = module || {
    title: '',
    description: '',
    type: 'new_deployment',
    content: '',
    status: 'draft',
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useForm(initialValues, async (values) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(e);
  };

  return (
    <form onSubmit={handleFormSubmit} className="module-form">
      <FormInput
        label="Module Title"
        name="title"
        type="text"
        value={values.title}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.title}
        touched={touched.title}
        placeholder="Enter module title"
        required
      />

      <FormSelect
        label="Module Type"
        name="type"
        value={values.type}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.type}
        touched={touched.type}
        options={[
          { value: 'new_deployment', label: 'New Deployment' },
          { value: 'wati_training', label: 'WATI Training' },
        ]}
        required
      />

      <FormTextarea
        label="Description"
        name="description"
        value={values.description}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.description}
        touched={touched.description}
        placeholder="Enter module description"
        rows={3}
      />

      <FormTextarea
        label="Content"
        name="content"
        value={values.content}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.content}
        touched={touched.content}
        placeholder="Enter module content"
        rows={6}
      />

      <FormSelect
        label="Status"
        name="status"
        value={values.status}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.status}
        touched={touched.status}
        options={[
          { value: 'draft', label: 'Draft' },
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ]}
      />

      <div className="form-actions">
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {module ? 'Update Module' : 'Create Module'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ModuleForm;
