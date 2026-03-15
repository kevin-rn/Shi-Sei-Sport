# Shi-Sei Sport - Frontend

React SPA for the Shi-Sei Sport judo club website. Fetches content from the Payload CMS backend and presents it in Dutch and English with full light/dark mode support, lazy-loaded pages, and privacy-friendly analytics.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 |
| **Build Tool** | Vite 7 with React + SVGR plugins |
| **Routing** | React Router v7 (lazy-loaded pages) |
| **Styling** | Tailwind CSS v3 + custom CSS + dark mode overrides |
| **HTTP Client** | Axios |
| **CAPTCHA** | Altcha (proof-of-work, no third-party tracking) |
| **Icons** | Lucide React |
| **Rich Text** | Lexical renderer |
| **Language** | TypeScript 5.9 |

---

## Project Structure

```
frontend/
├── Dockerfile.og               # OG meta tag server image (Node + static assets)
├── server.mjs                  # Lightweight OG server for /nieuws/* (port 3001)
├── vite.config.ts              # React + SVGR plugins, dev server on 0.0.0.0:5173
├── tailwind.config.js          # Custom colors (judo-red: #E60000), class-based dark mode
├── postcss.config.js
├── tsconfig.json
├── package.json
│
└── src/
    ├── App.tsx                 # Route definitions (17 lazy-loaded pages)
    ├── main.tsx                # Entry point (React root, providers, global CSS)
    │
    ├── assets/
    │   ├── fonts/              # Noto Sans (variable), Montserrat
    │   ├── icons/              # SVG icons
    │   ├── images/             # Static images (hero fallback, 404 page, etc.)
    │   └── logos/              # Club logos and partner logos
    │
    ├── components/
    │   ├── Navbar.tsx          # Desktop & mobile nav with dropdowns and scroll effects
    │   ├── Hero.tsx            # Hero section with rotating carousel and CTA buttons
    │   ├── HeroCarousel.tsx    # Auto-playing image carousel (Ken Burns pan/zoom effects)
    │   ├── NewsSection.tsx     # Homepage news preview cards
    │   ├── Footer.tsx          # Footer with links, partners, social media
    │   ├── DarkModeToggle.tsx  # Judogi-shaped SVG dark/light toggle with animation
    │   ├── LanguageToggle.tsx  # Dutch/English language switcher
    │   ├── PageWrapper.tsx     # Shared page layout with watermark background
    │   ├── PageHeader.tsx      # Page title with icon and red underline
    │   ├── LazyImage.tsx       # IntersectionObserver lazy loading with blur placeholder
    │   ├── RichTextRenderer.tsx # Lexical rich text JSON -> React elements
    │   ├── SearchFilter.tsx    # Reusable debounced search + filter bar
    │   ├── CustomSelect.tsx    # Styled select dropdown with focus ring
    │   ├── EnrollmentForm.tsx  # Multi-section enrollment form with CAPTCHA
    │   ├── SignaturePad.tsx    # Canvas-based signature capture
    │   ├── FillButton.tsx      # Polymorphic button/link with diagonal fill animation
    │   ├── PhoneInput.tsx      # Phone number input with country code selector
    │   ├── IbanInput.tsx       # IBAN input with country-aware formatting + validation
    │   ├── Icon.tsx            # Icon name -> SVG component map
    │   ├── LoadingDots.tsx     # Animated loading indicator (three dots)
    │   ├── LoadingState.tsx    # Full-page loading UI with spinner
    │   ├── ErrorState.tsx      # Full-page error UI with retry
    │   ├── countryCodes.ts     # Phone country code data
    │   └── enrollment/         # Enrollment form sub-components
    │       ├── PersonalInfoSection.tsx  # Name, email, phone, date of birth
    │       ├── AddressSection.tsx       # Street, postal code, city
    │       ├── PaymentSection.tsx       # IBAN, Ooievaarspas, direct debit
    │       ├── ConfirmationModal.tsx    # Review + submit confirmation dialog
    │       └── types.ts                # Enrollment form field types
    │
    ├── pages/                  # One file per route (see Routes section)
    │   ├── ContactPage.tsx
    │   ├── EnrollmentPage.tsx
    │   ├── EventsPage.tsx
    │   ├── ExamRequirementsPage.tsx
    │   ├── HistoryPage.tsx
    │   ├── LocationPage.tsx
    │   ├── MediaPage.tsx
    │   ├── NewsDetailPage.tsx
    │   ├── NewsPage.tsx
    │   ├── NotFoundPage.tsx
    │   ├── PricingPage.tsx
    │   ├── PrivacyPolicyPage.tsx
    │   ├── RulesPage.tsx
    │   ├── SchedulePage.tsx
    │   ├── TeamPage.tsx
    │   ├── TermsPage.tsx
    │   └── TrialLessonPage.tsx
    │
    ├── contexts/
    │   ├── DarkModeContext.tsx  # Dark/light mode with localStorage + system preference
    │   └── LanguageContext.tsx  # Dutch/English i18n (~1500+ translation keys)
    │
    ├── hooks/
    │   ├── useSeo.ts           # Updates document title and Open Graph meta tags
    │   ├── useFocusTrap.ts     # Keyboard focus trap for modals and dialogs
    │   ├── usePageTracking.ts  # Privacy-friendly page view tracking
    │   └── useCountdown.ts     # Timer countdown hook
    │
    ├── lib/
    │   ├── api.ts              # Axios client + all API functions (typed)
    │   ├── utils.ts            # getExcerpt() for rich text truncation
    │   └── validation.ts       # Email, phone, IBAN (mod-97), postal code validators
    │
    ├── i18n/
    │   ├── nl.ts               # Dutch translations (default language)
    │   └── en.ts               # English translations
    │
    ├── types/
    │   ├── payload-types.ts    # Generated from backend Payload schema
    │   └── altcha.d.ts         # Altcha CAPTCHA widget type stub
    │
    └── styles/
        ├── base.css            # Global resets, font-face, CSS variables, Altcha widget
        ├── animations.css      # Ken Burns, fadeIn, slideUp keyframes
        ├── buttons.css         # Hero button, nav button with diagonal fill + arrow animations
        ├── news.css            # News card hover panel animations
        ├── agenda.css          # Calendar event row styles
        ├── toggle.css          # Dark mode toggle ripple + flood animations
        └── dark/               # Dark mode CSS overrides
            ├── base.css        # Body, headings, links, scrollbar, dividers
            ├── navbar.css      # Navbar background, dropdown
            ├── cards.css       # Card surfaces, shadows, badges
            ├── buttons.css     # Button fill colors
            ├── forms.css       # Input fields, select, textarea
            ├── footer.css      # Footer background and text
            └── agenda.css      # Event row hover, timeline
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- The backend running at `http://localhost:3000` (or the full Docker stack)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev   # http://localhost:5173
```

API requests are proxied through Caddy in production (`/api/*` -> backend). In development, Vite serves the frontend and the API base URL points to `/api`, so you need either the backend running locally or the full Docker stack.

---

## Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | Home | Hero carousel + news preview + CTA buttons |
| `/rooster` | SchedulePage | Weekly training schedule by group |
| `/contact` | ContactPage | Contact form + club info + Google Maps |
| `/team` | TeamPage | Instructor profiles with photos and bio |
| `/locaties` | LocationPage | Training venues with embedded maps |
| `/geschiedenis` | HistoryPage | Club history and VCP (child safety) info |
| `/tarieven` | PricingPage | Membership pricing plans |
| `/exameneisen` | ExamRequirementsPage | Kyu and Dan grade requirements with image zoom |
| `/regels` | RulesPage | Judo rules document viewer |
| `/inschrijven` | EnrollmentPage | Enrollment form with signature, IBAN, PDF generation |
| `/nieuws` | NewsPage | News archive with search, date filter, pagination |
| `/nieuws/:slug` | NewsDetailPage | Single news article with rich text |
| `/proefles` | TrialLessonPage | Trial lesson request form |
| `/agenda` | EventsPage | Club events calendar with year filter |
| `/media` | MediaPage | Photo/video albums with lightbox viewer |
| `/privacy` | PrivacyPolicyPage | Privacy policy |
| `/voorwaarden` | TermsPage | Terms of service |
| `*` | NotFoundPage | 404 fallback with judo-themed background |

All pages are lazy-loaded via `React.lazy()` for optimal bundle splitting.

---

## Open Graph Server

News detail pages (`/nieuws/:slug`) require server-side meta tag injection for social media link previews (Facebook, Twitter, WhatsApp, etc.). The file `server.mjs` runs a lightweight Node HTTP server on port 3001 that:

1. Receives requests proxied by Caddy for `/nieuws/*`
2. Fetches the article data from the backend API
3. Injects `<meta property="og:*">` tags into the SPA's `index.html`
4. Returns the modified HTML

This is why the frontend Docker image uses `Dockerfile.og` instead of a plain static file server - it needs Node.js to run `server.mjs` alongside the static assets served by Caddy.

---

## Dark Mode

Implemented via `DarkModeContext`:

- Toggled via the judogi-shaped SVG button in the navbar (with ripple + flood fill animation)
- Persisted in `localStorage` (`darkMode` key)
- Falls back to system `prefers-color-scheme` on first visit
- Applied as a `.dark` class on `<html>` - Tailwind's `darkMode: 'class'` picks it up
- Custom CSS overrides in `styles/dark/` for components that need more than Tailwind utilities

## Language / i18n

Implemented via `LanguageContext`:

- Toggles between Dutch (`nl`, default) and English (`en`)
- Persisted in `localStorage` (`language` key)
- ~1500+ translation keys accessed via `t('key')` hook
- Locale-aware date formatting via `date-fns` (`nl` and `enUS` locales)
- Translations stored in separate files: `src/i18n/nl.ts` and `src/i18n/en.ts`

---

## Form Integrations

All forms POST to the backend API and are protected by [Altcha](https://altcha.org/) CAPTCHA (proof-of-work, no third-party services):

| Form | Endpoint | Features |
|------|----------|----------|
| Contact | `POST /api/contact` | Name, email, subject, message. Rate-limited. |
| Enrollment | `POST /api/submit-enrollment` | Multi-section form: personal info, address, payment (IBAN with mod-97 validation), signature pad. Generates PDF. |
| Trial Lesson | `POST /api/trial-lesson` | Name, email, phone (with country code selector). Rate-limited. |

### Validation

Client-side validation in `lib/validation.ts` mirrors the backend (`backend/src/lib/validation.ts`). Both must be kept in sync:
- Email: RFC-compliant regex check
- Phone: digits and common separators
- IBAN: ISO 13616 with mod-97 checksum verification
- Postal code: Dutch format (1234 AB)
- Message length: max 5000 characters

---

## Analytics

The `usePageTracking` hook sends a `POST /api/track` on each route change. Only known routes are tracked by path; unknown routes are grouped under `/404`. No cookies or PII are used. The backend handles session hashing and aggregation.

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
