import { 
  GameState, 
  Player, 
  Card, 
  Phase, 
  ActionType, 
  CardType, 
  ManaCost, 
  ManaPool,
  GAME_CONSTANTS 
} from './types';

/**
 * Core game logic and validation functions
 */
export class GameEngine {
  /**
   * Initialize a new game state with two players
   */
  static createInitialGameState(player1Id: string, player2Id: string, gameId: string): GameState {
    const player1: Player = this.createInitialPlayer(player1Id);
    const player2: Player = this.createInitialPlayer(player2Id);
    
    return {
      id: gameId,
      players: [player1, player2],
      currentPlayer: 0,
      phase: Phase.DRAW,
      turn: 1,
      isActive: true,
      createdAt: new Date()
    };
  }

  /**
   * Create an initial player state
   */
  private static createInitialPlayer(playerId: string): Player {
    return {
      id: playerId,
      username: '', // Will be set when player joins
      life: GAME_CONSTANTS.STARTING_LIFE,
      mana: { math: 0, german: 0, english: 0, french: 0, latin: 0, differentiation: 0, learning: 0 },
      hand: [],
      deck: [],
      battlefield: [],
      graveyard: []
    };
  }

  /**
   * Calculate total mana cost including colorless
   */
  static calculateTotalManaCost(manaCost: ManaCost): number {
    const coloredMana = (manaCost.math || 0) + 
                       (manaCost.german || 0) + 
                       (manaCost.english || 0) + 
                       (manaCost.french || 0) + 
                       (manaCost.latin || 0) + 
                       (manaCost.differentiation || 0);
    return coloredMana + (manaCost.learning || 0);
  }

  /**
   * Check if player can afford to play a card
   */
  static canAffordCard(playerMana: ManaPool, cardCost: ManaCost): boolean {
    const requiredMath = cardCost.math || 0;
    const requiredGerman = cardCost.german || 0;
    const requiredEnglish = cardCost.english || 0;
    const requiredFrench = cardCost.french || 0;
    const requiredLatin = cardCost.latin || 0;
    const requiredDifferentiation = cardCost.differentiation || 0;
    const requiredLearning = cardCost.learning || 0;

    // Check colored mana requirements
    if (playerMana.math < requiredMath ||
        playerMana.german < requiredGerman ||
        playerMana.english < requiredEnglish ||
        playerMana.french < requiredFrench ||
        playerMana.latin < requiredLatin ||
        playerMana.differentiation < requiredDifferentiation) {
      return false;
    }

    // Check if remaining mana can cover learning cost
    const availableForLearning = Object.values(playerMana).reduce((sum, mana) => sum + mana, 0) -
                                requiredMath - requiredGerman - requiredEnglish - requiredFrench - requiredLatin - requiredDifferentiation;

    return availableForLearning >= requiredLearning;
  }

  /**
   * Validate if a card can be played in current game state
   */
  static validateCardPlay(gameState: GameState, playerId: string, cardId: string): {
    valid: boolean;
    message?: string;
  } {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    
    // Check if it's the player's turn
    if (currentPlayer.id !== playerId) {
      return { valid: false, message: "It's not your turn" };
    }

    // Check if in main phase
    if (gameState.phase !== Phase.MAIN) {
      return { valid: false, message: "Can only play cards during main phase" };
    }

    // Find card in player's hand
    const card = currentPlayer.hand.find(c => c.id === cardId);
    if (!card) {
      return { valid: false, message: "Card not found in hand" };
    }

    // Check if player can afford the card
    if (!this.canAffordCard(currentPlayer.mana, card.manaCost)) {
      return { valid: false, message: "Not enough mana to play this card" };
    }

    // Check battlefield size limit for creatures
    if (card.type === CardType.CREATURE && currentPlayer.battlefield.length >= GAME_CONSTANTS.MAX_BATTLEFIELD_SIZE) {
      return { valid: false, message: "Battlefield is full" };
    }

    return { valid: true };
  }

