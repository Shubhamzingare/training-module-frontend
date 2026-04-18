import React, { useState } from 'react';
import '../../styles/GoogleFormBuilder.css';

const QuestionOptions = ({ question, onUpdate }) => {
  const [expandedSection, setExpandedSection] = useState('');

  const handleToggle = (field) => {
    onUpdate({
      ...question,
      [field]: !question[field],
    });
  };

  const handleScaleChange = (field, value) => {
    onUpdate({
      ...question,
      [field]: parseInt(value),
    });
  };

  const handleScaleLabelChange = (field, value) => {
    onUpdate({
      ...question,
      [field]: value,
    });
  };

  const handleImageUpload = (e) => {
    // TODO: Implement actual image upload
    const file = e.target.files[0];
    if (file) {
      // For now, just store the file name
      onUpdate({
        ...question,
        questionImage: URL.createObjectURL(file),
      });
    }
  };

  const handleAllowedFileTypesChange = (e) => {
    const types = e.target.value.split(',').map((t) => t.trim());
    onUpdate({
      ...question,
      allowedFileTypes: types,
    });
  };

  const handleMaxFileSizeChange = (e) => {
    onUpdate({
      ...question,
      maxFileSize: parseInt(e.target.value),
    });
  };

  // Determine which options to show based on question type
  const showRequiredOption = true;
  const showImageOption = true;
  const showShuffleOption = ['mcq', 'checkbox', 'dropdown'].includes(
    question.type
  );
  const showLinearScaleOptions = question.type === 'linearScale';
  const showFileUploadOptions = question.type === 'fileUpload';

  return (
    <div className="question-options">
      {/* Required Option */}
      {showRequiredOption && (
        <div className="section">
          <div
            className="section-header"
            onClick={() =>
              setExpandedSection(
                expandedSection === 'required' ? '' : 'required'
              )
            }
          >
            <span className="section-title">Required</span>
            <span
              className={`toggle-switch ${
                question.isRequired ? 'on' : 'off'
              }`}
            >
              {question.isRequired ? 'ON' : 'OFF'}
            </span>
          </div>

          {expandedSection === 'required' && (
            <div className="section-content">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={question.isRequired}
                  onChange={() => handleToggle('isRequired')}
                />
                <span>
                  Mark this question as required
                </span>
              </label>
            </div>
          )}
        </div>
      )}

      {/* Shuffle Options */}
      {showShuffleOption && (
        <div className="section">
          <div
            className="section-header"
            onClick={() =>
              setExpandedSection(
                expandedSection === 'shuffle' ? '' : 'shuffle'
              )
            }
          >
            <span className="section-title">Shuffle Options</span>
            <span
              className={`toggle-switch ${
                question.shuffleOptions ? 'on' : 'off'
              }`}
            >
              {question.shuffleOptions ? 'ON' : 'OFF'}
            </span>
          </div>

          {expandedSection === 'shuffle' && (
            <div className="section-content">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={question.shuffleOptions}
                  onChange={() => handleToggle('shuffleOptions')}
                />
                <span>
                  Randomize option order for each respondent
                </span>
              </label>
            </div>
          )}
        </div>
      )}

      {/* Linear Scale Options */}
      {showLinearScaleOptions && (
        <div className="section">
          <div
            className="section-header"
            onClick={() =>
              setExpandedSection(
                expandedSection === 'scale' ? '' : 'scale'
              )
            }
          >
            <span className="section-title">Scale Settings</span>
            <span
              className={`expand-icon ${
                expandedSection === 'scale' ? 'open' : ''
              }`}
            >
              ⌄
            </span>
          </div>

          {expandedSection === 'scale' && (
            <div className="section-content">
              <div className="form-row">
                <div className="form-group">
                  <label>Minimum Value</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={question.scaleMin}
                    onChange={(e) =>
                      handleScaleChange('scaleMin', e.target.value)
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Maximum Value</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={question.scaleMax}
                    onChange={(e) =>
                      handleScaleChange('scaleMax', e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Min Label (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Strongly Disagree"
                  value={question.scaleMinLabel}
                  onChange={(e) =>
                    handleScaleLabelChange('scaleMinLabel', e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Max Label (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Strongly Agree"
                  value={question.scaleMaxLabel}
                  onChange={(e) =>
                    handleScaleLabelChange('scaleMaxLabel', e.target.value)
                  }
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* File Upload Options */}
      {showFileUploadOptions && (
        <div className="section">
          <div
            className="section-header"
            onClick={() =>
              setExpandedSection(
                expandedSection === 'fileupload' ? '' : 'fileupload'
              )
            }
          >
            <span className="section-title">File Upload Settings</span>
            <span
              className={`expand-icon ${
                expandedSection === 'fileupload' ? 'open' : ''
              }`}
            >
              ⌄
            </span>
          </div>

          {expandedSection === 'fileupload' && (
            <div className="section-content">
              <div className="form-group">
                <label>Allowed File Types (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g., pdf, doc, docx, jpg, png"
                  value={question.allowedFileTypes.join(', ')}
                  onChange={handleAllowedFileTypesChange}
                />
              </div>

              <div className="form-group">
                <label>Max File Size (MB)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={question.maxFileSize}
                  onChange={handleMaxFileSizeChange}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Question Image */}
      {showImageOption && (
        <div className="section">
          <div
            className="section-header"
            onClick={() =>
              setExpandedSection(
                expandedSection === 'image' ? '' : 'image'
              )
            }
          >
            <span className="section-title">Question Image</span>
            {question.questionImage && (
              <span className="has-image">✓ Added</span>
            )}
            <span
              className={`expand-icon ${
                expandedSection === 'image' ? 'open' : ''
              }`}
            >
              ⌄
            </span>
          </div>

          {expandedSection === 'image' && (
            <div className="section-content">
              <div className="form-group">
                <label>Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input"
                />
              </div>

              {question.questionImage && (
                <div className="image-preview">
                  <img
                    src={question.questionImage}
                    alt="Question"
                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                  />
                  <button
                    className="remove-image-btn"
                    onClick={() =>
                      onUpdate({
                        ...question,
                        questionImage: null,
                      })
                    }
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionOptions;
