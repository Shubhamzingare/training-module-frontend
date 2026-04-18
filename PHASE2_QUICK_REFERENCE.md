# Phase 2 Components - Quick Reference Guide

## File Locations

```
/src/components/admin/
├── AdvancedQuestionOptions.js    (15.7 KB) - Answer key, feedback, validation
├── SectionBuilder.js              (6.4 KB)  - Organize questions into sections
├── ConditionalLogic.js            (10.3 KB) - Skip logic/conditional display
└── TestSettings.js                (15.7 KB) - Test-wide configuration

/src/styles/
└── AdvancedOptions.css            (9.7 KB)  - All styling for Phase 2 components
```

---

## Component Imports

```javascript
// In QuestionBuilder.js
import AdvancedQuestionOptions from './AdvancedQuestionOptions';

// In TestBuilderPage.js
import TestSettings from './TestSettings';
import SectionBuilder from './SectionBuilder';
import ConditionalLogic from './ConditionalLogic';

// CSS (already imported in each component)
import '../../styles/AdvancedOptions.css';
```

---

## Props at a Glance

### AdvancedQuestionOptions
```javascript
<AdvancedQuestionOptions 
  question={questionObj}           // Current question
  onUpdate={updateFunction}        // Callback: (updatedQuestion) => void
/>
```

### SectionBuilder
```javascript
<SectionBuilder 
  sections={[]}                    // Array of section objects
  onUpdate={updateFunction}        // Callback: (updatedSections) => void
/>
```

### ConditionalLogic
```javascript
<ConditionalLogic 
  conditions={[]}                  // Array of condition objects
  questions={[]}                   // Array of all questions (for dropdowns)
  onUpdate={updateFunction}        // Callback: (updatedConditions) => void
/>
```

### TestSettings
```javascript
<TestSettings 
  test={{}}                        // Test object with all settings
  onUpdate={updateFunction}        // Callback: (updatedTest) => void
/>
```

---

## Data Structures

### Question with Advanced Options
```javascript
{
  id: "q-1",
  questionText: "Your question?",
  type: "mcq",
  marks: 5,
  
  // Phase 2 fields:
  answerKey: "Explanation...",
  feedback: "Feedback text...",
  validation: {
    type: "email" | "number" | "url" | "regex" | "text" | "file",
    minValue: 0,      // For number
    maxValue: 100,
    pattern: "",      // For regex
    minLength: 10,    // For text
    maxLength: 500,
    allowedFileTypes: ["pdf", "doc"]  // For file
  }
}
```

### Section
```javascript
{
  id: "section-1",
  title: "Section Title",
  description: "Optional description",
  order: 0
}
```

### Condition
```javascript
{
  id: "cond-1",
  triggerQuestionId: "q-1",
  condition: "equals",           // equals, notEquals, contains, greaterThan, etc.
  value: "Option A",
  targetQuestionId: "q-2",
  action: "show"                 // show, hide, require
}
```

### Test Settings
```javascript
{
  // General
  title: "Test Title",
  description: "Test description",
  totalMarks: 100,
  passingMarks: 60,
  timeLimit: 45,
  
  // Question Options
  shuffleQuestions: false,
  shuffleAnswers: false,
  showQuestionNumbers: true,
  
  // Response Settings
  allowMultipleAttempts: false,
  maxAttempts: 1,
  responseVisibility: "fullFeedback",  // scoreOnly, scoreAndAnswers, fullFeedback
  autoSubmitOnTimeEnd: false,
  requireEmailBeforeTest: false,
  
  // Display
  showProgressBar: true,
  randomizeOrder: false,
  showCorrectAnswer: true,
  
  // Feedback
  customFeedbackText: "Thank you!"
}
```

---

## Common Integration Patterns

### Pattern 1: Add Advanced Options to QuestionBuilder
```javascript
{expandedSection === 'advanced' && (
  <AdvancedQuestionOptions
    question={question}
    onUpdate={onUpdate}
  />
)}
```

### Pattern 2: Configure Test Settings
```javascript
const [test, setTest] = useState({
  title: '',
  totalMarks: 100,
  // ...
});

<TestSettings test={test} onUpdate={setTest} />
```

### Pattern 3: Manage Sections
```javascript
const [sections, setSections] = useState([]);

<SectionBuilder 
  sections={sections}
  onUpdate={setSections}
/>

// Assign to questions
questions.map(q => ({
  ...q,
  sectionId: sections[0]?.id
}))
```

### Pattern 4: Add Skip Logic
```javascript
const [conditions, setConditions] = useState([]);

<ConditionalLogic
  conditions={conditions}
  questions={questions}
  onUpdate={setConditions}
/>

// Use in rendering
const isVisible = evaluateConditions(questionId, conditions, answers);
```

---

## Validation Types Explained

| Type | Use Case | Fields |
|------|----------|--------|
| **email** | Email answers | None (format check only) |
| **number** | Numeric answers | minValue, maxValue |
| **url** | URL answers | None (format check only) |
| **regex** | Pattern matching | pattern (regex string) |
| **text** | Text length | minLength, maxLength |
| **file** | File uploads | allowedFileTypes (array) |

---

## Conditional Logic Conditions

| Condition | Works With | Example |
|-----------|-----------|---------|
| **equals** | All | "Yes", "Option A", "5" |
| **notEquals** | All | "No", "Option B" |
| **contains** | Text | "programming", "JavaScript" |
| **greaterThan** | Numbers | 5, 100, 80 |
| **lessThan** | Numbers | 5, 100 |
| **greaterThanOrEqual** | Numbers | 50, 90 |
| **lessThanOrEqual** | Numbers | 10, 25 |

