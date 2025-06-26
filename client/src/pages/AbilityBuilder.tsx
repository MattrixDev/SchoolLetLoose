import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Wand2, Plus, Trash2, Edit, Save, X, Zap, Target, Clock, Settings, AlertTriangle, Code } from 'lucide-react';

// Enhanced types for comprehensive ability creation
interface AbilityTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  parameters: AbilityParameter[];
  conditions: AbilityCondition[];
  effects: AbilityEffect[];
  triggers: AbilityTrigger[];
  timing: AbilityTiming;
  cost: AbilityCost;
  restrictions: AbilityRestriction[];
  createdBy: string;
  createdAt: Date;
  isActive: boolean;
  usageCount: number;
  complexity: string;
}

interface AbilityParameter {
  id: string;
  name: string;
  type: string;
  defaultValue: any;
  minValue?: number;
  maxValue?: number;
  description: string;
  isRequired: boolean;
  options?: string[];
}

interface AbilityCondition {
  id: string;
  type: string;
  parameter: string;
  operator: string;
  value: any;
  description: string;
  logicalOperator?: 'AND' | 'OR' | 'NOT';
}

interface AbilityEffect {
  id: string;
  type: string;
  target: string;
  value: EffectValue;
  duration: string;
  description: string;
  order: number;
  conditional?: boolean;
}

interface EffectValue {
  type: 'fixed' | 'variable' | 'formula' | 'random' | 'conditional' | 'scaling' | 'percentage';
  amount?: number;
  parameter?: string;
  formula?: string;
  minValue?: number;
  maxValue?: number;
  scaleParameter?: string;
  scaleMultiplier?: number;
  conditionalValue?: {
    condition: string;
    trueValue: number;
    falseValue: number;
  };
  percentageOf?: string;
}

interface AbilityTrigger {
  id: string;
  type: string;
  event: string;
  condition?: string;
  description: string;
}

interface AbilityTiming {
  speed: 'instant' | 'sorcery' | 'static' | 'triggered' | 'activated';
  priority: 'low' | 'normal' | 'high' | 'emergency';
  stackable: boolean;
  interruptible: boolean;
}

interface AbilityCost {
  mana: { math: number; german: number; english: number; french: number; latin: number; differentiation: number; learning: number };
  tap: boolean;
  sacrifice: string[];
  discard: number;
  life: number;
  stress: number;
  exile: string[];
  custom: string;
}

interface AbilityRestriction {
  id: string;
  type: 'timing' | 'target' | 'usage' | 'condition';
  description: string;
  value: any;
}

// Comprehensive options for the enhanced system
const PARAMETER_TYPES = [
  'number', 'string', 'boolean', 'manaColor', 'cardType', 'targetType', 'duration',
  'range', 'percentage', 'multiSelect', 'creatureType', 'manaAmount', 'counterType'
];

const CONDITION_TYPES = [
  'manaAvailable', 'cardCount', 'lifeTotal', 'phase', 'turnNumber', 'cardInPlay',
  'creaturePower', 'creatureToughness', 'cardsInHand', 'cardsInGraveyard', 'stressCounters',
  'creatureCount', 'spellCount', 'artifactCount', 'enchantmentCount', 'manaSpentThisTurn',
  'damageDealt', 'damageTaken', 'playerLife', 'randomChance'
];

const CONDITION_OPERATORS = [
  'equals', 'greaterThan', 'lessThan', 'greaterEqual', 'lessEqual', 'contains',
  'notEquals', 'between', 'inList', 'notInList', 'startsWith', 'endsWith',
  'isEmpty', 'isNotEmpty', 'divisibleBy', 'isEven', 'isOdd'
];

const EFFECT_TYPES = [
  'dealDamage', 'heal', 'addMana', 'drawCards', 'destroy', 'boostStats', 'grantAbility',
  'addStress', 'removeStress', 'tapTarget', 'untapTarget', 'stunTarget', 'silenceTarget',
  'counterSpell', 'exileTarget', 'returnToHand', 'millCards', 'discardCards', 'searchLibrary',
  'shuffleLibrary', 'gainControl', 'loseControl', 'copySpell', 'transform', 'phaseOut',
  'phaseIn', 'preventDamage', 'redirectDamage', 'doubleDamage', 'halveDamage', 'gainLife',
  'loseLife', 'setLife', 'exchangeLife', 'addCounters', 'removeCounters', 'moveCounters',
  'createToken', 'sacrifice', 'regenerate', 'flicker', 'clone', 'morph', 'unmorph',
  'manifest', 'scry', 'surveil', 'explore', 'adapt', 'monstrosity', 'levelUp'
];

