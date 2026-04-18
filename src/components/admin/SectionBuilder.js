import React, { useState } from 'react';
import '../../styles/AdvancedOptions.css';

const SectionBuilder = ({ sections = [], onUpdate }) => {
  const [expandedSection, setExpandedSection] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    description: '',
  });
  const [editingId, setEditingId] = useState(null);

  const handleAddSection = () => {
    if (!formData.title.trim()) {
      return;
    }

    let updatedSections;
    if (editingId) {
      // Update existing section
      updatedSections = sections.map((s) =>
        s.id === editingId
          ? {
              ...s,
              title: formData.title,
              description: formData.description,
            }
          : s
      );
      setEditingId(null);
    } else {
      // Add new section
      const newSection = {
        id: `section-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        order: sections.length,
      };
      updatedSections = [...sections, newSection];
    }

    onUpdate(updatedSections);
    setFormData({ id: null, title: '', description: '' });
    setShowForm(false);
  };

  const handleEditSection = (section) => {
    setFormData({
      id: section.id,
      title: section.title,
      description: section.description,
    });
    setEditingId(section.id);
    setShowForm(true);
  };

  const handleDeleteSection = (sectionId) => {
    const updatedSections = sections
      .filter((s) => s.id !== sectionId)
      .map((s, index) => ({
        ...s,
        order: index,
      }));
    onUpdate(updatedSections);
  };

  const handleMoveSection = (sectionId, direction) => {
    const index = sections.findIndex((s) => s.id === sectionId);
    if (
      (direction === 'up' && index > 0) ||
      (direction === 'down' && index < sections.length - 1)
    ) {
      const newSections = [...sections];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      [newSections[index], newSections[targetIndex]] = [
        newSections[targetIndex],
        newSections[index],
      ];
      // Update order values
      newSections.forEach((s, i) => (s.order = i));
      onUpdate(newSections);
    }
  };

  const handleCancelForm = () => {
    setFormData({ id: null, title: '', description: '' });
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <div className="advanced-options-container">
      <div className="advanced-header">
        <h3>Test Sections</h3>
        <p>Organize questions into logical sections</p>
      </div>

      {/* Sections List */}
      {sections.length > 0 && (
        <div className="sections-list" style={{ marginBottom: '16px' }}>
          {sections.map((section, index) => (
            <div key={section.id} className="section-item">
              <div className="item-content">
                <div className="section-title">{section.title}</div>
                {section.description && (
                  <div className="section-description">
                    {section.description}
                  </div>
                )}
              </div>
              <div className="item-actions">
                {index > 0 && (
                  <button
                    className="item-btn"
                    onClick={() => handleMoveSection(section.id, 'up')}
                    title="Move section up"
                  >
                    ↑
                  </button>
                )}
                {index < sections.length - 1 && (
                  <button
                    className="item-btn"
                    onClick={() => handleMoveSection(section.id, 'down')}
                    title="Move section down"
                  >
                    ↓
                  </button>
                )}
                <button
                  className="item-btn"
                  onClick={() => handleEditSection(section)}
                  title="Edit section"
                >
                  Edit
                </button>
                <button
                  className="item-btn delete"
                  onClick={() => handleDeleteSection(section.id)}
                  title="Delete section"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {sections.length === 0 && !showForm && (
        <div className="empty-state-message">
          No sections created yet. Add a section to organize your questions.
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="condition-builder">
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#202124' }}>
              {editingId ? 'Edit Section' : 'Create New Section'}
            </h4>
          </div>

          <div className="form-group">
            <label>Section Title *</label>
            <input
              type="text"
              placeholder="e.g., Basic Concepts, Advanced Topics"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Section Description (Optional)</label>
            <textarea
              placeholder="Add instructions or context for this section"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="form-actions">
            <button
              className="btn-submit"
              onClick={handleAddSection}
              disabled={!formData.title.trim()}
            >
              {editingId ? 'Update Section' : 'Add Section'}
            </button>
            <button className="btn-cancel" onClick={handleCancelForm}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add Button */}
      {!showForm && (
        <button
          className="btn-add"
          onClick={() => setShowForm(true)}
        >
          + Add Section
        </button>
      )}
    </div>
  );
};

export default SectionBuilder;
