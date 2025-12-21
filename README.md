# 🥋 Shi-Sei-Sport
Webpagina van Shi-Sei Sport club

### The Architecture
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
│   │   ├── payload.config.ts  # Main config (DB connection, S3 settings)
│   │   └── collections/       # Your Data Structure
│   │       ├── Media.ts       # Image upload config
│   │       ├── News.ts        # News schema
│   │       └── Schedule.ts    # Class schedule schema
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
│       ├── components/
│       │   ├── NewsFeed.tsx   # Displays news cards
│       │   └── ScheduleTable.tsx # Displays the timetable
│       └── types/
│           └── payload-types.ts # (Generated later) TypeScript definitions
│
└── data/                      # PERSISTENT STORAGE (Created automatically)
    ├── db/                    # PostgreSQL data lives here
    └── minio/                 # Uploaded images live here
```

## Getting Started

### 1. Prerequisites

* [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
* [Node.js](https://nodejs.org/) (Optional, for local type generation).

### 2. Run the Project

Open your terminal in the project root and run:

```bash
docker compose up -d --build
```

*Wait about 1-2 minutes for the initial build and database initialization.*

### 3. Access Points

Once running, the services are available at:

| Service | URL | Description |
| --- | --- | --- |
| **Website** | `http://localhost` | The public React site |
| **Admin Panel** | `http://localhost/admin` | Create news & schedule items |
| **API** | `http://localhost/api` | Raw JSON data |
| **Minio Console** | `http://localhost:9001` | View uploaded images (User: `minio_user` / Pass: `minio_password`) |

---

## 📝 Development Workflow

### First Time Setup (Admin)

1. Go to `http://localhost/admin`.
2. Create your first **Admin User**.
3. Go to **Media** and upload a test image.
4. Go to **News** and create a post.
5. Check the homepage (`http://localhost`) to see it appear!

### Updating TypeScript Types

When you change a Collection in the Backend (e.g., adding a field to `Schedule.ts`), you need to update the types for the Frontend.

1. Open a new terminal.
2. Run the generator:
```bash
cd backend
npm install  # (Only needed once)
npm run generate:types
```


3. Copy the file to frontend:
*(Windows Powershell)*
```powershell
copy src\payload-types.ts ..\frontend\src\types\
```


*(Mac/Linux)*
```bash
cp src/payload-types.ts ../frontend/src/types/
```



### working with Tailwind CSS

The frontend uses Tailwind v3.

* **Config:** Located in `frontend/tailwind.config.js`.
* **Custom Colors:** `bg-judo-red`, `text-judo-dark` are defined in the config.
* **Icons:** We use `lucide-react` (e.g., `<Clock />`).

---

## Deployment (Production)

This stack is ready for VPS hosting (Hetzner, DigitalOcean, etc.).

### 1. DNS Setup

Point your domain's **A Record** to your server's IP address.

### 2. Configuration Changes

Before running `docker compose up` on the server, update these files:

**A. `frontend/Caddyfile**`
Change `http://localhost` to your actual domain. Caddy will automatically acquire an SSL certificate.

```caddyfile
https://your-judo-club.com {
    ...
}
```

**B. `docker-compose.yml**`
Update the Server URL environment variable for the backend service:

```yaml
PAYLOAD_PUBLIC_SERVER_URL: https://your-judo-club.com
```

### 3. Deploy

On your server:

```bash
git clone <your-repo-url>
cd judo-club
docker compose up -d --build

```

---

## Troubleshooting
**"Images are broken / 404"**
* Check if the URL is pointing to `minio:9000`.
* Ensure `frontend/src/lib/api.ts` has the logic to replace `minio:9000` with `localhost:9000` when running locally.

**"Tailwind isn't working / Styles missing"**
* Ensure you are using Tailwind v3.
* If you changed classes, rebuild the container: `docker compose up -d --build`.

**"Database connection error"**
* Ensure the `postgres` service in Docker is "Healthy" or "Running".
* Check the credentials in `docker-compose.yml` match `backend/src/payload.config.ts`.