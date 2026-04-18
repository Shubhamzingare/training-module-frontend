# Quick Start Guide - Training Module Frontend

## Installation

```bash
# Navigate to project directory
cd /Users/komal/Desktop/Komal/projects/training-module-frontend

# Install dependencies
npm install
```

## Configuration

### Set Environment Variables

Create or update `.env` file in the project root:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

For production:
```env
REACT_APP_API_URL=https://your-api-domain.com/api
```

## Running the Application

### Development Mode

```bash
npm start
```

The application will open at `http://localhost:3000`

### Production Build

```bash
npm run build
```

Creates optimized build in `build/` directory.

### Testing

```bash
npm test
```

Runs test suite.

---

## 🔑 Key Features to Test

### Admin Dashboard (`/admin`)

1. **Module Management** (`/admin/modules`)
   - Create a new module
   - Edit module details
   - Delete module
   - Search and filter modules
   - Toggle module status (active/inactive)

2. **Test Management** (`/admin/tests`)
   - Create a new test
   - Link test to module
   - Set passing marks and duration
   - Publish/unpublish tests
   - Delete tests

3. **Batch Management** (`/admin/batches`)
   - Create batches (New Hires, Existing Team, Specific)
   - Assign modules to batches
   - Add/remove users
   - View batch details

4. **Performance Dashboard** (`/admin/performance`)
   - View user scores and statistics
   - Filter by module, batch, user
   - Export scores as CSV
   - View module-wise analytics

### User Dashboard (`/`)

1. **Module Browsing** (`/modules`)
   - View all available modules
   - Filter by module type
   - Search for modules
   - Click to view details

2. **Module Details** (`/modules/:moduleId`)
   - Read module content
   - Expand key points
   - Read FAQs
   - Navigate to test

3. **Take Test** (`/test/:testId`)
   - Read instructions
   - Start test
   - Answer MCQ and descriptive questions
   - Navigate between questions
   - Submit test

4. **View Results** (`/test-result/:attemptId`)
   - See score summary
   - Review correct/incorrect answers
   - Check detailed feedback

5. **My Scores** (`/my-scores`)
   - View all test attempts
   - Sort by date, score, module
   - Filter by pass/fail status
   - Access detailed results

---

## 📋 Test Data Structure

### Module Object
```javascript
{
  id: "string",
  title: "Module Title",
  description: "Module description",
  type: "new_deployment" | "wati_training",
  status: "active" | "inactive" | "draft",
  content: "Module content text",
  testId: "string" (optional),
  createdAt: "ISO date string",
  updatedAt: "ISO date string"
}
```

### Test Object
```javascript
{
  id: "string",
  title: "Test Title",
  description: "Test description",
  moduleId: "string",
  totalMarks: number,
  passingMarks: number,
  duration: number (minutes),
  isPublished: boolean,
  questions: [
    {
      id: "string",
      text: "Question text",
      type: "mcq" | "descriptive",
      marks: number,
      options: ["option1", "option2"], // for MCQ
      correctAnswer: "string"
    }
  ],
  createdAt: "ISO date string"
}
```

### Batch Object
```javascript
{
  id: "string",
  name: "Batch Name",
  description: "Batch description",
  type: "new_hires" | "existing_team" | "specific",
  memberCount: number,
  moduleCount: number,
  createdAt: "ISO date string"
}
```

---

## 🔌 API Integration

The frontend expects the following endpoints:

### Modules
- `GET /api/modules` - List modules
- `GET /api/modules/:id` - Get module details
- `GET /api/modules/:id/content` - Get key points and FAQs
- `POST /api/modules` - Create module
- `PUT /api/modules/:id` - Update module
- `DELETE /api/modules/:id` - Delete module
- `PATCH /api/modules/:id/status` - Toggle status
- `POST /api/modules/upload` - Upload and create

