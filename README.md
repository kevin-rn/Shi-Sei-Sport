<p align="center">

<h1 align="center">Shi-Sei Sport</h1>

  <p align="center">
    Website for Shi-Sei Sport - the oldest judo club in The Hague, Netherlands.
  </p>
</p>

<p align="center">
  <a href="https://github.com/kevin-rn/Shi-Sei-Sport/actions/workflows/ci.yml">
    <img src="https://github.com/kevin-rn/Shi-Sei-Sport/actions/workflows/ci.yml/badge.svg" alt="CI">
  </a>
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/node-22-339933?logo=nodedotjs&logoColor=white" alt="Node.js 22">
  <img src="https://img.shields.io/badge/react-19-61dafb?logo=react&logoColor=white" alt="React 19">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 3">
  <img src="https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs&logoColor=white" alt="Next.js 15">
  <img src="https://img.shields.io/badge/Payload_CMS-3.75-0F0F0F?logo=payloadcms&logoColor=white" alt="Payload CMS">
  <img src="https://img.shields.io/badge/PostgreSQL-18-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/MinIO-S3-C72E49?logo=minio&logoColor=white" alt="MinIO">
  <img src="https://img.shields.io/badge/docker-compose-2496ED?logo=docker&logoColor=white" alt="Docker Compose">
  <img src="https://img.shields.io/badge/Caddy-2-1F88C0?logo=caddy&logoColor=white" alt="Caddy">
</p>

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 (Vite 7) &bull; React Router v7 &bull; TypeScript 5.9 &bull; Tailwind CSS v3 |
| **Backend** | Payload CMS v3.75 &bull; Next.js 15 (App Router) &bull; Lexical rich text editor |
| **Database** | PostgreSQL 18 (Alpine) |
| **Storage** | MinIO (S3-compatible) via `@payloadcms/storage-s3` |
| **Email** | Nodemailer with dual SMTP transporters |
| **Web Server** | Caddy - automatic HTTPS, reverse proxy, security headers |
| **Image Processing** | Sharp (thumbnails, WebP conversion, JPEG downloads) |
| **CAPTCHA** | Altcha (proof-of-work, no third-party tracking) |
| **CI/CD** | GitHub Actions - lint, build, audit, Trivy scan, deploy |
| **Orchestration** | Docker Compose (6 services) |

## Screenshots

### Main Page

<table>
  <tr>
    <td><img src="backend/assets/misc/mainpage%20-%20light.png" alt="Light mode main page" width="100%"></td>
    <td><img src="backend/assets/misc/mainpage%20-%20dark.png" alt="Dark mode main page" width="100%"></td>
  </tr>
</table>

### Admin Panel

<table>
  <tr>
    <td><img src="backend/assets/misc/Darkmode%20Login.png" alt="Dark mode login" width="100%"></td>
    <td><img src="backend/assets/misc/Lightmode%20Login.png" alt="Light mode login" width="100%"></td>
  </tr>
  <tr>
    <td><img src="backend/assets/misc/Darkmode%20Dashboard.png" alt="Dark mode dashboard" width="100%"></td>
    <td><img src="backend/assets/misc/Lightmode%20Dashboard.png" alt="Light mode dashboard" width="100%"></td>
  </tr>
</table>

## Project Structure

```
Shi-Sei-Sport/
├── docker-compose.yml               # 6 services: postgres, minio, backend, frontend, caddy, createbuckets
├── .env.example                     # All environment variables documented
├── LICENSE                          # MIT
│
├── .github/
│   └── workflows/ci.yml            # CI/CD pipeline (lint, build, audit, scan, deploy)
│
├── backend/                         # Payload CMS (Next.js 15)
│   ├── Dockerfile                   # Multi-stage build (4 stages)
│   ├── entrypoint.sh                # DB wait, migration, seed, server start
│   ├── init-db.ts                   # Database initialization + seeding
│   ├── src/
│   │   ├── payload.config.ts        # Main CMS configuration
│   │   ├── collections/             # 13 content schemas (news, media, grades, etc.)
│   │   ├── globals/                 # Site-wide settings (contact info, VCP)
│   │   ├── app/(payload)/api/       # Custom API routes (contact, enrollment, trial, track)
│   │   ├── components/              # Custom admin UI (Logo, Icon, ThemeToggle)
│   │   ├── lib/                     # Mail, PDF, rate limiting, validation helpers
│   │   ├── seed/                    # Dev data seeding scripts
│   │   └── styles/                  # Custom Payload admin CSS with branded icons
│   └── README.md
│
├── frontend/                        # React SPA (Vite 7)
│   ├── Dockerfile.og                # OG meta tag server (port 3001)
│   ├── server.mjs                   # Lightweight Node server for OG injection
│   ├── src/
│   │   ├── App.tsx                  # Route definitions (17 lazy-loaded pages)
│   │   ├── components/              # 20+ reusable UI components
│   │   ├── pages/                   # One file per route
│   │   ├── contexts/                # Dark mode + language (nl/en) providers
│   │   ├── hooks/                   # SEO, focus trap, page tracking
│   │   ├── i18n/                    # 1500+ translation keys (nl.ts, en.ts)
│   │   ├── lib/                     # API client, validation, utilities
│   │   └── styles/                  # Base CSS + dark mode overrides
│   └── README.md
│
├── caddy/                           # Reverse proxy
│   ├── Caddyfile                    # Routing, caching, security headers
│   └── Dockerfile                   # caddy:2-alpine + frontend static assets
│
├── scripts/                         # Operations toolkit
│   ├── backup.sh                    # PostgreSQL + MinIO backup with rotation
│   ├── restore.sh                   # Restore from backup files
│   ├── restore-db-init.sh           # Auto-restore on fresh container boot
│   ├── harden-vps.sh               # SSH hardening, fail2ban, ufw firewall
│   └── gen_altcha_key.sh            # Generate ALTCHA HMAC key from passphrase
│
└── data/ (gitignored)
    ├── db/                          # PostgreSQL volume
    └── minio/                       # Media storage volume
```

