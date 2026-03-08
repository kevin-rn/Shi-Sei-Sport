#!/usr/bin/env bash
#
# Backup script for Shi-Sei Sport
# Backs up PostgreSQL database and/or MinIO media storage.
# Keeps only the N most recent backups (default: 3).
#
# Usage:
#   ./scripts/backup.sh              # backup both db + minio
#   ./scripts/backup.sh db           # database only
#   ./scripts/backup.sh minio        # minio only
#   ./scripts/backup.sh --setup-cron # configure as a cron job
#
# Environment (reads from .env automatically):
#   BACKUP_DIR   – where to store backups (default: ./backups)
#   BACKUP_KEEP  – number of recent backups to keep (default: 3)

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

setup_cron() {
  echo ""
  echo "=== Cron job instellen ==="
  echo ""
  echo "Hoe vaak wilt u een automatische backup uitvoeren?"
  echo "  1) Dagelijks (elke dag om 3:00)"
  echo "  2) Wekelijks (elke zondag om 3:00)"
  echo "  3) Maandelijks (1e van de maand om 3:00)"
  echo "  4) Aangepast (voer zelf een cron-expressie in)"
  echo "  0) Annuleren"
  echo ""
  read -r -p "Keuze [0-4]: " choice </dev/tty

  local schedule
  case "$choice" in
    1) schedule="0 3 * * *" ;;
    2) schedule="0 3 * * 0" ;;
    3) schedule="0 3 1 * *" ;;
    4)
      read -r -p "Voer cron-expressie in (bijv. '0 3 * * 0'): " schedule </dev/tty
      ;;
    0|"")
      echo "Geannuleerd."
      return
      ;;
    *)
      echo "Ongeldige keuze. Geannuleerd."
      return
      ;;
  esac

  local log_file="/var/log/shisei-backup.log"
  local cron_cmd="$schedule cd $PROJECT_DIR && $SCRIPT_DIR/backup.sh >> $log_file 2>&1"

  echo ""
  echo "De volgende cron job wordt toegevoegd:"
  echo "  $cron_cmd"
  echo ""
  read -r -p "Bevestigen? [y/N] " confirm </dev/tty
  [[ "$confirm" =~ ^[Yy]$ ]] || { echo "Geannuleerd."; return; }

  # Add to crontab without duplicates
  ( crontab -l 2>/dev/null | grep -v "shisei.*backup\|backup.*shisei"; echo "$cron_cmd" ) | crontab -

  echo ""
  log "Cron job ingesteld: $cron_cmd"
  echo ""
  echo "Controleer met: crontab -l"
  echo "Logs worden geschreven naar: $log_file"
}

# ── Dispatch ────────────────────────────────────────────────────────────────
case "$TARGET" in
  db)
    backup_db
    ;;
  minio)
    backup_minio
    ;;
  --setup-cron)
    setup_cron
    exit 0
    ;;
  all)
    backup_db
    backup_minio
    ;;
  *)
    echo "Usage: $0 [db|minio|all|--setup-cron]" >&2
    exit 1
    ;;
esac

log "Backup finished."

# After a successful manual backup, offer to set up cron if not already configured
if [[ -t 1 ]] && ! crontab -l 2>/dev/null | grep -q "shisei.*backup\|backup.*shisei"; then
  echo ""
  read -r -p "Wilt u een automatische backup instellen als cron job? [y/N] " setup </dev/tty || true
  if [[ "$setup" =~ ^[Yy]$ ]]; then
    setup_cron
  fi
fi
