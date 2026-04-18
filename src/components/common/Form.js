import React from 'react';
import '../styles/Form.css';

/**
 * Form Input Component with validation
 * @param {Object} props
 * @param {string} props.label - Input label
 * @param {string} props.name - Input name
 * @param {string} props.type - Input type (text, email, password, etc.)
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {Function} props.onBlur - Blur handler
 * @param {string} props.error - Error message
 * @param {boolean} props.touched - Whether field is touched
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.required - Required field
 * @param {string} props.className - Additional CSS classes
 */
const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
  required = false,
  className = '',
  ...props
}) => {
  const showError = touched && error;

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`form-input ${showError ? 'error' : ''}`}
        {...props}
      />
      {showError && <div className="form-error">{error}</div>}
    </div>
  );
};

/**
 * Textarea Component
 */
const FormTextarea = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
  required = false,
  rows = 4,
  className = '',
  ...props
}) => {
  const showError = touched && error;

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        rows={rows}
        className={`form-textarea ${showError ? 'error' : ''}`}
        {...props}
      />
      {showError && <div className="form-error">{error}</div>}
    </div>
  );
};

/**
 * Select Component
 */
const FormSelect = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  options = [],
  placeholder = 'Select option',
  required = false,
  className = '',
  ...props
}) => {
  const showError = touched && error;

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`form-select ${showError ? 'error' : ''}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {showError && <div className="form-error">{error}</div>}
    </div>
  );
};

/**
 * Checkbox Component
 */
const FormCheckbox = ({
  label,
  name,
  checked,
  onChange,
  className = '',
  ...props
}) => {
  return (
    <div className={`form-group form-checkbox ${className}`}>
      <label htmlFor={name} className="checkbox-label">
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="checkbox-input"
          {...props}
        />
        <span>{label}</span>
      </label>
    </div>
  );
};

export { FormInput, FormTextarea, FormSelect, FormCheckbox };
