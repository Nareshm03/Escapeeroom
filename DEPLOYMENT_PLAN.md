# Comprehensive Deployment Plan - Escape Room App

## 1. Server Requirements Specification

### Minimum Requirements (Small Scale: <1000 users)
- **CPU**: 2 vCPUs
- **RAM**: 2 GB
- **Storage**: 20 GB SSD
- **OS**: Ubuntu 22.04 LTS or Amazon Linux 2023
- **Network**: 100 Mbps bandwidth

### Recommended Requirements (Medium Scale: 1000-10000 users)
- **CPU**: 4 vCPUs
- **RAM**: 4 GB
- **Storage**: 50 GB SSD
- **OS**: Ubuntu 22.04 LTS
- **Network**: 1 Gbps bandwidth

### High Availability Setup (Large Scale: >10000 users)
- **Frontend**: 2+ instances (2 vCPUs, 2 GB RAM each)
- **Backend**: 2+ instances (4 vCPUs, 4 GB RAM each)
- **Database**: MongoDB Atlas M10+ cluster (3-node replica set)
- **Load Balancer**: Application Load Balancer
- **Storage**: 100 GB SSD per instance
- **CDN**: CloudFront or similar

---

## 2. Deployment Platform Selection

### Recommended: AWS (Best for scalability and control)

**Architecture:**
- **Frontend**: AWS Amplify or S3 + CloudFront
- **Backend**: AWS Elastic Beanstalk or EC2 + Auto Scaling
- **Database**: MongoDB Atlas (managed)
- **Load Balancer**: Application Load Balancer
- **SSL**: AWS Certificate Manager
- **DNS**: Route 53

**Monthly Cost Estimate:**
- Small: $50-100
- Medium: $200-400
- Large: $800-1500

### Alternative Options:

#### Option 2: Heroku (Easiest deployment)
- **Pros**: Simple setup, managed platform
- **Cons**: Higher cost, less control
- **Cost**: $25-200/month

#### Option 3: DigitalOcean (Cost-effective)
- **Pros**: Simple, affordable, good documentation
- **Cons**: Less managed services
- **Cost**: $24-100/month

#### Option 4: Vercel + Railway (Modern stack)
- **Frontend**: Vercel (free tier available)
- **Backend**: Railway or Render
- **Cost**: $0-50/month (small scale)

---

## 3. Step-by-Step Deployment Instructions

### Option A: AWS Deployment (Recommended)

#### 3.1 Prerequisites Setup

```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure AWS credentials
aws configure
# Enter: Access Key ID, Secret Access Key, Region (us-east-1), Output format (json)

# Install Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2
```

#### 3.2 Backend Deployment (EC2)

**Step 1: Launch EC2 Instance**

```bash
# Create security group
aws ec2 create-security-group \
  --group-name escape-room-backend \
  --description "Escape Room Backend Security Group"

# Add inbound rules
aws ec2 authorize-security-group-ingress \
  --group-name escape-room-backend \
  --protocol tcp --port 22 --cidr 0.0.0.0/0  # SSH
aws ec2 authorize-security-group-ingress \
  --group-name escape-room-backend \
  --protocol tcp --port 5000 --cidr 0.0.0.0/0  # API
aws ec2 authorize-security-group-ingress \
  --group-name escape-room-backend \
  --protocol tcp --port 443 --cidr 0.0.0.0/0  # HTTPS

# Launch instance (t3.small)
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.small \
  --key-name your-key-pair \
  --security-groups escape-room-backend \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=escape-room-backend}]'
```

**Step 2: Connect and Setup Server**

```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

**Step 3: Deploy Backend Code**

```bash
# Create application directory
sudo mkdir -p /var/www/escape-room-backend
sudo chown -R ubuntu:ubuntu /var/www/escape-room-backend
cd /var/www/escape-room-backend

# Clone repository (or upload via SCP)
git clone https://github.com/your-repo/escape-room-app.git .

# Install dependencies
cd backend
npm install --production

# Create production environment file
cat > .env << EOF
NODE_ENV=production
PORT=5000
JWT_SECRET=$(openssl rand -base64 32)
MONGODB_URI=mongodb+srv://escape_user:PASSWORD@cluster.mongodb.net/escape-room-app?retryWrites=true&w=majority
FRONTEND_URL=https://yourdomain.com
CORS_ORIGIN=https://yourdomain.com
EOF

