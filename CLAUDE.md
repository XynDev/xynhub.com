# CLAUDE.md - XYNHub Monorepo Reference

> Complete project reference for AI assistants. Read this instead of re-analyzing the codebase.

---

## Project Overview

XYNHub is a **CMS-driven software house website** built as an npm workspaces monorepo. It consists of a public landing site, a REST API, and an admin CMS panel, all backed by Supabase (PostgreSQL).

**Domain:** xynhub.com | **License:** MIT

---

## Monorepo Structure

```
xynhub.com/
├── apps/
│   ├── web/          # React 19 + Vite 8 + Tailwind 4 + React Router 7
│   ├── api/          # Hono.js + Node.js + Supabase
│   └── admin/        # Next.js 15 + Zustand 5 + TanStack Query 5
├── packages/
│   ├── shared/       # Zod schemas, TypeScript types, constants
│   └── supabase/     # DB migrations, seed, Supabase config, client
├── package.json      # Root workspace config (npm workspaces)
├── UI_RULES.md       # Design system spec ("The Digital Monolith")
├── CONTRIBUTING.md    # Dev guidelines
└── DEPLOYMENT.md     # Production deployment guide
```

**Workspace config:** `"workspaces": ["apps/*", "packages/*"]`
**Module type:** Root is `commonjs`, apps/packages are `module` (ESM)

---

## Development

### Ports
| App | Port | URL |
|-----|------|-----|
| Web | 5173 | http://localhost:5173 |
| API | 3000 | http://localhost:3000 |
| Admin | 3001 | http://localhost:3001 |
| Supabase | 54321 | http://127.0.0.1:54321 |
| Supabase Studio | 54323 | http://localhost:54323 |

### Scripts (from root)
```bash
npm run dev           # Start all 3 apps concurrently
npm run dev:web       # Web only
npm run dev:api       # API only (tsx watch with .env)
npm run dev:admin     # Admin only (Next.js dev -p 3001)
npm run build:web     # tsc -b && vite build
npm run build:api     # esbuild bundle → api/index.mjs
npm run build:admin   # next build
npm run db:start      # Start local Supabase (Docker)
npm run db:stop       # Stop local Supabase
npm run db:reset      # Reset DB with migrations + seed
npm run db:studio     # Open Supabase Studio
```

### Environment Variables

**apps/api/.env:**
```
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=<key>
SUPABASE_SERVICE_ROLE_KEY=<key>
ALLOWED_ADMIN_EMAILS=ilhamram332@gmail.com
CORS_ORIGINS=http://localhost:5173,http://localhost:3001
PORT=3000
```

**apps/admin/.env.local:**
```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<key>
NEXT_PUBLIC_API_URL=http://localhost:3000
ALLOWED_ADMIN_EMAILS=ilhamram332@gmail.com
```

