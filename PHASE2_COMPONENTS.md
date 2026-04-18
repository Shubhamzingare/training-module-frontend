# Phase 2 Frontend Components Documentation

## Overview
This document provides comprehensive integration details for the 4 new Phase 2 components that extend the Google Forms builder with advanced features.

---

## 1. AdvancedQuestionOptions.js

### Location
`/src/components/admin/AdvancedQuestionOptions.js`

### Purpose
Provides advanced options for individual questions including answer keys, feedback, and validation rules.

### Props Interface
```javascript
{
  question: {
    id: string,
    questionText: string,
    type: string,
    // ... other question fields
    answerKey?: string,           // Explanation of correct answer
    feedback?: string,            // Feedback shown to respondents
    validation?: ValidationConfig // See data structure below
  },
  onUpdate: (updatedQuestion) => void  // Callback to update question
}
```

### Data Structure (Exported via onUpdate)
```javascript
question: {
  // ... existing fields ...
  answerKey: string,  // Optional explanation
  feedback: string,   // Optional feedback text
  validation: {
    type: 'email' | 'number' | 'url' | 'regex' | 'text' | 'file' | '',
    // For number type:
    minValue: number | null,
    maxValue: number | null,
    // For regex type:
    pattern: string,
    // For text type:
    minLength: number | null,
    maxLength: number | null,
    // For file type:
    allowedFileTypes: string[]
  }
}
```

### Features
- **Answer Key Section**: Collapsible section for explaining correct answers
- **Feedback Section**: Collapsible section for respondent feedback
- **Answer Validation Section**:
  - Email validation (format check)
  - Number range (min/max values)
  - URL validation (format check)
  - Custom regex patterns
  - Text length (min/max characters)
  - File type restrictions (for file upload questions)
- Tab-based navigation for validation types
- All fields optional

### Usage Example
```javascript
import AdvancedQuestionOptions from './AdvancedQuestionOptions';

// In QuestionBuilder component
<AdvancedQuestionOptions 
  question={question}
  onUpdate={(updated) => handleUpdateQuestion(question.id, updated)}
/>
```

### CSS Classes Used
- `.advanced-options-container` - Main wrapper
- `.advanced-header` - Header section
- `.collapsible-section` - Collapsible sections
- `.section-toggle` - Toggle button
- `.section-body` - Content area
- `.validation-tabs` - Tab navigation
- `.form-group` - Form fields
- `.help-text` - Help text styling

---

## 2. SectionBuilder.js

### Location
`/src/components/admin/SectionBuilder.js`

### Purpose
Manages test sections for organizing questions into logical groups (similar to Google Forms section feature).

### Props Interface
```javascript
{
  sections: Section[],  // Array of existing sections
  onUpdate: (updatedSections) => void  // Callback with updated sections
}
```

### Data Structure (Exported via onUpdate)
```javascript
sections: [
  {
    id: string,              // Unique identifier (e.g., 'section-1713456789')
    title: string,           // Section title (required)
    description: string,     // Section description (optional)
    order: number            // Display order (0, 1, 2, ...)
  },
  // ... more sections
]
```

### Features
- Create new sections with title and description
- Edit existing sections
- Delete sections with confirmation
- Move sections up/down to reorder
- List view with edit/delete/move actions
- Form shows when adding or editing
- All descriptions are optional
- Section order automatically maintained

### Usage Example
```javascript
import SectionBuilder from './SectionBuilder';

// In TestBuilderPage component
const [sections, setSections] = useState([]);

<SectionBuilder 
  sections={sections}
  onUpdate={(updatedSections) => setSections(updatedSections)}
/>

// Later: Include section IDs in questions
const question = {
  ...question,
  sectionId: selectedSection.id
};
```

### CSS Classes Used
- `.advanced-options-container` - Main wrapper
- `.sections-list` - List container
- `.section-item` - Individual section card
- `.item-content` - Content area
- `.item-actions` - Action buttons
- `.section-title` - Title styling
- `.section-description` - Description styling
- `.condition-builder` - Form styling