# Start with PM2
pm2 start src/server.js --name escape-room-api
pm2 save
pm2 startup
```

**Step 4: Configure Nginx Reverse Proxy**

```bash
sudo nano /etc/nginx/sites-available/escape-room-api
```

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/escape-room-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL
sudo certbot --nginx -d api.yourdomain.com
```

#### 3.3 Frontend Deployment (S3 + CloudFront)

**Step 1: Build Frontend**

```bash
# On local machine
cd frontend

# Create production environment file
cat > .env.production << EOF
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_ENV=production
EOF

# Build
npm run build
```

**Step 2: Create S3 Bucket**

```bash
# Create bucket
aws s3 mb s3://escape-room-frontend --region us-east-1

# Enable static website hosting
aws s3 website s3://escape-room-frontend \
  --index-document index.html \
  --error-document index.html

# Upload build files
aws s3 sync build/ s3://escape-room-frontend --delete

# Set bucket policy for public read
cat > bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::escape-room-frontend/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy \
  --bucket escape-room-frontend \
  --policy file://bucket-policy.json
```

**Step 3: Setup CloudFront CDN**

```bash
# Create CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name escape-room-frontend.s3.amazonaws.com \
  --default-root-object index.html

# Note the distribution domain name (e.g., d111111abcdef8.cloudfront.net)
```

#### 3.4 Database Setup (MongoDB Atlas)

```bash
# Already configured, but ensure:
# 1. Network Access: Add EC2 IP or 0.0.0.0/0 (with caution)
# 2. Database User: Created with readWrite permissions
# 3. Connection String: Updated in backend .env

# Run database initialization
cd /var/www/escape-room-backend
node setup-db.js
```

#### 3.5 Security Configurations

**Firewall Setup (UFW)**

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

**Environment Variables Security**

```bash
# Restrict .env file permissions
chmod 600 /var/www/escape-room-backend/backend/.env

# Never commit .env to git
echo ".env" >> .gitignore
```

**MongoDB Atlas Security**

1. Enable IP Whitelist (add EC2 elastic IP)
2. Use strong passwords (32+ characters)
3. Enable encryption at rest
4. Enable audit logs
5. Regular backups (Point-in-Time Recovery)

**SSL/TLS Configuration**

```bash
# Auto-renewal setup (already done by certbot)
sudo certbot renew --dry-run

# Add to crontab for auto-renewal
sudo crontab -e
# Add: 0 0 * * 0 certbot renew --quiet
```

---

### Option B: Heroku Deployment (Quick Setup)

#### Backend Deployment

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Create app
cd backend
heroku create escape-room-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=$(openssl rand -base64 32)
heroku config:set MONGODB_URI="your-mongodb-uri"

# Create Procfile
echo "web: node src/server.js" > Procfile

# Deploy
git init
git add .
git commit -m "Initial deployment"
git push heroku main

# Scale
heroku ps:scale web=1
```

#### Frontend Deployment

```bash
# Option 1: Vercel
npm install -g vercel
cd frontend
vercel --prod

# Option 2: Netlify
npm install -g netlify-cli
cd frontend
npm run build
netlify deploy --prod --dir=build
```

---

## 4. CI/CD Pipeline Setup

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Test Backend
        run: |
          cd backend
          npm ci
          npm test
      
      - name: Test Frontend
        run: |
          cd frontend
          npm ci
          npm test -- --watchAll=false

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to EC2
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd /var/www/escape-room-backend
            git pull origin main
            cd backend
            npm install --production
            pm2 restart escape-room-api

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Build Frontend
        run: |
          cd frontend
          npm ci
          npm run build
        env:
          REACT_APP_API_URL: ${{ secrets.API_URL }}
      
      - name: Deploy to S3
        uses: jakejarvis/s3-sync-action@master
        with:
          args: --delete
        env:
          AWS_S3_BUCKET: escape-room-frontend
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          SOURCE_DIR: frontend/build
      
      - name: Invalidate CloudFront
        uses: chetan/invalidate-cloudfront-action@v2
        env:
          DISTRIBUTION: ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }}
          PATHS: '/*'
          AWS_REGION: us-east-1
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

### Required GitHub Secrets

```
EC2_HOST=your-ec2-ip
EC2_SSH_KEY=your-private-key
API_URL=https://api.yourdomain.com
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
CLOUDFRONT_DISTRIBUTION_ID=your-distribution-id
```

---

## 5. Monitoring and Logging Implementation

### Backend Monitoring with PM2

```bash
# Install PM2 monitoring
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# View logs
pm2 logs escape-room-api
pm2 monit
```

### Application Monitoring (AWS CloudWatch)

**Install CloudWatch Agent:**

```bash
# Download and install
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb

