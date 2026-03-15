# Shi-Sei Sport - Backend

Payload CMS v3 backend for the Shi-Sei Sport judo club website. Provides a headless CMS admin panel, REST API, media handling, privacy-friendly analytics, and custom form endpoints for contact, enrollment, and trial lessons.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **CMS** | Payload CMS v3.75 |
| **Framework** | Next.js 15 (App Router, standalone output) |
| **Database** | PostgreSQL (via `@payloadcms/db-postgres`) |
| **Storage** | MinIO / S3-compatible (`@payloadcms/storage-s3`) |
| **Email** | Nodemailer (`@payloadcms/email-nodemailer`) - dual transporter setup |
| **Rich Text** | Lexical editor with fixed toolbar, uploads, and captions |
| **Image Processing** | Sharp (thumbnails, WebP, JPEG downloads) |
| **PDF** | pdf-lib (enrollment form filling, signature embedding) |
| **CAPTCHA** | Altcha (proof-of-work, no third-party tracking) |
| **Logging** | Structured JSON logger with timestamps |
| **Language** | TypeScript 5 |

---

## Project Structure

```
backend/
├── Dockerfile                    # Multi-stage build (base, deps, builder, runner)
├── entrypoint.sh                 # DB wait, migration, seed, server start
├── init-db.ts                    # Database initialization + seeding
├── next.config.mjs               # output: 'standalone', withPayload() wrapper
├── loader.mjs                    # ESM import map for Payload CLI
├── package.json
├── tsconfig.json
│
├── assets/
│   └── Formulieren/              # PDF templates for enrollment forms
│
├── public/
│   ├── shi-sei-logo.png          # Full-size logo (admin UI)
│   └── shi-sei-logo-email.png    # Resized logo for email attachments
│
└── src/
    ├── payload.config.ts         # Main Payload configuration
    ├── server.ts                 # Custom Next.js server
    │
    ├── app/
    │   ├── (payload)/
    │   │   ├── layout.tsx        # Admin layout with custom CSS
    │   │   └── api/
    │   │       ├── [...slug]/    # Payload REST API proxy (all collections/globals)
    │   │       ├── altcha-challenge/  # CAPTCHA challenge generation (5-min expiry)
    │   │       ├── contact/     # Contact form handler
    │   │       ├── submit-enrollment/ # Enrollment + PDF generation + S3 backup
    │   │       ├── trial-lesson/ # Trial lesson request handler
    │   │       └── track/       # Analytics tracking endpoint (SHA-256 sessions)
    │   ├── robots.txt/          # SEO robots.txt route
    │   └── sitemap.xml/         # Dynamic SEO sitemap (static + news articles)
    │
    ├── collections/
    │   ├── Agenda.ts             # Events, holidays, exams with date validation
    │   ├── Albums.ts             # Photo/video galleries (hero carousel source)
    │   ├── Documents.ts          # Regulations & enrollment PDFs
    │   ├── Grades.ts             # Kyu & Dan grade requirements
    │   ├── Instructors.ts        # Instructor profiles with bio and gallery
    │   ├── Location.ts           # Training venues with Google Maps embed
    │   ├── Media.ts              # Images & documents (S3, thumbnail + WebP + JPEG sizes)
    │   ├── News.ts               # News articles with SEO slugs
    │   ├── PageViews.ts          # Daily page view aggregates (privacy-friendly)
    │   ├── Prices.ts             # Membership plans and pricing settings
    │   ├── Schedule.ts           # Weekly training schedule by group and day
    │   ├── Users.ts              # Admin panel authentication
    │   └── VideoEmbeds.ts        # YouTube/Vimeo embed URLs (no file upload)
    │
    ├── globals/
    │   ├── ContactInfo.ts        # Club contact details (address, phone, email)
    │   └── VCPInfo.ts            # Vertrouwenscontactpersoon (child safety) info
    │
    ├── components/
    │   ├── AnalyticsDashboard.tsx # Admin dashboard analytics widget
    │   ├── AuthBranding.tsx      # Custom branding on forgot/reset pages
    │   ├── Logo.tsx              # Custom admin logo
    │   ├── Icon.tsx              # Custom admin icon
    │   └── ThemeToggle.tsx       # Light/dark mode toggle for admin
    │
    ├── lib/
    │   ├── fill-pdf.ts           # PDF form filling (enrollment + direct debit)
    │   ├── mail.ts               # Dual-transporter email with HTML templates
    │   ├── rateLimit.ts          # In-memory per-IP rate limiter (auto-cleanup)
    │   ├── validation.ts         # Server-side validation (email, IBAN mod-97, etc.)
    │   └── logger.ts             # Structured JSON logger
    │
    ├── seed/                     # Database seeding scripts (one per collection)
    └── styles/                   # Custom Payload admin CSS (branded icons, auth)
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- S3-compatible storage (MinIO for local dev)
- SMTP email account

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Database
DATABASE_URI=postgresql://user:password@localhost:5432/shisei_sport_db

# Payload CMS
PAYLOAD_SECRET=your-jwt-secret-here
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000

# S3 / MinIO Storage
S3_BUCKET=judo-bucket
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
S3_REGION=eu-central-1
S3_ENDPOINT=http://localhost:9000   # MinIO local dev

# Email - Contact & Enrollment forms
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_PASS=your-smtp-password
CONTACT_EMAIL=info@example.com      # Sends + receives contact/enrollment emails

# Email - Trial lesson form
TRIAL_LESSON_EMAIL=proefles@example.com  # Sends + receives trial lesson emails

# Optional BCC for club-facing emails
BCC_EMAIL=

# CAPTCHA (Altcha)
ALTCHA_SECRET=your-altcha-secret

# Seeding (optional)
PAYLOAD_SEED=true
```