## Documentation

| Document | Description |
|----------|-------------|
| [Frontend README](frontend/README.md) | React SPA - routes, components, dark mode, i18n, forms |
| [Backend README](backend/README.md) | Payload CMS - collections, API endpoints, email, seeding |
| [Contributing](CONTRIBUTING.md) | How to contribute to this project |
| [Security Policy](SECURITY.md) | How to report security vulnerabilities |
| [Code of Conduct](CODE_OF_CONDUCT.md) | Community standards |
| [Support](SUPPORT.md) | How to get help |

---

## Quick Start

### Prerequisites

- Docker & Docker Compose

### Setup & Run

```bash
git clone https://github.com/kevin-rn/Shi-Sei-Sport.git
cd Shi-Sei-Sport
cp .env.example .env               # edit with your secrets
docker compose up -d --build
```

> **Tip:** Generate secure secrets with `openssl rand -hex 32` for `PAYLOAD_SECRET`, `ALTCHA_SECRET`, and database passwords.

### Service URLs

| Service | URL | Description |
|---------|-----|-------------|
| Website | `http://localhost` | Public-facing site |
| Admin Panel | `http://localhost/admin` | Payload CMS dashboard |
| REST API | `http://localhost/api` | Payload REST API |
| MinIO Console | `http://localhost:9001` | S3 storage dashboard |

### First-time Setup

1. Go to `http://localhost/admin` and create your admin user
2. (Optional) Seed sample data: `docker compose exec backend npm run init-db`
3. Upload images in the **Media** collection
4. Create **News** and **Schedule** entries
5. Refresh the homepage to see your content

---

## Development

### Frontend (hot reload)

```bash
cd frontend
npm install
npm run dev           # http://localhost:5173
```

### Backend

```bash
cd backend
npm install
npm run dev           # http://localhost:3000/admin
```

> API requests go through Caddy in production (`/api/*` -> backend). During development, you need either the backend running locally or the full Docker stack.

### Pre-commit Hooks

