import { Router, Request, Response } from 'express';
import { CARD_EFFECTS } from '@magicschool/shared';
import { ApiResponse, GetEffectsResponse } from '@magicschool/shared';

export const effectRoutes = Router();

/**
 * GET /api/effects
 * Get all available card effects for the card builder
 */
effectRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const response: ApiResponse<GetEffectsResponse> = {
      success: true,
      data: {
        effects: CARD_EFFECTS
      }
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching effects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch effects'
    });
  }
});

/**
 * GET /api/effects/:id
 * Get a specific effect by ID
 */
effectRoutes.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const effect = CARD_EFFECTS.find(e => e.id === id);
    
    if (!effect) {
      return res.status(404).json({
        success: false,
        message: 'Effect not found'
      });
    }
    
    res.json({
      success: true,
      data: effect
    });
  } catch (error) {
    console.error('Error fetching effect:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch effect'
    });
  }
});

/**
 * GET /api/effects/type/:cardType
 * Get effects suitable for a specific card type
 */
effectRoutes.get('/type/:cardType', async (req: Request, res: Response) => {
  try {
    const { cardType } = req.params;
    
    // Filter effects based on card type
    let filteredEffects = CARD_EFFECTS;
    
    switch (cardType.toLowerCase()) {
      case 'creature':
        filteredEffects = CARD_EFFECTS.filter(effect => 
          ['continuous', 'onAttack', 'onDeath', 'activated'].includes(effect.trigger)
        );
        break;
      case 'spell':
        filteredEffects = CARD_EFFECTS.filter(effect => 
          effect.trigger === 'onPlay'
        );
        break;
      case 'artifact':
        filteredEffects = CARD_EFFECTS.filter(effect =>
          ['continuous', 'activated'].includes(effect.trigger)
        );
        break;
      case 'land':
        filteredEffects = CARD_EFFECTS.filter(effect =>
          effect.trigger === 'activated' && effect.parameters.manaAmount
        );
        break;
    }
    
    res.json({
      success: true,
      data: {
        effects: filteredEffects
      }
    });
  } catch (error) {
    console.error('Error fetching effects by type:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch effects by type'
    });
  }
});
