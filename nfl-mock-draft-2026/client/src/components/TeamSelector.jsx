import React from 'react';
import { teams } from '../data';

const TeamSelector = ({ value, onChange, disabled }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Select Your Team
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="select w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
        >
          <option value="">-- Select a Team --</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name} ({team.abbreviation})
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {value && (
        <div className="mt-4 flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
          {(() => {
            const selectedTeam = teams.find(t => t.id === value);
            return (
              <>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: selectedTeam?.primaryColor }}
                >
                  {selectedTeam?.abbreviation}
                </div>
                <div>
                  <p className="text-white font-medium">{selectedTeam?.name}</p>
                  <p className="text-gray-400 text-sm">{selectedTeam?.division}</p>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default TeamSelector;
