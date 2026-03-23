import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${colors[position] || 'bg-slate-500/20 text-slate-400'}`}>
      {position}
    </span>
  );
};

const GradeIndicator = ({ grade }) => {
  const getGradeColor = (g) => {
    if (g >= 95) return { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Elite' };
    if (g >= 90) return { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Pro Bowler' };
    if (g >= 85) return { bg: 'bg-cyan-500/20', text: 'text-cyan-400', label: 'Starter' };
    if (g >= 80) return { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Good' };
    if (g >= 75) return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Rotation' };
    return { bg: 'bg-slate-500/20', text: 'text-slate-400', label: 'Project' };
  };

  const gradeInfo = getGradeColor(grade);

  return (
    <div className={`px-4 py-2 rounded-lg ${gradeInfo.bg}`}>
      <div className="flex items-center gap-2">
        <span className={`text-2xl font-bold ${gradeInfo.text}`}>{grade}</span>
        <span className={`text-sm ${gradeInfo.text}`}>{gradeInfo.label}</span>
      </div>
    </div>
  );
};

const PlayerDetailModal = ({ prospect, isOpen, onClose, onDraft, isUserTurn }) => {
  if (!prospect) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-lg bg-slate-800 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto border border-slate-700">
              {/* Header */}
              <div className="relative p-6 bg-gradient-to-br from-slate-700 to-slate-800">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-slate-600/50 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-slate-600 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{prospect.position}</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white font-['Oswald']">{prospect.name}</h2>
                    <p className="text-slate-400">{prospect.college}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Grade */}
                <div className="flex items-center justify-between">
                  <GradeIndicator grade={prospect.grade} />
                  <PositionBadge position={prospect.position} />
                </div>

                {/* Physical Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase mb-1">Height</p>
                    <p className="text-lg font-semibold text-white">{prospect.height || 'N/A'}</p>
                  </div>
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase mb-1">Weight</p>
                    <p className="text-lg font-semibold text-white">{prospect.weight ? `${prospect.weight} lbs` : 'N/A'}</p>
                  </div>
                </div>

                {/* Strengths */}
                {prospect.strengths && prospect.strengths.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-400 uppercase mb-2">Strengths</h3>
                    <div className="flex flex-wrap gap-2">
                      {prospect.strengths.map((strength, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm"
                        >
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Weaknesses */}
                {prospect.weaknesses && prospect.weaknesses.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-400 uppercase mb-2">Areas to Improve</h3>
                    <div className="flex flex-wrap gap-2">
                      {prospect.weaknesses.map((weakness, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm"
                        >
                          {weakness}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Scouting Report */}
                {prospect.scoutingReport && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-400 uppercase mb-2">Scouting Report</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">{prospect.scoutingReport}</p>
                  </div>
                )}

                {/* Draft Button */}
                {isUserTurn && onDraft && (
                  <button
                    onClick={() => {
                      onDraft(prospect);
                      onClose();
                    }}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25"
                  >
                    Draft {prospect.name}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PlayerDetailModal;