> Both email accounts use the same SMTP host/port/pass. Each uses its own address as `SMTP_USER` for authentication.

### Start Development Server

```bash
npm run dev       # http://localhost:3000/admin
```

### Initialize Database with Seed Data

```bash
npm run init-db
```

This connects to Payload, runs migrations, and (if `PAYLOAD_SEED=true`) populates empty collections with sample data. Seeding is idempotent: it checks collection count before inserting to prevent duplicates.

Seed order: Instructors -> Locations -> Schedule -> Prices -> Agenda -> Grades -> Documents -> Albums -> Media -> Globals.

---

## Collections

### Content

| Collection | Slug | Description | Localized |
|------------|------|-------------|-----------|
| News | `news` | News articles with SEO slugs and excerpts | Yes |
| Agenda | `agenda` | Events, holidays, exams with date validation | Yes |
| Albums | `albums` | Photo/video galleries (used by hero carousel) | Yes |
| Grades | `grades` | Kyu (5-1) and Dan grade requirements with exam PDFs | Yes |

### Club Info

| Collection | Slug | Description | Localized |
|------------|------|-------------|-----------|
| Instructors | `instructors` | Profiles with bio, rank, photo, gallery | Yes |
| Locations | `locations` | Training venues with Google Maps embed | Yes |
| Schedule | `training-schedule` | Weekly training times by group and day | Yes |
| Prices | `prices` | Membership plans and pricing settings | Yes |
| Documents | `documents` | Regulations and enrollment form PDFs | Yes |

### Media

| Collection | Slug | Description |
|------------|------|-------------|
| Media | `media` | Images and documents stored on S3 (thumbnail, card, WebP, JPEG sizes) |
| VideoEmbeds | `video-embeds` | YouTube/Vimeo embed URLs (no file upload) |

### System

| Collection | Slug | Description |
|------------|------|-------------|
| Users | `users` | Admin panel authentication (max 5 login attempts, 15-min lockout) |
| PageViews | `page-views` | Daily page view aggregates per path/device/browser |

### Globals

| Global | Slug | Description | Localized |
|--------|------|-------------|-----------|
| ContactInfo | `contact-info` | Address, phone numbers, email addresses | No |
| VCPInfo | `vcp-info` | Vertrouwenscontactpersoon details and child safety info | Yes |

---

## Custom API Endpoints

In addition to the Payload REST API, the following custom routes are available:

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| `GET` | `/api/altcha-challenge` | Generate an Altcha CAPTCHA challenge (5-min expiry) | - |
| `POST` | `/api/contact` | Submit contact form (validates name/email/subject/message, CAPTCHA-verified) | 5 req/60s |
| `POST` | `/api/submit-enrollment` | Submit enrollment form with PDF generation, signature embedding, S3 backup | 5 req/60s |
| `POST` | `/api/trial-lesson` | Submit trial lesson request (validates name/email/phone, CAPTCHA-verified) | 5 req/60s |
| `POST` | `/api/track` | Record a page view (privacy-friendly, returns 204 silent) | 30 req/60s |

### SEO Routes

| Method | Endpoint | Cache | Description |
|--------|----------|-------|-------------|
| `GET` | `/robots.txt` | 1 day | Allow all, points to sitemap |
| `GET` | `/sitemap.xml` | 1 hour | 15 static routes + dynamic news articles (up to 1000) |

### Rate Limiting

Form endpoints are protected by in-memory rate limiting per client IP (extracted from `x-forwarded-for` header via Caddy). Expired entries are cleaned up automatically every 5 minutes.

### Email System

Two nodemailer transporters share the same SMTP host/port/password but use different sender addresses:

| Transporter | Env Var | Used By |
|-------------|---------|---------|
| Contact | `CONTACT_EMAIL` | Contact form and enrollment form emails |
| Trial | `TRIAL_LESSON_EMAIL` | Trial lesson request emails |

`BCC_EMAIL` (optional) is applied only to club-facing notifications, not user confirmation emails. The `sendMail()` helper in `lib/mail.ts` accepts `account: 'contact' | 'trial'` and `bcc: true` parameters.

Email templates use `escapeHtml()` for all user-provided content. The club logo (`public/shi-sei-logo-email.png`) is attached as a CID image.

### PDF Generation

The enrollment endpoint uses `pdf-lib` to fill PDF form templates stored in `assets/Formulieren/`:

- **Inschrijfformulier** - enrollment registration form
- **Machtiging Incasso** - direct debit authorization (skipped for Ooievaarspas members)

