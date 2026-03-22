import React from 'react';

// Position color mapping per spec
const POSITION_COLORS = {
  'QB': { bg: '#FF6B6B20', text: '#FF6B6B', border: '#FF6B6B' },
  'RB': { bg: '#4ECDC420', text: '#4ECDC4', border: '#4ECDC4' },
  'WR': { bg: '#45B7D120', text: '#45B7D1', border: '#45B7D1' },
  'TE': { bg: '#96CEB420', text: '#96CEB4', border: '#96CEB4' },
  'OT': { bg: '#FFEAA720', text: '#FFEAA7', border: '#FFEAA7' },
  'OG': { bg: '#FFEAA720', text: '#FFEAA7', border: '#FFEAA7' },
  'C': { bg: '#FFEAA720', text: '#FFEAA7', border: '#FFEAA7' },
  'DL': { bg: '#DDA0DD20', text: '#DDA0DD', border: '#DDA0DD' },
  'EDGE': { bg: '#DDA0DD20', text: '#DDA0DD', border: '#DDA0DD' },
  'DT': { bg: '#DDA0DD20', text: '#DDA0DD', border: '#DDA0DD' },
  'LB': { bg: '#98D8C820', text: '#98D8C8', border: '#98D8C8' },
  'CB': { bg: '#F7DC6F20', text: '#F7DC6F', border: '#F7DC6F' },
  'S': { bg: '#F7DC6F20', text: '#F7DC6F', border: '#F7DC6F' },
  'K': { bg: '#BDC3C720', text: '#BDC3C7', border: '#BDC3C7' },
  'P': { bg: '#BDC3C720', text: '#BDC3C7', border: '#BDC3C7' },
};

// Helper to convert height string to feet-inches format
const formatHeight = (height) => {
  if (!height) return 'N/A';
  // If already in feet-inches format, return as-is
  if (height.includes("'") || height.includes('ft')) return height;
  // If it's a number (inches), convert to feet-inches
  const inches = parseInt(height, 10);
  if (isNaN(inches)) return height;
  const feet = Math.floor(inches / 12);
  const remainingInches = inches % 12;
  return `${feet}'${remainingInches}"`;
};

// Helper to format weight
const formatWeight = (weight) => {
  if (!weight) return 'N/A';
  const w = parseInt(weight, 10);
  if (isNaN(w)) return weight;
  return `${w} lbs`;
};

// Grade color based on score
const getGradeColor = (grade) => {
  if (grade >= 90) return { bg: '#10B98120', text: '#10B981', label: 'Elite' };
  if (grade >= 80) return { bg: '#3B82F620', text: '#3B82F6', label: 'High' };
  if (grade >= 70) return { bg: '#F59E0B20', text: '#F59E0B', label: 'Good' };
  if (grade >= 60) return { bg: '#F9731620', text: '#F97316', label: 'Average' };
  return { bg: '#6B728020', text: '#6B7280', label: 'Backup' };
};

const PlayerCard = ({ prospect, onSelect, isUserTurn, teamNeeds = [], isHighlighted = false }) => {
  const posColors = POSITION_COLORS[prospect.position] || POSITION_COLORS['TE'];
  const gradeInfo = getGradeColor(prospect.grade);
  const matchesNeed = teamNeeds.includes(prospect.position);
  const positionPriority = teamNeeds.indexOf(prospect.position) + 1;

  return (
    <div
      className={`
        relative p-4 rounded-xl border transition-all duration-300 cursor-pointer
        ${isUserTurn
          ? 'hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/10'
          : 'opacity-60 cursor-not-allowed'
        }
        ${matchesNeed ? 'border-l-4' : 'border-slate-700/50'}
        ${isHighlighted ? 'ring-2 ring-cyan-400 bg-cyan-500/5' : 'bg-slate-800/80'}
      `}
      style={{
        borderLeftColor: matchesNeed ? '#10B981' : undefined,
        background: isHighlighted
          ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(30, 41, 59, 0.9) 100%)'
          : undefined,
      }}
      onClick={() => isUserTurn && onSelect && onSelect(prospect)}
    >
      {/* Header Row: Name & Position */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-bold text-white truncate font-['Inter']">
            {prospect.name}
          </h4>
          <p className="text-sm text-slate-400 truncate">{prospect.college}</p>
        </div>
        <div
          className="flex-shrink-0 ml-3 px-2.5 py-1 rounded-md text-xs font-bold"
          style={{
            backgroundColor: posColors.bg,
            color: posColors.text,
            border: `1px solid ${posColors.border}40`,
          }}
        >
          {prospect.position}
        </div>
      </div>

      {/* Physical Stats Row */}
      <div className="flex items-center gap-4 mb-3 text-sm">
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-slate-300 font-medium">
            {formatHeight(prospect.height)}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
          <span className="text-slate-300 font-medium">
            {formatWeight(prospect.weight)}
          </span>
        </div>
      </div>

      {/* Stats Row: Rank, Round, Grade */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Rank</p>
            <p className="text-sm font-bold text-cyan-400">#{prospect.rank || prospect.consensusRank || 'N/A'}</p>
          </div>
          <div className="w-px h-8 bg-slate-700"></div>
          <div className="text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Round</p>
            <p className="text-sm font-bold text-slate-300">Rd {prospect.projectedRound || 'N/A'}</p>
          </div>
        </div>

        {/* Grade Badge */}
        <div
          className="px-3 py-1.5 rounded-lg flex items-center gap-2"
          style={{ backgroundColor: gradeInfo.bg }}
        >
          <span className="text-lg font-bold" style={{ color: gradeInfo.text }}>
            {prospect.grade}
          </span>
          <span className="text-xs font-medium" style={{ color: gradeInfo.text }}>
            {gradeInfo.label}
          </span>
        </div>
      </div>

      {/* Strengths */}
      {prospect.strengths && prospect.strengths.length > 0 && (
        <div className="pt-3 border-t border-slate-700/50">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Strengths</p>
          <div className="flex flex-wrap gap-1.5">
            {prospect.strengths.slice(0, 3).map((strength, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-slate-700/50 text-slate-300 text-xs rounded"
              >
                {strength}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Team Need Badge */}
      {matchesNeed && isUserTurn && (
        <div className="absolute -top-2 -right-2">
          <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
            NEED #{positionPriority}
          </span>
        </div>
      )}

      {/* User Pick Indicator */}
      {isHighlighted && (
        <div className="absolute -top-2 -left-2">
          <span className="px-2 py-1 bg-cyan-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
            YOUR PICK
          </span>
        </div>
      )}
    </div>
  );
};

export default PlayerCard;
