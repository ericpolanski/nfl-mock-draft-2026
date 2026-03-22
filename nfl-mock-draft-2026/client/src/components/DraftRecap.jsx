import React, { useMemo } from 'react';
import { teams, getPickValue } from '../data';

const TeamRecapCard = ({ team, picks }) => {
  const teamPicks = picks.filter(p => p.teamId === team.id);
  const totalValue = teamPicks.reduce((sum, p) => sum + getPickValue(p.position), 0);
  const avgGrade = teamPicks.length > 0
    ? Math.round(teamPicks.reduce((sum, p) => sum + (p.prospect?.grade || 0), 0) / teamPicks.length)
    : 0;

  return (
    <div className="p-4 bg-slate-800/50 rounded-lg">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs"
          style={{ backgroundColor: team.primaryColor }}
        >
          {team.abbreviation}
        </div>
        <div className="flex-1">
          <h4 className="text-white font-medium">{team.name}</h4>
          <p className="text-xs text-gray-400">{teamPicks.length} picks</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-cyan-400">{avgGrade}</p>
          <p className="text-xs text-gray-500">Avg Grade</p>
        </div>
      </div>

      <div className="space-y-2">
        {teamPicks.map((pick, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 w-12">
              {pick.round}.{pick.pick}
            </span>
            <span className="text-white flex-1 truncate">
              {pick.prospect?.name || 'TBD'}
            </span>
            <span className="text-gray-400">
              {pick.prospect?.position}
            </span>
            <span className="text-cyan-400 text-xs">
              {pick.prospect?.grade}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const DraftRecap = ({ picks, userTeamId, onClose }) => {
  const { teamPicks, bestPicks, userPicks, stats } = useMemo(() => {
    // Group picks by team
    const grouped = {};
    picks.forEach(pick => {
      if (!pick.teamId) return;
      if (!grouped[pick.teamId]) grouped[pick.teamId] = [];
      grouped[pick.teamId].push(pick);
    });

    // Find best value picks (grade vs projected)
    const withValue = picks
      .filter(p => p.prospect)
      .map(p => ({
        ...p,
        pickValue: getPickValue(p.position),
        valueDifferential: p.prospect.grade - (pick => {
          if (pick <= 32) return 95 - pick * 0.5;
          if (pick <= 64) return 85 - (pick - 32) * 0.5;
          if (pick <= 96) return 75 - (pick - 64) * 0.4;
          if (pick <= 128) return 65 - (pick - 96) * 0.4;
          return 55;
        })(p.position)
      }))
      .sort((a, b) => b.valueDifferential - a.valueDifferential);

    const userTeamPicks = picks.filter(p => p.teamId === userTeamId);

    return {
      teamPicks: grouped,
      bestPicks: withValue.slice(0, 5),
      userPicks: userTeamPicks,
      stats: {
        totalPicks: picks.length,
        rounds: Math.max(...picks.map(p => p.round), 0),
      }
    };
  }, [picks, userTeamId]);

  const teamsWithPicks = Object.keys(teamPicks)
    .map(teamId => teams.find(t => t.id === teamId))
    .filter(Boolean)
    .sort((a, b) => (teamPicks[b.id]?.length || 0) - (teamPicks[a.id]?.length || 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Draft Recap</h2>
            <p className="text-sm text-gray-400">
              {stats.totalPicks} picks • Round {stats.rounds}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Close draft recap"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Best Value Picks */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Best Value Picks</h3>
            <div className="space-y-2">
              {bestPicks.map((pick, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{pick.prospect.name}</p>
                    <p className="text-sm text-gray-400">
                      {pick.round}.{pick.pick} • {pick.prospect.position} • {pick.prospect.college}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold">+{Math.round(pick.valueDifferential)}</p>
                    <p className="text-xs text-gray-500">Value</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User's Picks */}
          {userPicks.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Your Picks</h3>
              <div className="grid gap-2">
                {userPicks.map((pick, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 font-bold text-sm">
                      {pick.pick}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{pick.prospect.name}</p>
                      <p className="text-sm text-gray-400">
                        {pick.prospect.position} • {pick.prospect.college}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-yellow-400 font-bold">{pick.prospect.grade}</p>
                      <p className="text-xs text-gray-500">Grade</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Team-by-team */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">All Teams</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {teamsWithPicks.map(team => (
                <TeamRecapCard
                  key={team.id}
                  team={team}
                  picks={teamPicks[team.id]}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraftRecap;
