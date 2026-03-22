import React, { useRef, useEffect } from 'react';
import { teams } from '../data';

const DraftTicker = ({ picks, currentPick, onPickClick }) => {
  const scrollRef = useRef(null);

  // Get the last 5 picks that have been made
  const recentPicks = picks
    .filter(p => p.prospect)
    .slice(-5)
    .reverse();

  // Auto-scroll to keep latest picks in view
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [recentPicks.length]);

  const getTeam = (teamId) => {
    return teams.find(t => t.id === teamId);
  };

  if (recentPicks.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto">
        {/* Ticker Label */}
        <div className="px-4 py-2 flex items-center gap-2 border-b border-slate-700/30">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-['Oswald']">
              Recent Picks
            </span>
          </div>
          <div className="h-px flex-1 bg-slate-700/50"></div>
        </div>

        {/* Ticker Content */}
        <div
          ref={scrollRef}
          className="flex items-center gap-3 px-4 py-3 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {recentPicks.map((pick) => {
            const team = getTeam(pick.teamId);
            const isActive = pick.position === currentPick;

            return (
              <button
                key={pick.position}
                onClick={() => onPickClick && onPickClick(pick.position)}
                className={`
                  flex-shrink-0 flex items-center gap-3 px-4 py-2 rounded-lg
                  transition-all duration-300 cursor-pointer
                  ${isActive
                    ? 'bg-cyan-500/20 border border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-800/80 border border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600'
                  }
                `}
              >
                {/* Team Logo/Color */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-md"
                  style={{
                    background: team
                      ? `linear-gradient(135deg, ${team.primaryColor} 0%, ${team.primaryColor}CC 100%)`
                      : '#334155'
                  }}
                >
                  {team?.abbreviation || 'TBD'}
                </div>

                {/* Pick Info */}
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-['Oswald']">
                      Rd {pick.round}
                    </span>
                    <span className="text-sm font-bold text-white">
                      Pick {pick.pick}
                    </span>
                  </div>
                  <p className="text-sm text-cyan-400 font-medium truncate max-w-[120px]">
                    {pick.prospect?.name}
                  </p>
                </div>

                {/* Position Badge */}
                {pick.prospect?.position && (
                  <span className="px-2 py-0.5 bg-slate-700/80 text-slate-300 text-xs rounded">
                    {pick.prospect.position}
                  </span>
                )}
              </button>
            );
          })}

          {/* Animated arrow indicator */}
          <div className="flex-shrink-0 flex items-center">
            <div className="animate-pulse text-cyan-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Hide scrollbar CSS */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default DraftTicker;
