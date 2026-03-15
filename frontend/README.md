# Shi-Sei Sport - Frontend

React SPA for the Shi-Sei Sport judo club website. Fetches content from the Payload CMS backend and presents it in Dutch and English with light/dark mode support.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 |
| **Build Tool** | Vite 7 |
| **Routing** | React Router v7 |
| **Styling** | Tailwind CSS v3 + custom CSS |
| **HTTP Client** | Axios |
| **Language** | TypeScript 5.9 |

---

## Project Structure

```
frontend/src/
├── App.tsx                 # Route definitions (lazy-loaded pages)
├── main.tsx                # Entry point
├── assets/                 # Fonts, icons, images, logos
├── components/
│   ├── Navbar.tsx          # Desktop & mobile navigation with dropdowns
│   ├── Hero.tsx            # Hero section with rotating carousel
│   ├── HeroCarousel.tsx    # Auto-playing image carousel (Ken Burns effects)
│   ├── NewsSection.tsx     # Homepage news preview carousel
│   ├── Footer.tsx          # Footer with links, partners, social
│   ├── DarkModeToggle.tsx  # Judogi-shaped dark/light toggle
│   ├── LanguageToggle.tsx  # Dutch/English language switcher
│   ├── PageWrapper.tsx     # Shared page layout with watermark background
│   ├── PageHeader.tsx      # Page title with icon and red underline
│   ├── LazyImage.tsx       # IntersectionObserver lazy loading
│   ├── RichTextRenderer.tsx # Lexical rich text → React
│   ├── SearchFilter.tsx    # Reusable search + filter bar
│   ├── EnrollmentForm.tsx  # Enrollment form with signature pad and CAPTCHA
│   ├── SignaturePad.tsx    # Canvas-based signature capture
│   ├── Icon.tsx            # Icon name → SVG component map
│   ├── FillButton.tsx      # Polymorphic button/link with fill animation
│   ├── LoadingDots.tsx     # Animated loading indicator
│   ├── LoadingState.tsx    # Full-page loading UI
│   └── ErrorState.tsx      # Full-page error UI
├── pages/                  # One file per route (see Routes section)
├── contexts/
│   ├── DarkModeContext.tsx # Dark/light mode with localStorage persistence
│   └── LanguageContext.tsx # Dutch/English i18n (~1500+ translation keys)
├── hooks/
│   ├── useSeo.ts           # Updates document title and Open Graph meta tags
│   └── useFocusTrap.ts     # Keyboard focus trap for modals
├── lib/
│   ├── api.ts              # Axios client + all API functions
│   ├── utils.ts            # getExcerpt() for rich text truncation
│   └── validation.ts       # Email, phone, IBAN, postal code validators
├── types/
│   ├── payload-types.ts    # Generated from backend Payload schema
│   └── altcha.d.ts         # Altcha CAPTCHA widget type stub
└── styles/
    ├── base.css            # Global resets, font-face, CSS variables
    ├── animations.css      # @keyframes definitions
    ├── buttons.css         # Hero and download button styles
    ├── news.css            # News card animations
    ├── agenda.css          # Calendar event styles
    ├── toggle.css          # Dark mode toggle animation
    └── dark/               # Dark mode CSS overrides
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- The backend running at `http://localhost:3000` (or configured via Caddy)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev   # http://localhost:5173
```

API requests are proxied through Caddy in production (`/api/*` → backend). In development, Vite serves the frontend and the API base URL is set to `/api`, so you need the backend running locally or the full Docker stack.

---

## Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | Home | Hero carousel + news preview |
| `/rooster` | SchedulePage | Weekly training schedule |
| `/contact` | ContactPage | Contact form + club info |
| `/team` | TeamPage | Instructor profiles |
| `/locaties` | LocationPage | Training venues with map |
| `/geschiedenis` | HistoryPage | Club history and VCP info |
| `/tarieven` | PricingPage | Membership pricing plans |
| `/exameneisen` | ExamRequirementsPage | Kyu and Dan grade requirements |
| `/regels` | RulesPage | Judo rules document viewer |
| `/inschrijven` | EnrollmentPage | Membership enrollment form |
| `/nieuws` | NewsPage | News archive with search and filter |
| `/nieuws/:slug` | NewsDetailPage | Single news article |
| `/proefles` | TrialLessonPage | Trial lesson request form |
| `/agenda` | EventsPage | Club events calendar |
| `/media` | MediaPage | Photo and video albums |
| `/privacy` | PrivacyPolicyPage | Privacy policy |
| `/voorwaarden` | TermsPage | Terms of service |
| `*` | NotFoundPage | 404 fallback |

All pages are lazy-loaded for optimal bundle splitting.

---

## Open Graph Server

News detail pages (`/nieuws/:slug`) require server-side meta tag injection for social media link previews (Facebook, Twitter, WhatsApp, etc.). The file `server.mjs` runs a lightweight Node HTTP server on port 3001 that:

1. Receives requests proxied by Caddy for `/nieuws/*`
2. Fetches the article data from the backend API
3. Injects `<meta property="og:*">` tags into the SPA's `index.html`
4. Returns the modified HTML

This is why the frontend Docker image uses `Dockerfile.og` instead of a plain static file server - it needs Node.js to run `server.mjs` alongside the static assets served by Caddy.

---

## Dark Mode & Language

**Dark Mode** (`DarkModeContext`):
- Toggled via the judogi-shaped button in the navbar
- Persisted in `localStorage` (`darkMode`)
- Falls back to system `prefers-color-scheme` on first visit
- Applied as a `.dark` class on `<html>` - Tailwind's `darkMode: 'class'` picks it up

**Language** (`LanguageContext`):
- Toggles between Dutch (`nl`) and English (`en`)
- Persisted in `localStorage` (`language`)
- Translation keys accessed via `t('key')` hook
- Locale-aware date formatting via `date-fns`
- Translations stored in separate files: `src/i18n/nl.ts` and `src/i18n/en.ts`

---

## Form Integrations

All forms POST to the backend API and are protected by [Altcha](https://altcha.org/) CAPTCHA:

| Form | Endpoint | Notes |
|------|----------|-------|
| Contact | `POST /api/contact` | Rate-limited, sends email to club |
| Enrollment | `POST /api/submit-enrollment` | Includes signature pad, IBAN validation, generates PDF |
| Trial Lesson | `POST /api/trial-lesson` | Rate-limited, sends email to club |

---

## Available Scripts

```bash
npm run dev      # Vite dev server (http://localhost:5173, hot reload)
npm run build    # TypeScript check + production build
npm run lint     # ESLint
npm run preview  # Preview production build locally
```

---

## TypeScript Types

Types are generated from the Payload CMS schema. After modifying backend collections:

```bash
# In backend/
npm run generate:types

# Copy to frontend
cp src/payload-types.ts ../frontend/src/types/payload-types.ts
```
