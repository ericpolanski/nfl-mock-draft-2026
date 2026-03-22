import React, { useState, useMemo } from 'react';
import { teams as allTeams } from '../data';

const PositionNeed = ({ position, priority, filled }) => {
  const colors = {
    1: 'bg-red-500',
    2: 'bg-orange-500',
    3: 'bg-yellow-500',
    4: 'bg-green-500',
    5: 'bg-blue-500',
  };

  return (
    <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-medium ${filled ? 'bg-slate-600 text-slate-400' : `${colors[priority]} text-white`}`}>
      {filled ? '✓' : position}
    </div>
  );
};

const TeamNeedsRow = ({ team, filledNeeds = [], isExpanded, onToggle }) => {
  const needs = Object.entries(team.needs || {});
  const filledCount = needs.filter(([pos]) => filledNeeds.includes(pos)).length;

  return (
    <div className="border-b border-slate-700 last:border-0">
      <div
        className="flex items-center gap-3 px-3 py-2 hover:bg-slate-700/50 cursor-pointer transition-colors"
        onClick={onToggle}
      >
        <div
          className="w-8 h-8 rounded flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
          style={{ backgroundColor: team.primaryColor }}
        >
          {team.abbreviation}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-sm truncate">{team.name}</p>
        </div>

        <div className="flex items-center gap-1">
          {needs.slice(0, 5).map(([position, priority]) => (
            <PositionBadge
              key={position}
              position={position}
              filled={filledNeeds.includes(position)}
            />
          ))}
        </div>

        <span className="text-xs text-gray-400">
          {filledCount}/{needs.length}
        </span>

        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

const PositionBadge = ({ position, filled }) => {
  const colors = {
    'QB': 'bg-red-500/20 text-red-400',
    'RB': 'bg-green-500/20 text-green-400',
    'WR': 'bg-blue-500/20 text-blue-400',
    'TE': 'bg-purple-500/20 text-purple-400',
    'OT': 'bg-orange-500/20 text-orange-400',
    'OG': 'bg-yellow-500/20 text-yellow-400',
    'C': 'bg-yellow-500/20 text-yellow-400',
    'DL': 'bg-amber-500/20 text-amber-400',
    'EDGE': 'bg-rose-500/20 text-rose-400',
    'LB': 'bg-cyan-500/20 text-cyan-400',
    'CB': 'bg-pink-500/20 text-pink-400',
    'S': 'bg-indigo-500/20 text-indigo-400',
  };

  return (
    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${filled ? 'bg-slate-600 text-slate-400' : colors[position] || 'bg-slate-500/20 text-slate-400'}`}>
      {position}
    </span>
  );
};

const TeamNeedsTracker = ({ teams: teamsWithNeeds = [], picks = [], userTeamId }) => {
  const [expandedTeam, setExpandedTeam] = useState(null);

  // Calculate filled needs for each team based on picks
  const teamFilledNeeds = useMemo(() => {
    const filled = {};
    picks.forEach(pick => {
      if (!pick.teamId || !pick.prospect) return;
      if (!filled[pick.teamId]) filled[pick.teamId] = [];
      filled[pick.teamId].push(pick.prospect.position);
    });
    return filled;
  }, [picks]);

  const teamsToShow = teamsWithNeeds.length > 0 ? teamsWithNeeds : allTeams;

  return (
    <div className="card h-full flex flex-col">
      <div className="px-4 py-3 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-white">Team Needs</h2>
        <p className="text-sm text-gray-400">Track team needs across the draft</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {teamsToShow.map((team) => (
          <TeamNeedsRow
            key={team.id}
            team={team}
            filledNeeds={teamFilledNeeds[team.id] || []}
            isExpanded={expandedTeam === team.id}
            onToggle={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default TeamNeedsTracker;
