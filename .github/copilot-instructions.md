# School Let Loose Card Game - Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a full-stack multiplayer card game inspired by Magic: The Gathering, featuring school-themed cards and real-time gameplay.

## Architecture
- **Frontend**: React with TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, Socket.IO, MongoDB
- **Shared**: Common types and game logic
- **Testing**: Jest for backend, Vitest for frontend

## Key Technologies
- Real-time communication via Socket.IO
- MongoDB for data persistence
- Custom card creation system
- School-themed mana system (Math=Blue, German=Red, English=Black, French/Latin=Green, Differentiation=White)

## Coding Guidelines
- Use TypeScript for type safety
- Follow React functional components with hooks
- Implement proper error handling and validation
- Write comprehensive tests for game logic
- Use shared types from @schoolletloose/shared package
- Follow responsive design principles with Tailwind CSS

## Game Rules
- 2-player matches starting at 20 life
- Turn phases: Draw → Main → Combat → End
- Card types: Creature, Spell, Artifact, Land
- Server-side mana cost balancing for custom cards

## Development Notes
- All game state validation happens server-side
- Socket.IO events are strongly typed
- Card effects use a predefined pool system
- Responsive design for mobile and desktop play
