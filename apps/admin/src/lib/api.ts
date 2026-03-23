import { createClient } from "./supabase";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function getAuthHeaders(): Promise<Record<string, string>> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Not authenticated");
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
    "Content-Type": "application/json",
  };
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = await getAuthHeaders();

  // Don't set Content-Type for FormData (file uploads)
  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  });

  // Handle non-JSON error responses (e.g. Vercel 504 returns plain text)
  const text = await res.text();
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(text);
  } catch {
    if (!res.ok) {
      throw new Error(
        res.status === 504
          ? "Server timeout — please try again in a moment"
          : `Server error (${res.status}): ${text.slice(0, 100)}`
      );
    }
    throw new Error("Invalid response from server");
  }

  if (!res.ok) {
    throw new Error((data.error as string) || `API error: ${res.status}`);
  }

  return data as T;
}

// Public API (no auth needed)
export async function publicFetch<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`);
  const text = await res.text();
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(res.ok ? "Invalid response" : `Server error (${res.status})`);
  }
  if (!res.ok) throw new Error((data.error as string) || `API error: ${res.status}`);
  return data as T;
}