### Tests
- `GET /api/tests` - List tests
- `GET /api/tests/:id` - Get test details
- `POST /api/tests` - Create test
- `PUT /api/tests/:id` - Update test
- `DELETE /api/tests/:id` - Delete test
- `PATCH /api/tests/:id/publish` - Publish/unpublish
- `POST /api/tests/:id/questions` - Add question
- `PUT /api/tests/:id/questions/:qid` - Update question
- `DELETE /api/tests/:id/questions/:qid` - Delete question
- `PATCH /api/tests/:id/questions/reorder` - Reorder questions
- `POST /api/tests/:id/submit` - Submit test
- `GET /api/tests/:id/attempts/:attemptId` - Get result

### Batches
- `GET /api/batches` - List batches
- `GET /api/batches/:id` - Get batch
- `POST /api/batches` - Create batch
- `PUT /api/batches/:id` - Update batch
- `DELETE /api/batches/:id` - Delete batch
- `POST /api/batches/:id/modules` - Assign modules
- `POST /api/batches/:id/members` - Add member
- `DELETE /api/batches/:id/members/:uid` - Remove member

### Performance
- `GET /api/performance/scores` - User scores
- `GET /api/performance/statistics` - Stats
- `GET /api/performance/my-scores` - Current user scores
- `GET /api/performance/export/csv` - Export CSV

---

## 🎨 Component Usage Examples

### Using the Modal
```javascript
import Modal from '../components/common/Modal';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  onConfirm={handleConfirm}
  confirmText="Delete"
>
  Are you sure?
</Modal>
```

### Using Toast
```javascript
import Toast from '../components/common/Toast';

<Toast
  message="Success!"
  type="success"
  onClose={() => setToast(null)}
  duration={3000}
/>
```

### Using Table
```javascript
import Table from '../components/common/Table';

<Table
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true }
  ]}
  data={users}
  pageSize={10}
/>
```

### Using useFetch
```javascript
import useFetch from '../hooks/useFetch';

const { data, status, error, refetch } = useFetch(
  () => moduleService.getAllModules(),
  []
);

if (status === 'loading') return <div>Loading...</div>;
if (error) return <div>Error: {error.message}</div>;

return <div>{data?.data?.map(m => <div key={m.id}>{m.title}</div>)}</div>;
```

### Using useForm
```javascript
import useForm from '../hooks/useForm';

const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm(
  { name: '', email: '' },
  async (values) => {
    await api.post('/users', values);
  }
);

return (
  <form onSubmit={handleSubmit}>
    <input name="name" value={values.name} onChange={handleChange} />
    <button type="submit">Submit</button>
  </form>
);
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm start
```

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### API Connection Issues
1. Verify `REACT_APP_API_URL` in `.env`
2. Ensure backend server is running
3. Check CORS configuration in backend
4. Verify JWT token in localStorage

### Build Errors
```bash
# Clear cache
npm cache clean --force

# Reinstall dependencies
npm install --force

# Rebuild
npm run build
```

---

## 📁 Important Files Location

| File | Purpose |
|------|---------|
| `.env` | Environment variables |
| `src/App.js` | Main routing |
| `src/services/api.js` | API configuration |
| `src/context/AuthContext.js` | Auth state management |
| `src/constants.js` | App-wide constants |
| `FRONTEND_ARCHITECTURE.md` | Detailed documentation |

---

## 🚀 Deployment

### To Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### To Netlify
```bash
# Build first
npm run build

# Then deploy 'build' folder to Netlify
```

### Environment Variables
Make sure to set `REACT_APP_API_URL` in your hosting platform's environment variables.

---

## 📚 Documentation

For detailed information, see:
- **Architecture**: `FRONTEND_ARCHITECTURE.md`
- **Build Details**: `BUILD_SUMMARY.md`
- **Component API**: JSDoc comments in each component file

---

## 💡 Tips

1. **Hot Reload**: Changes are auto-reloaded during development
2. **React DevTools**: Install browser extension for debugging
3. **API Testing**: Use Postman to test API endpoints
4. **CSS Changes**: Check browser cache if styles don't update
5. **Token Expiry**: Logout and login again if token expires

---

## 🆘 Getting Help

If you encounter issues:

1. Check the console (F12) for error messages
2. Review `FRONTEND_ARCHITECTURE.md` for component details
3. Check API responses with Postman
4. Verify environment variables are set correctly
5. Clear browser cache and local storage

---

**Ready to go!** Start with `npm start` and navigate to `http://localhost:3000` 🚀
