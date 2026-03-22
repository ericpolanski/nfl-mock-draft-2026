import React, { useState, useMemo } from 'react';
import { teams, calculateTradeValue } from '../data';

const TradeModal = ({ isOpen, onClose, onSubmit, currentPick, picks }) => {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [picksToGive, setPicksToGive] = useState([]);
  const [picksToGet, setPicksToGet] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // Get available teams to trade with (not user's team)
  const availableTeams = useMemo(() => {
    return teams.filter(t => t.id !== 'chi'); // Assuming user is chi for now
  }, []);

  // Calculate trade values
  const giveValue = useMemo(() => calculateTradeValue(picksToGive), [picksToGive]);
  const getValue = useMemo(() => calculateTradeValue(picksToGet), [picksToGet]);

  const handleSubmit = async () => {
    if (!selectedTeam || picksToGive.length === 0) return;

    setIsSubmitting(true);
    try {
      const response = await onSubmit(selectedTeam, picksToGive, picksToGet);
      setResult(response);
    } catch (error) {
      setResult({ accepted: false, message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePick = (pickNum, list, setList) => {
    if (list.includes(pickNum)) {
      setList(list.filter(p => p !== pickNum));
    } else {
      setList([...list, pickNum]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative w-full max-w-2xl bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Propose Trade</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Close trade modal"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {result ? (
            <div className={`p-4 rounded-lg ${result.accepted ? 'bg-green-500/20 border border-green-500' : 'bg-red-500/20 border border-red-500'}`}>
              <p className={`font-medium ${result.accepted ? 'text-green-400' : 'text-red-400'}`}>
                {result.message}
              </p>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-gray-400">Your offer value: {giveValue}</span>
                <span className="text-gray-400">Their value: {getValue}</span>
              </div>
              <button
                onClick={() => {
                  setResult(null);
                  setPicksToGive([]);
                  setPicksToGet([]);
                }}
                className="mt-4 w-full py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                Make Another Offer
              </button>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Trade Partner
                </label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="select w-full"
                >
                  <option value="">Select a team...</option>
                  {availableTeams.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Picks to Give
                  </label>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {[1, 2, 3, 4, 5, 6, 7].map(round => (
                      <button
                        key={round}
                        onClick={() => togglePick(round, picksToGive, setPicksToGive)}
                        className={`w-full px-3 py-2 text-sm rounded-lg transition-colors ${
                          picksToGive.includes(round)
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500'
                            : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        }`}
                      >
                        Round {round}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-gray-400">Value: {giveValue}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Picks to Get
                  </label>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {[1, 2, 3, 4, 5, 6, 7].map(round => (
                      <button
                        key={round}
                        onClick={() => togglePick(round, picksToGet, setPicksToGet)}
                        className={`w-full px-3 py-2 text-sm rounded-lg transition-colors ${
                          picksToGet.includes(round)
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500'
                            : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        }`}
                      >
                        Round {round}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-gray-400">Value: {getValue}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-700/50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Trade Fairness:</span>
                  {giveValue > 0 && getValue > 0 && (
                    <span className={`font-medium ${giveValue >= getValue * 0.85 ? 'text-green-400' : 'text-red-400'}`}>
                      {giveValue >= getValue * 0.85 ? 'Fair' : 'Unfair'}
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {!result && (
          <div className="px-6 py-4 border-t border-slate-700 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedTeam || picksToGive.length === 0 || isSubmitting}
              className={`
                flex-1 py-3 rounded-lg font-medium transition-all duration-200
                ${selectedTeam && picksToGive.length > 0
                  ? 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-500 hover:to-green-400'
                  : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                }
              `}
            >
              {isSubmitting ? 'Proposing...' : 'Submit Trade'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradeModal;
