import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';

/**
 * Page Header Component with breadcrumbs
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {Array} props.breadcrumbs - Breadcrumb items [{label, path}]
 * @param {React.ReactNode} props.actions - Header actions
 */
const Header = ({ title, breadcrumbs, actions }) => {
  const location = useLocation();

  return (
    <div className="page-header">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="breadcrumbs">
          {breadcrumbs.map((item, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="breadcrumb-separator">/</span>}
              {item.path ? (
                <Link to={item.path} className="breadcrumb-link">
                  {item.label}
                </Link>
              ) : (
                <span className="breadcrumb-current">{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div className="header-top">
        <h1>{title}</h1>
        {actions && <div className="header-actions">{actions}</div>}
      </div>
    </div>
  );
};

export default Header;