The project uses [Husky](https://typicode.github.io/husky/) with [lint-staged](https://github.com/lint-staged/lint-staged) to auto-lint frontend TypeScript files on commit.

```bash
npm install           # in project root - sets up Husky
```

---

## Architecture

```
Browser
  |
  v
Caddy (:80 / :443)
  |-- /              -> Caddy file_server  (React SPA static files)
  |-- /nieuws/*      -> frontend:3001      (Node OG server - injects Open Graph meta tags)
  |-- /api/*         -> backend:3000       (Payload CMS REST API + custom endpoints)
  |-- /admin*        -> backend:3000       (Payload CMS admin panel)
  |-- /media/*       -> minio:9000         (S3 storage, path rewrite to /judo-bucket)
  |-- /sitemap.xml   -> backend:3000       (SEO sitemap)
  '-- /robots.txt    -> backend:3000       (SEO robots)

Backend (Payload CMS + Next.js 15)
  |-- PostgreSQL     (content, users, page view analytics)
  '-- MinIO          (media uploads via S3 API)
```

### Caching Strategy

| Path | Cache | TTL |
|------|-------|-----|
| `/api/*`, `/admin*` | `no-store` | - |
| `/_next/*` | `immutable` | 1 year |
| `/media/*` | `public` | 1 day |
| `/sitemap.xml` | `public` | 1 hour |
| `/robots.txt` | `public` | 1 day |
| Static assets (`.js`, `.css`) | `immutable` | 1 year |
| `index.html` | `no-cache` | - |

### Security Headers

Caddy enforces: Content-Security-Policy, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, HSTS (1 year), Permissions-Policy (restricts camera, microphone, geolocation). Request body size limited to 10MB.

### Open Graph Meta Tags

News detail pages (`/nieuws/:slug`) need server-side meta injection for social media link previews. Caddy proxies these requests to a lightweight Node server (`frontend/server.mjs` on port 3001) that fetches the article from the backend API and injects `<meta property="og:*">` tags into the HTML before serving it. All other frontend routes are served as static files by Caddy.

### Analytics

Privacy-friendly page view tracking with no cookies and no PII. The frontend sends `POST /api/track` on route changes. The backend aggregates daily stats per path/device/browser using a SHA-256 session hash rotated daily (from IP + User-Agent + date). An analytics dashboard is rendered on the Payload admin panel showing total views, unique visitors, top pages, devices, browsers, and a daily chart.

### Email System

Forms submit to custom backend endpoints which send emails via nodemailer. Two SMTP transporters share the same host/port/password but authenticate with different sender addresses:

| Transporter | Env Var | Used By |
|-------------|---------|---------|
| Contact | `CONTACT_EMAIL` | Contact form, enrollment form |
| Trial | `TRIAL_LESSON_EMAIL` | Trial lesson form |

`BCC_EMAIL` (optional) is applied only to club-facing notification emails, not user confirmation emails. Email templates use `escapeHtml()` for all user-provided content. The club logo (`public/shi-sei-logo-email.png`) is attached as a CID image.

### Docker Services

| Service | Image | Port | Memory | Purpose |
|---------|-------|------|--------|---------|
| `postgres` | `postgres:18-alpine` | 5432 | 256M | Database with healthcheck |
| `minio` | `minio/minio` | 9000/9001 | 256M | S3-compatible media storage |
| `createbuckets` | `minio/mc` | - | - | One-shot: creates `judo-bucket` |
| `backend` | Custom (Node 22) | 3000 | 1.5G | Payload CMS + Next.js |
| `frontend` | Custom (Node 22) | 3001 | 128M | OG meta tag injection server |
| `caddy` | `caddy:2-alpine` | 80/443 | 128M | Reverse proxy + static files |

---

## Environment Variables

Copy `.env.example` to `.env` in the project root (never commit this). See [`.env.example`](.env.example) for full documentation of each variable.

| Variable | Required | Description |
|----------|----------|-------------|
| `DB_USER` | Yes | PostgreSQL username |
| `DB_PASSWORD` | Yes | PostgreSQL password (32+ chars) |
| `MINIO_USER` | Yes | MinIO access key |
| `MINIO_PASSWORD` | Yes | MinIO secret key (8+ chars) |
| `PAYLOAD_SECRET` | Yes | JWT signing secret (32+ chars) |
| `DOMAIN_NAME` | Yes | Primary domain without protocol |
| `DOMAIN_NAME_WWW` | Yes | WWW variant of domain |
| `IP_ADDRESS` | Yes | Full base URL with protocol |
| `ALTCHA_SECRET` | Yes | CAPTCHA secret key (32+ chars) |
| `S3_REGION` | No | AWS region (default: `eu-central-1`) |
| `SMTP_HOST` | Yes | SMTP server hostname |
| `SMTP_PORT` | Yes | SMTP port (587 or 465) |
| `SMTP_SECURE` | Yes | `true` for port 465, `false` for 587 |
| `SMTP_PASS` | Yes | SMTP password (shared by both accounts) |
| `CONTACT_EMAIL` | Yes | Contact/enrollment form sender + recipient |
| `TRIAL_LESSON_EMAIL` | Yes | Trial lesson form sender + recipient |
| `BCC_EMAIL` | No | BCC for club-facing emails only |

> **Security:** Use `openssl rand -hex 32` to generate `PAYLOAD_SECRET`, `ALTCHA_SECRET`, and database passwords.

---

## CI/CD

GitHub Actions runs on every push to `main` / `release-*` and on PRs to `main`. The pipeline uses path filtering so jobs only run when relevant code changes.

| Job | Trigger | What it does |
|-----|---------|-------------|
| **Detect Changes** | always | Path-based filtering for frontend, backend, docker changes |
| **Frontend** | `frontend/**` changed | `npm ci` -> lint -> build |
| **Backend** | `backend/**` changed | `npm ci` -> build |
| **Security Audit** | frontend or backend changed | `npm audit --audit-level=critical` (prod deps) |
| **Docker Build** | any code or Dockerfile changed | Builds all 3 images with BuildKit layer caching |
| **Image Scan** | any code or Dockerfile changed | Trivy scans for CRITICAL/HIGH CVEs |
| **Deploy** | push to `main` only | SSH into VPS -> pull -> rebuild -> restart |

Concurrent runs on the same branch are auto-cancelled (except `main`).

### Setting Up Automated Deployment

#### 1. Create a deploy user on your VPS

```bash
# On the VPS (as root)
useradd -m -s /bin/bash deploy
usermod -aG docker deploy
chown -R deploy:deploy /path/to/Shi-Sei-Sport
```

#### 2. Generate a dedicated deploy key

```bash
# On your local machine
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/deploy_key
```

#### 3. Authorize the key on the VPS

```bash
# On the VPS (as root)
mkdir -p /home/deploy/.ssh
cat /path/to/deploy_key.pub >> /home/deploy/.ssh/authorized_keys
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys
```

#### 4. Add GitHub repository secrets

Go to **Settings -> Secrets and variables -> Actions -> New repository secret** and add:

| Secret | Value |
|--------|-------|
| `VPS_HOST` | Server IP address |
| `VPS_USER` | `deploy` |
| `VPS_SSH_KEY` | Contents of `~/.ssh/deploy_key` (the private key) |
| `VPS_PROJECT_PATH` | Absolute path to the repo on the VPS |

#### 5. Create the production environment

Go to **Settings -> Environments -> New environment**, name it `production`. Optionally enable **Required reviewers** for manual deploy approval.

---

## Deployment

### Manual

```bash
docker compose up -d --build
```

Caddy handles automatic HTTPS via Let's Encrypt when `DOMAIN_NAME` points to a public IP. For local development, it serves on HTTP port 80.

### Full Rebuild (removes all data)

```bash
docker compose down -v
sudo rm -rf data
docker compose up -d --build
```

---

## Operations Scripts

All scripts use styled terminal output with color-coded status indicators. Run without arguments to see usage.

| Script | Description |
|--------|-------------|
| `scripts/backup.sh` | Backup PostgreSQL and/or MinIO with automatic rotation (keeps N most recent) |
| `scripts/backup.sh --setup-cron` | Interactive cron job setup for automated backups |
| `scripts/restore.sh` | Restore database and/or MinIO from backup files |
| `scripts/restore-db-init.sh` | Auto-restores database on fresh container boot (used by PostgreSQL init) |
| `scripts/harden-vps.sh` | VPS hardening: SSH key-only auth, fail2ban, ufw firewall |
| `scripts/gen_altcha_key.sh` | Generate ALTCHA HMAC key from a passphrase |

### Backup & Restore

```bash
# Backup everything (db + minio)
./scripts/backup.sh

# Backup database only
./scripts/backup.sh db

# Restore latest backup
./scripts/restore.sh

# Restore specific file
./scripts/restore.sh db backups/db_2025-01-01_160807.sql.gz
```

Backups are stored in `./backups/` (gitignored) and automatically rotated, keeping the 3 most recent by default (configurable via `BACKUP_KEEP` in `.env`).

---

## Development Workflow

### Adding a New Collection

1. Create `backend/src/collections/MyCollection.ts`
2. Add it to the `collections` array in `backend/src/payload.config.ts`
3. Optionally create seed data in `backend/src/seed/` and register in `init-db.ts`
4. Regenerate types (see below) and copy to frontend
5. Add API functions to `frontend/src/lib/api.ts`

### Regenerating Types

After modifying Payload collections, regenerate the TypeScript types:

```bash
cd backend
npm run generate:types
cp src/payload-types.ts ../frontend/src/types/payload-types.ts
```

### Commit Conventions

Commit messages follow the format: `(type): description`

Types: `feat`, `fix`, `refactor`, `docs`, `chore`

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Services won't start | `docker compose down -v && docker compose up -d --build` |
| Database connection error | Wait for PostgreSQL health check (~10s), check `docker compose logs postgres` |
| Hot reload not working | Use `http://localhost:5173` (Vite dev server), not `:80` |
| Email not sending | Verify `SMTP_HOST`, `SMTP_PASS`, `CONTACT_EMAIL`, `TRIAL_LESSON_EMAIL` in `.env` |
| Seed data missing | Run `docker compose exec backend npm run init-db` with `PAYLOAD_SEED=true` |
| Static files not served | Backend uses `output: 'standalone'` - `public/` files aren't auto-served. Use inline data URIs in CSS |
| OG tags not showing | Check that `frontend/server.mjs` is running on port 3001 and Caddy proxies `/nieuws/*` to it |
| MinIO uploads fail | Verify MinIO is running (`docker compose logs minio`), check `MINIO_USER`/`MINIO_PASSWORD` |
| Caddy TLS errors | Ensure `DOMAIN_NAME` DNS points to the server's public IP, check `docker compose logs caddy` |
| Rate limit hit | Form endpoints allow 5 req/60s per IP, analytics allows 30 req/60s. Wait or restart backend |

---

## License

[MIT](LICENSE)
