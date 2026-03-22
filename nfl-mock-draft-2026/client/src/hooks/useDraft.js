import { useState, useEffect, useCallback } from 'react';
import * as api from '../utils/api';
import { teams, getPickAtPosition } from '../data';

// Use relative API path for proxy support in dev/prod
const API_BASE = '/api';

export const useDraft = (userTeamId) => {
  const [draftState, setDraftState] = useState({
    currentPick: 1,
    picks: [],
    availableProspects: [],
    userTeamId: userTeamId || null,
    isStarted: false,
    isComplete: false,
    loading: false,
    error: null,
  });

  // State for draft status polling (must be at top level with other hooks)
  const [draftStatus, setDraftStatus] = useState(null);

  // Start draft function - called by user clicking Start Draft button
  const startDraft = useCallback(async () => {
    if (!userTeamId || draftState.isStarted) return;

    setDraftState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Call backend to start draft
      const response = await fetch(`${API_BASE}/draft/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId: userTeamId }),
      });

      if (!response.ok) {
        throw new Error('Failed to start draft');
      }

      const draftData = await response.json();

      // Transform backend data to frontend format
      const transformedPicks = (draftData.picks || []).map(pick => ({
        position: pick.overallPick,
        round: pick.round,
        pick: pick.pick,
        teamId: pick.teamId,
        prospectId: pick.prospectId,
        prospect: draftData.availableProspects?.find(p => p.id === pick.prospectId),
      }));

      setDraftState({
        currentPick: draftData.currentPickIndex + 1,
        picks: transformedPicks,
        availableProspects: draftData.availableProspects || [],
        userTeamId: userTeamId,
        isStarted: true,
        isComplete: draftData.isDraftComplete,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error starting draft:', error);
      // Fall back to local mock data if backend unavailable
      setDraftState(prev => ({
        ...prev,
        userTeamId,
        isStarted: true,
        loading: false,
        error: 'Using offline mode - backend unavailable',
      }));
    }
  }, [userTeamId, draftState.isStarted]);

  // Get current pick data
  const currentPickData = getPickAtPosition(draftState.currentPick);
  const currentTeam = currentPickData ? teams.find(t => t.id === currentPickData?.teamId) : null;

  // Determine if it's user's turn by checking draft status

  useEffect(() => {
    if (!draftState.isStarted) return;

    const fetchDraftStatus = async () => {
      try {
        const response = await fetch(`${API_BASE}/draft/status`);
        if (response.ok) {
          const status = await response.json();
          setDraftStatus(status);
        }
      } catch (error) {
        console.error('Error fetching draft status:', error);
      }
    };

    fetchDraftStatus();
    const interval = setInterval(fetchDraftStatus, 5000);
    return () => clearInterval(interval);
  }, [draftState.isStarted, draftState.currentPick]);

  const isUserTurn = draftStatus?.currentPick?.isUserTurn || false;
  const currentRound = Math.ceil(draftState.currentPick / 32);
  const pickInRound = ((draftState.currentPick - 1) % 32) + 1;

  // Make a pick
  const makePick = useCallback(async (prospectId) => {
    setDraftState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(`${API_BASE}/draft/pick`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prospectId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to make pick');
      }

      const draftData = await response.json();

      // Transform backend data
      const transformedPicks = (draftData.picks || []).map(pick => ({
        position: pick.overallPick,
        round: pick.round,
        pick: pick.pick,
        teamId: pick.teamId,
        prospectId: pick.prospectId,
        prospect: draftData.availableProspects?.find(p => p.id === pick.prospectId),
      }));

      setDraftState(prev => ({
        ...prev,
        currentPick: draftData.currentPickIndex + 1,
        picks: transformedPicks,
        availableProspects: draftData.availableProspects || [],
        isComplete: draftData.isDraftComplete,
        loading: false,
      }));

      setDraftStatus(draftData);
      return draftData;
    } catch (error) {
      setDraftState(prev => ({ ...prev, loading: false, error: error.message }));
      throw error;
    }
  }, []);

  // Simulate picks
  const simulatePicks = useCallback(async (numPicks = 10) => {
    setDraftState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(`${API_BASE}/draft/sim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numPicks }),
      });

      if (!response.ok) {
        throw new Error('Failed to simulate picks');
      }

      const draftData = await response.json();

      // Transform backend data
      const transformedPicks = (draftData.picks || []).map(pick => ({
        position: pick.overallPick,
        round: pick.round,
        pick: pick.pick,
        teamId: pick.teamId,
        prospectId: pick.prospectId,
        prospect: draftData.availableProspects?.find(p => p.id === pick.prospectId),
      }));

      setDraftState(prev => ({
        ...prev,
        currentPick: draftData.currentPickIndex + 1,
        picks: transformedPicks,
        availableProspects: draftData.availableProspects || [],
        isComplete: draftData.isDraftComplete,
        loading: false,
      }));

      setDraftStatus(draftData);
      return draftData;
    } catch (error) {
      setDraftState(prev => ({ ...prev, loading: false, error: error.message }));
      throw error;
    }
  }, []);

  // Reset draft
  const resetDraft = useCallback(async () => {
    setDraftState({
      currentPick: 1,
      picks: [],
      availableProspects: [],
      userTeamId: userTeamId || null,
      isStarted: false,
      isComplete: false,
      loading: false,
      error: null,
    });
    setDraftStatus(null);
  }, [userTeamId]);

  // Get the current team from draft status if available
  const currentTeamFromStatus = draftStatus?.currentPick ? {
    id: draftStatus.currentPick.teamId,
    name: draftStatus.currentPick.teamName,
    abbreviation: draftStatus.currentPick.teamAbbreviation,
    primaryColor: teams.find(t => t.id === draftStatus.currentPick.teamId)?.primaryColor || '#374151',
  } : currentTeam;

  return {
    ...draftState,
    currentPickData,
    currentTeam: currentTeamFromStatus,
    isUserTurn,
    currentRound,
    pickInRound,
    startDraft,
    makePick,
    simulatePicks,
    resetDraft,
  };
};

export default useDraft;
