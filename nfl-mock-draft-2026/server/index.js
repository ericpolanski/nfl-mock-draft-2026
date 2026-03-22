import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load data files
const teams = JSON.parse(readFileSync(join(__dirname, '..', 'data', 'teams.json'), 'utf-8')).teams;
const prospects = JSON.parse(readFileSync(join(__dirname, '..', 'data', 'prospects.json'), 'utf-8')).prospects;
const draftOrder = JSON.parse(readFileSync(join(__dirname, '..', 'data', 'draft-order.json'), 'utf-8')).draftOrder;
const pickValues = JSON.parse(readFileSync(join(__dirname, '..', 'data', 'pick-values.json'), 'utf-8')).pickValues;

const app = express();
app.use(cors());
app.use(express.json());

// In-memory draft state
let draftState = {
  isActive: false,
  currentPickIndex: 0,
  userTeamId: null,
  picks: [],
  trades: [],
  availableProspects: [],
  teamNeeds: {}
};

// Initialize team needs
function initializeTeamNeeds() {
  const needs = {};
  teams.forEach(team => {
    needs[team.id] = { ...team.needs };
  });
  return needs;
}

// Positional values for AI scoring
const positionalValues = {
  'QB': 1.5,
  'EDGE': 1.3,
  'OT': 1.25,
  'DL': 1.1,
  'CB': 1.1,
  'WR': 1.05,
  'LB': 1.0,
  'S': 0.95,
  'TE': 0.9,
  'OG': 0.85,
  'DT': 0.85,
  'RB': 0.8,
  'C': 0.8,
  'K': 0.3,
  'P': 0.3
};

// API Routes

// GET /api/teams - Get all NFL teams
app.get('/api/teams', (req, res) => {
  res.json(teams);
});

// GET /api/teams/:id - Get single team
app.get('/api/teams/:id', (req, res) => {
  const team = teams.find(t => t.id === req.params.id);
  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }
  res.json(team);
});

// GET /api/prospects - Get all prospects (filterable)
app.get('/api/prospects', (req, res) => {
  let result = [...prospects];

  if (req.query.position) {
    result = result.filter(p => p.position === req.query.position);
  }
  if (req.query.minGrade) {
    result = result.filter(p => p.grade >= parseInt(req.query.minGrade));
  }
  if (req.query.round) {
    result = result.filter(p => p.projectedRound === parseInt(req.query.round));
  }

  res.json(result);
});

// GET /api/prospects/:id - Get single prospect
app.get('/api/prospects/:id', (req, res) => {
  const prospect = prospects.find(p => p.id === parseInt(req.params.id));
  if (!prospect) {
    return res.status(404).json({ error: 'Prospect not found' });
  }
  res.json(prospect);
});

// GET /api/draft-order - Get draft order
app.get('/api/draft-order', (req, res) => {
  res.json(draftOrder.map(pick => {
    const team = teams.find(t => t.id === pick.teamId);
    return {
      ...pick,
      teamName: team ? team.name : 'Unknown',
      teamAbbreviation: team ? team.abbreviation : 'UNK'
    };
  }));
});

// GET /api/pick-values - Get pick value chart
app.get('/api/pick-values', (req, res) => {
  res.json(pickValues);
});

// POST /api/draft/start - Initialize new draft
app.post('/api/draft/start', (req, res) => {
  const { teamId } = req.body;

  if (!teamId) {
    return res.status(400).json({ error: 'Team ID is required' });
  }

  const team = teams.find(t => t.id === teamId);
  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }

  // Reset draft state
  draftState = {
    isActive: true,
    currentPickIndex: 0,
    userTeamId: teamId,
    picks: [],
    trades: [],
    availableProspects: [...prospects].sort((a, b) => b.grade - a.grade),
    teamNeeds: initializeTeamNeeds()
  };

  // If user is not on the clock, simulate to their pick
  if (draftOrder[0].teamId !== teamId) {
    simulateToUserPick();
  }

  res.json(getDraftStatus());
});

