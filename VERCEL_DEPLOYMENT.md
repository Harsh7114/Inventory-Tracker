# 🚀 Vercel Deployment Guide

This guide will walk you through deploying your Inventory Management System to Vercel.

## Prerequisites

- ✅ GitHub account
- ✅ Vercel account (sign up at [vercel.com](https://vercel.com))
- ✅ Neon database URL (you already have this!)
- ✅ AssemblyAI API key
- ✅ Google Gemini API key

## Step-by-Step Deployment

### Step 1: Push Your Code to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - ready for Vercel deployment"
   ```

2. **Create a GitHub Repository**:
   - Go to [GitHub](https://github.com/new)
   - Create a new repository (e.g., `inventory-tracker`)
   - **Don't** initialize with README, .gitignore, or license

3. **Push Your Code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/inventory-tracker.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**:
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Your Project**:
   - Click **"Add New..."** → **"Project"**
   - Select your GitHub repository (`inventory-tracker`)
   - Click **"Import"**

3. **Configure Project Settings**:
   - **Framework Preset**: Leave as "Other" or "Vite"
   - **Root Directory**: `./Inventory-Tracker` (if your repo has this structure)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`

4. **Add Environment Variables**:
   Click **"Environment Variables"** and add:
   ```
   DATABASE_URL=your_neon_database_url
   ASSEMBLYAI_API_KEY=your_assemblyai_key
   GEMINI_API_KEY=your_gemini_key
   NODE_ENV=production
   ```

5. **Deploy**:
   - Click **"Deploy"**
   - Wait for the build to complete (usually 2-3 minutes)

#### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   cd Inventory-Tracker
   vercel
   ```
   - Follow the prompts
   - Add environment variables when asked

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

### Step 3: Set Up Database

After deployment, you need to initialize your database:

1. **Run Database Migration**:
   - Go to your Vercel project dashboard
   - Click on **"Settings"** → **"Functions"**
   - Or use Vercel CLI:
     ```bash
     vercel env pull .env.production
     npm run db:push
     npm run db:seed
     ```

2. **Alternative: Use Vercel CLI**:
   ```bash
   vercel env pull
   npm run db:push
   npm run db:seed
   ```

### Step 4: Verify Deployment

1. **Check Your Deployment**:
   - Visit your deployment URL (e.g., `https://your-project.vercel.app`)
   - Test the application

2. **Check Logs**:
   - Go to Vercel Dashboard → Your Project → **"Deployments"** → Click on latest deployment → **"Logs"**
   - Look for any errors

## Important Notes

### ⚠️ Vercel Limitations

- **Serverless Functions**: Vercel uses serverless functions, which have execution time limits (10 seconds on Hobby plan, 60 seconds on Pro)
- **File Uploads**: Your voice upload feature should work, but large files may timeout
- **Database Connections**: Make sure your Neon database allows connections from Vercel's IPs

### 🔧 Troubleshooting

**Build Fails**:
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify build command is correct

**Database Connection Issues**:
- Verify `DATABASE_URL` is set correctly in environment variables
- Check Neon database allows external connections
- Ensure SSL is enabled (`?sslmode=require` in connection string)

**API Routes Not Working**:
- Check `vercel.json` configuration
- Verify routes are properly set up in `api/index.ts`

### 📝 Environment Variables Checklist

Make sure these are set in Vercel:
- ✅ `DATABASE_URL` - Your Neon database connection string
- ✅ `ASSEMBLYAI_API_KEY` - Your AssemblyAI API key
- ✅ `GEMINI_API_KEY` - Your Google Gemini API key
- ✅ `NODE_ENV` - Set to `production`

## Alternative: Consider Railway or Render

For a full-stack Express app like yours, you might also consider:
- **Railway** - Better for full-stack apps, easier database setup
- **Render** - Similar to Railway, good for Express apps

Both platforms are easier to set up for Express applications and don't have the same serverless limitations as Vercel.

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Deploy to Vercel
3. ✅ Set environment variables
4. ✅ Initialize database
5. ✅ Test your application
6. ✅ Share your deployed URL!

---

**Need Help?** Check Vercel's documentation: https://vercel.com/docs

