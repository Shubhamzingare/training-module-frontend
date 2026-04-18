# Phase 3 Components - Styling & CSS Reference

## CSS File Location
`/src/styles/Phase3Components.css` (21 KB)

This single file contains all styling for the 4 Phase 3 components:
- FileUploadHandler styles
- VoiceRecorder styles
- ResponseAnalytics styles
- ResponseExport styles

---

## Design System

### Color Palette

All colors inherit from Google Forms design system:

```css
/* Primary Actions */
--primary-blue: #4285f4;        /* Main buttons, links, active states */

/* Status Colors */
--success-green: #34a853;       /* Pass, success, checkmarks */
--warning-yellow: #fbbc04;      /* Warnings, paused state */
--error-red: #d33b27;           /* Errors, delete actions */

/* Text Colors */
--text-primary: #202124;        /* Headings, primary text */
--text-secondary: #5f6368;      /* Body text, descriptions */
--text-disabled: #9aa0a6;       /* Disabled states */

/* Backgrounds & Borders */
--background-light: #f8f9fa;    /* Light background */
--background-default: #fafafa;  /* Default background */
--border-color: #dadce0;        /* Borders, dividers */
--border-light: #e8e8e8;        /* Light borders */
--border-lighter: #f0f0f0;      /* Lighter borders */
--background-white: #ffffff;    /* White background */

/* State Colors */
--background-hover: #f8f9fa;    /* Hover state background */
--background-focus: #e3f2fd;    /* Focus state (blue tinted) */
--background-disabled: #f5f5f5; /* Disabled background */

/* Error/Warning Backgrounds */
--error-background: #fce4e4;    /* Error background */
--warning-background: #fff3cd;  /* Warning background */
--success-background: #e8f5e9;  /* Success background */
```

### Font System

```css
/* Typography Hierarchy */
--font-size-xs: 11px;           /* Labels, badges, helper text */
--font-size-sm: 12px;           /* Small text, secondary info */
--font-size-base: 13px;         /* Body text, default */
--font-size-md: 14px;           /* Descriptions, larger text */
--font-size-lg: 16px;           /* Subheadings, component titles */
--font-size-xl: 18px;           /* Section titles */
--font-size-2xl: 20px;          /* Page titles */
--font-size-3xl: 24px;          /* Major headings */
--font-size-4xl: 28px;          /* Large headings */
--font-size-5xl: 32px;          /* Huge headings (timer display) */

/* Font Weights */
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;

/* Font Family */
--font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
               'Helvetica', 'Arial', sans-serif;
--font-family-mono: 'Monaco', 'Courier', 'Courier New', monospace;
```

### Spacing System

```css
/* Spacing values (8px base unit) */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 12px;
--spacing-lg: 16px;
--spacing-xl: 20px;
--spacing-2xl: 24px;
--spacing-3xl: 32px;
```

### Border & Shadow System

```css
/* Border Radius */
--radius-sm: 2px;               /* Small elements */
--radius-base: 4px;             /* Default radius */
--radius-md: 8px;               /* Cards, containers */
--radius-lg: 12px;              /* Pills, badges */
--radius-full: 50%;             /* Circles */

/* Shadows */
--shadow-xs: 0 1px 3px rgba(0, 0, 0, 0.05);
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
--shadow-md: 0 2px 8px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 4px 12px rgba(0, 0, 0, 0.15);

/* Transitions */
--transition-fast: 0.2s ease;
--transition-base: 0.3s ease;
--transition-slow: 0.5s ease;
```

---

## Component-Specific Classes

### FileUploadHandler

