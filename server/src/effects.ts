import { CardEffect, EffectTrigger } from './types';

/**
 * Pre-defined card effects that can be used in the card builder
 * Each effect has balanced parameters for gameplay
 */
export const CARD_EFFECTS: CardEffect[] = [
  // Combat Effects
  {
    id: 'first-strike',
    name: 'First Strike',
    description: 'This creature deals combat damage before creatures without first strike.',
    trigger: EffectTrigger.ON_ATTACK,
    parameters: {}
  },
  {
    id: 'trample',
    name: 'Trample',
    description: 'Excess combat damage may be dealt to defending player.',
    trigger: EffectTrigger.ON_ATTACK,
    parameters: {}
  },
  {
    id: 'flying',
    name: 'Flying',
    description: 'Can only be blocked by creatures with flying or reach.',
    trigger: EffectTrigger.CONTINUOUS,
    parameters: {}
  },
  {
    id: 'reach',
    name: 'Reach',
    description: 'Can block creatures with flying.',
    trigger: EffectTrigger.CONTINUOUS,
    parameters: {}
  },

  // Damage Effects
  {
    id: 'direct-damage-2',
    name: 'Lightning Strike',
    description: 'Deal 2 damage to target player or creature.',
    trigger: EffectTrigger.ON_PLAY,
    parameters: { damage: 2, targetType: 'any' }
  },
  {
    id: 'direct-damage-3',
    name: 'Fireball',
    description: 'Deal 3 damage to target player or creature.',
    trigger: EffectTrigger.ON_PLAY,
    parameters: { damage: 3, targetType: 'any' }
  },
  {
    id: 'area-damage-1',
    name: 'Shock Wave',
    description: 'Deal 1 damage to all creatures.',
    trigger: EffectTrigger.ON_PLAY,
    parameters: { damage: 1, targetType: 'all-creatures' }
  },

  // Healing Effects
  {
    id: 'heal-3',
    name: 'First Aid',
    description: 'Target player gains 3 life.',
    trigger: EffectTrigger.ON_PLAY,
    parameters: { healing: 3, targetType: 'player' }
  },
  {
    id: 'heal-5',
    name: 'Major Healing',
    description: 'Target player gains 5 life.',
    trigger: EffectTrigger.ON_PLAY,
    parameters: { healing: 5, targetType: 'player' }
  },

  // Draw Effects
  {
    id: 'draw-1',
    name: 'Study Session',
    description: 'Draw a card.',
    trigger: EffectTrigger.ON_PLAY,
    parameters: { drawCount: 1 }
  },
  {
    id: 'draw-2',
    name: 'Research',
    description: 'Draw two cards.',
    trigger: EffectTrigger.ON_PLAY,
    parameters: { drawCount: 2 }
  },

  // Buff/Debuff Effects
  {
    id: 'power-boost-2',
    name: 'Strength Training',
    description: 'Target creature gets +2/+0 until end of turn.',
    trigger: EffectTrigger.ON_PLAY,
    parameters: { powerBonus: 2, toughnessBonus: 0, duration: 'end-of-turn' }
  },
  {
    id: 'defense-boost-2',
    name: 'Shield Wall',
    description: 'Target creature gets +0/+2 until end of turn.',
    trigger: EffectTrigger.ON_PLAY,
    parameters: { powerBonus: 0, toughnessBonus: 2, duration: 'end-of-turn' }
  },
  {
    id: 'balanced-boost-1',
    name: 'Encourage',
    description: 'Target creature gets +1/+1 until end of turn.',
    trigger: EffectTrigger.ON_PLAY,
    parameters: { powerBonus: 1, toughnessBonus: 1, duration: 'end-of-turn' }
  },

  // Removal Effects
  {
    id: 'destroy-creature',
    name: 'Eliminate',
    description: 'Destroy target creature.',
    trigger: EffectTrigger.ON_PLAY,
    parameters: { targetType: 'creature', effect: 'destroy' }
  },
  {
    id: 'return-to-hand',
    name: 'Confusion',
    description: 'Return target creature to its owner\'s hand.',
    trigger: EffectTrigger.ON_PLAY,
    parameters: { targetType: 'creature', effect: 'bounce' }
  },

  // Mana Effects
  {
    id: 'add-mana-any-1',
    name: 'Quick Study',
    description: 'Add one mana of any color.',
    trigger: EffectTrigger.ON_PLAY,
    parameters: { manaAmount: 1, manaType: 'any' }
  },
  {
    id: 'add-mana-blue-2',
    name: 'Math Focus',
    description: 'Add two blue mana.',
    trigger: EffectTrigger.ON_PLAY,
    parameters: { manaAmount: 2, manaType: 'blue' }
  },
  {
    id: 'add-mana-red-2',
    name: 'German Passion',
    description: 'Add two red mana.',
    trigger: EffectTrigger.ON_PLAY,
    parameters: { manaAmount: 2, manaType: 'red' }
  },

  // Triggered Abilities
  {
    id: 'death-trigger-damage',
    name: 'Explosive End',
    description: 'When this creature dies, deal 2 damage to any target.',
    trigger: EffectTrigger.ON_DEATH,
    parameters: { damage: 2, targetType: 'any' }
  },
  {
    id: 'death-trigger-draw',
    name: 'Final Lesson',
    description: 'When this creature dies, draw a card.',
    trigger: EffectTrigger.ON_DEATH,
    parameters: { drawCount: 1 }
  },
  {
    id: 'attack-trigger-buff',
    name: 'Battle Fury',
    description: 'Whenever this creature attacks, it gets +1/+0 until end of turn.',
    trigger: EffectTrigger.ON_ATTACK,
    parameters: { powerBonus: 1, toughnessBonus: 0, duration: 'end-of-turn' }
  },

  // Protection Effects
  {
    id: 'indestructible',
    name: 'Unbreakable',
    description: 'This creature cannot be destroyed by damage or effects.',
    trigger: EffectTrigger.CONTINUOUS,
    parameters: {}
  },
  {
    id: 'hexproof',
    name: 'Untouchable',
    description: 'This creature cannot be targeted by opponent\'s spells or abilities.',
    trigger: EffectTrigger.CONTINUOUS,
    parameters: {}
  },

  // School-Themed Effects
  {
    id: 'test-anxiety',
    name: 'Test Anxiety',
    description: 'Target player discards a card at random.',
    trigger: EffectTrigger.ON_PLAY,
    parameters: { discardCount: 1, targetType: 'player', random: true }
  },
  {
    id: 'group-project',
    name: 'Group Project',
    description: 'All creatures you control get +1/+1 until end of turn.',
    trigger: EffectTrigger.ON_PLAY,
    parameters: { powerBonus: 1, toughnessBonus: 1, targetType: 'all-friendly-creatures' }
  },
  {
    id: 'homework-help',
    name: 'Homework Help',
    description: 'Target creature cannot attack or block until end of turn.',
    trigger: EffectTrigger.ON_PLAY,
    parameters: { effect: 'tap', duration: 'end-of-turn', targetType: 'creature' }
  },
  {
    id: 'pop-quiz',
    name: 'Pop Quiz',
    description: 'Look at target player\'s hand and choose a card. That player discards that card.',
    trigger: EffectTrigger.ON_PLAY,
    parameters: { effect: 'targeted-discard', targetType: 'player' }
  },
  {
    id: 'detention',
    name: 'Detention',
    description: 'Target creature cannot untap during its controller\'s next untap step.',
    trigger: EffectTrigger.ON_PLAY,
    parameters: { effect: 'skip-untap', duration: 'one-turn', targetType: 'creature' }
  }
];

