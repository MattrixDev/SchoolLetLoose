import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Users, Lock, Crown, Shield, User } from 'lucide-react';

// Types (in a real app these would come from shared/types.ts)
interface Room {
  id: string;
  name: string;
  host: string;
  hostRole: string;
  players: RoomPlayer[];
  maxPlayers: number;
  gameMode: string;
  deckFormat: string;
  isPrivate: boolean;
  status: string;
  createdAt: Date;
}

interface RoomPlayer {
  id: string;
  username: string;
  role: string;
  deck?: any;
  isReady: boolean;
  joinedAt: Date;
}

interface GameSettings {
  timeLimit: number;
  startingLife: number;
  startingHandSize: number;
  allowSpectators: boolean;
  deckValidation: boolean;
}

export function Lobby() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [userDecks, setUserDecks] = useState<any[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  
  const [newRoom, setNewRoom] = useState({
    name: '',
    gameMode: 'casual',
    deckFormat: 'commander',
    isPrivate: false,
    password: '',
    gameSettings: {
      timeLimit: 20,
      startingLife: 20,
      startingHandSize: 7,
      allowSpectators: true,
      deckValidation: true
    } as GameSettings
  });

  // Demo rooms for testing
  const DEMO_ROOMS: Room[] = [
    {
      id: '1',
      name: '🏆 Beginner Friendly',
      host: 'TeacherBot',
      hostRole: 'creator',
      players: [
        { id: 'host1', username: 'TeacherBot', role: 'creator', isReady: true, joinedAt: new Date() }
      ],
      maxPlayers: 2,
      gameMode: 'casual',
      deckFormat: 'commander',
      isPrivate: false,
      status: 'waiting',
      createdAt: new Date()
    },
    {
      id: '2',
      name: '⚔️ Competitive Match',
      host: 'ProPlayer',
      hostRole: 'player',
      players: [
        { id: 'host2', username: 'ProPlayer', role: 'player', isReady: true, joinedAt: new Date() }
      ],
      maxPlayers: 2,
      gameMode: 'ranked',
      deckFormat: 'standard',
      isPrivate: false,
      status: 'waiting',
      createdAt: new Date()
    },
    {
      id: '3',
      name: '🔒 Private Study Session',
      host: 'StudyGroup',
      hostRole: 'admin',
      players: [
        { id: 'host3', username: 'StudyGroup', role: 'admin', isReady: false, joinedAt: new Date() }
      ],
      maxPlayers: 2,
      gameMode: 'custom',
      deckFormat: 'commander',
      isPrivate: true,
      status: 'waiting',
      createdAt: new Date()
    }
  ];

  useEffect(() => {
    // Load rooms and user decks
    setRooms(DEMO_ROOMS);
    
    // Load user's decks
    const savedDecks = localStorage.getItem('schoolletloose-decks');
    if (savedDecks && user) {
      const allDecks = JSON.parse(savedDecks);
      const myDecks = allDecks.filter((deck: any) => deck.userId === user.id);
      setUserDecks(myDecks);
    }
  }, [user]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4 text-yellow-400" />;
      case 'creator': return <Shield className="h-4 w-4 text-purple-400" />;
      default: return <User className="h-4 w-4 text-blue-400" />;
    }
  };

  const createRoom = () => {
    if (!newRoom.name.trim()) {
      alert('Please enter a room name');
      return;
    }

    const room: Room = {
      id: Date.now().toString(),
      name: newRoom.name,
      host: user?.id || '',
      hostRole: user?.role || 'player',
      players: [{
        id: user?.id || '',
        username: user?.username || '',
        role: user?.role || 'player',
        isReady: false,
        joinedAt: new Date()
      }],
      maxPlayers: 2,
      gameMode: newRoom.gameMode,
      deckFormat: newRoom.deckFormat,
      isPrivate: newRoom.isPrivate,
      status: 'waiting',
      createdAt: new Date()
    };

    setRooms(prev => [...prev, room]);
    setSelectedRoom(room);
    setShowCreateRoom(false);
    
    // Reset form
    setNewRoom({
      name: '',
      gameMode: 'casual',
      deckFormat: 'commander',
      isPrivate: false,
      password: '',
      gameSettings: {
        timeLimit: 20,
        startingLife: 20,
        startingHandSize: 7,
        allowSpectators: true,
        deckValidation: true
      }
    });
  };

  const joinRoom = (room: Room) => {
    if (room.players.length >= room.maxPlayers) {
      alert('Room is full!');
      return;
    }

    if (room.isPrivate) {
      const password = prompt('Enter room password:');
      if (!password) return;
      // In real app, validate password
    }

    const updatedRoom = {
      ...room,
      players: [...room.players, {
        id: user?.id || '',
        username: user?.username || '',
        role: user?.role || 'player',
        isReady: false,
        joinedAt: new Date()
      }]
    };

    setRooms(prev => prev.map(r => r.id === room.id ? updatedRoom : r));
    setSelectedRoom(updatedRoom);
  };

  const leaveRoom = () => {
    if (!selectedRoom || !user) return;

    const updatedRoom = {
      ...selectedRoom,
      players: selectedRoom.players.filter(p => p.id !== user.id)
    };

    setRooms(prev => prev.map(r => r.id === selectedRoom.id ? updatedRoom : r));
    setSelectedRoom(null);
    setSelectedDeck(null);
    setIsReady(false);
  };

  const toggleReady = () => {
    if (!selectedRoom || !user || !selectedDeck) {
      if (!selectedDeck) {
        alert('Please select a deck first!');
      }
      return;
    }

    const newReadyState = !isReady;
    setIsReady(newReadyState);

    const updatedRoom = {
      ...selectedRoom,
      players: selectedRoom.players.map(p => 
        p.id === user.id ? { ...p, isReady: newReadyState, deck: selectedDeck } : p
      )
    };

    setRooms(prev => prev.map(r => r.id === selectedRoom.id ? updatedRoom : r));
    setSelectedRoom(updatedRoom);

    // Check if all players are ready
    if (newReadyState && updatedRoom.players.length === 2 && updatedRoom.players.every(p => p.isReady)) {
      setTimeout(() => {
        alert('All players ready! Starting game...');
        navigate(`/game/${selectedRoom.id}`);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-400 mr-3" />
            <h1 className="text-3xl font-bold">Game Lobby</h1>
          </div>
          <button
            onClick={() => setShowCreateRoom(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            ➕ Create Room
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Room List */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
              <h2 className="text-xl font-semibold mb-6">Available Rooms</h2>
              
              {rooms.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-6xl mb-4">🏛️</div>
                  <p className="text-lg mb-2">No rooms available</p>
                  <p className="text-sm">Create the first room to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      className={`border rounded-lg p-4 transition-all cursor-pointer ${
                        selectedRoom?.id === room.id
                          ? 'border-blue-500 bg-blue-900/20'
                          : 'border-slate-600 bg-slate-700/50 hover:bg-slate-700/70'
                      }`}
                      onClick={() => selectedRoom?.id === room.id ? null : joinRoom(room)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{room.name}</h3>
                          {room.isPrivate && <Lock className="h-4 w-4 text-yellow-400" />}
                        </div>
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(room.hostRole)}
                          <span className="text-sm text-gray-400">{room.host}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-300">
                        <div>
                          <span className="capitalize">{room.gameMode}</span> • <span className="capitalize">{room.deckFormat}</span>
                        </div>
                        <div>
                          {room.players.length}/{room.maxPlayers} players
                        </div>
                      </div>
                      
                      <div className="mt-2 flex space-x-2">
                        {room.players.map((player) => (
                          <div key={player.id} className="flex items-center space-x-1 text-xs">
                            {getRoleIcon(player.role)}
                            <span className={player.isReady ? 'text-green-400' : 'text-gray-400'}>
                              {player.username}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Room Details / Deck Selection */}
          <div className="lg:col-span-1">
            {selectedRoom ? (
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Room: {selectedRoom.name}</h2>
                  <button
                    onClick={leaveRoom}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Leave
                  </button>
                </div>

                {/* Deck Selection */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Select Your Deck</h3>
                  {userDecks.length === 0 ? (
                    <div className="text-center py-6 text-gray-400">
                      <p className="mb-2">No decks available</p>
                      <button
                        onClick={() => navigate('/deck-builder')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        Build a Deck
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {userDecks.map((deck) => (
                        <div
                          key={deck.id}
                          onClick={() => setSelectedDeck(deck)}
                          className={`border rounded-lg p-3 cursor-pointer transition-all ${
                            selectedDeck?.id === deck.id
                              ? 'border-blue-500 bg-blue-900/20'
                              : 'border-slate-600 bg-slate-700/50 hover:bg-slate-700/70'
                          }`}
                        >
                          <div className="font-medium">{deck.name}</div>
                          <div className="text-sm text-gray-400">
                            {deck.cards.length} cards
                            {deck.commander && (
                              <span> • Commander: {deck.commander.name}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Ready Button */}
                <button
                  onClick={toggleReady}
                  disabled={!selectedDeck}
                  className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors ${
                    isReady
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : selectedDeck
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isReady ? '❌ Not Ready' : '✅ Ready to Play'}
                </button>

                {/* Players in Room */}
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Players in Room</h3>
                  <div className="space-y-2">
                    {selectedRoom.players.map((player) => (
                      <div key={player.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(player.role)}
                          <span>{player.username}</span>
                          {player.id === selectedRoom.host && (
                            <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded">HOST</span>
                          )}
                        </div>
                        <div className={`text-sm ${player.isReady ? 'text-green-400' : 'text-gray-400'}`}>
                          {player.isReady ? '✅ Ready' : '⏱️ Not Ready'}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {selectedRoom.players.length === 2 && selectedRoom.players.every(p => p.isReady) && (
                    <div className="mt-4 text-center">
                      <div className="text-green-400 font-semibold mb-2">🎮 All Players Ready!</div>
                      <div className="text-sm text-gray-400">Game will start automatically...</div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                <div className="text-center py-12 text-gray-400">
                  <div className="text-4xl mb-4">👆</div>
                  <p className="mb-6">Select a room to join or create your own</p>
                  
                  {/* Quick Game Info */}
                  <div className="mt-8 text-left text-sm">
                    <h3 className="font-semibold mb-2 text-white">🎮 Game Formats:</h3>
                    <div className="space-y-1">
                      <div>📜 <span className="text-blue-400">Commander</span> - 99 cards + commander</div>
                      <div>⚔️ <span className="text-green-400">Standard</span> - 60+ card constructed</div>
                      <div>🎨 <span className="text-purple-400">Custom</span> - House rules allowed</div>
                    </div>
                    
                    <h3 className="font-semibold mb-2 mt-4 text-white">🏆 Game Modes:</h3>
                    <div className="space-y-1">
                      <div>😎 <span className="text-blue-400">Casual</span> - Fun, relaxed matches</div>
                      <div>🏅 <span className="text-yellow-400">Ranked</span> - Competitive play</div>
                      <div>⚙️ <span className="text-gray-400">Custom</span> - Special rules</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Create Room Modal */}
        {showCreateRoom && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-6">Create New Room</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Room Name</label>
                  <input
                    type="text"
                    value={newRoom.name}
                    onChange={(e) => setNewRoom(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                    placeholder="Enter room name..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Game Mode</label>
                  <select
                    value={newRoom.gameMode}
                    onChange={(e) => setNewRoom(prev => ({ ...prev, gameMode: e.target.value }))}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                  >
                    <option value="casual">Casual</option>
                    <option value="ranked">Ranked</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Deck Format</label>
                  <select
                    value={newRoom.deckFormat}
                    onChange={(e) => setNewRoom(prev => ({ ...prev, deckFormat: e.target.value }))}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                  >
                    <option value="commander">Commander</option>
                    <option value="standard">Standard</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="private"
                    checked={newRoom.isPrivate}
                    onChange={(e) => setNewRoom(prev => ({ ...prev, isPrivate: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="private" className="text-sm text-gray-300">Private Room</label>
                </div>
              </div>

              <div className="flex space-x-4 mt-8">
                <button
                  onClick={() => setShowCreateRoom(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createRoom}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Create Room
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
