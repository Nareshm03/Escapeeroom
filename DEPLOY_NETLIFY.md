# Deploy to Netlify + Railway

## Overview
- **Frontend**: Netlify (free)
- **Backend**: Railway (free tier)
- **Database**: MongoDB Atlas (free)

---

## Step 1: MongoDB Atlas (5 min)

1. Go to https://cloud.mongodb.com/
2. Create FREE M0 cluster
3. Create user: `escape_user` with strong password
4. Network Access → Add `0.0.0.0/0`
5. Copy connection string:
```
mongodb+srv://escape_user:PASSWORD@cluster.mongodb.net/escape-room-app
```

---

## Step 2: Deploy Backend to Railway (3 min)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy backend
cd backend
railway init
railway variables set NODE_ENV=production
railway variables set PORT=5000
railway variables set MONGODB_URI="your-mongodb-uri"
railway variables set JWT_SECRET=$(openssl rand -base64 32)
railway up

# Get backend URL
railway domain
```

**Save your Railway URL!** (e.g., `https://your-app.up.railway.app`)

---

## Step 3: Deploy Frontend to Netlify

### Option A: Netlify CLI (Fastest)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build frontend
cd ../frontend
npm install
npm run build

# Deploy
netlify deploy --prod

# When prompted:
# - Create & configure a new site? Yes
# - Team: (select your team)
# - Site name: escape-room-app
# - Publish directory: build

# Set environment variable
netlify env:set REACT_APP_API_URL https://your-railway-url.up.railway.app
```

### Option B: Netlify Dashboard (Easiest)

1. Go to https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Select your repository: `Escapeeroom`
5. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
6. Click "Add environment variables":
   - Key: `REACT_APP_API_URL`
   - Value: `https://your-railway-url.up.railway.app`
7. Click "Deploy site"

---

## Step 4: Configure Build Settings

Create `netlify.toml` in root:

```toml
[build]
  base = "frontend"
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

---

## Step 5: Initialize Database

```bash
cd ..
node setup-db.js
```

---

## Step 6: Test Your App

1. Open your Netlify URL (shown after deployment)
2. Register → Login → Create Team → Create Quiz
3. Test all features

---

## ✅ Done!

**Your URLs:**
- Frontend: `https://your-app.netlify.app`
- Backend: `https://your-backend.up.railway.app`

**Cost:** $0/month (all free tiers)

---

## Enable Auto-Deploy

### Netlify
Already enabled! Every push to `main` branch auto-deploys.

### Railway
```bash
# Connect GitHub repo
railway link
# Select your repository
# Auto-deploys on every push
```

---

## Custom Domain (Optional)

### Netlify
1. Domain settings → Add custom domain
2. Follow DNS instructions
3. SSL auto-enabled

---

## Troubleshooting

**Build fails on Netlify:**
```bash
# Check build logs in Netlify dashboard
# Common fix: Update build command
npm run build
```

**Frontend can't connect to backend:**
```bash
# Verify environment variable
netlify env:list

# Update if needed
netlify env:set REACT_APP_API_URL https://correct-railway-url.up.railway.app

# Redeploy
netlify deploy --prod
```

**CORS errors:**
Backend needs to allow Netlify domain. Update backend CORS if needed.

---

## Quick Commands

```bash
# Netlify
netlify status          # Check deployment status
netlify open            # Open site in browser
netlify logs            # View logs
netlify deploy --prod   # Manual deploy

# Railway
railway logs            # View backend logs
railway status          # Check status
railway open            # Open dashboard
```

---

## Monitor Your App

- **Netlify**: Dashboard → Analytics
- **Railway**: Dashboard → Metrics
- **Uptime**: Use https://uptimerobot.com (free)
