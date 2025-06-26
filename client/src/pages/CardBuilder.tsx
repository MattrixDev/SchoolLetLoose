import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Huge pool of card effects
const CARD_EFFECTS = {
  damage: [
    { id: 'deal_1_damage', name: 'Deal 1 Damage', description: 'Deal 1 damage to any target' },
    { id: 'deal_2_damage', name: 'Deal 2 Damage', description: 'Deal 2 damage to any target' },
    { id: 'deal_3_damage', name: 'Deal 3 Damage', description: 'Deal 3 damage to any target' },
    { id: 'deal_4_damage', name: 'Deal 4 Damage', description: 'Deal 4 damage to any target' },
    { id: 'deal_5_damage', name: 'Deal 5 Damage', description: 'Deal 5 damage to any target' },
    { id: 'deal_x_damage', name: 'Variable Damage', description: 'Deal X damage where X is your mana pool' },
    { id: 'splash_damage', name: 'Splash Damage', description: 'Deal 2 damage to target and 1 to adjacent creatures' },
    { id: 'burn_damage', name: 'Burn', description: 'Deal 1 damage at the start of each turn' },
    { id: 'piercing_damage', name: 'Piercing Damage', description: 'Deal 3 damage that cannot be prevented' },
    { id: 'chain_lightning', name: 'Chain Lightning', description: 'Deal 2 damage to target, then 1 damage to random target' },
  ],
  healing: [
    { id: 'heal_1', name: 'Heal 1', description: 'Restore 1 life' },
    { id: 'heal_2', name: 'Heal 2', description: 'Restore 2 life' },
    { id: 'heal_3', name: 'Heal 3', description: 'Restore 3 life' },
    { id: 'heal_5', name: 'Heal 5', description: 'Restore 5 life' },
    { id: 'regenerate', name: 'Regenerate', description: 'Prevent next damage to this creature' },
    { id: 'life_link', name: 'Life Link', description: 'Gain life equal to damage dealt' },
    { id: 'heal_all', name: 'Mass Healing', description: 'All players gain 2 life' },
    { id: 'restore_health', name: 'Full Restore', description: 'Restore creature to full health' },
  ],
  drawing: [
    { id: 'draw_card', name: 'Draw Card', description: 'Draw a card from your deck' },
    { id: 'draw_2_cards', name: 'Draw 2 Cards', description: 'Draw 2 cards from your deck' },
    { id: 'draw_3_cards', name: 'Draw 3 Cards', description: 'Draw 3 cards from your deck' },
    { id: 'scry_1', name: 'Scry 1', description: 'Look at top card, put on top or bottom' },
    { id: 'scry_2', name: 'Scry 2', description: 'Look at top 2 cards, arrange them' },
    { id: 'tutor', name: 'Tutor', description: 'Search library for a card and put it in hand' },
    { id: 'tutor_creature', name: 'Creature Tutor', description: 'Search for a creature card' },
    { id: 'peek', name: 'Peek', description: 'Look at opponent\'s hand' },
  ],
  mana: [
    { id: 'add_mana', name: 'Add Mana', description: 'Add 1 mana of any color' },
    { id: 'add_2_mana', name: 'Add 2 Mana', description: 'Add 2 mana of any color' },
    { id: 'mana_burst', name: 'Mana Burst', description: 'Add 3 mana of any combination' },
    { id: 'mana_drain', name: 'Mana Drain', description: 'Remove 2 mana from opponent' },
    { id: 'mana_steal', name: 'Mana Steal', description: 'Steal 1 mana from opponent' },
    { id: 'ritual', name: 'Dark Ritual', description: 'Add 3 black mana' },
  ],
  control: [
    { id: 'counter_spell', name: 'Counter Spell', description: 'Counter target spell' },
    { id: 'mind_control', name: 'Mind Control', description: 'Gain control of target creature' },
    { id: 'freeze', name: 'Freeze', description: 'Target creature cannot attack next turn' },
    { id: 'tap_creature', name: 'Tap', description: 'Tap target creature' },
    { id: 'stun', name: 'Stun', description: 'Target creature cannot attack or block for 2 turns' },
    { id: 'silence', name: 'Silence', description: 'Target creature cannot use abilities until end of turn' },
    { id: 'paralyze', name: 'Paralyze', description: 'Target creature becomes tapped and cannot untap next turn' },
    { id: 'charm', name: 'Charm', description: 'Target creature attacks a random target this turn' },
  ],
  protection: [
    { id: 'shield', name: 'Shield', description: 'Prevent next 3 damage' },
    { id: 'ward', name: 'Ward', description: 'Prevent next spell that targets this creature' },
    { id: 'hexproof', name: 'Hexproof', description: 'Cannot be targeted by opponent spells' },
    { id: 'indestructible', name: 'Indestructible', description: 'Cannot be destroyed' },
    { id: 'protection', name: 'Protection', description: 'Cannot be targeted or damaged by chosen color' },
    { id: 'shroud', name: 'Shroud', description: 'Cannot be targeted by any spells or abilities' },
  ],
  enhancement: [
    { id: 'pump_1_1', name: '+1/+1', description: 'Give +1/+1 until end of turn' },
    { id: 'pump_2_2', name: '+2/+2', description: 'Give +2/+2 until end of turn' },
    { id: 'pump_3_3', name: '+3/+3', description: 'Give +3/+3 until end of turn' },
    { id: 'permanent_1_1', name: 'Permanent +1/+1', description: 'Give +1/+1 permanently' },
    { id: 'flying', name: 'Flying', description: 'Can only be blocked by flying creatures' },
    { id: 'first_strike', name: 'First Strike', description: 'Deals damage before non-first strike' },
    { id: 'double_strike', name: 'Double Strike', description: 'Deals first strike and regular damage' },
    { id: 'trample', name: 'Trample', description: 'Excess damage goes to player' },
    { id: 'vigilance', name: 'Vigilance', description: 'Does not tap when attacking' },
    { id: 'haste', name: 'Haste', description: 'Can attack immediately when played' },
    { id: 'deathtouch', name: 'Deathtouch', description: 'Any damage dealt destroys target creature' },
  ],
  disruption: [
    { id: 'discard', name: 'Discard', description: 'Target player discards a card' },
    { id: 'discard_2', name: 'Discard 2', description: 'Target player discards 2 cards' },
    { id: 'mill', name: 'Mill', description: 'Put top 3 cards of library into graveyard' },
    { id: 'mill_5', name: 'Mill 5', description: 'Put top 5 cards of library into graveyard' },
    { id: 'destroy_artifact', name: 'Destroy Artifact', description: 'Destroy target artifact' },
    { id: 'destroy_enchantment', name: 'Destroy Enchantment', description: 'Destroy target enchantment' },
    { id: 'bounce', name: 'Bounce', description: 'Return target permanent to hand' },
    { id: 'exile', name: 'Exile', description: 'Remove target permanent from game' },
    { id: 'graveyard_hate', name: 'Graveyard Exile', description: 'Exile all cards from target graveyard' },
  ],
  stress: [
    { id: 'add_stress', name: 'Add Stress', description: 'Add a stress counter (-1/-1) to target creature' },
    { id: 'add_2_stress', name: 'Heavy Stress', description: 'Add 2 stress counters to target creature' },
    { id: 'mass_stress', name: 'Mass Stress', description: 'Add a stress counter to all enemy creatures' },
    { id: 'stress_burst', name: 'Stress Burst', description: 'Add stress counters equal to mana spent' },
    { id: 'remove_stress', name: 'Stress Relief', description: 'Remove a stress counter from target creature' },
    { id: 'stress_transfer', name: 'Stress Transfer', description: 'Move stress counters from one creature to another' },
    { id: 'stress_explosion', name: 'Stress Explosion', description: 'Deal damage equal to target\'s stress counters' },
  ],
  utility: [
    { id: 'transform', name: 'Transform', description: 'Transform into a different card type' },
    { id: 'clone', name: 'Clone', description: 'Copy target creature' },
    { id: 'sacrifice', name: 'Sacrifice', description: 'Sacrifice to trigger powerful effect' },
    { id: 'flashback', name: 'Flashback', description: 'Can be cast from graveyard' },
    { id: 'morph', name: 'Morph', description: 'Can be played face down, flip later' },
    { id: 'cycling', name: 'Cycling', description: 'Discard to draw a card' },
    { id: 'unearth', name: 'Unearth', description: 'Return from graveyard for one turn' },
    { id: 'echo', name: 'Echo', description: 'Must pay cost again next turn or sacrifice' },
  ]
};