---

## Conditional Logic Actions

| Action | Effect |
|--------|--------|
| **show** | Make question visible when condition is met |
| **hide** | Hide question when condition is met |
| **require** | Make question required when condition is met |

---

## CSS Classes Reference

### Main Containers
```css
.advanced-options-container     /* Question advanced options */
.test-settings-panel            /* Test settings panel */
```

### Sections
```css
.collapsible-section            /* Collapsible section */
.section-toggle                 /* Toggle header */
.section-body                   /* Expanded content */
.section-toggle-content         /* Header content area */
.section-label                  /* Section title */
.section-status                 /* Status badge */
.toggle-arrow                   /* Expand/collapse arrow */
```

### Forms
```css
.form-group                     /* Form field group */
.form-row                       /* Row with multiple fields */
.form-actions                   /* Button container */
.validation-tabs                /* Tab navigation */
.validation-tab                 /* Individual tab */
.condition-builder              /* Condition form wrapper */
.condition-row                  /* Condition form row */
.condition-field                /* Condition form field */
```

### Buttons
```css
.btn-add                        /* Add button (dashed blue) */
.btn-submit                     /* Submit button (blue) */
.btn-cancel                     /* Cancel button */
.item-btn                       /* Action buttons */
.item-btn.delete                /* Delete button */
```

### Lists
```css
.section-item                   /* Section list item */
.condition-item                 /* Condition list item */
.sections-list                  /* Section list container */
.item-content                   /* Item content area */
.item-actions                   /* Item action buttons */
```

---

## Common Issues & Solutions

### Issue: Component doesn't update
**Solution**: Make sure you're calling `onUpdate` with the entire updated object, not just changed fields
```javascript
// ✗ Wrong
onUpdate({ answerKey: newValue });

// ✓ Correct
onUpdate({ ...question, answerKey: newValue });
```

### Issue: Sections not appearing in dropdown
**Solution**: Ensure sections are passed as array and have valid IDs
```javascript
// ✓ Correct
const [sections, setSections] = useState([]);  // Initialize as array
```

### Issue: Conditional logic not triggering
**Solution**: Check that trigger question ID and target question ID are different
```javascript
// ✗ Can't create condition where trigger = target
// ✓ Validate before adding condition
if (triggerQId === targetQId) {
  alert('Cannot create self-referential condition');
}
```

### Issue: Validation doesn't work
**Solution**: Validation is collected but validation logic must be implemented on backend
```javascript
// Phase 2 components collect validation config only
// Backend must implement actual validation
```

### Issue: Styling not applied
**Solution**: Ensure CSS file is imported in component
```javascript
import '../../styles/AdvancedOptions.css';
```

---

## Testing Checklist

```
AdvancedQuestionOptions:
☐ Answer key field saves correctly
☐ Feedback field saves correctly
☐ Email validation toggles on/off
☐ Number validation shows min/max fields
☐ URL validation works
☐ Regex pattern field works
☐ Text validation shows min/max length
☐ File types validation shows for file upload questions
☐ Collapsible sections expand/collapse

SectionBuilder:
☐ Can add new section
☐ Can edit existing section
☐ Can delete section
☐ Can move section up/down
☐ Section title is required
☐ Description is optional
☐ Order values update correctly
☐ Empty state message shows

ConditionalLogic:
☐ Can add new condition
☐ Prevents self-referential conditions
☐ Shows condition summary correctly
☐ Can delete condition
☐ All condition types work
☐ All actions work
☐ Questions dropdown filters correctly
☐ Works with 2+ questions

TestSettings:
☐ All general settings save
☐ Question option toggles work
☐ Response settings save correctly
☐ Max attempts field shows only when enabled
☐ Display options save
☐ Feedback text saves
☐ Numeric validation (totalMarks > 0, etc.)
☐ Passing marks <= total marks validation
☐ Sections expand/collapse independently
```

---

## Performance Tips

1. **Memoize callbacks** if parent re-renders frequently
   ```javascript
   const handleUpdate = useCallback((updated) => {
     setQuestion(updated);
   }, []);
   ```

2. **Lazy load validation tabs** to reduce initial render
   ```javascript
   {activeTab === 'email' && <EmailValidation />}
   ```

3. **Virtualize long lists** if 100+ conditions/sections
   ```javascript
   import { FixedSizeList } from 'react-window';
   ```

---

## Backend Integration

### Save Complete Test
```javascript
POST /api/tests
{
  title: string,
  description: string,
  sections: Section[],
  questions: Question[],    // with answerKey, feedback, validation
  conditions: Condition[],
  ...other test settings
}
```

### Validate Test
```javascript
// Backend should validate:
- Test has title
- Test has at least 1 question
- Passing marks <= total marks
- No orphaned sections
- No invalid condition references
- Regex patterns are valid
```

### Apply Conditional Logic
```javascript
// When serving test:
- Filter questions based on conditions
- Update required status based on conditions
- Return only visible questions
```

---

## Accessibility Notes

- All sections use semantic headings
- Form labels properly associated with inputs
- Tab navigation for form fields
- Proper color contrast for all text
- Arrow icons rotate to indicate expand/collapse state
- Help text available for complex settings

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari (iOS 13+)
- Chrome Mobile (latest)

All components use standard CSS3 features (flexbox, grid, transitions) with no vendor prefixes needed.
