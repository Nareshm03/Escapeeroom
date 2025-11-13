# Deploy Backend to Railway - Step by Step

## Method 1: Railway Dashboard (Easiest - No CLI)

### Step 1: Create Railway Account
1. Go to https://railway.app/
2. Click "Login" → Sign in with GitHub
3. Authorize Railway to access your GitHub

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Select your repository: `Escapeeroom`
4. Railway will detect your code

### Step 3: Configure Service
1. Click on the deployed service
2. Go to "Settings" tab
3. **Root Directory**: Set to `backend`
4. **Start Command**: `node src/server.js`

### Step 4: Add Environment Variables
1. Click "Variables" tab
2. Click "New Variable" and add each:

```
NODE_ENV=production
PORT=5000
JWT_SECRET=your-secret-here-min-32-chars
MONGODB_URI=your-mongodb-atlas-connection-string
```

**Generate JWT_SECRET:**
- Go to https://generate-secret.vercel.app/32
- Or use: `openssl rand -base64 32` in terminal

### Step 5: Generate Public Domain
1. Go to "Settings" tab
2. Scroll to "Networking"
3. Click "Generate Domain"
4. Copy your URL: `https://your-app.up.railway.app`

### Step 6: Deploy
1. Click "Deployments" tab
2. Click "Deploy" (or it auto-deploys)
3. Wait for build to complete (2-3 minutes)

### Step 7: Test Backend
Open in browser:
```
https://your-railway-url.up.railway.app/api/health
```

Should show:
```json
{"status":"OK","timestamp":"...","uptime":123,"database":"Connected"}
```

---

## Method 2: Railway CLI (For Developers)

### Step 1: Install Railway CLI

**Windows:**
```bash
npm install -g @railway/cli
```

**Mac/Linux:**
```bash
npm install -g @railway/cli
```

### Step 2: Login
```bash
railway login
```
Browser opens → Click "Authorize"

### Step 3: Initialize Project
```bash
cd backend
railway init
```
- Enter project name: `escape-room-backend`

### Step 4: Set Environment Variables
```bash
railway variables set NODE_ENV=production
railway variables set PORT=5000
railway variables set JWT_SECRET=$(openssl rand -base64 32)
railway variables set MONGODB_URI="your-mongodb-connection-string"
```

### Step 5: Deploy
```bash
railway up
```

### Step 6: Generate Domain
```bash
railway domain
```

Copy the URL shown.

### Step 7: Check Logs
```bash
railway logs
```

---

## MongoDB Connection String

Your MongoDB URI should look like:
```
mongodb+srv://escape_user:PASSWORD@cluster.mongodb.net/escape-room-app?retryWrites=true&w=majority
```

**Get it from MongoDB Atlas:**
1. Go to https://cloud.mongodb.com/
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Add database name: `escape-room-app`

---

## Troubleshooting

### Build Failed
**Check logs:**
- Dashboard: Deployments → Click failed deployment → View logs
- CLI: `railway logs`

**Common fixes:**
```bash
# Ensure package.json exists in backend folder
# Ensure start command is correct: node src/server.js
```

### Database Connection Failed
**Check:**
- MongoDB Atlas IP whitelist has `0.0.0.0/0`
- Connection string has correct password
- Database name is included in URI

**Test connection:**
```bash
mongosh "your-mongodb-uri"
```

### Port Issues
Railway automatically assigns PORT. Your code should use:
```javascript
const PORT = process.env.PORT || 5000;
```

### Environment Variables Not Working
**Dashboard method:**
- Variables tab → Verify all variables are set
- Redeploy after adding variables

**CLI method:**
```bash
railway variables
# Check if all variables are listed
```

---

## Quick Reference

### Railway CLI Commands
```bash
railway login           # Login to Railway
railway init            # Initialize project
railway link            # Link to existing project
railway up              # Deploy
railway logs            # View logs
railway status          # Check status
railway variables       # List variables
railway domain          # Generate/view domain
railway open            # Open dashboard
```

### Update Deployment
```bash
# After code changes
git add .
git commit -m "Update"
git push

# Railway auto-deploys from GitHub
# Or manually: railway up
```

---

## What's Next?

After Railway backend is deployed:

1. **Copy your Railway URL**
2. **Deploy frontend to Netlify** (see DEPLOY_NETLIFY.md)
3. **Set REACT_APP_API_URL** to your Railway URL
4. **Initialize database**: `node setup-db.js`
5. **Test your app!**

---

## Cost

- **Free Tier**: $5 credit/month (enough for small apps)
- **Hobby Plan**: $5/month (if you exceed free tier)
- **No credit card required** for free tier

---

## Support

- Railway Docs: https://docs.railway.app/
- Railway Discord: https://discord.gg/railway
- Check logs: `railway logs`