Signatures are embedded as PNG images from data URLs. Filled PDFs are flattened and copies are saved to MinIO for club records.

### Analytics

Privacy-friendly page view tracking:

- No cookies, no PII stored
- Session hash: SHA-256 of IP + User-Agent + date, rotated daily
- Upserts daily aggregate row per path + device + browser combination
- `AnalyticsDashboard` component renders on the Payload admin panel showing total views, unique visitors, top pages, devices, browsers, and a daily chart

---

## API Usage

### Base URL

```
http://localhost:3000/api
```

### Common Query Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `locale` | Language (`nl` or `en`) | `?locale=nl` |
| `depth` | Populate relationships (0-10) | `?depth=1` |
| `limit` | Results per page (default: 10) | `?limit=20` |
| `page` | Page number | `?page=2` |
| `sort` | Sort field (prefix `-` for descending) | `?sort=-createdAt` |
| `where` | Filter conditions | `?where[status][equals]=published` |

### Examples

```bash
# Get published news articles in Dutch
GET /api/news?locale=nl&where[status][equals]=published&sort=-createdAt

# Get training schedule with instructors and locations populated
GET /api/training-schedule?locale=nl&depth=2&sort=day

# Get grades sorted by order
GET /api/grades?locale=nl&depth=1&sort=order

# Get contact info global
GET /api/globals/contact-info

# Get upcoming agenda events
GET /api/agenda?locale=nl&where[startDate][greater_than_equal]=2025-01-01&sort=startDate
```

### Response Format

```json
{
  "docs": [...],
  "totalDocs": 50,
  "limit": 10,
  "totalPages": 5,
  "page": 1,
  "hasPrevPage": false,
  "hasNextPage": true,
  "prevPage": null,
  "nextPage": 2
}
```

---

## Payload Configuration

### Localization

- **Languages:** Dutch (nl, default) + English (en) with fallback enabled
- **Custom translations:** Authentication, field labels, and validation messages in Dutch

### Admin Panel

- Custom branded Logo and Icon components
- Light + dark theme support with toggle on login page
- Analytics dashboard widget (`afterDashboard`)
- Custom CSS with collection-specific sidebar/card icons

### Rich Text Editor

Lexical editor configured with:
- Fixed toolbar
- Upload support (media and video-embeds collections)
- Media captions field

### Storage

S3 adapter for the `media` collection:
- Force path-style (MinIO-compatible)
- Bucket, credentials, region, endpoint from env vars
- Image sizes: thumbnail (400px), card (800px), WebP (2560px), JPEG download (2560px)

---

## Available Scripts

```bash
npm run dev              # Development server with hot reload
npm run build            # Production build (Next.js standalone)
npm start                # Start production server
npm run init-db          # Initialize database and optionally seed data
npm run generate:types   # Generate TypeScript types from Payload schema
npm run migrate          # Run pending database migrations
npm run migrate:create   # Create a new migration file
```

---

## Docker

The backend Dockerfile is a multi-stage build:

1. **base** - Node 22 slim with NPM notifier disabled
2. **deps** - Install dependencies (includes build-essential for native modules like Sharp)
3. **builder** - Generate types, import maps, build Next.js
4. **runner** - Production image with only necessary files

The `entrypoint.sh` script runs on container start:
1. Waits for PostgreSQL to be ready
2. Restores MinIO from backup if data directory is empty
3. Checks for database restore flag (skips migration generation + seeding if restored)
4. Auto-generates initial migration if none exist
5. Runs pending migrations
6. Seeds database (if not restored from backup)
7. Starts `node server.js`

> **Important:** Next.js `output: 'standalone'` does NOT auto-serve `/public` files. Use inline data URIs in CSS instead of `url('/path/to/file')`.

---

## TypeScript Types

After modifying collections, regenerate types:

```bash
npm run generate:types
# Then copy to frontend:
cp src/payload-types.ts ../frontend/src/types/payload-types.ts
```

---

## Adding a New Collection

1. Create `src/collections/MyCollection.ts`
2. Import and add to the `collections` array in `src/payload.config.ts`
3. Optionally create `src/seed/my-collection.ts` and register it in `init-db.ts`
4. Run `npm run generate:types` and copy types to the frontend

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Database connection error | Check `DATABASE_URI` and ensure PostgreSQL is running |
| S3 upload failures | Verify MinIO is running; check `S3_ENDPOINT`, `S3_ACCESS_KEY`, `S3_SECRET_KEY` |
| Email not sending | Verify `SMTP_HOST`, `SMTP_PORT`, `SMTP_PASS`, `CONTACT_EMAIL`, `TRIAL_LESSON_EMAIL` |
| Seed data missing | Set `PAYLOAD_SEED=true` and re-run `npm run init-db` |
| Types out of sync | Run `npm run generate:types` after modifying collections |
| PDF generation fails | Check that PDF templates exist in `assets/Formulieren/` |
| Static files not served | Standalone mode - use inline data URIs, not `url('/path')` |
| CAPTCHA fails | Verify `ALTCHA_SECRET` is set and matches frontend config |
| Rate limit errors | Wait 60s or restart backend to clear in-memory store |
