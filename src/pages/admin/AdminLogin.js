import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin/AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);

    try {
      const BASE = process.env.REACT_APP_API_URL || (process.env.REACT_APP_API_URL || 'http://localhost:5000');
      const response = await fetch(`${BASE}/api/admin/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token to localStorage
      localStorage.setItem('adminToken', data.data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.data.admin));

      // Navigate to admin dashboard
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      {/* Left Panel - Branding (70%) with Team Photo */}
      <div className="login-branding-panel" style={{ backgroundImage: 'url(/images/habuild-team-bg.jpg)' }}>
        <div className="branding-overlay"></div>
      </div>

      {/* Right Panel - Login Form (30%) */}
      <div className="login-form-panel">
        <div className="login-container">
          <div className="login-logo-header">
            <img src="/images/habuild-logo.png" alt="Habuild" className="login-logo" />
          </div>
          <div className="login-header">
            <h1>Training Module</h1>
            <p>Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="email">Email ID</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@habuild.in"
                disabled={loading}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="login-footer">
            <p>
              <a href="/">Back to home</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
