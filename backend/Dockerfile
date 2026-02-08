# Dockerfile
FROM node:22-slim AS base
ENV NPM_CONFIG_UPDATE_NOTIFIER=false
WORKDIR /app

# Dependencies Stage
FROM base AS deps
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm install

# Build Stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN mkdir -p shared-types
RUN node --import ./loader.mjs ./node_modules/.bin/payload generate:types
RUN node --import ./loader.mjs ./node_modules/.bin/payload generate:importmap
RUN npm run build

# Runner Stage
FROM base AS runner
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000


COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/src ./src
COPY --from=builder /app/assets ./assets
COPY --from=builder /app/init-db.ts ./init-db.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

EXPOSE 3000
CMD ["sh", "-c", "NODE_ENV=development npx tsx init-db.ts && node server.js"]