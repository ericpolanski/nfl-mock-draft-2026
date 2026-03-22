# Engineering Specification: AUT-24 Fix Team Selection

## Bug Description

When a user selects their team from the dropdown on the home page, the wrong team (or no team) is set in the draft room. The team selection is unreliable.

## Root Cause Analysis

### Issue Location
File: `client/src/utils/api.js`, line 133

### Problem
The API utility `startDraft()` sends `userTeamId` in the request body:
```javascript
body: JSON.stringify({ userTeamId }),
```

But the backend at `server/index.js`, line 120 expects `teamId`:
```javascript
const { teamId } = req.body;
```

This property name mismatch causes the backend to receive `undefined` for `teamId`, resulting in:
- Backend returns 400 error: "Team ID is required"
- Draft room doesn't properly recognize the user's selected team

### Code Flow
1. Home.jsx: User selects team → `navigate(/draft?team=chi)`
2. DraftRoom.jsx: Reads `teamId` from URL params → passes to `useDraft(teamId)`
3. useDraft.js: Sends `{ teamId: userTeamId }` to backend via fetch
4. **BUG**: api.js utility wraps with `{ userTeamId }` instead of `{ teamId }`
5. Backend: Receives `{ userTeamId: 'chi' }` but looks for `teamId` → gets `undefined`
6. Result: Error response, team not properly set

## Fix Required

Change line 133 in `client/src/utils/api.js` from:
```javascript
body: JSON.stringify({ userTeamId }),
```

To:
```javascript
body: JSON.stringify({ teamId: userTeamId }),
```

## Files to Modify

| File | Line | Change |
|------|------|--------|
| `client/src/utils/api.js` | 133 | Rename `userTeamId` to `teamId` in request body |

## Verification Steps

1. Select "Chicago Bears" from team dropdown
2. Click "Start Draft"
3. Verify URL is `/draft?team=chi`
4. Verify draft room shows "Chicago Bears" as user team
5. Verify "Your Team Needs" section displays Bears needs (QB, OT, WR, DL, CB)
6. Test with different teams to confirm fix works for all 32 teams

## NOT in Scope

- Backend validation enhancement (current error message is sufficient)
- Team ID format validation (already validated by frontend dropdown)
- Additional error handling for network failures (already exists)

## What Already Exists

- Frontend team selector with all 32 NFL teams
- URL parameter passing from Home to DraftRoom
- Backend team validation and lookup
- Error handling for missing team ID

## Test Plan

Manual verification:
1. Select any team from dropdown → navigate to draft room → verify correct team displayed
2. Test with at least 3 different teams (e.g., Bears, Chiefs, 49ers) to confirm fix

## Completion Criteria

- [ ] Fix applied to api.js line 133
- [ ] Build succeeds
- [ ] Team selection works correctly for all 32 teams
- [ ] No console errors on team selection
