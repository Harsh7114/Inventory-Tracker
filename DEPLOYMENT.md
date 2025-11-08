# 🚀 Deployment Guide

This guide provides step-by-step instructions for deploying the Smart Grocery Inventory Tracker to various platforms.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Deployment Platforms](#deployment-platforms)
  - [Replit](#replit)
  - [Vercel](#vercel)
  - [Railway](#railway)
  - [Render](#render)
  - [Heroku](#heroku)
- [Database Setup](#database-setup)
- [Post-Deployment](#post-deployment)

## Prerequisites

Before deploying, ensure you have:
- [x] A PostgreSQL database instance
- [x] AssemblyAI API key
- [x] Google Gemini API key
- [x] Your code committed to a Git repository (GitHub, GitLab, etc.)

## Environment Variables

All deployment platforms will need these environment variables:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database
PGHOST=your_db_host
PGPORT=5432
PGUSER=your_db_user
PGPASSWORD=your_db_password
PGDATABASE=your_db_name

# API Keys
ASSEMBLYAI_API_KEY=your_assemblyai_key
GEMINI_API_KEY=your_gemini_key

# Application
NODE_ENV=production
PORT=5000
```

---

## Deployment Platforms

### Replit

**Best for**: Quick prototyping and development

1. **Import Project**
   - Go to [Replit](https://replit.com/)
   - Click "Import from GitHub"
   - Enter your repository URL

2. **Configure Environment**
   - Click on "Secrets" (lock icon) in the left sidebar
   - Add all required environment variables

3. **Set up Database**
   - Replit offers PostgreSQL database integration
   - In the Tools panel, add "PostgreSQL"
   - Database credentials will be automatically added to secrets

4. **Configure Run Command**
   - Set the run command to: `npm run dev`

5. **Deploy**
   - Click "Run" to start the application
   - For production, use Replit Deployments for custom domains and scaling

---

### Vercel

**Best for**: Frontend-focused deployments with serverless functions

1. **Install Vercel CLI** (optional)
   ```bash
   npm i -g vercel
   ```

2. **Configure for Vercel**
   - Create `vercel.json`:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist/public",
     "framework": "vite",
     "rewrites": [
       { "source": "/api/(.*)", "destination": "/api" }
     ]
   }
   ```

3. **Deploy via Dashboard**
   - Go to [Vercel](https://vercel.com/)
   - Click "New Project"
   - Import your Git repository
   - Add environment variables in project settings
   - Deploy!

4. **Database**
   - Use [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) or external provider
   - Add `DATABASE_URL` to environment variables

5. **Deploy via CLI** (alternative)
   ```bash
   vercel
   vercel --prod
   ```

---

### Railway

**Best for**: Full-stack applications with database included

1. **Sign Up**
   - Go to [Railway](https://railway.app/)
   - Connect your GitHub account

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add PostgreSQL**
   - In your project dashboard, click "+ New"
   - Select "Database" → "PostgreSQL"
   - Railway will automatically set `DATABASE_URL`

4. **Configure Environment Variables**
   - Click on your service
   - Go to "Variables" tab
   - Add all required environment variables
   - Railway auto-detects package.json scripts

5. **Configure Build**
   Railway will automatically detect and run:
   - Build: `npm run build`
   - Start: `npm run start`

6. **Deploy**
   - Click "Deploy"
   - Railway provides a public URL automatically

7. **Initialize Database**
   ```bash
   # Connect to Railway CLI
   railway login
   railway link
   
   # Run database setup
   railway run npm run db:push
   railway run npm run db:seed
   ```

---

### Render

**Best for**: Straightforward deployments with persistent storage

1. **Create Account**
   - Go to [Render](https://render.com/)
   - Connect your GitHub account

2. **Create Web Service**
   - Click "New +"
   - Select "Web Service"
   - Connect your repository

3. **Configure Service**
   - **Name**: your-app-name
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`

4. **Add PostgreSQL Database**
   - In dashboard, click "New +"
   - Select "PostgreSQL"
   - Copy the Internal Database URL

5. **Set Environment Variables**
   - In Web Service settings, go to "Environment"
   - Add all required environment variables
   - Use the PostgreSQL Internal URL for `DATABASE_URL`

6. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy

7. **Initialize Database**
   - Use Render's shell feature:
   ```bash
   npm run db:push
   npm run db:seed
   ```

---

### Heroku

**Best for**: Traditional PaaS deployment with add-ons

1. **Install Heroku CLI**
   ```bash
   brew install heroku/brew/heroku  # macOS
   # or visit https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login and Create App**
   ```bash
   heroku login
   heroku create your-app-name
   ```

3. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:essential-0
   ```

4. **Configure Environment Variables**
   ```bash
   heroku config:set ASSEMBLYAI_API_KEY=your_key
   heroku config:set GEMINI_API_KEY=your_key
   heroku config:set NODE_ENV=production
   ```

5. **Create `Procfile`**
   ```
   web: npm run start
   ```

6. **Deploy**
   ```bash
   git push heroku main
   ```

7. **Initialize Database**
   ```bash
   heroku run npm run db:push
   heroku run npm run db:seed
   ```

8. **Open Application**
   ```bash
   heroku open
   ```

---

## Database Setup

### External PostgreSQL Providers

If you're using an external database provider:

#### Supabase
1. Create project at [supabase.com](https://supabase.com/)
2. Go to Project Settings → Database
3. Copy the connection string
4. Use it as your `DATABASE_URL`

#### Neon
1. Create project at [neon.tech](https://neon.tech/)
2. Copy the connection string from dashboard
3. Use it as your `DATABASE_URL`

#### ElephantSQL
1. Create instance at [elephantsql.com](https://www.elephantsql.com/)
2. Copy the URL from details page
3. Use it as your `DATABASE_URL`

### Database Migrations

After deploying, run these commands to set up your database:

```bash
# Push schema to database
npm run db:push

# Seed database with initial data
npm run db:seed
```

---

## Post-Deployment

### 1. Verify Deployment

- Check that all environment variables are set correctly
- Test the application URL
- Verify database connection

### 2. Test Voice Feature

- Open the application
- Click the microphone button
- Test voice input: "Add 5 apples and 2 bottles of milk"
- Verify items are added to inventory

### 3. Monitor Logs

Most platforms provide log viewing:
- **Railway**: `railway logs`
- **Heroku**: `heroku logs --tail`
- **Render**: View logs in dashboard
- **Vercel**: View logs in deployment details

### 4. Set Up Custom Domain (Optional)

Most platforms support custom domains:
- Add your domain in platform settings
- Update DNS records as instructed
- Enable HTTPS (usually automatic)

### 5. Performance Optimization

- Enable caching headers for static assets
- Consider using a CDN for frontend assets
- Monitor database query performance
- Scale database as needed

---

## Troubleshooting

### Database Connection Issues

```bash
# Test database connection
psql $DATABASE_URL

# Verify tables exist
npm run db:studio
```

### Voice Feature Not Working

1. Verify API keys are set correctly
2. Check browser console for errors
3. Ensure microphone permissions are granted
4. Check server logs for API errors

### Build Failures

1. Clear build cache
2. Verify all dependencies are in `package.json`
3. Check Node.js version compatibility
4. Review build logs for specific errors

---

## Security Checklist

- [ ] All environment variables are set as secrets
- [ ] Database credentials are not in source code
- [ ] HTTPS is enabled
- [ ] CORS is properly configured
- [ ] API rate limiting is considered
- [ ] Error messages don't expose sensitive info

---

## Need Help?

- Check platform-specific documentation
- Open an issue on GitHub
- Review application logs

Happy deploying! 🚀
