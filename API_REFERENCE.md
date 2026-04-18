# Google Forms Replica - API Reference

Complete API documentation for the test management system.

---

## Authentication

All admin endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

Get the token by logging in at `/api/admin/auth/login`

---

## Base URL

```
http://localhost:5000/api
```

### Admin Endpoints
```
/api/admin/...
```

### Public Endpoints
```
/api/public/...
```

---

## Test Management APIs

### Create Test
```http
POST /api/admin/tests
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Safety Training Quiz",
  "description": "Quarterly safety assessment",
  "totalMarks": 100,
  "passingMarks": 60,
  "timeLimit": 30,
  "status": "draft",
  "shuffleQuestions": true,
  "shuffleOptions": true,
  "allowMultipleAttempts": false,
  "maxAttempts": 1,
  "responseVisibility": "score_and_answers",
  "autoSubmitOnTimeEnd": true,
  "showProgressBar": true,
  "requireEmail": false,
  "feedbackText": "Thank you for completing the test!"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Test created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Safety Training Quiz",
    "description": "Quarterly safety assessment",
    "totalMarks": 100,
    "passingMarks": 60,
    "timeLimit": 30,
    "status": "draft",
    "createdBy": "507f1f77bcf86cd799439012",
    "createdAt": "2026-04-18T10:30:00Z",
    "questions": []
  }
}
```

---

### Get All Tests
```http
GET /api/admin/tests?status=draft&limit=10&skip=0&sort=-createdAt
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` - Filter by status (draft, active, locked)
- `limit` - Pagination limit (default: 10)
- `skip` - Pagination offset (default: 0)
- `sort` - Sort field (prefix with - for descending)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Safety Training Quiz",
      "description": "Quarterly safety assessment",
      "totalMarks": 100,
      "passingMarks": 60,
      "timeLimit": 30,
      "status": "draft",
      "createdAt": "2026-04-18T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 10,
    "skip": 0,
    "pages": 1
  }
}
```

---

### Get Test by ID
```http
GET /api/admin/tests/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Safety Training Quiz",
    "description": "Quarterly safety assessment",
    "totalMarks": 100,
    "passingMarks": 60,
    "timeLimit": 30,
    "status": "draft",
    "shuffleQuestions": true,
    "shuffleOptions": true,
    "autoSubmitOnTimeEnd": true,
    "responseVisibility": "score_and_answers",
    "questions": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "questionText": "What is the primary safety procedure?",
        "type": "mcq",
        "marks": 5,
        "options": [
          { "id": "opt1", "text": "Report incidents", "isCorrect": true },
          { "id": "opt2", "text": "Ignore hazards", "isCorrect": false }
        ],
        "order": 0,
        "isRequired": true
      }
    ],
    "createdBy": "507f1f77bcf86cd799439012",
    "createdAt": "2026-04-18T10:30:00Z"
  }
}
```

---

### Update Test
```http
PUT /api/admin/tests/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Updated Test Title",
  "description": "Updated description",
  "totalMarks": 150,
  "passingMarks": 75,
  "shuffleQuestions": false
}
```

**Response (200):** Same as Create Test response

---

### Delete Test
```http
DELETE /api/admin/tests/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Test deleted successfully",
  "data": { "_id": "507f1f77bcf86cd799439011" }
}
```

---

### Toggle Test Status
```http
PATCH /api/admin/tests/:id/toggle-status
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Test status updated",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "status": "active"
  }
}
```

---

## Question Management APIs

### Add Question
```http
POST /api/admin/tests/:testId/questions
Content-Type: application/json
Authorization: Bearer <token>

