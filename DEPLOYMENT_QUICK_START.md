# Deployment Quick Start Guide

## 🚀 Fastest Path to Production

### Option 1: Heroku (5 minutes)

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Deploy Backend
cd backend
heroku create your-app-name-api
heroku config:set JWT_SECRET=$(openssl rand -base64 32)
heroku config:set MONGODB_URI="your-mongodb-atlas-uri"
echo "web: node src/server.js" > Procfile
git init && git add . && git commit -m "Deploy"
git push heroku main

# Deploy Frontend (Vercel)
cd ../frontend
npm install -g vercel
vercel --prod
# Set REACT_APP_API_URL to your Heroku backend URL
```

**Total Cost:** $7-25/month

---

### Option 2: AWS (30 minutes)

```bash
# 1. Launch EC2 instance (t3.small)
# 2. SSH and setup
ssh -i key.pem ubuntu@your-ip
sudo apt update && sudo apt install -y nodejs npm nginx
sudo npm install -g pm2

# 3. Deploy backend
git clone your-repo
cd backend
npm install --production
pm2 start src/server.js --name api
pm2 startup && pm2 save

# 4. Setup Nginx
sudo nano /etc/nginx/sites-available/default
# Add reverse proxy config
sudo systemctl restart nginx

# 5. Deploy frontend to S3
cd ../frontend
npm run build
aws s3 sync build/ s3://your-bucket --delete
```

**Total Cost:** $30-100/month

---

### Option 3: Docker (15 minutes)

```bash
# 1. Create .env file
cp .env.production.example .env
# Edit with your values

# 2. Build and run
docker-compose up -d

# 3. Setup SSL with Let's Encrypt
docker exec -it nginx certbot --nginx -d yourdomain.com
```

**Total Cost:** VPS cost ($5-20/month)

---

## 📋 Pre-Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Environment variables configured
- [ ] Domain name registered (optional)
- [ ] SSL certificate ready (Let's Encrypt free)
- [ ] Git repository accessible
- [ ] Backup strategy planned

---

## 🔧 Essential Commands

```bash
# Check status
pm2 status
pm2 logs

# Restart
pm2 restart all

# Deploy update
git pull && npm install && pm2 reload all

# Rollback
git reset --hard HEAD~1 && pm2 restart all
```

---

## 🆘 Troubleshooting

**App won't start:**
```bash
pm2 logs --lines 50
```

**Database connection failed:**
- Check MongoDB Atlas IP whitelist
- Verify connection string
- Test: `mongosh "your-uri"`

**502 Bad Gateway:**
- Check if backend is running: `pm2 status`
- Check Nginx config: `sudo nginx -t`
- Restart: `pm2 restart all && sudo systemctl restart nginx`

---

## 📚 Full Documentation

See [DEPLOYMENT_PLAN.md](DEPLOYMENT_PLAN.md) for comprehensive guide.
