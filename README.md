<p align="center">
  <h1 align="center">Shi-Sei Sport</h1>
  <p align="center">
    Website for Shi-Sei Sport -the oldest judo club in The Hague, Netherlands.
  </p>
</p>

<p align="center">
  <a href="https://github.com/kevin-rn/Shi-Sei-Sport/actions/workflows/ci.yml">
    <img src="https://github.com/kevin-rn/Shi-Sei-Sport/actions/workflows/ci.yml/badge.svg" alt="CI">
  </a>
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  <img src="https://img.shields.io/badge/react-19-61dafb?logo=react&logoColor=white" alt="React 19">
  <img src="https://img.shields.io/badge/Payload_CMS-3.75-0F0F0F?logo=payloadcms&logoColor=white" alt="Payload CMS">
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/docker-compose-2496ED?logo=docker&logoColor=white" alt="Docker Compose">
  <img src="https://img.shields.io/badge/PostgreSQL-18-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL">
</p>

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 (Vite 7) &bull; TypeScript &bull; Tailwind CSS v3 |
| **Backend** | Payload CMS v3.75 &bull; Next.js 15 |
| **Database** | PostgreSQL 18 (Alpine) |
| **Storage** | MinIO (S3-compatible) |
| **Web Server** | Caddy -automatic HTTPS |
| **Orchestration** | Docker Compose |

## Main Page

<table>
  <tr>
    <td><img src="backend/assets/misc/mainpage%20-%20light.png" alt="Light mode main page" width="100%"></td>
    <td><img src="backend/assets/misc/mainpage%20-%20dark.png" alt="Dark mode main page" width="100%"></td>
  </tr>
</table>

## Admin Panel

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
├── docker-compose.yml
├── caddy/                           # Reverse proxy config
│
├── backend/                         # Payload CMS (Next.js)
│   ├── src/
│   │   ├── collections/             # Content schemas (news, media, grades, etc.)
│   │   ├── globals/                 # Site-wide settings (contact info, VCP)
│   │   ├── components/              # Custom admin UI components
│   │   ├── lib/                     # Mail, PDF, rate-limiting helpers
│   │   ├── seed/                    # Dev data seeding
│   │   └── payload.config.ts
│   └── init-db.ts
│
├── frontend/                        # React SPA (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/                # Language, theme
│   │   ├── hooks/                   # SEO, focus trap, page tracking
│   │   ├── lib/api.ts
│   │   └── styles/
│   └── Caddyfile
│
└── data/ (gitignored)
    ├── db/                          # PostgreSQL volume
    └── minio/                       # Media storage volume
```

## Documentation

- [Frontend README](frontend/README.md) -React SPA, routes, components, dark mode, forms
- [Backend README](backend/README.md) -Payload CMS, collections, API endpoints, seeding

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

| Service | URL |
|---------|-----|
| Website | `http://localhost` |
| Admin Panel | `http://localhost/admin` |
| API | `http://localhost/api` |
| MinIO Console | `http://localhost:9001` |

### First-time Setup

1. Go to `http://localhost/admin` and create your admin user
2. (Optional) Seed sample data: `docker compose exec backend npm run init-db`
3. Upload images in the **Media** collection
4. Create **News** and **Schedule** entries
5. Refresh the homepage to see your content

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

## Architecture

```
Browser
  │
  ▼
Caddy (:80 / :443)
  ├─ /            → Frontend  (React static files via file_server)
  ├─ /nieuws/*    → Frontend  (Node OG server -injects Open Graph meta tags)
  ├─ /api/*       → Backend   (Payload CMS + custom endpoints)
  ├─ /admin*      → Backend   (Payload CMS admin panel)
  └─ /media/*     → MinIO     (S3 storage, path-rewritten to judo-bucket)

Backend (Payload CMS + Next.js)
  ├─ PostgreSQL   (content + page view analytics)
  └─ MinIO        (media uploads)
```

### Open Graph Meta Tags

News detail pages (`/nieuws/:slug`) need server-side meta injection for social media link previews. Caddy proxies these requests to a lightweight Node server (`frontend/server.mjs` on port 3001) which fetches the article from the backend API and injects `<meta og:*>` tags into the HTML before serving it. All other frontend routes are served as static files.