{
  "questionText": "What is your name?",
  "description": "First and last name",
  "type": "shortAnswer",
  "marks": 5,
  "order": 0,
  "isRequired": true,
  "questionImage": null,
  "shuffleOptions": false,
  "scaleMin": 1,
  "scaleMax": 5,
  "scaleMinLabel": "Disagree",
  "scaleMaxLabel": "Agree",
  "allowedFileTypes": ["pdf", "doc", "docx"],
  "maxFileSize": 10,
  "answerKey": "John Doe",
  "feedback": "Good answer!",
  "validationRules": {
    "type": "textLength",
    "minLength": 3,
    "maxLength": 100
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Question added successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "testId": "507f1f77bcf86cd799439011",
    "questionText": "What is your name?",
    "type": "shortAnswer",
    "marks": 5,
    "order": 0,
    "isRequired": true
  }
}
```

---

### Update Question
```http
PUT /api/admin/tests/:testId/questions/:questionId
Content-Type: application/json
Authorization: Bearer <token>

{
  "questionText": "Updated question text",
  "marks": 10,
  "isRequired": false
}
```

---

### Delete Question
```http
DELETE /api/admin/tests/:testId/questions/:questionId
Authorization: Bearer <token>
```

---

### Get Questions for Test
```http
GET /api/admin/questions?testId=:testId
Authorization: Bearer <token>
```

---

## Section Management APIs (Phase 2)

### Create Section
```http
POST /api/admin/tests/:testId/sections
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Safety Procedures",
  "description": "Questions about company safety procedures",
  "order": 1,
  "pageBreakBefore": false,
  "pageBreakAfter": true
}
```

---

### Get Sections
```http
GET /api/admin/tests/:testId/sections
Authorization: Bearer <token>
```

---

### Update Section
```http
PUT /api/admin/sections/:sectionId
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Updated Section Title",
  "order": 2
}
```

---

### Delete Section
```http
DELETE /api/admin/sections/:sectionId
Authorization: Bearer <token>
```

---

## Question Types Reference

### Multiple Choice (MCQ)
```json
{
  "type": "mcq",
  "options": [
    { "id": "1", "text": "Option A", "isCorrect": true },
    { "id": "2", "text": "Option B", "isCorrect": false },
    { "id": "3", "text": "Option C", "isCorrect": false }
  ],
  "correctAnswer": "1"
}
```

### Checkboxes
```json
{
  "type": "checkbox",
  "options": [
    { "id": "1", "text": "Option A", "isCorrect": true },
    { "id": "2", "text": "Option B", "isCorrect": true },
    { "id": "3", "text": "Option C", "isCorrect": false }
  ],
  "correctAnswers": ["1", "2"]
}
```

### Dropdown
```json
{
  "type": "dropdown",
  "options": [
    { "id": "1", "text": "Select...", "isCorrect": false },
    { "id": "2", "text": "Option A", "isCorrect": true },
    { "id": "3", "text": "Option B", "isCorrect": false }
  ]
}
```

### Linear Scale
```json
{
  "type": "linearScale",
  "scaleMin": 1,
  "scaleMax": 5,
  "scaleMinLabel": "Strongly Disagree",
  "scaleMaxLabel": "Strongly Agree",
  "correctAnswer": "4"
}
```

### Short Answer
```json
{
  "type": "shortAnswer",
  "correctAnswer": "expected answer",
  "validationRules": {
    "type": "textLength",
    "minLength": 5,
    "maxLength": 100
  }
}
```

### Paragraph
```json
{
  "type": "paragraph",
  "answerKey": "This should contain...",
  "feedback": "Good comprehensive answer!"
}
```

### Date
```json
{
  "type": "date",
  "correctAnswer": "2026-04-18",
  "defaultValue": "2026-04-18"
}
```

### Time
```json
{
  "type": "time",
  "correctAnswer": "14:30",
  "defaultValue": "09:00"
}
```

### File Upload
```json
{
  "type": "fileUpload",
  "allowedFileTypes": ["pdf", "doc", "docx"],
  "maxFileSize": 10
}
```

### Duration
```json
{
  "type": "duration",
  "correctAnswer": "1:30:45"
}
```

---

## Validation Rules Reference

### Email Validation
```json
{
  "validationRules": {
    "type": "email",
    "customMessage": "Please enter a valid email address"
  }
}
```

### Number Validation
```json
{
  "validationRules": {
    "type": "number",
    "minValue": 0,
    "maxValue": 100,
    "customMessage": "Please enter a number between 0 and 100"
  }
}
```

### URL Validation
```json
{
  "validationRules": {
    "type": "url",
    "customMessage": "Please enter a valid URL"
  }
}
```

### Regex Pattern
```json
{
  "validationRules": {
    "type": "regex",
    "pattern": "^[A-Z]{3}[0-9]{4}$",
    "customMessage": "Format: ABC1234"
  }
}
```

### Text Length
```json
{
  "validationRules": {
    "type": "textLength",
    "minLength": 5,
    "maxLength": 100,
    "customMessage": "Answer must be 5-100 characters"
  }
}
```

### File Type Validation
```json
{
  "validationRules": {
    "type": "fileType",
    "allowedFileTypes": ["pdf", "doc", "docx"],
    "customMessage": "Only PDF and Word documents allowed"
  }
}
```

---

## Conditional Logic Reference

```json
{
  "conditionalLogic": [
    {
      "id": "logic1",
      "triggerQuestionId": "507f1f77bcf86cd799439013",
      "condition": "equals",
      "value": "yes",
      "targetQuestionId": "507f1f77bcf86cd799439014",
      "action": "show"
    }
  ]
}
```

**Supported Conditions:**
- `equals` - Exact match
- `contains` - Substring match
- `greaterThan` - Numeric comparison
- `lessThan` - Numeric comparison
- `isEmpty` - No response
- `isNotEmpty` - Has response

**Supported Actions:**
- `show` - Display the target question
- `hide` - Hide the target question
- `require` - Make the target question required

---

## Public Test APIs

### Get Test (Public)
```http
GET /api/public/tests/:testId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Safety Quiz",
    "description": "Test description",
    "totalMarks": 100,
    "passingMarks": 60,
    "timeLimit": 30,
    "status": "active"
  }
}
```

---

### Get Test Questions (Public)
```http
GET /api/public/tests/:testId/questions
```

---

### Get Departments (Public)
```http
GET /api/public/departments
```

---

### Get Shifts (Public)
```http
GET /api/public/shifts
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Title is required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Test not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Internal error |

