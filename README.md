# 🥋 Shi-Sei-Sport
Webpagina van Shi-Sei Sport club, de oudste judoclub van Den Haag. 

## Tech Stack

**Frontend:**
- React (Vite) + TypeScript - Modern, fast frontend framework
- Tailwind CSS (v3) - Utility-first styling
- Caddy - Web server & reverse proxy with automatic HTTPS

**Backend:**
- Payload CMS - Headless CMS with Node.js/Express
- PostgreSQL - Relational database
- MinIO - S3-compatible object storage for images

**Payload CMS**:
<table>
  <tr>
    <td>
      <img src="backend/assets/misc/Darkmode%20Login.png" alt="Dark Login" width="100%">
    </td>
    <td>
      <img src="backend/assets/misc/Lightmode%20Login.png" alt="Light Login" width="100%">
    </td>
  </tr>
  <tr>
    <td>
      <img src="backend/assets/misc/Darkmode%20Dashboard.png" alt="Dark Dashboard" width="100%">
    </td>
    <td>
      <img src="backend/assets/misc/Lightmode%20Dashboard.png" alt="Light Dashboard" width="100%">
    </td>
  </tr>
</table>

**Orchestration:**
- Docker & Docker Compose - Container management

## Project Structure

```
Shi-Sei-Sport/
├── docker-compose.yml              # Service orchestration
├── deploy.sh                        # Deployment script
│
├── backend/
│   ├── Dockerfile                  # Multi-stage backend build
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── server.ts               # Entry point
│       ├── payload.config.ts       # Database & storage config
│       └── collections/             # Data schemas
│
├── frontend/
│   ├── Dockerfile                  # Multi-stage React + Caddy build
│   ├── Caddyfile                   # Web server routing config
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── src/
│       ├── App.tsx                 # Main app component
│       ├── main.tsx                # React entry point
│       ├── components/             # Reusable components
│       ├── pages/                  # Page components
│       ├── contexts/               # React context (e.g., language)
│       ├── lib/
│       │   └── api.ts              # API client
│       └── types/
│           └── payload-types.ts    # Auto-generated backend types
│
├── data/ (gitignored)
│   ├── db/                         # PostgreSQL data volume
│   └── minio/                      # Image storage volume
│
└── README.md, LICENSE, .gitignore
```

## Quick Start

### Prerequisites
- Docker & Docker Compose installed
- Node.js 18+ (optional, only for local development)

### Running Locally

```bash
# Start all services (database, backend, frontend)
docker-compose up -d --build

# View logs
docker-compose logs -f frontend backend
```

Access the site at:
- **Website**: http://localhost
- **Admin Panel**: http://localhost/admin
- **API**: http://localhost/api
- **MinIO Console**: http://localhost:9001 (user: `minio_user`, password: `minio_password`)

### Initial Setup

1. Navigate to http://localhost/admin
2. Create the first admin user
3. Upload images in the Media collection
4. Create News items and Schedule entries
5. Refresh homepage to see changes

## Development Workflow

### Local Frontend Development (with Hot Reload)

```bash
cd frontend
npm install
npm run dev
```

Then access Vite dev server at http://localhost:5173

### Making Changes

**Frontend changes:**
```bash
# Edit React/TypeScript files in frontend/src/
# Changes reload automatically with Vite hot-reload
```

**Backend changes:**
```bash
# Edit backend files
docker-compose restart backend
```

**Data model changes:**
```bash
# Modify backend collections, then regenerate types:
cd backend
npm run generate:types

# Copy updated types to frontend:
cp src/payload-types.ts ../frontend/src/types/
```

## Deployment

### Deploy to Production

```
docker compose up -d
```

## Rebuilding (permanent data removal)
```
docker compose down -v
```

```
sudo rm -rf data
```

```
docker compose up -d --build
```

### What Gets Built

- **Frontend**: Multi-stage Docker build
  - Stage 1: Build React app with Node.js
  - Stage 2: Serve with Caddy on port 80/443
  
- **Backend**: Docker build from Dockerfile
  - Express server with Payload CMS
  - Connects to PostgreSQL and MinIO

## Architecture

```
Client (Browser)
    ↓
Caddy (Port 80/443)
    ├→ /              → React static files
    ├→ /api/*         → Backend (Port 3000)
    ├→ /admin*        → Backend (Port 3000)
    └→ /media/*       → MinIO (Port 9000)
    
Backend (Express + Payload)
    ├→ PostgreSQL (Port 5432)
    └→ MinIO (Port 9000)
```

## Environment Variables

Create a `.env` file in the project root (never commit this):

```env
# Database
DB_USER=postgres
DB_PASSWORD=your_secure_password

# MinIO
MINIO_USER=minio_user
MINIO_PASSWORD=your_secure_password

# Backend
PAYLOAD_SECRET=your_jwt_secret
DOMAIN_NAME=yourdomain.com  # For production HTTPS

```

## Important Notes

- **Images stored in MinIO** and accessed via S3-compatible URLs
- **Caddy auto-provisions HTTPS** for production domains
- **All services networked internally** through Docker Compose
- **Data persists** in `data/db/` and `data/minio/` volumes
- **Never commit** `.env` file or `node_modules/`

## Troubleshooting

### Services won't start
```bash
docker-compose down -v  # Remove volumes
docker-compose up -d --build  # Fresh start
```

### Database connection error
Wait for PostgreSQL health check (~10 seconds):
```bash
docker-compose logs postgres  # Check logs
```

### Hot-reload not working in frontend
- Ensure you're accessing http://localhost:5173 (not :80)
- Or use `npm run dev` in `frontend/` directory directly

## License

See [LICENSE](LICENSE)



