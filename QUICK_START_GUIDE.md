# Google Forms Replica - Quick Start Guide

Welcome to the complete Google Forms replacement for your training and assessment platform!

## Getting Started

### For Admin Users

#### Step 1: Login
1. Go to `/admin/login`
2. Enter your credentials
3. Click "Login"

#### Step 2: Navigate to Tests
1. On the left sidebar, click the "Tests" menu item
2. You'll see the Tests management interface with a list of existing tests

#### Step 3: Create a New Test
1. Click the **"+ Create New Test"** button (top right)
2. Fill in the test details:
   - **Test Title** (required) - e.g., "Safety Training Quiz"
   - **Description** - Optional context for respondents
   - **Total Marks** - e.g., 100
   - **Passing Marks** - e.g., 60
   - **Time Limit (minutes)** - e.g., 30

3. Configure question options:
   - ☑️ Shuffle question order - Randomize question order for each respondent
   - ☑️ Shuffle answer options - Randomize option order
   - ☑️ Show progress bar - Display completion percentage

4. Configure response settings:
   - ☑️ Allow multiple attempts - Let users retake the test
   - ☑️ Auto-submit when time ends - Automatically submit incomplete tests
   - ☑️ Require email - Collect email before test
   - Response visibility - Choose what respondents see after submission:
     - "Only scores" - Just the final score
     - "Scores and correct answers" - Score + right answers
     - "Full feedback" - Score + answers + explanations

5. Click **"Create Test"** to save

#### Step 4: Add Questions
1. After creating the test, click **"Edit Questions"** on the test card
2. You'll see the Google Forms-style question builder
3. Click **"+ Add Question"**
4. Enter your question text
5. Select the question type from the dropdown:

**Available Question Types:**
- **Multiple Choice** - Single correct answer (radio buttons)
- **Checkboxes** - Multiple correct answers (checkboxes)
- **Dropdown** - Choose one from dropdown list
- **Linear Scale** - 1-5 or custom scale rating
- **Short Answer** - Single line text input
- **Paragraph** - Multi-line text input
- **Date** - Calendar date picker
- **Time** - Time picker
- **File Upload** - Upload attachment
- **Duration** - Time duration input

6. For MCQ/Checkbox/Dropdown: Click **"Add option"** to add answer choices
7. Mark the correct answer(s) by clicking the checkbox next to the option
8. Set the **Marks** value (points for this question)
9. Configure optional settings:
   - ☑️ Required - Respondent must answer this question
   - ☑️ Shuffle options - Randomize order
   - For Linear Scale: Set min/max values and labels
   - For File Upload: Choose allowed file types and max size
   - Image Upload: Add a question image for visual context

10. Use arrow buttons to reorder questions
11. Click the trash icon to delete questions
12. Click **"Save All Questions"** to save changes

#### Step 5: Publish the Test
1. Go back to the Tests list
2. Find your test in the grid
3. Click **"Publish"** to make it active
   - Once published, users can take the test
   - Click "Unpublish" to move back to draft status

---

### For Team Members (Test Takers)

#### Step 1: Access a Test
1. Go to the "Take a Test" section on the home page
2. Select a test from the list of available tests

#### Step 2: Fill in Test Information
1. Enter your name
2. Select your department
3. Select your shift
4. Enter your designation
5. Enter your phone number or employee ID
6. Click **"Start Test"**

#### Step 3: Answer Questions
1. **Read the question carefully** - Some may have images or attachments
2. **Check if required** - Questions marked with * are mandatory
3. **Answer the question** - Use the appropriate input method:
   - MCQ: Click one radio button
   - Checkboxes: Click multiple checkboxes
   - Dropdown: Select from the list
   - Linear Scale: Click the rating
   - Text: Type your answer
   - File Upload: Drag & drop or click to browse
   - Date/Time: Use the picker

4. **Use the Question Navigator** - The panel on the right shows:
   - Green circles = answered questions
   - Gray circles = unanswered questions
   - Red circles = required questions not answered
   - Click any number to jump to that question

