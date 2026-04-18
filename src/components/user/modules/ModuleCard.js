import React from 'react';
import Button from '../../common/Button';
import '../../styles/user/ModuleCard.css';

const ModuleCard = ({ module, onClick }) => {
  const typeLabels = {
    new_deployment: 'New Deployment',
    wati_training: 'WATI Training',
  };

  return (
    <div className="module-card">
      <div className="module-card-header">
        <h3>{module.title}</h3>
        <span className="module-type">{typeLabels[module.type] || module.type}</span>
      </div>

      <div className="module-card-body">
        <p className="module-description">
          {module.description || 'No description available'}
        </p>

        {module.status && (
          <div className="module-meta">
            <span className={`status-badge status-${module.status}`}>
              {module.status.charAt(0).toUpperCase() + module.status.slice(1)}
            </span>
          </div>
        )}
      </div>

      <div className="module-card-footer">
        <Button onClick={onClick} size="medium">
          View Module
        </Button>
      </div>
    </div>
  );
};

export default ModuleCard;
