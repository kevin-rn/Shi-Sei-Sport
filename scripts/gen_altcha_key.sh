#!/bin/bash
#
# Generate ALTCHA HMAC key from a passphrase
# Usage: ./scripts/gen_altcha_key.sh <your_passphrase>
#
set -euo pipefail

# ── Colors & Symbols ───────────────────────────────────────────────────────

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
DIM='\033[2m'
BOLD='\033[1m'
NC='\033[0m'

OK="${GREEN}✓${NC}"
FAIL="${RED}✗${NC}"
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
  echo -e "${DIM}  ALTCHA Key Generator${NC}"
  echo ""
}

divider() {
  echo -e "${DIM}──────────────────────────────────────────────────${NC}"
}

step() {
  echo -e "  ${ARROW} ${1}"
}

success() {
  echo -e "  ${OK} ${1}"
}

fail() {
  echo -e "  ${FAIL} ${RED}${1}${NC}"
}

# ── Main ────────────────────────────────────────────────────────────────────

banner

if [ -z "${1:-}" ]; then
  echo -e "  ${BOLD}Usage:${NC} bash gen_altcha_key.sh ${CYAN}<passphrase>${NC}"
  echo ""
  divider
  echo ""
  fail "No passphrase provided."
  echo ""
  exit 1
fi

# Generate a SHA-256 hex key from the input string
# We use printf to ensure no trailing newline character is added to the hash
key=$(printf "%s" "$1" | openssl dgst -sha256 | sed 's/^.*= //')

divider
echo ""
success "Passphrase               ${DIM}${1}${NC}"
success "HMAC Key                 ${DIM}${key}${NC}"
echo ""
divider
echo ""
