import React, { useState, useEffect } from 'react';
import '../../styles/admin/ContentManagement.css';

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('categories');
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);

  // Category form
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    icon: '📚',
    type: 'wati_training',
  });

  // Topic form
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [topicForm, setTopicForm] = useState({
    name: '',
    description: '',
    categoryId: '',
  });

  // Module form
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [moduleForm, setModuleForm] = useState({
    title: '',
    description: '',
    topicId: '',
    categoryId: '',
    fileType: 'pdf',
    file: null,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [videoDuration, setVideoDuration] = useState(0);
  const MAX_VIDEO_DURATION = 60 * 60; // 60 minutes in seconds

  // Module filters
  const [moduleFilters, setModuleFilters] = useState({
    category: '',
    contentType: '',
    status: '',
  });

  // Module type filter (wati_training, new_deployment, or all)
  const [moduleTypeFilter, setModuleTypeFilter] = useState('all');

  // File type validation mapping
  const fileTypeMap = {
    pdf: { extensions: ['.pdf'], mimeTypes: ['application/pdf'], label: 'PDF' },
    pptx: { extensions: ['.pptx', '.ppt'], mimeTypes: ['application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.ms-powerpoint'], label: 'PowerPoint' },
    video: { extensions: ['.mp4', '.mov', '.avi', '.mkv', '.webm'], mimeTypes: ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/webm'], label: 'Video' },
    doc: { extensions: ['.doc', '.docx'], mimeTypes: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'], label: 'Document' },
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');

    try {
      // Fetch categories
      const catRes = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/categories`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData.data || []);
      }

      // Fetch topics
      const topRes = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/topics`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (topRes.ok) {
        const topData = await topRes.json();
        setTopics(topData.data || []);
      }

      // Fetch modules
      const modRes = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/modules`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (modRes.ok) {
        const modData = await modRes.json();
        setModules(modData.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    setLoading(false);
  };

  const getContentTypeLabel = (fileType) => {
    const typeMap = {
      pdf: 'PDF',
      ppt: 'PPT',
      pptx: 'PowerPoint',
      doc: 'Document',
      docx: 'Word',
      video: 'Video',
      mp4: 'Video',
      mov: 'Video',
      avi: 'Video',
      mkv: 'Video',
      webm: 'Video',
    };
    return typeMap[fileType?.toLowerCase()] || fileType || '-';
  };

  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm('Are you sure you want to delete this module?')) return;

    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || (process.env.REACT_APP_API_URL || 'http://localhost:5000')}$1`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        alert('✅ Module deleted successfully!');
        fetchData();
      } else {
        alert('❌ Failed to delete module');
      }
    } catch (error) {
      console.error('Error deleting module:', error);
      alert('Error deleting module');
    }
  };

  const handleDeleteTopic = async (topicId) => {
    if (!window.confirm('Are you sure you want to delete this topic?')) return;

    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || (process.env.REACT_APP_API_URL || 'http://localhost:5000')}$1`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        alert('✅ Topic deleted successfully!');
        fetchData();
      } else {
        alert('❌ Failed to delete topic');
      }
    } catch (error) {
      console.error('Error deleting topic:', error);
      alert('Error deleting topic');
    }
  };

  const getFilteredModules = () => {
    return modules.filter((module) => {
      const matchCategory = !moduleFilters.category ||
        (module.categoryId && (typeof module.categoryId === 'object'
          ? module.categoryId._id === moduleFilters.category
          : module.categoryId === moduleFilters.category));

      const matchContentType = !moduleFilters.contentType ||
        module.fileType === moduleFilters.contentType;

      const matchStatus = !moduleFilters.status ||
        module.status === moduleFilters.status;

      // Filter by module type (based on category type)
      let matchType = true;
      if (moduleTypeFilter !== 'all') {
        const catType = module.categoryId && typeof module.categoryId === 'object'
          ? module.categoryId.type
          : null;
        matchType = catType === moduleTypeFilter;
      }

      return matchCategory && matchContentType && matchStatus && matchType;
    });
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/categories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryForm),
      });

      if (response.ok) {
        alert('✅ Category created successfully!');
        setCategoryForm({ name: '', description: '', icon: '📚', type: 'wati_training' });
        setShowCategoryForm(false);
        fetchData();
      } else {
        alert('❌ Failed to create category');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating category');
    }
  };

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/topics`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(topicForm),
      });

      if (response.ok) {
        alert('✅ Topic created successfully!');
        setTopicForm({ name: '', description: '', categoryId: '' });
        setShowTopicForm(false);
        fetchData();
      } else {
        alert('❌ Failed to create topic');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating topic');
    }
  };

  const handleCreateModule = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      if (!moduleForm.title || !moduleForm.categoryId) {
        alert('❌ Please fill in title and category');
        return;
      }

      setUploadProgress(25);

      const formData = new FormData();
      formData.append('title', moduleForm.title);
      formData.append('description', moduleForm.description);
      formData.append('categoryId', moduleForm.categoryId);
      formData.append('topicId', moduleForm.topicId);
      formData.append('fileType', moduleForm.fileType);

      if (moduleForm.file) {
        formData.append('file', moduleForm.file);
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/modules`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      setUploadProgress(75);

      if (response.ok) {
        setUploadProgress(100);
        alert('✅ Module created successfully!');
        setModuleForm({
          title: '',
          description: '',
          topicId: '',
          categoryId: '',
          fileType: 'pdf',
          file: null,
        });
        setShowModuleForm(false);
        setUploadProgress(0);
        fetchData();
      } else {
        alert('❌ Failed to create module');
        setUploadProgress(0);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating module');
      setUploadProgress(0);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;

    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || (process.env.REACT_APP_API_URL || 'http://localhost:5000')}$1`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        alert('✅ Category deleted');
        fetchData();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Validate file type against selected content type
  const validateFileType = (file, selectedType) => {
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    const allowedExtensions = fileTypeMap[selectedType]?.extensions || [];

    if (!allowedExtensions.includes(fileExtension)) {
      const typeLabel = fileTypeMap[selectedType]?.label || selectedType;
      return `Invalid file type. Please upload a ${typeLabel} file only. Allowed: ${allowedExtensions.join(', ')}`;
    }
    return null;
  };

  // Get video duration in seconds
  const getVideoDuration = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(Math.round(video.duration));
      };
      video.onerror = () => {
        resolve(0);
      };
      video.src = URL.createObjectURL(file);
    });
  };

  // Format seconds to readable duration
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  return (
    <div className="content-management">
      <div className="content-header">
        <h2>📄 Content Management</h2>
        <p>Manage training modules, categories, and auto-generate tests</p>
      </div>

      <div className="content-tabs">
        <button
          className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          📁 Categories
        </button>
        <button
          className={`tab-btn ${activeTab === 'topics' ? 'active' : ''}`}
          onClick={() => setActiveTab('topics')}
        >
          🏷️ Topics
        </button>
        <button
          className={`tab-btn ${activeTab === 'modules' ? 'active' : ''}`}
          onClick={() => setActiveTab('modules')}
        >
          📚 Modules
        </button>
      </div>

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="tab-content">
          <div className="tab-header">
            <h3>Categories</h3>
            <button className="btn btn-primary" onClick={() => setShowCategoryForm(!showCategoryForm)}>
              {showCategoryForm ? '✕ Cancel' : '+ Add Category'}
            </button>
          </div>

          {showCategoryForm && (
            <form onSubmit={handleCreateCategory} className="form-card">
              <div className="form-group">
                <label>Category Name</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g., CRM Training"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="Category description"
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Icon</label>
                  <input
                    type="text"
                    value={categoryForm.icon}
                    onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                    placeholder="e.g., 📚"
                  />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={categoryForm.type}
                    onChange={(e) => setCategoryForm({ ...categoryForm, type: e.target.value })}
                  >
                    <option value="wati_training">Wati Training</option>
                    <option value="new_deployment">New Deployment</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-success">Create Category</button>
            </form>
          )}

          {/* Categories Table */}
          <div className="data-table-container">
            {categories.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Category Name</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat._id}>
                      <td className="table-name">{cat.name}</td>
                      <td className="table-type">
                        <span className="type-badge">
                          {cat.type === 'wati_training' ? 'Wati Training' : 'New Deployment'}
                        </span>
                      </td>
                      <td className="table-description">{cat.description || '-'}</td>
                      <td className="table-date">
                        {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        }) : '-'}
                      </td>
                      <td className="table-actions">
                        <button
                          className="btn-small btn-delete"
                          onClick={() => handleDeleteCategory(cat._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="empty-state">No categories yet. Create one to get started!</p>
            )}
          </div>
        </div>
      )}

      {/* Topics Tab */}
      {activeTab === 'topics' && (
        <div className="tab-content">
          <div className="tab-header">
            <h3>Topics</h3>
            <button className="btn btn-primary" onClick={() => setShowTopicForm(!showTopicForm)}>
              {showTopicForm ? '✕ Cancel' : '+ Add Topic'}
            </button>
          </div>

          {showTopicForm && (
            <form onSubmit={handleCreateTopic} className="form-card">
              <div className="form-group">
                <label>Topic Name</label>
                <input
                  type="text"
                  value={topicForm.name}
                  onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value })}
                  placeholder="e.g., Advanced CRM"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={topicForm.description}
                  onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
                  placeholder="Topic description"
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={topicForm.categoryId}
                  onChange={(e) => setTopicForm({ ...topicForm, categoryId: e.target.value })}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-success">Create Topic</button>
            </form>
          )}

          {/* Topics Table */}
          <div className="data-table-container">
            {topics.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Topic Name</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {topics.map((topic) => (
                    <tr key={topic._id}>
                      <td className="table-name">{topic.name}</td>
                      <td className="table-category">
                        {topic.categoryId ? (typeof topic.categoryId === 'object' ? topic.categoryId.name : topic.categoryId) : '-'}
                      </td>
                      <td className="table-description">{topic.description || '-'}</td>
                      <td className="table-date">
                        {topic.createdAt ? new Date(topic.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        }) : '-'}
                      </td>
                      <td className="table-actions">
                        <button
                          className="btn-small btn-delete"
                          onClick={() => handleDeleteTopic(topic._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="empty-state">No topics yet. Create one to get started!</p>
            )}
          </div>

          <p className="info-text">Topics help organize modules within categories. They're optional but recommended for better content structure.</p>
        </div>
      )}

      {/* Modules Tab */}
      {activeTab === 'modules' && (
        <div className="tab-content">
          <div className="tab-header">
            <h3>Training Modules</h3>
            <button className="btn btn-primary" onClick={() => setShowModuleForm(!showModuleForm)}>
              {showModuleForm ? '✕ Cancel' : '📤 Upload Content'}
            </button>
          </div>

          {/* Filter Bar */}
          <div className="filters-bar">
            <select
              className="filter-select"
              value={moduleFilters.category}
              onChange={(e) => setModuleFilters({ ...moduleFilters, category: e.target.value })}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>

            <select
              className="filter-select"
              value={moduleFilters.contentType}
              onChange={(e) => setModuleFilters({ ...moduleFilters, contentType: e.target.value })}
            >
              <option value="">All Content Types</option>
              <option value="pdf">PDF</option>
              <option value="pptx">PowerPoint</option>
              <option value="video">Video</option>
              <option value="doc">Document</option>
            </select>

            <select
              className="filter-select"
              value={moduleFilters.status}
              onChange={(e) => setModuleFilters({ ...moduleFilters, status: e.target.value })}
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <button
              className="btn btn-secondary"
              onClick={() => setModuleFilters({ category: '', contentType: '', status: '' })}
            >
              Clear Filters
            </button>
          </div>

          {/* Module Type Tabs */}
          <div className="module-type-tabs">
            <button
              className={`type-tab ${moduleTypeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setModuleTypeFilter('all')}
            >
              All Modules
            </button>
            <button
              className={`type-tab ${moduleTypeFilter === 'wati_training' ? 'active' : ''}`}
              onClick={() => setModuleTypeFilter('wati_training')}
            >
              Wati Training
            </button>
            <button
              className={`type-tab ${moduleTypeFilter === 'new_deployment' ? 'active' : ''}`}
              onClick={() => setModuleTypeFilter('new_deployment')}
            >
              New Deployment
            </button>
          </div>

          {showModuleForm && (
            <form onSubmit={handleCreateModule} className="form-card">
              <div className="form-group">
                <label>Module Title</label>
                <input
                  type="text"
                  value={moduleForm.title}
                  onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                  placeholder="e.g., CRM Advanced Training"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={moduleForm.description}
                  onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                  placeholder="What will participants learn?"
                  rows="3"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={moduleForm.categoryId}
                    onChange={(e) => setModuleForm({ ...moduleForm, categoryId: e.target.value, topicId: '' })}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Topic</label>
                  <select
                    value={moduleForm.topicId}
                    onChange={(e) => setModuleForm({ ...moduleForm, topicId: e.target.value })}
                  >
                    <option value="">Select topic</option>
                    {topics
                      .filter((topic) => topic.categoryId === moduleForm.categoryId)
                      .map((topic) => (
                        <option key={topic._id} value={topic._id}>{topic.name}</option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Content Type</label>
                <select
                  value={moduleForm.fileType}
                  onChange={(e) => setModuleForm({ ...moduleForm, fileType: e.target.value })}
                >
                  <option value="pdf">📄 PDF</option>
                  <option value="pptx">🎨 PowerPoint</option>
                  <option value="video">🎥 Video</option>
                  <option value="doc">📝 Document</option>
                </select>
              </div>
              <div className="upload-section">
                <label>📎 Content File (Optional)</label>
                <div className="upload-area">
                  <input
                    type="file"
                    id="moduleFile"
                    accept=".pdf,.pptx,.ppt,.mp4,.mov,.avi,.mkv,.webm,.doc,.docx"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      setUploadError('');

                      if (file) {
                        // Validate file size (max 100MB)
                        if (file.size > 100 * 1024 * 1024) {
                          setUploadError('❌ File size must be less than 100MB');
                          return;
                        }

                        // Validate file type matches selected content type
                        const typeError = validateFileType(file, moduleForm.fileType);
                        if (typeError) {
                          setUploadError(typeError);
                          return;
                        }

                        // For videos, check duration
                        if (moduleForm.fileType === 'video') {
                          const duration = await getVideoDuration(file);
                          setVideoDuration(duration);

                          if (duration > MAX_VIDEO_DURATION) {
                            setUploadError(`❌ Video duration exceeds allowed limit (${formatDuration(MAX_VIDEO_DURATION)}). Please upload a shorter video.`);
                            return;
                          }
                        }

                        // All validations passed
                        setModuleForm({ ...moduleForm, file });
                        setUploadProgress(0);
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="moduleFile" className="upload-label">
                    <div className="upload-icon">📁</div>
                    <p className="upload-text">
                      {moduleForm.file ? `✓ ${moduleForm.file.name}` : 'Click to select file from your computer'}
                    </p>
                  </label>
                </div>

                {uploadError && (
                  <div className="upload-error">
                    {uploadError}
                  </div>
                )}

                {moduleForm.file && videoDuration > 0 && moduleForm.fileType === 'video' && (
                  <div className="video-duration-info">
                    ✓ Video duration: {formatDuration(videoDuration)}
                  </div>
                )}

                {moduleForm.file && (
                  <div className="file-preview">
                    <div className="file-info">
                      <div className="file-name">📄 {moduleForm.file.name}</div>
                      <div className="file-details">
                        <span className="file-size">
                          {(moduleForm.file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                        <span className="file-type">
                          {moduleForm.file.type || moduleForm.fileType}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => setModuleForm({ ...moduleForm, file: null })}
                    >
                      ✕ Remove
                    </button>
                  </div>
                )}

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${uploadProgress}%` }}>
                      {uploadProgress}%
                    </div>
                  </div>
                )}

                {uploadProgress === 100 && (
                  <div className="upload-success">✓ File uploaded successfully</div>
                )}
              </div>
              <button type="submit" className="btn btn-success">
                📤 Upload & Auto-Generate Tests
              </button>
              <p className="info-text">
                ✨ Tests will be automatically generated from your uploaded file using AI. You can edit them in the Tests section.
              </p>
            </form>
          )}

          <p className="info-text">📁 Upload training materials (PDF, PowerPoint, Video, Word). Tests will be automatically generated from your content and can be edited in the Tests section.</p>

          {/* Modules List Table */}
          <div className="modules-table-container">
            <h3 style={{ marginTop: '24px', marginBottom: '16px' }}>Uploaded Modules ({getFilteredModules().length})</h3>
            {getFilteredModules() && getFilteredModules().length > 0 ? (
              <table className="modules-table">
                <thead>
                  <tr>
                    <th>Module Name</th>
                    <th>Category</th>
                    <th>Content Type</th>
                    <th>File Name</th>
                    <th>Uploaded Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredModules().map((module) => (
                    <tr key={module._id}>
                      <td className="module-name">{module.title}</td>
                      <td className="module-category">
                        {module.categoryId ? (typeof module.categoryId === 'object' ? module.categoryId.name : module.categoryId) : '-'}
                      </td>
                      <td className="module-type">
                        {getContentTypeLabel(module.fileType)}
                      </td>
                      <td className="module-file">
                        {module.fileUrl ? (
                          <a href={module.fileUrl} target="_blank" rel="noopener noreferrer" className="file-link">
                            {module.fileUrl.split('/').pop()}
                          </a>
                        ) : (
                          <span className="no-file">-</span>
                        )}
                      </td>
                      <td className="module-date">
                        {new Date(module.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="module-status">
                        <span className={`status-badge status-${module.status}`}>
                          {module.status === 'active' ? 'Active' : module.status === 'inactive' ? 'Inactive' : 'Draft'}
                        </span>
                      </td>
                      <td className="module-actions">
                        <button
                          className="btn-small btn-view"
                          onClick={() => window.alert(`Module: ${module.title}\n\nFile: ${module.fileUrl || 'No file'}`)}
                        >
                          View
                        </button>
                        <button
                          className="btn-small btn-delete"
                          onClick={() => handleDeleteModule(module._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="empty-state">No modules uploaded yet. Upload your first module above!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;
