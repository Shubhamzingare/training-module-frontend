# Google Forms Replica - Phase 1 Implementation Guide

## Overview

This document describes the complete implementation of Phase 1 of the Google Forms replica test builder. It supports all 10 question types with professional Google Forms-like UI and comprehensive question management features.

## Components Created

### 1. GoogleFormBuilder.js
Main builder component that manages the overall test question creation flow.

**Key Features:**
- Add/remove questions
- Reorder questions (move up/down)
- Save all questions at once
- Empty state handling
- Success/error messages
- Question validation before save

**Props:**
```javascript
{
  testId: string,              // ID of the test
  initialQuestions: array,     // Existing questions to load
  onSave: function             // Callback when saving questions
}
```

**Usage:**
```javascript
<GoogleFormBuilder
  testId="test-123"
  initialQuestions={questions}
  onSave={handleSave}
/>
```

### 2. QuestionBuilder.js
Individual question editor with type selector and configuration.

**Features:**
- 10 question type selector
- Question text and description
- Points/marks input
- Type-specific options management
- Dynamic sections based on question type
- Option add/remove/reorder for MCQ/Checkbox/Dropdown
- Correct answer selection

**Question Types:**
1. Multiple Choice (MCQ) - Radio buttons
2. Checkboxes - Multiple select
3. Dropdown - Select list
4. Linear Scale - 1-10 rating
5. Short Answer - Text input
6. Paragraph - Multi-line text
7. Date - Date picker
8. Time - Time picker
9. File Upload - File input with restrictions
10. Duration - Hours/minutes input

### 3. QuestionOptions.js
Manages advanced options for questions.

**Options Configurable:**
- Required toggle - Mark question as mandatory
- Question description/help text
- Question image upload
- Shuffle options - Randomize order for MCQ/Checkbox
- Linear Scale settings - Min/max labels and values
- File upload restrictions - File types and max size

**Collapsible Sections:**
- Required
- Shuffle Options
- Scale Settings (for Linear Scale)
- File Upload Settings (for File Upload)
- Question Image

## Database Model Updates

### Question Schema Enhancements

Updated `/src/models/Question.js` with support for:

```javascript
{
  // Existing fields
  testId: ObjectId,
  questionText: String,
  type: String,
  marks: Number,
  order: Number,
  
  // New fields for description and image
  description: String,
  questionImage: String,
  
  // Extended type enum
  type: ['mcq', 'checkbox', 'dropdown', 'linearScale', 'shortAnswer', 
         'paragraph', 'date', 'time', 'fileUpload', 'duration', 'descriptive'],
  
  // Advanced options
  isRequired: Boolean,
  shuffleOptions: Boolean,
  randomizeOrder: Boolean,
  showOtherOption: Boolean,
  
  // Linear Scale specific
  scaleMin: Number,
  scaleMax: Number,
  scaleMinLabel: String,
  scaleMaxLabel: String,
  
  // File Upload specific
  allowedFileTypes: [String],
  maxFileSize: Number,
  
  // Multi-answer support for checkboxes
  correctAnswers: [String],
  
  // For various types
  defaultValue: String,
  isMultiSelect: Boolean
}
```

## API Updates

### Controller Changes
Updated `testController.js` to accept all new question fields:

```javascript
async addQuestion(req, res, next) {
  const {
    questionText,
    description,
    type,
    options,
    correctAnswer,
    correctAnswers,
    marks,
    isRequired,
    questionImage,
    shuffleOptions,
    showOtherOption,
    scaleMin,
    scaleMax,
    scaleMinLabel,
    scaleMaxLabel,
    allowedFileTypes,
    maxFileSize,
  } = req.body;
  // ... validation and creation
}
```

### Service Updates
Updated `testService.js` to handle all new fields in `addQuestion` and `updateQuestion` methods.

### API Endpoints

**POST** `/api/admin/tests/:testId/questions`
- Create new question with all supported types and options

