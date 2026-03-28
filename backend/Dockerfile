# Dockerfile
FROM node:22-slim AS base
ENV NPM_CONFIG_UPDATE_NOTIFIER=false
WORKDIR /app

# Dependencies Stage
FROM base AS deps
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm install --legacy-peer-deps

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

RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*
RUN groupadd --system nodejs && useradd --system --gid nodejs --shell /bin/bash nodejs

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/src ./src
COPY --from=builder /app/assets ./assets
COPY --from=builder /app/init-db.ts ./init-db.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/loader.mjs ./loader.mjs
COPY --from=builder /app/entrypoint.sh ./entrypoint.sh
RUN mkdir -p ./src/migrations && chmod +x ./entrypoint.sh && chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000
CMD ["./entrypoint.sh"]