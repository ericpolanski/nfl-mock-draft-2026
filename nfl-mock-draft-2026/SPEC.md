# NFL 2026 Mock Draft Simulator - Specification

## Project Overview

**Project:** NFL 2026 Mock Draft Simulator
**Type:** Web Application (React SPA)
**Location:** `/home/eric/ai-company/projects/nfl-mock-draft-2026/`
**Frontend Port:** 4101 (dev)
**Backend Port:** 4100

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend:** Express.js (separate server on port 4100)
- **Data:** JSON files (teams.json, prospects.json, draft-order.json, pick-values.json)

## Pages

### 1. Home/Landing Page (`/`)

**Components:**
- Hero section with app title "NFL 2026 Mock Draft Simulator"
- Team selector dropdown showing all 32 NFL teams with their colors
- Start Draft button (enabled when team is selected)
- Feature cards highlighting key functionality

**Features:**
- Displays team logo/color in selector
- Shows team division after selection
- Responsive design for mobile/desktop

### 2. Draft Room Page (`/draft`)

**Route:** `/draft?team={teamId}`

**Layout (3-column grid):**
1. Left Column (3 cols):
   - OnTheClock component
   - DraftControls component
   - User Team Needs display

2. Center Column (5 cols):
   - DraftBoard component

3. Right Column (4 cols):
   - PlayerPool component

**Below Grid:**
- TeamNeedsTracker component (full width)

## Components

### TeamSelector
- Dropdown with all 32 NFL teams
- Shows team name and abbreviation
- Displays team colors and logo after selection
- Uses team primaryColor for selection badge

### DraftBoard
- Scrollable list of picks organized by round
- 7 rounds, 224 total picks
- Highlights active pick
- Shows team colors and prospect info
- Auto-scrolls to current pick

### OnTheClock
- Displays current picking team
- Shows round and pick number
- Visual indicator when it's user's turn
- Team color styling

### PlayerPool
- List of available prospects
- Sorting: by grade, name, position
- Filtering: by position
- Search by player name or college
- Highlights prospects matching team needs
- Grade display for each prospect

### TeamNeedsTracker
- All 32 teams with their needs
- Visual indicators for filled needs
- Expandable team details

### DraftControls
- Sim Forward button (when not user's turn)
- Propose Trade button (when user's turn)
- Reset button
- Loading states

### TradeModal
- Select team to trade with
- Choose picks to give/receive
- Jimmy Johnson value display
- Accept/Reject functionality

### DraftRecap
- Summary of draft when complete
- User's draft picks highlighted
- Statistics

## API Integration

### Backend Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/teams | Get all 32 NFL teams |
| GET | /api/teams/:id | Get single team |
| GET | /api/prospects | Get prospects (filterable) |
| GET | /api/draft-order | Get full draft order |
| GET | /api/pick-values | Get Jimmy Johnson chart |
| POST | /api/draft/start | Initialize draft |
| POST | /api/draft/pick | Make a pick |
| POST | /api/draft/sim | Simulate AI picks |
| GET | /api/draft/status | Get current draft state |
| POST | /api/draft/trade | Propose trade |

### Frontend Hook

`useDraft(userTeamId)` - Custom hook managing:
- Draft initialization via /api/draft/start
- Pick making via /api/draft/pick
- AI simulation via /api/draft/sim
- Status polling via /api/draft/status
- Fallback to local mock data if backend unavailable

## Visual Design

### Colors
- Uses Tailwind's slate color palette for backgrounds
- Team-specific primary/secondary colors for visual distinction
- Cyan accent color for interactive elements

### Typography
- Default system fonts (Tailwind default)
- Clear hierarchy with font weights

### Layout
- Responsive grid layout
- Card-based component styling
- Fixed header in draft room

## Data Models

### Team
```json
{
  "id": "mia",
  "name": "Miami Dolphins",
  "abbreviation": "MIA",
  "division": "AFC East",
  "conference": "AFC",
  "primaryColor": "#006158",
  "secondaryColor": "#F26522",
  "needs": { "EDGE": 1, "LB": 2, "S": 3 }
}
```

### Prospect
```json
{
  "id": 1,
  "name": "John Smith",
  "position": "QB",
  "college": "USC",
  "height": "6-2",
  "weight": 215,
  "grade": 85,
  "strengths": ["Arm strength", "Mobility"],
  "weaknesses": ["Decision making"],
  "projectedRound": 1
}
```

### Draft Pick
```json
{
  "round": 1,
  "pick": 1,
  "teamId": "mia",
  "overallPick": 1
}
```

## Implementation Notes

1. The frontend is designed to work with or without the backend
2. Falls back to local mock data when backend is unavailable
3. Polls draft status every 5 seconds for real-time updates
4. Auto-scrolls draft board to current pick
5. Highlights user's picks in draft board
6. Position badges have color coding for quick identification

## Acceptance Criteria

1. [x] Home page loads with team selector
2. [x] Can select team and navigate to draft room
3. [x] Draft board displays all picks by round
4. [x] Player pool shows available prospects
5. [x] Can make picks when it's user's turn
6. [x] AI teams make picks automatically
7. [x] Sim forward works correctly
8. [x] Team needs are tracked and displayed
9. [x] Trade modal is functional
10. [x] Draft recap shows at end
11. [x] Mobile responsive design
12. [x] Backend API integration works