// POST /api/draft/pick - Make a pick
app.post('/api/draft/pick', (req, res) => {
  const { prospectId } = req.body;

  if (!draftState.isActive) {
    return res.status(400).json({ error: 'Draft is not active' });
  }

  const currentPick = draftOrder[draftState.currentPickIndex];
  if (!currentPick) {
    return res.status(400).json({ error: 'Draft is complete' });
  }

  // Check if it's user's turn
  if (currentPick.teamId !== draftState.userTeamId) {
    return res.status(400).json({ error: 'Not your turn' });
  }

  const prospect = draftState.availableProspects.find(p => p.id === prospectId);
  if (!prospect) {
    return res.status(404).json({ error: 'Prospect not available' });
  }

  // Make the pick
  makePick(currentPick, prospect);

  // Simulate AI picks until it's user's turn again or draft ends
  simulateToUserPick();

  res.json(getDraftStatus());
});

// POST /api/draft/sim - Simulate AI picks
app.post('/api/draft/sim', (req, res) => {
  if (!draftState.isActive) {
    return res.status(400).json({ error: 'Draft is not active' });
  }

  // Simulate all remaining picks
  while (draftState.currentPickIndex < draftOrder.length) {
    const currentPick = draftOrder[draftState.currentPickIndex];
    if (currentPick.teamId === draftState.userTeamId) {
      break; // Stop at user's next pick
    }
    const bestPick = makeAIPick(currentPick);
    makePick(currentPick, bestPick);
  }

  res.json(getDraftStatus());
});

// GET /api/draft/status - Get current draft state
app.get('/api/draft/status', (req, res) => {
  res.json(getDraftStatus());
});

// POST /api/draft/trade - Propose/accept trade
app.post('/api/draft/trade', (req, res) => {
  const { fromTeamId, toTeamId, picksOffered, picksReceived } = req.body;

  if (!draftState.isActive) {
    return res.status(400).json({ error: 'Draft is not active' });
  }

  // Calculate trade value
  const offeredValue = picksOffered.reduce((sum, pick) => sum + (pickValues[pick] || 0), 0);
  const receivedValue = picksReceived.reduce((sum, pick) => sum + (pickValues[pick] || 0), 0);

  const valueDiff = Math.abs(offeredValue - receivedValue);
  const fairThreshold = Math.max(offeredValue, receivedValue) * 0.15;
  const isFair = valueDiff <= fairThreshold;

  // Check if from team is user or AI
  if (fromTeamId === draftState.userTeamId) {
    // User proposing - auto accept if fair
    if (isFair) {
      executeTrade(fromTeamId, toTeamId, picksOffered, picksReceived);
      return res.json({ success: true, message: 'Trade accepted!', trade: { fromTeamId, toTeamId, picksOffered, picksReceived } });
    } else {
      return res.json({ success: false, message: 'Trade rejected - not fair value' });
    }
  } else {
    // AI proposing to user
    if (isFair) {
      return res.json({
        success: true,
        pending: true,
        message: 'AI team offers trade',
        trade: { fromTeamId, toTeamId, picksOffered, picksReceived },
        offeredValue,
        receivedValue
      });
    } else {
      return res.json({ success: false, message: 'AI rejected the trade' });
    }
  }
});

// Helper functions

function makePick(pick, prospect) {
  // Remove from available prospects
  const index = draftState.availableProspects.findIndex(p => p.id === prospect.id);
  if (index > -1) {
    draftState.availableProspects.splice(index, 1);
  }

  // Update team needs
  const positionPriority = draftState.teamNeeds[pick.teamId][prospect.position];
  if (positionPriority) {
    // Decrease need priority for this position
    const newPriority = positionPriority + 1;
    const maxPriority = Math.max(...Object.values(draftState.teamNeeds[pick.teamId]));
    draftState.teamNeeds[pick.teamId][prospect.position] = Math.min(newPriority, maxPriority + 1);
  }

  // Record pick
  draftState.picks.push({
    round: pick.round,
    pick: pick.pick,
    teamId: pick.teamId,
    overallPick: pick.overallPick,
    prospectId: prospect.id,
    prospectName: prospect.name,
    position: prospect.position,
    college: prospect.college
  });

  draftState.currentPickIndex++;
}

function simulateToUserPick() {
  while (draftState.currentPickIndex < draftOrder.length) {
    const currentPick = draftOrder[draftState.currentPickIndex];
    if (currentPick.teamId === draftState.userTeamId) {
      break;
    }
    const bestPick = makeAIPick(currentPick);
    makePick(currentPick, bestPick);
  }
}

