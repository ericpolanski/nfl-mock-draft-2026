import React, { useState, useMemo } from 'react';

const PositionBadge = ({ position }) => {
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
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[position] || 'bg-slate-500/20 text-slate-400'}`}>
      {position}
    </span>
  );
};

const ProspectCard = ({ prospect, onSelect, isUserTurn, teamNeeds = [] }) => {
  const matchesNeed = teamNeeds.includes(prospect.position);
  const positionPriority = teamNeeds.indexOf(prospect.position) + 1;

  return (
    <div
      className={`
        p-3 rounded-lg border transition-all duration-200 cursor-pointer
        ${isUserTurn
          ? 'hover:bg-slate-700/50 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10'
          : 'opacity-50 cursor-not-allowed'
        }
        ${matchesNeed ? 'border-green-500/30 bg-green-500/5' : 'border-slate-700 bg-slate-800/50'}
      `}
      onClick={() => isUserTurn && onSelect(prospect)}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="text-white font-medium">{prospect.name}</h4>
          <p className="text-gray-400 text-sm">{prospect.college}</p>
        </div>
        <div className="text-right">
          <PositionBadge position={prospect.position} />
          <p className="text-xs text-gray-500 mt-1">{prospect.height} • {prospect.weight}lbs</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-cyan-400">{prospect.grade}</span>
          <span className="text-xs text-gray-500">Grade</span>
        </div>

        {matchesNeed && isUserTurn && (
          <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded">
            Need #{positionPriority}
          </span>
        )}
      </div>

      {prospect.strengths && prospect.strengths.length > 0 && (
        <div className="mt-2 pt-2 border-t border-slate-700">
          <p className="text-xs text-gray-500 mb-1">Strengths</p>
          <p className="text-xs text-gray-400 truncate">{prospect.strengths.slice(0, 2).join(', ')}</p>
        </div>
      )}
    </div>
  );
};

const PlayerPool = ({ prospects, onSelectProspect, isUserTurn, userTeamNeeds = [] }) => {
  const [sortBy, setSortBy] = useState('grade');
  const [positionFilter, setPositionFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAndSortedProspects = useMemo(() => {
    let result = [...prospects];

    // Filter by position
    if (positionFilter !== 'all') {
      result = result.filter(p => p.position === positionFilter);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.college.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'grade') return b.grade - a.grade;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'position') return a.position.localeCompare(b.position);
      return 0;
    });

    return result;
  }, [prospects, positionFilter, sortBy, searchQuery]);

  const positions = ['all', 'QB', 'RB', 'WR', 'TE', 'OT', 'OG', 'C', 'DL', 'EDGE', 'LB', 'CB', 'S'];

  return (
    <div className="card h-full flex flex-col">
      <div className="px-4 py-3 border-b border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">Player Pool</h2>
          <span className="text-sm text-gray-400">{filteredAndSortedProspects.length} available</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <input
            type="text"
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input flex-1 min-w-[150px] text-sm py-2"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="select text-sm py-1.5 flex-1"
          >
            {positions.map(pos => (
              <option key={pos} value={pos}>
                {pos === 'all' ? 'All Positions' : pos}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="select text-sm py-1.5 flex-1"
          >
            <option value="grade">Sort by Grade</option>
            <option value="name">Sort by Name</option>
            <option value="position">Sort by Position</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredAndSortedProspects.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No players match your criteria</p>
          </div>
        ) : (
          filteredAndSortedProspects.slice(0, 50).map((prospect) => (
            <ProspectCard
              key={prospect.id}
              prospect={prospect}
              onSelect={onSelectProspect}
              isUserTurn={isUserTurn}
              teamNeeds={userTeamNeeds}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PlayerPool;