---

## 3. ConditionalLogic.js

### Location
`/src/components/admin/ConditionalLogic.js`

### Purpose
Implements skip logic and conditional question display based on answer values.

### Props Interface
```javascript
{
  conditions: Condition[],      // Array of existing conditions
  questions: Question[],        // Array of all questions (for dropdowns)
  onUpdate: (updatedConditions) => void  // Callback with updated conditions
}
```

### Data Structure (Exported via onUpdate)
```javascript
conditions: [
  {
    id: string,                          // Unique identifier
    triggerQuestionId: string,          // Question that triggers condition
    condition: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 
              'lessThan' | 'greaterThanOrEqual' | 'lessThanOrEqual',
    value: string,                      // Value to match
    targetQuestionId: string,           // Question to show/hide/require
    action: 'show' | 'hide' | 'require' // Action to perform
  },
  // ... more conditions
]
```

### Supported Conditions
- `equals` - Answer equals value
- `notEquals` - Answer not equals value
- `contains` - Answer contains text
- `greaterThan` - Answer > value (numeric)
- `lessThan` - Answer < value (numeric)
- `greaterThanOrEqual` - Answer >= value (numeric)
- `lessThanOrEqual` - Answer <= value (numeric)

### Supported Actions
- `show` - Display the target question
- `hide` - Hide the target question
- `require` - Make the target question required