function makeAIPick(currentPick) {
  const teamId = currentPick.teamId;
  const teamNeeds = draftState.teamNeeds[teamId] || {};
  const team = teams.find(t => t.id === teamId);

  // Score each available prospect
  const scoredProspects = draftState.availableProspects.map(prospect => {
    let score = 0;

    // Grade weight (40%)
    score += prospect.grade * 0.4;

    // Team needs weight (40%)
    const needPriority = teamNeeds[prospect.position];
    if (needPriority) {
      // Lower priority number = higher need
      const needScore = (10 - needPriority) / 10;
      score += needScore * 0.4;
    }

    // Positional value weight (20%)
    const posValue = positionalValues[prospect.position] || 1.0;
    score += posValue * 0.2 * 10;

    // Bonus for BPA if no team needs match
    const hasNoNeeds = !Object.values(teamNeeds).some(v => v <= 3);
    if (hasNoNeeds) {
      score += prospect.grade * 0.1;
    }

    return { prospect, score };
  });

  // Sort by score and return best
  scoredProspects.sort((a, b) => b.score - a.score);
  return scoredProspects[0]?.prospect || draftState.availableProspects[0];
}

function executeTrade(fromTeamId, toTeamId, picksOffered, picksReceived) {
  // Update draft order
  picksOffered.forEach((pickNum, idx) => {
    const pick = draftOrder.find(p => p.overallPick === pickNum);
    if (pick) {
      pick.teamId = toTeamId;
    }
  });

  picksReceived.forEach((pickNum) => {
    const pick = draftOrder.find(p => p.overallPick === pickNum);
    if (pick) {
      pick.teamId = fromTeamId;
    }
  });

  // Record trade
  draftState.trades.push({
    fromTeamId,
    toTeamId,
    picksOffered,
    picksReceived,
    timestamp: Date.now()
  });

  // Re-sort draft order by overall pick
  draftOrder.sort((a, b) => a.overallPick - b.overallPick);
}

function getDraftStatus() {
  const currentPick = draftOrder[draftState.currentPickIndex];
  const currentTeam = currentPick ? teams.find(t => t.id === currentPick.teamId) : null;

  return {
    isActive: draftState.isActive,
    currentPickIndex: draftState.currentPickIndex,
    totalPicks: draftOrder.length,
    currentPick: currentPick ? {
      round: currentPick.round,
      pick: currentPick.pick,
      teamId: currentPick.teamId,
      teamName: currentTeam?.name,
      teamAbbreviation: currentTeam?.abbreviation,
      isUserTurn: currentPick.teamId === draftState.userTeamId
    } : null,
    picks: draftState.picks,
    trades: draftState.trades,
    availableProspects: draftState.availableProspects.slice(0, 50),
    userTeamId: draftState.userTeamId,
    teamNeeds: draftState.teamNeeds,
    isDraftComplete: draftState.currentPickIndex >= draftOrder.length
  };
}

// GET /api/draft/auto - Start auto-draft mode
app.get('/api/draft/auto', (req, res) => {
  if (!draftState.isActive) {
    return res.status(400).json({ error: 'Draft is not active' });
  }

  // Return auto mode config - frontend will handle the timing
  res.json({
    mode: 'auto',
    currentPick: draftState.currentPickIndex + 1,
    delay: 750
  });
});

// POST /api/draft/auto - Execute auto pick (called by frontend with timing)
app.post('/api/draft/auto', (req, res) => {
  if (!draftState.isActive) {
    return res.status(400).json({ error: 'Draft is not active' });
  }

  if (draftState.currentPickIndex >= draftOrder.length) {
    return res.json({
      isComplete: true,
      message: 'Draft is complete',
      picks: draftState.picks
    });
  }

  const currentPick = draftOrder[draftState.currentPickIndex];

  // If it's user's turn, don't auto-pick - return user turn status
  if (currentPick.teamId === draftState.userTeamId) {
    return res.json({
      isUserTurn: true,
      message: 'User turn',
      currentPick: currentPick.overallPick
    });
  }

  // Make AI pick
  const bestPick = makeAIPick(currentPick);
  makePick(currentPick, bestPick);

  res.json({
    mode: 'auto',
    pick: {
      round: currentPick.round,
      pick: currentPick.pick,
      overallPick: currentPick.overallPick,
      teamId: currentPick.teamId,
      prospect: bestPick
    },
    nextPick: draftState.currentPickIndex + 1,
    totalPicks: draftOrder.length,
    isComplete: draftState.currentPickIndex >= draftOrder.length
  });
});

const PORT = 4100;
app.listen(PORT, () => {
  console.log(`NFL Mock Draft Server running on port ${PORT}`);
});