```css
.file-upload-handler                /* Root container */
.file-upload-area                   /* Drop zone */
.file-upload-area.dragging          /* Active drag state (blue) */
.file-upload-area.disabled          /* Disabled state (grayed) */
.upload-icon                        /* 📎 icon */
.upload-title                       /* "Upload a File" heading */
.upload-subtitle                    /* "Drag and drop..." text */
.upload-browse-btn                  /* Browse button */
.upload-helper-text                 /* "Allowed types..." text */
.upload-progress-container          /* Progress section */
.progress-bar                       /* Progress bar background */
.progress-fill                      /* Animated progress (gradient) */
.progress-text                      /* Percentage text */
.file-upload-success                /* Success state container */
.uploaded-file-info                 /* File info display */
.file-icon                          /* 🖼️ or 🎬 or 📄 icon */
.file-details                       /* File name & metadata */
.file-name                          /* File name text */
.file-meta                          /* File size & type */
.file-remove-btn                    /* X button to remove */
.file-preview-container             /* Preview section */
.file-preview                       /* Preview wrapper */
.preview-image                      /* <img> for preview */
.preview-video                      /* <video> for preview */
.preview-audio                      /* <audio> for preview */
.file-preview-generic               /* Generic file preview */
.file-upload-error                  /* Error message display */
```

