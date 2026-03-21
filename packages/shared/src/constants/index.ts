// Page slugs
export const PAGE_SLUGS = {
  HOME: "home",
  ABOUT: "about",
  SERVICES: "services",
  SERVICE_DETAIL: "service-detail",
  PROCESS: "process",
  BLOGS: "blogs",
  PORTFOLIO: "portofolio",
} as const;

// Section keys per page
export const PAGE_SECTIONS = {
  home: [
    "hero",
    "trust",
    "stats",
    "services",
    "works",
    "testimonials",
    "whyUs",
    "cta",
    "faq",
    "contactInfo",
  ],
  about: [
    "hero",
    "timeline",
    "tenets",
    "culture",
    "leadership",
    "cta",
    "contact",
  ],
  services: ["hero", "web", "tooling", "app", "cloud", "cta"],
  "service-detail": [
    "hero",
    "security",
    "memory",
    "routing",
    "stress",
    "habits",
    "cta",
  ],
  process: ["hero", "phases", "phase4", "phase5"],
  blogs: ["hero"],
  portofolio: ["header", "proficiency", "features", "contact"],
} as const;

// Default site settings keys
export const SITE_SETTINGS_KEYS = {
  SITE_NAME: "site_name",
  SITE_DESCRIPTION: "site_description",
  LOGO_LIGHT: "logo_light",
  LOGO_DARK: "logo_dark",
  FAVICON: "favicon",
  SEO_DEFAULT: "seo_default",
  SOCIAL_LINKS: "social_links",
} as const;

export type PageSlug = (typeof PAGE_SLUGS)[keyof typeof PAGE_SLUGS];
