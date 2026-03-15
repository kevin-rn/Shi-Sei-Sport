#!/bin/sh
set -e

cat << 'BANNER'
 _____  _    _  _____       _____  ______  _____
/ ____|| |  | ||_   _|     / ____||  ____||_   _|
| (___  | |__| |  | |      | (___  | |__     | |
 \___ \ |  __  |  | |       \___ \ |  __|    | |
 ____) || |  | | _| |_      ____) || |____  _| |_
|_____/ |_|  |_||_____|    |_____/ |______||_____|
BANNER
echo ""

# Wait for postgres to be ready (depends_on healthcheck is not re-evaluated on docker compose start)
echo "Waiting for postgres..."
until node -e "
  const { Client } = require('pg');
  const c = new Client({ connectionString: process.env.DATABASE_URI });
  c.connect().then(() => c.end()).catch(() => { c.end(); process.exit(1); });
" 2>/dev/null; do
  sleep 1
done
echo "Postgres is ready."

# Restore MinIO from backup if data directory is empty
LATEST_MINIO=$(ls -1t /backups/minio_*.tar.gz 2>/dev/null | head -n 1)
if [ -n "$LATEST_MINIO" ]; then
  if [ ! -d /data/minio/.minio.sys ] && ! ls /data/minio/judo-bucket/ >/dev/null 2>&1; then
    echo "Restoring MinIO from $LATEST_MINIO..."
    tar -xzf "$LATEST_MINIO" -C /data/
    echo "MinIO restore complete."
  fi
fi

# Check if database was restored from backup
RESTORED_FROM_BACKUP=false
if [ -f /backups/.db-restored ]; then
  echo "Database was restored from backup, skipping migration generation and seeding."
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
      echo "Database already initialized, skipping migration generation..."
    else
      echo "No migrations found, generating initial migration..."
      NODE_ENV=development node --import ./loader.mjs ./node_modules/.bin/payload migrate:create -- --name init
    fi
  fi
fi

# Run migrations (no-op if already up to date)
NODE_ENV=development node --import ./loader.mjs ./node_modules/.bin/payload migrate

# Seed database (skip if restored from backup)
if [ "$RESTORED_FROM_BACKUP" = "false" ]; then
  NODE_ENV=development npx tsx init-db.ts
else
  echo "Skipping seed — data restored from backup."
fi

# Start server
exec node server.js
