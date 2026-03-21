import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Context } from "hono";

// Lazy initialization — avoids crashing at module load if env vars are missing
let _admin: SupabaseClient;
let _public: SupabaseClient;

function env(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing env: ${key}`);
  return val;
}

// Admin client (bypasses RLS) - for server-side operations
export function getAdmin(): SupabaseClient {
  if (!_admin) {
    _admin = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return _admin;
}

// Public client (respects RLS) - for public read operations
export function getPublic(): SupabaseClient {
  if (!_public) {
    _public = createClient(env("SUPABASE_URL"), env("SUPABASE_ANON_KEY"));
  }
  return _public;
}

// Backward-compatible named exports using getter
export const supabaseAdmin: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_, prop, receiver) {
    const client = getAdmin();
    const value = Reflect.get(client, prop, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

export const supabasePublic: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_, prop, receiver) {
    const client = getPublic();
    const value = Reflect.get(client, prop, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

// Create authenticated client from request token
export function getSupabaseClient(c: Context): SupabaseClient {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return getPublic();

  return createClient(env("SUPABASE_URL"), env("SUPABASE_ANON_KEY"), {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}
