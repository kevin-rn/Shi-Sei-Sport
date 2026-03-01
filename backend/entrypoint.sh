#!/bin/sh
set -e

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

# Auto-generate migration if none exist yet (exclude index.ts which is always present)
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

# Run migrations (no-op if already up to date)
NODE_ENV=development node --import ./loader.mjs ./node_modules/.bin/payload migrate

# Seed database
NODE_ENV=development npx tsx init-db.ts

# Start server
exec node server.js
