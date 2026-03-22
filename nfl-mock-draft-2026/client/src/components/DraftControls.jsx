import React from 'react';

const DraftControls = ({
  isUserTurn,
  isComplete,
  onSimForward,
  onProposeTrade,
  onReset,
  loading,
  picks,
}) => {
  const canSimForward = !isUserTurn && !isComplete && picks.length > 0;
  const canTrade = isUserTurn && !isComplete;

  return (
    <div className="card">
      <div className="p-4">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onSimForward}
            disabled={!canSimForward || loading}
            className={`
              flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200
              ${canSimForward
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/25'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }
            `}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Simulating...
              </span>
            ) : (
              'Sim Forward'
            )}
          </button>

          <button
            onClick={onProposeTrade}
            disabled={!canTrade}
            className={`
              flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200
              ${canTrade
                ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-500 hover:to-purple-400 shadow-lg shadow-purple-500/25'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }
            `}
          >
            Propose Trade
          </button>

          <button
            onClick={onReset}
            className="px-4 py-3 rounded-lg font-medium bg-slate-700 text-gray-300 hover:bg-slate-600 transition-colors duration-200"
          >
            Reset
          </button>
        </div>

        {isComplete && (
          <div className="mt-4 p-3 bg-green-500/20 border border-green-500 rounded-lg">
            <p className="text-green-400 font-medium text-center">
              Draft Complete! Check the recap below.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DraftControls;
