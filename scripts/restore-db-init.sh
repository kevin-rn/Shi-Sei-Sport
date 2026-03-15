#!/bin/bash
#
# PostgreSQL docker-entrypoint-initdb.d script
# Automatically restores from the latest database backup on first boot.
# This script only runs when the data directory is empty (fresh container).
#
set -e

BACKUP_DIR="/backups"

# ── Colors & Symbols ───────────────────────────────────────────────────────

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
DIM='\033[2m'
NC='\033[0m'

OK="${GREEN}✓${NC}"
WARN="${YELLOW}!${NC}"
ARROW="${CYAN}▸${NC}"

# ── Output helpers ─────────────────────────────────────────────────────────

step()    { echo -e "  ${ARROW} ${1}"; }
success() { echo -e "  ${OK} ${1}"; }
warn()    { echo -e "  ${WARN} ${YELLOW}${1}${NC}"; }

# ── Restore ────────────────────────────────────────────────────────────────

# Find the latest database backup
latest_backup=$(find "$BACKUP_DIR" -maxdepth 1 -name "db_*.sql.gz" 2>/dev/null | sort -r | head -n 1)

if [ -z "$latest_backup" ]; then
  warn "No database backup found in $BACKUP_DIR, starting fresh."
  exit 0
fi

step "Found backup: ${DIM}${latest_backup}${NC}"
step "Restoring into database ${DIM}${POSTGRES_DB}${NC}..."

gunzip -c "$latest_backup" | psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" --set ON_ERROR_STOP=1

# Signal to backend that DB was restored from backup (skip seeding)
touch "$BACKUP_DIR/.db-restored"

success "Database restore complete"