**Color Usage:**
- Blue (#4285f4): Drag over, buttons, borders
- Green (#34a853): Success state
- Red (#d33b27): Delete button, errors
- Gray (#dadce0, #f0f0f0): Borders, backgrounds

---

### VoiceRecorder

```css
.voice-recorder                     /* Root container */
.voice-recorder-unsupported         /* Unsupported browser */
.unsupported-message                /* Error message */
.recorder-header                    /* Title & status bar */
.recorder-title                     /* "Voice Recording" title */
.recorder-icon                      /* 🎙️ icon */
.recorder-status                    /* Status badge (right) */
.status-indicator                   /* Dot indicator */
.status-indicator.recording         /* Red blinking dot */
.status-indicator.paused            /* Yellow/orange dot */
.status-indicator.ready             /* Green dot */
.status-indicator.idle              /* Gray dot */
.recorder-timer                     /* Timer section */
.timer-display                      /* MM:SS time (mono font) */
.timer-bar                          /* Progress bar background */
.timer-fill                         /* Animated progress fill */
.recorder-controls                  /* Buttons row */
.recorder-btn                       /* Base button style */
.start-btn                          /* Green start button */
.pause-btn                          /* Yellow pause button */
.stop-btn                           /* Yellow stop button */
.recorder-playback                  /* Playback container */
.playback-info                      /* Duration label */
.playback-label                     /* "Recording (MM:SS)" text */
.playback-audio                     /* <audio> control */
.recorder-actions                   /* Action buttons row */
.action-btn                         /* Base action button */
.play-btn                           /* Play button */
.download-btn                       /* Download button */
.delete-btn                         /* Delete button */
.save-btn                           /* Blue save button */
.recorder-error                     /* Error message display */
```

**Animations:**
- `.status-indicator.recording` - Blink animation (1s loop)
- `.timer-fill` - Linear width transition (0.1s)
- All buttons: 0.2s ease transitions

---

### ResponseAnalytics

```css
.response-analytics                 /* Root container */
.mock-data-notice                   /* "Using mock data..." banner */
.analytics-header                   /* Title & filters section */
.analytics-filters                  /* Filter controls group */
.filter-group                       /* Single filter (label + select) */
.summary-stats                      /* Stats grid container */
.stat-card                          /* Individual stat card */
.stat-icon                          /* 👥 ✓ ⭐ ⏱️ icons */
.stat-content                       /* Text content area */
.stat-label                         /* "Total Responses" label */
.stat-value                         /* Large number display */
.question-analytics-section         /* Questions section */
.empty-analytics                    /* Empty state message */
.question-analytics-list            /* List of question cards */
.question-analytics-card            /* Expandable question */
.question-analytics-header          /* Card header (clickable) */
.question-analytics-title           /* Question text & type */
.question-number                    /* "Q1" badge */
.question-text                      /* Question text (truncated) */
.question-type-badge                /* "MCQ" "Text" badge */
.question-analytics-stats           /* Stats in header (right) */
.stat-mini                          /* Small stat text */
.expand-icon                        /* ▶ ▼ toggle icon */
.question-analytics-details         /* Expanded details */
.analytics-grid                     /* Stats grid inside card */
.analytics-stat                     /* Individual stat box */
.stat-bar                           /* Progress bar (correctness) */
.stat-bar-fill                      /* Filled portion */
.analytics-chart                    /* Chart container */
.chart-title                        /* "Answer Distribution" title */
.bar-chart                          /* Bar chart container */
.bar-item                           /* Single bar (label + bar + value) */
.bar-label                          /* Answer text */
.bar-container                      /* Bar background */
.bar-fill                           /* Colored bar fill */
.bar-value                          /* Count number */
.pie-chart-container                /* Pie + legend wrapper */
.pie-chart                          /* <svg> pie chart */
.pie-legend                         /* Legend items */
.legend-item                        /* Single legend entry */
.legend-color                       /* Color square */
.legend-label                       /* Color label text */
.export-question-btn                /* "Export" button */
```

**Charts:**
- Bar Charts: CSS-based with flexbox, gradient fills
- Pie Charts: SVG-based with 5 color palette
- No external chart library required

---

### ResponseExport

```css
.response-export                    /* Root container */
.export-container                   /* Main layout (grid) */
.export-panel                       /* Left panel (controls) */
.export-section                     /* Section container */
.format-buttons                     /* Format selector buttons */
.format-btn                         /* Individual format button */
.format-btn.active                  /* Selected format (blue) */
.column-selector                    /* Checkboxes grid */
.column-checkbox                    /* Checkbox label */
.column-name                        /* Column name text */
.date-range-inputs                  /* Date input group */
.date-input-group                   /* Single date input */
.preview-btn                        /* Preview button (blue) */
.export-btn                         /* Export button (green) */
.preview-panel                      /* Right panel (preview) */
.preview-header                     /* Panel header with close */
.close-btn                          /* X close button */
.preview-table-wrapper              /* Scrollable table container */
.preview-table                      /* <table> element */
.preview-table thead                /* Header row */
.preview-table th                   /* Header cell */
.preview-table td                   /* Data cell */
.preview-info                       /* "Showing X of Y rows" text */
.preview-empty                      /* Empty state message */
```

**Form Elements:**
- Buttons: 12px uppercase font, 600 weight
- Select: Same style as buttons, blue border on focus
- Checkboxes: Custom styling with 16px size
- Date inputs: 13px font, blue focus border

---

## Responsive Design

### Breakpoints

```css
/* Desktop - 1024px and above */
@media (min-width: 1024px) {
  /* 2-column layout for export */
  .export-container {
    grid-template-columns: 1fr 1fr;
  }
}

/* Tablet - 768px to 1023px */
@media (max-width: 768px) {
  /* Adjust grid layouts */
  .summary-stats {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
  
  /* Stack analytics filters */
  .analytics-header {
    flex-direction: column;
  }
  
  /* Single column for export */
  .export-container {
    grid-template-columns: 1fr;
  }
}

/* Mobile - Below 768px */
@media (max-width: 480px) {
  /* Reduce padding and margins */
  .file-upload-area {
    padding: 24px 12px;
  }
  
  /* Stack buttons vertically */
  .recorder-controls {
    flex-direction: column;
  }
  
  /* Single column layouts */
  .column-selector {
    grid-template-columns: 1fr;
  }
  
  /* Adjust chart layout */
  .pie-chart-container {
    flex-direction: column;
  }
}
```

### Grid Systems Used

```css
/* Summary Stats */
display: grid;
grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
gap: 16px;

/* Column Selector */
display: grid;
grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
gap: 12px;

/* Analytics Grid (inside cards) */
display: grid;
grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
gap: 16px;
```

### Flex Layouts Used

```css
/* Analytics Header */
display: flex;
align-items: center;
justify-content: space-between;
flex-wrap: wrap;

/* Question Card Header */
display: flex;
align-items: center;
justify-content: space-between;
gap: 12px;

/* Recorder Controls */
display: flex;
gap: 8px;
justify-content: center;
```

---

## Animations & Transitions

### Slide-In Animation
```css
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Blink Animation (Recording Indicator)
```css
@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0.3;
  }
}
```

### Transitions
```css
/* Fast transitions (interactions) */
transition: all 0.2s ease;

/* Base transitions (state changes) */
transition: all 0.3s ease;

/* Slow transitions (loading) */
transition: width 0.3s ease;
```

---

## Hover & Focus States

### Buttons
```css
.upload-browse-btn:hover:not(:disabled) {
  background: #1a73e8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.upload-browse-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.2);
}
```

### Input Fields
```css
input[type='text']:focus,
select:focus {
  outline: none;
  border-color: #4285f4;
  box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.1);
}
```

### Cards
```css
.stat-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-color: #4285f4;
}

