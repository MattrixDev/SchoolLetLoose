# MagicSchool - Deployment Guide

This guide will help you deploy the MagicSchool card game to production.

## Architecture

- **Frontend**: React app deployed on Vercel
- **Backend**: Node.js server (deploy separately)
- **Database**: MongoDB Atlas (recommended for production)

## Vercel Deployment (Frontend)

### Prerequisites
1. Vercel account
2. GitHub repository connected to Vercel

### Steps

1. **Push code to GitHub** (if not already done)
2. **Connect to Vercel**:
   - Go to https://vercel.com
   - Import your GitHub repository
   - Vercel should auto-detect the configuration from `vercel.json`

3. **Environment Variables**:
   In Vercel dashboard, add these environment variables:
   ```
   VITE_API_URL=https://your-backend-url.com
   VITE_SOCKET_URL=https://your-backend-url.com
   ```

4. **Deploy**: Vercel will automatically build and deploy

## Backend Deployment Options

### Option 1: Railway (Recommended)
1. Go to https://railway.app
2. Connect your GitHub repository
3. Select the `server` folder as the root
4. Add environment variables:
   ```
   NODE_ENV=production
   PORT=3001
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/magicschool
   JWT_SECRET=your-super-secret-production-key
   CORS_ORIGIN=https://your-vercel-app.vercel.app
   ```

### Option 2: Render
1. Go to https://render.com
2. Connect your GitHub repository
3. Create a new Web Service
4. Root directory: `server`
5. Build command: `npm install && npm run build`
6. Start command: `npm start`

### Option 3: Heroku
1. Install Heroku CLI
2. Create new app: `heroku create your-app-name`
3. Set environment variables with `heroku config:set`
4. Deploy: `git subtree push --prefix server heroku main`

## Database Setup (MongoDB Atlas)

1. Go to https://www.mongodb.com/atlas
2. Create a free cluster
3. Add database user
4. Whitelist IP addresses (0.0.0.0/0 for all IPs)
5. Get connection string and add to backend environment variables

## Testing the Deployment

1. Ensure backend is running and accessible
2. Update frontend environment variables with backend URL
3. Test all features:
   - User registration/login
   - Card creation
   - Deck building
   - Game functionality

## Common Issues

- **CORS errors**: Make sure CORS_ORIGIN in backend matches frontend URL
- **Build failures**: Check that all dependencies are properly installed
- **Database connection**: Verify MongoDB URI and network access
- **Socket.IO**: Ensure WebSocket connections are supported by hosting provider

## Monitoring

- Monitor server logs for errors
- Set up health check endpoints
- Consider adding error tracking (e.g., Sentry)

## Security Considerations

- Use strong JWT secrets in production
- Enable HTTPS for all communications
- Regularly update dependencies
- Implement rate limiting
- Validate all user inputs
