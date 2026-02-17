#!/bin/sh
set -e

# Auto-generate migration if none exist yet (exclude index.ts which is always present)
MIGRATION_FILES=$(ls src/migrations/*.ts 2>/dev/null | grep -v 'index\.ts' || true)
if [ -z "$MIGRATION_FILES" ]; then
  echo "No migrations found, generating initial migration..."
  NODE_ENV=development node --import ./loader.mjs ./node_modules/.bin/payload migrate:create -- --name init
fi

# Run migrations
NODE_ENV=development node --import ./loader.mjs ./node_modules/.bin/payload migrate

# Seed database
NODE_ENV=development npx tsx init-db.ts

# Start server
exec node server.js
