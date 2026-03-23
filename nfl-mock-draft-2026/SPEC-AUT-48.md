# NFL Mock Draft Simulator V3 Specification - Frontend Overhaul

**Version:** 3.0
**Project:** NFL Mock Draft 2026 Simulator
**Priority:** High
**Ticket:** AUT-48

## 1. Overview

V3 is a comprehensive frontend overhaul addressing critical UX bugs and transforming the UI from a generic prototype into a premium draft simulator experience. This specification focuses on frontend-only changes using Framer Motion for animations.

---

## 2. Critical Bugs to Fix

### 2.1 Draft Board Shows "On the clock..." for ALL Picks

**Root Cause:** Backend stores pick data with flat fields (`prospectName`, `position`, `college`) but frontend expects nested `prospect` object. Frontend tries to find prospect from `availableProspects` array, but after a pick is made, that prospect is removed from available prospects, so it returns `undefined`.

**Fix:** Modify the data transformation in `useDraft.js` to use the backend's flat fields directly instead of trying to look up from available prospects.

**Current (broken):**
```js
// useDraft.js line 48-55
const transformedPicks = (draftData.picks || []).map(pick => ({
  position: pick.overallPick,
  round: pick.round,
  pick: pick.pick,
  teamId: pick.teamId,
  prospectId: pick.prospectId,
  prospect: draftData.availableProspects?.find(p => p.id === pick.prospectId), // BROKEN - prospect removed from availableProspects after pick
}));
```

**Fixed:**
```js
const transformedPicks = (draftData.picks || []).map(pick => ({
  position: pick.overallPick,
  round: pick.round,
  pick: pick.pick,
  teamId: pick.teamId,
  prospectId: pick.prospectId,
  prospect: pick.prospectId ? {
    id: pick.prospectId,
    name: pick.prospectName,
    position: pick.position,
    college: pick.college,
    grade: pick.grade || 0
  } : null,
}));
```

**Acceptance Criteria:**
- [ ] Completed picks show player name, position badge, college
- [ ] "On the clock..." only shows for upcoming picks (currentPick and beyond)

### 2.2 No Draft Animation - All AI Picks Instant

**Current Behavior:** When user clicks "Start Draft" or "Simulate Forward", all AI picks appear instantly with no visual feedback.

**Required Behavior:** Each AI pick should animate in with ~500ms delay, allowing users to watch the draft unfold.

**Implementation Approach:**

1. Create a new state `animatedPicks` that starts empty and grows
2. Use `setTimeout` or interval to add picks one-by-one with animation
3. Use Framer Motion `AnimatePresence` for smooth card flip/slide-in effects

```jsx
// DraftBoard.jsx - animation approach
import { motion, AnimatePresence } from 'framer-motion';

// In the component:
const [displayedPicks, setDisplayedPicks] = useState([]);

// When new picks come in:
useEffect(() => {
  const newPicks = picks.slice(displayedPicks.length);
  newPicks.forEach((pick, index) => {
    setTimeout(() => {
      setDisplayedPicks(prev => [...prev, pick]);
    }, index * 500); // 500ms delay between each pick
  });
}, [picks]);
```

**Acceptance Criteria:**
- [ ] AI picks animate in one-by-one with ~500ms delay
- [ ] Animation is smooth (card flip or slide-in)
- [ ] "Speed Up" / "Skip" button to jump ahead
- [ ] Auto-scroll follows current pick during animation

---

## 3. Design Requirements

### 3.1 General Design

- **UI Library:** Install and use Framer Motion for animations
- **Design Aesthetic:** Premium dark theme, NOT generic AI-generated look
- **Theme:** Dark stadium/broadcast aesthetic (keep V2 colors but elevate)
- **Responsive:** Must work on mobile (480px+)

**Installation:**
```bash
cd nfl-mock-draft-2026/client
npm install framer-motion
```

### 3.2 Draft Board (Center Column)

