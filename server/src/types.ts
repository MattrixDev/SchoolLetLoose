// Authentication Types
export enum UserRole {
  PLAYER = 'player',
  CREATOR = 'creator',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
  isBanned: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  success: boolean;
  message?: string;
}

// Card Management Types
export enum CardStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface GlobalCard extends Card {
  status: CardStatus;
  createdBy: string; // User ID
  approvedBy?: string; // Creator/Admin ID
  submittedAt: Date;
  reviewedAt?: Date;
  reviewNotes?: string;
}

export interface CardSuggestion {
  id: string;
  card: Omit<Card, 'id'>;
  suggestedBy: string; // User ID
  reason: string;
  status: CardStatus;
  createdAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNotes?: string;
}

// User Management Types
export interface UserManagement {
  id: string;
  targetUserId: string;
  action: 'ban' | 'unban' | 'role_change' | 'delete';
  performedBy: string; // Admin ID
  reason: string;
  createdAt: Date;
  oldRole?: UserRole;
  newRole?: UserRole;
}

// Game Types
export interface Player {
  id: string;
  username: string;
  life: number;
  mana: ManaPool;
  hand: Card[];
  deck: Card[];
  battlefield: Card[];
  graveyard: Card[];
}

export interface ManaPool {
  math: number;    // Blue - Mathematics
  german: number;  // Red - German  
  english: number; // Black - English
  french: number;  // Green - French
  latin: number;   // Green - Latin
  differentiation: number; // White - Differentiation
  learning: number; // Colorless - Learning/Study Skills
}

export type ManaColor = keyof ManaPool;

export interface ManaCost {
  math?: number;
  german?: number;
  english?: number;
  french?: number;
  latin?: number;
  differentiation?: number;
  learning?: number; // Colorless mana
}

export enum CardType {
  CREATURE = 'creature',
  SPELL = 'spell',
  ARTIFACT = 'artifact',
  LAND = 'land'
}

export enum Phase {
  DRAW = 'draw',
  MAIN = 'main',
  COMBAT = 'combat',
  END = 'end'
}

export interface Card {
  id: string;
  name: string;
  description: string;
  type: CardType;
  customType?: string;
  manaCost: ManaCost;
  attack?: number;
  defense?: number;
  effects: CardEffect[];
  artworkUrl?: string;
  createdBy?: string;
  createdAt: Date;
}

export interface Deck {
  id: string;
  name: string;
  description?: string;
  commander?: Card;
  cards: { card: Card; quantity: number }[];
  createdBy: string; // User ID
  createdAt: Date;
  updatedAt: Date;
  format: 'commander' | 'standard';
  isPublic: boolean;
}

