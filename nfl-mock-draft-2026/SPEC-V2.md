# NFL Mock Draft Simulator V2 Specification

**Version:** 2.0
**Project:** NFL Mock Draft 2026 Simulator
**Priority:** High
**Ticket:** AUT-38

## 1. Overview

V2 is a comprehensive rewrite of the NFL Mock Draft Simulator addressing critical data quality issues, broken draft simulation logic, and generic frontend design. This specification establishes the requirements for a professional-grade mock draft experience matching the quality of PFF Mock Draft and NFL Mock Draft Database.

---

## 2. Data Sources & Accuracy

### 2.1 Prospect Data (Big Board) — CRITICAL

**Source:** https://www.nflmockdraftdatabase.com/big-boards/2026/consensus-big-board-2026

**Scraping Requirements:**
- Use `scrapfly-scraper` skill with `asp=True` (Anti-Scraping Protection bypass)
- API key: `SCRAPFLY_API_KEY` environment variable
- If HTML is complex, use `scrapfly-extraction` skill for structured data extraction

**Data Fields to Extract:**
| Field | Type | Description |
|-------|------|-------------|
| id | number | Unique prospect ID |
| name | string | Player full name |
| position | string | Position abbreviation (QB, RB, WR, TE, OT, OG, C, DL, EDGE, LB, CB, S, K, P) |
| college | string | University name |
| height | string | Height in format "6'4\"" |
| weight | number | Weight in pounds |
| consensusRank | number | Overall big board ranking |
| projectedRound | number | 1-7 |
| projectedPick | number \| null | Estimated pick number |
| grade | number | Prospect grade (0-100) |
| strengths | string[] | 2-3 key strengths |
| weaknesses | string[] | 1-2 weaknesses |

**Storage:** `data/prospects.json`

**Acceptance Criteria:**
- [ ] Minimum 200 prospects scraped
- [ ] All fields populated (no empty height/weight)
- [ ] Grades from consensus big board
- [ ] No AI-generated/fake player data

### 2.2 Draft Order — CRITICAL

**Requirements:**
- All 7 rounds (224 picks)
- Accurate team assignments including traded picks
- Cross-reference multiple sources for 2026 draft order

**Data Structure:**
```json
{
  "round": 1-7,
  "pick": 1-32,
  "teamId": "team_abbreviation",
  "overallPick": 1-224,
  "tradedFrom": "original_team_id" // null if not traded
}
```

**Storage:** `data/draft-order.json`

**Acceptance Criteria:**
- [ ] Exactly 224 picks
- [ ] Round 1 matches actual 2026 NFL Draft order
- [ ] All traded picks correctly assigned
- [ ] Each pick has teamId and overallPick

### 2.3 Team Needs

**Requirements:**
- Research actual 2026 team needs based on:
  - 2025 season results
  - Free agency moves (as of March 2026)
  - Current roster holes
- Each team: 3-5 prioritized positional needs

**Data Structure:**
```json
{
  "id": "team_abbreviation",
  "name": "Team Name",
  "needs": {
    "QB": 1,  // 1 = highest priority
    "OT": 2,
    "WR": 3
  }
}
```

**Storage:** `data/teams.json` (update existing)

**Acceptance Criteria:**
- [ ] All 32 NFL teams included
- [ ] Each team has 3-5 needs
- [ ] Needs reflect actual 2026 offseason analysis

---

## 3. Draft Simulation Logic

### 3.1 User Flow

```
[Landing Page] → [Select Team] → [Click Start Draft] → [Draft Room]
                                                          ↓
                                              [AI picks until user's turn]
                                                          ↓
                                              [User selects from available]
                                                          ↓
                                              [AI continues until complete]
```

### 3.2 Draft States

| State | Description |
|-------|-------------|
| IDLE | Draft not started |
| SIMULATING | AI making picks (0.5-1s delay between picks) |
| USER_TURN | Waiting for user to select |
| COMPLETE | All 224 picks made |

### 3.3 AI Selection Algorithm

**Factors (weighted):**
- Prospect grade: 40%
- Team needs priority: 40%
- Positional value: 20%

**Positional Values:**
| Position | Multiplier |
|----------|------------|
| QB | 1.5 |
| EDGE | 1.3 |
| OT | 1.25 |
| DL | 1.1 |
| CB | 1.1 |
| WR | 1.05 |
| LB | 1.0 |
| S | 0.95 |
| TE | 0.9 |
| OG | 0.85 |
| DT | 0.85 |
| RB | 0.8 |
| C | 0.8 |
| K/P | 0.3 |

**Decision Logic:**
1. Score each available prospect using weighted formula
2. Sort by score descending
3. Select top-ranked prospect
4. If no needs match, default to BPA (Best Player Available)

