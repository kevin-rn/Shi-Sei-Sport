#!/usr/bin/env bash
#
# Monthly backup script for Shi-Sei Sport
# Backs up PostgreSQL database and/or MinIO media storage.
# Keeps only the N most recent backups (default: 3).
#
# Usage:
#   ./scripts/backup.sh              # backup both db + minio
#   ./scripts/backup.sh db           # database only
#   ./scripts/backup.sh minio        # minio only
#
# Environment (reads from .env automatically):
#   BACKUP_DIR   – where to store backups (default: ./backups)
#   BACKUP_KEEP  – number of recent backups to keep (default: 3)
#
# Cron example (1st of every month at 3 AM):
#   0 3 1 * * cd /path/to/Shi-Sei-Sport && ./scripts/backup.sh >> /var/log/shisei-backup.log 2>&1

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
BACKUP_KEEP="${BACKUP_KEEP:-3}"
TIMESTAMP="$(date +%Y-%m-%d_%H%M%S)"
TARGET="${1:-all}"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

rotate() {
  local prefix="$1"
  local count
  count="$(find "$BACKUP_DIR" -maxdepth 1 -name "${prefix}_*.gz" -o -name "${prefix}_*.tar.gz" 2>/dev/null | wc -l)"
  if (( count > BACKUP_KEEP )); then
    local to_remove=$(( count - BACKUP_KEEP ))
    # shellcheck disable=SC2012
    ls -1t "$BACKUP_DIR"/${prefix}_*.gz "$BACKUP_DIR"/${prefix}_*.tar.gz 2>/dev/null \
      | tail -n "$to_remove" \
      | xargs rm -f
    log "Rotated $to_remove old ${prefix} backup(s), keeping $BACKUP_KEEP"
  fi
}

backup_db() {
  log "Starting PostgreSQL backup..."
  mkdir -p "$BACKUP_DIR"

  local outfile="$BACKUP_DIR/db_${TIMESTAMP}.sql.gz"

  docker exec judo_postgres pg_dump \
    -U "${DB_USER:-postgres}" \
    -d shisei_sport_db \
    --no-owner --no-acl \
    | gzip > "$outfile"

  local size
  size="$(du -h "$outfile" | cut -f1)"
  log "Database backup complete: $outfile ($size)"
  rotate "db"
}

backup_minio() {
  log "Starting MinIO backup..."
  mkdir -p "$BACKUP_DIR"

  local outfile="$BACKUP_DIR/minio_${TIMESTAMP}.tar.gz"

  tar -czf "$outfile" -C "$PROJECT_DIR/data" minio

  local size
  size="$(du -h "$outfile" | cut -f1)"
  log "MinIO backup complete: $outfile ($size)"
  rotate "minio"
}

case "$TARGET" in
  db)
    backup_db
    ;;
  minio)
    backup_minio
    ;;
  all)
    backup_db
    backup_minio
    ;;
  *)
    echo "Usage: $0 [db|minio|all]" >&2
    exit 1
    ;;
esac

log "Backup finished."
