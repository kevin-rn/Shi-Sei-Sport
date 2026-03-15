<p align="center">
  <h1 align="center">Shi-Sei Sport</h1>
  <p align="center">
    Website for Shi-Sei Sport — the oldest judo club in The Hague, Netherlands.
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
| **Web Server** | Caddy — automatic HTTPS |
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

- [Frontend README](frontend/README.md) — React SPA, routes, components, dark mode, forms
- [Backend README](backend/README.md) — Payload CMS, collections, API endpoints, seeding

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

### Regenerate Types

After modifying Payload collections:

```bash
cd backend
npm run generate:types
cp src/payload-types.ts ../frontend/src/types/
```

## Architecture

```
Browser
  │
  ▼
Caddy (:80 / :443)
  ├─ /            → Frontend  (React static files)
  ├─ /api/*       → Backend   (Payload CMS + custom endpoints)
  ├─ /admin*      → Backend   (Payload CMS admin panel)
  └─ /media/*     → MinIO     (S3 storage)

Backend (Payload CMS + Next.js)
  ├─ PostgreSQL   (content + page view analytics)
  └─ MinIO        (media uploads)
```

## Environment Variables

Copy `.env.example` to `.env` in the project root (never commit this):

```env
# Database
DB_USER=postgres
DB_PASSWORD=your_secure_password

# MinIO (Object Storage)
MINIO_USER=minio_user
MINIO_PASSWORD=your_secure_password

# S3 Storage
S3_REGION=eu-central-1

# Payload CMS
PAYLOAD_SECRET=your_jwt_secret
DOMAIN_NAME=yourdomain.com
DOMAIN_NAME_WWW=www.yourdomain.com
IP_ADDRESS=http://yourdomain.com

# SMTP — contact & enrollment forms
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_PASS=your_smtp_password
CONTACT_EMAIL=info@example.com        # sends + receives contact/enrollment emails

# SMTP — trial lesson form (same SMTP credentials, separate address)
TRIAL_LESSON_EMAIL=proefles@example.com

# BCC for club-facing emails (optional)
BCC_EMAIL=club@example.com

# CAPTCHA
ALTCHA_SECRET=your_altcha_secret
```

> `CONTACT_EMAIL` and `TRIAL_LESSON_EMAIL` share the same SMTP host/port/pass but each authenticates with its own address as `SMTP_USER`.

## Deployment

```bash
docker compose up -d --build
```

### Full Rebuild (removes all data)

```bash
docker compose down -v
sudo rm -rf data
docker compose up -d --build
```

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Services won't start | `docker compose down -v && docker compose up -d --build` |
| Database connection error | Wait for PostgreSQL health check (~10s), check `docker compose logs postgres` |
| Hot reload not working | Use `http://localhost:5173` (Vite dev server), not `:80` |
| Email not sending | Verify `SMTP_HOST`, `SMTP_PASS`, `CONTACT_EMAIL`, `TRIAL_LESSON_EMAIL` in `.env` |
| Seed data missing | Run `docker compose exec backend npm run init-db` with `PAYLOAD_SEED=true` |

## License

[MIT](LICENSE)