**apps/web:** Uses `VITE_API_URL` (defaults to http://localhost:3000)

---

## apps/api - Hono.js REST API

### Tech Stack
- Hono 4.7 + @hono/zod-openapi + @hono/swagger-ui
- @hono/node-server (local dev) / @hono/node-server/vercel (production)
- Supabase JS client (admin + public instances)
- esbuild for Vercel bundling
- tsx for dev watch mode

### Entry Points
- **Dev:** `src/index.ts` → `@hono/node-server` on PORT
- **Vercel:** `src/vercel.ts` → bundled to `api/index.mjs` via `build.mjs`
- **App:** `src/app.ts` → main Hono app with all routes & middleware

### File Structure
```
apps/api/src/
├── index.ts              # Node.js entry (dev)
├── vercel.ts             # Vercel serverless entry
├── app.ts                # Main app: middleware + routes + OpenAPI spec
├── types.ts              # AppEnv type (Variables: { user: User })
├── lib/
│   └── supabase.ts       # supabaseAdmin, supabasePublic, getSupabaseClient(c)
├── middleware/
│   ├── auth.ts           # Bearer token + email whitelist check
│   └── error-handler.ts  # HTTPException, ZodError, generic error handling
└── routes/
    ├── public/           # No auth: pages, blogs, portfolios, navigation,
    │                     #   settings, faqs, testimonials, team, footer
    └── admin/            # Auth required: same + media upload
```

### Middleware Chain
```
Request → logger() → secureHeaders() → cors() →
  [Health: GET /, /health]
  [Swagger: GET /api/docs, /api/openapi.json]
  PUBLIC: /api/v1/* (supabasePublic, respects RLS)
  ADMIN: /api/v1/admin/* → authMiddleware → handler (supabaseAdmin, bypasses RLS)
  → errorHandler (HTTPException/ZodError/500)
```

### Auth Flow
1. Extract `Authorization: Bearer <token>` header
2. Verify token via `supabaseAdmin.auth.getUser(token)`
3. Check email against `ALLOWED_ADMIN_EMAILS` env (comma-separated)
4. 401 if no/invalid token, 403 if email not whitelisted

### API Endpoints (51 total)

**Health & Docs:**
- `GET /` → status ok
- `GET /health` → healthy + timestamp
- `GET /api/docs` → Swagger UI
- `GET /api/openapi.json` → OpenAPI 3.0.3 spec

**Public Routes (/api/v1):**
| Method | Path | Description |
|--------|------|-------------|
| GET | /pages/:slug | All sections for page (object by key) |
| GET | /pages/:slug/:section | Single section content |
| GET | /blogs | Published blogs (paginated, ?category, ?featured) |
| GET | /blogs/:slug | Blog detail |
| GET | /portfolios | Active portfolios (sorted) |
| GET | /portfolios/:slug | Portfolio + detail record |
| GET | /navigation | Active top-level nav items |
| GET | /settings | All settings as {key: value} object |
| GET | /faqs | FAQs by ?page (default "home") |
| GET | /testimonials | Active testimonials |
| GET | /team | Team members grouped by group_name |
| GET | /footer | Footer sections as object by key |

**Admin Routes (/api/v1/admin) - All require auth:**
| Resource | GET list | GET :id | POST | PUT :id | DELETE :id |
|----------|----------|---------|------|---------|------------|
| pages | /pages | /pages/:slug | - | /pages/:slug/:section | /pages/:slug/:section |
| blogs | /blogs | /blogs/:id | /blogs | /blogs/:id | /blogs/:id |
| portfolios | /portfolios | /portfolios/:id | /portfolios | /portfolios/:id | /portfolios/:id |
| navigation | /navigation | - | /navigation | /navigation/:id | /navigation/:id |
| settings | /settings | - | - | /settings/:key | /settings/:key |
| faqs | /faqs | - | /faqs | /faqs/:id | /faqs/:id |
| testimonials | /testimonials | - | /testimonials | /testimonials/:id | /testimonials/:id |
| team | /team | - | /team | /team/:id | /team/:id |
| footer | /footer | - | /footer | /footer/:id | /footer/:id |
| media | /media | - | /media/upload | - | /media/:id |

**Key patterns:**
- Public routes use `slug`, admin routes use `id` (UUID)
- Pagination: `?page=1&per_page=20` → response includes `pagination: {page, per_page, total, total_pages}`
- Upserts: pages (on page_slug+section_key), settings (on key), portfolio details (on portfolio_id)
- Portfolio create/update handles nested `detail` object
- Media upload: multipart form-data → Supabase Storage `media/uploads/{ts}-{rand}.{ext}`
- Validation: POST uses `schema.parse()`, PUT uses `schema.partial().parse()`

### Response Format
```json
// Success
{ "success": true, "data": {...}, "pagination": {...} }
// Error
{ "success": false, "error": "message", "details": [...] }
```
Status codes: 200 (success), 201 (created), 400 (validation), 401/403 (auth), 404, 500

---

## apps/web - React Landing Site

### Tech Stack
- React 19.2 + React DOM 19.2
- React Router DOM 7 (BrowserRouter)
- Vite 8 + @vitejs/plugin-react + @tailwindcss/vite
- Tailwind CSS 4 with custom design tokens
- React Helmet Async (SEO)
- React Markdown + remark-gfm (blog rendering)
- Lucide React (icons)
- TypeScript 5.9 strict mode

### File Structure
```
apps/web/src/
├── main.tsx                    # Entry: StrictMode → HelmetProvider → ThemeProvider → App
├── App.tsx                     # BrowserRouter with all routes
├── index.css                   # Tailwind + design tokens (light/dark)
├── lib/
│   ├── api.ts                  # fetchApi with 1-min cache, all endpoint functions
│   └── utils.ts                # cn() = clsx + twMerge
├── components/
│   ├── ThemeProvider.tsx        # dark/light/system theme context + localStorage
│   ├── SEO.tsx                  # Helmet meta tags (OG, Twitter, primary)
│   ├── layout/
│   │   ├── Header.tsx           # Glass-morphism nav, theme toggle, mobile menu
│   │   ├── Footer.tsx           # 4-col grid, newsletter, API-driven
│   │   ├── PageHeader.tsx       # Large headline + label + description
│   │   └── SectionHeader.tsx    # Section divider with title + line + label
│   └── ui/
│       ├── Button.tsx           # Variants: primary, secondary, outline, ghost
│       ├── Badge.tsx            # With optional animated dot
│       └── BentoCard.tsx        # Card wrapper with hover effects
├── pages/
│   ├── Home.tsx                 # 10 sections: hero, trust, stats, services, works, testimonials, whyUs, cta, faq, contact
│   ├── About.tsx                # Timeline, values, culture, leadership, contact
│   ├── Services.tsx             # Web, tooling, app, cloud offerings
│   ├── ServiceDetail.tsx        # Security, memory, routing, stress testing detail
│   ├── Process.tsx              # 5 development phases
│   ├── Portofolio.tsx           # Portfolio grid with proficiency stats
│   ├── PortofolioDetail.tsx     # Case study: hero, stats, narrative, features, gallery
│   ├── Blogs.tsx                # Blog listing by category (Latest, Research, Infrastructure)
│   └── BlogDetail.tsx           # Markdown blog post with author info
└── data/                        # Legacy fallback JSON (no longer primary source)
```

### Routes
| Path | Page | Data Sources |
|------|------|-------------|
| `/` | Home | getPageContent("home"), getTestimonials(), getFaqs("home") |
| `/about` | About | getPageContent("about"), getTeam() |
| `/services` | Services | getPageContent("services") |
| `/services/:slug` | ServiceDetail | getPageContent("service-detail") |
| `/process` | Process | getPageContent("process") |
| `/portofolio` | Portofolio | getPageContent("portofolio"), getPortfolios() |
| `/portofolio/:slug` | PortofolioDetail | getPortfolioBySlug(slug) |
| `/blogs` | Blogs | getPageContent("blogs"), getBlogs() |
| `/blogs/:slug` | BlogDetail | getBlogBySlug(slug) |

### Design System (from index.css + UI_RULES.md)
- **Theme:** "The Digital Monolith" - monochrome Zinc palette
- **Colors:** CSS custom properties with light/dark variants
  - Primary: #09090b (light) / #ffffff (dark)
  - Surface: #fafafa (light) / #131315 (dark)
  - 3-tier surface hierarchy (container, container-low, container-high)
- **Typography:** Inter font, tracking-tighter headlines, label-sm uppercase
- **Layout:** Bento grid (12-col with asymmetric spans), glass-morphism nav
- **Borders:** No-line rule (tonal shifts), outline-variant for subtle borders
- **Radius:** 1rem default, 1.5rem lg, 2.5rem xl, 9999px full
- **Icons:** Material Symbols Outlined + Lucide React

### API Client (lib/api.ts)
- Base URL from `VITE_API_URL` env (default localhost:3000)
- In-memory cache with 1-minute TTL
- Exports: getPageContent, getBlogs, getBlogBySlug, getPortfolios, getPortfolioBySlug, getNavigation, getFooter, getSettings, getTestimonials, getTeam, getFaqs

### Data Flow
- All pages: `useState` + `useEffect` → API fetch on mount → render
- No global state manager needed (all data is page-local)
- Loading states with conditional rendering
- Blog content supports both Markdown and legacy JSON format

---

## apps/admin - Next.js CMS Panel

### Tech Stack
- Next.js 15.3 (App Router)
- React 19.2 + React DOM 19.2
- TanStack React Query 5.75 (data fetching/caching)
- TanStack React Table 8.21
- Zustand 5.0 (auth + UI state)
- Supabase SSR (@supabase/ssr) for auth
- Sonner (toast notifications)
- Tailwind CSS 4 via @tailwindcss/postcss
- React Markdown + remark-gfm
- class-variance-authority + Lucide React

### File Structure
```
apps/admin/src/
├── app/
│   ├── layout.tsx                      # Root: QueryProvider + Toaster
│   ├── globals.css                     # Design tokens (light/dark)
│   ├── login/page.tsx                  # OAuth buttons (Google + GitHub)
│   ├── auth/callback/route.ts          # Supabase code exchange
│   └── (dashboard)/                    # Protected route group
│       ├── layout.tsx                  # AuthProvider + Sidebar wrapper
│       ├── page.tsx                    # Dashboard: stats + quick actions
│       ├── blogs/
│       │   ├── page.tsx               # Blog list (paginated)
│       │   ├── new/page.tsx           # Create blog
│       │   └── [id]/page.tsx          # Edit blog
│       ├── portfolios/
│       │   ├── page.tsx               # Portfolio list
│       │   ├── new/page.tsx           # Create portfolio
│       │   └── [id]/page.tsx          # Edit portfolio + details
│       ├── testimonials/page.tsx       # CrudList
│       ├── team/page.tsx              # CrudList
│       ├── faqs/page.tsx              # CrudList
│       ├── navigation/page.tsx        # CrudList
│       ├── footer/page.tsx            # Template-based section editor
│       ├── settings/page.tsx          # Key-value store with known keys
│       ├── media/page.tsx             # Upload + grid library
│       └── pages/[slug]/page.tsx      # JSON section editor per page
├── components/
│   ├── layout/sidebar.tsx             # Fixed sidebar nav + mobile toggle
│   └── forms/
│       ├── blog-form.tsx              # Full blog editor with markdown preview
│       └── crud-list.tsx              # Generic CRUD table (reused by 4 pages)
├── lib/
│   ├── supabase.ts                    # createBrowserClient from @supabase/ssr
│   ├── api.ts                         # apiFetch (auth), publicFetch, getAuthHeaders
│   └── utils.ts                       # cn() utility
├── providers/
│   ├── auth-provider.tsx              # Auth guard + email whitelist + redirect
│   └── query-provider.tsx             # TanStack QueryClientProvider (30s stale, 1 retry)
└── stores/
    ├── auth.ts                        # Zustand: user, isLoading
    └── ui.ts                          # Zustand: sidebarOpen
```

### Auth Flow
1. `/login` → OAuth (Google/GitHub) via Supabase
2. Redirect to `/auth/callback` → exchange code for session
3. `AuthProvider` checks session on mount, validates email against `ALLOWED_ADMIN_EMAILS`
4. Unauthorized → redirect to `/login?error=unauthorized`
5. API calls include `Authorization: Bearer <session.access_token>`

### Key Components

**CrudList** (reusable for testimonials, team, faqs, navigation):
- Configurable columns, form fields, default values
- Inline create/edit forms with dynamic field types (text, textarea, number, checkbox, select, json)
- TanStack Query mutations with cache invalidation
- Toast notifications via Sonner

**BlogForm** (blogs/new & blogs/[id]):
- Fields: title, slug (auto-gen), category, tag, description, author info, images, dates
- Markdown editor with live preview (react-markdown)
- Content stored as `{ body: "markdown..." }` in JSONB

**Portfolio Form** (portfolios/new & portfolios/[id]):
- Basic info + dynamic tech stack rows + dynamic metrics rows
- Detail sections: hero, tags, stats, narrative, features, gallery, cta

**Page Editor** (pages/[slug]):
- JSON textarea editor per section
- 7 manageable pages: home, about, services, service-detail, process, blogs, portofolio
- Collapsible sections with descriptions

**Footer Editor:**
- Template-based per section type (brand, platform, company, newsletter, bottom)
- Auto-creates missing sections

**Settings Editor:**
- Known settings with type hints (text, json)
- Quick-add buttons for missing known settings

---

## packages/shared - Types & Schemas

### Exports
```typescript
import { ... } from "@xynhub/shared"           // Everything
import { ... } from "@xynhub/shared/types"      // TypeScript interfaces
import { ... } from "@xynhub/shared/schemas"     // Zod validation schemas
import { ... } from "@xynhub/shared/constants"   // Constants
```

### Types (src/types/index.ts)
**Base:** BaseEntity, SortableEntity, PublishableEntity
**Entities:** SiteSetting, NavigationItem, FooterSection, PageContent, Blog, BlogListItem, Portfolio, PortfolioDetail, Testimonial, TeamMember, FAQ, Media
**API:** ApiResponse\<T\>, PaginatedResponse\<T\>, ApiError
**Auth:** AdminUser

### Zod Schemas (src/schemas/index.ts)
- `paginationSchema` - page (min 1), per_page (1-100, default 20)
- `siteSettingSchema` - key + value (Record)
- `navigationItemSchema` - label, path, sort_order, is_active, parent_id
- `footerSectionSchema` - section_key, title, content, sort_order
- `pageContentSchema` - page_slug, section_key, content, sort_order
- `blogSchema` - slug (kebab-case regex), title, category, content, author info, dates, flags
- `portfolioSchema` - slug, title, tag, tech_stack, metrics, sort_order
- `portfolioDetailSchema` - portfolio_id, hero, stats, narrative, features[], gallery[], cta, tags[]
- `testimonialSchema` - quote, author info, span_class, sort_order
- `teamMemberSchema` - name, role, group_name, image_url, sort_order
- `faqSchema` - question, answer, page_slug (default "home"), sort_order
- `mediaUploadSchema` - alt_text

### Constants (src/constants/index.ts)
- `PAGE_SLUGS` - home, about, services, service-detail, process, blogs, portofolio
- `PAGE_SECTIONS` - section keys per page slug
- `SITE_SETTINGS_KEYS` - site_name, site_description, logo_light/dark, favicon, seo_default, social_links

**Note:** "Portfolio" is intentionally spelled "portofolio" in slugs/URLs for FE consistency.

---

## packages/supabase - Database

### Client (src/client.ts)
- `createSupabaseClient(url, anonKey)` - public client with session persistence
- `createSupabaseAdmin(url, serviceRoleKey)` - admin client, no session

### Config (supabase/config.toml)
- Project ID: `xynhub`
- API port: 54321, DB port: 54322, Studio port: 54323
- Storage: 50MiB file limit, S3 protocol enabled
- Auth: Google + GitHub OAuth enabled, JWT expiry 3600s
- Email: Inbucket testing on port 54324

### Database Schema (11 tables)

| Table | Key Columns | Special |
|-------|------------|---------|
| site_settings | key (UNIQUE), value (JSONB) | updated_by |
| navigation_items | label, path, sort_order, is_active | parent_id (self-ref) |
| footer_sections | section_key (UNIQUE), title, content (JSONB) | - |
| page_contents | page_slug, section_key, content (JSONB) | UNIQUE(page_slug, section_key) |
| blogs | slug (UNIQUE), title, content (JSONB), author_* | is_featured, published_at |
| portfolios | slug (UNIQUE), tech_stack (JSONB), metrics (JSONB) | sort_order |
| portfolio_details | portfolio_id (UNIQUE FK), hero/stats/narrative/features/gallery/cta (JSONB) | tags (TEXT[]) |
| testimonials | quote, author_*, span_class | sort_order, is_active |
| team_members | name, role, group_name | sort_order, is_active |
| faqs | question, answer, page_slug | sort_order, is_active |
| media | file_name, file_url, file_path, file_type, file_size | uploaded_by, alt_text |

**All tables have:** id (UUID PK), created_at, updated_at (auto-trigger)

### Row-Level Security (RLS)
- **Public read:** All tables allow SELECT (active-filtered where applicable)
- **Authenticated write:** INSERT/UPDATE/DELETE for authenticated role
- **Email whitelist:** Enforced at API middleware level, not RLS

### Storage
- Bucket: `media` (public, 10MB limit)
- Allowed: image/jpeg, image/png, image/webp, image/svg+xml, image/gif, application/pdf
- Path pattern: `uploads/{timestamp}-{random}.{ext}`

### Seed Data
- 7 site settings, 6 nav items, 5 footer sections
- 8 pages with ~40 total sections of JSONB content
- 8 blog posts, 3 portfolios with details, 4 testimonials, 4 team members, 4 FAQs

---

## Deployment (Vercel)

Three separate Vercel projects:

| Project | Root Dir | Framework | Build | Notes |
|---------|----------|-----------|-------|-------|
| API | apps/api | null | `node build.mjs` → api/index.mjs | All routes rewrite to /api |
| Admin | apps/admin | Next.js | `next build` | - |
| Web | apps/web | Vite | `vite build` | - |

**Production domains:** xynhub.com (web), admin.xynhub.com (admin), api.xynhub.com (api)

**CORS origins (production):**
- https://xynhub.com, https://www.xynhub.com, https://admin.xynhub.com

---

## Conventions

- **File naming:** kebab-case for files/routes
- **Component naming:** PascalCase
- **Commits:** Conventional commits (feat:, fix:, refactor:, etc.)
- **Slugs:** kebab-case, validated by regex `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`
- **Spelling:** "Portofolio" (intentional, kept for FE consistency)
- **TypeScript:** Strict mode everywhere
- **Validation:** Zod schemas from @xynhub/shared for all API input
- **Styling:** Tailwind utility classes, no arbitrary colors (monochrome Zinc only)
- **No tests:** No test framework configured yet (`test` script exits with error)
