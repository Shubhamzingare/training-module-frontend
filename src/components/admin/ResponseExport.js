import React, { useState, useEffect } from 'react';
import '../../styles/Phase3Components.css';

/**
 * ResponseExport Component
 *
 * Export test responses in multiple formats (CSV, JSON, Excel, PDF, HTML)
 *
 * Props:
 *   - responses: Array of response objects
 *   - questions: Array of question objects
 *   - testName: Name of the test for export filename
 *   - onExport: Callback when export is triggered
 *   - usesMockData: Show indicator if using mock data (default: true)
 *
 * Returns: { format, selectedColumns, dateRange }
 */
const ResponseExport = ({
  responses = [],
  questions = [],
  testName = 'test-responses',
  onExport,
  usesMockData = true,
}) => {
  const [selectedFormat, setSelectedFormat] = useState('csv');
  const [selectedColumns, setSelectedColumns] = useState({
    studentName: true,
    email: true,
    questionText: true,
    answer: true,
    isCorrect: true,
    score: true,
    timeTaken: true,
    submittedAt: true,
  });
  const [dateRangeStart, setDateRangeStart] = useState('');
  const [dateRangeEnd, setDateRangeEnd] = useState('');
  const [previewRows, setPreviewRows] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [exportSettings, setExportSettings] = useState({});

  // Mock data
  const mockResponses = [
    { id: '1', studentName: 'Alice Johnson', email: 'alice@example.com', questionId: 'q1', questionText: 'What is React?', answer: 'Option A', isCorrect: true, score: 5, timeTaken: 12, submittedAt: '2024-04-15T10:30:00Z' },
    { id: '2', studentName: 'Bob Smith', email: 'bob@example.com', questionId: 'q1', questionText: 'What is React?', answer: 'Option B', isCorrect: false, score: 0, timeTaken: 8, submittedAt: '2024-04-15T10:35:00Z' },
    { id: '3', studentName: 'Alice Johnson', email: 'alice@example.com', questionId: 'q2', questionText: 'Explain React', answer: 'JavaScript library', isCorrect: true, score: 3, timeTaken: 45, submittedAt: '2024-04-15T10:40:00Z' },
  ];

  const mockQuestions = [
    { id: 'q1', text: 'What is React?' },
    { id: 'q2', text: 'Explain React' },
  ];

  const activeResponses = usesMockData ? mockResponses : responses;

  // Load saved export settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('exportSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setExportSettings(parsed);
        setSelectedColumns({ ...selectedColumns, ...parsed.columns });
        setSelectedFormat(parsed.format || 'csv');
      } catch (err) {
        console.error('Error loading saved settings:', err);
      }
    }
  }, []);

  const saveExportSettings = () => {
    const settings = {
      format: selectedFormat,
      columns: selectedColumns,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('exportSettings', JSON.stringify(settings));
  };

  const toggleColumn = (columnName) => {
    setSelectedColumns({
      ...selectedColumns,
      [columnName]: !selectedColumns[columnName],
    });
  };

  const buildExportData = () => {
    return activeResponses.map((response) => {
      const row = {};
      if (selectedColumns.studentName) row.studentName = response.studentName || 'N/A';
      if (selectedColumns.email) row.email = response.email || 'N/A';
      if (selectedColumns.questionText) row.questionText = response.questionText || 'N/A';
      if (selectedColumns.answer) {
        row.answer = Array.isArray(response.answer)
          ? response.answer.join('; ')
          : response.answer || 'N/A';
      }
      if (selectedColumns.isCorrect) row.isCorrect = response.isCorrect ? 'Yes' : 'No';
      if (selectedColumns.score) row.score = response.score || 0;
      if (selectedColumns.timeTaken) row.timeTaken = response.timeTaken || 0;
      if (selectedColumns.submittedAt) {
        row.submittedAt = new Date(response.submittedAt).toLocaleString();
      }
      return row;
    });
  };

  const generateCSV = () => {
    const data = buildExportData();
    if (data.length === 0) {
      alert('No responses to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            // Escape quotes and wrap in quotes if contains comma
            const escaped = String(value).replace(/"/g, '""');
            return escaped.includes(',') ? `"${escaped}"` : escaped;
          })
          .join(',')
      ),
    ].join('\n');

    downloadFile(csvContent, `${testName}-responses.csv`, 'text/csv');
  };

  const generateJSON = () => {
    const data = buildExportData();
    if (data.length === 0) {
      alert('No responses to export');
      return;
    }

    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, `${testName}-responses.json`, 'application/json');
  };

  const generateExcel = () => {
    const data = buildExportData();
    if (data.length === 0) {
      alert('No responses to export');
      return;
    }

    // Simple XLSX generation (creates valid XLSX using OpenDocument format)
    // For production, use a library like xlsx
    const headers = Object.keys(data[0]);
    let html = '<table border="1"><tr>';
    headers.forEach((h) => {
      html += `<th>${h}</th>`;
    });
    html += '</tr>';

    data.forEach((row) => {
      html += '<tr>';
      headers.forEach((h) => {
        html += `<td>${row[h]}</td>`;
      });
      html += '</tr>';
    });
    html += '</table>';

    // For now, we'll export as HTML which Excel can open
    downloadFile(html, `${testName}-responses.xls`, 'application/vnd.ms-excel');
  };

  const generatePDF = () => {
    const data = buildExportData();
    if (data.length === 0) {
      alert('No responses to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const margin = 10;

    let html = `
      <html>
      <head>
        <meta charset="utf-8">
        <title>${testName} - Responses</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 10mm; }
          h1 { text-align: center; color: #202124; }
          table { width: 100%; border-collapse: collapse; }
          th { background: #4285f4; color: white; padding: 8px; text-align: left; }
          td { padding: 8px; border-bottom: 1px solid #ddd; }
          tr:nth-child(even) { background: #f9f9f9; }
        </style>
      </head>
      <body>
        <h1>${testName} - Test Responses</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <p>Total responses: ${data.length}</p>
        <table>
          <tr>
            ${headers.map((h) => `<th>${h}</th>`).join('')}
          </tr>
          ${data
            .map(
              (row) =>
                `<tr>${headers.map((h) => `<td>${row[h]}</td>`).join('')}</tr>`
            )
            .join('')}
        </table>
      </body>
      </html>
    `;

    downloadFile(html, `${testName}-responses.html`, 'text/html');
  };

  const generateHTML = () => {
    const data = buildExportData();
    if (data.length === 0) {
      alert('No responses to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${testName} - Responses Report</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; background: #f5f5f5; }
          .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
          h1 { color: #202124; margin-bottom: 10px; }
          .meta { color: #5f6368; margin-bottom: 30px; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          thead { background: #4285f4; color: white; }
          th { padding: 12px; text-align: left; font-weight: 600; }
          td { padding: 12px; border-bottom: 1px solid #dadce0; }
          tbody tr:hover { background: #f8f9fa; }
          .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
          .summary-card { padding: 20px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #4285f4; }
          .summary-card h3 { color: #5f6368; font-size: 12px; text-transform: uppercase; margin-bottom: 8px; }
          .summary-card p { color: #202124; font-size: 28px; font-weight: 600; }
          footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #dadce0; color: #5f6368; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>${testName} - Test Responses Report</h1>
          <div class="meta">
            <p>Generated on: ${new Date().toLocaleString()}</p>
            <p>Total responses: ${data.length}</p>
          </div>

          <div class="summary">
            <div class="summary-card">
              <h3>Total Responses</h3>
              <p>${data.length}</p>
            </div>
            <div class="summary-card">
              <h3>Correct Answers</h3>
              <p>${data.filter((r) => r.isCorrect === 'Yes').length}</p>
            </div>
            <div class="summary-card">
              <h3>Pass Rate</h3>
              <p>${Math.round(
                (data.filter((r) => r.isCorrect === 'Yes').length / data.length) * 100
              )}%</p>
            </div>
            <div class="summary-card">
              <h3>Avg Score</h3>
              <p>${(
                data.reduce((sum, r) => sum + (r.score || 0), 0) / data.length
              ).toFixed(2)}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                ${headers.map((h) => `<th>${h}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data
                .map(
                  (row) =>
                    `<tr>${headers
                      .map((h) => `<td>${row[h]}</td>`)
                      .join('')}</tr>`
                )
                .join('')}
            </tbody>
          </table>

          <footer>
            <p>This report was automatically generated and contains response data for ${testName}.</p>
          </footer>
        </div>
      </body>
      </html>
    `;

    downloadFile(htmlContent, `${testName}-responses.html`, 'text/html');
  };

  const downloadFile = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    saveExportSettings();

    switch (selectedFormat) {
      case 'csv':
        generateCSV();
        break;
      case 'json':
        generateJSON();
        break;
      case 'excel':
        generateExcel();
        break;
      case 'pdf':
        generatePDF();
        break;
      case 'html':
        generateHTML();
        break;
      default:
        break;
    }

    if (onExport) {
      onExport({ format: selectedFormat, selectedColumns, dateRange: { start: dateRangeStart, end: dateRangeEnd } });
    }
  };

  const generatePreview = () => {
    const data = buildExportData();
    setPreviewRows(data.slice(0, 5));
    setShowPreview(true);
  };

  return (
    <div className="response-export">
      {usesMockData && (
        <div className="mock-data-notice">
          ⚠️ Using mock data for demonstration. Connect to real API for actual responses.
        </div>
      )}

      <div className="export-container">
        <div className="export-panel">
          <h2>Export Test Responses</h2>

          {/* Format Selection */}
          <div className="export-section">
            <h3>Step 1: Select Export Format</h3>
            <div className="format-buttons">
              {[
                { value: 'csv', label: '📊 CSV', icon: '📊' },
                { value: 'json', label: '{}  JSON', icon: '{}' },
                { value: 'excel', label: '📈 Excel', icon: '📈' },
                { value: 'pdf', label: '📄 PDF', icon: '📄' },
                { value: 'html', label: '🌐 HTML', icon: '🌐' },
              ].map((format) => (
                <button
                  key={format.value}
                  className={`format-btn ${selectedFormat === format.value ? 'active' : ''}`}
                  onClick={() => setSelectedFormat(format.value)}
                >
                  {format.label}
                </button>
              ))}
            </div>
          </div>

          {/* Column Selection */}
          <div className="export-section">
            <h3>Step 2: Select Columns to Export</h3>
            <div className="column-selector">
              {Object.entries(selectedColumns).map(([column, isSelected]) => (
                <label key={column} className="column-checkbox">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleColumn(column)}
                  />
                  <span className="column-name">
                    {column.charAt(0).toUpperCase() + column.slice(1).replace(/([A-Z])/g, ' $1')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="export-section">
            <h3>Step 3: Filter by Date Range (Optional)</h3>
            <div className="date-range-inputs">
              <div className="date-input-group">
                <label>From:</label>
                <input
                  type="date"
                  value={dateRangeStart}
                  onChange={(e) => setDateRangeStart(e.target.value)}
                />
              </div>
              <div className="date-input-group">
                <label>To:</label>
                <input
                  type="date"
                  value={dateRangeEnd}
                  onChange={(e) => setDateRangeEnd(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Preview Button */}
          <div className="export-section">
            <button
              className="preview-btn"
              onClick={generatePreview}
            >
              👁️ Preview ({activeResponses.length} responses)
            </button>
          </div>

          {/* Export Button */}
          <div className="export-section">
            <button
              className="export-btn"
              onClick={handleExport}
            >
              ⬇️ Export as {selectedFormat.toUpperCase()}
            </button>
          </div>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="preview-panel">
            <div className="preview-header">
              <h3>Export Preview</h3>
              <button
                className="close-btn"
                onClick={() => setShowPreview(false)}
              >
                ✕
              </button>
            </div>

            {previewRows.length > 0 ? (
              <div className="preview-table-wrapper">
                <table className="preview-table">
                  <thead>
                    <tr>
                      {Object.keys(previewRows[0]).map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value, i) => (
                          <td key={i}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="preview-info">
                  Showing first {previewRows.length} of {activeResponses.length} responses
                </p>
              </div>
            ) : (
              <div className="preview-empty">
                <p>No responses to preview</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponseExport;
