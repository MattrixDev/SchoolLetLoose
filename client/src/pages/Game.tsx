import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export function Game() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  
  const [gameStarted] = useState(false);
  const [playerLife] = useState(20);
  const [opponentLife] = useState(20);
  const [currentPhase] = useState('main');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/lobby')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                ← Back to Lobby
              </button>
              <h1 className="text-2xl font-bold text-white">
                🎮 Game Room: {roomId}
              </h1>
            </div>
            <div className="text-white">
              Phase: <span className="text-blue-400 capitalize">{currentPhase}</span>
            </div>
          </div>
        </div>

        {!gameStarted ? (
          /* Waiting Room */
          <div className="text-center py-16">
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">⏳</div>
              <h2 className="text-2xl font-bold text-white mb-4">Waiting for Players</h2>
              <p className="text-gray-300 mb-6">
                Share this room ID with a friend to start playing!
              </p>
              <div className="bg-slate-700 rounded-lg p-4 mb-6">
                <div className="text-sm text-gray-400 mb-1">Room ID</div>
                <div className="text-2xl font-mono text-white">{roomId}</div>
              </div>
              <div className="text-sm text-gray-400">
                🎓 Players will start with 20 life points<br/>
                📚 Use school subjects as mana types<br/>
                🎯 Reduce opponent to 0 life to win
              </div>
            </div>
          </div>
        ) : (
          /* Game Board */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Opponent Area */}
            <div className="lg:col-span-3">
              <div className="bg-red-900/20 rounded-xl border border-red-700 p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                      O
                    </div>
                    <div>
                      <div className="text-white font-semibold">Opponent</div>
                      <div className="text-red-300">❤️ {opponentLife} Life</div>
                    </div>
                  </div>
                  <div className="text-right text-white">
                    <div className="text-sm text-gray-400">Cards in Hand</div>
                    <div className="text-2xl font-bold">7</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Battlefield */}
            <div className="lg:col-span-3">
              <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-6 min-h-[200px]">
                <h3 className="text-white text-lg font-semibold mb-4">⚔️ Battlefield</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-red-300 text-sm mb-2">Opponent's Creatures</div>
                    <div className="bg-red-900/10 rounded-lg p-4 min-h-[100px] flex items-center justify-center text-gray-500">
                      No creatures
                    </div>
                  </div>
                  <div>
                    <div className="text-blue-300 text-sm mb-2">Your Creatures</div>
                    <div className="bg-blue-900/10 rounded-lg p-4 min-h-[100px] flex items-center justify-center text-gray-500">
                      No creatures
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Player Area */}
            <div className="lg:col-span-3">
              <div className="bg-blue-900/20 rounded-xl border border-blue-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      P
                    </div>
                    <div>
                      <div className="text-white font-semibold">You</div>
                      <div className="text-blue-300">❤️ {playerLife} Life</div>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                      End Turn
                    </button>
                  </div>
                </div>

                {/* Mana Pool */}
                <div className="mb-4">
                  <div className="text-white text-sm mb-2">⚡ Mana Pool</div>
                  <div className="flex space-x-2">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">3</div>
                    <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">2</div>
                    <div className="bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">1</div>
                    <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">0</div>
                    <div className="bg-yellow-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">1</div>
                  </div>
                </div>

                {/* Hand */}
                <div>
                  <div className="text-white text-sm mb-2">🎴 Your Hand</div>
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {/* Mock cards */}
                    {[1, 2, 3, 4, 5].map((cardId) => (
                      <div
                        key={cardId}
                        className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg border border-yellow-500 p-3 min-w-[120px] cursor-pointer hover:scale-105 transition-transform"
                      >
                        <div className="text-white text-sm font-bold">Math Spell {cardId}</div>
                        <div className="text-xs text-gray-300 mt-1">Deal 2 damage</div>
                        <div className="flex justify-center mt-2">
                          <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            2
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
