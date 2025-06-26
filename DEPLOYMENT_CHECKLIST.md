# 🚀 MagicSchool Deployment Checklist

## Pre-Deployment ✅

- [x] Code review completed - all TypeScript errors fixed
- [x] Mana system updated to use school subjects consistently
- [x] Build process working successfully
- [x] Vercel configuration created
- [x] Environment variable templates created
- [x] Deployment documentation written
- [x] .gitignore file created

## Frontend Deployment (Vercel)

### Step 1: Prepare Repository
1. Commit all changes to Git
2. Push to GitHub repository

### Step 2: Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel should auto-detect React/Vite configuration
5. Add environment variables:
   - `VITE_API_URL` = Your backend URL (e.g., `https://your-app.railway.app`)
   - `VITE_SOCKET_URL` = Your backend URL (same as above)
6. Deploy!

## Backend Deployment (Railway - Recommended)

### Step 1: Create Railway Account
1. Go to [Railway](https://railway.app/)
2. Sign up with GitHub

### Step 2: Deploy Backend
1. Create new project in Railway
2. Connect your GitHub repository
3. Select the `server` folder as the root directory
4. Add environment variables in Railway dashboard:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/magicschool
   JWT_SECRET=your-super-secret-production-key
   CORS_ORIGIN=https://your-vercel-app.vercel.app
   PORT=3001
   ```

## Database Setup (MongoDB Atlas)

### Step 1: Create Database
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create database user with read/write permissions
4. Whitelist Railway's IP addresses (or use 0.0.0.0/0 for simplicity)
5. Get connection string

### Step 2: Update Backend
1. Add MongoDB URI to Railway environment variables
2. Redeploy backend

## Final Steps

### Step 1: Update Frontend with Backend URL
1. Get your Railway backend URL
2. Update Vercel environment variables:
   - `VITE_API_URL` = `https://your-railway-app.up.railway.app`
   - `VITE_SOCKET_URL` = `https://your-railway-app.up.railway.app`
3. Redeploy frontend

### Step 2: Test Everything
1. ✅ User registration/login works
2. ✅ Card creation works
3. ✅ Deck building works
4. ✅ Real-time game features work
5. ✅ No console errors

## Your URLs
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.up.railway.app`
- Database: MongoDB Atlas cluster

## Commands to Run Locally After Deployment
```bash
# Test frontend build
npm run build

# Test with production backend
cd client && VITE_API_URL=https://your-backend.railway.app npm run dev
```

## Troubleshooting

### Common Issues:
1. **CORS errors**: Check CORS_ORIGIN matches frontend URL exactly
2. **Socket.IO not connecting**: Ensure WebSocket support on hosting platform
3. **Database connection fails**: Check MongoDB Atlas IP whitelist and credentials
4. **Build fails**: Ensure all environment variables are set correctly

### Debug Steps:
1. Check browser console for errors
2. Check Railway logs for backend errors
3. Test API endpoints directly: `https://your-backend.railway.app/health`
4. Verify environment variables are set correctly
