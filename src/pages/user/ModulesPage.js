import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import ModuleCard from '../../components/user/modules/ModuleCard';
import moduleService from '../../services/moduleService';
import useFetch from '../../hooks/useFetch';
import '../../styles/user/ModulesPage.css';

const ModulesPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ status: 'active' });

  const { data: modulesData, status, error } = useFetch(
    () => moduleService.getAllModules(filters),
    [filters]
  );

  const modules = modulesData?.data || [];

  const handleModuleClick = (moduleId) => {
    navigate(`/modules/${moduleId}`);
  };

  return (
    <div className="user-modules-page">
      <Header
        title="📚 Training Modules"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Modules' }]}
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
        </div>

        {status === 'loading' && (
          <div className="loading-state">Loading modules...</div>
        )}

        {error && (
          <div className="error-state">
            Error loading modules. Please try again later.
          </div>
        )}

        {modules.length === 0 && status !== 'loading' && (
          <div className="empty-state">
            <p>No modules available at the moment.</p>
          </div>
        )}

        {modules.length > 0 && (
          <div className="modules-grid">
            {modules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                onClick={() => handleModuleClick(module.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModulesPage;