const TARGET_TYPES = [
  'self', 'anyCreature', 'anyPlayer', 'opponent', 'allCreatures', 'randomTarget',
  'controller', 'owner', 'allPlayers', 'allOpponents', 'targetCreature', 'targetPlayer',
  'targetSpell', 'targetPermanent', 'targetCardInGraveyard', 'targetCardInHand',
  'targetCardInLibrary', 'friendlyCreatures', 'enemyCreatures', 'tappedCreatures',
  'untappedCreatures', 'attackingCreatures', 'blockingCreatures', 'creaturesWithStress',
  'creaturesWithoutStress', 'artifacts', 'enchantments', 'lands', 'spells', 'tokens',
  'nonTokens', 'multicolored', 'monocolored', 'colorless', 'randomCreature', 'randomPlayer',
  'weakestCreature', 'strongestCreature', 'newestCreature', 'oldestCreature'
];

const TRIGGER_TYPES = [
  'entersBattlefield', 'leavesBattlefield', 'attacks', 'blocks', 'dealsDamage', 'takesDamage',
  'dies', 'tapped', 'untapped', 'spellCast', 'manaSpent', 'cardDrawn', 'lifeGained',
  'lifeLost', 'turnBegins', 'turnEnds', 'upkeep', 'drawPhase', 'mainPhase', 'combatPhase',
  'endPhase', 'activated', 'triggered', 'counterAdded', 'counterRemoved'
];

const VALUE_TYPES = ['fixed', 'variable', 'formula', 'random', 'conditional', 'scaling', 'percentage'];
const DURATIONS = ['instant', 'endOfTurn', 'permanent', 'untilRemoved'];
const COMPLEXITIES = ['simple', 'moderate', 'complex', 'expert'];
const CATEGORIES = ['damage', 'healing', 'mana', 'draw', 'control', 'enhancement', 'protection', 'utility', 'stress'];