### Analytics

Privacy-friendly page view tracking (no cookies, no PII). The frontend sends `POST /api/track` on route changes; the backend aggregates daily stats per path/device/browser using a SHA-256 session hash (rotated daily from IP + UA + date). An analytics dashboard is rendered on the Payload admin panel.

### Email System

Forms submit to custom backend endpoints which send emails via nodemailer. Two SMTP transporters share the same host/port/password but authenticate with different addresses:

| Transporter | Env Var | Used By |
|-------------|---------|---------|
| Contact | `CONTACT_EMAIL` | Contact form, enrollment form |
| Trial | `TRIAL_LESSON_EMAIL` | Trial lesson form |

`BCC_EMAIL` (optional) is applied only to club-facing notification emails, not user confirmation emails.

## Environment Variables

Copy `.env.example` to `.env` in the project root (never commit this). See [`.env.example`](.env.example) for full documentation of each variable, including which are required and how to generate secure values.

> **Security:** Use `openssl rand -hex 32` to generate `PAYLOAD_SECRET`, `ALTCHA_SECRET`, and database passwords.

## CI/CD

GitHub Actions runs on every push to `main` / `release-*` and on PRs to `main`. The pipeline uses path filtering so jobs only run when relevant code changes.

| Job | Trigger | What it does |
|-----|---------|-------------|
| **Frontend** | `frontend/**` changed | `npm ci` → lint → build |
| **Backend** | `backend/**` changed | `npm ci` → build |
| **Security Audit** | frontend or backend changed | `npm audit --audit-level=high` |
| **Docker Build** | any code or Dockerfile changed | Builds all 3 images with BuildKit layer caching |
| **Image Scan** | any code or Dockerfile changed | Trivy scans for CRITICAL/HIGH CVEs |
| **Deploy** | push to `main` only | SSH into VPS → pull → rebuild → restart |

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

Go to **Settings → Secrets and variables → Actions → New repository secret** and add:

| Secret | Value |
|--------|-------|
| `VPS_HOST` | Server IP address |
| `VPS_USER` | `deploy` |
| `VPS_SSH_KEY` | Contents of `~/.ssh/deploy_key` (the private key) |
| `VPS_PROJECT_PATH` | Absolute path to the repo on the VPS |

#### 5. Create the production environment

Go to **Settings → Environments → New environment**, name it `production`. Optionally enable **Required reviewers** for manual deploy approval.

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

## Development Workflow

### Adding a New Collection

1. Create `backend/src/collections/MyCollection.ts`
2. Add it to the `collections` array in `backend/src/payload.config.ts`
3. Optionally create seed data in `backend/src/seed/` and register in `init-db.ts`
4. Regenerate types (see below) and copy to frontend
5. Add API functions to `frontend/src/lib/api.ts` and types to `frontend/src/types/api-types.ts`

### Regenerate Types

After modifying Payload collections, regenerate the TypeScript types:

```bash
cd backend
npm run generate:types
cp src/payload-types.ts ../frontend/src/types/payload-types.ts
```

### Commit Conventions

Commit messages follow the format: `(type): description`

Types: `feat`, `fix`, `refactor`, `docs`, `chore`

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Services won't start | `docker compose down -v && docker compose up -d --build` |
| Database connection error | Wait for PostgreSQL health check (~10s), check `docker compose logs postgres` |
| Hot reload not working | Use `http://localhost:5173` (Vite dev server), not `:80` |
| Email not sending | Verify `SMTP_HOST`, `SMTP_PASS`, `CONTACT_EMAIL`, `TRIAL_LESSON_EMAIL` in `.env` |
| Seed data missing | Run `docker compose exec backend npm run init-db` with `PAYLOAD_SEED=true` |
| Static files not served | Backend uses `output: 'standalone'` -`public/` files aren't auto-served. Use inline data URIs in CSS instead of `url('/path')` |
| OG tags not showing | Check that `frontend/server.mjs` is running on port 3001 and Caddy proxies `/nieuws/*` to it |

## License

[MIT](LICENSE)
