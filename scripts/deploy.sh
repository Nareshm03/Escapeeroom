#!/bin/bash
set -e

echo "🚀 Starting deployment..."

APP_DIR="/var/www/escape-room-backend"
BACKUP_DIR="/var/backups/app"
DATE=$(date +%Y%m%d_%H%M%S)

echo "📦 Creating backup..."
mkdir -p $BACKUP_DIR
cp -r $APP_DIR "$BACKUP_DIR/backup_$DATE"

echo "📥 Pulling latest code..."
cd $APP_DIR
git pull origin main

echo "📚 Installing dependencies..."
cd backend
npm install --production

if [ -f "scripts/migrate.js" ]; then
    echo "🔄 Running migrations..."
    node scripts/migrate.js
fi

echo "♻️  Reloading application..."
pm2 reload escape-room-api --update-env

echo "🏥 Running health check..."
sleep 5
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    echo "✅ Deployment successful!"
    cd $BACKUP_DIR
    ls -t | tail -n +6 | xargs -r rm -rf
else
    echo "❌ Health check failed! Rolling back..."
    pm2 restart escape-room-api
    exit 1
fi

echo "🎉 Deployment completed at $(date)"
