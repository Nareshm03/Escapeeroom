# Production Deployment Checklist

## Pre-Deployment

### Environment Setup
- [ ] MongoDB Atlas cluster created and configured
- [ ] Strong JWT_SECRET generated (32+ characters)
- [ ] All environment variables set in `.env`
- [ ] Domain name registered and DNS configured
- [ ] SSL certificate obtained (Let's Encrypt or AWS ACM)

### Code Preparation
- [ ] All tests passing
- [ ] Production build tested locally
- [ ] Dependencies updated and audited (`npm audit`)
- [ ] No sensitive data in code or git history
- [ ] `.gitignore` properly configured

### Security
- [ ] CORS configured for production domain only
- [ ] Rate limiting enabled
- [ ] Helmet.js security headers configured
- [ ] MongoDB IP whitelist configured
- [ ] Strong database passwords set
- [ ] SSH key-based authentication enabled
- [ ] Firewall rules configured (ports 22, 80, 443 only)

## Deployment

### Backend
- [ ] Server provisioned (EC2/Heroku/DigitalOcean)
- [ ] Node.js 18+ installed
- [ ] PM2 installed and configured
- [ ] Nginx reverse proxy configured
- [ ] SSL certificate installed
- [ ] Application deployed and running
- [ ] Health check endpoint responding
- [ ] Logs directory created with proper permissions

### Frontend
- [ ] Production build created
- [ ] API URL configured correctly
- [ ] Static files deployed (S3/CDN/Nginx)
- [ ] CloudFront/CDN configured
- [ ] Cache headers set appropriately
- [ ] Gzip compression enabled

### Database
- [ ] Indexes created (`node setup-db.js`)
- [ ] Backup schedule configured
- [ ] Connection pooling configured
- [ ] Monitoring enabled

## Post-Deployment

### Testing
- [ ] Health check endpoint accessible
- [ ] User registration works
- [ ] User login works
- [ ] Team creation works
- [ ] Quiz creation works
- [ ] Quiz submission works
- [ ] All API endpoints responding
- [ ] Frontend loads correctly
- [ ] No console errors in browser

### Monitoring
- [ ] PM2 monitoring active
- [ ] CloudWatch/logging configured
- [ ] Uptime monitoring setup (UptimeRobot/Pingdom)
- [ ] Error alerting configured
- [ ] Log rotation configured

### Backup & Recovery
- [ ] Database backup tested
- [ ] Backup schedule automated (cron)
- [ ] Backup restoration tested
- [ ] Disaster recovery plan documented

### Performance
- [ ] Load testing completed
- [ ] Response times acceptable (<500ms)
- [ ] Database queries optimized
- [ ] CDN caching working
- [ ] Gzip compression verified

## Ongoing Maintenance

### Daily
- [ ] Monitor error logs
- [ ] Check uptime status
- [ ] Review CloudWatch metrics

### Weekly
- [ ] Review application logs
- [ ] Check disk space
- [ ] Update security patches
- [ ] Review backup status

### Monthly
- [ ] Full security audit
- [ ] Performance review
- [ ] Dependency updates
- [ ] Cost optimization review
- [ ] Backup restoration test

## Emergency Contacts

- DevOps Lead: _________________
- Database Admin: _________________
- AWS Support: https://console.aws.amazon.com/support
- MongoDB Support: https://support.mongodb.com

## Rollback Plan

If deployment fails:
```bash
cd /var/www/escape-room-backend
./scripts/rollback.sh
```

Or manual rollback:
```bash
git reset --hard HEAD~1
npm install --production
pm2 restart escape-room-api
```

## Success Criteria

- [ ] Application accessible at production URL
- [ ] All features working as expected
- [ ] No critical errors in logs
- [ ] Response times within acceptable range
- [ ] SSL certificate valid
- [ ] Monitoring and alerts active
- [ ] Backups running successfully
