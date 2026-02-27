# Stage 1: Build React frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install && npm cache clean --force
COPY frontend/ .
RUN npm run build

# Stage 2: Serve with Caddy
FROM caddy:2-alpine
COPY --from=frontend-builder /app/dist /usr/share/caddy
COPY caddy/Caddyfile /etc/caddy/Caddyfile
EXPOSE 80 443