### 3.4 Real-Time Updates

After each pick:
- Update draft board (show new pick)
- Remove selected prospect from available pool
- Update team needs (decrement filled positions)
- Scroll draft board to current pick
- Update "On The Clock" display

**Acceptance Criteria:**
- [ ] Draft starts when user clicks "Start Draft"
- [ ] AI teams auto-select with 0.5-1s visual delay
- [ ] User's turn clearly indicated with highlight
- [ ] User can select from available prospects only
- [ ] Draft progresses through all 224 picks
- [ ] Draft board updates in real-time

---

## 4. Player Cards

### 4.1 Display Fields

Each player card shows:
- Name (bold, large)
- Position badge (color-coded by position group)
- College
- Height (format: 6'4")
- Weight (format: 245 lbs)
- Consensus rank (#15)
- Projected round (Rd 1-2)
- Grade badge
- Key strengths (2-3 bullet points)

### 4.2 Position Colors

| Position Group | Color |
|---------------|-------|
| QB | #FF6B6B (Red) |
| RB | #4ECDC4 (Teal) |
| WR | #45B7D1 (Blue) |
| TE | #96CEB4 (Green) |
| OL | #FFEAA7 (Yellow) |
| DL | #DDA0DD (Plum) |
| LB | #98D8C8 (Mint) |
| DB | #F7DC6F (Gold) |
| K/P | #BDC3C7 (Gray) |

### 4.3 Fix Required

**Current Bug:** Weight displays as "* pounds" (bullet symbol, no number)

**Fix:** Ensure weight field is populated from scraped data, display as "XXX lbs"

**Acceptance Criteria:**
- [ ] No empty height/weight fields
- [ ] Height displays in feet-inches format
- [ ] Weight displays in pounds
- [ ] All prospects have 2-3 strengths listed

---

## 5. Frontend Design Overhaul

### 5.1 Design Principles

**Theme:** Dark stadium/broadcast aesthetic
- Background: Deep navy/slate (#0f172a)
- Cards: Slightly lighter (#1e293b)
- Accents: Team colors, electric blue highlights

**Typography:**
- Headers: Bold, sports-broadcast style (e.g., Bebas Neue, Oswald)
- Body: Clean sans-serif (e.g., Inter, Roboto)
- Numbers: Monospace for draft picks

### 5.2 Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] NFL MOCK DRAFT 2026          [Round Tabs]  [Stats] │
├─────────────────────────────────────────────────────────────┤
│  DRAFT TICKER: [Recent pick 1] [Recent pick 2] [Recent 3]  │
├────────────────┬──────────────────────┬─────────────────────┤
│                │                      │                     │
│  ON THE CLOCK │    DRAFT BOARD       │   PLAYER POOL      │
│  [Team Card]  │    [Pick 1-32]       │   [Available MPs]  │
│  [Timer]      │    [Pick 33-64]      │   [Filters]        │
│  [Needs]      │    ...                │   [Search]         │
│                │                      │                     │
├────────────────┴──────────────────────┴─────────────────────┤
│  [Team Needs Tracker - All 32 Teams]                       │
└─────────────────────────────────────────────────────────────┘
```

### 5.3 Components

**On The Clock:**
- Current team logo/name
- Pick number (Round X, Pick Y)
- Pulsing "ON THE CLOCK" indicator
- Team needs display
- "Your Pick!" highlight when user's turn

**Draft Board:**
- 7 round tabs for navigation
- Auto-scroll to current pick
- Team color backgrounds for picks
- Pick cards slide in with animation
- Highlight user's picks

**Player Pool:**
- Scrollable list of available prospects
- Position filter tabs
- Search by name
- Sorted by grade (highest first)
- User's team needs highlighted

**Draft Ticker:**
- Horizontal scroll of recent 5 picks
- Auto-updates
- Click to navigate to pick

### 5.4 Animations

| Animation | Duration | Trigger |
|-----------|----------|---------|
| Pick card slide in | 300ms ease-out | New pick made |
| "On The Clock" pulse | 2s infinite | Current pick |
| Draft board scroll | 500ms smooth | Round change |
| Player card hover | 150ms | Mouse enter |
| Ticker scroll | Continuous | New pick |

### 5.5 Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Desktop | 1280px+ | 3-column full |
| Laptop | 1024px | 3-column condensed |
| Tablet | 768px | 2-column, stacked |
| Mobile | 480px | Single column |

### 5.6 Acceptance Criteria

- [ ] Dark theme with stadium/broadcast feel
- [ ] Team colors used for pick backgrounds
- [ ] Smooth animations (no jank)
- [ ] Desktop-first design
- [ ] Mobile responsive (functional on phone)
- [ ] Round navigation tabs work
- [ ] Draft ticker shows recent picks
- [ ] "On The Clock" clearly visible
- [ ] Player cards show all required info

---

## 6. Trade System

### 6.1 Jimmy Johnson Trade Chart

**Pick Values:**
| Pick | Value |
|------|-------|
| 1 | 3000 |
| 10 | 1000 |
| 20 | 500 |
| 32 | 300 |
| 50 | 150 |
| 75 | 80 |
| 100 | 40 |
| 150 | 15 |
| 200 | 5 |
| 224 | 1 |

### 6.2 Trade UI

- Select team to trade with
- Pick selection interface
- Value calculation display
- "Fair trade" indicator
- Accept/reject buttons

### 6.3 Acceptance Criteria

- [ ] Trade value chart implemented
- [ ] UI shows pick values clearly
- [ ] Fair trades auto-accepted
- [ ] Unfair trades rejected with message

---

## 7. API Endpoints

### 7.1 Existing (Keep)

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/teams | GET | All teams |
| /api/teams/:id | GET | Single team |
| /api/prospects | GET | All prospects (filterable) |
| /api/prospects/:id | GET | Single prospect |
| /api/draft-order | GET | Draft order |
| /api/pick-values | GET | Trade values |

### 7.2 Draft Endpoints (Update)

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/draft/start | POST | Start draft (param: teamId) |
| /api/draft/pick | POST | Make pick (param: prospectId) |
| /api/draft/sim | POST | Simulate to user turn |
| /api/draft/status | GET | Current draft state |
| /api/draft/trade | POST | Propose trade |
| /api/draft/auto | GET | Start auto-draft mode |

### 7.3 New Endpoint: /api/draft/auto

**Purpose:** Start continuous auto-draft mode where AI picks with delays

**Response:**
```json
{
  "mode": "auto",
  "currentPick": 1,
  "delay": 750
}
```

---

## 8. File Structure

```
nfl-mock-draft-2026/
├── SPEC-V2.md                 # This specification
├── data/
│   ├── prospects.json         # Scraped big board data
│   ├── draft-order.json       # 224 picks with trades
│   ├── teams.json             # 32 teams with needs
│   └── pick-values.json       # Jimmy Johnson chart
├── server/
│   └── index.js               # Express server (update)
├── scrape_big_board.py        # Scraper script (new)
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── DraftBoard.jsx
    │   │   ├── OnTheClock.jsx
    │   │   ├── PlayerPool.jsx
    │   │   ├── DraftTicker.jsx
    │   │   ├── TeamNeedsTracker.jsx
    │   │   ├── PlayerCard.jsx (new)
    │   │   └── ...
    │   ├── hooks/
    │   │   └── useDraft.js
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   └── DraftRoom.jsx
    │   ├── styles/
    │   │   └── animations.css (new)
    │   └── data/
    │       └── ...
    └── package.json
```

---

## 9. Implementation Phases

### Phase 1: Data (Backend)
- [ ] Scrape big board from nflmockdraftdatabase.com
- [ ] Validate/fix draft order (all 224 picks)
- [ ] Update team needs
- [ ] Update server endpoints

### Phase 2: Draft Logic (Backend)
- [ ] Fix AI selection algorithm
- [ ] Add pick delay for visual effect
- [ ] Implement auto-draft mode
- [ ] Test full 224-pick simulation

### Phase 3: Frontend Components
- [ ] Redesign OnTheClock component
- [ ] Redesign DraftBoard with animations
- [ ] Redesign PlayerPool with filters
- [ ] Add DraftTicker component
- [ ] Fix PlayerCard display (height/weight)

### Phase 4: Design & Polish
- [ ] Apply dark stadium theme
- [ ] Add team color accents
- [ ] Implement animations
- [ ] Responsive layout
- [ ] Trade system UI

### Phase 5: QA & Deploy
- [ ] Full QA pass
- [ ] Fix any bugs
- [ ] Deploy to production

---

## 10. Acceptance Criteria Summary

- [ ] Prospect data from nflmockdraftdatabase.com (no AI garbage)
- [ ] All 224 picks accurate including trades
- [ ] Team needs reflect actual 2026 analysis
- [ ] Draft simulation runs pick-by-pick with visible AI
- [ ] Player cards show real height/weight/stats
- [ ] Frontend has polished sports-broadcast aesthetic
- [ ] Trade system functional with clear values
- [ ] Full QA pass before deploy

---

## 11. Out of Scope

The following items are explicitly NOT included in V2:
- Real-time multiplayer (future V3)
- Draft room chat (future V3)
- Historical draft comparisons (future V3)
- Draft analytics dashboard (future V3)
- Mobile app (future V4)

---

*Specification created: 2026-03-22*
*Ticket: AUT-38*
