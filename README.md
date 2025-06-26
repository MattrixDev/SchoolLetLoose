# MagicSchool Card Game

A real-time multiplayer card game inspired by Magic: The Gathering, featuring school-themed cards and custom card creation.

## 🎮 Features

- **Real-time Multiplayer**: 1v1 battles using Socket.IO
- **School Theme**: Math, German, English, French/Latin, and Differentiation subjects as mana colors
- **Custom Card Builder**: Create your own cards with drag-and-drop artwork
- **Responsive Design**: Works on desktop and mobile
- **Effect System**: Pre-defined effects pool for balanced gameplay

## 🏗️ Architecture

### Frontend (React + Vite)
- **Pages**: Lobby, Game Board, Card Builder
- **Components**: Card, Deck, Hand, Board, ManaPool, PhaseTracker
- **Styling**: Tailwind CSS for responsive design
- **Real-time**: Socket.IO client for game state synchronization

### Backend (Node.js + Express)
- **REST API**: Card creation, effects management, room handling
- **WebSocket**: Socket.IO server for real-time gameplay
- **Database**: MongoDB for persistence
- **Game Logic**: Server-side validation and balancing

### Shared
- **Types**: TypeScript definitions shared between client and server
- **Game Rules**: Core game logic and validation
- **Constants**: Game configuration and effect definitions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- MongoDB instance (local or cloud)
- Git

### Installation

1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd MagicSchool
   npm run install:all
   ```

2. **Environment Setup**:
   
   Create `.env` files:
   
   **server/.env**:
   ```env
   NODE_ENV=development
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/magicschool
   JWT_SECRET=your-jwt-secret-here
   CORS_ORIGIN=http://localhost:5173
   ```
   
   **client/.env**:
   ```env
   VITE_API_URL=http://localhost:3001
   VITE_SOCKET_URL=http://localhost:3001
   ```

3. **Start development servers**:
   ```bash
   npm run dev
   ```
   
   This runs:
   - Client: http://localhost:5173
   - Server: http://localhost:3001

## 🎯 Game Rules

### Basic Gameplay
- **Players**: 2 per match, start with 20 life
- **Phases**: Draw → Main → Combat → End
- **Victory**: Reduce opponent's life to 0

### Mana System
- **Blue (Math)**: Logic and calculation effects
- **Red (German)**: Aggressive and direct damage
- **Black (English)**: Literature and dark effects  
- **Green (French/Latin)**: Growth and nature-based
- **White (Differentiation)**: Protection and healing

### Card Types
- **Creatures**: Attack and defend with power/toughness
- **Spells**: Instant effects that resolve immediately
- **Artifacts**: Permanent utility items
- **Lands**: Generate mana for casting other cards

## 🛠️ Development

### Project Structure
```
MagicSchool/
├── client/          # React frontend
├── server/          # Node.js backend  
├── shared/          # Shared types and logic
├── .github/         # CI/CD workflows
└── package.json     # Root workspace config
```

### Available Scripts

**Root level**:
- `npm run dev` - Start both client and server
- `npm run build` - Build all packages
- `npm run test` - Run all tests
- `npm run lint` - Lint all packages

**Individual packages**:
- `npm run dev:client` - Client development server
- `npm run dev:server` - Server development server
- `npm run test:client` - Client tests only
- `npm run test:server` - Server tests only

### Testing
- **Unit Tests**: Jest for game logic and utilities
- **Integration Tests**: API endpoints and Socket.IO events
- **Component Tests**: React components with React Testing Library

### CI/CD
GitHub Actions workflow automatically:
- Runs linting and tests on all PRs
- Builds and validates the application
- Runs security checks

## 🚢 Deployment

### Frontend (Vercel)
1. Connect repository to Vercel
2. Set build command: `npm run build:client`
3. Set output directory: `client/dist`
4. Configure environment variables

### Backend (Heroku/Railway)
1. Connect repository to hosting platform
2. Set build command: `npm run build:server`
3. Configure environment variables
4. Set up MongoDB connection

## 📚 API Documentation

### REST Endpoints
- `GET /api/effects` - Get available card effects
- `POST /api/cards` - Create new card
- `GET /api/cards/:id` - Get card details
- `GET /api/rooms/:roomId` - Get room information

### Socket.IO Events
- `joinRoom` - Join a game room
- `startGame` - Initialize game state
- `playCard` - Play a card from hand
- `attack` - Declare creature attacks
- `passPhase` - Move to next game phase
- `updateState` - Broadcast game state changes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run `npm run lint` and `npm run test`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
