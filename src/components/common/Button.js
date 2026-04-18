import React from 'react';
import '../styles/Button.css';

/**
 * Styled Button Component
 * @param {Object} props
 * @param {string} props.children - Button text
 * @param {string} props.variant - Button variant (primary, secondary, danger, success, outline)
 * @param {string} props.size - Button size (small, medium, large)
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.loading - Loading state
 * @param {Function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.type - Button type (button, submit, reset)
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  type = 'button',
  ...props
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      {...props}
    >
      {loading && <span className="btn-loader"></span>}
      {children}
    </button>
  );
};

export default Button;
