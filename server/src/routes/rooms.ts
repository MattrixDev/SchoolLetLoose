import { Router, Request, Response } from 'express';
import { Room as RoomModel } from '../models/Room';
import { ApiResponse } from '@magicschool/shared';

export const roomRoutes = Router();

/**
 * GET /api/rooms/:roomId
 * Get room information
 */
roomRoutes.get('/:roomId', async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const room = await RoomModel.findById(roomId);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    res.json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch room'
    });
  }
});

/**
 * GET /api/rooms
 * Get list of active rooms
 */
roomRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const rooms = await RoomModel.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({
      success: true,
      data: { rooms }
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rooms'
    });
  }
});
