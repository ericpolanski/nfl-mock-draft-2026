# AUT-25: Add Start Button to Begin AI Draft Selections

## 1. Problem Statement

**Issue:** There is no Start button. After selecting a team, the user enters the draft room but the AI teams do not begin making picks automatically.

**Root Cause:** Currently, the draft auto-starts when entering the draft room (via useEffect in useDraft.js). However, the user wants a prominent "Start Draft" button they can click to begin the AI selections. This provides better UX control and visibility into when the draft begins.

## 2. Expected Behavior

1. User selects their team on home page
2. User enters draft room at `/draft?team={teamId}`
3. **New:** User sees a prominent "Start Draft" or "Start" button
4. User clicks the button
5. AI teams begin making their picks (auto-simulate to user's turn)
6. User makes their pick when it's their turn

## 3. Implementation Approach

### Frontend Changes (React)

**Files to modify:**
- `client/src/pages/DraftRoom.jsx`
- `client/src/hooks/useDraft.js`

**Changes to useDraft.js:**
1. Remove automatic draft start on mount (useEffect that calls `/api/draft/start`)
2. Add a `startDraft()` function that can be called externally
3. Keep `isStarted` as `false` initially until user clicks Start button

**Changes to DraftRoom.jsx:**
1. Add prominent "Start Draft" button that appears before draft starts
2. When clicked, call `startDraft()` from useDraft hook
3. After successful start, hide Start button and show normal draft UI

**UI Specification:**
- Start button should be prominent and centered in the draft room
- Use gradient styling (cyan/blue) similar to other primary actions
- Button text: "Start Draft" or "Start"
- Show loading state while AI picks are being simulated

### Backend Changes (Express)

No backend changes required. The existing `/api/draft/start` endpoint works correctly.

## 4. Technical Details

### API Endpoint
- `POST /api/draft/start` - Accepts `{ teamId }`, simulates AI picks to user's turn, returns draft state
- Already exists and works correctly

### State Flow
```
Initial: isStarted = false, picks = []
  |
  v
User clicks "Start Draft" button
  |
  v
Call POST /api/draft/start { teamId }
  |
  v
Backend: simulateToUserPick() runs
  |
  v
Response: draft state with picks (AI picks made, now user's turn)
  |
  v
Update state: isStarted = true, picks = [AI picks...]
```

## 5. Acceptance Criteria

- [ ] User sees a prominent "Start Draft" button when entering draft room
- [ ] Clicking the button triggers AI picks simulation
- [ ] After clicking, AI teams have made picks up to user's turn
- [ ] Start button is hidden/disabled after draft begins
- [ ] User can make their pick when it's their turn

## 6. Files to Modify

1. `client/src/hooks/useDraft.js` - Add startDraft function, remove auto-start
2. `client/src/pages/DraftRoom.jsx` - Add Start button UI

## 7. Risk Assessment

- **Low risk** - Simple UI addition, no architectural changes
- **No database changes** - Uses existing JSON data
- **No new dependencies** - Uses existing React patterns
