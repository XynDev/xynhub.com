# CLAUDE.md - @xynhub/shared

> Shared TypeScript types, Zod schemas, and constants for the XYNHub monorepo.

---

## Quick Reference

| Item | Value |
|------|-------|
| Package | @xynhub/shared |
| Module | ESM (type: "module") |
| Source | TypeScript (not compiled — consumed raw via transpilePackages) |
| Dependency | zod ^3.24 |

---

## Exports

```typescript
import { ... } from "@xynhub/shared"           // Everything (barrel export)
import { ... } from "@xynhub/shared/types"      // TypeScript interfaces only
import { ... } from "@xynhub/shared/schemas"     // Zod schemas + inferred types
import { ... } from "@xynhub/shared/constants"   // Constants (page slugs, sections, settings keys)
```

---

## Types (`src/types/index.ts`)

### Base Types
- `BaseEntity` — id (UUID), created_at, updated_at
- `SortableEntity` — extends Base + sort_order, is_active
- `PublishableEntity` — extends Sortable + published_at, is_featured

### Entity Types (22 total)
| Type | Extends | Key Fields |
|------|---------|------------|
| SiteSetting | Base | key (unique), value (JSONB), updated_by |
| NavigationItem | Sortable | label, path, parent_id (self-ref) |
| FooterSection | Base | section_key (unique), title, content (JSONB) |
| PageContent | Base | page_slug, section_key, content (JSONB) |
| Blog | Publishable | slug, title, category, content (JSONB), author_* |
| BlogListItem | — | Subset of Blog for list views |
| Service | Sortable | slug, title, description, metrics/tooling/features (JSONB) |
| Portfolio | Sortable | slug, title, tech_stack/metrics (JSONB) |
| PortfolioDetail | Base | portfolio_id, hero/stats/narrative/features/gallery/cta (JSONB), tags[] |
| Testimonial | Sortable | quote, author_name, author_role, span_class |
| TeamMember | Sortable | name, role, group_name, social_links (JSONB) |
| FAQ | Sortable | question, answer, page_slug |
| Media | Base | file_name, file_url, file_path, file_type, file_size, alt_text |
| ContactMessage | Base | name, email, message, is_read |
| NewsletterSubscriber | Base | email, is_active |

### API Response Types
- `ApiResponse<T>` — `{ success: boolean, data: T, message?: string }`
- `PaginatedResponse<T>` — `{ success: boolean, data: T[], pagination: {...} }`
- `ApiError` — `{ success: false, error: string, details?: [...] }`
- `AdminUser` — id, email, role

---

## Schemas (`src/schemas/index.ts`)

### Validation Patterns
- **Slugs**: `/^[a-z0-9]+(?:-[a-z0-9]+)*$/` (kebab-case, applied to blog, service, portfolio)
- **Email**: `.email()` (on contact, newsletter)
- **URL**: `.url()` (on author_image, image_url where non-null)
- **Pagination**: page min 1, per_page 1-100, default 20
- **JSONB fields**: `z.record(z.unknown())` for flexible objects

### Schema List (14 schemas + 13 inferred types)
| Schema | Used For | Key Validations |
|--------|----------|-----------------|
| paginationSchema | Query params | page min 1, per_page 1-100 |
| siteSettingSchema | Settings | key min 1, value as record |
| navigationItemSchema | Nav items | label, path, parent_id nullable UUID |
| footerSectionSchema | Footer | section_key, content as record |
| pageContentSchema | Page sections | page_slug, section_key, content |
| blogSchema | Blog posts | slug regex, title, category, author fields |
| serviceSchema | Services | slug regex, description, JSONB arrays |
| portfolioSchema | Portfolios | slug regex, tech_stack/metrics nullable |
| portfolioDetailSchema | Portfolio details | portfolio_id UUID, JSONB sections |
| testimonialSchema | Testimonials | quote, author fields, span_class |
| teamMemberSchema | Team members | name, role, group_name, social_links object |
| faqSchema | FAQs | question, answer, page_slug default "home" |
| contactMessageSchema | Contact form | name, email, message |
| newsletterSubscribeSchema | Newsletter | email only |
| mediaUploadSchema | Media upload | alt_text optional |

### Inferred Types
Each schema exports a `Create*` type: `CreateBlog`, `CreateService`, `CreatePortfolio`, etc.

---

## Constants (`src/constants/index.ts`)

```typescript
PAGE_SLUGS = ["home", "about", "services", "service-detail", "process", "blogs", "portofolio"]

PAGE_SECTIONS = {
  home: ["hero", "trust", "stats", "services", "works", "testimonials", "whyUs", "cta", "faq", "contact"],
  about: ["hero", "timeline", "values", "culture", "leadership", "contact"],
  services: ["hero", "list", "cta"],
  "service-detail": ["hero", "metrics", "features", "tooling", "cta"],
  process: ["hero", "phases", "cta"],
  blogs: ["hero"],
  portofolio: ["hero", "proficiency"],
}

SITE_SETTINGS_KEYS = ["site_name", "site_description", "logo_light", "logo_dark", "favicon", "seo_default", "social_links"]
```

---

## Conventions

- "Portofolio" spelling is intentional in slugs/constants for FE consistency
- Package is NOT compiled — consumers use `transpilePackages` (Next.js) or bundler resolution (Vite/esbuild)
- All nullable fields use `.nullable().default(null)` pattern
- JSONB arrays use `z.array(z.record(z.unknown()))` — no strict inner structure (flexible CMS content)
- Schema `parse()` is used for POST (full validation), `partial().parse()` for PUT (partial updates)

---

## Gotchas

- `serviceSchema.image_url` is `z.string().nullable()` without `.url()` — allows non-URL strings when non-null
- `social_links` fields default to empty string `""`, not null — inconsistent with other nullable patterns
- No schema exists for the `media` table record itself — only `mediaUploadSchema` for the upload input
- Schemas don't apply `.trim()` to string inputs — leading/trailing spaces pass validation
