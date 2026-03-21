import { z } from "zod";

// ============================================================
// @xynhub/shared - Zod Validation Schemas
// ============================================================

// ---- Pagination ----
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  per_page: z.coerce.number().int().min(1).max(100).default(20),
});

// ---- Site Settings ----
export const siteSettingSchema = z.object({
  key: z.string().min(1).max(100),
  value: z.record(z.unknown()),
});

// ---- Navigation ----
export const navigationItemSchema = z.object({
  label: z.string().min(1).max(100),
  path: z.string().min(1).max(255),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
  parent_id: z.string().uuid().nullable().default(null),
});

// ---- Footer ----
export const footerSectionSchema = z.object({
  section_key: z.string().min(1).max(100),
  title: z.string().max(200).default(""),
  content: z.record(z.unknown()),
  sort_order: z.number().int().default(0),
});

// ---- Page Content ----
export const pageContentSchema = z.object({
  page_slug: z.string().min(1).max(100),
  section_key: z.string().min(1).max(100),
  content: z.record(z.unknown()),
  sort_order: z.number().int().default(0),
});

// ---- Blog ----
export const blogSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1).max(500),
  category: z.string().min(1).max(100),
  tag: z.string().max(100).nullable().default(null),
  description: z.string().min(1),
  content: z.record(z.unknown()).default({}),
  author_name: z.string().min(1).max(200),
  author_role: z.string().max(200).default(""),
  author_image: z.string().url().nullable().default(null),
  image_url: z.string().url().nullable().default(null),
  icon: z.string().max(50).nullable().default(null),
  is_featured: z.boolean().default(false),
  read_time: z.string().max(50).nullable().default(null),
  published_at: z.string().nullable().default(null),
  is_active: z.boolean().default(true),
});

// ---- Portfolio ----
export const portfolioSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1).max(500),
  tag: z.string().min(1).max(100),
  description: z.string().nullable().default(null),
  image_url: z.string().url().nullable().default(null),
  tech_stack: z.record(z.unknown()).nullable().default(null),
  metrics: z.record(z.unknown()).nullable().default(null),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const portfolioDetailSchema = z.object({
  portfolio_id: z.string().uuid(),
  hero: z.record(z.unknown()).default({}),
  stats: z.record(z.unknown()).default({}),
  narrative: z.record(z.unknown()).default({}),
  features: z.array(z.record(z.unknown())).default([]),
  gallery: z.array(z.record(z.unknown())).default([]),
  cta: z.record(z.unknown()).default({}),
  tags: z.array(z.string()).default([]),
});

// ---- Testimonial ----
export const testimonialSchema = z.object({
  quote: z.string().min(1),
  author_name: z.string().min(1).max(200),
  author_role: z.string().max(200).default(""),
  author_initials: z.string().max(10).default(""),
  author_image: z.string().url().nullable().default(null),
  span_class: z.string().max(100).nullable().default(null),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

// ---- Team Member ----
export const teamMemberSchema = z.object({
  name: z.string().min(1).max(200),
  role: z.string().min(1).max(200),
  group_name: z.string().min(1).max(100),
  image_url: z.string().url().nullable().default(null),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

// ---- FAQ ----
export const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  page_slug: z.string().min(1).max(100).default("home"),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

// ---- Media ----
export const mediaUploadSchema = z.object({
  alt_text: z.string().max(500).nullable().default(null),
});

// ---- Export inferred types from schemas ----
export type CreateSiteSetting = z.infer<typeof siteSettingSchema>;
export type CreateNavigationItem = z.infer<typeof navigationItemSchema>;
export type CreateFooterSection = z.infer<typeof footerSectionSchema>;
export type CreatePageContent = z.infer<typeof pageContentSchema>;
export type CreateBlog = z.infer<typeof blogSchema>;
export type CreatePortfolio = z.infer<typeof portfolioSchema>;
export type CreatePortfolioDetail = z.infer<typeof portfolioDetailSchema>;
export type CreateTestimonial = z.infer<typeof testimonialSchema>;
export type CreateTeamMember = z.infer<typeof teamMemberSchema>;
export type CreateFAQ = z.infer<typeof faqSchema>;
