import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch categories from API
    // For now, use mock data
    const mockCategories = [
      { id: '1', name: 'Wati Training', icon: '📚', type: 'wati_training', description: 'Training on internal tools and processes' },
      { id: '2', name: 'New Deployment', icon: '🚀', type: 'new_deployment', description: 'Latest deployment and features' },
    ];
    setCategories(mockCategories);
    setLoading(false);
  }, []);

  const handleTakeTest = () => {
    navigate('/test-gate');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>📚 Training & Assessment Platform</h1>
        <p>Learn, test, and track your progress</p>
      </header>

      <section className="hero-section">
        <div className="hero-content">
          <h2>Welcome to Your Training Dashboard</h2>
          <p>Complete training modules and take tests to assess your knowledge</p>
          <button className="btn btn-primary btn-large" onClick={handleTakeTest}>
            Take a Test
          </button>
        </div>
      </section>

      <section className="categories-section">
        <h2>Training Categories</h2>
        <div className="categories-grid">
          {categories.map((category) => (
            <Link key={category.id} to={`/modules?category=${category.type}`} className="category-card">
              <div className="category-icon">{category.icon}</div>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <span className="cta">Explore →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/modules" className="action-card">
            <span className="icon">📖</span>
            <h3>Browse Modules</h3>
            <p>View all available training content</p>
          </Link>
          <Link to="/test-gate" className="action-card">
            <span className="icon">📝</span>
            <h3>Take a Test</h3>
            <p>Test your knowledge and get instant results</p>
          </Link>
        </div>
      </section>

      <footer className="home-footer">
        <p>&copy; 2026 Training & Assessment Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