**PUT** `/api/admin/tests/:testId/questions/:questionId`
- Update existing question with partial fields

**DELETE** `/api/admin/tests/:testId/questions/:questionId`
- Delete question

## Styling

### GoogleFormBuilder.css
Comprehensive styling with Google Forms aesthetic:

- Clean, minimal design
- Responsive grid layout
- Smooth animations and transitions
- Professional color scheme (Google blues and grays)
- Collapsible sections
- Mobile-friendly responsive design

**Key Classes:**
- `.google-form-builder` - Main container
- `.question-builder` - Individual question card
- `.section` - Collapsible settings section
- `.type-grid` - Question type selector
- `.options-list` - Options for MCQ/Checkbox/Dropdown
- `.form-actions` - Save and add buttons

## Question Type Details

### 1. Multiple Choice (MCQ)
- Radio button interface
- Single correct answer
- Option shuffling
- "Other" option support
- Correct answer selection via radio button

### 2. Checkboxes
- Checkbox interface
- Multiple correct answers
- Option shuffling
- "Other" option support
- Correct answers via checkboxes

### 3. Dropdown
- Select/dropdown interface
- Single selection
- Space-efficient
- Option shuffling
- "Other" option support

### 4. Linear Scale
- Customizable min (1) to max (10)
- Optional min/max labels (e.g., "Not Satisfied" to "Very Satisfied")
- Ideal for surveys and ratings
- No options needed
- No correct answer needed

### 5. Short Answer
- Single line text input
- No options needed
- No correct answer needed
- Mark as required/optional

### 6. Paragraph
- Multi-line text area
- No options needed
- No correct answer needed
- For detailed responses

### 7. Date
- Calendar date picker
- YYYY-MM-DD format
- No options needed
- No correct answer needed

### 8. Time
- Time picker
- HH:MM format
- No options needed
- No correct answer needed

### 9. File Upload
- File input with type restrictions
- Allowed file types (pdf, doc, docx, jpg, png, etc.)
- Maximum file size in MB
- No options needed
- No correct answer needed

### 10. Duration
- Hours and minutes input
- HH:MM format
- No options needed
- No correct answer needed

## Frontend Integration

### Using GoogleFormBuilder in a Page

