import { Express } from 'express';
import { cardRoutes } from './cards';
import { effectRoutes } from './effects';
import { roomRoutes } from './rooms';

/**
 * Setup all API routes
 */
export function setupRoutes(app: Express): void {
  // Mount route modules
  app.use('/api/cards', cardRoutes);
  app.use('/api/effects', effectRoutes);
  app.use('/api/rooms', roomRoutes);
}
