# CLAUDE.md - @xynhub/supabase

> Supabase database configuration, migrations, seed data, and client factories.

---

## Quick Reference

| Item | Value |
|------|-------|
| Package | @xynhub/supabase |
| DB | PostgreSQL via Supabase |
| Local Dev | Docker containers (port 54321-54324) |
| Migrations | `supabase/migrations/` (4 files) |
| Seed | `supabase/seed.sql` |
| Studio | http://localhost:54323 |

---

## Architecture

```
packages/supabase/
├── src/
│   ├── index.ts           # Barrel export
│   └── client.ts          # createSupabaseClient + createSupabaseAdmin factories
├── supabase/
│   ├── config.toml        # Local Supabase config (ports, auth, storage)
│   ├── migrations/
│   │   ├── 20260320000000_initial_schema.sql          # 11 core tables + RLS + triggers
│   │   ├── 20260322000000_services_contact_newsletter.sql  # 3 new tables + portfolio additions
│   │   ├── 20260323000000_admin_select_policies.sql   # 12 admin SELECT RLS policies
│   │   └── 20260323100000_team_social_links.sql       # social_links JSONB column
│   └── seed.sql           # Comprehensive test data
└── package.json
```

---

## Client Factories

```typescript
import { createSupabaseClient, createSupabaseAdmin } from "@xynhub/supabase/client";

// Public client (browser) — auto-refresh, persist session
const client = createSupabaseClient(url, anonKey);

// Admin client (server) — no auto-refresh, no persist
const admin = createSupabaseAdmin(url, serviceRoleKey);
```

**Note:** The API (`apps/api`) has its own lazy singleton pattern in `lib/supabase.ts` — it does NOT use these factories.

---

## Database Schema (14 tables)

| Table | Key Columns | Unique Constraints | Special |
|-------|------------|-------------------|---------|
| site_settings | key, value (JSONB) | key | updated_by FK to auth.users |
| navigation_items | label, path, sort_order | — | parent_id self-referencing FK |
| footer_sections | section_key, title, content (JSONB) | section_key | — |
| page_contents | page_slug, section_key, content (JSONB) | (page_slug, section_key) | Composite unique |
| blogs | slug, title, category, content (JSONB) | slug | is_featured, published_at |
| services | slug, title, metrics/tooling/features (JSONB) | slug | is_featured |
| portfolios | slug, title, tech_stack/metrics (JSONB) | slug | short_description, is_featured |
| portfolio_details | portfolio_id, hero/stats/narrative (JSONB) | portfolio_id | CASCADE delete, tags TEXT[] |
| testimonials | quote, author_*, span_class | — | sort_order, is_active |
| team_members | name, role, group_name, social_links (JSONB) | — | sort_order, is_active |
| faqs | question, answer, page_slug | — | default page_slug "home" |
| media | file_name, file_url, file_path, file_type | — | file_size, alt_text |
| contact_messages | name, email, message | — | is_read boolean |
| newsletter_subscribers | email | email | is_active |

**All tables have:** `id` (UUID PK, gen_random_uuid()), `created_at`, `updated_at` (auto-trigger)

---

## Indexes (25 total)

Key indexes across all tables:
- **Slug lookups**: blogs(slug), portfolios(slug), services(slug)
- **Sort order**: testimonials, team_members, faqs, navigation_items, footer_sections, portfolios, services
- **Filters**: blogs(category), blogs(is_featured), services(is_featured), portfolios(is_featured), team_members(group_name)
- **Relations**: navigation_items(parent_id), portfolio_details(portfolio_id)
- **Composite**: page_contents(page_slug, section_key)
- **Recency**: blogs(published_at DESC), contact_messages(created_at DESC)
- **Unique**: newsletter_subscribers(email), media(file_type)

---

## RLS Policies (74 total)

**Pattern:**
- **Public READ**: All tables allow SELECT for `anon` role (filtered by `is_active = true` where applicable)
- **Admin CRUD**: All tables allow INSERT/UPDATE/DELETE for `authenticated` role
- **Admin SELECT**: Additional SELECT policies for authenticated role (migration 3)
- **Special**: `contact_messages` and `newsletter_subscribers` allow public INSERT (no auth needed)

**Important:** Email whitelist is NOT enforced at RLS level — it's enforced at the API middleware layer. Any authenticated Supabase user has full CRUD via RLS.

---

## Storage

- **Bucket**: `media` (public, 10MB file limit)
- **Allowed MIME types**: image/jpeg, image/png, image/webp, image/svg+xml, image/gif, application/pdf
- **Path pattern**: `uploads/{timestamp}-{random}.{ext}`
- **RLS**: Public read, authenticated upload/delete/update

---

## Migration History

1. **20260320000000** — Initial schema: 11 tables, all RLS policies, auto-update trigger, storage bucket
2. **20260322000000** — Added: services, contact_messages, newsletter_subscribers tables + portfolio short_description/is_featured
3. **20260323000000** — Added: 12 admin SELECT RLS policies (idempotent with DO $$ BEGIN/EXCEPTION) + storage policies
4. **20260323100000** — Added: team_members.social_links JSONB column

---

## Local Development

```bash
npm run db:start     # Start Supabase Docker containers
npm run db:stop      # Stop containers
npm run db:reset     # Reset DB: drop all → run migrations → run seed.sql
npm run db:studio    # Open Supabase Studio (localhost:54323)
npm run db:migrate   # Run pending migrations only
npm run db:generate-types  # Generate TypeScript types from DB schema
```

**config.toml ports:**
- API: 54321
- Database: 54322 (direct PostgreSQL)
- Studio: 54323
- Inbucket (email testing): 54324

**Auth providers:** Google + GitHub OAuth enabled in config.toml

---

## Conventions

- Migrations are idempotent where possible (IF NOT EXISTS, DO $$ BEGIN/EXCEPTION)
- All JSONB columns default to `'{}'::jsonb` or `'[]'::jsonb`
- `updated_at` auto-updated via shared trigger function `update_updated_at()`
- Foreign keys use ON DELETE CASCADE where appropriate (portfolio_details → portfolios)
- "Portofolio" spelling NOT used in DB — table is `portfolios` (standard spelling)

---

## Gotchas

- `db:seed` is an alias for `db:reset` — it drops everything and re-creates
- Storage bucket config in `config.toml` shows 50MB but actual bucket policy is 10MB
- Auth JWT expiry is 3600s (1 hour) — affects token refresh timing in clients
- Shadow database on port 54320 is used by Supabase for migration diffing
- No generated TypeScript types file exists yet — run `db:generate-types` to create
