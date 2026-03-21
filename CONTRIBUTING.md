# Contributing to XYNHub

## Project Structure

```
xynhub.com/
├── apps/
│   ├── web/              # React landing page (Vite + Tailwind CSS 4)
│   ├── api/              # Hono.js REST API
│   └── admin/            # Next.js 15 CMS admin panel
├── packages/
│   ├── shared/           # Shared types, Zod schemas, constants
│   └── supabase/         # Database config, migrations, seed data
```

## Development Setup

```bash
npm install                      # Install all workspace dependencies
cd packages/supabase && npx supabase start  # Start local database
npm run dev:api                  # Start API (port 3000)
npm run dev:web                  # Start frontend (port 5173)
npm run dev:admin                # Start admin CMS (port 3001)
```

## Tech Stack

| Layer | Stack |
|-------|-------|
| Frontend | React 19, Vite 8, Tailwind CSS 4, React Router 7 |
| API | Hono.js, Zod, Supabase client |
| Admin | Next.js 15, Zustand, TanStack Query |
| Database | Supabase (PostgreSQL), RLS policies |
| Shared | TypeScript, Zod schemas |

## Conventions

### Naming

```typescript
// Components: PascalCase
export function BentoCard() {}
export function PageHeader() {}

// Files: PascalCase for components, kebab-case for utils
// src/components/ui/BentoCard.tsx
// src/lib/utils.ts

// API routes: kebab-case
// /api/v1/page-contents
```

### Code Style

- TypeScript strict mode across all packages
- Zod schemas in `packages/shared` for API validation
- Shared types imported via `@xynhub/shared`
- No hardcoded content in components - all data from API

### Frontend (apps/web)

- Follow `UI_RULES.md` design system strictly
- Use design tokens from `src/index.css` (never arbitrary Tailwind colors)
- Use `BentoCard`, `PageHeader`, `SectionHeader` components
- Fetch data from API, show loading states

### API (apps/api)

- All routes validate input with Zod schemas from `@xynhub/shared`
- Public routes: no auth, read-only
- Admin routes: require Bearer token + email whitelist check
- Use `supabaseAdmin` for admin operations, `supabasePublic` for public reads
- Return consistent `{ success, data }` response format

### Database

- Migrations in `packages/supabase/supabase/migrations/`
- New migration: `npx supabase migration new <name>`
- RLS enabled on all tables
- Use JSONB for flexible page content, relational tables for dynamic entities

## Workflow

```bash
# Create feature branch
git switch -c feature/your-feature

# Make changes and verify
npm run build:web
npm run build:api

# Commit
git commit -m "feat: description of change"
git push origin feature/your-feature
```

### Commit Messages

Follow conventional commits:

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation
- `refactor:` code restructuring
- `chore:` maintenance tasks
