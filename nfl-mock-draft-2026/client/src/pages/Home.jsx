import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TeamSelector from '../components/TeamSelector';

const Home = () => {
  const navigate = useNavigate();
  const [selectedTeam, setSelectedTeam] = useState('');

  const handleStartDraft = () => {
    if (selectedTeam) {
      navigate(`/draft?team=${selectedTeam}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300fff5' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 mb-6 shadow-lg shadow-cyan-500/25">
              <span className="text-3xl font-black text-white">NFL</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
              2026 Mock Draft
              <span className="block text-cyan-400">
                Simulator
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Take control of your favorite team and make the draft decisions.
              Watch AI-powered teams make realistic picks based on team needs.
            </p>
          </div>

          {/* Team Selection Card */}
          <div className="max-w-md mx-auto">
            <div className="card p-6">
              <TeamSelector
                value={selectedTeam}
                onChange={setSelectedTeam}
              />

              <button
                onClick={handleStartDraft}
                disabled={!selectedTeam}
                className={`
                  w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all duration-200
                  ${selectedTeam
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transform hover:scale-[1.02]'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  }
                `}
              >
                Start Draft
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">32 Teams</h3>
              <p className="text-gray-400 text-sm">All NFL teams with realistic needs and colors</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">AI Opponents</h3>
              <p className="text-gray-400 text-sm">Smart picks based on team needs and BPA</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">Trade System</h3>
              <p className="text-gray-400 text-sm">Propose trades with Jimmy Johnson values</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            NFL 2026 Mock Draft Simulator • Built with React + Vite
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
