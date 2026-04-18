# Phase 3 Components - Quick Start Guide

## 1-Minute Overview

Four new components for test responses and analytics:
- **FileUploadHandler** → Upload files in responses
- **VoiceRecorder** → Record audio answers
- **ResponseAnalytics** → View analytics dashboard
- **ResponseExport** → Export responses (CSV, JSON, Excel, PDF, HTML)

All components use mock data by default - easy to test!

---

## Quick Import Template

```javascript
import FileUploadHandler from './components/admin/FileUploadHandler';
import VoiceRecorder from './components/admin/VoiceRecorder';
import ResponseAnalytics from './components/admin/ResponseAnalytics';
import ResponseExport from './components/admin/ResponseExport';
```

---

## Component Quick Reference

### FileUploadHandler
**For:** Question responses that need file uploads

**Basic Usage:**
```javascript
<FileUploadHandler 
  onUploadComplete={(data) => console.log(data)}
  maxFileSize={50}
  allowedFileTypes={['pdf', 'doc', 'docx', 'jpg', 'png']}
/>
```

**Returns:**
```javascript
{
  file: File,
  fileName: "document.pdf",
  fileSize: 245000,
  fileType: "pdf",
  uploadProgress: 100,
  uploadedUrl: "blob:..."
}
```

---

### VoiceRecorder
**For:** Question responses that need audio answers

**Basic Usage:**
```javascript
<VoiceRecorder 
  onRecordingComplete={(data) => console.log(data)}
  maxRecordingDuration={300}
/>
```

**Returns:**
```javascript
{
  audioBlob: Blob,
  audioDuration: 45,
  audioUrl: "blob:..."
}
```

**Browser Support:**
- ✓ Chrome 49+
- ✓ Firefox 25+
- ✓ Safari 14.1+
- ✓ Edge 79+
- ✗ IE 11 (shows error message)

---

### ResponseAnalytics
**For:** Admin dashboard to view test analytics

**Basic Usage:**
```javascript
<ResponseAnalytics 
  responses={responsesArray}
  questions={questionsArray}
  usesMockData={true}  // Set to false for real data
/>
```

**Features:**
- Summary stats (Total, Pass rate, Avg score, Avg time)
- Question-wise breakdown with charts
- Expandable details per question
- Date range & question type filters
- Built-in charts (no libraries needed!)

---

### ResponseExport
**For:** Admin dashboard to export responses

**Basic Usage:**
```javascript
<ResponseExport 
  responses={responsesArray}
  questions={questionsArray}
  testName="JavaScript Test"
  onExport={(settings) => console.log(settings)}
  usesMockData={true}
/>
```

**Export Formats:**
- 📊 CSV (Excel compatible)
- {} JSON (pretty-printed)
- 📈 Excel (.xls)
- 📄 PDF (print-to-PDF)
- 🌐 HTML (styled table)

**Features:**
- Select which columns to export
- Filter by date range
- Preview before export
- Save settings to localStorage

---

## CSS Classes Cheat Sheet

```css
/* File Upload */
.file-upload-area.dragging { /* Drag over state */ }
.progress-bar { /* Upload progress bar */ }

/* Voice Recorder */
.status-indicator.recording { /* Red blinking dot */ }
.recorder-timer { /* MM:SS display */ }

/* Analytics */
.summary-stats { /* 4 stat cards grid */ }
.question-analytics-card { /* Expandable question */ }
.bar-chart { /* Answer distribution */ }
.pie-chart { /* MCQ results */ }

/* Export */
.format-buttons { /* CSV, JSON, Excel, PDF, HTML */ }
.column-selector { /* Checkboxes for columns */ }
.preview-table { /* Data preview */ }
```

---

## Common Integration Points

### In TestTakingInterface (for responses)
```javascript
import FileUploadHandler from './components/admin/FileUploadHandler';
import VoiceRecorder from './components/admin/VoiceRecorder';

// In your question response section:
{question.type === 'fileUpload' && (
  <FileUploadHandler onUploadComplete={handleUpload} />
)}

{question.type === 'voiceResponse' && (
  <VoiceRecorder onRecordingComplete={handleAudio} />
)}
```

### In AdminDashboard (for analytics)
```javascript
import ResponseAnalytics from './components/admin/ResponseAnalytics';

<ResponseAnalytics 
  responses={fetchedResponses}
  questions={fetchedQuestions}
  usesMockData={false}
/>
```

