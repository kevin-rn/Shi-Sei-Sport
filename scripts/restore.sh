#!/usr/bin/env bash
#
# Restore script for Shi-Sei Sport
# Restores PostgreSQL database and/or MinIO media storage from backup files.
#
# Usage:
#   ./scripts/restore.sh                          # restore latest of both db + minio
#   ./scripts/restore.sh db                       # latest database backup
#   ./scripts/restore.sh minio                    # latest minio backup
#   ./scripts/restore.sh db backups/db_2025-01-01_160807.sql.gz     # specific file
#   ./scripts/restore.sh minio backups/minio_2025-01-01_160807.tar.gz
#
# Environment (reads from .env automatically):
#   BACKUP_DIR  - where backups are stored (default: ./backups)
#   DB_USER     - PostgreSQL user (default: postgres)
#   DB_NAME     - PostgreSQL database name (default: shisei_sport_db)
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

# ── Colors & Symbols ───────────────────────────────────────────────────────

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
DIM='\033[2m'
BOLD='\033[1m'
NC='\033[0m'

OK="${GREEN}✓${NC}"
FAIL="${RED}✗${NC}"
WARN="${YELLOW}!${NC}"
ARROW="${CYAN}▸${NC}"

# ── Output helpers ─────────────────────────────────────────────────────────

banner() {
  echo ""
  echo -e "${RED} _____  _    _  _____       _____  ______  _____  ${NC}"
  echo -e "${RED}/ ____|| |  | ||_   _|     / ____||  ____||_   _| ${NC}"
  echo -e "${RED}| (___  | |__| |  | |      | (___  | |__     | |  ${NC}"
  echo -e "${RED} \___ \ |  __  |  | |       \___ \ |  __|    | |  ${NC}"
  echo -e "${RED} ____) || |  | | _| |_      ____) || |____  _| |_ ${NC}"
  echo -e "${RED}|_____/ |_|  |_||_____|    |_____/ |______||_____|${NC}"
  echo ""
  echo -e "${DIM}  Restore Toolkit${NC}"
  echo -e "${DIM}  $(date '+%Y-%m-%d %H:%M:%S')${NC}"
  echo ""
}

divider() {
  echo -e "${DIM}──────────────────────────────────────────────────${NC}"
}

header() {
  echo ""
  divider
  echo -e "  ${BOLD}${1}${NC}"
  divider
}

step() {
  echo -e "  ${ARROW} ${1}"
}

success() {
  echo -e "  ${OK} ${1}"
}

warn() {
  echo -e "  ${WARN} ${YELLOW}${1}${NC}"
}

fail() {
  echo -e "  ${FAIL} ${RED}${1}${NC}"
  exit 1
}

confirm() {
  local prompt="$1"
  echo ""
  read -r -p "  $prompt [y/N] " answer </dev/tty
  [[ "$answer" =~ ^[Yy]$ ]] || { echo ""; warn "Aborted."; exit 0; }
}

# ── Helpers ─────────────────────────────────────────────────────────────────

latest_db_backup() {
  find "$BACKUP_DIR" -maxdepth 1 -name "db_*.sql.gz" 2>/dev/null \
    | sort -r | head -n 1
}

latest_minio_backup() {
  find "$BACKUP_DIR" -maxdepth 1 -name "minio_*.tar.gz" 2>/dev/null \
    | sort -r | head -n 1
}

# ── Restore functions ──────────────────────────────────────────────────────

restore_db() {
  header "PostgreSQL Restore"

  local backupfile="${1:-}"

  if [[ -z "$backupfile" ]]; then
    backupfile="$(latest_db_backup)"
    [[ -n "$backupfile" ]] || fail "No database backup files found in $BACKUP_DIR"
  fi

  [[ -f "$backupfile" ]] || fail "Backup file not found: $backupfile"

  step "Selected: ${DIM}${backupfile}${NC}"
  confirm "This will DROP and recreate '${DB_NAME}'. Continue?"

  step "Stopping backend..."
  docker compose -f "$PROJECT_DIR/docker-compose.yml" stop backend || true

  step "Dropping and recreating database ${DIM}${DB_NAME}${NC}..."
  docker exec -i judo_postgres psql -U "$DB_USER" -d postgres \
    -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$DB_NAME' AND pid <> pg_backend_pid();" \
    -c "DROP DATABASE IF EXISTS $DB_NAME;" \
    -c "CREATE DATABASE $DB_NAME;"

  step "Restoring data..."
  gunzip -c "$backupfile" | docker exec -i judo_postgres psql \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    --set ON_ERROR_STOP=1

  step "Restarting backend..."
  docker compose -f "$PROJECT_DIR/docker-compose.yml" start backend

  echo ""
  success "Database restore complete"
}

restore_minio() {
  header "MinIO Restore"

  local backupfile="${1:-}"

  if [[ -z "$backupfile" ]]; then
    backupfile="$(latest_minio_backup)"
    [[ -n "$backupfile" ]] || fail "No MinIO backup files found in $BACKUP_DIR"
  fi

  [[ -f "$backupfile" ]] || fail "Backup file not found: $backupfile"

  step "Selected: ${DIM}${backupfile}${NC}"
  confirm "This will overwrite data/minio/. Continue?"

  step "Stopping minio and backend..."
  docker compose -f "$PROJECT_DIR/docker-compose.yml" stop backend minio || true

  step "Extracting backup..."
  sudo tar -xzf "$backupfile" -C "$PROJECT_DIR/data/"

  step "Restarting minio and backend..."
  docker compose -f "$PROJECT_DIR/docker-compose.yml" start minio backend

  echo ""
  success "MinIO restore complete"
}

# ── Menu ────────────────────────────────────────────────────────────────────

show_menu() {
  banner
  echo -e "  ${BOLD}Usage:${NC} bash restore.sh ${CYAN}[option] [file]${NC}"
  echo ""
  echo -e "  ${GREEN}db${NC}           Restore latest PostgreSQL backup"
  echo -e "  ${GREEN}minio${NC}        Restore latest MinIO backup"
  echo -e "  ${GREEN}all${NC}          Restore both ${DIM}(default)${NC}"
  echo ""
  echo -e "  ${DIM}Optionally pass a specific backup file as second argument${NC}"
  echo ""
  divider
  echo ""
}

# ── Main ────────────────────────────────────────────────────────────────────

case "$TARGET" in
  db)
    banner
    restore_db "$SPECIFIC_FILE"
    ;;
  minio)
    banner
    restore_minio "$SPECIFIC_FILE"
    ;;
  all)
    banner
    restore_db ""
    restore_minio ""
    header "Complete"
    echo ""
    success "All restores finished"
    echo ""
    ;;
  *)
    show_menu
    exit 0
    ;;
esac
