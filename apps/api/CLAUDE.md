# CLAUDE.md - XYNHub API

> Hono.js REST API for the XYNHub CMS. Read this before making changes.

---

## Quick Reference

| Item | Value |
|------|-------|
| Framework | Hono 4.7 + @hono/node-server |
| Language | TypeScript 5.9 (strict) |
| Database | Supabase (PostgreSQL + Storage) |
| Dev Entry | `src/index.ts` → localhost:3000 |
| Prod Entry | `src/vercel.ts` → bundled to `api/index.mjs` |
| Main App | `src/app.ts` → middleware + routes + OpenAPI |
| Build | `node build.mjs` (esbuild → ESM, Node 20) |
| Swagger | http://localhost:3000/api/docs |

---

## Architecture

```
src/
├── index.ts              # Dev: @hono/node-server on PORT
├── vercel.ts             # Prod: Vercel serverless handler
├── app.ts                # Main app: CORS → logger → secureHeaders → routes → errorHandler
├── types.ts              # AppEnv { Variables: { user: User } }
├── lib/
│   └── supabase.ts       # Lazy singleton clients via Proxy (admin + public + per-request)
├── middleware/
│   ├── auth.ts           # Bearer token → Supabase getUser → email whitelist → 5s timeout
│   └── error-handler.ts  # HTTPException / ZodError / generic 500
└── routes/
    ├── public/            # 12 route files (no auth)
    │   ├── pages.ts       blogs.ts      portfolios.ts   services.ts
    │   ├── navigation.ts  settings.ts   faqs.ts         testimonials.ts
    │   ├── team.ts        footer.ts     contact.ts      newsletter.ts
    └── admin/             # 13 route files (auth required)
        ├── pages.ts       blogs.ts      portfolios.ts   services.ts
        ├── navigation.ts  settings.ts   faqs.ts         testimonials.ts
        ├── team.ts        footer.ts     media.ts
        ├── contact-messages.ts          newsletter.ts
```

---

## Middleware Chain

```
Request
  → OPTIONS → 204 with CORS headers (preflight, before any middleware)
  → CORS headers appended to all responses
  → logger() (Hono built-in)
  → secureHeaders() (X-Frame-Options, CSP, etc.)
  → Health: GET / and /health
  → Swagger: GET /api/docs and /api/openapi.json
  → Public: /api/v1/* (uses supabasePublic, respects RLS)
  → Admin: /api/v1/admin/* → authMiddleware → handler (uses supabaseAdmin, bypasses RLS)
  → errorHandler (catches HTTPException, ZodError, generic errors)
  → 404 fallback
```

---

## Auth Flow

1. Extract `Authorization: Bearer <token>` from request header
2. Call `supabaseAdmin.auth.getUser(token)` with **5-second timeout** (prevents Vercel 504 without CORS)
3. Check user email against `ALLOWED_ADMIN_EMAILS` env (comma-separated, case-insensitive)
4. Set `c.set("user", user)` for downstream handlers
5. Returns: 401 (no/invalid token), 403 (email not whitelisted)

---

## Supabase Client Strategy

- **Lazy singleton** via Proxy pattern in `lib/supabase.ts` — avoids crash at module load if env missing
- `supabaseAdmin` — service role key, bypasses RLS, used in admin routes
- `supabasePublic` — anon key, respects RLS, used in public routes
- `getSupabaseClient(c)` — creates per-request client from Bearer token (for future use)
- No explicit connection pooling — relies on Supabase JS internal pooling

---

## Response Format

```typescript
// Success
{ success: true, data: T }
{ success: true, data: T[], pagination: { page, per_page, total, total_pages } }
{ success: true, message: "string" }

// Error
{ success: false, error: "string" }
{ success: false, error: "Validation error", details: [{ path, message }] }
```

Status codes: 200, 201 (created), 400 (validation/ZodError), 401/403 (auth), 404, 500, 504 (timeout)

---

## API Endpoints (60+ total)

