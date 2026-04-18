# Training Module Frontend - Architecture & Documentation

## Project Overview

A complete React-based frontend for a Training Module Platform with separate admin and user interfaces. The platform allows admins to manage modules, tests, and batches, while users can view modules, take tests, and track their progress.

## Directory Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── batches/
│   │   │   ├── BatchList.js
│   │   │   └── BatchForm.js
│   │   ├── modules/
│   │   │   ├── ModuleList.js
│   │   │   └── ModuleForm.js
│   │   ├── tests/
│   │   │   ├── TestList.js
│   │   │   └── TestForm.js
│   │   └── performance/
│   │       ├── UserScores.js
│   │       └── ModuleAnalytics.js
│   ├── user/
│   │   ├── modules/
│   │   │   ├── ModuleCard.js
│   │   │   ├── KeyPoints.js
│   │   │   └── FAQs.js
│   │   └── test/
│   │       ├── TestQuestion.js
│   │       └── TestTimer.js
│   │   └── test-result/
│   │       ├── ResultSummary.js
│   │       └── QuestionReview.js
│   ├── common/
│   │   ├── Modal.js
│   │   ├── Toast.js
│   │   ├── Table.js
│   │   ├── Button.js
│   │   ├── Form.js
│   │   ├── Header.js
│   │   ├── LoadingSpinner.js
│   │   └── ProtectedRoute.js
│   └── styles/
│       ├── Modal.css
│       ├── Toast.css
│       ├── Table.css
│       ├── Button.css
│       ├── Form.css
│       ├── Header.css
│       ├── user/
│       │   ├── ModuleCard.css
│       │   ├── ModulesPage.css
│       │   ├── ModuleViewPage.css
│       │   ├── TestPage.css
│       │   ├── TestResultPage.css
│       │   └── MyScoresPage.css
│       └── admin/
│           ├── ModulesPage.css
│           ├── TestsPage.css
│           ├── BatchesPage.css
│           └── PerformancePage.css
├── pages/
│   ├── admin/
│   │   ├── AdminDashboard.js
│   │   ├── ModulesPage.js
│   │   ├── TestsPage.js
│   │   ├── BatchesPage.js
│   │   └── PerformancePage.js
│   ├── user/
│   │   ├── UserDashboard.js
│   │   ├── ModulesPage.js
│   │   ├── ModuleViewPage.js
│   │   ├── TestPage.js
│   │   ├── TestResultPage.js
│   │   └── MyScoresPage.js
│   ├── LoginPage.js
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── moduleService.js
│   ├── testService.js
│   ├── batchService.js
│   └── performanceService.js
├── hooks/
│   ├── useAuth.js
│   ├── useFetch.js
│   └── useForm.js
├── context/
│   └── AuthContext.js
├── utils/
│   └── constants.js
├── styles/
│   ├── AdminDashboard.css
│   ├── UserDashboard.css
│   ├── LoginPage.css
│   └── admin/
├── App.js
└── index.js
```

## Key Components & Pages

### Shared Components (`src/components/common/`)

#### Modal.js
Generic modal dialog component with confirm/cancel actions.

**Props:**
- `isOpen` (bool): Control visibility
- `onClose` (func): Close callback
- `title` (string): Modal title
- `children` (ReactNode): Modal content
- `onConfirm` (func): Confirm callback (optional)
- `confirmText` (string): Confirm button text
- `cancelText` (string): Cancel button text
- `size` (string): 'small', 'medium', 'large'

#### Toast.js
Notification toast that auto-dismisses.

**Props:**
- `message` (string): Notification text
- `type` (string): 'success', 'error', 'warning', 'info'
- `onClose` (func): Close callback
- `duration` (number): Auto-dismiss time in ms (0 = manual)

#### Table.js
Reusable data table with sorting and pagination.

**Props:**
- `columns` (array): Column definitions [{key, label, sortable, render}]
- `data` (array): Table data
- `pageSize` (number): Items per page
- `onRowClick` (func): Row click handler
- `loading` (bool): Loading state
- `emptyMessage` (string): Empty state message

#### Button.js
Styled button component with variants and states.

**Props:**
- `children` (string): Button text
- `variant` (string): 'primary', 'secondary', 'danger', 'success', 'outline'
- `size` (string): 'small', 'medium', 'large'
- `disabled` (bool): Disabled state
- `loading` (bool): Loading state
- `onClick` (func): Click handler

#### Form Components (Form.js)
- `FormInput`: Text input with validation
- `FormTextarea`: Multi-line text area
- `FormSelect`: Dropdown select
- `FormCheckbox`: Checkbox input

All form components support:
- `label` (string)
- `name` (string)
- `value` (string|bool)
- `onChange` (func)
- `onBlur` (func)
- `error` (string)
- `touched` (bool)
- `required` (bool)

#### Header.js
Page header with breadcrumbs and actions.

**Props:**
- `title` (string): Page title
- `breadcrumbs` (array): [{label, path}]
- `actions` (ReactNode): Right-side actions

### Admin Pages

#### ModulesPage.js
Module management interface with CRUD operations.

**Features:**
- List all modules with search/filter
- Create/Edit/Delete modules
- Filter by type and status
- Activate/Deactivate modules
- Pagination and sorting

**Components Used:**
- `ModuleList`: Displays modules in table
- `ModuleForm`: Create/Edit form
- Modal, Toast, Table, Button, Header

#### TestsPage.js
Test management interface.

**Features:**
- List all tests
- Create/Edit/Delete tests
- Publish/Unpublish tests
- Filter and search
- Associate tests with modules

**Components Used:**
- `TestList`: Displays tests in table
- `TestForm`: Create/Edit form

#### BatchesPage.js
Batch management interface.

**Features:**
- Create/Edit/Delete batches
- Assign modules to batches
- Add/Remove users from batches
- Filter by batch type

**Components Used:**
- `BatchList`: Displays batches
- `BatchForm`: Create/Edit form

#### PerformancePage.js
Analytics and performance dashboard.

**Features:**
- View user scores with statistics
- Module-wise performance analytics
- Batch-wise comparisons
- Export scores as CSV
- Statistics cards (total users, avg score, pass rate)

**Components Used:**
- `UserScores`: User performance table
- `ModuleAnalytics`: Module-wise analytics

### User Pages

#### ModulesPage.js
List of available training modules.

**Features:**
- Display active modules
- Search and filter by type
- Module cards with descriptions
- Navigate to module details

**Components Used:**
- `ModuleCard`: Individual module display
- Table, Header, Button

#### ModuleViewPage.js
Detailed module view with content.

**Features:**
- Display module information
- Expandable key points
- Accordion-style FAQs
- Link to associated test

**Components Used:**
- `KeyPoints`: Expandable key points list
- `FAQs`: Accordion FAQ section

#### TestPage.js
Test taking interface with timer and question navigation.

**Features:**
- Test instructions and start screen
- Question display (MCQ and descriptive)
- Timer with warning states
- Question navigator
- Navigate between questions
- Submit test confirmation

**Components Used:**
- `TestQuestion`: Question display
- `TestTimer`: Countdown timer
- Modal for submit confirmation

#### TestResultPage.js
Test result display with answer review.

**Features:**
- Score summary with pass/fail status
- Detailed score breakdown
- Question-by-question review
- Correct answer display (after submission)
- Attempt history

**Components Used:**
- `ResultSummary`: Score display
- `QuestionReview`: Answer review section

#### MyScoresPage.js
User's test score history and progress.

**Features:**
- List all test attempts
- Sort by date, score, module
- Filter by pass/fail status
- View detailed results
- Progress tracking

## Custom Hooks

### useAuth.js
Access authentication context.

```javascript
const { user, token, loading, isAuthenticated, login, logout } = useAuth();
```

### useFetch.js
Handle API data fetching with loading/error states.

```javascript
const { data, status, error, refetch } = useFetch(
  () => moduleService.getAllModules(),
  []
);
```

**Status values:** 'idle', 'loading', 'success', 'error'

### useForm.js
Manage form state and validation.

```javascript
const {
  values,
  errors,
  touched,
  isSubmitting,
  handleChange,
  handleBlur,
  handleSubmit,
  setFieldValue,
  resetForm
} = useForm(initialValues, onSubmit);
```

## Service Modules

### moduleService.js
Module API operations:
- `getAllModules(filters)`: Fetch all modules
- `getModuleById(id)`: Fetch single module
- `createModule(data)`: Create new module
- `updateModule(id, data)`: Update module
- `deleteModule(id)`: Delete module
- `toggleModuleStatus(id, isActive)`: Activate/Deactivate
- `getModuleContent(id)`: Get module content (key points, FAQs)
- `uploadFile(file, metadata)`: Upload and create module

### testService.js
Test API operations:
- `getAllTests(filters)`: Fetch all tests
- `getTestById(id)`: Fetch single test
- `createTest(data)`: Create new test
- `updateTest(id, data)`: Update test
- `deleteTest(id)`: Delete test
- `toggleTestPublish(id, isPublished)`: Publish/Unpublish
- `addQuestion(testId, questionData)`: Add question
- `updateQuestion(testId, questionId, data)`: Update question
- `deleteQuestion(testId, questionId)`: Delete question
- `reorderQuestions(testId, order)`: Reorder questions
- `submitTest(testId, answers)`: Submit test answers
- `getTestAttempt(testId, attemptId)`: Get test results
- `getTestAttempts(testId)`: Get all attempts

### batchService.js
Batch API operations:
- `getAllBatches(filters)`: Fetch all batches
- `getBatchById(id)`: Fetch single batch
- `createBatch(data)`: Create new batch
- `updateBatch(id, data)`: Update batch
- `deleteBatch(id)`: Delete batch
- `assignModules(batchId, moduleIds)`: Assign modules
- `addUser(batchId, userId)`: Add user to batch
- `addMultipleUsers(batchId, userIds)`: Bulk add users
- `removeUser(batchId, userId)`: Remove user
- `getBatchMembers(batchId)`: Get batch members
- `getBatchModules(batchId)`: Get batch modules

### performanceService.js
Performance analytics operations:
- `getUserScores(filters)`: Get user scores
- `getModuleAnalytics(moduleId)`: Get module performance
- `getBatchAnalytics(batchId)`: Get batch performance
- `getTestScore(testId)`: Get test score
- `getMyScores(filters)`: Get current user's scores
- `exportScoresAsCSV(filters)`: Export as CSV
- `getStatistics(filters)`: Get performance statistics

## Styling Architecture

### CSS Organization
- **Common styles**: `src/components/styles/` - Shared component styles
- **Page styles**: `src/styles/admin/` and `src/styles/user/` - Page-specific styles
- **Color scheme**: Purple gradient (#667eea to #764ba2)
- **Responsive breakpoints**: 768px (tablet), 1024px (desktop)

### CSS Features
- Mobile-first responsive design
- Accessibility (ARIA labels, keyboard navigation)
- Consistent color palette
- Smooth transitions and animations
- Status badge colors (green for success, red for fail, blue for info)

## Constants

```javascript
// User roles
ROLES.ADMIN = 'admin'
ROLES.USER = 'user'

