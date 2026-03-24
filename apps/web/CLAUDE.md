# CLAUDE.md - XYNHub Web (Landing Site)

> React 19 SPA landing site for xynhub.com. Read this before making changes.

---

## Quick Reference

| Item | Value |
|------|-------|
| Framework | React 19.2 + React Router 7 |
| Bundler | Vite 8 + @vitejs/plugin-react |
| Styling | Tailwind CSS 4 + custom design tokens |
| Icons | Lucide React + Material Symbols (CDN) |
| SEO | react-helmet-async |
| Markdown | react-markdown + remark-gfm |
| Anti-spam | Cloudflare Turnstile |
| Port | 5173 (dev) |
| API | VITE_API_URL (default http://localhost:3000) |

---

## Architecture

```
src/
├── main.tsx                    # Entry: StrictMode → HelmetProvider → ThemeProvider → App
├── App.tsx                     # BrowserRouter with 11 routes
├── index.css                   # Tailwind 4 + design tokens (light/dark CSS vars)
├── lib/
│   ├── api.ts                  # fetchApi with in-memory cache (1-min TTL)
│   ├── supabase.ts             # Supabase client (used for contact form + newsletter)
│   └── utils.ts                # cn() = clsx + twMerge
├── components/
│   ├── ThemeProvider.tsx        # dark/light/system theme via Context + localStorage
│   ├── SEO.tsx                  # Helmet meta tags (OG, Twitter, primary)
│   ├── layout/
│   │   ├── Header.tsx           # Fixed glass-morphism nav, theme toggle, mobile menu
│   │   ├── Footer.tsx           # 4-col grid, newsletter subscribe, API-driven
│   │   ├── PageHeader.tsx       # Large headline + label + description
│   │   └── SectionHeader.tsx    # Section divider with title + line + label
│   └── ui/
│       ├── Button.tsx           # 4 variants (primary/secondary/outline/ghost), 3 sizes
│       ├── Badge.tsx            # With optional animated dot
│       ├── BentoCard.tsx        # Card wrapper with hover effects, forwardRef
│       └── Turnstile.tsx        # Cloudflare Turnstile hook for anti-spam
└── pages/
    ├── Home.tsx                 # 10 sections: hero, trust, stats, services, works, testimonials, whyUs, cta, faq, contact
    ├── About.tsx                # Timeline, values, culture, team with social links
    ├── Services.tsx             # Service grid with featured services
    ├── ServiceDetail.tsx        # Deep-dive service page
    ├── Process.tsx              # 5 development phases in bento layout
    ├── Portofolio.tsx           # Portfolio grid with proficiency stats
    ├── PortofolioDetail.tsx     # Case study: hero, stats, narrative, features, gallery
    ├── Blogs.tsx                # Blog listing by category (Latest, Research, Infrastructure)
    ├── BlogDetail.tsx           # Markdown blog post with author info
    ├── PrivacyPolicy.tsx        # Markdown from API
    └── TermsOfService.tsx       # Markdown from API
```

---

## Routes

| Path | Page | Data Sources |
|------|------|-------------|
| `/` | Home | getPageContent("home"), getTestimonials(), getFaqs("home"), getServices() |
| `/about` | About | getPageContent("about"), getTeam() |
| `/services` | Services | getPageContent("services"), getServices() |
| `/services/:slug` | ServiceDetail | getServiceBySlug(slug) |
| `/process` | Process | getPageContent("process") |
| `/portofolio` | Portofolio | getPageContent("portofolio"), getPortfolios() |
| `/portofolio/:slug` | PortofolioDetail | getPortfolioBySlug(slug) |
| `/blogs` | Blogs | getPageContent("blogs"), getBlogs() |
| `/blogs/:slug` | BlogDetail | getBlogBySlug(slug) |
| `/privacy-policy` | PrivacyPolicy | getPageContent("privacy-policy") |
| `/terms-of-service` | TermsOfService | getPageContent("terms-of-service") |

---

## Data Fetching Pattern

All pages follow the same pattern:

```tsx
const [pageData, setPageData] = useState<AnyData>({});
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function load() {
    try {
      const [content, extras] = await Promise.all([
        getPageContent("slug"),
        getOtherData(),
      ]);
      setPageData(content);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  load();
}, []);
```

- No global state manager — all data is page-local via useState
- No query library (React Query/SWR) — manual caching in `lib/api.ts`
- API cache: `Map<string, { data, timestamp }>` with 1-minute TTL, no max size limit
- POST requests (contact form, newsletter) go through dedicated functions, not cache

---

## Design System

**Theme:** "The Digital Monolith" — monochrome Zinc palette

- Colors: CSS custom properties in `index.css` with light/dark variants
- Primary: #09090b (light) / #ffffff (dark)
- Surface: 3-tier hierarchy (container, container-low, container-high)
- Typography: Inter font, tracking-tighter headlines
- Layout: Bento grid (12-col with asymmetric spans)
- Borders: No-line rule (tonal shifts), outline-variant for subtle borders
- Radius: 1rem default, 1.5rem lg, 2.5rem xl, 9999px full
- Glass-morphism: header uses backdrop-blur + semi-transparent bg

**Theme switching:** ThemeProvider context + localStorage persistence. Toggles `<html class="dark|light">`.

---

## Environment Variables

```env
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=<key>
VITE_TURNSTILE_SITE_KEY=<key>
```

- All prefixed with `VITE_` (Vite requirement for client-side access)
- Supabase client used directly for contact_messages and newsletter_subscribers INSERT
- Turnstile used for anti-spam on contact form

---

## Build & Deploy

```bash
npm run dev       # Vite dev server on :5173
npm run build     # tsc -b && vite build
npm run preview   # Preview production build
```

**Vercel:** `vercel.json` rewrites `/*` to `/index.html` (SPA fallback routing)

---

## Conventions

- All `// eslint-disable-next-line @typescript-eslint/no-explicit-any` at top of page files — API responses typed as `AnyData`
- "Portofolio" spelling is intentional throughout
- Blog content supports both Markdown (`content.body` string) and legacy JSON format
- SEO component provides OG/Twitter meta tags per page
- Header/Footer are data-driven from API with hardcoded fallbacks

---

## Gotchas

- **No abort controller in useEffect** — fetches continue after unmount (potential state-update-on-unmounted warnings)
- **Cache grows unbounded** — every unique endpoint creates a cache entry with no eviction
- **No React Error Boundary** — component crashes cause full page failure
- **No code splitting** — all routes bundled in single chunk (no React.lazy)
- **No 404 route** — unmatched paths show empty page with header/footer
- **Markdown rendered without sanitization** — react-markdown with remark-gfm but no DOMPurify/rehype-sanitize
- **API URL fallback to localhost** — if VITE_API_URL is missing in production, requests go to localhost
- **Contact form uses both Supabase direct insert AND API endpoint** — check which is active