export interface Collection {
  id: string;
  userId: string;
  personalCards: Card[]; // User's private cards
  decks: Deck[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CardEffect {
  id: string;
  name: string;
  description: string;
  trigger: EffectTrigger;
  parameters: Record<string, any>;
}

export enum EffectTrigger {
  ON_PLAY = 'onPlay',
  ON_ATTACK = 'onAttack',
  ON_DEFEND = 'onDefend',
  ON_DEATH = 'onDeath',
  CONTINUOUS = 'continuous',
  ACTIVATED = 'activated'
}

export interface GameState {
  id: string;
  players: [Player, Player];
  currentPlayer: number;
  phase: Phase;
  turn: number;
  isActive: boolean;
  createdAt: Date;
  lastAction?: GameAction;
}

export interface GameAction {
  type: ActionType;
  playerId: string;
  timestamp: Date;
  data: any;
}

export enum ActionType {
  DRAW_CARD = 'drawCard',
  PLAY_CARD = 'playCard',
  ATTACK = 'attack',
  DEFEND = 'defend',
  PASS_PHASE = 'passPhase',
  ACTIVATE_ABILITY = 'activateAbility',
  SURRENDER = 'surrender'
}

// Room Types
export interface Room {
  id: string;
  name: string;
  players: string[];
  maxPlayers: number;
  isPrivate: boolean;
  gameState?: GameState;
  createdAt: Date;
  isActive: boolean;
}

// Socket Event Types
export interface ServerToClientEvents {
  gameStateUpdate: (gameState: GameState) => void;
  playerJoined: (playerId: string, username: string) => void;
  playerLeft: (playerId: string) => void;
  gameStarted: (gameState: GameState) => void;
  gameEnded: (winner: string, reason: string) => void;
  actionResult: (success: boolean, message?: string) => void;
  error: (message: string) => void;
}

export interface ClientToServerEvents {
  joinRoom: (roomId: string, username: string) => void;
  leaveRoom: (roomId: string) => void;
  startGame: () => void;
  playCard: (cardId: string, targetId?: string) => void;
  attack: (attackerId: string, defenderId?: string) => void;
  passPhase: () => void;
  activateAbility: (cardId: string, abilityId: string, targets?: string[]) => void;
  surrender: () => void;
}

// API Types
export interface CreateCardRequest {
  name: string;
  description: string;
  type: CardType;
  attack?: number;
  defense?: number;
  effectIds: string[];
  artworkUrl?: string;
}

export interface CreateCardResponse {
  card: Card;
  success: boolean;
  message?: string;
}

export interface GetEffectsResponse {
  effects: CardEffect[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

// Game Constants
export const GAME_CONSTANTS = {
  STARTING_LIFE: 20,
  STARTING_HAND_SIZE: 7,
  MAX_HAND_SIZE: 7,
  MAX_BATTLEFIELD_SIZE: 12,
  PHASES_ORDER: [Phase.DRAW, Phase.MAIN, Phase.COMBAT, Phase.END] as const,
  MANA_COLORS: ['math', 'german', 'english', 'french', 'latin', 'differentiation', 'learning'] as ManaColor[],
  SUBJECT_MAPPINGS: {
    math: 'Mathematics',
    german: 'German', 
    english: 'English',
    french: 'French',
    latin: 'Latin',
    differentiation: 'Differentiation',
    learning: 'Learning'
  } as Record<ManaColor, string>
} as const;

// Advanced Card Moderation Types
export interface CardModerationQueue {
  id: string;
  card: GlobalCard;
  priority: 'low' | 'medium' | 'high';
  moderatorNotes?: string;
  communityReports: CardReport[];
  queuedAt: Date;
  estimatedReviewTime?: Date;
}

export interface CardReport {
  id: string;
  cardId: string;
  reportedBy: string;
  reason: 'inappropriate' | 'overpowered' | 'broken' | 'duplicate' | 'other';
  description: string;
  reportedAt: Date;
  status: 'pending' | 'reviewed' | 'dismissed';
}

export interface ModerationAction {
  id: string;
  cardId: string;
  moderatorId: string;
  action: 'approve' | 'reject' | 'request_changes' | 'ban_card';
  reason: string;
  suggestedChanges?: Partial<Card>;
  timestamp: Date;
}

// Custom Ability Creation System
export interface AbilityTemplate {
  id: string;
  name: string;
  description: string;
  category: AbilityCategory;
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
  complexity: AbilityComplexity;
}

export interface AbilityTrigger {
  id: string;
  type: TriggerType;
  event: string;
  condition?: string;
  description: string;
}

export enum TriggerType {
  ENTERS_BATTLEFIELD = 'entersBattlefield',
  LEAVES_BATTLEFIELD = 'leavesBattlefield',
  ATTACKS = 'attacks',
  BLOCKS = 'blocks',
  DEALS_DAMAGE = 'dealsDamage',
  TAKES_DAMAGE = 'takesDamage',
  DIES = 'dies',
  TAPPED = 'tapped',
  UNTAPPED = 'untapped',
  SPELL_CAST = 'spellCast',
  MANA_SPENT = 'manaSpent',
  CARD_DRAWN = 'cardDrawn',
  LIFE_GAINED = 'lifeGained',
  LIFE_LOST = 'lifeLost',
  TURN_BEGINS = 'turnBegins',
  TURN_ENDS = 'turnEnds',
  UPKEEP = 'upkeep',
  DRAW_PHASE = 'drawPhase',
  MAIN_PHASE = 'mainPhase',
  COMBAT_PHASE = 'combatPhase',
  END_PHASE = 'endPhase',
  ACTIVATED = 'activated',
  TRIGGERED = 'triggered',
  COUNTER_ADDED = 'counterAdded',
  COUNTER_REMOVED = 'counterRemoved'
}

export interface AbilityTiming {
  speed: 'instant' | 'sorcery' | 'static' | 'triggered' | 'activated';
  priority: 'low' | 'normal' | 'high' | 'emergency';
  stackable: boolean;
  interruptible: boolean;
}

export interface AbilityCost {
  mana: ManaCost;
  tap: boolean;
  sacrifice: string[]; // Card types to sacrifice
  discard: number; // Number of cards to discard
  life: number; // Life to pay
  stress: number; // Stress counters to add to self
  exile: string[]; // Cards to exile
  custom: string; // Custom cost description
}

export interface AbilityRestriction {
  id: string;
  type: 'timing' | 'target' | 'usage' | 'condition';
  description: string;
  value: any;
}

export enum AbilityComplexity {
  SIMPLE = 'simple',
  MODERATE = 'moderate',
  COMPLEX = 'complex',
  EXPERT = 'expert'
}

export enum AbilityCategory {
  DAMAGE = 'damage',
  HEALING = 'healing',
  MANA = 'mana',
  DRAW = 'draw',
  CONTROL = 'control',
  ENHANCEMENT = 'enhancement',
  PROTECTION = 'protection',
  UTILITY = 'utility'
}

export interface AbilityParameter {
  id: string;
  name: string;
  type: ParameterType;
  defaultValue: any;
  minValue?: number;
  maxValue?: number;
  description: string;
  isRequired: boolean;
}

export enum ParameterType {
  NUMBER = 'number',
  STRING = 'string',
  BOOLEAN = 'boolean',
  MANA_COLOR = 'manaColor',
  CARD_TYPE = 'cardType',
  TARGET_TYPE = 'targetType',
  DURATION = 'duration',
  RANGE = 'range',
  PERCENTAGE = 'percentage',
  MULTI_SELECT = 'multiSelect',
  CREATURE_TYPE = 'creatureType',
  MANA_AMOUNT = 'manaAmount',
  COUNTER_TYPE = 'counterType'
}

export interface AbilityCondition {
  id: string;
  type: ConditionType;
  parameter: string;
  operator: ConditionOperator;
  value: any;
  description: string;
}

export enum ConditionType {
  MANA_AVAILABLE = 'manaAvailable',
  CARD_COUNT = 'cardCount',
  LIFE_TOTAL = 'lifeTotal',
  PHASE = 'phase',
  TURN_NUMBER = 'turnNumber',
  CARD_IN_PLAY = 'cardInPlay',
  CREATURE_POWER = 'creaturePower',
  CREATURE_TOUGHNESS = 'creatureToughness',
  CARDS_IN_HAND = 'cardsInHand',
  CARDS_IN_GRAVEYARD = 'cardsInGraveyard',
  STRESS_COUNTERS = 'stressCounters',
  CREATURE_COUNT = 'creatureCount',
  SPELL_COUNT = 'spellCount',
  ARTIFACT_COUNT = 'artifactCount',
  ENCHANTMENT_COUNT = 'enchantmentCount',
  MANA_SPENT_THIS_TURN = 'manaSpentThisTurn',
  DAMAGE_DEALT = 'damageDealt',
  DAMAGE_TAKEN = 'damageTaken',
  PLAYER_LIFE = 'playerLife',
  RANDOM_CHANCE = 'randomChance'
}

export enum ConditionOperator {
  EQUALS = 'equals',
  GREATER_THAN = 'greaterThan',
  LESS_THAN = 'lessThan',
  GREATER_EQUAL = 'greaterEqual',
  LESS_EQUAL = 'lessEqual',
  CONTAINS = 'contains',
  NOT_EQUALS = 'notEquals',
  BETWEEN = 'between',
  IN_LIST = 'inList',
  NOT_IN_LIST = 'notInList',
  STARTS_WITH = 'startsWith',
  ENDS_WITH = 'endsWith',
  IS_EMPTY = 'isEmpty',
  IS_NOT_EMPTY = 'isNotEmpty',
  DIVISIBLE_BY = 'divisibleBy',
  IS_EVEN = 'isEven',
  IS_ODD = 'isOdd'
}

export interface AbilityEffect {
  id: string;
  type: EffectType;
  target: TargetType;
  value: EffectValue;
  duration: EffectDuration;
  description: string;
}

export enum EffectType {
  DEAL_DAMAGE = 'dealDamage',
  HEAL = 'heal',
  ADD_MANA = 'addMana',
  DRAW_CARDS = 'drawCards',
  DESTROY = 'destroy',
  BOOST_STATS = 'boostStats',
  GRANT_ABILITY = 'grantAbility',
  ADD_STRESS = 'addStress',
  REMOVE_STRESS = 'removeStress',
  TAP_TARGET = 'tapTarget',
  UNTAP_TARGET = 'untapTarget',
  STUN_TARGET = 'stunTarget',
  SILENCE_TARGET = 'silenceTarget',
  COUNTER_SPELL = 'counterSpell',
  EXILE_TARGET = 'exileTarget',
  RETURN_TO_HAND = 'returnToHand',
  MILL_CARDS = 'millCards',
  DISCARD_CARDS = 'discardCards',
  SEARCH_LIBRARY = 'searchLibrary',
  SHUFFLE_LIBRARY = 'shuffleLibrary',
  GAIN_CONTROL = 'gainControl',
  LOSE_CONTROL = 'loseControl',
  COPY_SPELL = 'copySpell',
  TRANSFORM = 'transform',
  PHASE_OUT = 'phaseOut',
  PHASE_IN = 'phaseIn',
  PREVENT_DAMAGE = 'preventDamage',
  REDIRECT_DAMAGE = 'redirectDamage',
  DOUBLE_DAMAGE = 'doubleDamage',
  HALVE_DAMAGE = 'halveDamage',
  GAIN_LIFE = 'gainLife',
  LOSE_LIFE = 'loseLife',
  SET_LIFE = 'setLife',
  EXCHANGE_LIFE = 'exchangeLife',
  ADD_COUNTERS = 'addCounters',
  REMOVE_COUNTERS = 'removeCounters',
  MOVE_COUNTERS = 'moveCounters',
  CREATE_TOKEN = 'createToken',
  SACRIFICE = 'sacrifice',
  REGENERATE = 'regenerate',
  FLICKER = 'flicker',
  CLONE = 'clone',
  MORPH = 'morph',
  UNMORPH = 'unmorph',
  MANIFEST = 'manifest',
  SCRY = 'scry',
  SURVEIL = 'surveil',
  EXPLORE = 'explore',
  ADAPT = 'adapt',
  MONSTROSITY = 'monstrosity',
  LEVEL_UP = 'levelUp'
}

export enum TargetType {
  SELF = 'self',
  ANY_CREATURE = 'anyCreature',
  ANY_PLAYER = 'anyPlayer',
  OPPONENT = 'opponent',
  ALL_CREATURES = 'allCreatures',
  RANDOM_TARGET = 'randomTarget',
  CONTROLLER = 'controller',
  OWNER = 'owner',
  ALL_PLAYERS = 'allPlayers',
  ALL_OPPONENTS = 'allOpponents',
  TARGET_CREATURE = 'targetCreature',
  TARGET_PLAYER = 'targetPlayer',
  TARGET_SPELL = 'targetSpell',
  TARGET_PERMANENT = 'targetPermanent',
  TARGET_CARD_IN_GRAVEYARD = 'targetCardInGraveyard',
  TARGET_CARD_IN_HAND = 'targetCardInHand',
  TARGET_CARD_IN_LIBRARY = 'targetCardInLibrary',
  FRIENDLY_CREATURES = 'friendlyCreatures',
  ENEMY_CREATURES = 'enemyCreatures',
  TAPPED_CREATURES = 'tappedCreatures',
  UNTAPPED_CREATURES = 'untappedCreatures',
  ATTACKING_CREATURES = 'attackingCreatures',
  BLOCKING_CREATURES = 'blockingCreatures',
  CREATURES_WITH_STRESS = 'creaturesWithStress',
  CREATURES_WITHOUT_STRESS = 'creaturesWithoutStress',
  ARTIFACTS = 'artifacts',
  ENCHANTMENTS = 'enchantments',
  LANDS = 'lands',
  SPELLS = 'spells',
  TOKENS = 'tokens',
  NON_TOKENS = 'nonTokens',
  MULTICOLORED = 'multicolored',
  MONOCOLORED = 'monocolored',
  COLORLESS = 'colorless',
  RANDOM_CREATURE = 'randomCreature',
  RANDOM_PLAYER = 'randomPlayer',
  WEAKEST_CREATURE = 'weakestCreature',
  STRONGEST_CREATURE = 'strongestCreature',
  NEWEST_CREATURE = 'newestCreature',
  OLDEST_CREATURE = 'oldestCreature'
}

export interface EffectValue {
  type: 'fixed' | 'variable' | 'formula' | 'random' | 'conditional' | 'scaling' | 'percentage';
  amount?: number;
  parameter?: string;
  formula?: string; // For complex calculations like "X * 2 + 1"
  minValue?: number; // For random values
  maxValue?: number; // For random values
  scaleParameter?: string; // What to scale with (mana spent, turn number, etc.)
  scaleMultiplier?: number; // Multiplier for scaling
  conditionalValue?: { // Value based on conditions
    condition: string;
    trueValue: number;
    falseValue: number;
  };
  percentageOf?: string; // What to take percentage of (life, power, etc.)
}

export enum EffectDuration {
  INSTANT = 'instant',
  END_OF_TURN = 'endOfTurn',
  PERMANENT = 'permanent',
  UNTIL_REMOVED = 'untilRemoved'
}

// Room and Lobby Enhancement Types
export interface EnhancedRoom {
  id: string;
  name: string;
  host: string;
  players: RoomPlayer[];
  maxPlayers: number;
  gameMode: GameMode;
  deckFormat: DeckFormat;
  isPrivate: boolean;
  password?: string;
  gameSettings: GameSettings;
  status: RoomStatus;
  gameState?: GameState;
  createdAt: Date;
  lastActivity: Date;
}

export interface RoomPlayer {
  id: string;
  username: string;
  role: UserRole;
  deck?: Deck;
  isReady: boolean;
  joinedAt: Date;
}

export enum GameMode {
  CASUAL = 'casual',
  RANKED = 'ranked',
  CUSTOM = 'custom',
  TOURNAMENT = 'tournament'
}

export enum DeckFormat {
  COMMANDER = 'commander',
  STANDARD = 'standard',
  LIMITED = 'limited',
  CUSTOM = 'custom'
}

export interface GameSettings {
  timeLimit?: number; // minutes per player
  startingLife: number;
  startingHandSize: number;
  allowSpectators: boolean;
  deckValidation: boolean;
  customRules?: string[];
}

export enum RoomStatus {
  WAITING = 'waiting',
  READY = 'ready',
  IN_GAME = 'inGame',
  FINISHED = 'finished'
}

// Enhanced Socket Events for Lobbies
export interface EnhancedServerToClientEvents extends ServerToClientEvents {
  roomList: (rooms: EnhancedRoom[]) => void;
  roomJoined: (room: EnhancedRoom) => void;
  roomLeft: () => void;
  roomUpdated: (room: EnhancedRoom) => void;
  deckSelected: (playerId: string, deck: Deck) => void;
  playerReady: (playerId: string, isReady: boolean) => void;
  gameCanStart: (canStart: boolean) => void;
  spectatorJoined: (username: string) => void;
  spectatorLeft: (username: string) => void;
}

export interface EnhancedClientToServerEvents extends ClientToServerEvents {
  createRoom: (settings: CreateRoomRequest) => void;
  joinRoomWithPassword: (roomId: string, password?: string) => void;
  selectDeck: (deckId: string) => void;
  toggleReady: () => void;
  kickPlayer: (playerId: string) => void;
  updateRoomSettings: (settings: Partial<GameSettings>) => void;
  spectateGame: (roomId: string) => void;
}

export interface CreateRoomRequest {
  name: string;
  gameMode: GameMode;
  deckFormat: DeckFormat;
  isPrivate: boolean;
  password?: string;
  gameSettings: GameSettings;
}

export interface LobbyStats {
  totalPlayers: number;
  activeGames: number;
  waitingRooms: number;
  avgGameDuration: number;
  popularFormats: Record<DeckFormat, number>;
}
