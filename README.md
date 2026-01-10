# 🥋 Shi-Sei-Sport
Webpagina van Shi-Sei Sport club, de oudste judoclub van Den Haag. 

### Structure
Frontend:
- React (Vite) + TypeScript
- Tailwind CSS (v3) - Styling
- Caddy - Web Server & Reverse Proxy (Automatic HTTPS)

Backend:
- Payload CMS - Headless CMS (Node.js)
- PostgreSQL - Database
- Minio - Object Storage (S3 Compatible) for images
- Docker Compose - Orchestration

```
Shi-Sei-Sport/
├── docker-compose.yml         # Defines services (Postgres, Minio, Backend, Frontend)
│
├── backend/                   # PAYLOAD CMS (Node.js)
│   ├── Dockerfile             # Instructions to build the Backend container
│   ├── package.json           # Dependencies (Payload, Cloud Storage plugin)
│   ├── src/
│   │   ├── server.ts          # Entry point (Starts Express + Payload)
│   │   ├── payload.config.ts  # Main config (DB connection)
│   │   └── collections/        # Your Data Structure
│
├── frontend/                  # REACT + CADDY
│   ├── Dockerfile             # Instructions to build React & serve with Caddy
│   ├── Caddyfile              # Web Server config (Routing & SSL)
│   ├── package.json           # Dependencies (React, Vite, Axios)
│   ├── vite.config.ts         # Vite configuration
│   ├── index.html             # Entry HTML file
│   └── src/
│       ├── App.tsx            # Main application layout
│       ├── main.tsx           # React entry point
│       ├── lib/
│       │   └── api.ts         # Helper to fetch data & fix Minio URLs
│       ├── components/        # Components
│       └── types/
│           └── payload-types.ts # TypeScript definitions
│
└── data/                      # PERSISTENT STORAGE
    ├── db/                    # PostgreSQL data lives here
    └── minio/                 # Uploaded images live here
```

## Getting Started

### Prerequisites

* Docker Desktop installed and running
* Node.js (optional, only required for local type generation)

### Running the Project

#### Development Mode (with Hot-Reload)

From the project root:

```bash
docker compose up -d --build
```

This will:
- Start all services including the Vite dev server with hot-reload
- Mount the frontend source code as a volume (changes are reflected immediately)
- Proxy requests through Caddy on port 80 to the Vite dev server

**Frontend changes will be visible immediately** - no need to rebuild the container!

#### Production Mode

For production builds with static files:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

Initial startup may take 1 to 2 minutes due to image builds and database initialization.

### Available Services

| Service       | URL                                              | Description                    |
| ------------- | ------------------------------------------------ | ------------------------------ |
| Website       | [http://localhost](http://localhost)             | Public React site (via Caddy)  |
| Vite Dev      | [http://localhost:5173](http://localhost:5173)   | Direct access to Vite dev server |
| Admin Panel   | [http://localhost/admin](http://localhost/admin) | Payload CMS admin              |
| API           | [http://localhost/api](http://localhost/api)     | Raw JSON API                   |
| Minio Console | [http://localhost:9001](http://localhost:9001)   | Media storage UI               |

**Note:** In development mode, you can access the site via either:
- `http://localhost` (through Caddy proxy)
- `http://localhost:5173` (direct Vite dev server)

Minio credentials:

* User: `minio_user`
* Password: `minio_password`

## First-Time Setup

1. Open [http://localhost/admin](http://localhost/admin)
2. Create the initial admin user
3. Upload images in the Media collection
4. Create News items and Schedule entries
5. Refresh the homepage to see the content appear

## Development

### Updating Frontend TypeScript Types

When you modify backend collections, regenerate the Payload types and copy them to the frontend.
```bash
cd backend
npm install
npm run generate:types
```

Copy the generated file:
```powershell
copy src\payload-types.ts ..\frontend\src\types\
```

## Notes

* Media uploads are stored in Minio and referenced via S3-compatible URLs
* All services are networked internally through Docker Compose
* Caddy handles routing for `/`, `/admin`, and `/api`


