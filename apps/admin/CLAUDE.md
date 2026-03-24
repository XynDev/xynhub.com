# CLAUDE.md - XYNHub Admin CMS

> Next.js 15 admin panel for managing XYNHub website content. Read this before making changes.

---

## Quick Reference

| Item | Value |
|------|-------|
| Framework | Next.js 15.3 (App Router) |
| State | Zustand 5 (auth + UI) + TanStack Query 5 (data) |
| Auth | Supabase SSR (@supabase/ssr) OAuth |
| Styling | Tailwind CSS 4 via @tailwindcss/postcss |
| Toasts | Sonner |
| Icons | Lucide React |
| Port | 3001 (dev) |
| API | NEXT_PUBLIC_API_URL (default http://localhost:3000) |

---

## Architecture

```
src/
├── app/
│   ├── layout.tsx                      # Root: QueryProvider + Toaster
│   ├── globals.css                     # Design tokens (light/dark)
│   ├── login/page.tsx                  # OAuth buttons (Google + GitHub)
│   ├── auth/callback/route.ts          # Supabase code exchange
│   └── (dashboard)/                    # Protected route group
│       ├── layout.tsx                  # AuthProvider + Sidebar wrapper
│       ├── page.tsx                    # Dashboard: stats + quick actions
│       ├── blogs/                      # Blog CRUD (list/new/[id])
│       ├── portfolios/                 # Portfolio CRUD (list/new/[id])
│       ├── testimonials/page.tsx       # CrudList
│       ├── team/page.tsx              # CrudList
│       ├── faqs/page.tsx              # CrudList
│       ├── navigation/page.tsx        # CrudList
│       ├── footer/page.tsx            # Template-based section editor
│       ├── settings/page.tsx          # Key-value store editor
│       ├── media/page.tsx             # Upload + grid library
│       ├── pages/[slug]/page.tsx      # JSON section editor per page
│       ├── services/page.tsx          # Services CRUD
│       ├── contact-messages/page.tsx  # Contact messages list
│       └── newsletter/page.tsx        # Newsletter subscribers
├── components/
│   ├── layout/sidebar.tsx             # Fixed nav + mobile toggle + user menu
│   ├── forms/
│   │   ├── blog-form.tsx              # Full blog editor with markdown preview
│   │   ├── crud-list.tsx              # Generic CRUD table (reused by 4+ pages)
│   │   └── portfolio-form.tsx         # Portfolio + detail editor
│   └── ui/
│       ├── media-picker.tsx           # Modal: browse library or upload new
│       ├── markdown-editor.tsx        # Textarea + preview toggle
│       └── array-field.tsx            # Generic array editor with add/remove/reorder
├── lib/
│   ├── api.ts                         # apiFetch (with auth), publicFetch
│   ├── db.ts                          # Direct Supabase CRUD (bypasses API)
│   ├── supabase.ts                    # createBrowserClient from @supabase/ssr
│   └── utils.ts                       # cn() utility
├── providers/
│   ├── auth-provider.tsx              # Auth guard + email whitelist + redirect
│   └── query-provider.tsx             # TanStack QueryClient (30s stale, 1 retry)
└── stores/
    ├── auth.ts                        # Zustand: user + isLoading
    └── ui.ts                          # Zustand: sidebarOpen toggle
```

---

## Auth Flow

```
1. /login → OAuth (Google/GitHub) via Supabase
2. Redirect → /auth/callback → exchange code for session (cookies)
3. (dashboard)/layout.tsx → AuthProvider:
   a. getSession() → no session → redirect /login
   b. Check email against ALLOWED_EMAILS (NEXT_PUBLIC_ALLOWED_ADMIN_EMAILS)
   c. Unauthorized → signOut + redirect /login?error=unauthorized
   d. Authorized → setUser(session.user) in Zustand
4. onAuthStateChange listener for session updates
5. Sidebar logout → supabase.auth.signOut() → redirect /login
```

**Token handling:** API calls include `Authorization: Bearer <session.access_token>` via `getAuthHeaders()` in `lib/api.ts`.

---

## Data Access: Dual Strategy

The admin uses **two** data access strategies:

### 1. Direct Supabase (`lib/db.ts`) — Primary
- Browser → Supabase directly (bypasses Hono API)
- Eliminates Vercel serverless 504 timeouts on Hobby plan
- Uses RLS policies (authenticated user has full CRUD)
- Generic functions: `dbList`, `dbGet`, `dbCreate`, `dbUpdate`, `dbDelete`
- Specialized: `dbUpsertPageSection`, `dbGetPortfolioWithDetail`, `dbUploadMedia`, etc.

### 2. API Fetch (`lib/api.ts`) — Legacy/Fallback
- `apiFetch()` — authenticated requests to Hono API
- `publicFetch()` — unauthenticated requests
- Handles non-JSON error responses (Vercel 504 plain text)

**Most pages use `db.ts` directly.** Some pages still use `api.ts` — check each page's imports.

---

## Reusable Components

### CrudList (`components/forms/crud-list.tsx`)
Used by: testimonials, team, faqs, navigation (potentially more)

```tsx
<CrudList
  title="Testimonials"
  table="testimonials"
  columns={[...]}        // Column definitions
  formFields={[...]}     // Form field configs
  defaultValues={{...}}  // Default values for new records
  orderBy="sort_order"
/>
```

Field types: `text`, `textarea`, `number`, `checkbox`, `select`, `json`, `media`, `array`

### MediaPicker (`components/ui/media-picker.tsx`)
Dual-mode: browse existing media library or upload new file.

### MarkdownEditor (`components/ui/markdown-editor.tsx`)
Textarea with live preview toggle using react-markdown.

### ArrayField (`components/ui/array-field.tsx`)
Generic array editor with add/remove/reorder. Uses `renderMediaPicker` prop to avoid circular imports.

---

## State Management

### Zustand Stores
- `useAuthStore`: `{ user, isLoading, setUser, setLoading }` — Supabase User object
- `useUIStore`: `{ sidebarOpen, toggleSidebar }` — mobile nav state

### TanStack Query
- Configured in `providers/query-provider.tsx`
- Default staleTime: 30 seconds
- Default retries: 1
- Cache invalidation via `queryClient.invalidateQueries({ queryKey: [table] })`

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<key>
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_ALLOWED_ADMIN_EMAILS=ilhamram332@gmail.com
```

All prefixed with `NEXT_PUBLIC_` (client-side accessible). The email whitelist is also enforced server-side at the API middleware level.

---

## Build & Deploy

```bash
npm run dev:admin    # next dev -p 3001
npm run build:admin  # next build
```

**next.config.ts:**
- `transpilePackages: ["@xynhub/shared"]`
- Remote image patterns: Google OAuth, GitHub avatars, local Supabase

---

## Conventions

- All dashboard pages are in `(dashboard)/` route group (shared layout with AuthProvider + Sidebar)
- Form validation uses HTML5 attributes (required, type, pattern) — no form library
- JSON fields validated with try-catch on `JSON.parse()` — no Zod schema validation on client
- Mutations show errors via `toast.error(err.message)` (Sonner)
- Delete confirmations use native `confirm()` dialog
- Media cleanup on record delete via `dbCleanupMediaByUrl()`

---

## Gotchas

- **Email whitelist in client env** — `NEXT_PUBLIC_ALLOWED_ADMIN_EMAILS` is exposed in browser JS. Security relies on API-level middleware check as the real guard.
- **Hardcoded email fallback** — if env var is missing, defaults to `ilhamram332@gmail.com`
- **API URL falls back to localhost** — if `NEXT_PUBLIC_API_URL` is missing in production, requests go to localhost
- **No error boundary** — if AuthProvider or dashboard pages throw, entire page crashes
- **Query cache not cleared on logout** — cached data persists across user sessions
- **No token refresh logic** — if session expires mid-operation, request fails with "Not authenticated"
- **No file size validation** in `dbUploadMedia()` before Supabase upload — relies on bucket 10MB limit
- **Media URL parsing** in `dbCleanupMediaByUrl()` uses regex matching on `/storage/v1/object/public/media/` — fragile if URL format changes
- **Portfolio detail** uses array unwrapping (`detail[0]`) because Supabase returns 1:1 relations as arrays with `.select("*, detail:portfolio_details(*)")`
