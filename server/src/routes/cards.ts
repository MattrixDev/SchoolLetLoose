import { Router, Request, Response } from 'express';
import { Card } from '../models/Card';
import { GameEngine } from '@magicschool/shared';
import { CreateCardRequest, CreateCardResponse, ApiResponse } from '@magicschool/shared';

export const cardRoutes = Router();

/**
 * POST /api/cards
 * Create a new card
 */
cardRoutes.post('/', async (req: Request, res: Response) => {
  try {
    const cardData: CreateCardRequest = req.body;
    
    // Validate required fields
    if (!cardData.name || !cardData.type) {
      return res.status(400).json({
        success: false,
        message: 'Name and type are required'
      });
    }
    
    // Calculate balanced mana cost
    const manaCost = GameEngine.calculateBalancedManaCost(cardData);
    
    // Create new card
    const card = new Card({
      name: cardData.name,
      description: cardData.description,
      type: cardData.type,
      manaCost,
      attack: cardData.attack,
      defense: cardData.defense,
      effects: cardData.effectIds || [],
      artworkUrl: cardData.artworkUrl,
      createdAt: new Date()
    });
    
    const savedCard = await card.save();
    
    // Convert MongoDB document to Card interface
    const cardObject = savedCard.toObject();
    const cardResponse = {
      ...cardObject,
      id: cardObject._id.toString()
    };
    
    const response: ApiResponse<CreateCardResponse> = {
      success: true,
      data: {
        card: cardResponse,
        success: true,
        message: 'Card created successfully'
      }
    };
    
    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating card:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create card'
    });
  }
});

/**
 * GET /api/cards/:id
 * Get a specific card by ID
 */
cardRoutes.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const card = await Card.findById(id);
    
    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Card not found'
      });
    }
    
    res.json({
      success: true,
      data: card
    });
  } catch (error) {
    console.error('Error fetching card:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch card'
    });
  }
});

/**
 * GET /api/cards
 * Get all cards with pagination
 */
cardRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    
    const cards = await Card.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await Card.countDocuments();
    
    res.json({
      success: true,
      data: {
        cards,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cards'
    });
  }
});
