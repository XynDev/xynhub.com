// ============================================================
// @xynhub/shared - Type Definitions
// ============================================================

// ---- Base Types ----
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface SortableEntity extends BaseEntity {
  sort_order: number;
}

export interface PublishableEntity extends BaseEntity {
  is_active: boolean;
}

// ---- Site Settings ----
export interface SiteSetting extends BaseEntity {
  key: string;
  value: Record<string, unknown>;
  updated_by: string | null;
}

// ---- Navigation ----
export interface NavigationItem extends SortableEntity {
  label: string;
  path: string;
  is_active: boolean;
  parent_id: string | null;
  children?: NavigationItem[];
}

// ---- Footer ----
export interface FooterSection extends SortableEntity {
  section_key: string;
  title: string;
  content: Record<string, unknown>;
}

// ---- Page Content (JSONB-based for static pages) ----
export interface PageContent extends BaseEntity {
  page_slug: string;
  section_key: string;
  content: Record<string, unknown>;
  sort_order: number;
  updated_by: string | null;
}

// ---- Blogs ----
export interface Blog extends BaseEntity {
  slug: string;
  title: string;
  category: string;
  tag: string | null;
  description: string;
  content: Record<string, unknown>;
  author_name: string;
  author_role: string;
  author_image: string | null;
  image_url: string | null;
  icon: string | null;
  is_featured: boolean;
  read_time: string | null;
  published_at: string | null;
  is_active: boolean;
}

export interface BlogListItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  tag: string | null;
  description: string;
  author_name: string;
  author_role: string;
  author_image: string | null;
  image_url: string | null;
  icon: string | null;
  is_featured: boolean;
  read_time: string | null;
  published_at: string | null;
}

// ---- Services ----
export interface Service extends BaseEntity {
  slug: string;
  title: string;
  description: string;
  short_description: string;
  icon: string | null;
  image_url: string | null;
  number: string | null;
  metrics: Record<string, unknown>;
  tooling: Record<string, unknown>[];
  features: Record<string, unknown>[];
  is_featured: boolean;
  sort_order: number;
  is_active: boolean;
}

// ---- Portfolios ----
export interface Portfolio extends BaseEntity {
  slug: string;
  title: string;
  tag: string;
  description: string | null;
  short_description: string;
  image_url: string | null;
  tech_stack: Record<string, unknown> | null;
  metrics: Record<string, unknown> | null;
  is_featured: boolean;
  sort_order: number;
  is_active: boolean;
}

export interface PortfolioDetail extends BaseEntity {
  portfolio_id: string;
  hero: Record<string, unknown>;
  stats: Record<string, unknown>;
  narrative: Record<string, unknown>;
  features: Record<string, unknown>[];
  gallery: Record<string, unknown>[];
  cta: Record<string, unknown>;
  tags: string[];
}

// ---- Testimonials ----
export interface Testimonial extends SortableEntity {
  quote: string;
  author_name: string;
  author_role: string;
  author_initials: string;
  author_image: string | null;
  span_class: string | null;
  is_active: boolean;
}

// ---- Team Members ----
export interface TeamMember extends SortableEntity {
  name: string;
  role: string;
  group_name: string;
  image_url: string | null;
  social_links: { url: string }[];
  is_active: boolean;
}

// ---- FAQ ----
export interface FAQ extends SortableEntity {
  question: string;
  answer: string;
  page_slug: string;
  is_active: boolean;
}

// ---- Contact Messages ----
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// ---- Newsletter Subscribers ----
export interface NewsletterSubscriber {
  id: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

// ---- Media ----
export interface Media extends BaseEntity {
  file_name: string;
  file_url: string;
  file_path: string;
  file_type: string;
  file_size: number;
  alt_text: string | null;
  uploaded_by: string | null;
}

// ---- API Response Types ----
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface ApiError {
  success: false;
  error: string;
  details?: unknown;
}

// ---- Auth ----
export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  provider: string;
}
