import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/TeamLayout.css';
import '../styles/ModuleDetail.css';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const FILE_ICONS = {
  pdf:  '📄',
  ppt:  '📊',
  pptx: '📊',
  doc:  '📝',
  docx: '📝',
  video:'🎥',
  mp4:  '🎥',
};

export default function ModuleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [module,   setModule]   = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [openFaq,  setOpenFaq]  = useState(null);

  useEffect(() => {
    fetch(`${BASE}/api/public/modules/${id}`)
      .then(r => r.json())
      .then(d => {
        if (!d.data || d.data.type === 'none') {
          setNotFound(true);
        } else {
          setModule(d.data);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const NAV = [
    { id: 'tests',    icon: '✓', label: 'Tests'             },
    { id: 'training', icon: '▦', label: 'Training Material' },
  ];

  const Sidebar = () => (
    <aside className="team-sidebar">
      <div className="team-sidebar-logo">
        <div className="team-sidebar-logo-icon">⬡</div>
        <div>
          <div className="team-sidebar-logo-text">Habuild</div>
          <div className="team-sidebar-logo-sub">Training Portal</div>
        </div>
      </div>
      <nav className="team-nav">
        {NAV.map(item => (
          <button
            key={item.id}
            className={`team-nav-item ${item.id === 'training' ? 'active' : ''}`}
            onClick={() => navigate('/')}
          >
            <span className="team-nav-icon">{item.icon}</span>
            <span className="team-nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );

  if (loading) return (
    <div className="team-shell">
      <Sidebar />
      <div className="team-main">
        <div className="team-topbar"><span className="team-topbar-title">Loading...</span></div>
        <div className="team-content">
          <div className="md-shimmer-wrap">
            {[1,2,3].map(i => <div key={i} className="team-shimmer" style={{height:80}} />)}
          </div>
        </div>
      </div>
    </div>
  );

  if (notFound) return (
    <div className="team-shell">
      <Sidebar />
      <div className="team-main">
        <div className="team-topbar">
          <span className="team-topbar-title">Content Unavailable</span>
          <button className="md-back-btn" onClick={() => navigate('/')}>← Back</button>
        </div>
        <div className="team-content">
          <div className="md-not-found">
            <div className="md-not-found-icon">🔒</div>
            <h2>Content Not Available</h2>
            <p>This training module is currently locked or not yet active.</p>
            <p>Please check back later or contact your admin.</p>
            <button className="team-start-btn" style={{maxWidth:200,margin:'20px auto 0'}} onClick={() => navigate('/')}>
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const fileIcon = FILE_ICONS[module.fileType?.toLowerCase()] || '📎';
  const hasKeyPoints = module.keyPoints?.length > 0;
  const hasFaqs = module.faqs?.length > 0;
  const hasFile = !!module.fileUrl;

  return (
    <div className="team-shell">
      <Sidebar />
      <div className="team-main">

        {/* Top bar */}
        <div className="team-topbar">
          <button className="md-back-btn" onClick={() => navigate('/')}>← Training</button>
          <span className="team-topbar-title">{module.title}</span>
          {hasFile && (
            <a
              href={module.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="md-download-btn"
            >
              {fileIcon} Download {module.fileType?.toUpperCase()}
            </a>
          )}
        </div>

        {/* Content */}
        <div className="team-content">
          <div className="md-layout">

            {/* Left — Key Points + FAQs */}
            <div className="md-main">

              {/* Module header card */}
              <div className="md-header-card">
                <div className="md-header-stripe" />
                <div className="md-header-body">
                  <div className="md-header-top">
                    <div className="md-file-badge">
                      {fileIcon} {module.fileType?.toUpperCase() || 'MODULE'}
                    </div>
                    <span className="md-category">
                      {module.category?.name || ''}
                    </span>
                  </div>
                  <h1 className="md-title">{module.title}</h1>
                  {module.description && (
                    <p className="md-desc">{module.description}</p>
                  )}
                  <div className="md-stats">
                    <span>{hasKeyPoints ? module.keyPoints.length : 0} Key Points</span>
                    <span className="tm-dot">·</span>
                    <span>{hasFaqs ? module.faqs.length : 0} FAQs</span>
                    {hasFile && (
                      <>
                        <span className="tm-dot">·</span>
                        <span>1 File</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Key Points */}
              <div className="md-section-card">
                <div className="md-section-head">
                  <span className="md-section-icon">📌</span>
                  Key Points
                  {hasKeyPoints && <span className="md-section-count">{module.keyPoints.length}</span>}
                </div>
                {hasKeyPoints ? (
                  <ul className="md-key-points">
                    {module.keyPoints.map((point, i) => (
                      <li key={i} className="md-key-point">
                        <span className="md-point-num">{i + 1}</span>
                        <span className="md-point-text">{point}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="md-empty-section">
                    <p>Key points will appear here once content is generated.</p>
                  </div>
                )}
              </div>

              {/* FAQs */}
              <div className="md-section-card">
                <div className="md-section-head">
                  <span className="md-section-icon">❓</span>
                  Frequently Asked Questions
                  {hasFaqs && <span className="md-section-count">{module.faqs.length}</span>}
                </div>
                {hasFaqs ? (
                  <div className="md-faqs">
                    {module.faqs.map((faq, i) => (
                      <div
                        key={i}
                        className={`md-faq ${openFaq === i ? 'open' : ''}`}
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      >
                        <div className="md-faq-q">
                          <span>{faq.question}</span>
                          <span className="md-faq-arrow">{openFaq === i ? '▲' : '▼'}</span>
                        </div>
                        {openFaq === i && (
                          <div className="md-faq-a">{faq.answer}</div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="md-empty-section">
                    <p>FAQs will appear here once content is generated.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right — File download sidebar */}
            {hasFile && (
              <div className="md-sidebar">
                <div className="md-file-card">
                  <div className="md-file-icon-lg">{fileIcon}</div>
                  <h3>Training Material</h3>
                  <p className="md-file-type">{module.fileType?.toUpperCase()} File</p>
                  <a
                    href={module.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="md-view-btn"
                  >
                    View / Download
                  </a>
                </div>

                {/* Quick nav */}
                <div className="md-quick-nav">
                  <div className="md-quick-nav-head">On this page</div>
                  <a href="#key-points" className="md-quick-link">📌 Key Points</a>
                  <a href="#faqs" className="md-quick-link">❓ FAQs</a>
                  {hasFile && <a href="#file" className="md-quick-link">📎 File</a>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
