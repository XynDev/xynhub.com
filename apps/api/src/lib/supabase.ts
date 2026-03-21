import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Context } from "hono";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Admin client (bypasses RLS) - for server-side operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Public client (respects RLS) - for public read operations
export const supabasePublic = createClient(supabaseUrl, supabaseAnonKey);

// Create authenticated client from request token
export function getSupabaseClient(c: Context): SupabaseClient {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return supabasePublic;

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}