**Current State:** Shows picks with round tabs, but:
- Shows "On the clock..." for ALL picks (BUG)
- No team color accents
- Basic animations

**Requirements:**

| Element | Description |
|---------|-------------|
| Completed Picks | Show: player name, position badge (colored), college, team color accent bar |
| Current Pick | Highlighted with pulsing glow effect, larger text |
| Upcoming Picks | Show only team name/abbreviation |
| Round Tabs | Show pick count per round (e.g., "R1 (12)" not "R1 (0)") |
| Auto-scroll | Smooth scroll to current pick |

**Visual Design:**
```
┌─────────────────────────────────────┐
│ [Pick 1.1] [Team Logo] Player Name │
│              [QB] [Alabama] [Grade] │
├─────────────────────────────────────┤
│ [Pick 1.2] [Team Logo] Player Name │
│              [WR] [Ohio State] [A-] │
├─────────────────────────────────────┤
│ ★ [Pick 1.3] [Team Logo] ON THE CLOCK │
│              (pulsing highlight)     │
├─────────────────────────────────────┤
│ [Pick 1.4] [Team Logo] ----         │
│              (future pick - team only)│
└─────────────────────────────────────┘
```

### 3.3 Draft Animation System

**Animation Specifications:**

| Animation | Duration | Easing | Trigger |
|-----------|----------|--------|---------|
| Pick card slide-in | 400ms | easeOut | New pick made |
| Card flip (optional) | 500ms | spring | New pick made |
| "On The Clock" pulse | 2s | infinite | Current pick |
| Auto-scroll | 500ms | smooth | Pick change |

**Speed Controls:**
- "Watch" mode: ~500ms per pick (default)
- "Speed Up" button: Reduces to ~100ms per pick
- "Skip" button: Instant completion

### 3.4 Player Pool (Right Column)

**Current State:** Basic cards with name, position, college, grade

**Requirements:**

| Element | Description |
|---------|-------------|
| Player Cards | More visual weight - team color gradient border when matches need |
| Click Interaction | Opens detailed modal/drawer with full scouting report |
| Need Badges | Prominent "Need #1", "Need #2" badges |
| Position Styling | Position-specific card styling (border colors) |

**Player Detail Modal:**
- Full scouting report (strengths, weaknesses)
- Additional stats (height, weight, school stats)
- Grade visualization
- "Make Pick" button (when it's user's turn)

### 3.5 On The Clock Panel (Left Column)

**Current State:** Shows current team, pick number, basic needs

**Requirements:**

| Element | Description |
|---------|-------------|
| User Turn | OBVIOUS - glow effect, larger text, "YOUR PICK!" banner |
| Countdown | Optional countdown timer (30s default) |
| Mini Report | Top recommended pick with quick stats |
| Trade Button | Opens trade modal |

**Visual for User Turn:**
```
┌────────────────────────────┐
│  ⚡ YOUR PICK! ⚡          │
│                            │
│  [Team Logo]              │
│  Tennessee Titans         │
│                            │
│  Round 1 • Pick 8          │
│                            │
│  Recommended:              │
│  ┌──────────────────────┐  │
│  │ Ashton Jeanty        │  │
│  │ RB • Boise State     │  │
│  │ Grade: 95            │  │
│  └──────────────────────┘  │
│                            │
│  [MAKE PICK]              │
└────────────────────────────┘
```

### 3.6 Draft Recap

**Requirements:**

| Element | Description |
|---------|-------------|
| Pick Grades | A+, A, A-, B+, B, B-, C+, C, C-, D+, D |
| Grade Logic | Compare pick value vs. prospect grade |
| Team Summary | Team-by-team breakdown |
| Highlights | Best picks / worst picks |

**Grade Calculation:**
- A+ / A: Great value (grade significantly higher than pick value)
- B: Good pick (grade matches pick value)
- C: Reach (grade lower than pick value)
- D: Poor pick (significant reach with low grade)

