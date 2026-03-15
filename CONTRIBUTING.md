# Contributing

Thank you for your interest in contributing to the Shi-Sei Sport website.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/Shi-Sei-Sport.git`
3. Copy the environment template: `cp .env.example .env`
4. Start the development stack: `docker compose up -d --build`
5. Create a feature branch: `git checkout -b feat/your-feature`

See the [README](README.md) for detailed setup instructions.

## Development

### Frontend

```bash
cd frontend
npm install
npm run dev       # http://localhost:5173
```

### Backend

```bash
cd backend
npm install
npm run dev       # http://localhost:3000/admin
```

### Pre-commit Hooks

The project uses Husky with lint-staged. Frontend TypeScript files are auto-linted on commit. Run `npm install` in the project root to set up the hooks.

## Commit Conventions

Commit messages follow the format: `(type): description`

| Type | Use for |
|------|---------|
| `feat` | New features |
| `fix` | Bug fixes |
| `refactor` | Code restructuring without behavior changes |
| `docs` | Documentation changes |
| `chore` | Build, CI, dependency updates |

Examples:
```
(feat): Add photo download button to media page
(fix): Correct IBAN validation for Belgian accounts
(refactor): Split enrollment form into sub-components
(docs): Update API examples in backend README
```

## Pull Requests

1. Make sure your branch is up to date with `main`
2. Run the linter: `cd frontend && npm run lint`
3. Build both projects to check for errors:
   - `cd frontend && npm run build`
   - `cd backend && npm run build`
4. Open a PR against `main` with a clear description of your changes
5. CI will automatically run lint, build, security audit, Docker build, and image scanning

## Project Structure

| Directory | Description |
|-----------|-------------|
| `frontend/` | React SPA (Vite 7, React 19, Tailwind CSS) |
| `backend/` | Payload CMS v3 (Next.js 15, PostgreSQL, MinIO) |
| `caddy/` | Reverse proxy configuration |
| `scripts/` | Operations scripts (backup, restore, VPS hardening) |

See [Frontend README](frontend/README.md) and [Backend README](backend/README.md) for detailed documentation.

## Localization

The site supports Dutch (nl) and English (en). When adding user-facing text:

- Add translation keys to both `frontend/src/i18n/nl.ts` and `frontend/src/i18n/en.ts`
- Use the `t('key')` function from `LanguageContext` in components
- Backend collection labels can be localized in Payload config

## Adding a New Collection

1. Create `backend/src/collections/MyCollection.ts`
2. Add it to the `collections` array in `backend/src/payload.config.ts`
3. Optionally create seed data in `backend/src/seed/`
4. Regenerate types: `cd backend && npm run generate:types`
5. Copy types: `cp backend/src/payload-types.ts frontend/src/types/payload-types.ts`
6. Add API functions in `frontend/src/lib/api.ts`

## Code Style

- No em-dashes in comments or code - use hyphens (`-`) or commas instead
- Keep comments concise; only add them where the logic is not self-evident
- Client-side and server-side validation must stay in sync (`frontend/src/lib/validation.ts` and `backend/src/lib/validation.ts`)

## Reporting Issues

Use [GitHub Issues](https://github.com/kevin-rn/Shi-Sei-Sport/issues) for bug reports and feature requests. For security vulnerabilities, see [SECURITY.md](SECURITY.md).