---

## Rate Limiting

Currently no rate limiting is enforced. Future versions may implement limits.

---

## CORS

All endpoints support CORS for cross-origin requests from authorized domains.

---

## Pagination

Endpoints that support pagination use:
- `limit` - Results per page
- `skip` - Number of results to skip
- Response includes `pagination` object with total count

---

## Sorting

Sort parameter format:
- `-fieldName` - Descending order
- `fieldName` - Ascending order

Example: `sort=-createdAt` sorts by creation date (newest first)

---

## Frontend Integration

### Using the TestApi Service

```javascript
import testApi from './services/testApi';

// Create test
const response = await testApi.createTest({
  title: 'My Test',
  totalMarks: 100
});

// Get all tests
const tests = await testApi.getTests({ status: 'draft' });

// Add question
const question = await testApi.addQuestion(testId, {
  questionText: 'Question?',
  type: 'mcq',
  options: [...]
});

// Update test
await testApi.updateTest(testId, { status: 'active' });
```

---

## Webhook Events (Future)

The following events will trigger webhooks in future versions:
- `test.created`
- `test.published`
- `test.completed`
- `response.submitted`

---

## Rate Limit Headers (Future)

Future responses will include:
- `X-RateLimit-Limit` - Requests allowed per window
- `X-RateLimit-Remaining` - Requests remaining
- `X-RateLimit-Reset` - Unix timestamp when limit resets

---

**API Version:** 1.0  
**Last Updated:** April 18, 2026