// Interface for custom abilities (matching shared types)
interface AbilityTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  parameters: any[];
  conditions: any[];
  effects: any[];
  createdBy: string;
  createdAt: Date;
  isActive: boolean;
  usageCount: number;
}

// Custom card types
const CUSTOM_CARD_TYPES = [
  { id: 'creature', name: 'Creature', hasStats: true, description: 'A being that can attack and defend' },
  { id: 'spell', name: 'Spell', hasStats: false, description: 'Instant magical effect' },
  { id: 'artifact', name: 'Artifact', hasStats: false, description: 'Magical item with ongoing effects' },
  { id: 'land', name: 'Land', hasStats: false, description: 'Source of mana' },
  { id: 'enchantment', name: 'Enchantment', hasStats: false, description: 'Persistent magical effect' },
  { id: 'scholar', name: 'Scholar', hasStats: true, description: 'Academic creature with knowledge abilities' },
  { id: 'teacher', name: 'Teacher', hasStats: true, description: 'Mentor creature that enhances others' },
  { id: 'student', name: 'Student', hasStats: true, description: 'Learning creature that grows stronger' },
  { id: 'textbook', name: 'Textbook', hasStats: false, description: 'Knowledge artifact with learning effects' },
  { id: 'classroom', name: 'Classroom', hasStats: false, description: 'Location that provides ongoing benefits' },
  { id: 'exam', name: 'Exam', hasStats: false, description: 'Challenge spell that tests abilities' },
  { id: 'homework', name: 'Homework', hasStats: false, description: 'Task enchantment with delayed effects' },
];

