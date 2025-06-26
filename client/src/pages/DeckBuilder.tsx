import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface Card {
  id: string;
  name: string;
  description: string;
  type: string;
  customType?: string;
  attack?: number;
  defense?: number;
  manaCost: Record<string, number>;
  effects: any[];
  artworkUrl?: string;
  deckId?: string;
}

interface Deck {
  id: string;
  name: string;
  commander: Card | null;
  cards: Card[];
  description: string;
  userId: string; // Add user ownership
  isPublic: boolean; // Add privacy setting
  createdAt: string;
}

export function DeckBuilder() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [currentDeck, setCurrentDeck] = useState<Deck>({
    id: '',
    name: '',
    commander: null,
    cards: [],
    description: '',
    userId: user?.id || '',
    isPublic: false,
    createdAt: new Date().toISOString()
  });
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  useEffect(() => {
    // Load cards (global) and decks (user-specific) from localStorage
    const savedCards = localStorage.getItem('magicschool-cards');
    const savedDecks = localStorage.getItem('magicschool-decks');
    
    if (savedCards) {
      setCards(JSON.parse(savedCards));
    }
    if (savedDecks && user) {
      const allDecks = JSON.parse(savedDecks);
      // Filter to show only current user's decks
      const userDecks = allDecks.filter((deck: Deck) => deck.userId === user.id);
      setDecks(userDecks);
    }
  }, [user]);

  const filteredCards = cards.filter(card => {
    const matchesType = filterType === 'all' || card.type === filterType;
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase());
    const isNotCommander = !currentDeck.commander || card.id !== currentDeck.commander.id;
    return matchesType && matchesSearch && isNotCommander;
  });

  const addCardToDeck = (card: Card) => {
    if (currentDeck.cards.length >= 99) {
      alert('Deck is full! Commander decks can have maximum 99 cards plus commander.');
      return;
    }

    const cardCount = currentDeck.cards.filter((c: Card) => c.id === card.id).length;
    if (cardCount >= 1 && card.type !== 'land') {
      alert('You can only have one copy of each non-land card in Commander format.');
      return;
    }
    if (cardCount >= 4) {
      alert('Maximum 4 copies of any land card allowed.');
      return;
    }

    setCurrentDeck((prev: Deck) => ({
      ...prev,
      cards: [...prev.cards, { ...card, deckId: Date.now().toString() }]
    }));
  };

  const removeCardFromDeck = (deckCardId: string) => {
    setCurrentDeck((prev: Deck) => ({
      ...prev,
      cards: prev.cards.filter((c: Card) => c.deckId !== deckCardId)
    }));
  };

  const setCommander = (card: Card) => {
    if (!['creature', 'scholar', 'teacher'].includes(card.type)) {
      alert('Only creatures, scholars, and teachers can be commanders!');
      return;
    }

    setCurrentDeck((prev: Deck) => ({
      ...prev,
      commander: card
    }));
  };

  const saveDeck = () => {
    if (!currentDeck.name.trim()) {
      alert('Please enter a deck name');
      return;
    }
    if (!currentDeck.commander) {
      alert('Please select a commander');
      return;
    }
    if (currentDeck.cards.length < 99) {
      if (!confirm(`Your deck has only ${currentDeck.cards.length} cards. Commander decks should have exactly 99 cards plus commander. Save anyway?`)) {
        return;
      }
    }

    const deckToSave = {
      ...currentDeck,
      id: currentDeck.id || Date.now().toString(),
      userId: user?.id || '',
      createdAt: currentDeck.createdAt || new Date().toISOString()
    };

    // Get all decks from localStorage (including other users' decks)
    const savedDecks = localStorage.getItem('magicschool-decks');
    const allDecks = savedDecks ? JSON.parse(savedDecks) : [];
    
    // Update/add only current user's deck
    const updatedAllDecks = currentDeck.id 
      ? allDecks.map((d: Deck) => d.id === currentDeck.id ? deckToSave : d)
      : [...allDecks, deckToSave];

    // Save all decks back to localStorage
    localStorage.setItem('magicschool-decks', JSON.stringify(updatedAllDecks));
    
    // Update current user's deck list for display
    const userDecks = updatedAllDecks.filter((deck: Deck) => deck.userId === user?.id);
    setDecks(userDecks);
    
    setShowSaveDialog(false);
    alert('Deck saved successfully!');
  };

  const loadDeck = (deck: Deck) => {
    setCurrentDeck(deck);
    setShowSaveDialog(false);
  };

  const newDeck = () => {
    setCurrentDeck({
      id: '',
      name: '',
      commander: null,
      cards: [],
      description: '',
      userId: user?.id || '',
      isPublic: false,
      createdAt: new Date().toISOString()
    });
  };

  const getDeckStats = () => {
    const stats = {
      creatures: 0,
      spells: 0,
      artifacts: 0,
      lands: 0,
      others: 0,
      avgManaCost: 0,
      manaDistribution: { math: 0, german: 0, english: 0, french: 0, latin: 0, differentiation: 0 }
    };

    let totalManaCost = 0;
    const allCards = currentDeck.commander ? [...currentDeck.cards, currentDeck.commander] : currentDeck.cards;

    allCards.forEach((card: Card) => {
      switch (card.type) {
        case 'creature':
        case 'scholar':
        case 'teacher':
        case 'student':
          stats.creatures++;
          break;
        case 'spell':
        case 'exam':
          stats.spells++;
          break;
        case 'artifact':
        case 'textbook':
          stats.artifacts++;
          break;
        case 'land':
        case 'classroom':
          stats.lands++;
          break;
        default:
          stats.others++;
      }

      const cardTotal = Object.values(card.manaCost).reduce((sum: number, cost: any) => sum + (cost as number), 0);
      totalManaCost += cardTotal;

      Object.entries(card.manaCost).forEach(([type, cost]) => {
        stats.manaDistribution[type as keyof typeof stats.manaDistribution] += cost as number;
      });
    });

    stats.avgManaCost = allCards.length > 0 ? Math.round((totalManaCost / allCards.length) * 100) / 100 : 0;
    return stats;
  };

  const stats = getDeckStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🃏 Commander Deck Builder
          </h1>
          <p className="text-xl text-gray-300">
            Build powerful 100-card Commander decks
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 mb-8 justify-center flex-wrap">
          <button
            onClick={() => navigate('/')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            🏠 Home
          </button>
          <button
            onClick={() => navigate('/collection')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            📚 Collection
          </button>
          <button
            onClick={newDeck}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            ➕ New Deck
          </button>
          <button
            onClick={() => setShowSaveDialog(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            💾 Save/Load Deck
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Card Pool */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <h2 className="text-2xl font-semibold text-white mb-6">🎴 Card Pool</h2>
              
              {/* Search and Filter */}
              <div className="space-y-4 mb-6">
                <input
                  type="text"
                  placeholder="Search cards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">All Types</option>
                  <option value="creature">Creatures</option>
                  <option value="spell">Spells</option>
                  <option value="artifact">Artifacts</option>
                  <option value="land">Lands</option>
                </select>
              </div>

              {/* Card List */}
              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredCards.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <div className="text-4xl mb-2">📝</div>
                    <p>No cards available</p>
                  </div>
                ) : (
                  filteredCards.map((card) => (
                    <div
                      key={card.id}
                      className="bg-slate-700/50 hover:bg-slate-700/70 rounded-lg p-3 cursor-pointer transition-colors"
                      onClick={() => setSelectedCard(card)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-white font-medium text-sm">{card.name}</h4>
                          <p className="text-gray-400 text-xs">{card.customType || card.type}</p>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addCardToDeck(card);
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
                          >
                            +
                          </button>
                          {['creature', 'scholar', 'teacher'].includes(card.type) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCommander(card);
                              }}
                              className="bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded text-xs"
                            >
                              👑
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Current Deck */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">🏗️ Current Deck</h2>
                <div className="text-white text-sm">
                  {currentDeck.cards.length}/99 + {currentDeck.commander ? '1' : '0'} Commander
                </div>
              </div>

              {/* Deck Name */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Deck Name"
                  value={currentDeck.name}
                  onChange={(e) => setCurrentDeck((prev: Deck) => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Commander */}
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-2">👑 Commander</h3>
                {currentDeck.commander ? (
                  <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-white font-medium">{currentDeck.commander.name}</h4>
                        <p className="text-gray-300 text-sm">{currentDeck.commander.customType || currentDeck.commander.type}</p>
                      </div>
                      <button
                        onClick={() => setCurrentDeck((prev: Deck) => ({ ...prev, commander: null }))}
                        className="text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center text-gray-400">
                    Select a creature, scholar, or teacher as commander
                  </div>
                )}
              </div>

              {/* Deck Cards */}
              <div className="max-h-64 overflow-y-auto space-y-1">
                {currentDeck.cards.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <div className="text-4xl mb-2">🃏</div>
                    <p>No cards in deck</p>
                  </div>
                ) : (
                  currentDeck.cards.map((card: Card, index: number) => (
                    <div key={card.deckId || index} className="bg-slate-700/30 rounded p-2 flex justify-between items-center">
                      <div>
                        <span className="text-white text-sm">{card.name}</span>
                        <span className="text-gray-400 text-xs ml-2">({card.customType || card.type})</span>
                      </div>
                      <button
                        onClick={() => card.deckId && removeCardFromDeck(card.deckId)}
                        className="text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Deck Stats & Preview */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <h2 className="text-2xl font-semibold text-white mb-6">📊 Deck Analysis</h2>
              
              {/* Card Type Distribution */}
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-3">Card Types</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">🐲 Creatures:</span>
                    <span className="text-white">{stats.creatures}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">⚡ Spells:</span>
                    <span className="text-white">{stats.spells}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">🔮 Artifacts:</span>
                    <span className="text-white">{stats.artifacts}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">🏔️ Lands:</span>
                    <span className="text-white">{stats.lands}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">📋 Others:</span>
                    <span className="text-white">{stats.others}</span>
                  </div>
                </div>
              </div>

              {/* Mana Curve */}
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-3">Mana Distribution</h3>
                <div className="text-sm text-gray-300 mb-2">
                  Average Mana Cost: <span className="text-white">{stats.avgManaCost}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-blue-600/20 p-2 rounded text-center">
                    <div className="text-blue-300">📘 Math</div>
                    <div className="text-white">{stats.manaDistribution.math}</div>
                  </div>
                  <div className="bg-red-600/20 p-2 rounded text-center">
                    <div className="text-red-300">🇩🇪 German</div>
                    <div className="text-white">{stats.manaDistribution.german}</div>
                  </div>
                  <div className="bg-gray-600/20 p-2 rounded text-center">
                    <div className="text-gray-300">📚 English</div>
                    <div className="text-white">{stats.manaDistribution.english}</div>
                  </div>
                  <div className="bg-green-600/20 p-2 rounded text-center">
                    <div className="text-green-300">🏛️ French</div>
                    <div className="text-white">{stats.manaDistribution.french}</div>
                  </div>
                  <div className="bg-amber-600/20 p-2 rounded text-center">
                    <div className="text-amber-300">📜 Latin</div>
                    <div className="text-white">{stats.manaDistribution.latin}</div>
                  </div>
                  <div className="bg-yellow-600/20 p-2 rounded text-center">
                    <div className="text-yellow-300">⚡ Diff</div>
                    <div className="text-white">{stats.manaDistribution.differentiation}</div>
                  </div>
                </div>
              </div>

              {/* Selected Card Preview */}
              {selectedCard && (
                <div>
                  <h3 className="text-white font-semibold mb-3">👁️ Card Preview</h3>
                  <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg border border-yellow-500 p-3 text-white">
                    <div className="text-center mb-2">
                      <h4 className="font-bold text-sm">{selectedCard.name}</h4>
                      <div className="text-xs text-gray-300">{selectedCard.customType || selectedCard.type}</div>
                    </div>
                    <div className="text-xs mb-2">{selectedCard.description}</div>
                    {selectedCard.effects?.length > 0 && (
                      <div className="text-xs text-yellow-300">
                        {selectedCard.effects.length} effect{selectedCard.effects.length > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Save/Load Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-md w-full mx-4">
              <h3 className="text-2xl font-semibold text-white mb-4">💾 Save/Load Deck</h3>
              
              <div className="space-y-4 mb-6">
                <button
                  onClick={saveDeck}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  💾 Save Current Deck
                </button>
              </div>

              <div className="mb-4">
                <h4 className="text-white font-semibold mb-2">Saved Decks:</h4>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {decks.length === 0 ? (
                    <p className="text-gray-400 text-sm">No saved decks</p>
                  ) : (
                    decks.map((deck) => (
                      <div key={deck.id} className="bg-slate-700 rounded p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="text-white font-medium">{deck.name}</h5>
                            <p className="text-gray-400 text-xs">
                              {deck.cards?.length || 0} cards + {deck.commander ? 'Commander' : 'No Commander'}
                            </p>
                          </div>
                          <button
                            onClick={() => loadDeck(deck)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Load
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <button
                onClick={() => setShowSaveDialog(false)}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
