#!/bin/bash
set -e

echo "⚠️  Rolling back to previous version..."

APP_DIR="/var/www/escape-room-backend"

cd $APP_DIR
git reset --hard HEAD~1

cd backend
npm install --production

pm2 restart escape-room-api

sleep 5
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    echo "✅ Rollback completed successfully!"
else
    echo "❌ Rollback failed! Manual intervention required."
    exit 1
fi