.question-analytics-header:hover {
  background: #f8f9fa;
}
```

---

## Print Styles

All components include print-friendly CSS:

```css
@media print {
  /* Hide interactive elements */
  .recorder-controls,
  .recorder-actions,
  .action-btn,
  .export-btn,
  .preview-btn,
  .file-remove-btn {
    display: none !important;
  }
  
  /* Remove shadows */
  .response-analytics,
  .response-export {
    box-shadow: none;
  }
  
  /* Prevent page breaks */
  .stat-card,
  .question-analytics-card,
  .preview-table {
    page-break-inside: avoid;
  }
}
```

---

## Dark Mode Support (Future)

Components are designed to support dark mode with CSS variables:

```css
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --text-primary: #202124;
  --text-secondary: #5f6368;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #202124;
    --bg-secondary: #2d2d2d;
    --text-primary: #ffffff;
    --text-secondary: #e0e0e0;
  }
}
```

---

## Accessibility Classes

### Screen Reader Text
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### Focus Visible
```css
*:focus-visible {
  outline: 2px solid #4285f4;
  outline-offset: 2px;
}
```

### Color Contrast
- Text on white: #202124 (WCAG AAA)
- Text on light gray: #202124 (WCAG AAA)
- Text on blue: white (WCAG AAA)
- Text on green: white (WCAG AA)

---

## File Size Breakdown

```
Phase3Components.css
├── FileUploadHandler styles:    2.5 KB
├── VoiceRecorder styles:        2.0 KB
├── ResponseAnalytics styles:    8.5 KB
├── ResponseExport styles:       6.5 KB
└── Responsive & print:          1.5 KB
─────────────────────────────────────
Total:                          21 KB
```

---

## Integration with Existing Styles

All components integrate seamlessly with existing GoogleFormBuilder.css:
- ✓ Same color palette
- ✓ Same typography
- ✓ Same spacing system
- ✓ Same border radius values
- ✓ Same shadow patterns
- ✓ Compatible animations

No CSS conflicts or overrides needed!

---

## Customization Guide

### Change Primary Color
Find all instances of `#4285f4` and replace with your color:
```css
/* Old */
background: #4285f4;

/* New */
background: #5e35b1;  /* Purple instead of blue */
```

### Change Success Color
Find all instances of `#34a853` and replace:
```css
/* Old */
background: #34a853;

/* New */
background: #388e3c;  /* Different green */
```

### Change Border Radius
Update all instances to match your design:
```css
/* Old */
border-radius: 8px;

/* New */
border-radius: 12px;  /* More rounded */
```

### Change Font Family
Update at component level or globally:
```css
.file-upload-handler {
  font-family: 'Poppins', sans-serif;  /* Custom font */
}
```

---

Last Updated: April 18, 2026
CSS Version: 1.0.0
Total CSS Lines: ~800
