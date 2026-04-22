import React, { useState, useEffect } from 'react';
import '../../styles/admin/ModuleManagement.css';

const ModuleManagement = () => {
  // Main state
  const [activeTab, setActiveTab] = useState('modules');
  const [modules, setModules] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modules tab state
  const [selectedModule, setSelectedModule] = useState(null);
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [newCategoryForm, setNewCategoryForm] = useState({
    name: '',
    description: '',
  });
  const [categoryError, setCategoryError] = useState('');
  const [categorySuccess, setCategorySuccess] = useState('');

  // Dropdown open/close state
  const [openDropdown, setOpenDropdown] = useState(null); // 'moduleType', 'category', 'status', 'libraryType', 'libraryCategory'

  // Module filters
  const [moduleFilters, setModuleFilters] = useState({
    type: [],
    category: [],
    status: [],
  });

  // Upload Content tab state
  const [uploadError, setUploadError] = useState('');
  const [moduleForm, setModuleForm] = useState({
    moduleType: '', // support_training or new_deployment
    categoryId: '',
    topic: '',
    title: '', // This is the content/module name
    description: '',
    fileType: 'pdf',
    file: null,
  });

  // Library tab state
  const [libraryFilters, setLibraryFilters] = useState({
    type: [], // support, deployment
    category: [],
    dateFrom: '',
    dateTo: '',
  });

  const MAX_VIDEO_DURATION = 60 * 60;
  const fileTypeMap = {
    pdf: { extensions: ['.pdf'], label: 'PDF' },
    pptx: { extensions: ['.pptx', '.ppt'], label: 'PowerPoint' },
    video: { extensions: ['.mp4', '.mov', '.avi'], label: 'Video' },
    doc: { extensions: ['.doc', '.docx'], label: 'Document' },
  };

  // Fetch data on mount and restore tab from localStorage
  useEffect(() => {
    // Restore previous tab from localStorage
    const savedTab = localStorage.getItem('moduleManagementTab');
    if (savedTab) {
      setActiveTab(savedTab);
    }
    fetchData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.dropdown-wrapper') && !e.target.closest('.dropdown-menu')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');

    try {
      const modRes = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/modules`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (modRes.ok) {
        const modData = await modRes.json();
        setModules(modData.data || []);
      }

      const catRes = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/categories`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    setLoading(false);
  };

  // ===== STATUS TOGGLE =====

  const [toggleMessage, setToggleMessage] = useState('');

  const handleToggleStatus = async (e, moduleId, currentStatus) => {
    e.stopPropagation();
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/modules/${moduleId}/toggle-status`,
        { method: 'PATCH', headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (res.ok) {
        const data = await res.json();
        const newStatus = data.data?.module?.status;
        const msg = newStatus === 'active'
          ? 'Module activated. Associated test has been locked if linked.'
          : 'Module locked.';
        setToggleMessage(msg);
        setTimeout(() => setToggleMessage(''), 3500);
        fetchData();
      }
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  // ===== MODULES TAB FUNCTIONS =====

  const getFilteredModulesList = () => {
    let filtered = modules;

    if (moduleFilters.type.length > 0) {
      const typeCategories = categories
        .filter(c => moduleFilters.type.includes(c.type))
        .map(c => c._id);
      filtered = filtered.filter(m => {
        const catId = typeof m.categoryId === 'object' ? m.categoryId._id : m.categoryId;
        return typeCategories.includes(catId);
      });
    }

    if (moduleFilters.category.length > 0) {
      filtered = filtered.filter(m => {
        const catId = typeof m.categoryId === 'object' ? m.categoryId._id : m.categoryId;
        return moduleFilters.category.includes(catId);
      });
    }

    if (moduleFilters.status.length > 0) {
      filtered = filtered.filter(m => moduleFilters.status.includes(m.status));
    }

    return filtered;
  };

  const getCategoryName = (categoryId) => {
    if (!categoryId) return '-';
    const cat = categories.find((c) => c._id === (typeof categoryId === 'object' ? categoryId._id : categoryId));
    return cat ? cat.name : '-';
  };

  const getCategoryType = (categoryId) => {
    if (!categoryId) return '-';
    const cat = categories.find((c) => c._id === (typeof categoryId === 'object' ? categoryId._id : categoryId));
    return cat ? (cat.type === 'wati_training' ? 'Support Training' : 'New Deployment') : '-';
  };

  const handleSelectModule = (module) => {
    setSelectedModule(module);
    setShowAddCategoryForm(false);
    setCategoryError('');
    setCategorySuccess('');
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setCategoryError('');
    setCategorySuccess('');

    if (!newCategoryForm.name.trim()) {
      setCategoryError('Category name is required');
      return;
    }

    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/categories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCategoryForm.name,
          description: newCategoryForm.description,
          type: selectedModule.type === 'wati_training' ? 'wati_training' : 'new_deployment',
          icon: selectedModule.type === 'wati_training' ? '📚' : '🚀',
        }),
      });

      if (response.ok) {
        setCategorySuccess('✅ Category added successfully!');
        setNewCategoryForm({ name: '', description: '' });
        setTimeout(() => {
          setShowAddCategoryForm(false);
          fetchData();
        }, 1000);
      } else {
        const error = await response.json();
        setCategoryError(error.message || 'Failed to add category');
      }
    } catch (error) {
      console.error('Error:', error);
      setCategoryError('Error adding category');
    }
  };

  // ===== UPLOAD CONTENT TAB FUNCTIONS =====

  const validateFileType = (file, type) => {
    if (!file || !type) return null;
    const typeInfo = fileTypeMap[type];
    if (!typeInfo) return 'Invalid type';
    const fileName = file.name.toLowerCase();
    const valid = typeInfo.extensions.some((ext) => fileName.endsWith(ext));
    return valid ? null : `Invalid file. Expected: ${typeInfo.extensions.join(', ')}`;
  };

  const getVideoDurationAsync = async (file) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.onloadedmetadata = () => resolve(video.duration);
      video.src = URL.createObjectURL(file);
    });
  };

  const formatDuration = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!moduleForm.file) {
      setUploadError('Select a file');
      return;
    }
    if (!moduleForm.categoryId) {
      setUploadError('Select a category');
      return;
    }
    if (!moduleForm.title) {
      setUploadError('Enter module name');
      return;
    }

    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    formData.append('file', moduleForm.file);
    formData.append('title', moduleForm.title);
    formData.append('description', moduleForm.description);
    formData.append('categoryId', moduleForm.categoryId);
    formData.append('fileType', moduleForm.fileType);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/modules`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        alert('✅ Content uploaded successfully!');
        setModuleForm({
          moduleType: '',
          categoryId: '',
          topic: '',
          title: '',
          description: '',
          fileType: 'pdf',
          file: null,
        });
        setUploadError('');
        fetchData();
      } else {
        setUploadError('Upload failed');
      }
    } catch (error) {
      setUploadError('Error uploading');
    }
  };

  // ===== LIBRARY TAB FUNCTIONS =====

  const getLibraryContent = () => {
    let filtered = modules;

    // Filter by type
    if (libraryFilters.type.length > 0) {
      const typeList = libraryFilters.type.map(t => t === 'support' ? 'wati_training' : 'new_deployment');
      const typeCategories = categories
        .filter(c => typeList.includes(c.type))
        .map(c => c._id);
      filtered = filtered.filter(m => {
        const catId = typeof m.categoryId === 'object' ? m.categoryId._id : m.categoryId;
        return typeCategories.includes(catId);
      });
    }

    // Filter by category
    if (libraryFilters.category.length > 0) {
      filtered = filtered.filter(m => {
        const catId = typeof m.categoryId === 'object' ? m.categoryId._id : m.categoryId;
        return libraryFilters.category.includes(catId);
      });
    }

    // Filter by date range
    if (libraryFilters.dateFrom) {
      const fromDate = new Date(libraryFilters.dateFrom);
      filtered = filtered.filter(m => new Date(m.createdAt) >= fromDate);
    }

    if (libraryFilters.dateTo) {
      const toDate = new Date(libraryFilters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(m => new Date(m.createdAt) <= toDate);
    }

    return filtered;
  };

  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm('Delete this content?')) return;

    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/modules/${moduleId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        alert('✅ Deleted!');
        fetchData();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filteredModules = getFilteredModulesList();
  const libraryContent = getLibraryContent();

  const supportCategories = categories.filter(c => c.type === 'wati_training');
  const deploymentCategories = categories.filter(c => c.type === 'new_deployment');

  const currentTypeCategories = moduleFilters.type.length === 0
    ? categories
    : categories.filter(c => moduleFilters.type.includes(c.type));

  const uploadTypeCategories = moduleForm.moduleType === 'support_training'
    ? supportCategories
    : moduleForm.moduleType === 'new_deployment'
    ? deploymentCategories
    : [];

  const libraryTypeCategories = libraryFilters.type.length === 0
    ? categories
    : libraryFilters.type.includes('support')
    ? (libraryFilters.type.includes('deployment') ? categories : supportCategories)
    : deploymentCategories;

  return (
    <div className="module-management-v2">
      {/* Header */}
      <div className="mm-header">
        <h2>📦 Training Content</h2>
        <p>Manage modules, upload content, and view your library</p>
      </div>

      {/* Tabs */}
      <div className="mm-tabs">
        <button
          className={`mm-tab-btn ${activeTab === 'modules' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('modules');
            localStorage.setItem('moduleManagementTab', 'modules');
          }}
        >
          📚 Modules
        </button>
        <button
          className={`mm-tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('upload');
            localStorage.setItem('moduleManagementTab', 'upload');
          }}
        >
          📤 Upload Content
        </button>
        <button
          className={`mm-tab-btn ${activeTab === 'library' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('library');
            localStorage.setItem('moduleManagementTab', 'library');
          }}
        >
          📖 Library
        </button>
      </div>

      {/* MODULES TAB */}
      {activeTab === 'modules' && (
        <div className="mm-tab-content">
          {/* Filters */}
          <div className="modules-filters">
            <div className="filter-group">
              <label>Type:</label>
              <div className="dropdown-wrapper">
                <button
                  className={`dropdown-btn ${openDropdown === 'moduleType' ? 'active' : ''}`}
                  onClick={() => setOpenDropdown(openDropdown === 'moduleType' ? null : 'moduleType')}
                >
                  {moduleFilters.type.length === 0 ? 'All Types' : `${moduleFilters.type.length} selected`}
                  <span className="dropdown-arrow">▼</span>
                </button>
                {openDropdown === 'moduleType' && (
                  <div className="dropdown-menu">
                    <div
                      className="dropdown-option"
                      onClick={() => setModuleFilters({ ...moduleFilters, type: [] })}
                    >
                      <input
                        type="checkbox"
                        checked={moduleFilters.type.length === 0}
                        onChange={() => {}}
                      />
                      <span>Select All</span>
                    </div>
                    <div
                      className="dropdown-option"
                      onClick={() => {
                        const newType = moduleFilters.type.includes('wati_training')
                          ? moduleFilters.type.filter(t => t !== 'wati_training')
                          : [...moduleFilters.type, 'wati_training'];
                        setModuleFilters({ ...moduleFilters, type: newType });
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={moduleFilters.type.includes('wati_training')}
                        onChange={() => {}}
                      />
                      <span>Support Training</span>
                    </div>
                    <div
                      className="dropdown-option"
                      onClick={() => {
                        const newType = moduleFilters.type.includes('new_deployment')
                          ? moduleFilters.type.filter(t => t !== 'new_deployment')
                          : [...moduleFilters.type, 'new_deployment'];
                        setModuleFilters({ ...moduleFilters, type: newType });
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={moduleFilters.type.includes('new_deployment')}
                        onChange={() => {}}
                      />
                      <span>New Deployment</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="filter-group">
              <label>Category:</label>
              <div className="dropdown-wrapper">
                <button
                  className={`dropdown-btn ${openDropdown === 'category' ? 'active' : ''}`}
                  onClick={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
                  disabled={currentTypeCategories.length === 0}
                >
                  {moduleFilters.category.length === 0 ? 'All Categories' : `${moduleFilters.category.length} selected`}
                  <span className="dropdown-arrow">▼</span>
                </button>
                {openDropdown === 'category' && (
                  <div className="dropdown-menu">
                    <div
                      className="dropdown-option"
                      onClick={() => setModuleFilters({ ...moduleFilters, category: [] })}
                    >
                      <input
                        type="checkbox"
                        checked={moduleFilters.category.length === 0}
                        onChange={() => {}}
                      />
                      <span>Select All</span>
                    </div>
                    {currentTypeCategories.map((cat) => (
                      <div
                        key={cat._id}
                        className="dropdown-option"
                        onClick={() => {
                          const newCategory = moduleFilters.category.includes(cat._id)
                            ? moduleFilters.category.filter(c => c !== cat._id)
                            : [...moduleFilters.category, cat._id];
                          setModuleFilters({ ...moduleFilters, category: newCategory });
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={moduleFilters.category.includes(cat._id)}
                          onChange={() => {}}
                        />
                        <span>{cat.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="filter-group">
              <label>Status:</label>
              <div className="dropdown-wrapper">
                <button
                  className={`dropdown-btn ${openDropdown === 'status' ? 'active' : ''}`}
                  onClick={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
                >
                  {moduleFilters.status.length === 0 ? 'All Status' : `${moduleFilters.status.length} selected`}
                  <span className="dropdown-arrow">▼</span>
                </button>
                {openDropdown === 'status' && (
                  <div className="dropdown-menu">
                    <div
                      className="dropdown-option"
                      onClick={() => setModuleFilters({ ...moduleFilters, status: [] })}
                    >
                      <input
                        type="checkbox"
                        checked={moduleFilters.status.length === 0}
                        onChange={() => {}}
                      />
                      <span>Select All</span>
                    </div>
                    <div
                      className="dropdown-option"
                      onClick={() => {
                        const newStatus = moduleFilters.status.includes('draft')
                          ? moduleFilters.status.filter(s => s !== 'draft')
                          : [...moduleFilters.status, 'draft'];
                        setModuleFilters({ ...moduleFilters, status: newStatus });
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={moduleFilters.status.includes('draft')}
                        onChange={() => {}}
                      />
                      <span>Draft</span>
                    </div>
                    <div
                      className="dropdown-option"
                      onClick={() => {
                        const newStatus = moduleFilters.status.includes('active')
                          ? moduleFilters.status.filter(s => s !== 'active')
                          : [...moduleFilters.status, 'active'];
                        setModuleFilters({ ...moduleFilters, status: newStatus });
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={moduleFilters.status.includes('active')}
                        onChange={() => {}}
                      />
                      <span>Active</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              className="btn-reset-filters"
              onClick={() => {
                setModuleFilters({ type: [], category: [], status: [] });
                setOpenDropdown(null);
              }}
            >
              Clear
            </button>
          </div>

          {/* Toggle success message */}
          {toggleMessage && (
            <div className="success-msg" style={{ marginBottom: 16 }}>
              {toggleMessage}
            </div>
          )}

          {/* Modules Table */}
          {filteredModules.length > 0 ? (
            <div className="modules-table-wrapper">
              <table className="modules-table">
                <thead>
                  <tr>
                    <th>Module Name</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Content Type</th>
                    <th>Date Added</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredModules.map((module) => (
                    <tr
                      key={module._id}
                      className={selectedModule?._id === module._id ? 'active' : ''}
                      onClick={() => handleSelectModule(module)}
                    >
                      <td className="module-name">{module.title}</td>
                      <td>{getCategoryType(module.categoryId) === 'Support Training' ? 'Support Training' : 'New Deployment'}</td>
                      <td>{getCategoryName(module.categoryId)}</td>
                      <td>
                        <span className="content-type-badge">
                          {module.fileType === 'pdf' && 'PDF'}
                          {module.fileType === 'pptx' && 'PowerPoint'}
                          {module.fileType === 'video' && 'Video'}
                          {module.fileType === 'doc' && 'Document'}
                        </span>
                      </td>
                      <td className="date-col">
                        {new Date(module.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <span className={`status-badge status-${module.status}`}>
                          {module.status === 'draft'  && 'Draft'}
                          {module.status === 'active' && 'Active'}
                          {module.status === 'locked' && 'Locked'}
                        </span>
                      </td>
                      <td style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <button
                          className="btn-view"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectModule(module);
                          }}
                        >
                          View
                        </button>
                        {module.status === 'active' ? (
                          <button
                            className="btn-lock"
                            onClick={(e) => handleToggleStatus(e, module._id, module.status)}
                          >
                            Lock
                          </button>
                        ) : (
                          <button
                            className="btn-activate"
                            onClick={(e) => handleToggleStatus(e, module._id, module.status)}
                          >
                            Activate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <p>No modules found matching your filters.</p>
            </div>
          )}

          {/* Module Details Panel */}
          {selectedModule && (
            <div className="module-details-panel">
              <div className="details-header">
                <div>
                  <h4>{selectedModule.title}</h4>
                  <p className="details-type">{getCategoryType(selectedModule.categoryId) === 'Support Training' ? 'Support Training' : 'New Deployment'}</p>
                </div>
              </div>

              <div className="details-body">
                <p className="details-description">{selectedModule.description || 'No description'}</p>

                {/* Add Category Section */}
                {!showAddCategoryForm ? (
                  <button
                    className="btn-add-category"
                    onClick={() => setShowAddCategoryForm(true)}
                  >
                    ➕ Add Category
                  </button>
                ) : (
                  <form onSubmit={handleAddCategory} className="add-category-form">
                    <h5>Add New Category</h5>
                    <div className="form-group">
                      <label>Category Name *</label>
                      <input
                        type="text"
                        value={newCategoryForm.name}
                        onChange={(e) => setNewCategoryForm({ ...newCategoryForm, name: e.target.value })}
                        placeholder="e.g., Getting Started"
                        required
                        autoFocus
                      />
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        value={newCategoryForm.description}
                        onChange={(e) => setNewCategoryForm({ ...newCategoryForm, description: e.target.value })}
                        placeholder="Optional description"
                        rows="2"
                      />
                    </div>

                    {categoryError && <div className="error-msg">{categoryError}</div>}
                    {categorySuccess && <div className="success-msg">{categorySuccess}</div>}

                    <div className="form-actions">
                      <button type="submit" className="btn-submit">Add Category</button>
                      <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => {
                          setShowAddCategoryForm(false);
                          setCategoryError('');
                          setCategorySuccess('');
                          setNewCategoryForm({ name: '', description: '' });
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* UPLOAD CONTENT TAB */}
      {activeTab === 'upload' && (
        <div className="mm-tab-content">
          <div className="upload-section">
            <h3>📤 Upload New Content</h3>

            <form onSubmit={handleUpload} className="upload-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Module Type *</label>
                  <select
                    value={moduleForm.moduleType}
                    onChange={(e) => setModuleForm({ ...moduleForm, moduleType: e.target.value, categoryId: '', topic: '' })}
                    required
                  >
                    <option value="">Select type</option>
                    <option value="support_training">Support Training</option>
                    <option value="new_deployment">New Deployment</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={moduleForm.categoryId}
                    onChange={(e) => setModuleForm({ ...moduleForm, categoryId: e.target.value })}
                    required
                    disabled={!moduleForm.moduleType}
                  >
                    <option value="">Select category</option>
                    {uploadTypeCategories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Topic {moduleForm.moduleType === 'new_deployment' && '(e.g., Sprint 1, Update 14th April)'}</label>
                <input
                  type="text"
                  value={moduleForm.topic}
                  onChange={(e) => setModuleForm({ ...moduleForm, topic: e.target.value })}
                  placeholder="Enter topic or subject"
                />
              </div>

              <div className="form-group">
                <label>Content Name *</label>
                <input
                  type="text"
                  value={moduleForm.title}
                  onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                  placeholder="e.g., WATI Basics Tutorial"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={moduleForm.description}
                  onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                  placeholder="What is this content about?"
                  rows="2"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Content Type *</label>
                  <select
                    value={moduleForm.fileType}
                    onChange={(e) => setModuleForm({ ...moduleForm, fileType: e.target.value })}
                  >
                    <option value="pdf">PDF</option>
                    <option value="pptx">PowerPoint</option>
                    <option value="video">Video</option>
                    <option value="doc">Document</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Upload File *</label>
                  <input
                    type="file"
                    id="moduleFile"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const error = validateFileType(file, moduleForm.fileType);
                      if (error) {
                        setUploadError(error);
                        return;
                      }

                      if (moduleForm.fileType === 'video') {
                        const dur = await getVideoDurationAsync(file);
                        if (dur > MAX_VIDEO_DURATION) {
                          setUploadError(`Video too long (max ${formatDuration(MAX_VIDEO_DURATION)})`);
                          return;
                        }
                      }

                      setUploadError('');
                      setModuleForm({ ...moduleForm, file });
                    }}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="moduleFile" className="file-upload-label">
                    {moduleForm.file ? `✓ ${moduleForm.file.name}` : '📁 Click to select file'}
                  </label>
                </div>
              </div>

              {uploadError && <div className="error-msg">{uploadError}</div>}

              <button type="submit" className="btn btn-success">Upload Content</button>
            </form>
          </div>
        </div>
      )}

      {/* LIBRARY TAB */}
      {activeTab === 'library' && (
        <div className="mm-tab-content">
          <div className="library-section">
            <h3>📖 Content Library</h3>

            {/* Filters */}
            <div className="library-filters">
              <div className="filter-group">
                <label>Module Type:</label>
                <div className="dropdown-wrapper">
                  <button
                    className={`dropdown-btn ${openDropdown === 'libraryType' ? 'active' : ''}`}
                    onClick={() => setOpenDropdown(openDropdown === 'libraryType' ? null : 'libraryType')}
                  >
                    {libraryFilters.type.length === 0 ? 'All Types' : `${libraryFilters.type.length} selected`}
                    <span className="dropdown-arrow">▼</span>
                  </button>
                  {openDropdown === 'libraryType' && (
                    <div className="dropdown-menu">
                      <div
                        className="dropdown-option"
                        onClick={() => setLibraryFilters({ ...libraryFilters, type: [] })}
                      >
                        <input
                          type="checkbox"
                          checked={libraryFilters.type.length === 0}
                          onChange={() => {}}
                        />
                        <span>Select All</span>
                      </div>
                      <div
                        className="dropdown-option"
                        onClick={() => {
                          const newType = libraryFilters.type.includes('support')
                            ? libraryFilters.type.filter(t => t !== 'support')
                            : [...libraryFilters.type, 'support'];
                          setLibraryFilters({ ...libraryFilters, type: newType });
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={libraryFilters.type.includes('support')}
                          onChange={() => {}}
                        />
                        <span>Support Training</span>
                      </div>
                      <div
                        className="dropdown-option"
                        onClick={() => {
                          const newType = libraryFilters.type.includes('deployment')
                            ? libraryFilters.type.filter(t => t !== 'deployment')
                            : [...libraryFilters.type, 'deployment'];
                          setLibraryFilters({ ...libraryFilters, type: newType });
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={libraryFilters.type.includes('deployment')}
                          onChange={() => {}}
                        />
                        <span>New Deployment</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="filter-group">
                <label>Category:</label>
                <div className="dropdown-wrapper">
                  <button
                    className={`dropdown-btn ${openDropdown === 'libraryCategory' ? 'active' : ''}`}
                    onClick={() => setOpenDropdown(openDropdown === 'libraryCategory' ? null : 'libraryCategory')}
                    disabled={libraryTypeCategories.length === 0}
                  >
                    {libraryFilters.category.length === 0 ? 'All Categories' : `${libraryFilters.category.length} selected`}
                    <span className="dropdown-arrow">▼</span>
                  </button>
                  {openDropdown === 'libraryCategory' && (
                    <div className="dropdown-menu">
                      <div
                        className="dropdown-option"
                        onClick={() => setLibraryFilters({ ...libraryFilters, category: [] })}
                      >
                        <input
                          type="checkbox"
                          checked={libraryFilters.category.length === 0}
                          onChange={() => {}}
                        />
                        <span>Select All</span>
                      </div>
                      {libraryTypeCategories.map((cat) => (
                        <div
                          key={cat._id}
                          className="dropdown-option"
                          onClick={() => {
                            const newCategory = libraryFilters.category.includes(cat._id)
                              ? libraryFilters.category.filter(c => c !== cat._id)
                              : [...libraryFilters.category, cat._id];
                            setLibraryFilters({ ...libraryFilters, category: newCategory });
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={libraryFilters.category.includes(cat._id)}
                            onChange={() => {}}
                          />
                          <span>{cat.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="filter-group">
                <label>From Date:</label>
                <input
                  type="date"
                  value={libraryFilters.dateFrom}
                  onChange={(e) => setLibraryFilters({ ...libraryFilters, dateFrom: e.target.value })}
                />
              </div>

              <div className="filter-group">
                <label>To Date:</label>
                <input
                  type="date"
                  value={libraryFilters.dateTo}
                  onChange={(e) => setLibraryFilters({ ...libraryFilters, dateTo: e.target.value })}
                />
              </div>

              <div className="filter-actions">
                <button
                  className="btn-refresh"
                  onClick={() => fetchData()}
                  title="Refresh content"
                  disabled={loading}
                >
                  {loading ? '⏳ Loading...' : '🔄 Refresh'}
                </button>
                <button
                  className="btn-reset-filters"
                  onClick={() => {
                    setLibraryFilters({ type: [], category: [], dateFrom: '', dateTo: '' });
                    setOpenDropdown(null);
                  }}
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Content Table */}
            {libraryContent.length > 0 ? (
              <div className="library-table-wrapper">
                <table className="library-table">
                  <thead>
                    <tr>
                      <th>Content Name</th>
                      <th>Category</th>
                      <th>Content Type</th>
                      <th>Date Added</th>
                      <th>File Link</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {libraryContent.map((content) => (
                      <tr key={content._id}>
                        <td className="module-name">{content.title}</td>
                        <td>{getCategoryName(content.categoryId)}</td>
                        <td>
                          <span className="content-type-badge">
                            {content.fileType === 'pdf' && 'PDF'}
                            {content.fileType === 'pptx' && 'PowerPoint'}
                            {content.fileType === 'video' && 'Video'}
                            {content.fileType === 'doc' && 'Document'}
                          </span>
                        </td>
                        <td className="date-col">
                          {new Date(content.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          {content.fileUrl ? (
                            <a href={content.fileUrl} target="_blank" rel="noopener noreferrer" className="file-link">
                              View
                            </a>
                          ) : (
                            <span className="no-file">—</span>
                          )}
                        </td>
                        <td>
                          <span className={`status-badge status-${content.status}`}>
                            {content.status === 'draft'  && 'Draft'}
                            {content.status === 'active' && 'Active'}
                            {content.status === 'locked' && 'Locked'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn-delete"
                            onClick={() => handleDeleteModule(content._id)}
                            title="Delete"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p>No content found. Upload your first content in the "Upload Content" tab.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleManagement;
