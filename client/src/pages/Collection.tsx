import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { CheckCircle, Clock } from 'lucide-react';

export function Collection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cards, setCards] = useState<any[]>([]);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all'); // all, approved, pending
  const [searchTerm, setSearchTerm] = useState('');

  // Helper function for mana color classes
  const getManaColorClass = (type: string) => {
    switch (type) {
      case 'math': return 'bg-blue-600';
      case 'german': return 'bg-red-600';
      case 'english': return 'bg-gray-600';
      case 'french': return 'bg-green-600';
      case 'latin': return 'bg-amber-600';
      case 'differentiation': return 'bg-yellow-600';
      case 'learning': return 'bg-gray-500';
      default: return 'bg-gray-600';
    }
  };

  useEffect(() => {
    // Load cards from localStorage
    try {
      const savedCards = localStorage.getItem('schoolletloose-cards');
      if (savedCards) {
        const parsedCards = JSON.parse(savedCards);
        console.log('Loaded cards from storage:', parsedCards.length, 'cards');
        setCards(parsedCards);
      } else {
        console.log('No cards found in storage');
      }
    } catch (error) {
      console.error('Error loading cards from storage:', error);
      alert('Error loading your card collection. Please refresh the page.');
    }
  }, []);

  const clearAllCards = () => {
    if (confirm('Are you sure you want to delete ALL cards? This action cannot be undone.')) {
      localStorage.removeItem('schoolletloose-cards');
      setCards([]);
      setSelectedCard(null);
      console.log('All cards cleared from storage');
    }
  };

  const loadCards = () => {
    try {
      const savedCards = localStorage.getItem('schoolletloose-cards');
      if (savedCards) {
        const parsedCards = JSON.parse(savedCards);
        console.log('Reloaded cards from storage:', parsedCards.length, 'cards');
        setCards(parsedCards);
      } else {
        console.log('No cards found in storage');
        setCards([]);
      }
    } catch (error) {
      console.error('Error loading cards from storage:', error);
      alert('Error loading your card collection. Please refresh the page.');
    }
  };

  const filteredCards = cards.filter(card => {
    const matchesType = filterType === 'all' || card.type === filterType;
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filtering based on user role
    let matchesStatus = true;
    if (user?.role === 'player') {
      // Players see approved cards and their own suggestions
      matchesStatus = (card.status === 'approved' || card.createdBy === user.id);
    } else if (user?.role === 'creator' || user?.role === 'admin') {
      // Creators and admins can see all cards, filtered by status if selected
      if (filterStatus === 'approved') {
        matchesStatus = card.status === 'approved';
      } else if (filterStatus === 'pending') {
        matchesStatus = card.status === 'pending';
      }
      // else all cards (approved and pending)
    } else {
      // Unauthenticated users see only approved cards
      matchesStatus = card.status === 'approved';
    }
    
    return matchesType && matchesSearch && matchesStatus;
  });

  const approveCard = (cardId: string) => {
    const updatedCards = cards.map(card => 
      card.id === cardId ? { ...card, status: 'approved' } : card
    );
    setCards(updatedCards);
    localStorage.setItem('schoolletloose-cards', JSON.stringify(updatedCards));
  };

  const rejectCard = (cardId: string) => {
    if (confirm('Are you sure you want to reject this card? It will be deleted.')) {
      const updatedCards = cards.filter(card => card.id !== cardId);
      setCards(updatedCards);
      localStorage.setItem('magicschool-cards', JSON.stringify(updatedCards));
      setSelectedCard(null);
    }
  };

  const deleteCard = (cardId: string) => {
    if (confirm('Are you sure you want to delete this card?')) {
      const updatedCards = cards.filter(card => card.id !== cardId);
      setCards(updatedCards);
      localStorage.setItem('schoolletloose-cards', JSON.stringify(updatedCards));
      setSelectedCard(null);
    }
  };

  const duplicateCard = (card: any) => {
    const newCard = {
      ...card,
      id: Date.now().toString(),
      name: card.name + ' (Copy)'
    };
    const updatedCards = [...cards, newCard];
    setCards(updatedCards);
    localStorage.setItem('schoolletloose-cards', JSON.stringify(updatedCards));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            📚 Card Collection
          </h1>
          <p className="text-xl text-gray-300">
            Manage your created cards and build decks
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={() => navigate('/')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            🏠 Home
          </button>
          <button
            onClick={() => navigate('/card-builder')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            🎨 Create Card
          </button>
          <button
            onClick={() => navigate('/deck-builder')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            🃏 Build Deck
          </button>
          <button
            onClick={loadCards}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            🔄 Refresh
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Card List */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Search cards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">All Types</option>
                  <option value="creature">Creatures</option>
                  <option value="spell">Spells</option>
                  <option value="artifact">Artifacts</option>
                  <option value="land">Lands</option>
                  <option value="enchantment">Enchantments</option>
                  <option value="scholar">Scholars</option>
                  <option value="teacher">Teachers</option>
                  <option value="student">Students</option>
                </select>
                {(user?.role === 'creator' || user?.role === 'admin') && (
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                  </select>
                )}
              </div>

              <div className="text-white mb-4 flex justify-between items-center">
                <span>{filteredCards.length} cards found</span>
                <span className="text-sm text-gray-400">
                  Total in collection: {cards.length}
                </span>
              </div>

              {filteredCards.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-lg mb-2">
                    {cards.length === 0 ? 'No cards in your collection' : 'No cards match your search'}
                  </p>
                  <p className="text-sm mb-4">
                    {cards.length === 0 
                      ? 'Create your first card to get started!' 
                      : 'Try adjusting your search terms or filter settings.'
                    }
                  </p>
                  {cards.length === 0 && (
                    <button
                      onClick={() => navigate('/card-builder')}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      🎨 Create Your First Card
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {filteredCards.map((card) => (
                    <div
                      key={card.id}
                      onClick={() => setSelectedCard(card)}
                      className={`cursor-pointer p-4 rounded-lg border transition-all ${
                        selectedCard?.id === card.id
                          ? 'border-blue-500 bg-blue-900/20'
                          : 'border-slate-600 bg-slate-700/50 hover:bg-slate-700/70'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white font-semibold truncate">{card.name}</h3>
                        <div className="flex items-center space-x-2">
                          {/* Status indicator */}
                          {card.status === 'pending' && (
                            <div title="Pending approval">
                              <Clock className="h-4 w-4 text-yellow-400" />
                            </div>
                          )}
                          {card.status === 'approved' && (
                            <div title="Approved">
                              <CheckCircle className="h-4 w-4 text-green-400" />
                            </div>
                          )}
                          {!card.status && (
                            <div title="Approved (legacy)">
                              <CheckCircle className="h-4 w-4 text-green-400" />
                            </div>
                          )}
                          {/* Mana cost */}
                          <div className="flex space-x-1">
                            {Object.entries(card.manaCost).map(([type, cost]) => 
                              (cost as number) > 0 ? (
                                <span key={type} className={`${getManaColorClass(type)} text-white rounded-full w-5 h-5 flex items-center justify-center text-xs`}>
                                  {cost as number}
                                </span>
                              ) : null
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-gray-300 text-sm mb-2">
                        {card.customType || card.type}
                      </div>
                      <div className="text-gray-400 text-xs truncate">
                        {card.description}
                      </div>
                      {card.effects.length > 0 && (
                        <div className="text-yellow-400 text-xs mt-1 flex items-center gap-1">
                          {card.effects.length} effect{card.effects.length > 1 ? 's' : ''}
                          {card.effects.some((effect: any) => effect.type === 'custom') && (
                            <span className="text-purple-400">⚡</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Card Detail */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <h2 className="text-2xl font-semibold text-white mb-6">📋 Card Details</h2>
              
              {selectedCard ? (
                <div>
                  {/* Card Preview */}
                  <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-xl border-2 border-yellow-500 p-4 text-white mb-6">
                    <div className="text-center mb-3">
                      <h3 className="text-lg font-bold">{selectedCard.name}</h3>
                      <div className="text-sm text-gray-300">
                        {selectedCard.customType || selectedCard.type}
                      </div>
                    </div>
                    
                    <div className="bg-black/30 rounded-lg p-3 mb-3 min-h-[80px] flex items-center justify-center">
                      {selectedCard.artworkUrl ? (
                        <img src={selectedCard.artworkUrl} alt="Card art" className="max-w-full max-h-full rounded" />
                      ) : (
                        <div className="text-gray-400 text-center">
                          <div className="text-2xl mb-1">🎨</div>
                          <div className="text-xs">No artwork</div>
                        </div>
                      )}
                    </div>

                    <div className="text-xs mb-3">{selectedCard.description}</div>

                    {selectedCard.effects.length > 0 && (
                      <div className="mb-3">
                        <div className="text-xs text-yellow-300 mb-1">Effects:</div>
                        {selectedCard.effects.map((effect: any, index: number) => (
                          <div key={index} className="text-xs text-gray-300 mb-1 flex items-center gap-1">
                            • {effect.type === 'custom' && <span className="text-purple-400">⚡</span>}
                            {effect.name}
                            {effect.type === 'custom' && (
                              <span className="text-purple-400 text-[10px] bg-purple-600/20 px-1 rounded ml-1">
                                CUSTOM
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Activation Mechanics */}
                    {selectedCard.isActivatedAbility && (
                      <div className="mb-3">
                        <div className="text-xs text-purple-300 mb-1 flex items-center gap-1">
                          ⚡ Activated Ability
                          {selectedCard.requiresTap && <span className="text-yellow-400">🔄</span>}
                        </div>
                        {Object.values(selectedCard.activationCost || {}).some((cost: any) => cost > 0) && (
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className="text-xs text-purple-300">Cost:</span>
                            {Object.entries(selectedCard.activationCost || {}).map(([type, cost]) => 
                              (cost as number) > 0 ? (
                                <span key={type} className={`${getManaColorClass(type)} rounded-full w-4 h-4 flex items-center justify-center text-[10px] text-white`}>
                                  {cost as number}
                                </span>
                              ) : null
                            )}
                            {selectedCard.requiresTap && (
                              <span className="text-yellow-400 text-xs">+Tap</span>
                            )}
                          </div>
                        )}
                        {selectedCard.requiresTap && Object.values(selectedCard.activationCost || {}).every((cost: any) => cost === 0) && (
                          <div className="text-xs text-yellow-400">Cost: Tap</div>
                        )}
                      </div>
                    )}

                    {(selectedCard.attack !== undefined && selectedCard.defense !== undefined) && (
                      <div className="flex justify-between text-sm font-bold mb-3">
                        <span>⚔️ {selectedCard.attack}</span>
                        <span>🛡️ {selectedCard.defense}</span>
                      </div>
                    )}

                    <div className="flex justify-center space-x-1">
                      {Object.entries(selectedCard.manaCost).map(([type, cost]) => 
                        (cost as number) > 0 ? (
                          <span key={type} className={`${getManaColorClass(type)} text-white rounded-full w-5 h-5 flex items-center justify-center text-xs`}>
                            {cost as number}
                          </span>
                        ) : null
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    {/* Card status and info */}
                    <div className="bg-slate-700/50 rounded-lg p-3 mb-3">
                      <div className="flex items-center justify-between text-sm text-gray-300">
                        <span>Status:</span>
                        <div className="flex items-center space-x-1">
                          {selectedCard.status === 'pending' ? (
                            <>
                              <Clock className="h-4 w-4 text-yellow-400" />
                              <span className="text-yellow-400">Pending</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-400" />
                              <span className="text-green-400">Approved</span>
                            </>
                          )}
                        </div>
                      </div>
                      {selectedCard.createdBy && (
                        <div className="flex items-center justify-between text-sm text-gray-300 mt-1">
                          <span>Created by:</span>
                          <span>{selectedCard.createdBy === user?.id ? 'You' : selectedCard.createdBy}</span>
                        </div>
                      )}
                    </div>

                    {/* Approval buttons for creators/admins */}
                    {(user?.role === 'creator' || user?.role === 'admin') && selectedCard.status === 'pending' && (
                      <>
                        <button
                          onClick={() => approveCard(selectedCard.id)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                        >
                          ✅ Approve Card
                        </button>
                        <button
                          onClick={() => rejectCard(selectedCard.id)}
                          className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                        >
                          ❌ Reject Card
                        </button>
                      </>
                    )}

                    {/* Regular actions */}
                    <button
                      onClick={() => duplicateCard(selectedCard)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      📄 Duplicate Card
                    </button>
                    
                    {/* Edit button - only for own cards or creators/admins */}
                    {(selectedCard.createdBy === user?.id || user?.role === 'creator' || user?.role === 'admin') && (
                      <button
                        onClick={() => {
                          localStorage.setItem('schoolletloose_edit_card', JSON.stringify(selectedCard));
                          navigate('/card-builder');
                        }}
                        className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                      >
                        ✏️ Edit Card
                      </button>
                    )}
                    
                    {/* Delete button - only for own cards or admins */}
                    {(selectedCard.createdBy === user?.id || user?.role === 'admin') && (
                      <button
                        onClick={() => deleteCard(selectedCard.id)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                      >
                        🗑️ Delete Card
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-4xl mb-4">👆</div>
                  <p className="mb-6">Select a card to view details</p>
                  
                  {/* Debug/Admin Actions */}
                  {cards.length > 0 && (
                    <div className="border-t border-slate-600 pt-6">
                      <p className="text-xs text-gray-500 mb-3">Collection Management</p>
                      <button
                        onClick={clearAllCards}
                        className="text-xs bg-red-800 hover:bg-red-700 text-white px-3 py-2 rounded font-semibold transition-colors"
                      >
                        🗑️ Clear All Cards
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
