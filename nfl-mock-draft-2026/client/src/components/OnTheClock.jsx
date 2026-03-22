import React from 'react';

const OnTheClock = ({ team, pickNumber, round, pickInRound, isUserTurn, userTeamName }) => {
  if (!team) return null;

  return (
    <div className="card">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">
              {isUserTurn ? "You're on the clock!" : "On The Clock"}
            </p>
            <h2 className="text-2xl font-bold text-white">
              Round {round}, Pick {pickInRound}
            </h2>
          </div>
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: team.primaryColor }}
          >
            {team.abbreviation}
          </div>
        </div>

        <div
          className="p-4 rounded-lg"
          style={{ backgroundColor: `${team.primaryColor}20`, borderLeft: `4px solid ${team.primaryColor}` }}
        >
          <p className="text-white font-semibold text-lg">{team.name}</p>
          <p className="text-gray-400 text-sm">{team.division}</p>
        </div>

        {isUserTurn && (
          <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500 rounded-lg">
            <p className="text-yellow-400 font-medium text-sm">
              Make your pick from the player pool below!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnTheClock;
