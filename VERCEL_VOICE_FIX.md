# 🔧 Vercel Voice Feature Fix

## Issues Fixed

1. **Environment Variable Access**: Changed API clients to lazy initialization so environment variables are loaded correctly in Vercel's serverless environment
2. **File Upload Size**: Increased body size limit to 10MB for audio file uploads
3. **Execution Time**: Added `maxDuration: 60` seconds for voice processing function
4. **Error Handling**: Added better error messages and logging
5. **Health Check**: Added `/api/health` endpoint to verify environment variables

## Changes Made

### 1. `server/voice.ts`
- Changed from module-level initialization to lazy initialization
- API clients now check for environment variables at runtime

### 2. `server/routes.ts`
- Added `/api/health` endpoint to check environment variables
- Added validation checks before processing voice input
- Added better error messages

### 3. `api/index.ts`
- Increased body size limit to 10MB for file uploads

### 4. `vercel.json`
- Added `maxDuration: 60` for voice processing function

## Next Steps

### 1. Commit and Push Changes
```bash
git add .
git commit -m "Fix voice feature for Vercel deployment"
git push origin main
```

### 2. Verify Environment Variables in Vercel

Go to your Vercel project → Settings → Environment Variables and verify:

- ✅ `DATABASE_URL` - Your Neon database URL
- ✅ `ASSEMBLYAI_API_KEY` - Your AssemblyAI API key
- ✅ `GEMINI_API_KEY` - Your Google Gemini API key
- ✅ `NODE_ENV` - Set to `production`

**Important**: After adding/updating environment variables, you MUST redeploy!

### 3. Test Health Endpoint

After redeploying, test the health endpoint:
```
https://your-app.vercel.app/api/health
```

You should see:
```json
{
  "status": "ok",
  "hasAssemblyAI": true,
  "hasGemini": true,
  "hasDatabase": true,
  "nodeEnv": "production"
}
```

If any of these are `false`, the environment variable is not set correctly.

### 4. Check Vercel Logs

If the voice feature still doesn't work:
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the latest deployment
3. Click "Logs"
4. Look for errors related to:
   - API key missing
   - File upload issues
   - Timeout errors

### 5. Common Issues

**Issue**: Health check shows `hasAssemblyAI: false` or `hasGemini: false`
- **Solution**: Make sure environment variables are set in Vercel and you've redeployed

**Issue**: "Request entity too large" error
- **Solution**: The 10MB limit should be enough, but check Vercel's plan limits

**Issue**: Timeout errors
- **Solution**: Voice processing can take time. The 60-second limit should help, but check Vercel's plan limits (Hobby plan has 10-second limit)

**Issue**: CORS errors
- **Solution**: Make sure the frontend is making requests to the correct domain

## Testing Locally

Before deploying, test locally:
```bash
npm run dev
```

Then test the health endpoint:
```
http://localhost:5000/api/health
```

## Deployment Checklist

- [ ] Committed and pushed all changes
- [ ] Environment variables set in Vercel
- [ ] Redeployed after setting environment variables
- [ ] Tested `/api/health` endpoint
- [ ] Checked Vercel logs for errors
- [ ] Tested voice feature on deployed site

## Need More Help?

If the issue persists:
1. Check Vercel logs for specific error messages
2. Test the `/api/health` endpoint
3. Verify environment variables are set correctly
4. Check Vercel's serverless function limits for your plan