5. **Watch the Timer** - Top right shows remaining time
   - Red indicator when less than 5 minutes left
   - Test auto-submits when time runs out (if enabled)

#### Step 4: Submit Your Test
1. Answer all required questions (marked with *)
2. Check the "Answered: X / Y" counter to see your progress
3. Click **"Submit Test"** when ready
4. You'll see your score and results based on test visibility settings

---

## Advanced Features (Coming Soon)

### Phase 2 Features (In Development)
- **Answer Key & Feedback** - Provide explanations for correct answers
- **Input Validation** - Enforce email format, number ranges, URL format, etc.
- **Conditional Logic** - Show/hide questions based on previous answers
- **Test Sections** - Organize questions into logical groups
- **Page Breaks** - Split test into multiple pages

### Phase 3 Features (In Development)
- **Voice Recording** - Let respondents record audio answers
- **File Upload** - Collect file submissions
- **Response Analytics** - View charts and statistics of responses
- **Data Export** - Download responses in CSV, Excel, JSON, or PDF
- **Response Analysis** - See which questions are most difficult

---

## Tips & Best Practices

### For Creating Effective Tests

1. **Clear Questions** - Write questions that are easy to understand
2. **Balanced Options** - For MCQ, make wrong answers plausible
3. **Appropriate Difficulty** - Mix easy and challenging questions
4. **Realistic Time** - Give reasonable time per question
5. **Provide Context** - Use descriptions to explain test purpose
6. **Use Images** - Add diagrams or screenshots for visual clarity

### For Good User Experience

1. **Test Before Publishing** - Actually take your test to find issues
2. **Preview Settings** - Review your shuffle and timing settings
3. **Clear Instructions** - Describe what you expect from respondents
4. **Feedback** - Use feedback feature to help learning
5. **Multiple Attempts** - Consider allowing retakes for practice tests

---

## Common Questions

**Q: Can I edit a test after publishing?**  
A: Yes, but new respondents will see the updated version. Completed responses won't change.

**Q: What happens if time runs out?**  
A: If "auto-submit" is enabled, the test automatically submits with answered questions. Otherwise, you lose unanswered questions.

**Q: Can I require email addresses?**  
A: Yes, enable "Require email" in test settings. Respondents must enter email before starting.

**Q: How many questions can I add?**  
A: No limit! Add as many as needed.

**Q: Can I shuffle answers?**  
A: Yes! Enable "Shuffle answer options" so MCQ/checkbox options appear in random order for each respondent.

**Q: Do respondents see correct answers?**  
A: Only if you set "Response visibility" to "Scores and correct answers" or "Full feedback".

**Q: Can I download test results?**  
A: Yes! Use the Analytics section to view and export results (coming in Phase 3).

---

## Support

### Admin Issues
- **Test won't save** - Check all required fields are filled
- **Questions not displaying** - Click "Edit Questions" to see the builder
- **Can't publish test** - Test needs at least one question

### Respondent Issues
- **Can't see test** - Test might not be published (check status)
- **Timer not working** - Refresh the page and restart the test
- **Answer not saving** - Changes save automatically as you type
- **File won't upload** - Check file type and size limits

---

## Keyboard Shortcuts (Coming Soon)

| Shortcut | Action |
|----------|--------|
| Tab | Move to next question |
| Shift+Tab | Move to previous question |
| Ctrl+S | Save draft |
| Ctrl+Enter | Submit test |

---

## Version Information

**Product:** Google Forms Replica v1.0  
**Release Date:** April 2026  
**Status:** Production Ready (Phase 1 & 2 Complete)

**Phases:**
- ✅ Phase 1: Core Features (10 question types, basic test settings)
- ✅ Phase 2: Advanced Features (validation, conditional logic, sections)
- 🔄 Phase 3: Pro Features (analytics, voice recording, export)

---

**Need Help?**  
Check the GOOGLE_FORMS_INTEGRATION_GUIDE.md for technical documentation.

**Ready to get started?**  
→ Go to `/admin` and create your first test!

