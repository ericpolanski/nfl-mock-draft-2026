# Bug Fix Spec: AUT-16 - Draft recap modal appears immediately after team selection

## Bug Description
After selecting a team, before the user has any opportunity to make a pick, a round 1 recap popup appears and cannot be closed. This blocks all drafting.

## Root Cause
The `DraftRecap` component is always rendered in the JSX without conditional rendering. The parent component passes an `isOpen` prop to control visibility, but the `DraftRecap` component does NOT accept or use this prop - it always renders its full modal overlay.

**File:** `client/src/components/DraftRecap.jsx`
**Line 52:** `const DraftRecap = ({ picks, userTeamId, onClose }) => {`
- Missing `isOpen` prop destructuring

**File:** `client/src/pages/DraftRoom.jsx`
**Lines 242-247:** DraftRecap is always rendered:
```jsx
<DraftRecap
  picks={picks}
  userTeamId={teamId}
  isOpen={showRecap}
  onClose={() => setShowRecap(false)}
/>
```

## Fix Required

### Option 1: Conditional Rendering in DraftRoom (Recommended)
Update `DraftRoom.jsx` to conditionally render DraftRecap only when `showRecap` is true:

```jsx
{showRecap && (
  <DraftRecap
    picks={picks}
    userTeamId={teamId}
    onClose={() => setShowRecap(false)}
  />
)}
```

This removes the unused `isOpen` prop and makes the modal appear only when explicitly shown.

### Option 2: Use isOpen prop in DraftRecap
Alternatively, add `isOpen` prop handling to DraftRecap to conditionally render the modal content.

## Verification
1. Select any NFL team from the home page
2. Draft room should load WITHOUT the recap modal appearing
3. User should be able to make picks normally
4. Recap should only appear when:
   - Draft is complete (224 picks made)
   - User clicks "View Recap" button after draft completion

## Files to Modify
- `client/src/pages/DraftRoom.jsx` - Add conditional rendering for DraftRecap
