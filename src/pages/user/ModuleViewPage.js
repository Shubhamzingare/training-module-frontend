import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import KeyPoints from '../../components/user/modules/KeyPoints';
import FAQs from '../../components/user/modules/FAQs';
import moduleService from '../../services/moduleService';
import useFetch from '../../hooks/useFetch';
import '../../styles/user/ModuleViewPage.css';

const ModuleViewPage = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const { data: module, status: moduleStatus } = useFetch(
    () => moduleService.getModuleById(moduleId),
    [moduleId]
  );

  const { data: content, status: contentStatus } = useFetch(
    () => moduleService.getModuleContent(moduleId),
    [moduleId]
  );

  const handleTakeTest = () => {
    navigate(`/test/${module?.testId}`);
  };

  if (moduleStatus === 'loading') {
    return <div className="loading-state">Loading module...</div>;
  }

  if (moduleStatus === 'error') {
    return (
      <div className="error-state">
        Error loading module. Please try again.
        <Button onClick={() => navigate('/modules')}>Back to Modules</Button>
      </div>
    );
  }

  return (
    <div className="module-view-page">
      <Header
        title={module?.title}
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Modules', path: '/modules' },
          { label: module?.title },
        ]}
        actions={
          <Button onClick={() => navigate('/modules')} variant="outline">
            ← Back
          </Button>
        }
      />

      <div className="page-content">
        <div className="module-view-container">
          {/* Module Header Info */}
          <div className="module-header-info">
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Type:</span>
                <span className="info-value">
                  {module?.type === 'new_deployment' ? 'New Deployment' : 'WATI Training'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Status:</span>
                <span className={`status-badge status-${module?.status}`}>
                  {module?.status?.charAt(0).toUpperCase() + module?.status?.slice(1)}
                </span>
              </div>
            </div>

            {module?.description && (
              <div className="module-description">
                <h2>Overview</h2>
                <p>{module.description}</p>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="module-main-content">
            {module?.content && (
              <div className="module-body">
                <h2>Module Content</h2>
                <div className="content-text">{module.content}</div>
              </div>
            )}

            {/* Key Points */}
            <KeyPoints
              keyPoints={content?.keyPoints || []}
              loading={contentStatus === 'loading'}
            />

            {/* FAQs */}
            <FAQs
              faqs={content?.faqs || []}
              loading={contentStatus === 'loading'}
            />

            {/* Test Link */}
            {module?.testId && (
              <div className="test-section">
                <h2>Test Your Knowledge</h2>
                <p>Take the test associated with this module to verify your understanding.</p>
                <Button onClick={handleTakeTest} size="large">
                  📝 Take Test
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleViewPage;
