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
│   │   ├── collections/             # Content schemas
│   │   ├── globals/                 # Site-wide settings
│   │   ├── seed/                    # Dev data seeding
│   │   └── payload.config.ts
│   └── init-db.ts
│
├── frontend/                        # React SPA (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/                # Language, theme
│   │   ├── lib/api.ts
│   │   └── styles/
│   └── Caddyfile
│
└── data/ (gitignored)
    ├── db/                          # PostgreSQL volume
    └── minio/                       # Media storage volume
```

## Quick Start

### Prerequisites

- Docker & Docker Compose

### Run

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
2. Upload images in the **Media** collection
3. Create **News** and **Schedule** entries
4. Refresh the homepage to see your content

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
  ├─ /api/*       → Backend   (Payload CMS)
  ├─ /admin*      → Backend   (Payload CMS)
  └─ /media/*     → MinIO     (S3 storage)

Backend (Payload CMS + Next.js)
  ├─ PostgreSQL
  └─ MinIO
```

## Environment Variables

Create a `.env` in the project root (never commit this):

```env
# Database
DB_USER=postgres
DB_PASSWORD=your_secure_password

# MinIO
MINIO_USER=minio_user
MINIO_PASSWORD=your_secure_password

# Payload
PAYLOAD_SECRET=your_jwt_secret
DOMAIN_NAME=yourdomain.com

# SMTP (contact & enrollment forms)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user
SMTP_PASS=pass
SMTP_FROM=noreply@example.com
CONTACT_EMAIL=info@example.com
```

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

## License

[MIT](LICENSE)
