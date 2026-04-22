import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ModuleDetail.css';

const ModuleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [moduleData, setModuleData] = useState(null);
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeContent, setActiveContent] = useState(null); // 'module' or 'test'

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Fetch module details
        const moduleResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/public/modules/${id}`);
        const moduleResult = await moduleResponse.json();
        const module = moduleResult.data;
        setModuleData(module);

        // Check module status
        if (module && module.status === 'active') {
          setActiveContent('module');
        } else {
          // If module not active, try to get associated test
          const testResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/public/tests/${moduleData?.testId || id}`);
          const testResult = await testResponse.json();
          const test = testResult.data;
          setTestData(test);

          if (test && test.status === 'active') {
            setActiveContent('test');
          } else {
            setActiveContent('none');
          }
        }
      } catch (error) {
        console.error('Error fetching content:', error);
        setActiveContent('none');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (activeContent === 'none') {
    return (
      <div className="module-detail-page">
        <div className="unavailable-message">
          <h2>📌 Content Not Available</h2>
          <p>This training content is currently locked or not available.</p>
          <button className="btn btn-primary" onClick={() => navigate('/modules')}>
            ← Back to Training
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="module-detail-page">
      {activeContent === 'module' && moduleData && (
        <div className="module-container">
          <header className="module-header">
            <button className="back-btn" onClick={() => navigate('/modules')}>
              ← Back
            </button>
            <h1>{moduleData.title}</h1>
            <p className="description">{moduleData.description}</p>
          </header>

          <div className="module-content">
            <section className="module-section">
              <h2>📚 Key Points</h2>
              {moduleData.keyPoints && moduleData.keyPoints.length > 0 ? (
                <ul className="key-points">
                  {moduleData.keyPoints.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              ) : (
                <p>No key points available</p>
              )}
            </section>

            <section className="module-section">
              <h2>❓ Frequently Asked Questions</h2>
              {moduleData.faqs && moduleData.faqs.length > 0 ? (
                <div className="faqs">
                  {moduleData.faqs.map((faq, idx) => (
                    <div key={idx} className="faq-item">
                      <h3>{faq.question}</h3>
                      <p>{faq.answer}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No FAQs available</p>
              )}
            </section>

            <section className="module-section">
              <h2>📄 Training Material</h2>
              {moduleData.fileUrl ? (
                <div className="file-preview">
                  <p>File Type: <strong>{moduleData.fileType?.toUpperCase() || 'PDF'}</strong></p>
                  <a href={moduleData.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    📥 Download / View File
                  </a>
                </div>
              ) : (
                <p>No training material available</p>
              )}
            </section>
          </div>
        </div>
      )}

      {activeContent === 'test' && testData && (
        <div className="test-container">
          <header className="test-header">
            <button className="back-btn" onClick={() => navigate('/modules')}>
              ← Back
            </button>
            <h1>{testData.title}</h1>
            <p className="description">{testData.description}</p>
          </header>

          <div className="test-content">
            <section className="test-info">
              <div className="info-card">
                <h3>⏱️ Time Limit</h3>
                <p>{testData.timeLimit} minutes</p>
              </div>
              <div className="info-card">
                <h3>🎯 Total Marks</h3>
                <p>{testData.totalMarks}</p>
              </div>
              <div className="info-card">
                <h3>✅ Passing Marks</h3>
                <p>{testData.passingMarks}</p>
              </div>
            </section>

            <section className="test-action">
              <button className="btn btn-primary btn-large" onClick={() => navigate('/test-gate')}>
                🚀 Start Test
              </button>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleDetail;
