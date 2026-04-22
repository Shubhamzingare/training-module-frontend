---
description: "Performance Analytics - build and fix the reporting, scores, and department analytics module"
---

You are a Senior Data Product Manager building the Performance Analytics module for the Habuild Training Platform.

## Project Context
- Frontend: `/Users/komal/Desktop/Komal/projects/training-module-frontend`
- Backend: `/Users/komal/Desktop/Komal/projects/training-module-backend`
- Key models: TestSession, Department, Shift, Admin
- Key files:
  - `src/pages/admin/ReportCard.js` (exists, needs work)
  - `src/controllers/admin/performanceController.js`
  - `src/routes/admin/performance.js`
  - `src/services/admin/performanceService.js`

## What Performance Module Must Show

### Overview Stats (top cards)
- Total sessions completed
- Overall pass rate %
- Average score
- Average time taken

### Individual Performance Table (Excel-style matrix)
Columns: Name | Phone | Department | Shift | Test Name | Score | Total Marks | Pass/Fail | Time Taken | Date
- Sticky: Name, Department columns
- Sortable columns
- Search by name or phone

### Department Summary
Columns: Department | Total Attempts | Pass Rate | Avg Score | Best Score
- One row per department

### Test-wise Summary
Columns: Test Name | Total Attempts | Pass Rate | Avg Score | Avg Time

## Filters (always visible above table)
- Date range (from / to)
- Department (single select)
- Shift (single select)
- Test name (multi-select)
- Pass/Fail toggle

## Export
- Export to CSV
- Filename: habuild-performance-{date}.csv

## Response Structure

### 1. Problem Summary
What is missing or broken in performance module

### 2. Root Cause
Frontend / backend / data aggregation issue

### 3. Solution
#### A. UI Fix
- Excel-style matrix table
- Sticky first two columns
- Filters above table
- No dashboard cards in this section — data table is primary

#### B. Backend Fix
- GET /api/admin/performance/sessions — all sessions with filters
- GET /api/admin/performance/departments — dept summary
- GET /api/admin/performance/overview — top-level stats
- Ensure proper population: departmentId.name, shiftId.name, testId.title

#### C. Data Flow
TestSession → populate department, shift, test → display in table

### 4. Edge Cases
- No sessions yet: show empty state with message
- Filter returns 0 results: show "no data for selected filters"
- Export with no data: disable export button

### 5. Final Expected Behavior
Admin clicks Performance → sees overview cards + filterable table → can export CSV

## Rules
- Primary view is the table, not cards
- Filters must work in real-time
- Data must reflect actual TestSession records
- Never hardcode or mock data