// Module types
MODULE_TYPES.NEW_DEPLOYMENT = 'new_deployment'
MODULE_TYPES.WATI_TRAINING = 'wati_training'

// Module status
MODULE_STATUS.ACTIVE = 'active'
MODULE_STATUS.INACTIVE = 'inactive'
MODULE_STATUS.DRAFT = 'draft'

// Question types
QUESTION_TYPES.MCQ = 'mcq'
QUESTION_TYPES.DESCRIPTIVE = 'descriptive'

// API status
API_STATUS.IDLE = 'idle'
API_STATUS.LOADING = 'loading'
API_STATUS.SUCCESS = 'success'
API_STATUS.ERROR = 'error'
```

## Routing Structure

```
/login - Public login page

/admin/ - Admin dashboard home
/admin/modules - Module management
/admin/tests - Test management
/admin/batches - Batch management
/admin/performance - Performance dashboard

/ - User dashboard home
/modules - Available modules list
/modules/:moduleId - Module detail view
/test/:testId - Test taking interface
/test-result/:attemptId - Test results
/my-scores - User's test scores
```

## API Integration

All API calls go through the `api` service which automatically:
- Adds Bearer token to all requests
- Handles 401 errors (redirects to login)
- Uses environment variable for base URL: `REACT_APP_API_URL`

## Best Practices Implemented

1. **Component Organization**: Separated admin and user components
2. **Custom Hooks**: Reusable logic with useFetch, useForm, useAuth
3. **Error Handling**: Try-catch blocks in all API calls
4. **Loading States**: Loading indicators for async operations
5. **Form Validation**: Touch tracking for form field errors
6. **Responsive Design**: Mobile-first approach with media queries
7. **Accessibility**: ARIA labels, keyboard navigation support
8. **Type Safety**: JSDoc comments for component props
9. **Code Reusability**: Shared components for common patterns
10. **State Management**: Context API for authentication, local state for components

## Getting Started

1. Install dependencies: `npm install`
2. Set environment variable: `REACT_APP_API_URL=http://localhost:5000/api`
3. Start development server: `npm start`
4. Build for production: `npm run build`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

- Lazy loading for routes
- Memoization in components
- Efficient re-renders with useCallback
- CSS transitions for smooth animations
- Optimized asset sizes