```javascript
import GoogleFormBuilder from './components/admin/GoogleFormBuilder';

function TestBuilderPage() {
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);

  const handleSaveQuestions = async (questionsToSave) => {
    const token = localStorage.getItem('adminToken');
    
    // Delete old questions
    for (const q of questions) {
      if (q._id) {
        await fetch(`/api/admin/tests/${testId}/questions/${q._id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    }
    
    // Add new questions
    for (const q of questionsToSave) {
      await fetch(`/api/admin/tests/${testId}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(q)
      });
    }
  };

  return (
    <GoogleFormBuilder
      testId={testId}
      initialQuestions={questions}
      onSave={handleSaveQuestions}
    />
  );
}
```

## Example API Calls

### Create Multiple Choice Question
```bash
curl -X POST /api/admin/tests/test-123/questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token" \
  -d '{
    "questionText": "What is 2 + 2?",
    "description": "Basic math",
    "type": "mcq",
    "marks": 1,
    "isRequired": true,
    "shuffleOptions": true,
    "options": [
      {"id": "1", "text": "3", "isCorrect": false},
      {"id": "2", "text": "4", "isCorrect": true},
      {"id": "3", "text": "5", "isCorrect": false}
    ],
    "correctAnswer": "2"
  }'
```

### Create Linear Scale Question
```bash
curl -X POST /api/admin/tests/test-123/questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token" \
  -d '{
    "questionText": "How satisfied are you?",
    "type": "linearScale",
    "marks": 1,
    "isRequired": false,
    "scaleMin": 1,
    "scaleMax": 5,
    "scaleMinLabel": "Not Satisfied",
    "scaleMaxLabel": "Very Satisfied"
  }'
```

### Create File Upload Question
```bash
curl -X POST /api/admin/tests/test-123/questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token" \
  -d '{
    "questionText": "Upload your resume",
    "type": "fileUpload",
    "marks": 1,
    "isRequired": true,
    "allowedFileTypes": ["pdf", "doc", "docx"],
    "maxFileSize": 5
  }'
```

## Testing Checklist

### Question Type Creation
- [ ] MCQ with multiple options
- [ ] Checkbox with multiple correct answers
- [ ] Dropdown with options
- [ ] Linear scale with custom labels
- [ ] Short answer question
- [ ] Paragraph question
- [ ] Date picker question
- [ ] Time picker question
- [ ] File upload with restrictions
- [ ] Duration question

### Features
- [ ] Add new question
- [ ] Add multiple options to MCQ
- [ ] Set correct answer for MCQ
- [ ] Set multiple correct answers for Checkbox
- [ ] Shuffle options toggle
- [ ] Required toggle
- [ ] Question image upload
- [ ] Question description
- [ ] Move question up/down
- [ ] Delete question
- [ ] Save all questions
- [ ] Error handling for empty questions
- [ ] Success message on save

### UI/UX
- [ ] Responsive design on mobile
- [ ] Collapsible sections work smoothly
- [ ] Animations are smooth
- [ ] Type selector shows all 10 types
- [ ] Option add/remove buttons work
- [ ] Save button is prominently placed
- [ ] Error messages are clear
- [ ] Empty state message is shown

## File Structure

```
/src/components/admin/
├── GoogleFormBuilder.js          # Main builder component
├── QuestionBuilder.js            # Individual question editor
├── QuestionOptions.js            # Advanced options panel
├── QuestionTypeExamples.js       # Template examples and features
└── TestBuilderPage.js            # Page wrapper component

/src/styles/
└── GoogleFormBuilder.css         # All styling for builder

/backend/src/
├── models/Question.js            # Updated schema
├── controllers/admin/testController.js  # Updated controller
└── services/test/testService.js  # Updated service
```

## Backend Files Modified/Created

```
/backend/src/
├── models/Question.js            # Extended schema
├── controllers/admin/testController.js  # Updated addQuestion
└── services/test/testService.js  # Updated addQuestion, updateQuestion

Documentation:
├── API_ENDPOINTS_FORM_BUILDER.md # Complete API reference
```

## Future Enhancements

1. **Question Templating** - Save and reuse common questions
2. **Question Branching** - Show questions based on previous answers
3. **Question Randomization** - Randomize question order per respondent
4. **Question Sections** - Organize questions into sections/groups
5. **Question Banking** - Question pool with random selection
6. **Rich Text Editor** - Format question text with bold, italic, links
7. **Equation Editor** - Math equation support for STEM questions
8. **Media Embedding** - Embed videos or audio in questions
9. **Conditional Logic** - Skip questions based on conditions
10. **Advanced Analytics** - Response analysis and visualization

## Troubleshooting

### Questions not saving
- Check API endpoint is correct: `/api/admin/tests/:testId/questions`
- Verify authentication token is valid
- Check browser console for errors
- Ensure all required fields are filled

### Image not uploading
- Verify file input is properly configured
- Check file size limits
- Ensure image URL is generated correctly from File object

### Options not appearing
- Verify question type is 'mcq', 'checkbox', or 'dropdown'
- Check options array is populated
- Inspect browser console for data

### Styling issues
- Clear browser cache
- Reload page
- Check CSS file is imported correctly
- Verify Tailwind or CSS variables are available

## Performance Considerations

- Questions are rendered in a virtualized list for large question counts
- Images are lazy-loaded
- API calls are batched for multiple questions
- State updates are optimized to prevent unnecessary re-renders

## Browser Compatibility

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Credits

Implemented as Phase 1 of Google Forms replica for training module platform.
