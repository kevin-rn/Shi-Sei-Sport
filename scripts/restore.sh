#!/usr/bin/env bash
#
# Restore script for Shi-Sei Sport
# Restores PostgreSQL database and/or MinIO media storage from backup files.
#
# Usage:
#   ./scripts/restore.sh                          # restore latest of both db + minio
#   ./scripts/restore.sh db                       # latest database backup
#   ./scripts/restore.sh minio                    # latest minio backup
#   ./scripts/restore.sh db backups/db_2025-01-01_030000.sql.gz     # specific file
#   ./scripts/restore.sh minio backups/minio_2025-01-01_030000.tar.gz
#
# Environment (reads from .env automatically):
#   BACKUP_DIR  – where backups are stored (default: ./backups)
#   DB_USER     – PostgreSQL user (default: postgres)
#   DB_NAME     – PostgreSQL database name (default: shisei_sport_db)
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Load .env if present
if [[ -f "$PROJECT_DIR/.env" ]]; then
  set -a
  # shellcheck source=/dev/null
  source "$PROJECT_DIR/.env"
  set +a
fi

BACKUP_DIR="${BACKUP_DIR:-$PROJECT_DIR/backups}"
DB_USER="${DB_USER:-postgres}"
DB_NAME="${DB_NAME:-shisei_sport_db}"
TARGET="${1:-all}"
SPECIFIC_FILE="${2:-}"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

err() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $*" >&2; exit 1; }

confirm() {
  local prompt="$1"
  read -r -p "$prompt [y/N] " answer
  [[ "$answer" =~ ^[Yy]$ ]] || { log "Aborted."; exit 0; }
}

latest_backup() {
  local prefix="$1"
  # Find the most recent backup file for this prefix
  ls -1t "$BACKUP_DIR"/${prefix}_*.gz "$BACKUP_DIR"/${prefix}_*.tar.gz 2>/dev/null \
    | head -n 1
}

restore_db() {
  local backupfile="${1:-}"

  if [[ -z "$backupfile" ]]; then
    backupfile="$(latest_backup db)"
    [[ -n "$backupfile" ]] || err "No database backup files found in $BACKUP_DIR"
  fi

  [[ -f "$backupfile" ]] || err "Backup file not found: $backupfile"

  log "Selected DB backup: $backupfile"
  confirm "This will DROP and recreate '$DB_NAME'. Continue?"

  log "Dropping and recreating database '$DB_NAME'..."
  docker exec -i judo_postgres psql -U "$DB_USER" -d postgres \
    -c "DROP DATABASE IF EXISTS $DB_NAME;" \
    -c "CREATE DATABASE $DB_NAME;"

  log "Restoring data from $backupfile..."
  gunzip -c "$backupfile" | docker exec -i judo_postgres psql \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    --set ON_ERROR_STOP=1

  log "Database restore complete."
}

restore_minio() {
  local backupfile="${1:-}"

  if [[ -z "$backupfile" ]]; then
    backupfile="$(latest_backup minio)"
    [[ -n "$backupfile" ]] || err "No MinIO backup files found in $BACKUP_DIR"
  fi

  [[ -f "$backupfile" ]] || err "Backup file not found: $backupfile"

  log "Selected MinIO backup: $backupfile"
  confirm "This will overwrite data/minio/. Continue?"

  log "Stopping Docker stack..."
  docker compose -f "$PROJECT_DIR/docker-compose.yml" down

  log "Extracting $backupfile into $PROJECT_DIR/data/..."
  tar -xzf "$backupfile" -C "$PROJECT_DIR/data/"

  log "Restarting Docker stack..."
  docker compose -f "$PROJECT_DIR/docker-compose.yml" up -d

  log "MinIO restore complete."
}

# ── Dispatch ────────────────────────────────────────────────────────────────
case "$TARGET" in
  db)
    restore_db "$SPECIFIC_FILE"
    ;;
  minio)
    restore_minio "$SPECIFIC_FILE"
    ;;
  all)
    restore_db ""
    restore_minio ""
    ;;
  *)
    echo "Usage: $0 [db|minio|all] [optional-backup-file]" >&2
    exit 1
    ;;
esac

log "Restore finished."
