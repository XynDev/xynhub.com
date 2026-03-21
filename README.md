# XYNHub - Engineering Ecosystem

A full-stack monorepo powering the XYNHub landing page and content management system. Built with React, Hono.js, Next.js, and Supabase.

## Architecture

```
xynhub.com/
├── apps/
│   ├── web/           # Landing page (React 19 + Vite + Tailwind CSS 4)
│   ├── api/           # REST API (Hono.js + Supabase)
│   └── admin/         # CMS Admin Panel (Next.js 15 + Zustand + TanStack)
├── packages/
│   ├── shared/        # Shared types, Zod schemas, constants
│   └── supabase/      # Database migrations, seed data, client
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, Tailwind CSS 4, React Router 7 |
| API | Hono.js, Node.js, Zod validation |
| Admin CMS | Next.js 15, Zustand, TanStack Query, TanStack Table |
| Database | Supabase (PostgreSQL), Row Level Security |
| Storage | Supabase Storage (media uploads) |
| Auth | Supabase Auth (Google + GitHub OAuth), email whitelist |
| Docs | Swagger UI / OpenAPI 3.0 |
| Monorepo | npm workspaces |

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Docker (for local Supabase)

### Installation

```bash
git clone https://github.com/ilramdhan/xynhub.com.git
cd xynhub.com
npm install
```

### Start Local Supabase

```bash
cd packages/supabase
npx supabase start
```

After startup, copy the **Publishable** key and **Secret** key from the terminal output.

### Configure Environment

```bash
# API environment
cp apps/api/.env.example apps/api/.env
# Fill in SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY

# Admin environment
cp apps/admin/.env.local.example apps/admin/.env.local
# Fill in NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Run All Services

```bash
# From root - run individually:
npm run dev:api     # API on http://localhost:3000
npm run dev:web     # Landing page on http://localhost:5173
npm run dev:admin   # Admin CMS on http://localhost:3001
```

### API Documentation

Swagger UI is available at [http://localhost:3000/api/docs](http://localhost:3000/api/docs) when the API is running.

## Database

Database migrations and seed data are managed via Supabase CLI:

```bash
npm run db:start    # Start local Supabase
npm run db:stop     # Stop local Supabase
npm run db:reset    # Reset database with migrations + seed
npm run db:studio   # Open Supabase Studio (http://localhost:54323)
```

### Schema Overview

| Table | Purpose |
|-------|---------|
| `page_contents` | JSONB content for static pages (Home, About, Services, etc.) |
| `blogs` | Blog posts with full article content |
| `portfolios` | Portfolio project listings |
| `portfolio_details` | Extended portfolio case study data |
| `testimonials` | Client testimonials |
| `team_members` | Leadership team |
| `faqs` | FAQ items per page |
| `navigation_items` | Header navigation menu |
| `footer_sections` | Footer content sections |
| `site_settings` | Global key-value configuration |
| `media` | Uploaded file metadata |

## CMS Admin Panel

The admin panel at `http://localhost:3001` allows full content management:

- **Pages** - Edit all page sections (Home, About, Services, Process, etc.)
- **Blogs** - Create, edit, delete blog posts
- **Portfolios** - Manage portfolio projects and case studies
- **Navigation** - Configure header menu items
- **Footer** - Edit footer sections and links
- **Testimonials** - Manage client quotes
- **Team** - Manage leadership profiles
- **FAQs** - Manage FAQ items
- **Media** - Upload and manage images
- **Settings** - Global site configuration

### Authentication

Only whitelisted email addresses can access the admin panel. Configure via environment variable:

```
ALLOWED_ADMIN_EMAILS=ilhamram332@gmail.com,another@email.com
```

Login is supported via Google and GitHub OAuth.

## API Endpoints

### Public (no auth required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/pages/:slug` | Get all content sections for a page |
| GET | `/api/v1/pages/:slug/:section` | Get specific section |
| GET | `/api/v1/blogs` | List published blogs (paginated) |
| GET | `/api/v1/blogs/:slug` | Blog detail |
| GET | `/api/v1/portfolios` | List portfolios |
| GET | `/api/v1/portfolios/:slug` | Portfolio with detail |
| GET | `/api/v1/navigation` | Navigation items |
| GET | `/api/v1/footer` | Footer sections |
| GET | `/api/v1/settings` | Site settings |
| GET | `/api/v1/faqs` | FAQ items |
| GET | `/api/v1/testimonials` | Testimonials |
| GET | `/api/v1/team` | Team members (grouped) |

### Admin (Bearer token required)

Full CRUD for all resources under `/api/v1/admin/*`. See Swagger docs for details.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions including:
- OAuth setup (Google + GitHub)
- Vercel deployment for all apps
- Supabase Cloud migration

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## License

MIT License. See [LICENSE](./LICENSE) for details.
