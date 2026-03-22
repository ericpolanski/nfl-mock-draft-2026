import React, { useMemo, useRef, useEffect, useState } from 'react';
import { teams } from '../data';

const PickRow = ({ pick, isActive, userTeamId, isNew }) => {
  const team = pick.teamId ? teams.find(t => t.id === pick.teamId) : null;
  const isUserPick = pick.teamId === userTeamId;
  const rowRef = useRef(null);

  return (
    <div
      ref={rowRef}
      className={`
        flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200
        ${isActive ? 'bg-cyan-500/20 border border-cyan-500 pick-active' : 'hover:bg-slate-700/50'}
        ${isUserPick ? 'ring-2 ring-yellow-500/50' : ''}
        ${isNew ? 'animate-pick-slide-in' : ''}
      `}
      id={isActive ? 'active-pick' : undefined}
    >
      <div className="flex-shrink-0 w-16 text-center">
        <span className="text-sm font-semibold text-slate-300 font-['Oswald']">
          {pick.round}.{pick.pick}
        </span>
      </div>

      <div
        className="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center text-white font-bold text-xs shadow-md"
        style={{ backgroundColor: team?.primaryColor || '#334155' }}
      >
        {team?.abbreviation || 'TBD'}
      </div>

      <div className="flex-1 min-w-0">
        {pick.prospect ? (
          <div className="flex items-center gap-2">
            <span className="text-white font-medium truncate">
              {pick.prospect.name}
            </span>
            <span className="text-xs px-1.5 py-0.5 bg-slate-600 text-slate-300 rounded">
              {pick.prospect.position}
            </span>
            <span className="text-xs text-slate-500">
              {pick.prospect.college}
            </span>
          </div>
        ) : (
          <span className="text-slate-500 text-sm">On the clock...</span>
        )}
      </div>

      <div className="flex-shrink-0">
        {pick.prospect && (
          <span className="text-xs font-medium px-2 py-1 bg-slate-700 text-slate-300 rounded">
            Grade: {pick.prospect.grade}
          </span>
        )}
      </div>
    </div>
  );
};

const DraftBoard = ({ picks, currentPick, userTeamId, onPickClick }) => {
  const containerRef = useRef(null);
  const [activeRound, setActiveRound] = useState(1);
  const [newPickId, setNewPickId] = useState(null);

  // Track the most recent pick for animation
  useEffect(() => {
    if (picks.length > 0) {
      const lastPick = picks[picks.length - 1];
      if (lastPick?.prospect) {
        setNewPickId(lastPick.position);
        setTimeout(() => setNewPickId(null), 500);
      }
    }
  }, [picks.length]);

  // Group picks by round
  const picksByRound = useMemo(() => {
    const grouped = {};
    picks.forEach(pick => {
      if (!grouped[pick.round]) grouped[pick.round] = [];
      grouped[pick.round].push(pick);
    });
    return grouped;
  }, [picks]);

  // Scroll to active pick when it changes
  useEffect(() => {
    const activePick = document.getElementById('active-pick');
    if (activePick && containerRef.current) {
      setTimeout(() => {
        activePick.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);
    }

    // Update active round to match current pick
    const currentPickData = picks.find(p => p.position === currentPick);
    if (currentPickData?.round) {
      setActiveRound(currentPickData.round);
    }
  }, [currentPick, picks.length, picks]);

  const rounds = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="card h-full flex flex-col bg-[#1e293b] border-slate-700">
      {/* Round Tabs */}
      <div className="px-4 py-3 border-b border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold text-white font-['Oswald']">Draft Board</h2>
            <p className="text-sm text-slate-400">7 Rounds • 224 Picks</p>
          </div>
        </div>

        {/* Round Navigation Tabs */}
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {rounds.map((round) => {
            const hasPicks = picksByRound[round]?.length > 0;
            const isActive = activeRound === round;

            return (
              <button
                key={round}
                onClick={() => setActiveRound(round)}
                className={`
                  flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                    : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }
                `}
              >
                R{round}
                {hasPicks && (
                  <span className="ml-1 text-xs opacity-75">
                    ({picksByRound[round].filter(p => p.prospect).length})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Draft Board Content */}
      <div ref={containerRef} className="flex-1 overflow-y-auto p-3 space-y-4">
        {picks.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p>Draft hasn't started yet</p>
          </div>
        ) : (
          // Show only the active round
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-cyan-400 font-['Oswald']">Round {activeRound}</span>
              <div className="flex-1 h-px bg-slate-700"></div>
            </div>

            {picksByRound[activeRound]?.map((pick) => (
              <PickRow
                key={pick.position}
                pick={pick}
                isActive={pick.position === currentPick}
                userTeamId={userTeamId}
                isNew={pick.position === newPickId}
              />
            ))}

            {(!picksByRound[activeRound] || picksByRound[activeRound].length === 0) && (
              <div className="text-center py-8 text-slate-500">
                <p>No picks in Round {activeRound} yet</p>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>
    </div>
  );
};

export default DraftBoard;
