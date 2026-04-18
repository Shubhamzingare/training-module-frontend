import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import Home from './pages/Home';
import Modules from './pages/Modules';
import ModuleDetail from './pages/ModuleDetail';
import TestGate from './pages/TestGate';
import Test from './pages/Test';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboardV2 from './pages/admin/AdminDashboardV2';

// Components
import ProtectedAdminRoute from './components/common/ProtectedAdminRoute';

// Styles
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes - No Authentication Required */}
        <Route path="/" element={<Home />} />
        <Route path="/modules" element={<Modules />} />
        <Route path="/modules/:id" element={<ModuleDetail />} />
        <Route path="/test-gate" element={<TestGate />} />
        <Route path="/test/:testSessionId" element={<Test />} />

        {/* Admin Routes - Requires JWT Authentication */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardV2 />
            </ProtectedAdminRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
