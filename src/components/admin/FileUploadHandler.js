import React, { useState, useRef } from 'react';
import '../../styles/Phase3Components.css';

/**
 * FileUploadHandler Component
 *
 * Handles file uploads with drag & drop, file validation, and progress tracking
 *
 * Props:
 *   - onUploadComplete: Callback when upload completes. Called with { file, fileName, fileSize, fileType, uploadedUrl }
 *   - maxFileSize: Maximum file size in MB (default: 50)
 *   - allowedFileTypes: Array of allowed file types (default: ['pdf', 'doc', 'docx', 'jpg', 'png', 'gif', 'mp4', 'mov', 'avi'])
 *   - showPreview: Show file preview after upload (default: true)
 *   - multiple: Allow multiple file selection (default: false)
 *   - disabled: Disable upload (default: false)
 *
 * Returns: { file, fileName, fileSize, fileType, uploadProgress, uploadedUrl }
 */
const FileUploadHandler = ({
  onUploadComplete,
  maxFileSize = 50,
  allowedFileTypes = ['pdf', 'doc', 'docx', 'jpg', 'png', 'gif', 'mp4', 'mov', 'avi'],
  showPreview = true,
  multiple = false,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const getFileExtension = (fileName) => {
    return fileName.split('.').pop().toLowerCase();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file) => {
    const fileExtension = getFileExtension(file.name);
    const fileSizeInMB = file.size / (1024 * 1024);

    // Check file type
    if (!allowedFileTypes.includes(fileExtension)) {
      setError(`File type '.${fileExtension}' not allowed. Allowed types: ${allowedFileTypes.join(', ')}`);
      return false;
    }

    // Check file size
    if (fileSizeInMB > maxFileSize) {
      setError(`File size exceeds maximum limit of ${maxFileSize}MB`);
      return false;
    }

    setError(null);
    return true;
  };

  const simulateUpload = (file) => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          resolve();
        }
        setUploadProgress(Math.min(progress, 100));
      }, 300);
    });
  };

  const handleFileSelect = async (files) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!validateFile(file)) {
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      await simulateUpload(file);

      const fileType = getFileExtension(file.name);
      const fileName = file.name;
      const fileSize = file.size;

      // Create a URL for the file (in real implementation, this would be from backend)
      const uploadedUrl = URL.createObjectURL(file);

      const uploadData = {
        file,
        fileName,
        fileSize,
        fileType,
        uploadProgress: 100,
        uploadedUrl,
      };

      setUploadedFile(uploadData);
      setUploadProgress(100);

      // Call parent callback
      if (onUploadComplete) {
        onUploadComplete(uploadData);
      }

      // Reset progress after a delay
      setTimeout(() => {
        setUploadProgress(0);
        setIsUploading(false);
      }, 500);
    } catch (err) {
      setError('Upload failed. Please try again.');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (e) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleBrowseClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleInputChange = (e) => {
    handleFileSelect(e.target.files);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isImageFile = uploadedFile
    ? ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(uploadedFile.fileType)
    : false;

  const isVideoFile = uploadedFile
    ? ['mp4', 'mov', 'avi', 'webm', 'mkv'].includes(uploadedFile.fileType)
    : false;

  const isAudioFile = uploadedFile
    ? ['mp3', 'wav', 'ogg', 'flac'].includes(uploadedFile.fileType)
    : false;

  return (
    <div className="file-upload-handler">
      {!uploadedFile ? (
        <div
          className={`file-upload-area ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="upload-icon">📎</div>
          <h3 className="upload-title">Upload a File</h3>
          <p className="upload-subtitle">Drag and drop your file here or click to browse</p>
          <button
            className="upload-browse-btn"
            onClick={handleBrowseClick}
            disabled={disabled || isUploading}
          >
            {isUploading ? 'Uploading...' : 'Browse Files'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleInputChange}
            disabled={disabled || isUploading}
            accept={allowedFileTypes.map(ext => `.${ext}`).join(',')}
            style={{ display: 'none' }}
          />
          <p className="upload-helper-text">
            Allowed types: {allowedFileTypes.join(', ')} • Max size: {maxFileSize}MB
          </p>

          {isUploading && (
            <div className="upload-progress-container">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="progress-text">{Math.round(uploadProgress)}%</p>
            </div>
          )}
        </div>
      ) : (
        <div className="file-upload-success">
          <div className="uploaded-file-info">
            <div className="file-icon">
              {isImageFile ? '🖼' : isVideoFile ? '🎬' : isAudioFile ? '🎵' : '📄'}
            </div>
            <div className="file-details">
              <p className="file-name">{uploadedFile.fileName}</p>
              <p className="file-meta">
                {uploadedFile.fileType.toUpperCase()} • {formatFileSize(uploadedFile.fileSize)}
              </p>
            </div>
            <button
              className="file-remove-btn"
              onClick={handleRemoveFile}
              title="Remove file"
            >
              ✕
            </button>
          </div>

          {showPreview && (
            <div className="file-preview-container">
              {isImageFile && (
                <div className="file-preview">
                  <img
                    src={uploadedFile.uploadedUrl}
                    alt={uploadedFile.fileName}
                    className="preview-image"
                  />
                </div>
              )}
              {isVideoFile && (
                <div className="file-preview">
                  <video
                    src={uploadedFile.uploadedUrl}
                    className="preview-video"
                    controls
                    controlsList="nodownload"
                  />
                </div>
              )}
              {isAudioFile && (
                <div className="file-preview">
                  <audio
                    src={uploadedFile.uploadedUrl}
                    className="preview-audio"
                    controls
                    controlsList="nodownload"
                  />
                </div>
              )}
              {!isImageFile && !isVideoFile && !isAudioFile && (
                <div className="file-preview-generic">
                  <p>File ready for submission</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {error && <div className="file-upload-error">{error}</div>}
    </div>
  );
};

export default FileUploadHandler;
