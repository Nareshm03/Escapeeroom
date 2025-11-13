# Deploy to Railway + Vercel + MongoDB Atlas

## Part 1: MongoDB Atlas Setup (5 minutes)

### Step 1: Create Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google/GitHub or email
3. Choose FREE tier (M0)

### Step 2: Create Cluster
1. Click "Build a Database"
2. Choose "M0 FREE" tier
3. Select region closest to you (e.g., AWS us-east-1)
4. Cluster name: `escape-cluster`
5. Click "Create"

### Step 3: Create Database User
1. Security → Database Access → Add New Database User
2. Username: `escape_user`
3. Password: Click "Autogenerate Secure Password" (SAVE THIS!)
4. Database User Privileges: "Read and write to any database"
5. Click "Add User"

### Step 4: Allow Network Access
1. Security → Network Access → Add IP Address
2. Click "Allow Access from Anywhere" (0.0.0.0/0)
3. Click "Confirm"

### Step 5: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Driver: Node.js, Version: 5.5 or later
4. Copy connection string:
```
mongodb+srv://escape_user:<password>@escape-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
5. Replace `<password>` with your saved password
6. Add database name: `escape-room-app`
```
mongodb+srv://escape_user:YOUR_PASSWORD@escape-cluster.xxxxx.mongodb.net/escape-room-app?retryWrites=true&w=majority
```

**SAVE THIS CONNECTION STRING!**

---

## Part 2: Deploy Backend to Railway (5 minutes)

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

### Step 2: Login to Railway
```bash
railway login
```
Browser will open → Click "Authorize"

### Step 3: Deploy Backend
```bash
cd backend

# Initialize Railway project
railway init
# Enter project name: escape-room-backend

# Link to project
railway link

# Set environment variables
railway variables set NODE_ENV=production
railway variables set PORT=5000
railway variables set MONGODB_URI="your-mongodb-connection-string-from-part1"

# Generate and set JWT secret
railway variables set JWT_SECRET=$(openssl rand -base64 32)

# Deploy
railway up
```

### Step 4: Get Backend URL
```bash
# Generate public domain
railway domain

# Your backend URL will be shown, example:
# escape-room-backend-production.up.railway.app
```

**SAVE THIS BACKEND URL!**

### Step 5: Test Backend
```bash
curl https://your-railway-url.up.railway.app/api/health
```

Should return:
```json
{"status":"OK","timestamp":"...","uptime":123,"database":"Connected"}
```

---

## Part 3: Deploy Frontend to Vercel (3 minutes)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```
Enter your email → Check email for verification link

### Step 3: Update Frontend Environment
```bash
cd ../frontend

# Create production environment file
echo REACT_APP_API_URL=https://your-railway-url.up.railway.app > .env.production
```

### Step 4: Deploy to Vercel
```bash
vercel

# Answer prompts:
# Set up and deploy? Y
# Which scope? (select your account)
# Link to existing project? N
# What's your project's name? escape-room-app
# In which directory is your code located? ./
# Want to override settings? N
```

### Step 5: Add Environment Variable
```bash
# Add production environment variable
vercel env add REACT_APP_API_URL production

# When prompted, enter:
https://your-railway-url.up.railway.app
```

### Step 6: Deploy to Production
```bash
vercel --prod
```

**Your app is now live!**

Vercel will show your URL:
```
https://escape-room-app-xxxxx.vercel.app
```

---

## Part 4: Initialize Database (2 minutes)

### Update setup-db.js
```bash
cd ..
node setup-db.js
```

This creates necessary indexes in MongoDB.

---

## Part 5: Test Your Live App

1. Open your Vercel URL in browser
2. Click "Register" → Create account
3. Login with your credentials
4. Create a team
5. Create a quiz
6. Test quiz functionality

---

## ✅ Deployment Complete!

**Your URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.up.railway.app`
- Database: MongoDB Atlas (managed)

**Cost:** $0/month (all free tiers)

---

## Troubleshooting

### Backend Issues

**Check logs:**
```bash
cd backend
railway logs
```

**Check variables:**
```bash
railway variables
```

**Redeploy:**
```bash
railway up
```

### Frontend Issues

**Check deployment:**
```bash
cd frontend
vercel logs
```

**Check environment:**
```bash
vercel env ls
```

**Redeploy:**
```bash
vercel --prod
```

### Database Issues

**Test connection:**
```bash
mongosh "your-mongodb-uri"
```

**Check IP whitelist:**
- MongoDB Atlas → Network Access
- Should have 0.0.0.0/0

**Check user permissions:**
- MongoDB Atlas → Database Access
- User should have "Read and write" access

### CORS Issues

If frontend can't connect to backend:

1. Check REACT_APP_API_URL is correct
2. Verify backend is running: `curl https://your-railway-url/api/health`
3. Check Railway logs for errors

---

## Enable Auto-Deploy from GitHub

### Railway (Backend)
1. Push code to GitHub
2. Railway dashboard → Settings → Connect GitHub
3. Select repository
4. Auto-deploys on every push to main

### Vercel (Frontend)
1. Vercel dashboard → Import Project
2. Select GitHub repository
3. Configure:
   - Framework: Create React App
   - Root Directory: `frontend`
   - Environment Variables: Add REACT_APP_API_URL
4. Auto-deploys on every push to main

---

## Add Custom Domain (Optional)

### Vercel (Frontend)
```bash
vercel domains add yourdomain.com
```
Then add DNS records shown by Vercel

### Railway (Backend)
1. Railway dashboard → Settings → Domains
2. Add custom domain: `api.yourdomain.com`
3. Add CNAME record to your DNS

---

## Monitor Your App

### Railway Monitoring
- Dashboard → Metrics (CPU, Memory, Network)
- Logs tab for real-time logs

### Vercel Analytics
- Dashboard → Analytics (Page views, performance)
- Logs tab for function logs

### Setup Uptime Monitoring
1. Go to https://uptimerobot.com (free)
2. Add monitors:
   - `https://your-railway-url/api/health`
   - `https://your-vercel-url`
3. Get alerts via email/SMS

---

## Quick Commands Reference

```bash
# Railway
railway logs              # View logs
railway status            # Check status
railway variables         # List env vars
railway up                # Deploy
railway open              # Open dashboard

# Vercel
vercel logs               # View logs
vercel ls                 # List deployments
vercel env ls             # List env vars
vercel --prod             # Deploy to production
vercel inspect            # Inspect deployment

# MongoDB
mongosh "your-uri"        # Connect to database
```

---

## Need Help?

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- MongoDB Docs: https://docs.mongodb.com/atlas
- Your app logs: `railway logs` and `vercel logs`