# Configure
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard
```

**CloudWatch Configuration** (`/opt/aws/amazon-cloudwatch-agent/etc/config.json`):

```json
{
  "metrics": {
    "namespace": "EscapeRoomApp",
    "metrics_collected": {
      "cpu": {
        "measurement": [{"name": "cpu_usage_idle"}],
        "totalcpu": false
      },
      "disk": {
        "measurement": [{"name": "used_percent"}],
        "resources": ["*"]
      },
      "mem": {
        "measurement": [{"name": "mem_used_percent"}]
      }
    }
  },
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/www/escape-room-backend/backend/logs/*.log",
            "log_group_name": "/aws/ec2/escape-room-backend",
            "log_stream_name": "{instance_id}"
          }
        ]
      }
    }
  }
}
```

### Enhanced Logging in Application

Create `backend/src/utils/logger.js`:

```javascript
const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logger = {
  info: (message, meta = {}) => {
    const log = { level: 'INFO', timestamp: new Date().toISOString(), message, ...meta };
    console.log(JSON.stringify(log));
    fs.appendFileSync(path.join(logDir, 'app.log'), JSON.stringify(log) + '\n');
  },
  error: (message, error = {}) => {
    const log = { level: 'ERROR', timestamp: new Date().toISOString(), message, error: error.message, stack: error.stack };
    console.error(JSON.stringify(log));
    fs.appendFileSync(path.join(logDir, 'error.log'), JSON.stringify(log) + '\n');
  },
  warn: (message, meta = {}) => {
    const log = { level: 'WARN', timestamp: new Date().toISOString(), message, ...meta };
    console.warn(JSON.stringify(log));
    fs.appendFileSync(path.join(logDir, 'app.log'), JSON.stringify(log) + '\n');
  }
};

module.exports = logger;
```

### Uptime Monitoring

**Setup UptimeRobot or Pingdom:**

1. Monitor: `https://api.yourdomain.com/health`
2. Monitor: `https://yourdomain.com`
3. Alert via: Email, SMS, Slack
4. Check interval: 5 minutes

**Health Check Endpoint** (`backend/src/routes/health.js`):

```javascript
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/health', async (req, res) => {
  const health = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  };
  
  try {
    res.status(200).json(health);
  } catch (error) {
    health.status = 'ERROR';
    res.status(503).json(health);
  }
});

module.exports = router;
```

---

## 6. Backup and Disaster Recovery

### MongoDB Atlas Automated Backups

**Configuration:**

1. Enable Continuous Backup (Point-in-Time Recovery)
2. Retention: 7 days minimum
3. Snapshot schedule: Daily at 2 AM UTC
4. Cross-region backup: Enable for critical data

**Manual Backup Script** (`scripts/backup-db.sh`):

```bash
#!/bin/bash

BACKUP_DIR="/var/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)
MONGODB_URI="your-mongodb-uri"

mkdir -p $BACKUP_DIR

# Backup using mongodump
mongodump --uri="$MONGODB_URI" --out="$BACKUP_DIR/backup_$DATE"

# Compress
tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" "$BACKUP_DIR/backup_$DATE"
rm -rf "$BACKUP_DIR/backup_$DATE"

# Upload to S3
aws s3 cp "$BACKUP_DIR/backup_$DATE.tar.gz" s3://escape-room-backups/mongodb/

# Keep only last 30 days locally
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +30 -delete

echo "Backup completed: backup_$DATE.tar.gz"
```

**Automate with Cron:**

```bash
sudo crontab -e
# Add: 0 2 * * * /var/www/escape-room-backend/scripts/backup-db.sh
```

### Application Code Backup

```bash
# Automated Git backup
#!/bin/bash
cd /var/www/escape-room-backend
git bundle create /var/backups/git/repo_$(date +%Y%m%d).bundle --all
aws s3 cp /var/backups/git/repo_$(date +%Y%m%d).bundle s3://escape-room-backups/git/
```

### Disaster Recovery Plan

**RTO (Recovery Time Objective):** 2 hours  
**RPO (Recovery Point Objective):** 24 hours

**Recovery Steps:**

1. **Database Recovery:**
   ```bash
   # Restore from Atlas snapshot (via UI)
   # Or restore from backup:
   mongorestore --uri="$MONGODB_URI" --drop /path/to/backup
   ```

2. **Application Recovery:**
   ```bash
   # Launch new EC2 instance
   # Deploy from Git
   git clone https://github.com/your-repo/escape-room-app.git
   cd escape-room-app/backend
   npm install --production
   pm2 start src/server.js
   ```

3. **DNS Failover:**
   - Update Route 53 records to new instance
   - TTL: 60 seconds for quick failover

---

## 7. Performance Optimization

### Backend Optimizations

**1. Enable Compression:**

Already included in `backend/package.json` (compression middleware)

**2. Database Indexing:**

```javascript
// In models, ensure indexes:
userSchema.index({ email: 1 });
teamSchema.index({ createdBy: 1 });
quizSchema.index({ teamId: 1, published: 1 });
```

**3. Caching with Redis (Optional):**

```bash
# Install Redis
sudo apt install redis-server

# Install node-redis
npm install redis
```

```javascript
// backend/src/utils/cache.js
const redis = require('redis');
const client = redis.createClient({ url: 'redis://localhost:6379' });

client.connect();

const cache = {
  get: async (key) => await client.get(key),
  set: async (key, value, ttl = 3600) => await client.setEx(key, ttl, JSON.stringify(value)),
  del: async (key) => await client.del(key)
};

module.exports = cache;
```

**4. PM2 Cluster Mode:**

```bash
pm2 start src/server.js -i max --name escape-room-api
```

### Frontend Optimizations

**1. Build Optimization:**

```json
// package.json - already optimized with production build
"build": "cross-env DISABLE_ESLINT_PLUGIN=true react-scripts build"
```

**2. CloudFront Caching:**

```bash
# Set cache behaviors:
# - Static assets (*.js, *.css, *.png): 1 year
# - HTML files: 5 minutes
# - API calls: No cache
```

**3. Image Optimization:**

```bash
# Install image optimization
npm install --save-dev imagemin imagemin-mozjpeg imagemin-pngquant
```

**4. Code Splitting:**

```javascript
// Already using React.lazy for route-based splitting
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
```

### Database Optimizations

**1. Connection Pooling:**

```javascript
// backend/src/utils/db.js
mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
});
```

**2. Query Optimization:**

```javascript
// Use lean() for read-only queries
const teams = await Team.find({ createdBy: userId }).lean();

// Use select() to limit fields
const users = await User.find().select('name email').lean();

// Use pagination
const quizzes = await Quiz.find()
  .skip((page - 1) * limit)
  .limit(limit);
```

---

## 8. Maintenance Schedule and Update Procedures

### Daily Tasks (Automated)

- **2:00 AM**: Database backup
- **3:00 AM**: Log rotation
- **4:00 AM**: Security scan
- **Continuous**: Uptime monitoring

### Weekly Tasks

**Every Monday:**
- Review error logs
- Check disk space usage
- Review CloudWatch metrics
- Update dependencies (security patches)

```bash
#!/bin/bash
# weekly-maintenance.sh

echo "=== Weekly Maintenance Report ===" > /tmp/maintenance.log

# Check disk space
df -h >> /tmp/maintenance.log

# Check memory
free -h >> /tmp/maintenance.log

# Check PM2 status
pm2 status >> /tmp/maintenance.log

# Check for updates
cd /var/www/escape-room-backend/backend
npm outdated >> /tmp/maintenance.log

# Email report
mail -s "Weekly Maintenance Report" admin@yourdomain.com < /tmp/maintenance.log
```

### Monthly Tasks

**First Sunday of Month:**
- Full security audit
- Performance review
- Backup restoration test
- SSL certificate check
- Dependency updates (major versions)

```bash
# Update dependencies
cd /var/www/escape-room-backend/backend
npm update
npm audit fix

# Restart services
pm2 restart all

# Test deployment
curl https://api.yourdomain.com/health
```

### Quarterly Tasks

- Disaster recovery drill
- Capacity planning review
- Cost optimization review
- Security penetration testing
- Database performance tuning

### Update Procedures

**Zero-Downtime Deployment:**

```bash
#!/bin/bash
# deploy.sh

set -e

echo "Starting deployment..."

# Pull latest code
cd /var/www/escape-room-backend
git pull origin main

# Install dependencies
cd backend
npm install --production

# Run database migrations (if any)
node scripts/migrate.js

# Reload PM2 (zero-downtime)
pm2 reload escape-room-api --update-env

# Health check
sleep 5
curl -f https://api.yourdomain.com/health || pm2 restart escape-room-api

echo "Deployment completed successfully!"
```

**Rollback Procedure:**

```bash
#!/bin/bash
# rollback.sh

echo "Rolling back to previous version..."

cd /var/www/escape-room-backend
git reset --hard HEAD~1
cd backend
npm install --production
pm2 restart escape-room-api

echo "Rollback completed!"
```

---

## 9. Security Checklist

- [ ] SSL/TLS certificates installed and auto-renewing
- [ ] Firewall configured (only ports 22, 80, 443 open)
- [ ] SSH key-based authentication (disable password auth)
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Strong JWT secret (32+ characters)
- [ ] Environment variables secured (chmod 600)
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Helmet.js security headers
- [ ] Regular security updates
- [ ] Backup encryption enabled
- [ ] Audit logging enabled

---

## 10. Cost Optimization

### AWS Cost Breakdown (Medium Scale)

| Service | Configuration | Monthly Cost |
|---------|--------------|--------------|
| EC2 (t3.small) | 2 instances | $30 |
| MongoDB Atlas | M10 cluster | $57 |
| S3 | 10 GB storage | $0.23 |
| CloudFront | 100 GB transfer | $8.50 |
| Route 53 | 1 hosted zone | $0.50 |
| Certificate Manager | SSL cert | Free |
| CloudWatch | Basic monitoring | $10 |
| **Total** | | **~$106/month** |

### Cost Optimization Tips

1. Use Reserved Instances (save 30-50%)
2. Enable S3 Intelligent-Tiering
3. Use CloudFront for static assets
4. Implement auto-scaling (scale down during low traffic)
5. Use spot instances for non-critical workloads
6. Monitor and delete unused resources

---

## 11. Quick Reference Commands

```bash
# Check application status
pm2 status
pm2 logs escape-room-api

# Restart application
pm2 restart escape-room-api

# View system resources
htop
df -h
free -h

# Check Nginx status
sudo systemctl status nginx
sudo nginx -t

# View logs
tail -f /var/www/escape-room-backend/backend/logs/app.log
tail -f /var/log/nginx/error.log

# Database connection test
mongosh "your-mongodb-uri"

# SSL certificate renewal
sudo certbot renew

# Deploy new version
cd /var/www/escape-room-backend && git pull && cd backend && npm install --production && pm2 restart escape-room-api
```

---

## 12. Support and Troubleshooting

### Common Issues

**Issue: Application not starting**
```bash
# Check logs
pm2 logs escape-room-api --lines 100

# Check environment variables
cat /var/www/escape-room-backend/backend/.env

# Test manually
cd /var/www/escape-room-backend/backend
node src/server.js
```

**Issue: Database connection failed**
```bash
# Test connection
mongosh "your-mongodb-uri"

# Check IP whitelist in MongoDB Atlas
# Verify credentials
```

**Issue: High memory usage**
```bash
# Check PM2 memory
pm2 monit

# Restart application
pm2 restart escape-room-api

# Consider upgrading instance
```

### Emergency Contacts

- **AWS Support**: https://console.aws.amazon.com/support
- **MongoDB Atlas Support**: https://support.mongodb.com
- **On-call Engineer**: [Your contact info]

---

## Conclusion

This deployment plan provides a comprehensive, production-ready setup for the Escape Room application. Follow the steps sequentially, test thoroughly at each stage, and maintain regular backups. For questions or issues, refer to the troubleshooting section or contact support.

**Estimated Setup Time:** 4-6 hours  
**Recommended Team:** 1 DevOps engineer + 1 Developer  
**Go-Live Checklist:** See section 9 (Security Checklist)
