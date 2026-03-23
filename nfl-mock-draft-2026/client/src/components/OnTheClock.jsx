import React from 'react';
import { motion } from 'framer-motion';

const PositionBadge = ({ position, filled }) => {
  const colors = {
    'QB': 'bg-red-500/20 text-red-400',
    'RB': 'bg-teal-500/20 text-teal-400',
    'WR': 'bg-blue-500/20 text-blue-400',
    'TE': 'bg-green-500/20 text-green-400',
    'OT': 'bg-yellow-500/20 text-yellow-400',
    'OG': 'bg-yellow-500/20 text-yellow-400',
    'C': 'bg-yellow-500/20 text-yellow-400',
    'DL': 'bg-purple-500/20 text-purple-400',
    'EDGE': 'bg-purple-500/20 text-purple-400',
    'DT': 'bg-purple-500/20 text-purple-400',
    'LB': 'bg-emerald-500/20 text-emerald-400',
    'CB': 'bg-amber-500/20 text-amber-400',
    'S': 'bg-amber-500/20 text-amber-400',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${filled ? 'bg-slate-600/50 text-slate-400 line-through' : colors[position] || 'bg-slate-500/20 text-slate-400'}`}>
      {position}
    </span>
  );
};

const OnTheClock = ({ team, pickNumber, round, pickInRound, isUserTurn, userTeamName, teamNeeds = [] }) => {
  if (!team) return null;

  // Get unfilled team needs
  const needs = Object.entries(teamNeeds || team.needs || {}).sort((a, b) => a[1] - b[1]);

  return (
    <div className="card bg-[#1e293b] border-slate-700">
      <div className="p-4">
        {/* Pulsing ON THE CLOCK indicator */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
              <p className="text-sm font-bold text-cyan-400 uppercase tracking-wider font-['Oswald'] animate-pulse">
                On The Clock
              </p>
            </div>
            <h2 className="text-2xl font-bold text-white font-['Oswald']">
              Round {round}, Pick {pickInRound}
            </h2>
          </div>
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg"
            style={{ backgroundColor: team.primaryColor }}
          >
            {team.abbreviation}
          </div>
        </div>

        {/* Team Info */}
        <div
          className="p-4 rounded-lg mb-4"
          style={{ backgroundColor: `${team.primaryColor}20`, borderLeft: `4px solid ${team.primaryColor}` }}
        >
          <p className="text-white font-semibold text-lg">{team.name}</p>
          <p className="text-slate-400 text-sm">{team.division}</p>
        </div>

        {/* Team Needs */}
        {needs.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Team Needs</p>
            <div className="flex flex-wrap gap-2">
              {needs.slice(0, 5).map(([position, priority]) => (
                <PositionBadge key={position} position={position} filled={false} />
              ))}
            </div>
          </div>
        )}

        {/* User Turn Alert with Glow Effect */}
        {isUserTurn && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-3 bg-yellow-500/20 border-2 border-yellow-500 rounded-lg shadow-lg shadow-yellow-500/40"
          >
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 10px rgba(234, 179, 8, 0.3)',
                  '0 0 25px rgba(234, 179, 8, 0.6)',
                  '0 0 10px rgba(234, 179, 8, 0.3)',
                ],
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="rounded-lg"
            >
              <p className="text-yellow-400 font-bold text-sm text-center">
                YOUR TURN - Make your pick!
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OnTheClock;
