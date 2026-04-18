import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/Modules.css';

const Modules = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState(searchParams.get('type') || 'wati_training');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/public/categories`);
        const data = await response.json();
        if (data.success) {
          setCategories(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to mock data
        setCategories(getMockCategories());
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  const getMockCategories = () => {
    return [
      // New Deployment Pods
      {
        id: '1',
        name: 'Growth x Techpix Demo',
        icon: '🤝',
        type: 'new_deployment',
        description: 'Tools + Offline Meetups',
      },
      {
        id: '2',
        name: 'Experience Pod',
        icon: '🫂',
        type: 'new_deployment',
        description: 'Member experience & journey',
      },
      {
        id: '3',
        name: 'Mobile Pod',
        icon: '📱',
        type: 'new_deployment',
        description: 'Mobile app development',
      },
      {
        id: '4',
        name: 'Beetu Pod',
        icon: '🤖',
        type: 'new_deployment',
        description: 'AI coach automated replies',
      },
      {
        id: '5',
        name: 'CRM Pod',
        icon: '💬',
        type: 'new_deployment',
        description: 'Internal Member relationship management system',
      },
      {
        id: '6',
        name: 'Growth Pod',
        icon: '🌱',
        type: 'new_deployment',
        description: 'User acquisition & retention',
      },
      {
        id: '7',
        name: 'Platform & Link Pod',
        icon: '🔗',
        type: 'new_deployment',
        description: 'Sessions links & billing',
      },
      {
        id: '8',
        name: 'Insights Pod',
        icon: '🔍',
        type: 'new_deployment',
        description: 'Business insights & reports',
      },
      {
        id: '9',
        name: 'Design Pod',
        icon: '🎨',
        type: 'new_deployment',
        description: 'UI/UX & visual design',
      },
      // Wati Training Categories
      {
        id: '10',
        name: 'CRM',
        icon: '💬',
        type: 'wati_training',
        description: 'Customer Relationship Management',
      },
      {
        id: '11',
        name: 'Free Challenge',
        icon: '⚡',
        type: 'wati_training',
        description: 'Free tier challenges',
      },
      {
        id: '12',
        name: 'App',
        icon: '📱',
        type: 'wati_training',
        description: 'App features',
      },
      {
        id: '13',
        name: 'Other',
        icon: '📚',
        type: 'wati_training',
        description: 'Miscellaneous training',
      },
    ];
  };

  const filteredCategories = categories.filter((cat) => {
    if (activeType !== 'all' && cat.type !== activeType) return false;
    if (searchTerm && !cat.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return <div className="loading">Loading categories...</div>;
  }

  return (
    <div className="modules-page">
      <header className="modules-header">
        <h1>📚 Training Content</h1>
      </header>

      <div className="modules-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-tabs">
          <button
            className={`tab ${activeType === 'wati_training' ? 'active' : ''}`}
            onClick={() => setActiveType('wati_training')}
          >
            📚 Wati Training
          </button>
          <button
            className={`tab ${activeType === 'new_deployment' ? 'active' : ''}`}
            onClick={() => setActiveType('new_deployment')}
          >
            🚀 New Deployment
          </button>
          <button
            className={`tab ${activeType === 'all' ? 'active' : ''}`}
            onClick={() => setActiveType('all')}
          >
            📋 All
          </button>
        </div>
      </div>

      <div className="modules-container">
        {filteredCategories.length > 0 ? (
          <div className="modules-grid">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="module-card"
                onClick={() => navigate(`/modules/${category.id}`)}
              >
                <div className="module-header">
                  <span className="file-icon" style={{ fontSize: '3rem' }}>
                    {category.icon}
                  </span>
                </div>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <div className="module-footer">
                  <span className="status-badge">{category.type === 'new_deployment' ? 'Deployment' : 'Training'}</span>
                  <span className="action">Explore →</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No categories found for "{searchTerm}"</p>
            <button className="btn btn-secondary" onClick={() => setSearchTerm('')}>
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modules;
