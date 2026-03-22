import React, { useMemo, useRef, useEffect } from 'react';
import { teams } from '../data';

const PickRow = ({ pick, isActive, userTeamId }) => {
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
      `}
      id={isActive ? 'active-pick' : undefined}
    >
      <div className="flex-shrink-0 w-16 text-center">
        <span className="text-sm font-semibold text-gray-300">
          {pick.round}.{pick.pick}
        </span>
      </div>

      <div
        className="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center text-white font-bold text-xs"
        style={{ backgroundColor: team?.primaryColor || '#374151' }}
      >
        {team?.abbreviation || 'TBD'}
      </div>

      <div className="flex-1 min-w-0">
        {pick.prospect ? (
          <div className="flex items-center gap-2">
            <span className="text-white font-medium truncate">
              {pick.prospect.name}
            </span>
            <span className="text-xs px-1.5 py-0.5 bg-slate-600 text-gray-300 rounded">
              {pick.prospect.position}
            </span>
            <span className="text-xs text-gray-500">
              {pick.prospect.college}
            </span>
          </div>
        ) : (
          <span className="text-gray-500 text-sm">On the clock...</span>
        )}
      </div>

      <div className="flex-shrink-0">
        {pick.prospect && (
          <span className="text-xs font-medium px-2 py-1 bg-slate-700 text-gray-300 rounded">
            Grade: {pick.prospect.grade}
          </span>
        )}
      </div>
    </div>
  );
};

const DraftBoard = ({ picks, currentPick, userTeamId, onPickClick }) => {
  const containerRef = useRef(null);

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
  }, [currentPick, picks.length]);

  const rounds = Object.keys(picksByRound).map(Number).sort((a, b) => a - b);

  return (
    <div className="card h-full flex flex-col">
      <div className="px-4 py-3 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-white">Draft Board</h2>
        <p className="text-sm text-gray-400">7 Rounds • 224 Picks</p>
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto p-3 space-y-4">
        {rounds.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Draft hasn't started yet</p>
          </div>
        ) : (
          rounds.map((round) => (
            <div key={round} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-cyan-400">Round {round}</span>
                <div className="flex-1 h-px bg-slate-700"></div>
              </div>

              {picksByRound[round].map((pick) => (
                <PickRow
                  key={pick.position}
                  pick={pick}
                  isActive={pick.position === currentPick}
                  userTeamId={userTeamId}
                />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DraftBoard;
