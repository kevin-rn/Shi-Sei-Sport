#!/usr/bin/env bash
#
# VPS Hardening Script for Strato VPS
# Run as root on the VPS: bash harden-vps.sh [option]
#
set -euo pipefail

SSHD_CONFIG="/etc/ssh/sshd_config"

# ── Colors & Symbols ───────────────────────────────────────────────────────

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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
  echo -e "${RED} _____  _    _  _____        _____  ______  _____  ${NC}"
  echo -e "${RED}/ ____|| |  | ||_   _|      / ____||  ____||_   _| ${NC}"
  echo -e "${RED}| (___  | |__| |  | |  ___ | (___  | |__     | |  ${NC}"
  echo -e "${RED} \\___ \\ |  __  |  | | |___| \\___ \\ |  __|    | |  ${NC}"
  echo -e "${RED} ____) || |  | | _| |_      ____) || |____  _| |_ ${NC}"
  echo -e "${RED}|_____/ |_|  |_||_____|    |_____/ |______||_____|${NC}"
  echo ""
  echo -e "${DIM}  VPS Hardening Toolkit - Strato${NC}"
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

# ── Checks ──────────────────────────────────────────────────────────────────

if [[ $EUID -ne 0 ]]; then
  echo ""
  fail "This script must be run as root."
  echo ""
  exit 1
fi

# ── Helpers ─────────────────────────────────────────────────────────────────

apply_ssh_setting() {
  local key="$1"
  local value="$2"
  if grep -qE "^#?\s*${key}\b" "$SSHD_CONFIG"; then
    sed -i "s/^#*\s*${key}\b.*/${key} ${value}/" "$SSHD_CONFIG"
  else
    echo "${key} ${value}" >> "$SSHD_CONFIG"
  fi
}

backup_sshd() {
  local backup="/etc/ssh/sshd_config.backup.$(date +%Y%m%d%H%M%S)"
  cp "$SSHD_CONFIG" "$backup"
  step "Config backed up to ${DIM}${backup}${NC}"
  echo "$backup"
}

restart_sshd() {
  if sshd -t 2>/dev/null; then
    systemctl restart sshd
    success "sshd restarted"
  else
    fail "SSH config validation failed - restoring backup"
    cp "$1" "$SSHD_CONFIG"
    systemctl restart sshd
    exit 1
  fi
}

# ── Option 1: Harden SSH ───────────────────────────────────────────────────

do_ssh() {
  header "SSH Hardening"

  if [[ ! -f ~/.ssh/authorized_keys ]] || [[ ! -s ~/.ssh/authorized_keys ]]; then
    fail "No SSH authorized_keys found"
    echo ""
    warn "You must set up key access BEFORE disabling passwords:"
    echo ""
    echo -e "    ${CYAN}ssh-keygen -t ed25519${NC}"
    echo -e "    ${CYAN}ssh-copy-id root@$(hostname -I | awk '{print $1}')${NC}"
    echo ""
    exit 1
  fi

  local backup
  backup=$(backup_sshd)

  step "Applying SSH settings..."
  apply_ssh_setting "PermitRootLogin" "prohibit-password"
  apply_ssh_setting "PasswordAuthentication" "no"
  apply_ssh_setting "PubkeyAuthentication" "yes"
  apply_ssh_setting "MaxAuthTries" "3"
  apply_ssh_setting "X11Forwarding" "no"
  apply_ssh_setting "AllowAgentForwarding" "no"

  restart_sshd "$backup"

  echo ""
  success "Password auth            ${DIM}disabled${NC}"
  success "Root login               ${DIM}key-only${NC}"
  success "Max auth attempts        ${DIM}3${NC}"
  success "X11 / Agent forwarding   ${DIM}disabled${NC}"
  echo ""
  warn "Test SSH in a NEW terminal before closing this session!"
}

# ── Option 2: Fail2Ban ─────────────────────────────────────────────────────

do_fail2ban() {
  header "Fail2Ban"

  step "Installing fail2ban..."
  apt-get update -qq
  apt-get install -y -qq fail2ban > /dev/null

  step "Writing jail config..."
  cat > /etc/fail2ban/jail.local << 'JAIL'
[DEFAULT]
bantime  = 1h
findtime = 10m
maxretry = 5

[sshd]
enabled = true
port    = ssh
backend = systemd
JAIL

  systemctl enable fail2ban --quiet
  systemctl restart fail2ban

  echo ""
  success "SSH jail active"
  success "Ban policy               ${DIM}5 failures → 1 hour ban${NC}"
  success "Check status             ${DIM}fail2ban-client status sshd${NC}"
}

# ── Option 3: Firewall ─────────────────────────────────────────────────────

do_firewall() {
  header "Firewall (ufw)"

  step "Installing ufw..."
  apt-get update -qq
  apt-get install -y -qq ufw > /dev/null

  step "Applying rules..."
  ufw default deny incoming > /dev/null
  ufw default allow outgoing > /dev/null
  ufw allow ssh > /dev/null
  ufw allow 80/tcp > /dev/null
  ufw allow 443/tcp > /dev/null

  echo "y" | ufw enable > /dev/null

  echo ""
  success "Incoming                 ${DIM}deny all${NC}"
  success "Outgoing                 ${DIM}allow all${NC}"
  success "Allowed                  ${DIM}SSH, HTTP (80), HTTPS (443)${NC}"
  success "Check status             ${DIM}ufw status${NC}"
}

# ── Option 4: Reset password auth ──────────────────────────────────────────

do_reset_pw() {
  header "Emergency Recovery"

  warn "Re-enabling SSH password authentication"
  echo ""

  local backup
  backup=$(backup_sshd)

  apply_ssh_setting "PasswordAuthentication" "yes"
  apply_ssh_setting "PermitRootLogin" "yes"

  restart_sshd "$backup"

  echo ""
  success "Password auth            ${DIM}enabled${NC}"
  success "Root login               ${DIM}enabled${NC}"
  echo ""
  warn "This is for emergency recovery only."
  warn "Run ${CYAN}bash harden-vps.sh ssh${NC} after adding your new key."
}

# ── Menu ────────────────────────────────────────────────────────────────────

show_menu() {
  banner
  echo -e "  ${BOLD}Usage:${NC} bash harden-vps.sh ${CYAN}[option]${NC}"
  echo ""
  echo -e "  ${GREEN}1${NC} | ${GREEN}ssh${NC}        Harden SSH ${DIM}(disable password auth, key-only)${NC}"
  echo -e "  ${GREEN}2${NC} | ${GREEN}fail2ban${NC}   Install & configure Fail2Ban"
  echo -e "  ${GREEN}3${NC} | ${GREEN}firewall${NC}   Configure ufw ${DIM}(SSH + HTTP + HTTPS)${NC}"
  echo -e "  ${YELLOW}4${NC} | ${YELLOW}reset-pw${NC}   Re-enable SSH password auth ${DIM}(emergency)${NC}"
  echo ""
  echo -e "  ${GREEN}all${NC}            Run options 1, 2, 3"
  echo ""
  divider
  echo ""
}

# ── Main ────────────────────────────────────────────────────────────────────

case "${1:-}" in
  1|ssh)
    banner
    do_ssh
    ;;
  2|fail2ban)
    banner
    do_fail2ban
    ;;
  3|firewall)
    banner
    do_firewall
    ;;
  4|reset-pw)
    banner
    do_reset_pw
    ;;
  all)
    banner
    do_ssh
    do_fail2ban
    do_firewall
    header "Complete"
    echo ""
    success "All hardening steps applied"
    echo ""
    ;;
  *)
    show_menu
    exit 0
    ;;
esac