/**
 * Get effects by trigger type for filtering in card builder
 */
export function getEffectsByTrigger(trigger: EffectTrigger): CardEffect[] {
  return CARD_EFFECTS.filter(effect => effect.trigger === trigger);
}

/**
 * Get effect by ID
 */
export function getEffectById(id: string): CardEffect | undefined {
  return CARD_EFFECTS.find(effect => effect.id === id);
}

/**
 * Get effects that are suitable for specific card types
 */
export function getEffectsForCardType(cardType: string): CardEffect[] {
  switch (cardType) {
    case 'creature':
      return CARD_EFFECTS.filter(effect => 
        effect.trigger === EffectTrigger.CONTINUOUS ||
        effect.trigger === EffectTrigger.ON_ATTACK ||
        effect.trigger === EffectTrigger.ON_DEATH ||
        effect.trigger === EffectTrigger.ACTIVATED
      );
    case 'spell':
      return CARD_EFFECTS.filter(effect => 
        effect.trigger === EffectTrigger.ON_PLAY
      );
    case 'artifact':
      return CARD_EFFECTS.filter(effect =>
        effect.trigger === EffectTrigger.CONTINUOUS ||
        effect.trigger === EffectTrigger.ACTIVATED
      );
    case 'land':
      return CARD_EFFECTS.filter(effect =>
        effect.trigger === EffectTrigger.ACTIVATED &&
        effect.parameters.manaAmount
      );
    default:
      return CARD_EFFECTS;
  }
}
