const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 60 * 1000; // 1 minute

async function fetchApi<T>(endpoint: string): Promise<T> {
  const cached = cache.get(endpoint);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }

  const res = await fetch(`${API_URL}${endpoint}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  cache.set(endpoint, { data: json, timestamp: Date.now() });
  return json;
}

// Page content (returns flat object keyed by section)
export async function getPageContent<T = Record<string, unknown>>(
  slug: string
): Promise<T> {
  const res = await fetchApi<ApiResponse<T>>(`/api/v1/pages/${slug}`);
  return res.data;
}

// Blogs
export async function getBlogs(params?: {
  page?: number;
  per_page?: number;
  category?: string;
  featured?: string;
}) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.per_page) query.set("per_page", String(params.per_page));
  if (params?.category) query.set("category", params.category);
  if (params?.featured) query.set("featured", params.featured);
  const qs = query.toString();
  return fetchApi<PaginatedResponse<Record<string, unknown>>>(
    `/api/v1/blogs${qs ? `?${qs}` : ""}`
  );
}

export async function getBlogBySlug(slug: string) {
  return fetchApi<ApiResponse<Record<string, unknown>>>(
    `/api/v1/blogs/${slug}`
  );
}

// Portfolios
export async function getPortfolios() {
  return fetchApi<ApiResponse<Record<string, unknown>[]>>(
    `/api/v1/portfolios`
  );
}

export async function getPortfolioBySlug(slug: string) {
  return fetchApi<ApiResponse<Record<string, unknown>>>(
    `/api/v1/portfolios/${slug}`
  );
}

// Other
export async function getNavigation() {
  return fetchApi<ApiResponse<Record<string, unknown>[]>>(
    `/api/v1/navigation`
  );
}

export async function getFooter() {
  return fetchApi<ApiResponse<Record<string, unknown>>>(`/api/v1/footer`);
}

export async function getSettings() {
  return fetchApi<ApiResponse<Record<string, unknown>>>(`/api/v1/settings`);
}

export async function getTestimonials() {
  return fetchApi<ApiResponse<Record<string, unknown>[]>>(
    `/api/v1/testimonials`
  );
}

export async function getTeam() {
  return fetchApi<ApiResponse<Record<string, unknown>>>(`/api/v1/team`);
}

export async function getFaqs(page?: string) {
  return fetchApi<ApiResponse<Record<string, unknown>[]>>(
    `/api/v1/faqs${page ? `?page=${page}` : ""}`
  );
}