---

## 4. Technical Implementation

### 4.1 File Structure Changes

```
nfl-mock-draft-2026/client/src/
├── components/
│   ├── DraftBoard.jsx      # Fix data transform, add animations
│   ├── OnTheClock.jsx      # Add user turn glow, mini report
│   ├── PlayerPool.jsx      # Add modal trigger
│   ├── PlayerCard.jsx      # Update for better styling
│   ├── PlayerDetailModal.jsx  # NEW - scouting report modal
│   ├── DraftControls.jsx   # Add speed controls
│   └── ...
├── hooks/
│   └── useDraft.js         # Fix pick data transformation
├── pages/
│   └── DraftRoom.jsx       # Add animation orchestration
├── styles/
│   └── animations.css      # Additional CSS animations
└── ...
```

### 4.2 Dependencies

```json
// package.json additions
{
  "dependencies": {
    "framer-motion": "^11.0.0"
  }
}
```

### 4.3 Animation Component Example

```jsx
// components/PickCard.jsx
import { motion } from 'framer-motion';

const PickCard = ({ pick, isActive, isNew }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`pick-card ${isActive ? 'active' : ''}`}
    >
      {/* pick content */}
    </motion.div>
  );
};
```

---

## 5. Acceptance Criteria

### Critical Bugs
- [ ] Draft board shows player name/position for completed picks
- [ ] "On the clock..." only shows for future picks
- [ ] AI picks animate in with ~500ms delay
- [ ] Auto-scroll follows current pick during animation

### Design
- [ ] Framer Motion used for all animations
- [ ] UI does NOT look AI-generated - has visual personality
- [ ] User turn is visually obvious (glow, animation, emphasis)
- [ ] Player detail modal when clicking a prospect
- [ ] Draft recap screen with grades

### Responsive
- [ ] Mobile layout works (480px+)
- [ ] Touch interactions work on mobile

### Technical
- [ ] npm install framer-motion completes without errors
- [ ] npm run build completes without errors
- [ ] Both domains serve the updated frontend

---

## 6. NOT in Scope

The following items are explicitly NOT included in V3:
- Real-time multiplayer (future V4)
- Sound effects (future consideration)
- Advanced analytics dashboard (future V4)
- Export draft results to PDF (future V4)
- Dark mode toggle (light mode not supported in V3)

---

## 7. What Already Exists

| Component | Status | Notes |
|-----------|--------|-------|
| DraftBoard.jsx | Exists | Needs bug fix + animation upgrade |
| OnTheClock.jsx | Exists | Needs user turn enhancement |
| PlayerPool.jsx | Exists | Needs modal trigger |
| PlayerCard.jsx | Exists | Basic - needs visual upgrade |
| DraftRecap.jsx | Exists | Basic - needs grade display |
| useDraft.js hook | Exists | Needs data transformation fix |
| V2 dark theme | Exists | Keep and refine |

---

## 8. Testing Plan

### Manual QA Checklist

1. **Bug Verification**
   - [ ] Start draft, verify completed picks show player names
   - [ ] Verify "On the clock..." only shows for future picks

2. **Animation Testing**
   - [ ] Start draft, watch picks animate in one-by-one
   - [ ] Test "Speed Up" button
   - [ ] Test "Skip" button
   - [ ] Verify auto-scroll works

3. **User Turn**
   - [ ] When user's turn, verify glow effect visible
   - [ ] Verify "YOUR PICK!" text prominent

4. **Player Modal**
   - [ ] Click player card, verify modal opens
   - [ ] Verify all scouting info displays

5. **Draft Recap**
   - [ ] Complete draft, verify recap shows
   - [ ] Verify pick grades display

6. **Responsive**
   - [ ] Test on mobile viewport (480px)
   - [ ] Verify layout adapts correctly

---

*Specification created: 2026-03-22*
*Ticket: AUT-48*
*Assignee: Frontend Engineer*