### Public Routes (/api/v1)

| Method | Path | Description |
|--------|------|-------------|
| GET | /pages/:slug | All sections for page (object keyed by section_key) |
| GET | /pages/:slug/:section | Single section content |
| GET | /blogs | Published blogs (paginated, ?category, ?featured) |
| GET | /blogs/:slug | Blog detail |
| GET | /portfolios | Active portfolios (sorted) |
| GET | /portfolios/:slug | Portfolio + detail record |
| GET | /services | Active services (sorted, ?featured) |
| GET | /services/:slug | Service detail |
| GET | /navigation | Active top-level nav items (parent_id IS NULL) |
| GET | /settings | All settings as {key: value} object |
| GET | /faqs | FAQs by ?page (default "home") |
| GET | /testimonials | Active testimonials |
| GET | /team | Team members grouped by group_name |
| GET | /footer | Footer sections as object by section_key |
| POST | /contact | Submit contact form (public, no auth) |
| POST | /newsletter | Subscribe to newsletter (upsert on email) |

### Admin Routes (/api/v1/admin) — All require Bearer token

Full CRUD for: pages, blogs, portfolios, services, navigation, settings, faqs, testimonials, team, footer, media, contact-messages, newsletter

**Key patterns:**
- Public routes use `slug`, admin routes use `id` (UUID)
- Pagination: `?page=1&per_page=20` → response includes `pagination` object
- Upserts: pages (on page_slug+section_key), settings (on key), portfolio details (on portfolio_id)
- Portfolio create/update handles nested `detail` object
- Media upload: multipart/form-data → Supabase Storage `media/uploads/{ts}-{rand}.{ext}`
- Validation: POST uses `schema.parse()`, PUT uses `schema.partial().parse()`

---

## Build & Deploy

**Development:**
```bash
npm run dev:api   # tsx watch with .env loaded
```

**Production build:**
```bash
node build.mjs    # esbuild → api/index.mjs (ESM, minified, Node 20)
```

**esbuild config highlights:**
- `platform: "node"` auto-externalizes Node.js built-ins
- `banner` adds `createRequire` shim for CommonJS deps
- All npm packages are bundled (no external list)

**Vercel:**
- `vercel.json`: framework=null, all requests rewrite to `/api`
- Function config: `maxDuration: 30` seconds
- CORS headers set at infrastructure level (vercel.json) + backup in code

---

## Environment Variables

```env
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=<key>
SUPABASE_SERVICE_ROLE_KEY=<key>
ALLOWED_ADMIN_EMAILS=user@example.com
PORT=3000
```

- `CORS_ORIGINS` is NOT used — CORS is wildcard (safe because no cookie-based auth)
- Missing env vars throw at first use (lazy init), not at startup

---

## Conventions

- Each route file exports a `new Hono()` instance, mounted in `app.ts`
- Route files import `supabaseAdmin` or `supabasePublic` directly from `lib/supabase.ts`
- Zod schemas imported from `@xynhub/shared` for input validation
- Error responses always have `{ success: false, error: "message" }`
- DB errors are masked via `dbError()` helper — logs real error server-side, returns generic message to client
- OpenAPI spec is manually maintained in `app.ts` (not auto-generated from routes)
- `@hono/zod-openapi` is installed but not used for route definitions

---

## Gotchas

- CORS is `*` everywhere — intentional since auth is stateless JWT (no cookies/credentials mode)
- The `withTimeout` wrapper in auth.ts prevents Vercel's bare 504 (which has no CORS headers)
- Path parameters (slug, id) are NOT validated with Zod before DB queries — Supabase JS uses parameterized queries so no SQL injection risk, but invalid inputs may cause unclear errors
- `parseInt()` for pagination has no bounds checking — could accept negative/NaN values
- Media cleanup (`/admin/media/cleanup`) doesn't check for storage/DB operation failures
- The OpenAPI spec in `app.ts` may drift from actual route implementations
