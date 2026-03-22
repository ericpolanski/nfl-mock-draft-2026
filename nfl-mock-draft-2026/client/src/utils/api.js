// API Utility for connecting to backend
// Falls back to mock data when backend is unavailable

const API_BASE = '/api';

let mockDraftState = null;
let mockTeams = null;
let mockProspects = null;

// Check if backend is available
const checkBackend = async () => {
  try {
    const response = await fetch(`${API_BASE}/teams`, { signal: AbortSignal.timeout(2000) });
    return response.ok;
  } catch {
    return false;
  }
};

let backendAvailable = null;

// Initialize mock data
const initMockData = () => {
  if (mockTeams) return;

  // Import will happen at runtime
  mockTeams = require('../data/teams').teams;
  mockProspects = require('../data/prospects').prospects;
  mockDraftState = {
    currentPick: 1,
    picks: [],
    availableProspects: [...mockProspects],
    userTeamId: null,
    isStarted: false,
    isComplete: false,
  };
};

// Teams API
export const fetchTeams = async () => {
  if (backendAvailable === null) {
    backendAvailable = await checkBackend();
  }

  if (backendAvailable) {
    const response = await fetch(`${API_BASE}/teams`);
    return response.json();
  }

  initMockData();
  return { teams: mockTeams };
};

export const fetchTeam = async (id) => {
  if (backendAvailable === null) {
    backendAvailable = await checkBackend();
  }

  if (backendAvailable) {
    const response = await fetch(`${API_BASE}/teams/${id}`);
    return response.json();
  }

  initMockData();
  const team = mockTeams.find(t => t.id === id);
  return team || null;
};

// Prospects API
export const fetchProspects = async (filters = {}) => {
  if (backendAvailable === null) {
    backendAvailable = await checkBackend();
  }

  if (backendAvailable) {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE}/prospects?${params}`);
    return response.json();
  }

  initMockData();
  let prospects = [...mockProspects];

  if (filters.position) {
    prospects = prospects.filter(p => p.position === filters.position);
  }
  if (filters.minGrade) {
    prospects = prospects.filter(p => p.grade >= parseInt(filters.minGrade));
  }

  return { prospects };
};

export const fetchProspect = async (id) => {
  if (backendAvailable === null) {
    backendAvailable = await checkBackend();
  }

  if (backendAvailable) {
    const response = await fetch(`${API_BASE}/prospects/${id}`);
    return response.json();
  }

  initMockData();
  return mockProspects.find(p => p.id === parseInt(id)) || null;
};

// Draft Order API
export const fetchDraftOrder = async () => {
  if (backendAvailable === null) {
    backendAvailable = await checkBackend();
  }

  if (backendAvailable) {
    const response = await fetch(`${API_BASE}/draft-order`);
    return response.json();
  }

  const { draftOrder } = require('../data');
  return { draftOrder };
};

// Draft State API
export const startDraft = async (userTeamId) => {
  if (backendAvailable === null) {
    backendAvailable = await checkBackend();
  }

  if (backendAvailable) {
    const response = await fetch(`${API_BASE}/draft/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userTeamId }),
    });
    return response.json();
  }

  initMockData();
  mockDraftState.isStarted = true;
  mockDraftState.userTeamId = userTeamId;
  return mockDraftState;
};

export const makePick = async (prospectId) => {
  if (backendAvailable === null) {
    backendAvailable = await checkBackend();
  }

  if (backendAvailable) {
    const response = await fetch(`${API_BASE}/draft/pick`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prospectId }),
    });
    return response.json();
  }

  initMockData();
  const prospect = mockProspects.find(p => p.id === prospectId);
  if (!prospect) throw new Error('Prospect not found');

  const { getPickAtPosition } = require('../data');
  const currentPickData = getPickAtPosition(mockDraftState.currentPick);

  mockDraftState.picks.push({
    position: mockDraftState.currentPick,
    round: currentPickData?.round || Math.ceil(mockDraftState.currentPick / 32),
    pick: ((mockDraftState.currentPick - 1) % 32) + 1,
    teamId: currentPickData?.teamId,
    prospectId,
    prospect,
    timestamp: new Date().toISOString(),
  });

  mockDraftState.availableProspects = mockDraftState.availableProspects.filter(p => p.id !== prospectId);
  mockDraftState.currentPick++;

  if (mockDraftState.currentPick > 224) {
    mockDraftState.isComplete = true;
  }

  return mockDraftState;
};

