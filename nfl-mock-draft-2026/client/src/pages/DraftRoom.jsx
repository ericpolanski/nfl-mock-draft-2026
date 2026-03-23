import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  TeamSelector,
  DraftBoard,
  OnTheClock,
  PlayerPool,
  TeamNeedsTracker,
  DraftControls,
  TradeModal,
  DraftRecap,
  DraftTicker,
  PlayerDetailModal,
} from '../components';
import { useDraft } from '../hooks/useDraft';
import { teams, getPickAtPosition } from '../data';

const DraftRoom = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const teamId = searchParams.get('team');

  const [showTradeModal, setShowTradeModal] = useState(false);
  const [showRecap, setShowRecap] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState(null);

  const {
    picks,
    currentPick,
    availableProspects,
    isStarted,
    isComplete,
    loading,
    isUserTurn,
    currentTeam,
    currentRound,
    pickInRound,
    userTeamId,
    startDraft,
    makePick,
    simulatePicks,
    animateDraft,
    skipAnimation,
    setAnimationSpeed,
    isAnimating,
    animationSpeed,
    resetDraft,
  } = useDraft(teamId);

  // Get user's team needs
  const userTeam = useMemo(() => {
    return teams.find(t => t.id === teamId);
  }, [teamId]);

  const userTeamNeeds = useMemo(() => {
    if (!userTeam?.needs) return [];
    return Object.entries(userTeam.needs)
      .sort(([, a], [, b]) => a - b)
      .map(([pos]) => pos);
  }, [userTeam]);

  // Handle making a pick
  const handleMakePick = async (prospect) => {
    if (!isUserTurn) return;
    try {
      await makePick(prospect.id);
    } catch (error) {
      console.error('Error making pick:', error);
    }
  };

  // Handle start draft button click
  const handleStartDraft = async () => {
    await startDraft();
  };

  // Handle simulate forward
  const handleSimForward = async () => {
    if (isUserTurn || isAnimating) return;

    // Calculate how many picks to simulate until user's turn or end of draft
    let picksToSim = 10;
    for (let i = 0; i < 10 && currentPick + i < 257; i++) {
      const pickData = getPickAtPosition(currentPick + i);
      if (pickData?.teamId === teamId) {
        picksToSim = i;
        break;
      }
    }

    // Use animated simulation by default
    await animateDraft(picksToSim);
  };

  // Handle instant simulate (skip animation)
  const handleSimInstant = async () => {
    if (isUserTurn || isAnimating) return;

    let picksToSim = 10;
    for (let i = 0; i < 10 && currentPick + i < 257; i++) {
      const pickData = getPickAtPosition(currentPick + i);
      if (pickData?.teamId === teamId) {
        picksToSim = i;
        break;
      }
    }

    await simulatePicks(picksToSim);
  };

  // Handle skip animation
  const handleSkipAnimation = () => {
    skipAnimation();
  };

  // Handle speed change
  const handleSpeedChange = (speed) => {
    setAnimationSpeed(speed);
  };

  // Handle trade proposal
  const handleProposeTrade = () => {
    setShowTradeModal(true);
  };

  // Handle reset
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the draft?')) {
      resetDraft();
    }
  };

  // Handle player click in draft board
  const handlePlayerClick = (prospect) => {
    setSelectedProspect(prospect);
  };

  // Show recap when draft is complete
  useEffect(() => {
    if (isComplete) {
      setShowRecap(true);
    }
  }, [isComplete]);

  // Redirect to home if no team selected
  useEffect(() => {
    if (!teamId) {
      navigate('/');
    }
  }, [teamId, navigate]);

  if (!teamId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Header */}
      <header className="bg-[#1e293b] border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">Back</span>
            </button>

            <div className="h-6 w-px bg-slate-700"></div>

            <h1 className="text-xl font-bold text-white font-['Oswald']">
              {userTeam?.name || 'Draft Room'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-400">
              Pick {currentPick} of 257
            </div>
            {isComplete && (
              <button
                onClick={() => setShowRecap(true)}
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-400 transition-colors"
              >
                View Recap
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4">
        {/* Draft Ticker - shown after draft starts */}
        {isStarted && !isComplete && (
          <div className="mb-4">
            <DraftTicker
              picks={picks}
              currentPick={currentPick}
            />
          </div>
        )}

        {/* Start Draft Button - shown before draft starts */}
        {!isStarted && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Ready to Draft!</h2>
              <p className="text-gray-400">Click the button below to start the AI draft simulation</p>
            </div>
            <button
              onClick={handleStartDraft}
              disabled={loading}
              className={`
                px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-600
                text-white text-xl font-bold rounded-xl
                hover:from-cyan-400 hover:to-blue-500
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all transform hover:scale-105
                shadow-lg shadow-cyan-500/25
              `}
            >
              {loading ? 'Starting...' : 'Start Draft'}
            </button>
          </div>
        )}

        {/* Draft Content - shown after draft starts */}
        {isStarted && (
          <div className="grid grid-cols-12 gap-4">
            {/* Left Column - On The Clock & Controls */}
            <div className="col-span-12 lg:col-span-3 space-y-4">
            <OnTheClock
              team={currentTeam}
              pickNumber={currentPick}
              round={currentRound}
              pickInRound={pickInRound}
              isUserTurn={isUserTurn}
              userTeamName={userTeam?.name}
              teamNeeds={currentTeam?.needs || {}}
            />

            <DraftControls
              isUserTurn={isUserTurn}
              isComplete={isComplete}
              onSimForward={handleSimForward}
              onProposeTrade={handleProposeTrade}
              onReset={handleReset}
              loading={loading}
              picks={picks}
              isAnimating={isAnimating}
              onSkipAnimation={handleSkipAnimation}
              animationSpeed={animationSpeed}
              onSpeedChange={handleSpeedChange}
            />

            {/* User Team Needs */}
            <div className="card p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Your Team Needs</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(userTeam?.needs || {}).map(([pos, priority]) => (
                  <span
                    key={pos}
                    className={`
                      px-3 py-1 rounded-full text-xs font-medium
                      ${priority === 1 ? 'bg-red-500/20 text-red-400' :
                        priority === 2 ? 'bg-orange-500/20 text-orange-400' :
                        priority === 3 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-slate-700 text-gray-400'
                      }
                    `}
                  >
                    {pos}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Center Column - Draft Board */}
          <div className="col-span-12 lg:col-span-5 h-[calc(100vh-200px)]">
            <DraftBoard
              picks={picks}
              currentPick={currentPick}
              userTeamId={teamId}
              onPickClick={handlePlayerClick}
            />
          </div>

          {/* Right Column - Player Pool */}
          <div className="col-span-12 lg:col-span-4 h-[calc(100vh-200px)]">
            <PlayerPool
              prospects={availableProspects}
              onSelectProspect={handleMakePick}
              isUserTurn={isUserTurn}
              userTeamNeeds={userTeamNeeds}
            />
          </div>
        </div>
        )}

        {/* Team Needs Tracker - Below main content */}
        <div className="mt-4">
          <TeamNeedsTracker
            teams={teams}
            picks={picks}
            userTeamId={teamId}
          />
        </div>
      </main>

      {/* Modals */}
      <TradeModal
        isOpen={showTradeModal}
        onClose={() => setShowTradeModal(false)}
        onSubmit={async (toTeamId, picksToGive, picksToGet) => {
          // Mock trade - return result
          const accepted = Math.random() > 0.3;
          return {
            accepted,
            message: accepted ? 'Trade accepted!' : 'Trade rejected - value not met',
          };
        }}
        currentPick={currentPick}
        picks={picks}
      />

      {showRecap && (
        <DraftRecap
          picks={picks}
          userTeamId={teamId}
          onClose={() => setShowRecap(false)}
        />
      )}

      <PlayerDetailModal
        prospect={selectedProspect}
        isOpen={!!selectedProspect}
        onClose={() => setSelectedProspect(null)}
        onDraft={handleMakePick}
        isUserTurn={isUserTurn}
      />
    </div>
  );
};

export default DraftRoom;
