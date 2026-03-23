# SPEC-AUT-103: Frontend Only Shows 20 Jobs Despite API Returning 82

## Problem
Frontend job board only displays 20 jobs even though API returns 82.

## Root Cause
In `jhunter/client/src/pages/JobBoard.jsx`, the pagination state is initialized with a hardcoded `limit: 20`:
```javascript
const [pagination, setPagination] = useState({ limit: 20, offset: 0 });
```

## Fix Required
Change the `limit` from `20` to `500` (to match the API's limit of 500).

## Changes
- File: `jhunter/client/src/pages/JobBoard.jsx`
- Line 18: Change `{ limit: 20, offset: 0 }` to `{ limit: 500, offset: 0 }`

## Verification
1. Start the frontend dev server
2. Navigate to the Job Board page
3. Verify that all jobs (82+) are displayed without pagination
