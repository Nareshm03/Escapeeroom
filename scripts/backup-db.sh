#!/bin/bash

BACKUP_DIR="/var/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)
MONGODB_URI="${MONGODB_URI}"

mkdir -p $BACKUP_DIR

echo "Starting MongoDB backup..."
mongodump --uri="$MONGODB_URI" --out="$BACKUP_DIR/backup_$DATE"

tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" "$BACKUP_DIR/backup_$DATE"
rm -rf "$BACKUP_DIR/backup_$DATE"

aws s3 cp "$BACKUP_DIR/backup_$DATE.tar.gz" s3://escape-room-backups/mongodb/

find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +30 -delete

echo "Backup completed: backup_$DATE.tar.gz"
