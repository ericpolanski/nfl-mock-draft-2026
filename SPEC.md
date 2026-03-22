# NFL 2026 Mock Draft Simulator - Engineering Specification

## Project Overview
- **Project Name**: NFL 2026 Mock Draft Simulator
- **Type**: Full-stack web application (React + Node.js/Express)
- **Core Functionality**: A polished mock draft tool where users select a team and make picks while AI controls all other teams with realistic decision-making
- **Target Users**: NFL fans, fantasy football players, draft enthusiasts

---

## Architecture

### Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Data**: Static JSON files (no database)
- **Ports**: Server: 4100, Client Dev: 4101
- **Repository**: monorepo with `/client` and `/server` directories

### Project Structure
```
/home/eric/ai-company/projects/nfl-mock-draft-2026/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── data/          # Static JSON data
│   │   ├── utils/         # Helper functions
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── public/            # Static assets
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/                # Express backend
│   ├── index.js           # Server entry point
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── data/              # Static JSON data
├── data/                  # Shared data
│   ├── teams.json
│   ├── prospects.json
│   ├── draft-order.json
│   └── pick-values.json
└── package.json
```

---

## Data Structures

### 1. NFL Teams (data/teams.json)
```json
{
  "teams": [
    {
      "id": "chi",
      "name": "Chicago Bears",
      "abbreviation": "CHI",
      "division": "NFC North",
      "conference": "NFC",
      "primaryColor": "#0B162A",
      "secondaryColor": "#C83803",
      "logo": "CHI",
      "needs": {
        "QB": 1,
        "OL": 2,
        "DL": 3
      }
    }
  ]
}
```

**All 32 teams** with realistic 2026 projected needs based on current roster gaps.

### 2. Draft Prospects (data/prospects.json)
```json
{
  "prospects": [
    {
      "id": 1,
      "name": "Alex Miller",
      "position": "QB",
      "college": "USC",
      "height": "6-3",
      "weight": "215",
      "grade": 95,
      "attributes": {
        "arm": 95,
        "accuracy": 92,
        "mobility": 88,
        "leadership": 90
      },
      "strengths": ["Elite arm talent", "Quick release", "Great leadership"],
      "weaknesses": ["Occasional happy feet", "Height average"],
      "projectedRound": 1,
      "projectedPick": 3
    }
  ]
}
```

**~250 prospects** across all positions with realistic 2026 draft projections.

### 3. 2026 Draft Order (data/draft-order.json)
- 7 rounds, 32 teams per round
- Includes compensatory picks (projected)
- Format: Array of pick objects with team reference

### 4. Jimmy Johnson Pick Values (data/pick-values.json)
Standard NFL draft pick value chart for trade calculations.

---

## API Endpoints

### Backend API (Express on port 4100)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/teams` | Get all NFL teams |
| GET | `/api/teams/:id` | Get single team |
| GET | `/api/prospects` | Get all prospects (filterable) |
| GET | `/api/prospects/:id` | Get single prospect |
| GET | `/api/draft-order` | Get draft order |
| POST | `/api/draft/start` | Initialize new draft |
| POST | `/api/draft/pick` | Make a pick |
| POST | `/api/draft/trade` | Propose/accept trade |
| GET | `/api/draft/status` | Get current draft state |
| POST | `/api/draft/sim` | Simulate AI picks forward |
| GET | `/api/pick-values` | Get pick value chart |

---

## UI Components

### Pages

1. **Home/Landing** (`/`)
   - Team selection dropdown
   - "Start Draft" button
   - Brief instructions

2. **Draft Room** (`/draft`)
   - Main drafting interface
   - All draft components assembled

### Components

1. **TeamSelector**
   - Dropdown with all 32 teams
   - Shows team colors/logo in options

2. **DraftBoard**
   - Real-time list of all picks
   - Shows pick number, team, player
   - Current pick highlighted
   - Scrollable by round

3. **OnTheClock**
   - Current picking team indicator
   - Team colors/branding
   - Timer (optional visual)

4. **PlayerPool** (Big Board)
   - List of available players
   - Sortable by position, grade, name
   - Shows player cards with key info
   - Updates as players are drafted
   - Highlights user's team needs

