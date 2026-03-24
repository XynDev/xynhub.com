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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = Record<string, any>

const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 60 * 1000; // 1 minute
const CACHE_MAX_SIZE = 100; // Prevent unbounded memory growth

function cacheSet(key: string, data: unknown) {
  // Evict oldest entries if cache is full
  if (cache.size >= CACHE_MAX_SIZE) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, { data, timestamp: Date.now() });
}

async function fetchApi<T>(endpoint: string, signal?: AbortSignal): Promise<T> {
  const cached = cache.get(endpoint);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }

  const res = await fetch(`${API_URL}${endpoint}`, { signal });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  cacheSet(endpoint, json);
  return json;
}

// Page content (returns flat object keyed by section)
export async function getPageContent(slug: string): Promise<AnyData> {
  const res = await fetchApi<ApiResponse<AnyData>>(`/api/v1/pages/${slug}`);
  return res.data;
}

// Blogs
export async function getBlogs(params?: {
  page?: number;
  per_page?: number;
  category?: string;
  featured?: string;
}): Promise<PaginatedResponse<AnyData>> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.per_page) query.set("per_page", String(params.per_page));
  if (params?.category) query.set("category", params.category);
  if (params?.featured) query.set("featured", params.featured);
  const qs = query.toString();
  return fetchApi<PaginatedResponse<AnyData>>(
    `/api/v1/blogs${qs ? `?${qs}` : ""}`
  );
}

export async function getBlogBySlug(slug: string): Promise<ApiResponse<AnyData>> {
  return fetchApi<ApiResponse<AnyData>>(`/api/v1/blogs/${slug}`);
}

// Portfolios
export async function getPortfolios(): Promise<ApiResponse<AnyData[]>> {
  return fetchApi<ApiResponse<AnyData[]>>(`/api/v1/portfolios`);
}

export async function getPortfolioBySlug(slug: string): Promise<ApiResponse<AnyData>> {
  return fetchApi<ApiResponse<AnyData>>(`/api/v1/portfolios/${slug}`);
}

// Services
export async function getServices(params?: { featured?: string }): Promise<ApiResponse<AnyData[]>> {
  const query = new URLSearchParams();
  if (params?.featured) query.set("featured", params.featured);
  const qs = query.toString();
  return fetchApi<ApiResponse<AnyData[]>>(`/api/v1/services${qs ? `?${qs}` : ""}`);
}

export async function getServiceBySlug(slug: string): Promise<ApiResponse<AnyData>> {
  return fetchApi<ApiResponse<AnyData>>(`/api/v1/services/${slug}`);
}

// Contact
export async function submitContact(data: { name: string; email: string; message: string }): Promise<ApiResponse<null>> {
  const res = await fetch(`${API_URL}/api/v1/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error || "Failed to send message");
  }
  return res.json();
}

// Newsletter
export async function subscribeNewsletter(email: string): Promise<ApiResponse<null>> {
  const res = await fetch(`${API_URL}/api/v1/newsletter/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error || "Failed to subscribe");
  }
  return res.json();
}

// Other
export async function getNavigation(): Promise<ApiResponse<AnyData[]>> {
  return fetchApi<ApiResponse<AnyData[]>>(`/api/v1/navigation`);
}

export async function getFooter(): Promise<ApiResponse<AnyData>> {
  return fetchApi<ApiResponse<AnyData>>(`/api/v1/footer`);
}

export async function getSettings(): Promise<ApiResponse<AnyData>> {
  return fetchApi<ApiResponse<AnyData>>(`/api/v1/settings`);
}

export async function getTestimonials(): Promise<ApiResponse<AnyData[]>> {
  return fetchApi<ApiResponse<AnyData[]>>(`/api/v1/testimonials`);
}

export async function getTeam(): Promise<ApiResponse<AnyData>> {
  return fetchApi<ApiResponse<AnyData>>(`/api/v1/team`);
}

export async function getFaqs(page?: string): Promise<ApiResponse<AnyData[]>> {
  return fetchApi<ApiResponse<AnyData[]>>(
    `/api/v1/faqs${page ? `?page=${page}` : ""}`
  );
}
