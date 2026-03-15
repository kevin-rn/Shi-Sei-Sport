#!/bin/sh
set -e

# ── Colors & Symbols ───────────────────────────────────────────────────────

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
DIM='\033[2m'
NC='\033[0m'

OK="${GREEN}✓${NC}"
WARN="${YELLOW}!${NC}"
ARROW="${CYAN}▸${NC}"

# ── Output helpers ─────────────────────────────────────────────────────────

divider() {
  printf "${DIM}──────────────────────────────────────────────────${NC}\n"
}

step() {
  printf "  ${ARROW} %s\n" "$1"
}

success() {
  printf "  ${OK} %s\n" "$1"
}

warn() {
  printf "  ${WARN} ${YELLOW}%s${NC}\n" "$1"
}

# ── Banner ─────────────────────────────────────────────────────────────────

printf "\n"
printf "${RED} _____  _    _  _____        _____  ______  _____  ${NC}\n"
printf "${RED}/ ____|| |  | ||_   _|      / ____||  ____||_   _| ${NC}\n"
printf "${RED}| (___  | |__| |  | |  ___ | (___  | |__     | |  ${NC}\n"
printf "${RED} \___ \ |  __  |  | | |___| \___ \ |  __|    | |  ${NC}\n"
printf "${RED} ____) || |  | | _| |_      ____) || |____  _| |_ ${NC}\n"
printf "${RED}|_____/ |_|  |_||_____|    |_____/ |______||_____|${NC}\n"
printf "\n"
printf "${DIM}  Backend Entrypoint${NC}\n"
printf "\n"

# ── Wait for Postgres ──────────────────────────────────────────────────────

step "Waiting for postgres..."
until node -e "
  const { Client } = require('pg');
  const c = new Client({ connectionString: process.env.DATABASE_URI });
  c.connect().then(() => c.end()).catch(() => { c.end(); process.exit(1); });
" 2>/dev/null; do
  sleep 1
done
success "Postgres is ready"

# ── MinIO restore ─────────────────────────────────────────────────────────

LATEST_MINIO=$(ls -1t /backups/minio_*.tar.gz 2>/dev/null | head -n 1)
if [ -n "$LATEST_MINIO" ]; then
  if [ ! -d /data/minio/.minio.sys ] && ! ls /data/minio/judo-bucket/ >/dev/null 2>&1; then
    step "Restoring MinIO from ${LATEST_MINIO}..."
    tar -xzf "$LATEST_MINIO" -C /data/
    success "MinIO restore complete"
  fi
fi

# ── Database migration & seeding ──────────────────────────────────────────

RESTORED_FROM_BACKUP=false
if [ -f /backups/.db-restored ]; then
  warn "Database was restored from backup, skipping migration generation and seeding."
  RESTORED_FROM_BACKUP=true
  rm -f /backups/.db-restored
fi

# Auto-generate migration if none exist yet (exclude index.ts which is always present)
if [ "$RESTORED_FROM_BACKUP" = "false" ]; then
  MIGRATION_FILES=$(ls src/migrations/*.ts 2>/dev/null | grep -v 'index\.ts' || true)
  if [ -z "$MIGRATION_FILES" ]; then
    # Check if the database already has tables (existing deployment)
    DB_HAS_TABLES=$(node -e "
      const { Client } = require('pg');
      const client = new Client({ connectionString: process.env.DATABASE_URI });
      client.connect()
        .then(() => client.query(\"SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public' AND table_name='payload_migrations'\"))
        .then(res => { process.stdout.write(res.rows[0].count); client.end(); })
        .catch(() => { process.stdout.write('0'); client.end(); });
    " 2>/dev/null || echo "0")
    if [ "$DB_HAS_TABLES" = "1" ]; then
      step "Database already initialized, skipping migration generation"
    else
      step "No migrations found, generating initial migration..."
      NODE_ENV=development node --import ./loader.mjs ./node_modules/.bin/payload migrate:create -- --name init
    fi
  fi
fi

# Run migrations (no-op if already up to date)
step "Running migrations..."
NODE_ENV=development node --import ./loader.mjs ./node_modules/.bin/payload migrate
success "Migrations complete"

# Seed database (skip if restored from backup)
if [ "$RESTORED_FROM_BACKUP" = "false" ]; then
  step "Seeding database..."
  NODE_ENV=development npx tsx init-db.ts
  success "Seeding complete"
else
  warn "Skipping seed - data restored from backup."
fi

# ── Start server ──────────────────────────────────────────────────────────

printf "\n"
divider
success "Starting server"
divider
printf "\n"

exec node server.js