export function AbilityBuilder() {
  const { user } = useAuth();
  const [abilities, setAbilities] = useState<AbilityTemplate[]>([]);
  const [selectedAbility, setSelectedAbility] = useState<AbilityTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTab, setCurrentTab] = useState<'basic' | 'effects' | 'conditions' | 'triggers' | 'timing' | 'costs' | 'restrictions'>('basic');

  const [newAbility, setNewAbility] = useState<AbilityTemplate>({
    id: '',
    name: '',
    description: '',
    category: 'damage',
    parameters: [],
    conditions: [],
    effects: [],
    triggers: [],
    timing: {
      speed: 'instant',
      priority: 'normal',
      stackable: true,
      interruptible: true
    },
    cost: {
      mana: { math: 0, german: 0, english: 0, french: 0, latin: 0, differentiation: 0, learning: 0 },
      tap: false,
      sacrifice: [],
      discard: 0,
      life: 0,
      stress: 0,
      exile: [],
      custom: ''
    },
    restrictions: [],
    createdBy: user?.id || '',
    createdAt: new Date(),
    isActive: true,
    usageCount: 0,
    complexity: 'simple'
  });

  // Only creators and admins can access this
  if (!user || (user.role !== 'creator' && user.role !== 'admin')) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <Wand2 className="h-16 w-16 text-purple-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-400">Only creators and administrators can access the Ability Builder.</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const savedAbilities = localStorage.getItem('magicschool-abilities');
    if (savedAbilities) {
      setAbilities(JSON.parse(savedAbilities));
    }
  }, []);

  // Helper function to create empty ability with all required fields
  const createEmptyAbility = (): AbilityTemplate => ({
    id: '',
    name: '',
    description: '',
    category: 'damage',
    parameters: [],
    conditions: [],
    effects: [],
    triggers: [],
    timing: {
      speed: 'instant',
      priority: 'normal',
      stackable: true,
      interruptible: true
    },
    cost: {
      mana: { math: 0, german: 0, english: 0, french: 0, latin: 0, differentiation: 0, learning: 0 },
      tap: false,
      sacrifice: [],
      discard: 0,
      life: 0,
      stress: 0,
      exile: [],
      custom: ''
    },
    restrictions: [],
    createdBy: user?.id || '',
    createdAt: new Date(),
    isActive: true,
    usageCount: 0,
    complexity: 'simple'
  });

  const saveAbilities = (updatedAbilities: AbilityTemplate[]) => {
    setAbilities(updatedAbilities);
    localStorage.setItem('magicschool-abilities', JSON.stringify(updatedAbilities));
  };

  const saveAbility = () => {
    if (!newAbility.name.trim()) {
      alert('Please enter an ability name');
      return;
    }
    if (newAbility.effects.length === 0) {
      alert('Please add at least one effect');
      return;
    }

    const abilityToSave = {
      ...newAbility,
      id: newAbility.id || Date.now().toString(),
      createdBy: user?.id || '',
      createdAt: newAbility.createdAt || new Date()
    };

    const updatedAbilities = newAbility.id 
      ? abilities.map(a => a.id === newAbility.id ? abilityToSave : a)
      : [...abilities, abilityToSave];

    saveAbilities(updatedAbilities);
    setIsEditing(false);
    setSelectedAbility(abilityToSave);
    alert('Ability saved successfully!');
  };

  const deleteAbility = (id: string) => {
    if (confirm('Are you sure you want to delete this ability?')) {
      const updatedAbilities = abilities.filter(a => a.id !== id);
      saveAbilities(updatedAbilities);
      if (selectedAbility?.id === id) {
        setSelectedAbility(null);
      }
    }
  };

  const startNewAbility = () => {
    setNewAbility(createEmptyAbility());
    setIsEditing(true);
    setSelectedAbility(null);
  };

  const editAbility = (ability: AbilityTemplate) => {
    setNewAbility(ability);
    setIsEditing(true);
    setSelectedAbility(ability);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setNewAbility(createEmptyAbility());
  };

  // Helper functions for managing parameters, effects, conditions, triggers, restrictions
  const addParameter = () => {
    const parameter: AbilityParameter = {
      id: Date.now().toString(),
      name: 'New Parameter',
      type: 'number',
      defaultValue: 1,
      description: 'Parameter description',
      isRequired: true
    };
    setNewAbility(prev => ({
      ...prev,
      parameters: [...prev.parameters, parameter]
    }));
  };

  const updateParameter = (id: string, updates: Partial<AbilityParameter>) => {
    setNewAbility(prev => ({
      ...prev,
      parameters: prev.parameters.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
  };

  const removeParameter = (id: string) => {
    setNewAbility(prev => ({
      ...prev,
      parameters: prev.parameters.filter(p => p.id !== id)
    }));
  };

  const addEffect = () => {
    const effect: AbilityEffect = {
      id: Date.now().toString(),
      type: 'dealDamage',
      target: 'anyCreature',
      value: { type: 'fixed', amount: 2 },
      duration: 'instant',
      description: 'Deal 2 damage to target creature',
      order: newAbility.effects.length + 1,
      conditional: false
    };
    setNewAbility(prev => ({
      ...prev,
      effects: [...prev.effects, effect]
    }));
  };

  const updateEffect = (id: string, updates: Partial<AbilityEffect>) => {
    setNewAbility(prev => ({
      ...prev,
      effects: prev.effects.map(e => e.id === id ? { ...e, ...updates } : e)
    }));
  };

  const removeEffect = (id: string) => {
    setNewAbility(prev => ({
      ...prev,
      effects: prev.effects.filter(e => e.id !== id)
    }));
  };

  const addCondition = () => {
    const condition: AbilityCondition = {
      id: Date.now().toString(),
      type: 'manaAvailable',
      parameter: 'math',
      operator: 'greaterEqual',
      value: 1,
      description: 'Condition description'
    };
    setNewAbility(prev => ({
      ...prev,
      conditions: [...prev.conditions, condition]
    }));
  };

  const updateCondition = (id: string, updates: Partial<AbilityCondition>) => {
    setNewAbility(prev => ({
      ...prev,
      conditions: prev.conditions.map(c => c.id === id ? { ...c, ...updates } : c)
    }));
  };

  const removeCondition = (id: string) => {
    setNewAbility(prev => ({
      ...prev,
      conditions: prev.conditions.filter(c => c.id !== id)
    }));
  };

  return (
    <div className="min-h-screen text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Wand2 className="h-8 w-8 text-purple-400 mr-3" />
            <h1 className="text-3xl font-bold">Enhanced Ability Builder</h1>
          </div>
          <button
            onClick={startNewAbility}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Plus className="h-5 w-5 inline mr-2" />
            Create Ability
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Ability List */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
              <h2 className="text-xl font-semibold mb-6">Custom Abilities</h2>
              
              {abilities.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-6xl mb-4">✨</div>
                  <p className="text-lg mb-2">No custom abilities</p>
                  <p className="text-sm">Create your first ability to get started!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {abilities.map((ability) => (
                    <div
                      key={ability.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                        selectedAbility?.id === ability.id
                          ? 'border-purple-500 bg-purple-900/20'
                          : 'border-slate-600 bg-slate-700/50 hover:bg-slate-700/70'
                      }`}
                      onClick={() => setSelectedAbility(ability)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-purple-300">{ability.name}</h3>
                        <div className="flex space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              editAbility(ability);
                            }}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteAbility(ability.id);
                            }}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400 capitalize">{ability.category}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {ability.effects.length} effect{ability.effects.length !== 1 ? 's' : ''}
                        {ability.usageCount > 0 && ` • Used ${ability.usageCount} times`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {isEditing ? (
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
                {/* Header */}
                <div className="bg-slate-700/50 px-6 py-4 border-b border-slate-600">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                      {newAbility.id ? 'Edit' : 'Create'} Ability
                    </h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4 inline mr-1" />
                        Cancel
                      </button>
                      <button
                        onClick={saveAbility}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <Save className="h-4 w-4 inline mr-1" />
                        Save
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-slate-600">
                  <div className="flex overflow-x-auto">
                    {[
                      { id: 'basic', label: 'Basic Info', icon: Edit },
                      { id: 'effects', label: 'Effects', icon: Zap },
                      { id: 'conditions', label: 'Conditions', icon: Target },
                      { id: 'triggers', label: 'Triggers', icon: AlertTriangle },
                      { id: 'timing', label: 'Timing', icon: Clock },
                      { id: 'costs', label: 'Costs', icon: Settings },
                      { id: 'restrictions', label: 'Restrictions', icon: Code }
                    ].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => setCurrentTab(id as any)}
                        className={`flex items-center px-4 py-3 font-medium whitespace-nowrap border-b-2 transition-colors ${
                          currentTab === id
                            ? 'border-purple-500 bg-purple-500/10 text-purple-300'
                            : 'border-transparent text-gray-400 hover:text-gray-300 hover:bg-slate-700/30'
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-6 max-h-96 overflow-y-auto">
                  {currentTab === 'basic' && (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Ability Name</label>
                          <input
                            type="text"
                            value={newAbility.name}
                            onChange={(e) => setNewAbility(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                            placeholder="Enter ability name..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                          <select
                            value={newAbility.category}
                            onChange={(e) => setNewAbility(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                          >
                            {CATEGORIES.map(cat => (
                              <option key={cat} value={cat} className="capitalize">{cat}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea
                          value={newAbility.description}
                          onChange={(e) => setNewAbility(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white h-20 resize-none"
                          placeholder="Describe what this ability does..."
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Complexity</label>
                          <select
                            value={newAbility.complexity}
                            onChange={(e) => setNewAbility(prev => ({ ...prev, complexity: e.target.value }))}
                            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                          >
                            {COMPLEXITIES.map(comp => (
                              <option key={comp} value={comp} className="capitalize">{comp}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="flex items-center space-x-2 mt-6">
                            <input
                              type="checkbox"
                              checked={newAbility.isActive}
                              onChange={(e) => setNewAbility(prev => ({ ...prev, isActive: e.target.checked }))}
                              className="rounded"
                            />
                            <span className="text-gray-300">Active Ability</span>
                          </label>
                        </div>
                      </div>

                      {/* Parameters */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">Parameters</h3>
                          <button
                            onClick={addParameter}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                          >
                            <Plus className="h-4 w-4 inline mr-1" />
                            Add Parameter
                          </button>
                        </div>
                        {newAbility.parameters.length === 0 ? (
                          <div className="text-gray-400 text-sm text-center py-4 border border-dashed border-slate-600 rounded">
                            No parameters defined. Click "Add Parameter" to create configurable values.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {newAbility.parameters.map((param) => (
                              <div key={param.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                                <div className="flex items-center justify-between mb-3">
                                  <input
                                    type="text"
                                    value={param.name}
                                    onChange={(e) => updateParameter(param.id, { name: e.target.value })}
                                    className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white font-medium"
                                    placeholder="Parameter name"
                                  />
                                  <button
                                    onClick={() => removeParameter(param.id)}
                                    className="text-red-400 hover:text-red-300 p-1"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                  <div>
                                    <label className="block text-xs text-gray-400 mb-1">Type</label>
                                    <select
                                      value={param.type}
                                      onChange={(e) => updateParameter(param.id, { type: e.target.value })}
                                      className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white text-sm"
                                    >
                                      {PARAMETER_TYPES.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-400 mb-1">Default Value</label>
                                    <input
                                      type="text"
                                      value={param.defaultValue}
                                      onChange={(e) => updateParameter(param.id, { defaultValue: e.target.value })}
                                      className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white text-sm"
                                      placeholder="Default value"
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                  <div>
                                    <label className="block text-xs text-gray-400 mb-1">Min Value</label>
                                    <input
                                      type="number"
                                      value={param.minValue || ''}
                                      onChange={(e) => updateParameter(param.id, { minValue: e.target.value ? Number(e.target.value) : undefined })}
                                      className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white text-sm"
                                      placeholder="Min"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-400 mb-1">Max Value</label>
                                    <input
                                      type="number"
                                      value={param.maxValue || ''}
                                      onChange={(e) => updateParameter(param.id, { maxValue: e.target.value ? Number(e.target.value) : undefined })}
                                      className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white text-sm"
                                      placeholder="Max"
                                    />
                                  </div>
                                  <div className="flex items-center">
                                    <label className="flex items-center text-gray-300 text-sm">
                                      <input
                                        type="checkbox"
                                        checked={param.isRequired}
                                        onChange={(e) => updateParameter(param.id, { isRequired: e.target.checked })}
                                        className="mr-2"
                                      />
                                      Required
                                    </label>
                                  </div>
                                </div>
                                <div className="mt-3">
                                  <label className="block text-xs text-gray-400 mb-1">Description</label>
                                  <textarea
                                    value={param.description}
                                    onChange={(e) => updateParameter(param.id, { description: e.target.value })}
                                    className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white text-sm resize-none h-16"
                                    placeholder="Parameter description..."
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {currentTab === 'effects' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Effects</h3>
                        <button
                          onClick={addEffect}
                          className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-sm"
                        >
                          <Zap className="h-4 w-4 inline mr-1" />
                          Add Effect
                        </button>
                      </div>
                      {newAbility.effects.length === 0 ? (
                        <div className="text-gray-400 text-sm text-center py-8 border border-dashed border-slate-600 rounded">
                          No effects defined. Click "Add Effect" to create what this ability does.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {newAbility.effects.map((effect) => (
                            <div key={effect.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                  <Zap className="h-4 w-4 text-orange-400" />
                                  <span className="font-medium">Effect #{effect.order}</span>
                                </div>
                                <button
                                  onClick={() => removeEffect(effect.id)}
                                  className="text-red-400 hover:text-red-300 p-1"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                  <label className="block text-xs text-gray-400 mb-1">Effect Type</label>
                                  <select
                                    value={effect.type}
                                    onChange={(e) => updateEffect(effect.id, { type: e.target.value })}
                                    className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white text-sm"
                                  >
                                    {EFFECT_TYPES.map(type => (
                                      <option key={type} value={type}>{type}</option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-400 mb-1">Target</label>
                                  <select
                                    value={effect.target}
                                    onChange={(e) => updateEffect(effect.id, { target: e.target.value })}
                                    className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white text-sm"
                                  >
                                    {TARGET_TYPES.map(target => (
                                      <option key={target} value={target}>{target}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-3 mb-3">
                                <div>
                                  <label className="block text-xs text-gray-400 mb-1">Value Type</label>
                                  <select
                                    value={effect.value.type}
                                    onChange={(e) => updateEffect(effect.id, { 
                                      value: { ...effect.value, type: e.target.value as any }
                                    })}
                                    className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white text-sm"
                                  >
                                    {VALUE_TYPES.map(type => (
                                      <option key={type} value={type}>{type}</option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-400 mb-1">Amount</label>
                                  <input
                                    type="number"
                                    value={effect.value.amount || 0}
                                    onChange={(e) => updateEffect(effect.id, { 
                                      value: { ...effect.value, amount: parseInt(e.target.value) || 0 }
                                    })}
                                    className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white text-sm"
                                    placeholder="Amount"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-400 mb-1">Duration</label>
                                  <select
                                    value={effect.duration}
                                    onChange={(e) => updateEffect(effect.id, { duration: e.target.value })}
                                    className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white text-sm"
                                  >
                                    {DURATIONS.map(duration => (
                                      <option key={duration} value={duration}>{duration}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              {effect.value.type === 'formula' && (
                                <div className="mb-3">
                                  <label className="block text-xs text-gray-400 mb-1">Formula</label>
                                  <input
                                    type="text"
                                    value={effect.value.formula || ''}
                                    onChange={(e) => updateEffect(effect.id, { 
                                      value: { ...effect.value, formula: e.target.value }
                                    })}
                                    className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white text-sm"
                                    placeholder="e.g. power + 2"
                                  />
                                </div>
                              )}

                              {effect.value.type === 'random' && (
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                  <div>
                                    <label className="block text-xs text-gray-400 mb-1">Min Value</label>
                                    <input
                                      type="number"
                                      value={effect.value.minValue || 0}
                                      onChange={(e) => updateEffect(effect.id, { 
                                        value: { ...effect.value, minValue: parseInt(e.target.value) || 0 }
                                      })}
                                      className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-400 mb-1">Max Value</label>
                                    <input
                                      type="number"
                                      value={effect.value.maxValue || 0}
                                      onChange={(e) => updateEffect(effect.id, { 
                                        value: { ...effect.value, maxValue: parseInt(e.target.value) || 0 }
                                      })}
                                      className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white text-sm"
                                    />
                                  </div>
                                </div>
                              )}

                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs text-gray-400 mb-1">Execution Order</label>
                                  <input
                                    type="number"
                                    value={effect.order}
                                    onChange={(e) => updateEffect(effect.id, { order: parseInt(e.target.value) || 1 })}
                                    className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white text-sm"
                                    min="1"
                                  />
                                </div>
                                <div className="flex items-center">
                                  <label className="flex items-center text-gray-300 text-sm">
                                    <input
                                      type="checkbox"
                                      checked={effect.conditional || false}
                                      onChange={(e) => updateEffect(effect.id, { conditional: e.target.checked })}
                                      className="mr-2"
                                    />
                                    Conditional
                                  </label>
                                </div>
                              </div>

                              <div className="mt-3">
                                <label className="block text-xs text-gray-400 mb-1">Description</label>
                                <textarea
                                  value={effect.description}
                                  onChange={(e) => updateEffect(effect.id, { description: e.target.value })}
                                  className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white text-sm resize-none h-16"
                                  placeholder="Effect description..."
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {currentTab === 'conditions' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Conditions</h3>
                        <button
                          onClick={addCondition}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                        >
                          <Target className="h-4 w-4 inline mr-1" />
                          Add Condition
                        </button>
                      </div>
                      {newAbility.conditions.length === 0 ? (
                        <div className="text-gray-400 text-sm text-center py-8 border border-dashed border-slate-600 rounded">
                          No conditions defined. Click "Add Condition" to specify when this ability can be used.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {newAbility.conditions.map((condition) => (
                            <div key={condition.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                  <Target className="h-4 w-4 text-green-400" />
                                  <span className="font-medium">Condition</span>
                                </div>
                                <button
                                  onClick={() => removeCondition(condition.id)}
                                  className="text-red-400 hover:text-red-300 p-1"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-3 mb-3">
                                <div>
                                  <label className="block text-xs text-gray-400 mb-1">Condition Type</label>
                                  <select
                                    value={condition.type}
                                    onChange={(e) => updateCondition(condition.id, { type: e.target.value })}
                                    className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white text-sm"
                                  >
                                    {CONDITION_TYPES.map(type => (
                                      <option key={type} value={type}>{type}</option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-400 mb-1">Operator</label>
                                  <select
                                    value={condition.operator}
                                    onChange={(e) => updateCondition(condition.id, { operator: e.target.value })}
                                    className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white text-sm"
                                  >
                                    {CONDITION_OPERATORS.map(op => (
                                      <option key={op} value={op}>{op}</option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-400 mb-1">Value</label>
                                  <input
                                    type="text"
                                    value={condition.value}
                                    onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                                    className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white text-sm"
                                    placeholder="Value"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                  <label className="block text-xs text-gray-400 mb-1">Parameter</label>
                                  <input
                                    type="text"
                                    value={condition.parameter}
                                    onChange={(e) => updateCondition(condition.id, { parameter: e.target.value })}
                                    className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white text-sm"
                                    placeholder="Parameter name"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-400 mb-1">Logic Operator</label>
                                  <select
                                    value={condition.logicalOperator || 'AND'}
                                    onChange={(e) => updateCondition(condition.id, { logicalOperator: e.target.value as any })}
                                    className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white text-sm"
                                  >
                                    <option value="AND">AND</option>
                                    <option value="OR">OR</option>
                                    <option value="NOT">NOT</option>
                                  </select>
                                </div>
                              </div>

                              <div>
                                <label className="block text-xs text-gray-400 mb-1">Description</label>
                                <textarea
                                  value={condition.description}
                                  onChange={(e) => updateCondition(condition.id, { description: e.target.value })}
                                  className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white text-sm resize-none h-16"
                                  placeholder="Condition description..."
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {currentTab === 'triggers' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Triggers</h3>
                        <button
                          onClick={() => {
                            const trigger: AbilityTrigger = {
                              id: Date.now().toString(),
                              type: 'entersBattlefield',
                              event: 'entersBattlefield',
                              description: 'When this enters the battlefield'
                            };
                            setNewAbility(prev => ({
                              ...prev,
                              triggers: [...prev.triggers, trigger]
                            }));
                          }}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                        >
                          <AlertTriangle className="h-4 w-4 inline mr-1" />
                          Add Trigger
                        </button>
                      </div>
                      {newAbility.triggers.length === 0 ? (
                        <div className="text-gray-400 text-sm text-center py-8 border border-dashed border-slate-600 rounded">
                          No triggers defined. Click "Add Trigger" to specify when this ability activates.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {newAbility.triggers.map((trigger) => (
                            <div key={trigger.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                                  <span className="font-medium">Trigger</span>
                                </div>
                                <button
                                  onClick={() => {
                                    setNewAbility(prev => ({
                                      ...prev,
                                      triggers: prev.triggers.filter(t => t.id !== trigger.id)
                                    }));
                                  }}
                                  className="text-red-400 hover:text-red-300 p-1"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                  <label className="block text-xs text-gray-400 mb-1">Trigger Type</label>
                                  <select
                                    value={trigger.type}
                                    onChange={(e) => {
                                      setNewAbility(prev => ({
                                        ...prev,
                                        triggers: prev.triggers.map(t => 
                                          t.id === trigger.id ? { ...t, type: e.target.value } : t
                                        )
                                      }));
                                    }}
                                    className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white text-sm"
                                  >
                                    {TRIGGER_TYPES.map(type => (
                                      <option key={type} value={type}>{type}</option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-400 mb-1">Event</label>
                                  <input
                                    type="text"
                                    value={trigger.event}
                                    onChange={(e) => {
                                      setNewAbility(prev => ({
                                        ...prev,
                                        triggers: prev.triggers.map(t => 
                                          t.id === trigger.id ? { ...t, event: e.target.value } : t
                                        )
                                      }));
                                    }}
                                    className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white text-sm"
                                    placeholder="Event name"
                                  />
                                </div>
                              </div>

                              <div className="mb-3">
                                <label className="block text-xs text-gray-400 mb-1">Condition (optional)</label>
                                <input
                                  type="text"
                                  value={trigger.condition || ''}
                                  onChange={(e) => {
                                    setNewAbility(prev => ({
                                      ...prev,
                                      triggers: prev.triggers.map(t => 
                                        t.id === trigger.id ? { ...t, condition: e.target.value } : t
                                      )
                                    }));
                                  }}
                                  className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white text-sm"
                                  placeholder="Additional condition"
                                />
                              </div>

                              <div>
                                <label className="block text-xs text-gray-400 mb-1">Description</label>
                                <textarea
                                  value={trigger.description}
                                  onChange={(e) => {
                                    setNewAbility(prev => ({
                                      ...prev,
                                      triggers: prev.triggers.map(t => 
                                        t.id === trigger.id ? { ...t, description: e.target.value } : t
                                      )
                                    }));
                                  }}
                                  className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white text-sm resize-none h-16"
                                  placeholder="Trigger description..."
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {currentTab === 'timing' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold mb-4">Timing & Execution</h3>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Speed</label>
                          <select
                            value={newAbility.timing.speed}
                            onChange={(e) => setNewAbility(prev => ({
                              ...prev,
                              timing: { ...prev.timing, speed: e.target.value as any }
                            }))}
                            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                          >
                            <option value="instant">Instant</option>
                            <option value="sorcery">Sorcery</option>
                            <option value="static">Static</option>
                            <option value="triggered">Triggered</option>
                            <option value="activated">Activated</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                          <select
                            value={newAbility.timing.priority}
                            onChange={(e) => setNewAbility(prev => ({
                              ...prev,
                              timing: { ...prev.timing, priority: e.target.value as any }
                            }))}
                            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                          >
                            <option value="low">Low</option>
                            <option value="normal">Normal</option>
                            <option value="high">High</option>
                            <option value="emergency">Emergency</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={newAbility.timing.stackable}
                              onChange={(e) => setNewAbility(prev => ({
                                ...prev,
                                timing: { ...prev.timing, stackable: e.target.checked }
                              }))}
                              className="rounded"
                            />
                            <span className="text-gray-300">Stackable</span>
                          </label>
                          <p className="text-xs text-gray-400 mt-1">Can multiple instances be on the stack</p>
                        </div>

                        <div>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={newAbility.timing.interruptible}
                              onChange={(e) => setNewAbility(prev => ({
                                ...prev,
                                timing: { ...prev.timing, interruptible: e.target.checked }
                              }))}
                              className="rounded"
                            />
                            <span className="text-gray-300">Interruptible</span>
                          </label>
                          <p className="text-xs text-gray-400 mt-1">Can be interrupted or countered</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentTab === 'costs' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold mb-4">Activation Costs</h3>
                      
                      <div>
                        <h4 className="font-medium mb-3">Mana Costs</h4>
                        <div className="grid grid-cols-4 gap-3">
                          {Object.entries(newAbility.cost.mana).map(([color, amount]) => (
                            <div key={color}>
                              <label className="block text-xs text-gray-400 mb-1 capitalize">{color}</label>
                              <input
                                type="number"
                                value={amount}
                                onChange={(e) => setNewAbility(prev => ({
                                  ...prev,
                                  cost: {
                                    ...prev.cost,
                                    mana: {
                                      ...prev.cost.mana,
                                      [color]: parseInt(e.target.value) || 0
                                    }
                                  }
                                }))}
                                className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                                min="0"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="flex items-center space-x-2 mb-3">
                            <input
                              type="checkbox"
                              checked={newAbility.cost.tap}
                              onChange={(e) => setNewAbility(prev => ({
                                ...prev,
                                cost: { ...prev.cost, tap: e.target.checked }
                              }))}
                              className="rounded"
                            />
                            <span className="text-gray-300">Requires Tap</span>
                          </label>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Discard Cards</label>
                          <input
                            type="number"
                            value={newAbility.cost.discard}
                            onChange={(e) => setNewAbility(prev => ({
                              ...prev,
                              cost: { ...prev.cost, discard: parseInt(e.target.value) || 0 }
                            }))}
                            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                            min="0"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Life Cost</label>
                          <input
                            type="number"
                            value={newAbility.cost.life}
                            onChange={(e) => setNewAbility(prev => ({
                              ...prev,
                              cost: { ...prev.cost, life: parseInt(e.target.value) || 0 }
                            }))}
                            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                            min="0"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Stress Cost</label>
                          <input
                            type="number"
                            value={newAbility.cost.stress}
                            onChange={(e) => setNewAbility(prev => ({
                              ...prev,
                              cost: { ...prev.cost, stress: parseInt(e.target.value) || 0 }
                            }))}
                            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                            min="0"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Custom Cost</label>
                        <textarea
                          value={newAbility.cost.custom}
                          onChange={(e) => setNewAbility(prev => ({
                            ...prev,
                            cost: { ...prev.cost, custom: e.target.value }
                          }))}
                          className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white h-20 resize-none"
                          placeholder="Describe any custom costs..."
                        />
                      </div>
                    </div>
                  )}

                  {currentTab === 'restrictions' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Restrictions</h3>
                        <button
                          onClick={() => {
                            const restriction: AbilityRestriction = {
                              id: Date.now().toString(),
                              type: 'timing',
                              description: 'Can only be used during main phase',
                              value: 'mainPhase'
                            };
                            setNewAbility(prev => ({
                              ...prev,
                              restrictions: [...prev.restrictions, restriction]
                            }));
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                        >
                          <Code className="h-4 w-4 inline mr-1" />
                          Add Restriction
                        </button>
                      </div>
                      {newAbility.restrictions.length === 0 ? (
                        <div className="text-gray-400 text-sm text-center py-8 border border-dashed border-slate-600 rounded">
                          No restrictions defined. Click "Add Restriction" to limit when or how this ability can be used.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {newAbility.restrictions.map((restriction) => (
                            <div key={restriction.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                  <Code className="h-4 w-4 text-red-400" />
                                  <span className="font-medium">Restriction</span>
                                </div>
                                <button
                                  onClick={() => {
                                    setNewAbility(prev => ({
                                      ...prev,
                                      restrictions: prev.restrictions.filter(r => r.id !== restriction.id)
                                    }));
                                  }}
                                  className="text-red-400 hover:text-red-300 p-1"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                  <label className="block text-xs text-gray-400 mb-1">Restriction Type</label>
                                  <select
                                    value={restriction.type}
                                    onChange={(e) => {
                                      setNewAbility(prev => ({
                                        ...prev,
                                        restrictions: prev.restrictions.map(r => 
                                          r.id === restriction.id ? { ...r, type: e.target.value as any } : r
                                        )
                                      }));
                                    }}
                                    className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white text-sm"
                                  >
                                    <option value="timing">Timing</option>
                                    <option value="target">Target</option>
                                    <option value="usage">Usage</option>
                                    <option value="condition">Condition</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-400 mb-1">Value</label>
                                  <input
                                    type="text"
                                    value={restriction.value}
                                    onChange={(e) => {
                                      setNewAbility(prev => ({
                                        ...prev,
                                        restrictions: prev.restrictions.map(r => 
                                          r.id === restriction.id ? { ...r, value: e.target.value } : r
                                        )
                                      }));
                                    }}
                                    className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white text-sm"
                                    placeholder="Restriction value"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-xs text-gray-400 mb-1">Description</label>
                                <textarea
                                  value={restriction.description}
                                  onChange={(e) => {
                                    setNewAbility(prev => ({
                                      ...prev,
                                      restrictions: prev.restrictions.map(r => 
                                        r.id === restriction.id ? { ...r, description: e.target.value } : r
                                      )
                                    }));
                                  }}
                                  className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white text-sm resize-none h-16"
                                  placeholder="Restriction description..."
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : selectedAbility ? (
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">{selectedAbility.name}</h2>
                  <button
                    onClick={() => editAbility(selectedAbility)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4 inline mr-1" />
                    Edit
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-300">{selectedAbility.description || 'No description provided'}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Category</h3>
                    <span className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm capitalize">
                      {selectedAbility.category}
                    </span>
                  </div>

                  {selectedAbility.effects.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Effects</h3>
                      <div className="space-y-2">
                        {selectedAbility.effects.map((effect) => (
                          <div key={effect.id} className="bg-slate-700/50 rounded p-2 text-sm">
                            <div className="flex items-center space-x-2">
                              <Zap className="h-4 w-4 text-orange-400" />
                              <span className="font-medium capitalize">{effect.type.replace(/([A-Z])/g, ' $1')}</span>
                            </div>
                            <div className="text-gray-400 mt-1">
                              Target: {effect.target} • Value: {effect.value.amount} • Duration: {effect.duration}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-600">
                    <div>
                      <div className="text-sm text-gray-400">Created by</div>
                      <div>{selectedAbility.createdBy}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Usage count</div>
                      <div>{selectedAbility.usageCount} times</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Complexity</div>
                      <div className="capitalize">{selectedAbility.complexity}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                <div className="text-center py-12 text-gray-400">
                  <div className="text-4xl mb-4">⚡</div>
                  <p className="mb-6">Select an ability to view details or create a new one</p>
                  
                  <div className="mt-8 text-left text-sm max-w-md mx-auto">
                    <h3 className="font-semibold mb-2 text-white">🎯 Enhanced Ability Features:</h3>
                    <div className="space-y-1">
                      <div>📊 <span className="text-blue-400">Advanced Parameters</span> - Min/max values, types</div>
                      <div>🎯 <span className="text-green-400">Complex Conditions</span> - Multi-logic operators</div>
                      <div>⚡ <span className="text-orange-400">Rich Effects</span> - Formulas, scaling, randomness</div>
                      <div>🕒 <span className="text-yellow-400">Smart Triggers</span> - Event-based activation</div>
                      <div>⏱️ <span className="text-indigo-400">Timing Control</span> - Speed, priority, stacking</div>
                      <div>💎 <span className="text-purple-400">Custom Costs</span> - Mana, tap, life, stress</div>
                      <div>🔒 <span className="text-red-400">Restrictions</span> - Usage limitations</div>
                    </div>
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