export function CardBuilder() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [card, setCard] = useState({
    name: '',
    description: '',
    type: 'creature',
    customType: '',
    attack: 1,
    defense: 1,
    manaCost: { math: 0, german: 0, english: 0, french: 0, latin: 0, differentiation: 0, learning: 0 },
    effects: [] as any[],
    artworkUrl: '',
    activationCost: { math: 0, german: 0, english: 0, french: 0, latin: 0, differentiation: 0, learning: 0 },
    requiresTap: false,
    isActivatedAbility: false
  });

  const [preview, setPreview] = useState(false);
  const [selectedEffectCategory, setSelectedEffectCategory] = useState('damage');
  const [showEffectSelector, setShowEffectSelector] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [customAbilities, setCustomAbilities] = useState<AbilityTemplate[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageInfo, setImageInfo] = useState<{ name: string; size: string } | null>(null);

  // Load card for editing and custom abilities on component mount
  useEffect(() => {
    // Load custom abilities for creators and admins
    if (user && (user.role === 'creator' || user.role === 'admin')) {
      const savedAbilities = localStorage.getItem('schoolletloose-abilities');
      if (savedAbilities) {
        try {
          const abilities = JSON.parse(savedAbilities).filter((ability: AbilityTemplate) => ability.isActive);
          setCustomAbilities(abilities);
        } catch (error) {
          console.error('Error loading custom abilities:', error);
        }
      }
    }

    // Load card for editing
    const editCard = localStorage.getItem('schoolletloose_edit_card');
    if (editCard) {
      try {
        const cardData = JSON.parse(editCard);
        setCard({
          name: cardData.name || '',
          description: cardData.description || '',
          type: cardData.type || 'creature',
          customType: cardData.customType || '',
          attack: cardData.attack || 1,
          defense: cardData.defense || 1,
          manaCost: cardData.manaCost || { math: 0, german: 0, english: 0, french: 0, latin: 0, differentiation: 0, learning: 0 },
          effects: cardData.effects || [],
          artworkUrl: cardData.artworkUrl || '',
          activationCost: cardData.activationCost || { math: 0, german: 0, english: 0, french: 0, latin: 0, differentiation: 0, learning: 0 },
          requiresTap: cardData.requiresTap || false,
          isActivatedAbility: cardData.isActivatedAbility || false
        });
        setEditingCardId(cardData.id);
        if (cardData.artworkUrl && cardData.artworkUrl.startsWith('data:')) {
          setUploadedImage(cardData.artworkUrl);
        }
        localStorage.removeItem('schoolletloose_edit_card'); // Clear after loading
      } catch (error) {
        console.error('Error loading card for editing:', error);
      }
    }
  }, [user]);

  const handleInputChange = (field: string, value: any) => {
    setCard(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, GIF, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image file is too large. Please use a file smaller than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImage(result);
      handleInputChange('artworkUrl', result);
      
      // Store file info
      const sizeKB = (file.size / 1024).toFixed(1);
      setImageInfo({
        name: file.name,
        size: `${sizeKB} KB`
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleManaCostChange = (type: string, value: number) => {
    setCard(prev => ({
      ...prev,
      manaCost: { ...prev.manaCost, [type]: Math.max(0, Math.min(10, value)) }
    }));
  };

  const handleActivationCostChange = (type: string, value: number) => {
    setCard(prev => ({
      ...prev,
      activationCost: { ...prev.activationCost, [type]: Math.max(0, Math.min(10, value)) }
    }));
  };

  const handleEffectAdd = (effect: any) => {
    if (card.effects.length < 3) {
      setCard(prev => ({
        ...prev,
        effects: [...prev.effects, effect]
      }));

      // Update usage count for custom abilities
      if (effect.type === 'custom' && customAbilities.length > 0) {
        const updatedAbilities = customAbilities.map(ability => 
          ability.id === effect.id 
            ? { ...ability, usageCount: ability.usageCount + 1 }
            : ability
        );
        setCustomAbilities(updatedAbilities);
        localStorage.setItem('schoolletloose-abilities', JSON.stringify(updatedAbilities));
      }
    }
    setShowEffectSelector(false);
  };

  const handleEffectRemove = (effectId: string) => {
    setCard(prev => ({
      ...prev,
      effects: prev.effects.filter(e => e.id !== effectId)
    }));
  };

  const handleSave = () => {
    if (!card.name || !card.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const cardData = {
        id: editingCardId || Date.now().toString(),
        name: card.name,
        description: card.description,
        type: card.type,
        customType: card.customType,
        attack: card.attack,
        defense: card.defense,
        manaCost: card.manaCost,
        effects: card.effects,
        artworkUrl: card.artworkUrl,
        activationCost: card.activationCost,
        requiresTap: card.requiresTap,
        isActivatedAbility: card.isActivatedAbility,
        createdAt: new Date().toISOString(),
        createdBy: user?.id || '',
        status: (user?.role === 'creator' || user?.role === 'admin') ? 'approved' : 'pending'
      };

      // Get existing cards from localStorage
      const existingCards = JSON.parse(localStorage.getItem('schoolletloose-cards') || '[]');
      
      if (editingCardId) {
        // Update existing card (only if user is creator/admin or it's their suggestion)
        const existingCard = existingCards.find((c: any) => c.id === editingCardId);
        if (existingCard && (
          user?.role === 'creator' || 
          user?.role === 'admin' || 
          existingCard.createdBy === user?.id
        )) {
          const cardIndex = existingCards.findIndex((c: any) => c.id === editingCardId);
          if (cardIndex !== -1) {
            existingCards[cardIndex] = { ...existingCard, ...cardData };
            console.log('Card updated:', cardData);
            alert('Card updated successfully!');
          }
        } else {
          alert('You can only edit your own suggestions or be a creator/admin to edit cards.');
          return;
        }
      } else {
        // Add new card
        existingCards.push(cardData);
        console.log('New card saved:', cardData);
        
        if (user?.role === 'player') {
          alert('Card suggestion submitted! It will be reviewed by creators and admins.');
        } else {
          alert('Card saved successfully!');
        }
      }

      localStorage.setItem('schoolletloose-cards', JSON.stringify(existingCards));
      console.log('Total cards in storage:', existingCards.length);
      
      // Navigate to collection to see the saved card
      navigate('/collection');
    } catch (error) {
      console.error('Error saving card:', error);
      alert('Error saving card. Please try again.');
    }
  };

  const selectedCardType = CUSTOM_CARD_TYPES.find(t => t.id === card.type);
  const totalManaCost = Object.values(card.manaCost).reduce((sum, cost) => sum + cost, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🎨 Card Builder
          </h1>
          <p className="text-xl text-gray-300">
            {editingCardId ? 'Edit your magical school-themed card' : 'Design your own magical school-themed cards'}
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
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            📚 Collection
          </button>
          <button
            onClick={() => navigate('/deck-builder')}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            🃏 Deck Builder
          </button>
          <button
            onClick={() => navigate('/lobby')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            🏛️ Lobby
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Card Form */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">✨ Card Details</h2>
            
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Card Name *
                </label>
                <input
                  type="text"
                  value={card.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Enter card name..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={card.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                  rows={3}
                  placeholder="Describe your card's abilities..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Card Type
                </label>
                <select
                  value={card.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                >
                  {CUSTOM_CARD_TYPES.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name} - {type.description}
                    </option>
                  ))}
                </select>
                {selectedCardType && (
                  <p className="text-xs text-gray-400 mt-1">{selectedCardType.description}</p>
                )}
              </div>

              {/* Custom Type Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Custom Type Name (Optional)
                </label>
                <input
                  type="text"
                  value={card.customType}
                  onChange={(e) => handleInputChange('customType', e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., Elite Scholar, Ancient Textbook..."
                />
              </div>

              {/* Artwork Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Card Artwork (Optional)
                </label>
                
                {/* Drag and Drop Zone */}
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
                    isDragging
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {uploadedImage || card.artworkUrl ? (
                    <div className="relative">
                      <img
                        src={uploadedImage || card.artworkUrl}
                        alt="Card artwork"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedImage(null);
                          setImageInfo(null);
                          handleInputChange('artworkUrl', '');
                        }}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                      >
                        ×
                      </button>
                      {imageInfo && (
                        <div className="mt-2 text-xs text-gray-400">
                          📁 {imageInfo.name} ({imageInfo.size})
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className={`text-4xl mb-3 transition-all ${isDragging ? 'text-blue-400 scale-110' : 'text-gray-400'}`}>
                        {isDragging ? '📥' : '🎨'}
                      </div>
                      <p className={`mb-2 transition-colors ${isDragging ? 'text-blue-300' : 'text-gray-400'}`}>
                        {isDragging ? 'Drop your image here!' : 'Drop an image file here or click to select'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Supports PNG, JPG, GIF (max 5MB)
                      </p>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

                {/* URL Input as alternative */}
                <div className="mt-3">
                  <input
                    type="url"
                    value={card.artworkUrl && !card.artworkUrl.startsWith('data:') ? card.artworkUrl : ''}
                    onChange={(e) => {
                      setUploadedImage(null);
                      setImageInfo(null);
                      handleInputChange('artworkUrl', e.target.value);
                    }}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none text-sm"
                    placeholder="Or paste an image URL..."
                  />
                </div>
              </div>

              {/* Stats for creatures and similar types */}
              {selectedCardType?.hasStats && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Attack
                    </label>
                    <input
                      type="number"
                      value={card.attack}
                      onChange={(e) => handleInputChange('attack', parseInt(e.target.value) || 0)}
                      min="0"
                      max="20"
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Defense
                    </label>
                    <input
                      type="number"
                      value={card.defense}
                      onChange={(e) => handleInputChange('defense', parseInt(e.target.value) || 0)}
                      min="0"
                      max="20"
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Effects Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Card Effects (Max 3)
                </label>
                
                {/* Selected Effects */}
                <div className="space-y-2 mb-3">
                  {card.effects.map((effect, index) => (
                    <div key={index} className="bg-slate-600 rounded-lg p-3 flex justify-between items-center">
                      <div>
                        <div className="text-white font-medium">{effect.name}</div>
                        <div className="text-gray-300 text-sm">{effect.description}</div>
                      </div>
                      <button
                        onClick={() => handleEffectRemove(effect.id)}
                        className="text-red-400 hover:text-red-300 text-xl"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Effect Button */}
                {card.effects.length < 3 && (
                  <button
                    onClick={() => setShowEffectSelector(!showEffectSelector)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    ➕ Add Effect ({card.effects.length}/3)
                  </button>
                )}

                {/* Effect Selector Modal */}
                {showEffectSelector && (
                  <div className="mt-4 bg-slate-600 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-white font-semibold">Choose Effect</h4>
                      <button
                        onClick={() => setShowEffectSelector(false)}
                        className="text-gray-400 hover:text-white"
                      >
                        ×
                      </button>
                    </div>
                    
                    {/* Effect Categories */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {Object.keys(CARD_EFFECTS).map(category => (
                        <button
                          key={category}
                          onClick={() => setSelectedEffectCategory(category)}
                          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                            selectedEffectCategory === category
                              ? 'bg-purple-600 text-white'
                              : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                          }`}
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                      ))}
                      {/* Custom Abilities Category for creators/admins */}
                      {user && (user.role === 'creator' || user.role === 'admin') && customAbilities.length > 0 && (
                        <button
                          onClick={() => setSelectedEffectCategory('custom')}
                          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                            selectedEffectCategory === 'custom'
                              ? 'bg-purple-600 text-white'
                              : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                          }`}
                        >
                          ⚡ Custom
                        </button>
                      )}
                    </div>

                    {/* Custom Abilities Info */}
                    {user && (user.role === 'creator' || user.role === 'admin') && customAbilities.length === 0 && (
                      <div className="mb-4 bg-purple-900/20 border border-purple-600/30 rounded-lg p-3">
                        <div className="text-purple-300 text-sm mb-2">
                          ⚡ Create Custom Abilities
                        </div>
                        <div className="text-gray-300 text-xs mb-2">
                          As a {user.role}, you can create custom abilities in the Ability Builder.
                        </div>
                        <button
                          onClick={() => navigate('/ability-builder')}
                          className="text-purple-400 hover:text-purple-300 text-xs underline"
                        >
                          Go to Ability Builder →
                        </button>
                      </div>
                    )}

                    {/* Effects List */}
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {selectedEffectCategory === 'custom' && user && (user.role === 'creator' || user.role === 'admin') ? (
                        // Show custom abilities
                        customAbilities.map(ability => (
                          <button
                            key={ability.id}
                            onClick={() => handleEffectAdd({
                              id: ability.id,
                              name: ability.name,
                              description: ability.description,
                              type: 'custom',
                              category: ability.category
                            })}
                            className="w-full text-left bg-slate-700 hover:bg-slate-600 rounded p-3 transition-colors border border-purple-500/30"
                          >
                            <div className="text-purple-300 font-medium flex items-center gap-2">
                              ⚡ {ability.name}
                              <span className="text-xs bg-purple-600/20 px-1 py-0.5 rounded">Custom</span>
                            </div>
                            <div className="text-gray-300 text-sm">{ability.description}</div>
                            <div className="text-gray-400 text-xs mt-1">
                              Category: {ability.category} • Used: {ability.usageCount} times
                            </div>
                          </button>
                        ))
                      ) : (
                        // Show predefined effects
                        CARD_EFFECTS[selectedEffectCategory as keyof typeof CARD_EFFECTS]?.map(effect => (
                          <button
                            key={effect.id}
                            onClick={() => handleEffectAdd(effect)}
                            className="w-full text-left bg-slate-700 hover:bg-slate-600 rounded p-3 transition-colors"
                          >
                            <div className="text-white font-medium">{effect.name}</div>
                            <div className="text-gray-300 text-sm">{effect.description}</div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Mana Costs */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Mana Cost (Total: {totalManaCost})
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-blue-600/20 p-3 rounded-lg">
                    <div className="text-blue-300 text-sm mb-1">📘 Math</div>
                    <input
                      type="number"
                      value={card.manaCost.math}
                      onChange={(e) => handleManaCostChange('math', parseInt(e.target.value) || 0)}
                      min="0"
                      max="10"
                      className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-center"
                    />
                  </div>
                  <div className="bg-red-600/20 p-3 rounded-lg">
                    <div className="text-red-300 text-sm mb-1">🇩🇪 German</div>
                    <input
                      type="number"
                      value={card.manaCost.german}
                      onChange={(e) => handleManaCostChange('german', parseInt(e.target.value) || 0)}
                      min="0"
                      max="10"
                      className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-center"
                    />
                  </div>
                  <div className="bg-gray-600/20 p-3 rounded-lg">
                    <div className="text-gray-300 text-sm mb-1">📚 English</div>
                    <input
                      type="number"
                      value={card.manaCost.english}
                      onChange={(e) => handleManaCostChange('english', parseInt(e.target.value) || 0)}
                      min="0"
                      max="10"
                      className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-center"
                    />
                  </div>
                  <div className="bg-green-600/20 p-3 rounded-lg">
                    <div className="text-green-300 text-sm mb-1">�️ French</div>
                    <input
                      type="number"
                      value={card.manaCost.french}
                      onChange={(e) => handleManaCostChange('french', parseInt(e.target.value) || 0)}
                      min="0"
                      max="10"
                      className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-center"
                    />
                  </div>
                  <div className="bg-amber-600/20 p-3 rounded-lg">
                    <div className="text-amber-300 text-sm mb-1">📜 Latin</div>
                    <input
                      type="number"
                      value={card.manaCost.latin}
                      onChange={(e) => handleManaCostChange('latin', parseInt(e.target.value) || 0)}
                      min="0"
                      max="10"
                      className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-center"
                    />
                  </div>
                  <div className="bg-yellow-600/20 p-3 rounded-lg">
                    <div className="text-yellow-300 text-sm mb-1">⚡ Diff</div>
                    <input
                      type="number"
                      value={card.manaCost.differentiation}
                      onChange={(e) => handleManaCostChange('differentiation', parseInt(e.target.value) || 0)}
                      min="0"
                      max="10"
                      className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-center"
                    />
                  </div>
                  <div className="bg-gray-600/20 p-3 rounded-lg">
                    <div className="text-gray-300 text-sm mb-1">🎓 Learn</div>
                    <input
                      type="number"
                      value={card.manaCost.learning}
                      onChange={(e) => handleManaCostChange('learning', parseInt(e.target.value) || 0)}
                      min="0"
                      max="10"
                      className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Activated Ability Settings */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-3">
                  <input
                    type="checkbox"
                    checked={card.isActivatedAbility}
                    onChange={(e) => handleInputChange('isActivatedAbility', e.target.checked)}
                    className="rounded bg-slate-700 border-slate-600 text-purple-600 focus:ring-purple-500"
                  />
                  <span>⚡ Has Activated Ability</span>
                </label>

                {card.isActivatedAbility && (
                  <div className="space-y-4 pl-6 border-l-2 border-purple-600/30">
                    {/* Tap Requirement */}
                    <label className="flex items-center space-x-2 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={card.requiresTap}
                        onChange={(e) => handleInputChange('requiresTap', e.target.checked)}
                        className="rounded bg-slate-700 border-slate-600 text-purple-600 focus:ring-purple-500"
                      />
                      <span>🔄 Requires Tap to Activate</span>
                    </label>

                    {/* Activation Cost */}
                    <div>
                      <label className="block text-sm font-medium text-purple-300 mb-2">
                        Activation Cost (Total: {Object.values(card.activationCost).reduce((sum, cost) => sum + cost, 0)})
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-blue-600/10 p-2 rounded border border-blue-600/30">
                          <div className="text-blue-300 text-xs mb-1">📘 Math</div>
                          <input
                            type="number"
                            value={card.activationCost.math}
                            onChange={(e) => handleActivationCostChange('math', parseInt(e.target.value) || 0)}
                            min="0"
                            max="10"
                            className="w-full bg-slate-700 border border-slate-600 rounded px-1 py-1 text-white text-center text-sm"
                          />
                        </div>
                        <div className="bg-red-600/10 p-2 rounded border border-red-600/30">
                          <div className="text-red-300 text-xs mb-1">🇩🇪 German</div>
                          <input
                            type="number"
                            value={card.activationCost.german}
                            onChange={(e) => handleActivationCostChange('german', parseInt(e.target.value) || 0)}
                            min="0"
                            max="10"
                            className="w-full bg-slate-700 border border-slate-600 rounded px-1 py-1 text-white text-center text-sm"
                          />
                        </div>
                        <div className="bg-gray-600/10 p-2 rounded border border-gray-600/30">
                          <div className="text-gray-300 text-xs mb-1">📚 English</div>
                          <input
                            type="number"
                            value={card.activationCost.english}
                            onChange={(e) => handleActivationCostChange('english', parseInt(e.target.value) || 0)}
                            min="0"
                            max="10"
                            className="w-full bg-slate-700 border border-slate-600 rounded px-1 py-1 text-white text-center text-sm"
                          />
                        </div>
                        <div className="bg-green-600/10 p-2 rounded border border-green-600/30">
                          <div className="text-green-300 text-xs mb-1">🇫🇷 French</div>
                          <input
                            type="number"
                            value={card.activationCost.french}
                            onChange={(e) => handleActivationCostChange('french', parseInt(e.target.value) || 0)}
                            min="0"
                            max="10"
                            className="w-full bg-slate-700 border border-slate-600 rounded px-1 py-1 text-white text-center text-sm"
                          />
                        </div>
                        <div className="bg-amber-600/10 p-2 rounded border border-amber-600/30">
                          <div className="text-amber-300 text-xs mb-1">📜 Latin</div>
                          <input
                            type="number"
                            value={card.activationCost.latin}
                            onChange={(e) => handleActivationCostChange('latin', parseInt(e.target.value) || 0)}
                            min="0"
                            max="10"
                            className="w-full bg-slate-700 border border-slate-600 rounded px-1 py-1 text-white text-center text-sm"
                          />
                        </div>
                        <div className="bg-yellow-600/10 p-2 rounded border border-yellow-600/30">
                          <div className="text-yellow-300 text-xs mb-1">⚡ Diff</div>
                          <input
                            type="number"
                            value={card.activationCost.differentiation}
                            onChange={(e) => handleActivationCostChange('differentiation', parseInt(e.target.value) || 0)}
                            min="0"
                            max="10"
                            className="w-full bg-slate-700 border border-slate-600 rounded px-1 py-1 text-white text-center text-sm"
                          />
                        </div>
                        <div className="bg-gray-600/10 p-2 rounded border border-gray-600/30">
                          <div className="text-gray-300 text-xs mb-1">🎓 Learn</div>
                          <input
                            type="number"
                            value={card.activationCost.learning}
                            onChange={(e) => handleActivationCostChange('learning', parseInt(e.target.value) || 0)}
                            min="0"
                            max="10"
                            className="w-full bg-slate-700 border border-slate-600 rounded px-1 py-1 text-white text-center text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-purple-400/70 bg-purple-900/20 p-2 rounded border border-purple-600/30">
                      💡 Activated abilities can be used during your turn. Tapped cards cannot be tapped again until they untap.
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={() => setPreview(!preview)}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  👁️ {preview ? 'Hide' : 'Show'} Preview
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  💾 {editingCardId ? 'Update Card' : 'Save Card'}
                </button>
              </div>
            </div>
          </div>

          {/* Card Preview */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">👁️ Card Preview</h2>
            
            {preview ? (
              <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-xl border-2 border-yellow-500 p-6 text-white max-w-sm mx-auto">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold">{card.name || 'Card Name'}</h3>
                  <div className="text-sm text-gray-300">
                    {card.customType || selectedCardType?.name || 'Card Type'}
                  </div>
                </div>
                
                <div className="bg-black/30 rounded-lg p-4 mb-4 min-h-[120px] flex items-center justify-center">
                  {card.artworkUrl ? (
                    <img src={card.artworkUrl} alt="Card art" className="max-w-full max-h-full rounded" />
                  ) : (
                    <div className="text-gray-400 text-center">
                      <div className="text-4xl mb-2">🎨</div>
                      <div>No artwork</div>
                    </div>
                  )}
                </div>

                <div className="text-sm mb-4">
                  {card.description || 'Card description will appear here...'}
                </div>

                {/* Effects */}
                {card.effects.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs text-yellow-300 mb-2">Effects:</div>
                    {card.effects.map((effect, index) => (
                      <div key={index} className="text-xs text-gray-300 mb-1 flex items-center gap-1">
                        • {effect.type === 'custom' && <span className="text-purple-400">⚡</span>}
                        {effect.name}: {effect.description}
                        {effect.type === 'custom' && (
                          <span className="text-purple-400 text-[10px] bg-purple-600/20 px-1 rounded ml-1">
                            CUSTOM
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {selectedCardType?.hasStats && (
                  <div className="flex justify-between text-lg font-bold mb-4">
                    <span>⚔️ {card.attack}</span>
                    <span>🛡️ {card.defense}</span>
                  </div>
                )}

                <div className="flex justify-center space-x-1 flex-wrap">
                  {card.manaCost.math > 0 && (
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs m-1">
                      {card.manaCost.math}
                    </span>
                  )}
                  {card.manaCost.german > 0 && (
                    <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs m-1">
                      {card.manaCost.german}
                    </span>
                  )}
                  {card.manaCost.english > 0 && (
                    <span className="bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs m-1">
                      {card.manaCost.english}
                    </span>
                  )}
                  {card.manaCost.french > 0 && (
                    <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs m-1">
                      {card.manaCost.french}
                    </span>
                  )}
                  {card.manaCost.latin > 0 && (
                    <span className="bg-amber-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs m-1">
                      {card.manaCost.latin}
                    </span>
                  )}
                  {card.manaCost.differentiation > 0 && (
                    <span className="bg-yellow-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs m-1">
                      {card.manaCost.differentiation}
                    </span>
                  )}
                  {card.manaCost.learning > 0 && (
                    <span className="bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs m-1">
                      {card.manaCost.learning}
                    </span>
                  )}
                </div>

                {/* Activation Mechanics */}
                {card.isActivatedAbility && (
                  <div className="mt-4 bg-purple-900/20 border border-purple-600/30 rounded p-2">
                    <div className="text-xs text-purple-300 mb-2 flex items-center gap-1">
                      ⚡ Activated Ability
                      {card.requiresTap && <span className="text-yellow-400">🔄</span>}
                    </div>
                    {Object.values(card.activationCost).some(cost => cost > 0) && (
                      <div className="flex justify-center space-x-1 flex-wrap mb-2">
                        <span className="text-xs text-purple-300 mr-1">Cost:</span>
                        {card.activationCost.math > 0 && (
                          <span className="bg-blue-600/70 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                            {card.activationCost.math}
                          </span>
                        )}
                        {card.activationCost.german > 0 && (
                          <span className="bg-red-600/70 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                            {card.activationCost.german}
                          </span>
                        )}
                        {card.activationCost.english > 0 && (
                          <span className="bg-gray-600/70 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                            {card.activationCost.english}
                          </span>
                        )}
                        {card.activationCost.french > 0 && (
                          <span className="bg-green-600/70 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                            {card.activationCost.french}
                          </span>
                        )}
                        {card.activationCost.latin > 0 && (
                          <span className="bg-amber-600/70 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                            {card.activationCost.latin}
                          </span>
                        )}
                        {card.activationCost.differentiation > 0 && (
                          <span className="bg-yellow-600/70 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                            {card.activationCost.differentiation}
                          </span>
                        )}
                        {card.activationCost.learning > 0 && (
                          <span className="bg-gray-600/70 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                            {card.activationCost.learning}
                          </span>
                        )}
                        {card.requiresTap && (
                          <span className="text-yellow-400 text-xs">+Tap</span>
                        )}
                      </div>
                    )}
                    {card.requiresTap && Object.values(card.activationCost).every(cost => cost === 0) && (
                      <div className="text-center">
                        <span className="text-yellow-400 text-xs">Cost: Tap</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-16">
                <div className="text-6xl mb-4">🎴</div>
                <p>Click "Show Preview" to see your card</p>
                <div className="mt-4 text-sm">
                  <p className="mb-2">Available Mana Types:</p>
                  <div className="flex justify-center space-x-2 flex-wrap">
                    <span className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded text-xs">📘 Math</span>
                    <span className="bg-red-600/20 text-red-300 px-2 py-1 rounded text-xs">🇩🇪 German</span>
                    <span className="bg-gray-600/20 text-gray-300 px-2 py-1 rounded text-xs">📚 English</span>
                    <span className="bg-green-600/20 text-green-300 px-2 py-1 rounded text-xs">🏛️ French</span>
                    <span className="bg-amber-600/20 text-amber-300 px-2 py-1 rounded text-xs">📜 Latin</span>
                    <span className="bg-yellow-600/20 text-yellow-300 px-2 py-1 rounded text-xs">⚡ Diff</span>
                    <span className="bg-gray-600/20 text-gray-300 px-2 py-1 rounded text-xs">🎓 Learning</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