export const simulatePicks = async (numPicks = 10) => {
  if (backendAvailable === null) {
    backendAvailable = await checkBackend();
  }

  if (backendAvailable) {
    const response = await fetch(`${API_BASE}/draft/sim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ numPicks }),
    });
    return response.json();
  }

  initMockData();
  const { getPickAtPosition } = require('../data');

  for (let i = 0; i < numPicks && mockDraftState.currentPick <= 224; i++) {
    const availableProspects = mockDraftState.availableProspects;
    if (availableProspects.length === 0) break;

    const currentPickData = getPickAtPosition(mockDraftState.currentPick);
    const teamNeeds = mockTeams.find(t => t.id === currentPickData?.teamId)?.needs || {};

    // Simple AI: prioritize needs, then best available
    let selectedProspect = null;
    const needPositions = Object.keys(teamNeeds);

    for (const pos of needPositions) {
      const posProspects = availableProspects.filter(p => p.position === pos);
      if (posProspects.length > 0) {
        selectedProspect = posProspects.sort((a, b) => b.grade - a.grade)[0];
        break;
      }
    }

    if (!selectedProspect) {
      selectedProspect = availableProspects.sort((a, b) => b.grade - a.grade)[0];
    }

    mockDraftState.picks.push({
      position: mockDraftState.currentPick,
      round: currentPickData?.round || Math.ceil(mockDraftState.currentPick / 32),
      pick: ((mockDraftState.currentPick - 1) % 32) + 1,
      teamId: currentPickData?.teamId,
      prospectId: selectedProspect.id,
      prospect: selectedProspect,
      timestamp: new Date().toISOString(),
    });

    mockDraftState.availableProspects = mockDraftState.availableProspects.filter(p => p.id !== selectedProspect.id);
    mockDraftState.currentPick++;
  }

  if (mockDraftState.currentPick > 224) {
    mockDraftState.isComplete = true;
  }

  return mockDraftState;
};

export const getDraftStatus = async () => {
  if (backendAvailable === null) {
    backendAvailable = await checkBackend();
  }

  if (backendAvailable) {
    const response = await fetch(`${API_BASE}/draft/status`);
    return response.json();
  }

  initMockData();
  return mockDraftState;
};

export const proposeTrade = async (toTeamId, picksToGive, picksToGet) => {
  if (backendAvailable === null) {
    backendAvailable = await checkBackend();
  }

  if (backendAvailable) {
    const response = await fetch(`${API_BASE}/draft/trade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toTeamId, picksToGive, picksToGet }),
    });
    return response.json();
  }

  // Mock trade - always accept if value is close
  const { calculateTradeValue } = require('../data');
  const giveValue = calculateTradeValue(picksToGive);
  const getValue = calculateTradeValue(picksToGet);
  const fairValue = getValue * 0.85;

  return {
    accepted: giveValue >= fairValue,
    giveValue,
    getValue,
    message: giveValue >= fairValue ? 'Trade accepted!' : 'Trade rejected - value not met',
  };
};

export const fetchPickValues = async () => {
  if (backendAvailable === null) {
    backendAvailable = await checkBackend();
  }

  if (backendAvailable) {
    const response = await fetch(`${API_BASE}/pick-values`);
    return response.json();
  }

  const { pickValues } = require('../data');
  return { pickValues };
};

export default {
  fetchTeams,
  fetchTeam,
  fetchProspects,
  fetchProspect,
  fetchDraftOrder,
  startDraft,
  makePick,
  simulatePicks,
  getDraftStatus,
  proposeTrade,
  fetchPickValues,
};
