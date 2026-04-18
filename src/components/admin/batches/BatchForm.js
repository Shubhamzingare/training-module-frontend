import React, { useState } from 'react';
import { FormInput, FormSelect, FormTextarea } from '../../common/Form';
import Button from '../../common/Button';
import useForm from '../../../hooks/useForm';

const BatchForm = ({ batch, onSubmit, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = batch || {
    name: '',
    description: '',
    type: 'new_hires',
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
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
    <form onSubmit={handleFormSubmit} className="batch-form">
      <FormInput
        label="Batch Name"
        name="name"
        type="text"
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.name}
        touched={touched.name}
        placeholder="Enter batch name"
        required
      />

      <FormSelect
        label="Batch Type"
        name="type"
        value={values.type}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.type}
        touched={touched.type}
        options={[
          { value: 'new_hires', label: 'New Hires' },
          { value: 'existing_team', label: 'Existing Team' },
          { value: 'specific', label: 'Specific' },
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
        placeholder="Enter batch description"
        rows={3}
      />

      <div className="form-actions">
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {batch ? 'Update Batch' : 'Create Batch'}
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

export default BatchForm;