5. **TeamNeedsTracker**
   - Visual display of all teams' needs
   - Updates after each pick
   - Shows filled vs remaining needs

6. **DraftControls**
   - "Make Pick" button
   - "Sim Forward" button
   - "Propose Trade" button

7. **TradeModal**
   - Trade offer interface
   - Pick swap selector
   - Value calculator
   - Accept/Reject buttons

8. **DraftRecap**
   - Summary view
   - Team-by-team breakdown
   - Best value picks
   - User's picks highlight

---

## AI Draft Logic

### Decision Factors
Each AI pick considers:
1. **Best Player Available (BPA)** - Player's overall grade
2. **Team Needs** - Weighted positional needs
3. **Positional Value** - Premium positions (QB, EDGE, OT)
4. **Draft Slot Value** - Value chart considerations

### Algorithm
```
for each AI pick:
  1. Get team's positional needs (sorted by priority)
  2. Get available prospects sorted by grade
  3. Score each available player:
     score = (grade * 0.4) + (need_match * 0.4) + (positional_value * 0.2)
  4. Select highest scoring player
  5. Remove from available pool
```

### Team Needs Update
After each pick:
- If pick matches team's need → decrease need priority
- If pick is at premium position → mark as filled

---

## Trade System

### Jimmy Johnson Chart Values
| Pick | Value |
|------|-------|
| 1.01 | 3000 |
| 1.32 | 1000 |
| 2.01 | 1350 |
| ... | ... |

### Trade Logic
- **User-initiated**: User proposes trade to any AI team
- **AI-initiated**: AI occasionally offers trades (random chance ~10% per pick)
- **Value calculation**: Sum of pick values
- **Acceptance threshold**: ±15% of fair value
- **Tradeable assets**: Current round picks, future picks (placeholder)

---

## User Flows

### Flow 1: Start Draft
1. User visits homepage
2. Selects team from dropdown
3. Clicks "Start Draft"
4. Redirected to Draft Room

### Flow 2: Make Pick
1. User's turn (On The Clock)
2. PlayerPool shows available players
3. User clicks desired player
4. Pick is confirmed and displayed
5. AI picks proceed automatically

### Flow 3: Propose Trade
1. User clicks "Propose Trade"
2. Select team to trade with
3. Select picks to give/get
4. See trade value comparison
5. Submit offer
6. AI evaluates and accepts/rejects

### Flow 4: Sim Forward
1. User clicks "Sim Forward"
2. All picks until user's next turn are made
3. Draft board updates
4. User's turn again

---

## Acceptance Criteria

### Must Have
- [ ] All 32 NFL teams with correct colors and logos
- [ ] ~250 prospects with realistic data
- [ ] Complete 7-round draft order
- [ ] User can select team and make picks
- [ ] AI makes realistic picks based on needs
- [ ] Real-time draft board updates
- [ ] Player pool shows available players
- [ ] Team needs tracker works
- [ ] Trade system functional
- [ ] Sim forward works
- [ ] Mobile responsive

### Visual Checkpoints
- [ ] Team colors display correctly
- [ ] Draft board is scrollable and clear
- [ ] Current pick is highlighted
- [ ] Player cards show key info
- [ ] Trade modal is usable
- [ ] Mobile layout is functional

### Technical Checkpoints
- [ ] Server starts on port 4100
- [ ] Client dev server starts on port 4101
- [ ] Production build serves correctly
- [ ] All API endpoints respond
- [ ] No console errors
- [ ] GitHub repo created and pushed

---

## NOT IN SCOPE
- User authentication/accounts
- Real-time multiplayer (single user)
- Historical draft data
- Draft profiles/analysis beyond basic recap
- Advanced trade scenarios (multi-team trades)
- Draft password protection

---

## Implementation Priority
1. **Phase 1**: Data setup (teams, prospects, draft order, pick values)
2. **Phase 2**: Backend API (all endpoints)
3. **Phase 3**: Basic UI (team selector, draft board, player pool)
4. **Phase 4**: AI logic integration
5. **Phase 5**: Trade system
6. **Phase 6**: Polish and mobile responsive
7. **Phase 7**: Deploy to Cloudflare tunnel
