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
#   BACKUP_DIR   - where to store backups (default: ./backups)
#   BACKUP_KEEP  - number of recent backups to keep (default: 3)

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
  echo -e "${DIM}  Backup Toolkit${NC}"
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
}

# ── Helpers ─────────────────────────────────────────────────────────────────

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
    step "Rotated ${DIM}$to_remove${NC} old ${prefix} backup(s), keeping ${DIM}$BACKUP_KEEP${NC}"
  fi
}

# ── Backup functions ───────────────────────────────────────────────────────

backup_db() {
  header "PostgreSQL Backup"

  mkdir -p "$BACKUP_DIR"
  local outfile="$BACKUP_DIR/db_${TIMESTAMP}.sql.gz"

  step "Dumping database..."
  docker exec judo_postgres pg_dump \
    -U "${DB_USER:-postgres}" \
    -d shisei_sport_db \
    --no-owner --no-acl \
    | gzip > "$outfile"

  local size
  size="$(du -h "$outfile" | cut -f1)"

  echo ""
  success "Database backup complete"
  success "File                     ${DIM}${outfile}${NC}"
  success "Size                     ${DIM}${size}${NC}"

  rotate "db"
}

backup_minio() {
  header "MinIO Backup"

  mkdir -p "$BACKUP_DIR"
  local outfile="$BACKUP_DIR/minio_${TIMESTAMP}.tar.gz"

  step "Archiving media storage..."
  tar -czf "$outfile" -C "$PROJECT_DIR/data" minio

  local size
  size="$(du -h "$outfile" | cut -f1)"

  echo ""
  success "MinIO backup complete"
  success "File                     ${DIM}${outfile}${NC}"
  success "Size                     ${DIM}${size}${NC}"

  rotate "minio"
}

# ── Cron setup ──────────────────────────────────────────────────────────────

setup_cron() {
  header "Cron Job Setup"

  echo ""
  echo -e "  ${BOLD}Hoe vaak wilt u een automatische backup uitvoeren?${NC}"
  echo ""
  echo -e "  ${GREEN}1${NC}  Dagelijks    ${DIM}(elke dag om 3:00)${NC}"
  echo -e "  ${GREEN}2${NC}  Wekelijks    ${DIM}(elke zondag om 3:00)${NC}"
  echo -e "  ${GREEN}3${NC}  Maandelijks  ${DIM}(1e van de maand om 3:00)${NC}"
  echo -e "  ${GREEN}4${NC}  Aangepast    ${DIM}(voer zelf een cron-expressie in)${NC}"
  echo -e "  ${YELLOW}0${NC}  Annuleren"
  echo ""
  divider
  echo ""
  read -r -p "  Keuze [0-4]: " choice </dev/tty

  local schedule
  case "$choice" in
    1) schedule="0 3 * * *" ;;
    2) schedule="0 3 * * 0" ;;
    3) schedule="0 3 1 * *" ;;
    4)
      read -r -p "  Voer cron-expressie in (bijv. '0 3 * * 0'): " schedule </dev/tty
      ;;
    0|"")
      echo ""
      warn "Geannuleerd."
      return
      ;;
    *)
      echo ""
      fail "Ongeldige keuze. Geannuleerd."
      return
      ;;
  esac

  local log_file="/var/log/shisei-backup.log"
  local cron_cmd="$schedule cd $PROJECT_DIR && $SCRIPT_DIR/backup.sh >> $log_file 2>&1"

  echo ""
  step "De volgende cron job wordt toegevoegd:"
  echo -e "    ${CYAN}${cron_cmd}${NC}"
  echo ""
  read -r -p "  Bevestigen? [y/N] " confirm </dev/tty
  [[ "$confirm" =~ ^[Yy]$ ]] || { echo ""; warn "Geannuleerd."; return; }

  # Add to crontab without duplicates
  ( crontab -l 2>/dev/null | grep -v "shisei.*backup\|backup.*shisei"; echo "$cron_cmd" ) | crontab -

  echo ""
  success "Cron job ingesteld"
  success "Schedule                 ${DIM}${cron_cmd}${NC}"
  echo ""
  step "Controleer met: ${CYAN}crontab -l${NC}"
  step "Logs: ${DIM}${log_file}${NC}"
}

# ── Menu ────────────────────────────────────────────────────────────────────

show_menu() {
  banner
  echo -e "  ${BOLD}Usage:${NC} bash backup.sh ${CYAN}[option]${NC}"
  echo ""
  echo -e "  ${GREEN}db${NC}           Backup PostgreSQL database"
  echo -e "  ${GREEN}minio${NC}        Backup MinIO media storage"
  echo -e "  ${GREEN}all${NC}          Backup both ${DIM}(default)${NC}"
  echo -e "  ${YELLOW}--setup-cron${NC} Configure as a cron job"
  echo ""
  divider
  echo ""
}

# ── Main ────────────────────────────────────────────────────────────────────

case "$TARGET" in
  db)
    banner
    backup_db
    ;;
  minio)
    banner
    backup_minio
    ;;
  --setup-cron)
    banner
    setup_cron
    exit 0
    ;;
  all)
    banner
    backup_db
    backup_minio
    header "Complete"
    echo ""
    success "All backups finished"
    echo ""
    ;;
  *)
    show_menu
    exit 0
    ;;
esac

# After a successful manual backup, offer to set up cron if not already configured
if [[ -t 1 ]] && ! crontab -l 2>/dev/null | grep -q "shisei.*backup\|backup.*shisei"; then
  echo ""
  read -r -p "  Wilt u een automatische backup instellen als cron job? [y/N] " setup </dev/tty || true
  if [[ "$setup" =~ ^[Yy]$ ]]; then
    setup_cron
  fi
fi
