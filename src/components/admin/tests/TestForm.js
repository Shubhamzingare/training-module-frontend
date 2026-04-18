import React, { useState } from 'react';
import { FormInput, FormSelect, FormTextarea } from '../../common/Form';
import Button from '../../common/Button';
import useForm from '../../../hooks/useForm';

const TestForm = ({ test, onSubmit, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = test || {
    title: '',
    description: '',
    moduleId: '',
    totalMarks: 100,
    passingMarks: 50,
    duration: 60,
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
    <form onSubmit={handleFormSubmit} className="test-form">
      <FormInput
        label="Test Title"
        name="title"
        type="text"
        value={values.title}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.title}
        touched={touched.title}
        placeholder="Enter test title"
        required
      />

      <FormSelect
        label="Module"
        name="moduleId"
        value={values.moduleId}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.moduleId}
        touched={touched.moduleId}
        options={[
          { value: '', label: 'Select a module' },
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
        placeholder="Enter test description"
        rows={3}
      />

      <FormInput
        label="Total Marks"
        name="totalMarks"
        type="number"
        value={values.totalMarks}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.totalMarks}
        touched={touched.totalMarks}
        min="0"
      />

      <FormInput
        label="Passing Marks"
        name="passingMarks"
        type="number"
        value={values.passingMarks}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.passingMarks}
        touched={touched.passingMarks}
        min="0"
      />

      <FormInput
        label="Duration (minutes)"
        name="duration"
        type="number"
        value={values.duration}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.duration}
        touched={touched.duration}
        min="1"
      />

      <div className="form-actions">
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {test ? 'Update Test' : 'Create Test'}
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

export default TestForm;