### Features
- Visual representation of each condition
- Add new conditions with form
- Delete individual conditions
- Trigger and target question selection via dropdowns
- Condition type and action selection
- Prevents self-referential conditions (can't trigger on itself)
- Prevents adding conditions if fewer than 2 questions exist
- Human-readable condition display

### Usage Example
```javascript
import ConditionalLogic from './ConditionalLogic';

// In TestBuilderPage component
const [conditions, setConditions] = useState([]);

<ConditionalLogic 
  conditions={conditions}
  questions={questions}
  onUpdate={(updatedConditions) => setConditions(updatedConditions)}
/>

// Later: Apply conditions during test rendering
const shouldShowQuestion = (question) => {
  return evaluateConditions(question.id, conditions, answers);
};
```

### CSS Classes Used
- `.advanced-options-container` - Main wrapper
- `.condition-item` - Condition card
- `.condition-builder` - Form styling
- `.condition-row` - Form row layout
- `.condition-field` - Form field
- `.item-text` - Condition text
- `.item-subtext` - Condition details

---

## 4. TestSettings.js

### Location
`/src/components/admin/TestSettings.js`

### Purpose
Comprehensive settings panel for test-wide configuration including general, question, response, display, and feedback options.

### Props Interface
```javascript
{
  test: TestObject,  // Current test settings object
  onUpdate: (updatedTest) => void  // Callback with updated test
}
```

### Data Structure (Exported via onUpdate)
Test object with these fields:
```javascript
{
  // General Settings
  title: string,                    // Test title (required)
  description: string,              // Test description (optional)
  totalMarks: number,              // Total marks (default: 100)
  passingMarks: number,            // Passing marks (default: 50)
  timeLimit: number,               // Time limit in minutes (0 = no limit)

  // Question Options
  shuffleQuestions: boolean,       // Randomize question order
  shuffleAnswers: boolean,         // Randomize answer options
  showQuestionNumbers: boolean,    // Display Q1, Q2, etc. (default: true)

  // Response Settings
  allowMultipleAttempts: boolean,  // Allow retakes
  maxAttempts: number,             // Max attempts if multiple allowed
  responseVisibility: string,      // 'scoreOnly' | 'scoreAndAnswers' | 'fullFeedback'
  autoSubmitOnTimeEnd: boolean,    // Auto-submit when timer ends
  requireEmailBeforeTest: boolean, // Collect email before test

  // Display Settings
  showProgressBar: boolean,        // Show progress indicator (default: true)
  randomizeOrder: boolean,         // Randomize display order
  showCorrectAnswer: boolean,      // Show answers in feedback

  // Feedback
  customFeedbackText: string       // Custom message after submission
}
```

### Settings Organization

#### General Settings (⚙)
- Test title (required)
- Description (optional)
- Total marks
- Passing marks
- Time limit in minutes

#### Question Options (❓)
- Shuffle question order checkbox
- Shuffle answer options checkbox
- Show question numbers checkbox

#### Response Settings (✓)
- Allow multiple attempts checkbox
- Max attempts input (conditional on multiple attempts)
- Response visibility dropdown
- Auto-submit on time end checkbox
- Require email before test checkbox

#### Display (👁)
- Show progress bar checkbox
- Randomize order checkbox
- Show correct answer checkbox

#### Feedback (💬)
- Custom feedback text textarea

### Features
- Organized into 5 collapsible sections
- Expandable sections for easier navigation
- Conditional fields (e.g., max attempts only when multiple attempts enabled)
- Input validation for numeric fields
- Help text for each setting
- Responsive grid layout for related fields
- Emoji icons for visual identification

### Usage Example
```javascript
import TestSettings from './TestSettings';

// In TestBuilderPage component
const [test, setTest] = useState({
  title: '',
  description: '',
  totalMarks: 100,
  // ... other defaults
});

<TestSettings 
  test={test}
  onUpdate={(updated) => setTest(updated)}
/>

// Save to database
await saveTest(test);
```

### CSS Classes Used
- `.test-settings-panel` - Main wrapper
- `.collapsible-section` - Collapsible sections
- `.section-toggle` - Toggle buttons
- `.section-body` - Content area
- `.form-group` - Form fields
- `.form-row` - Grid layout for related fields
- `.checkbox-group` - Checkbox grouping
- `.checkbox-item` - Individual checkbox
- `.checkbox-description` - Checkbox help text
- `.help-text` - Helper text

---

## Integration Guide

### Step 1: Import Components in QuestionBuilder
```javascript
// In QuestionBuilder.js
import AdvancedQuestionOptions from './AdvancedQuestionOptions';

// Add to render (in expanded sections):
{expandedSection === 'advanced' && (
  <AdvancedQuestionOptions 
    question={question}
    onUpdate={onUpdate}
  />
)}
```

### Step 2: Import Components in TestBuilderPage
```javascript
// In TestBuilderPage.js
import SectionBuilder from './SectionBuilder';
import ConditionalLogic from './ConditionalLogic';
import TestSettings from './TestSettings';

// Add to render:
<TestSettings test={test} onUpdate={setTest} />
<SectionBuilder sections={sections} onUpdate={setSections} />
<ConditionalLogic 
  conditions={conditions}
  questions={questions}
  onUpdate={setConditions}
/>
```

### Step 3: Export Configuration Objects
```javascript
// When saving test to backend
const testPayload = {
  ...test,  // From TestSettings
  sections: sections,  // From SectionBuilder
  conditions: conditions,  // From ConditionalLogic
  questions: questions.map(q => ({
    ...q,
    answerKey: q.answerKey,  // From AdvancedQuestionOptions
    feedback: q.feedback,
    validation: q.validation
  }))
};
```

---

## CSS Styling

### Main Stylesheet
`/src/styles/AdvancedOptions.css` (9.7 KB)

### Key Style Classes
- **Containers**: `.advanced-options-container`, `.test-settings-panel`
- **Sections**: `.collapsible-section`, `.section-toggle`, `.section-body`
- **Forms**: `.form-group`, `.form-row`, `.form-actions`
- **Buttons**: `.btn-add`, `.btn-submit`, `.btn-cancel`
- **Lists**: `.condition-item`, `.section-item`, `.sections-list`
- **Tabs**: `.validation-tabs`, `.validation-tab`
- **Text**: `.help-text`, `.section-label`, `.item-text`
- **Inputs**: All form inputs inherit styled inputs from CSS

### Color Scheme (Consistent with Google Forms theme)
- Primary: #4285f4 (Blue)
- Success: #34a853 (Green)
- Error: #d33b27 (Red)
- Text: #202124 (Dark gray)
- Secondary Text: #5f6368 (Light gray)
- Borders: #dadce0 (Light border)
- Background: #f8f9fa (Light background)

---

## Data Flow Examples

### Example 1: Saving Test with All Features
```javascript
const completeTest = {
  // From TestSettings
  title: "JavaScript Fundamentals",
  description: "Test your JavaScript knowledge",
  totalMarks: 50,
  passingMarks: 35,
  timeLimit: 30,
  shuffleQuestions: true,
  showProgressBar: true,
  responseVisibility: "fullFeedback",
  
  // From SectionBuilder
  sections: [
    { id: "section-1", title: "Basics", description: "Fundamentals", order: 0 },
    { id: "section-2", title: "Advanced", description: "ES6+", order: 1 }
  ],
  
  // From Questions with AdvancedQuestionOptions
  questions: [
    {
      id: "q1",
      questionText: "What is JavaScript?",
      sectionId: "section-1",
      answerKey: "JavaScript is a programming language...",
      feedback: "Great job!",
      validation: { type: "text", minLength: 10 }
    }
  ],
  
  // From ConditionalLogic
  conditions: [
    {
      id: "cond-1",
      triggerQuestionId: "q1",
      condition: "contains",
      value: "programming",
      targetQuestionId: "q2",
      action: "show"
    }
  ]
};
```

---

## Responsive Design

All components are responsive and work on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (below 768px)

Mobile-specific adjustments:
- Form rows stack to single column
- Buttons stack vertically
- Tabs wrap if needed
- Reduced padding on mobile

---

## Best Practices

1. **Always initialize state with empty arrays/objects**
   ```javascript
   const [sections, setSections] = useState([]);
   const [conditions, setConditions] = useState([]);
   ```

2. **Validate data before sending to backend**
   ```javascript
   const validateTest = (test) => {
     if (!test.title) return false;
     if (test.passingMarks > test.totalMarks) return false;
     return true;
   };
   ```

3. **Update all related fields together**
   ```javascript
   onUpdate({
     ...question,
     answerKey: value,  // Keep other fields intact
   });
   ```

4. **Handle empty states gracefully**
   - SectionBuilder shows "No sections yet" when empty
   - ConditionalLogic shows "No conditions" when empty
   - All components handle missing questions gracefully

5. **Use unique IDs for tracking**
   ```javascript
   id: `condition-${Date.now()}` // Unique ID generation
   ```

---

## Browser Compatibility
- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Dependencies
- React (16.8+)
- CSS3 (for animations and flex/grid layout)
- No external UI libraries required

---

## Testing Checklist

- [ ] AdvancedQuestionOptions saves answer key correctly
- [ ] Validation tabs switch and save properly
- [ ] SectionBuilder creates/edits/deletes sections
- [ ] Section reordering works correctly
- [ ] ConditionalLogic prevents invalid conditions
- [ ] TestSettings updates all fields correctly
- [ ] All collapsible sections expand/collapse smoothly
- [ ] Form validation prevents empty required fields
- [ ] Mobile responsive layout works on small screens
- [ ] Data persists when switching between components

---

## Known Limitations

1. Validation regex patterns are not validated client-side (will be validated on backend)
2. Conditional logic doesn't support nested conditions (only single level)
3. File type validation only works for file upload questions
4. Multiple attempts feature requires backend support for tracking attempts

---

## Future Enhancements

1. Bulk import/export of sections and conditions
2. Condition builder with visual logic flow diagram
3. Advanced feedback with branching responses
4. Question dependency visualization
5. Template library for common settings
6. A/B testing configuration
7. Analytics and question performance tracking
