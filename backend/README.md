# Shi-Sei Sport — Backend

Payload CMS v3 backend for the Shi-Sei Sport judo club website. Provides a headless CMS admin panel, REST API, media handling, and custom form endpoints for contact, enrollment, and trial lessons.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **CMS** | Payload CMS v3.75 |
| **Framework** | Next.js 15 (App Router) |
| **Database** | PostgreSQL (via `@payloadcms/db-postgres`) |
| **Storage** | MinIO / S3-compatible (`@payloadcms/storage-s3`) |
| **Email** | Nodemailer (`@payloadcms/email-nodemailer`) |
| **Rich Text** | Lexical editor |
| **Image Processing** | Sharp |
| **Language** | TypeScript |

---

## Project Structure

```
backend/
├── src/
│   ├── app/
│   │   └── (payload)/
│   │       └── api/
│   │           ├── [...slug]/          # Payload REST API proxy
│   │           ├── altcha-challenge/   # CAPTCHA challenge endpoint
│   │           ├── contact/            # Contact form handler
│   │           ├── submit-enrollment/  # Enrollment form + PDF generation
│   │           └── trial-lesson/       # Trial lesson request handler
│   ├── collections/
│   │   ├── Agenda.ts           # Events & calendar
│   │   ├── Albums.ts           # Photo/video galleries
│   │   ├── Documents.ts        # Regulations & enrollment PDFs
│   │   ├── Grades.ts           # Kyu & Dan grade requirements
│   │   ├── Instructors.ts      # Instructor profiles
│   │   ├── Location.ts         # Training venues
│   │   ├── Media.ts            # Images & documents (S3)
│   │   ├── News.ts             # News articles
│   │   ├── Prices.ts           # Membership pricing plans
│   │   ├── Schedule.ts         # Weekly training schedule
│   │   ├── Users.ts            # Admin users
│   │   └── VideoEmbeds.ts      # YouTube/Vimeo embed URLs
│   ├── globals/
│   │   ├── ContactInfo.ts      # Club contact details
│   │   └── VCPInfo.ts          # Vertrouwenscontactpersoon info
│   ├── components/
│   │   ├── Logo.tsx            # Custom admin logo
│   │   ├── Icon.tsx            # Custom admin icon
│   │   └── ThemeToggle.tsx     # Light/dark mode toggle
│   ├── lib/
│   │   ├── fill-pdf.ts         # PDF form filling (enrollment)
│   │   ├── mail.ts             # Email helpers (dual-transporter)
│   │   └── rateLimit.ts        # In-memory per-IP rate limiter
│   ├── seed/                   # Database seeding scripts
│   ├── styles/                 # Custom Payload admin CSS
│   └── payload.config.ts       # Main Payload configuration
├── init-db.ts                  # Database initialization + seeding
└── package.json
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

# Email — Contact & Enrollment forms
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_PASS=your-smtp-password
CONTACT_EMAIL=info@example.com      # Sends + receives contact/enrollment emails

# Email — Trial lesson form
TRIAL_LESSON_EMAIL=proefles@example.com  # Sends + receives trial lesson emails

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

This creates all tables and (if `PAYLOAD_SEED=true`) populates collections with sample data.

---

## Collections

### Content

| Collection | Slug | Description | Localized |
|------------|------|-------------|-----------|
| News | `news` | News articles with SEO slugs and excerpts | Yes |
| Agenda | `agenda` | Events, holidays, exams with date validation | Yes |
| Albums | `albums` | Photo/video galleries (used by hero carousel) | Yes |
| Grades | `grades` | Kyu (5–1) and Dan grade requirements with exam PDFs | Yes |

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
| Media | `media` | Images and documents stored on S3 |
| VideoEmbeds | `video-embeds` | YouTube/Vimeo embed URLs (no file upload) |

### System

| Collection | Slug | Description |
|------------|------|-------------|
| Users | `users` | Admin panel authentication |
| PageViews | `page-views` | Daily page view aggregates (privacy-friendly analytics) |

### Globals

| Global | Slug | Description | Localized |
|--------|------|-------------|-----------|
| ContactInfo | `contact-info` | Address, phone numbers, email addresses | No |
| VCPInfo | `vcp-info` | Vertrouwenscontactpersoon details and child safety info | Yes |

---

## Custom API Endpoints

In addition to the Payload REST API, the following custom routes are available:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/altcha-challenge` | Generate an Altcha CAPTCHA challenge (5-min expiry) |
| `POST` | `/api/contact` | Submit contact form (rate-limited, CAPTCHA-verified) |
| `POST` | `/api/submit-enrollment` | Submit enrollment form with PDF generation and S3 backup |
| `POST` | `/api/trial-lesson` | Submit trial lesson request (rate-limited, CAPTCHA-verified) |
| `POST` | `/api/track` | Record a page view (privacy-friendly analytics, rate-limited) |

### Rate Limiting

Form endpoints are protected by in-memory rate limiting per client IP (via `x-forwarded-for`). Expired entries are cleaned up automatically every 5 minutes.

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/contact` | 5 requests | 60 seconds |
| `/api/trial-lesson` | 5 requests | 60 seconds |
| `/api/submit-enrollment` | 5 requests | 60 seconds |
| `/api/track` | 30 requests | 60 seconds |

### Email System

Two nodemailer transporters share the same SMTP host/port/password but use different sender addresses:

- **Contact transporter** (`CONTACT_EMAIL`) — contact form and enrollment form emails
- **Trial transporter** (`TRIAL_LESSON_EMAIL`) — trial lesson request emails

`BCC_EMAIL` (optional) is applied only to club-facing notifications, not user confirmation emails. The `sendMail()` helper in `lib/mail.ts` accepts `account: 'contact' | 'trial'` and `bcc: true` parameters.

Email templates use `escapeHtml()` for all user-provided content. The club logo (`public/shi-sei-logo-email.png`) is attached as a CID image.

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
| `depth` | Populate relationships (0–10) | `?depth=1` |
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

## Available Scripts

```bash
npm run dev              # Development server with hot reload
npm run build            # Production build
npm start                # Start production server
npm run init-db          # Initialize database and optionally seed data
npm run generate:types   # Generate TypeScript types from Payload schema
npm run migrate          # Run pending database migrations
npm run migrate:create   # Create a new migration
```

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
