import React, { useState, useEffect } from 'react';
import '../../styles/admin/SettingsManagement.css';

const SettingsManagement = () => {
  const [activeTab, setActiveTab] = useState('departments');
  const [departments, setDepartments] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useState(JSON.parse(localStorage.getItem('adminUser') || '{}'));

  // Department form
  const [showDeptForm, setShowDeptForm] = useState(false);
  const [deptForm, setDeptForm] = useState({ name: '', description: '' });

  // Shift form
  const [showShiftForm, setShowShiftForm] = useState(false);
  const [shiftForm, setShiftForm] = useState({ name: '', timeRange: '' });

  // Admin form
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminForm, setAdminForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');

    try {
      // Fetch departments
      const deptRes = await fetch('http://localhost:5000/api/admin/departments', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (deptRes.ok) {
        const deptData = await deptRes.json();
        setDepartments(deptData.data || []);
      }

      // Fetch shifts
      const shiftRes = await fetch('http://localhost:5000/api/admin/shifts', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (shiftRes.ok) {
        const shiftData = await shiftRes.json();
        setShifts(shiftData.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    setLoading(false);
  };

  // Department handlers
  const handleCreateDept = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch('http://localhost:5000/api/admin/departments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deptForm),
      });

      if (response.ok) {
        alert('✅ Department created successfully!');
        setDeptForm({ name: '', description: '' });
        setShowDeptForm(false);
        fetchData();
      } else {
        alert('❌ Failed to create department');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating department');
    }
  };

  const handleDeleteDept = async (id) => {
    if (!window.confirm('Delete this department?')) return;

    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`http://localhost:5000/api/admin/departments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        alert('✅ Department deleted');
        fetchData();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Shift handlers
  const handleCreateShift = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch('http://localhost:5000/api/admin/shifts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shiftForm),
      });

      if (response.ok) {
        alert('✅ Shift created successfully!');
        setShiftForm({ name: '', timeRange: '' });
        setShowShiftForm(false);
        fetchData();
      } else {
        alert('❌ Failed to create shift');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating shift');
    }
  };

  const handleDeleteShift = async (id) => {
    if (!window.confirm('Delete this shift?')) return;

    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`http://localhost:5000/api/admin/shifts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        alert('✅ Shift deleted');
        fetchData();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Admin handlers
  const handleCreateAdmin = async (e) => {
    e.preventDefault();

    if (user.role !== 'super_admin') {
      alert('❌ Only super admins can create new admin users');
      return;
    }

    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch('http://localhost:5000/api/admin/auth/create-admin', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminForm),
      });

      if (response.ok) {
        alert('✅ Admin user created successfully!');
        setAdminForm({ name: '', email: '', password: '', role: 'admin' });
        setShowAdminForm(false);
        fetchData();
      } else {
        const error = await response.json();
        alert(`❌ ${error.message || 'Failed to create admin'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating admin');
    }
  };

  return (
    <div className="settings-management">
      <div className="settings-header">
        <h2>⚙️ Settings</h2>
        <p>Manage departments, shifts, and admin users</p>
      </div>

      <div className="settings-tabs">
        <button
          className={`tab-btn ${activeTab === 'departments' ? 'active' : ''}`}
          onClick={() => setActiveTab('departments')}
        >
          🏢 Departments
        </button>
        <button
          className={`tab-btn ${activeTab === 'shifts' ? 'active' : ''}`}
          onClick={() => setActiveTab('shifts')}
        >
          🕐 Shifts
        </button>
        {user.role === 'super_admin' && (
          <button
            className={`tab-btn ${activeTab === 'admins' ? 'active' : ''}`}
            onClick={() => setActiveTab('admins')}
          >
            👥 Admin Users
          </button>
        )}
      </div>

      {/* Departments Tab */}
      {activeTab === 'departments' && (
        <div className="tab-content">
          <div className="tab-header">
            <h3>Departments</h3>
            <button className="btn btn-primary" onClick={() => setShowDeptForm(!showDeptForm)}>
              {showDeptForm ? '✕ Cancel' : '+ Add Department'}
            </button>
          </div>

          {showDeptForm && (
            <form onSubmit={handleCreateDept} className="form-card">
              <div className="form-group">
                <label>Department Name</label>
                <input
                  type="text"
                  value={deptForm.name}
                  onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                  placeholder="e.g., Sales, Marketing, Support"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={deptForm.description}
                  onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                  placeholder="Department description"
                  rows="3"
                />
              </div>
              <button type="submit" className="btn btn-success">Create Department</button>
            </form>
          )}

          <div className="items-table">
            <table>
              <thead>
                <tr>
                  <th>Department Name</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {departments.length > 0 ? (
                  departments.map((dept) => (
                    <tr key={dept._id}>
                      <td className="dept-name">
                        <strong>{dept.name}</strong>
                      </td>
                      <td className="description">{dept.description || '-'}</td>
                      <td className="action">
                        <button
                          className="btn-danger"
                          onClick={() => handleDeleteDept(dept._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="empty">No departments yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Shifts Tab */}
      {activeTab === 'shifts' && (
        <div className="tab-content">
          <div className="tab-header">
            <h3>Shifts</h3>
            <button className="btn btn-primary" onClick={() => setShowShiftForm(!showShiftForm)}>
              {showShiftForm ? '✕ Cancel' : '+ Add Shift'}
            </button>
          </div>

          {showShiftForm && (
            <form onSubmit={handleCreateShift} className="form-card">
              <div className="form-group">
                <label>Shift Name</label>
                <input
                  type="text"
                  value={shiftForm.name}
                  onChange={(e) => setShiftForm({ ...shiftForm, name: e.target.value })}
                  placeholder="e.g., Morning Shift"
                  required
                />
              </div>
              <div className="form-group">
                <label>Time Range</label>
                <input
                  type="text"
                  value={shiftForm.timeRange}
                  onChange={(e) => setShiftForm({ ...shiftForm, timeRange: e.target.value })}
                  placeholder="e.g., 6 AM - 2 PM"
                  required
                />
              </div>
              <button type="submit" className="btn btn-success">Create Shift</button>
            </form>
          )}

          <div className="items-table">
            <table>
              <thead>
                <tr>
                  <th>Shift Name</th>
                  <th>Time Range</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {shifts.length > 0 ? (
                  shifts.map((shift) => (
                    <tr key={shift._id}>
                      <td className="shift-name">
                        <strong>{shift.name}</strong>
                      </td>
                      <td className="time-range">{shift.timeRange || '-'}</td>
                      <td className="action">
                        <button
                          className="btn-danger"
                          onClick={() => handleDeleteShift(shift._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="empty">No shifts yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admin Users Tab */}
      {activeTab === 'admins' && user.role === 'super_admin' && (
        <div className="tab-content">
          <div className="tab-header">
            <h3>Admin Users</h3>
            <button className="btn btn-primary" onClick={() => setShowAdminForm(!showAdminForm)}>
              {showAdminForm ? '✕ Cancel' : '+ Create Admin'}
            </button>
          </div>

          {showAdminForm && (
            <form onSubmit={handleCreateAdmin} className="form-card">
              <div className="form-group">
                <label>Admin Name</label>
                <input
                  type="text"
                  value={adminForm.name}
                  onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                  placeholder="Full name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                  placeholder="At least 6 characters"
                  required
                  minLength="6"
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={adminForm.role}
                  onChange={(e) => setAdminForm({ ...adminForm, role: e.target.value })}
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <button type="submit" className="btn btn-success">Create Admin User</button>
            </form>
          )}

          <p className="info-text">
            Only super admins can create new admin users. This is a restricted operation.
          </p>
        </div>
      )}
    </div>
  );
};

export default SettingsManagement;
