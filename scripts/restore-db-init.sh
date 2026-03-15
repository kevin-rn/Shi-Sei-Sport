#!/bin/bash
#
# PostgreSQL docker-entrypoint-initdb.d script
# Automatically restores from the latest database backup on first boot.
# This script only runs when the data directory is empty (fresh container).
#
set -e

BACKUP_DIR="/backups"

# Find the latest database backup
latest_backup=$(find "$BACKUP_DIR" -maxdepth 1 -name "db_*.sql.gz" 2>/dev/null | sort -r | head -n 1)

if [ -z "$latest_backup" ]; then
  echo "[restore-db-init] No database backup found in $BACKUP_DIR, starting fresh."
  exit 0
fi

echo "[restore-db-init] Found backup: $latest_backup"
echo "[restore-db-init] Restoring into database '$POSTGRES_DB'..."

gunzip -c "$latest_backup" | psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" --set ON_ERROR_STOP=1

# Signal to backend that DB was restored from backup (skip seeding)
touch "$BACKUP_DIR/.db-restored"

echo "[restore-db-init] Database restore complete."
