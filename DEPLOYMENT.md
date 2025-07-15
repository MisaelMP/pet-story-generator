# Frontend Deployment Guide (Vercel)

## Prerequisites
1. Install [Vercel CLI](https://vercel.com/cli) (optional)
2. Create a Vercel account
3. Backend must be deployed to Heroku first

## Method 1: GitHub Integration (Recommended)
1. Push code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Import Project"
4. Select your GitHub repository
5. Configure build settings:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Set environment variables:
   - `VITE_BACKEND_PROXY_URL`: `https://your-heroku-app.herokuapp.com`
   - `VITE_NODE_ENV`: `production`
7. Click "Deploy"

## Method 2: Vercel CLI
1. **Install and Login**
   ```bash
   npm i -g vercel
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables** (via dashboard or CLI)
   ```bash
   vercel env add VITE_BACKEND_PROXY_URL
   vercel env add VITE_NODE_ENV
   ```

## Configuration Files
- `vercel.json` - Handles routing and API proxying
- `.env.example` - Template for environment variables

## Post-Deployment Checklist
1. Update `vercel.json` with your actual Heroku app URL
2. Verify all API endpoints work
3. Test the complete user flow
4. Check browser console for errors

## Troubleshooting
- Check Vercel function logs
- Verify environment variables are set correctly
- Ensure backend CORS includes your Vercel domain
