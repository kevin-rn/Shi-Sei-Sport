# Shi-Sei Sport - Payload CMS Backend

A production-ready Payload CMS backend for the Shi-Sei Sport judo club website, featuring bilingual content management (Dutch/English), automated seeding, and comprehensive media handling.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Collections](#collections)
- [Seed Scripts](#seed-scripts)
- [API Usage](#api-usage)
- [Environment Variables](#environment-variables)
- [Development](#development)

---

## Features

- **Bilingual Content** - Full Dutch/English localization support
- **Document Management** - PDF/Word document uploads for exam requirements
- **Media Management** - S3-based storage with automatic image optimization
- **SEO Optimized** - Slugs, meta descriptions, and indexed fields
- **Performance** - Database indexes, default sorting, and optimized queries
- **Automated Seeding** - Pre-populated data for quick development setup
- **Rich Content** - Lexical editor with inline media uploads
- **Type-Safe** - Full TypeScript implementation with generated types
- **Audit Trails** - Automatic timestamps on all collections

---

## Tech Stack

- **[Payload CMS](https://payloadcms.com/)** - Headless CMS
- **[PostgreSQL](https://www.postgresql.org/)** - Database
- **[S3 Storage](https://aws.amazon.com/s3/)** - Media storage (MinIO for local dev)
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Lexical](https://lexical.dev/)** - Rich text editor
- **[Sharp](https://sharp.pixelplumbing.com/)** - Image processing

---

## Project Structure

```
backend/
├── assets/
│   └── Examens/              # Exam PDF documents
│       ├── 1e kyu examen programma.pdf
│       ├── 2e kyu examen programma.pdf
│       ├── 3e kyu examen programma.pdf
│       ├── 4e kuy examen programma.pdf
│       └── 5e kyu examen programma.pdf
│
├── src/
│   ├── collections/          # Payload collections
│   │   ├── Agenda.ts        # Events/calendar
│   │   ├── Albums.ts        # Photo galleries
│   │   ├── Grades.ts        # Kyu grade requirements
│   │   ├── Instructors.ts   # Instructor profiles
│   │   ├── Location.ts      # Training venues
│   │   ├── Media.ts         # Media library
│   │   ├── News.ts          # News articles
│   │   ├── Prices.ts        # Pricing plans
│   │   ├── Schedule.ts      # Training schedule
│   │   └── Users.ts         # Admin users
│   │
│   ├── globals/             # Global settings
│   │   └── PricingSettings.ts
│   │
│   ├── seed/                # Data seeding scripts
│   │   ├── agenda.ts        # Seed events
│   │   ├── grades.ts        # Seed exam grades (with PDFs)
│   │   ├── instructors.ts   # Seed instructors
│   │   ├── locations.ts     # Seed locations
│   │   ├── prices.ts        # Seed pricing
│   │   ├── pricing-settings.ts
│   │   └── schedule.ts      # Seed schedule
│   │
│   └── payload.config.ts    # Main Payload configuration
│
├── init-db.ts               # Database initialization
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- S3-compatible storage (AWS S3 or MinIO for local dev)

### Installation

1. **Install dependencies**

```bash
npm install
```

2. **Configure environment variables**

Create a `.env` file in the backend directory:

```bash
# Database
DATABASE_URI=postgresql://user:password@localhost:5432/shi-sei-sport

# Payload
PAYLOAD_SECRET=your-secret-key-here
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000

# S3 Storage
S3_BUCKET=your-bucket-name
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
S3_REGION=us-east-1
S3_ENDPOINT=http://localhost:9000  # MinIO for local dev

# Seeding
PAYLOAD_SEED=true  # Set to true to populate initial data
```

3. **Initialize database and seed data**

```bash
npm run init-db
```

This will:
- Create all database tables
- Populate collections with sample data
- Upload exam PDFs to media library
- Create bilingual content entries

4. **Start development server**

```bash
npm run dev
```

Admin panel: `http://localhost:3000/admin`

---

## Collections

### Content Collections

| Collection | Slug | Description | Localized | SEO Fields |
|------------|------|-------------|-----------|------------|
| **News** | `news` | News articles and updates | Yes | Yes (slug, excerpt) |
| **Agenda** | `agenda` | Events, holidays, exams | Yes | Yes (slug) |
| **Albums** | `albums` | Photo galleries | Yes | No |
| **KyuGrades** | `kyu-grades` | Exam requirements with PDFs | Yes | No |

### Information Collections

| Collection | Slug | Description | Localized |
|------------|------|-------------|-----------|
| **Instructors** | `instructors` | Instructor profiles | Yes |
| **Locations** | `locations` | Training venues | Yes |
| **Schedule** | `training-schedule` | Weekly training times | Yes |
| **Prices** | `prices` | Membership pricing | Yes |

### System Collections

| Collection | Slug | Description |
|------------|------|-------------|
| **Media** | `media` | Images, PDFs, documents |
| **Users** | `users` | Admin authentication |

### Global Settings

| Global | Slug | Description | Localized |
|--------|------|-------------|-----------|
| **PricingSettings** | `pricing-settings` | Registration fees | Yes (partial) |

---

## Seed Scripts

All seed scripts automatically populate bilingual content:

### Usage

```bash
# Seed all collections (when database is empty)
PAYLOAD_SEED=true npm run init-db

# Or manually run specific seeds
npm run seed:instructors
npm run seed:locations
npm run seed:schedule
npm run seed:prices
npm run seed:grades
npm run seed:agenda
```

### What Gets Seeded

1. **Instructors** - 2 instructor profiles with bios
2. **Locations** - 2 training venues with Google Maps integration
3. **Schedule** - Weekly training schedule
4. **Prices** - 2 pricing plans (Youth & Adults)
5. **Pricing Settings** - Registration fees and Ooievaarspas info
6. **Agenda** - Sample events and holidays
7. **Grades** - 5 Kyu grades with exam PDFs automatically uploaded

---

## API Usage

### Base URL

```
http://localhost:3000/api
```

### Endpoints

#### Get Localized Content

```bash
# Get all news articles in Dutch
GET /api/news?locale=nl&status=published

# Get all news articles in English
GET /api/news?locale=en&status=published

# Get specific news by slug
GET /api/news?where[slug][equals]=eerste-artikel&locale=nl
```

#### Get Grades with PDFs

```bash
# Get all grades with documents (depth=1 populates relationships)
GET /api/kyu-grades?locale=nl&depth=1&sort=order

# Response includes:
{
  "docs": [{
    "beltLevel": "yellow-5kyu",
    "kyuRank": 5,
    "title": "Eisen Judo Examen - 5e Kyu (Gele Band)",
    "examDocument": {
      "id": "...",
      "filename": "5e kyu examen programma.pdf",
      "url": "https://your-bucket.s3.amazonaws.com/...",
      "mimeType": "application/pdf"
    }
  }]
}
```

#### Get Schedule with Relations

```bash
# Get schedule with instructor and location details
GET /api/training-schedule?locale=nl&depth=2&sort=day
```

#### Get Pricing

```bash
# Get all pricing plans
GET /api/prices?locale=nl&sort=displayOrder

# Get pricing settings (global)
GET /api/globals/pricing-settings?locale=nl
```

#### Get Agenda Events

```bash
# Get upcoming events
GET /api/agenda?locale=nl&where[startDate][greater_than_equal]=2024-01-01&sort=startDate

# Get events by category
GET /api/agenda?locale=nl&where[category][equals]=exam
```

### Query Parameters

- `locale` - Language (nl/en)
- `depth` - Populate relationships (0-10)
- `limit` - Results per page (default: 10)
- `page` - Page number
- `sort` - Sort field (prefix with - for descending)
- `where` - Filter conditions

### Example Response Format

```json
{
  "docs": [...],      // Array of documents
  "totalDocs": 50,    // Total number of documents
  "limit": 10,        // Results per page
  "totalPages": 5,    // Total number of pages
  "page": 1,          // Current page
  "pagingCounter": 1,
  "hasPrevPage": false,
  "hasNextPage": true,
  "prevPage": null,
  "nextPage": 2
}
```

---

## Environment Variables

### Required

```bash
# Database connection
DATABASE_URI=postgresql://user:password@host:port/database

# Payload CMS secret (generate with: openssl rand -base64 32)
PAYLOAD_SECRET=your-secure-random-secret

# Public server URL
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
```

### S3 Storage

```bash
# S3 Bucket Configuration
S3_BUCKET=your-bucket-name
S3_ACCESS_KEY=your-access-key-id
S3_SECRET_KEY=your-secret-access-key
S3_REGION=us-east-1

# MinIO (local development)
S3_ENDPOINT=http://localhost:9000
```

### Optional

```bash
# Enable/disable seeding
PAYLOAD_SEED=true

# Port (default: 3000)
PORT=3000
```

---

## Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Initialize/reset database with seed data
PAYLOAD_SEED=true npm run init-db

# Generate TypeScript types
npm run generate:types
```

### TypeScript Types

Generated types are exported to `shared-types/payload-types.ts` and can be imported in the frontend:

```typescript
import type { News, Instructor, Schedule } from '../backend/shared-types/payload-types'
```

### Adding New Collections

1. Create collection file in `src/collections/`
2. Import and add to `payload.config.ts` collections array
3. Create seed script in `src/seed/` (optional)
4. Add seed to `init-db.ts` (optional)
5. Run `npm run generate:types` to update types

### Database Schema Changes

Payload automatically syncs schema changes when using `push: true` in the PostgreSQL adapter. Simply modify your collections and restart the server.

---

## Key Features Explained

### Localization

All user-facing content supports Dutch (nl) and English (en):

```typescript
// Create content in default locale (Dutch)
const doc = await payload.create({
  collection: 'news',
  locale: 'nl',
  data: { title: 'Nederlandse titel', ... }
})

// Update with English translation
await payload.update({
  collection: 'news',
  id: doc.id,
  locale: 'en',
  data: { title: 'English title', ... }
})
```

### File Uploads

Upload files programmatically using the Local API:

```typescript
import fs from 'fs'

const fileBuffer = fs.readFileSync('/path/to/file.pdf')
const file = new File([fileBuffer], 'filename.pdf', {
  type: 'application/pdf'
})

const media = await payload.create({
  collection: 'media',
  data: { alt: { nl: 'Alt text', en: 'Alt text' } },
  file,
})
```

### Rich Text Editor

Uses Lexical editor with support for:
- Bold, italic, underline formatting
- Headings and lists
- Inline media uploads
- Links

### Access Control

Currently configured for public read access. To add authentication:

```typescript
access: {
  read: ({ req: { user } }) => {
    if (user) return true
    return { status: { equals: 'published' } }
  },
}
```

---

## Troubleshooting

### Database Connection Issues

```bash
# Test PostgreSQL connection
psql -h localhost -U user -d shi-sei-sport

# Check if database exists
psql -U user -l
```

### S3 Upload Failures

```bash
# For MinIO local development, ensure it's running
docker run -p 9000:9000 -p 9001:9001 minio/minio server /data --console-address ":9001"

# Test S3 credentials
aws s3 ls s3://your-bucket-name --endpoint-url=http://localhost:9000
```

### Seed Script Errors

```bash
# Clear database and re-seed
npm run init-db

# Check if PDF files exist
ls -la assets/Examens/
```

---
## Other

When updating collections:

1. Add localization to all user-facing text fields
2. Include timestamps (`timestamps: true`)
3. Add appropriate indexes for frequently queried fields
4. Specify `hasMany` explicitly on relationship fields
5. Add default sorting where applicable
6. Update this README with any new collections/features
7. Check the [Payload CMS Documentation](https://payloadcms.com/docs)