### In AdminDashboard (for export)
```javascript
import ResponseExport from './components/admin/ResponseExport';

<ResponseExport 
  responses={fetchedResponses}
  testName="Test Name"
  usesMockData={false}
/>
```

---

## Testing with Mock Data

All components come with built-in mock data! 

**Enable mock data:**
```javascript
// ResponseAnalytics
<ResponseAnalytics usesMockData={true} />

// ResponseExport
<ResponseExport usesMockData={true} />
```

This is perfect for:
- ✓ UI/UX testing without backend
- ✓ Component behavior testing
- ✓ Design verification
- ✓ Demo purposes

---

## API Integration Checklist

### FileUploadHandler
- [ ] Add endpoint: `POST /api/upload-file`
- [ ] Handle multipart form data
- [ ] Return URL of uploaded file
- [ ] Store file metadata

### VoiceRecorder
- [ ] Add endpoint: `POST /api/upload-audio`
- [ ] Handle audio blob upload
- [ ] Convert WebM to desired format (optional)
- [ ] Return audio URL

### ResponseAnalytics
- [ ] Add endpoint: `GET /api/responses/:testId`
- [ ] Return responses with correctness data
- [ ] Add endpoint: `GET /api/questions/:testId`
- [ ] Filter by date range in endpoint

### ResponseExport
- [ ] No new endpoints needed!
- [ ] Uses existing response data
- [ ] All export happens client-side
- [ ] Optional: Add audit logging for exports

---

## Design Colors (Already Matched)

All components use the same Google Forms style colors:

```css
--primary-blue: #4285f4;      /* Main actions */
--success-green: #34a853;     /* Pass/success */
--warning-yellow: #fbbc04;    /* Warnings */
--error-red: #d33b27;         /* Errors */
--text-dark: #202124;         /* Headers */
--text-light: #5f6368;        /* Body text */
--border: #dadce0;            /* Borders */
--background: #f8f9fa;        /* Light bg */
```

No CSS changes needed - components match existing design!

---

## File Structure

```
src/
├── components/admin/
│   ├── FileUploadHandler.js          (8.7 KB)
│   ├── VoiceRecorder.js              (10 KB)
│   ├── ResponseAnalytics.js          (15 KB)
│   └── ResponseExport.js             (16 KB)
└── styles/
    └── Phase3Components.css          (21 KB)
```

**Total:** 70.7 KB (includes complete styling & no dependencies!)

---

## Browser Compatibility at a Glance

| Feature | Chrome | Firefox | Safari | Edge | IE11 |
|---------|--------|---------|--------|------|------|
| File Upload | ✓ | ✓ | ✓ | ✓ | ⚠️ |
| Voice Recording | ✓ | ✓ | ✓ | ✓ | ✗ |
| Analytics | ✓ | ✓ | ✓ | ✓ | ✓ |
| Export | ✓ | ✓ | ✓ | ✓ | ✓ |

⚠️ = Works without drag & drop
✗ = Shows friendly error message

---

## Troubleshooting

**VoiceRecorder shows "not supported"**
- Normal on IE11
- Check Chrome/Firefox/Safari/Edge
- Check if browser is updated

**File preview not showing**
- Check allowed file types include the extension
- Verify file size is under maxFileSize
- Check browser console for errors

**Analytics charts not appearing**
- Ensure response/question arrays are populated
- Check question IDs match between arrays
- Verify data structure matches expected format

**Export not working**
- Check if responses array is empty
- Verify at least one column is selected
- Check browser console for errors

---

## Next Steps

1. **Copy the 5 files to your project** ✓ Done!
2. **Import components where needed** (TestTakingInterface, AdminDashboard)
3. **Test with mock data first** (usesMockData={true})
4. **Connect to your backend API** (once tested)
5. **Deploy and monitor** 

---

## Support

For detailed information, see: `PHASE3_COMPONENTS_GUIDE.md`

For component-specific issues:
- FileUploadHandler: Check file types and sizes
- VoiceRecorder: Check browser support and permissions
- ResponseAnalytics: Check data structure and mock data
- ResponseExport: Check responses array and column selection

---

Happy Building! 🚀

Last Updated: April 18, 2026