  /**
   * Apply a card being played to the game state
   */
  static playCard(gameState: GameState, playerId: string, cardId: string): GameState {
    const validation = this.validateCardPlay(gameState, playerId, cardId);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    const newGameState = { ...gameState };
    const currentPlayer = newGameState.players[gameState.currentPlayer];
    const card = currentPlayer.hand.find(c => c.id === cardId)!;

    // Remove card from hand
    currentPlayer.hand = currentPlayer.hand.filter(c => c.id !== cardId);

    // Pay mana cost
    this.payManaCost(currentPlayer.mana, card.manaCost);

    // Apply card effect based on type
    switch (card.type) {
      case CardType.CREATURE:
      case CardType.ARTIFACT:
        // Add to battlefield
        currentPlayer.battlefield.push(card);
        break;
      case CardType.SPELL:
        // Apply spell effect immediately, then put in graveyard
        // TODO: Implement spell effects
        currentPlayer.graveyard.push(card);
        break;
      case CardType.LAND:
        // Lands go to battlefield and can be tapped for mana
        currentPlayer.battlefield.push(card);
        break;
    }

    return newGameState;
  }

  /**
   * Deduct mana cost from player's mana pool
   */
  private static payManaCost(playerMana: ManaPool, cost: ManaCost): void {
    // Pay required colored mana first
    playerMana.math -= (cost.math || 0);
    playerMana.german -= (cost.german || 0);
    playerMana.english -= (cost.english || 0);
    playerMana.french -= (cost.french || 0);
    playerMana.latin -= (cost.latin || 0);
    playerMana.differentiation -= (cost.differentiation || 0);

    // Pay learning cost with any remaining mana
    let learningRemaining = cost.learning || 0;
    const colors: (keyof ManaPool)[] = ['math', 'german', 'english', 'french', 'latin', 'differentiation'];
    
    for (const color of colors) {
      if (learningRemaining <= 0) break;
      const available = playerMana[color];
      const toSpend = Math.min(available, learningRemaining);
      playerMana[color] -= toSpend;
      learningRemaining -= toSpend;
    }
  }

  /**
   * Advance to the next phase
   */
  static nextPhase(gameState: GameState): GameState {
    const newGameState = { ...gameState };
    const currentPhaseIndex = GAME_CONSTANTS.PHASES_ORDER.indexOf(gameState.phase);
    
    if (currentPhaseIndex === GAME_CONSTANTS.PHASES_ORDER.length - 1) {
      // End of turn - switch players and go to draw phase
      newGameState.currentPlayer = 1 - gameState.currentPlayer;
      newGameState.phase = Phase.DRAW;
      newGameState.turn += 1;
      
      // Untap all permanents and reset mana
      const newCurrentPlayer = newGameState.players[newGameState.currentPlayer];
      // TODO: Implement untapping
      
      // Add mana from lands
      // TODO: Implement mana generation from lands
      
    } else {
      // Move to next phase
      newGameState.phase = GAME_CONSTANTS.PHASES_ORDER[currentPhaseIndex + 1];
    }

    return newGameState;
  }

  /**
   * Check if the game has ended (player at 0 life)
   */
  static checkGameEnd(gameState: GameState): { ended: boolean; winner?: string; reason?: string } {
    for (const player of gameState.players) {
      if (player.life <= 0) {
        const winner = gameState.players.find(p => p.id !== player.id);
        return {
          ended: true,
          winner: winner?.id,
          reason: `${player.username} was reduced to 0 life`
        };
      }
    }

    return { ended: false };
  }

  /**
   * Auto-balance a card's mana cost based on its stats and effects
   * This is a simplified balancing algorithm
   */
  static calculateBalancedManaCost(card: Partial<Card>): ManaCost {
    let totalCost = 0;

    // Base cost for card type
    switch (card.type) {
      case CardType.CREATURE:
        totalCost += 1;
        break;
      case CardType.SPELL:
        totalCost += 2;
        break;
      case CardType.ARTIFACT:
        totalCost += 2;
        break;
      case CardType.LAND:
        return { learning: 0 }; // Lands are free
    }

    // Add cost for attack/defense
    if (card.attack) totalCost += Math.floor(card.attack / 2);
    if (card.defense) totalCost += Math.floor(card.defense / 3);

    // Add cost for effects
    if (card.effects) {
      totalCost += card.effects.length;
    }

    // Minimum cost of 1 for non-land cards
    totalCost = Math.max(1, totalCost);

    // For now, return as learning mana
    // TODO: Implement color-specific balancing based on effects
    return { learning: totalCost };
  }
}
