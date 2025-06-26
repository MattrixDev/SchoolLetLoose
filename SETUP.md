# MagicSchool Setup Guide

## Prerequisites Installation

### 1. Install Node.js and npm

**Option A: Download from Official Website**
1. Go to [https://nodejs.org/](https://nodejs.org/)
2. Download the LTS version (recommended)
3. Run the installer and follow the setup wizard
4. Verify installation by opening PowerShell and running:
   ```powershell
   node --version
   npm --version
   ```

**Option B: Using Chocolatey (Windows Package Manager)**
1. Install Chocolatey first: [https://chocolatey.org/install](https://chocolatey.org/install)
2. Open PowerShell as Administrator
3. Run: `choco install nodejs`

**Option C: Using winget (Windows Package Manager)**
1. Open PowerShell
2. Run: `winget install OpenJS.NodeJS`

### 2. Install MongoDB

**Option A: MongoDB Atlas (Cloud - Recommended for Development)**
1. Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Update `server/.env` with your MongoDB URI

**Option B: Local MongoDB Installation**
1. Download from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Install MongoDB Community Server
3. Start the MongoDB service
4. Use `mongodb://localhost:27017/magicschool` as your connection string

## Project Setup

### 1. Install Dependencies

```powershell
# Navigate to project root
cd c:\Users\matti\MagicSchool

# Install root dependencies
npm install

# Install all workspace dependencies
npm run install:all
```

### 2. Build Shared Package

```powershell
# Build the shared package first (required for client and server)
npm run build:shared
```

### 3. Environment Setup

**Server Environment (`server/.env`)**
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/magicschool
JWT_SECRET=your-super-secret-jwt-key-here
CORS_ORIGIN=http://localhost:5173
```

**Client Environment (`client/.env`)**
```env
VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001
```

### 4. Start Development

```powershell
# Start both client and server in development mode
npm run dev

# Or start individually:
npm run dev:client  # Starts on http://localhost:5173
npm run dev:server  # Starts on http://localhost:3001
```

## Project Scripts

### Root Level Commands
- `npm run dev` - Start both client and server
- `npm run build` - Build all packages
- `npm run test` - Run all tests
- `npm run lint` - Lint all packages

### Individual Package Commands
- `npm run dev:client` - Start client development server
- `npm run dev:server` - Start server development server
- `npm run build:client` - Build client for production
- `npm run build:server` - Build server for production
- `npm run test:client` - Run client tests
- `npm run test:server` - Run server tests

## Development Workflow

1. **Start Development Environment**
   ```powershell
   npm run dev
   ```

2. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/health

3. **Making Changes**
   - Frontend changes auto-reload
   - Backend changes auto-restart with ts-node-dev
   - Shared package changes require rebuild: `npm run build:shared`

## Troubleshooting

### Common Issues

**1. npm not recognized**
- Restart PowerShell after Node.js installation
- Add Node.js to PATH manually if needed

**2. Permission errors**
- Run PowerShell as Administrator
- Or use `npm config set prefix ~/.npm-global`

**3. Port already in use**
- Change ports in environment files
- Or kill processes: `netstat -ano | findstr :3001`

**4. MongoDB connection failed**
- Check if MongoDB service is running
- Verify connection string in `.env`
- For Atlas: check network access and credentials

**5. TypeScript errors**
- Build shared package: `npm run build:shared`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### VS Code Extensions (Recommended)

Install these extensions for the best development experience:
- TypeScript Importer
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- MongoDB for VS Code
- REST Client

## Production Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set build command: `npm run build:client`
3. Set output directory: `client/dist`
4. Add environment variables

### Backend (Railway/Heroku)
1. Connect GitHub repository
2. Set build command: `npm run build:server`
3. Set start command: `npm start`
4. Add environment variables including production MongoDB URI

## Game Features

### Available Pages
- **Lobby** - Create/join rooms, view game rules
- **Card Builder** - Create custom cards with effects
- **Game** - Real-time multiplayer card game

### Current Implementation Status
- ✅ Project structure and build system
- ✅ Basic UI components and pages
- ✅ Card creation system with effect pool
- ✅ Socket.IO integration setup
- ✅ MongoDB models and API endpoints
- 🚧 Real-time game logic (partially implemented)
- 🚧 Card effects execution
- 📋 User authentication
- 📋 Card artwork upload
- 📋 Advanced game features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run `npm run lint` and `npm run test`
6. Submit a pull request

## License

This project is licensed under the MIT License.
