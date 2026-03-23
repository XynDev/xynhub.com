/**
 * Direct Supabase CRUD operations for admin CMS.
 *
 * Bypasses the Hono API entirely — browser → Supabase directly.
 * This eliminates Vercel serverless function timeouts (504) on Hobby plan.
 *
 * The admin user is already authenticated via @supabase/ssr,
 * and RLS policies allow authenticated users full CRUD access.
 */
import { createClient } from "./supabase";

// ─── Helpers ──────────────────────────────────────────────

function throwIfError(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

// ─── Generic CRUD ─────────────────────────────────────────

export async function dbList<T>(
  table: string,
  opts?: {
    orderBy?: string;
    ascending?: boolean;
    filter?: Record<string, unknown>;
    limit?: number;
  }
): Promise<{ data: T[]; pagination: { total: number } }> {
  const supabase = createClient();
  let q = supabase.from(table).select("*", { count: "exact" });
  if (opts?.filter) {
    for (const [key, val] of Object.entries(opts.filter)) {
      q = q.eq(key, val);
    }
  }
  if (opts?.orderBy) q = q.order(opts.orderBy, { ascending: opts.ascending ?? true });
  if (opts?.limit) q = q.limit(opts.limit);
  const { data, error, count } = await q;
  throwIfError(error);
  return { data: (data || []) as T[], pagination: { total: count || 0 } };
}

export async function dbGet<T>(
  table: string,
  id: string
): Promise<{ data: T }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("id", id)
    .single();
  throwIfError(error);
  return { data: data as T };
}

export async function dbCreate<T>(
  table: string,
  record: Record<string, unknown>
): Promise<{ data: T }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(table)
    .insert(record)
    .select()
    .single();
  throwIfError(error);
  return { data: data as T };
}

export async function dbUpdate<T>(
  table: string,
  id: string,
  record: Record<string, unknown>
): Promise<{ data: T }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(table)
    .update(record)
    .eq("id", id)
    .select()
    .single();
  throwIfError(error);
  return { data: data as T };
}

export async function dbDelete(table: string, id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from(table).delete().eq("id", id);
  throwIfError(error);
}

// ─── Pages ────────────────────────────────────────────────

export async function dbGetPageSections<T>(
  slug: string
): Promise<{ data: T[] }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("page_contents")
    .select("*")
    .eq("page_slug", slug)
    .order("sort_order");
  throwIfError(error);
  return { data: (data || []) as T[] };
}

export async function dbUpsertPageSection(
  pageSlug: string,
  sectionKey: string,
  content: unknown,
  sortOrder: number
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("page_contents").upsert(
    {
      page_slug: pageSlug,
      section_key: sectionKey,
      content,
      sort_order: sortOrder,
    },
    { onConflict: "page_slug,section_key" }
  );
  throwIfError(error);
}

// ─── Portfolios (with detail) ─────────────────────────────

export async function dbGetPortfolioWithDetail<T>(
  id: string
): Promise<{ data: T }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("portfolios")
    .select("*, detail:portfolio_details(*)")
    .eq("id", id)
    .single();
  throwIfError(error);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const portfolio = data as Record<string, any>;
  const detailArr = portfolio.detail;
  portfolio.detail = Array.isArray(detailArr)
    ? detailArr[0] || {}
    : detailArr || {};
  return { data: portfolio as T };
}

export async function dbCreatePortfolio(
  record: Record<string, unknown>
): Promise<{ data: unknown }> {
  const supabase = createClient();
  const { detail, ...portfolioData } = record;

  const { data: portfolio, error } = await supabase
    .from("portfolios")
    .insert(portfolioData)
    .select()
    .single();
  throwIfError(error);

  if (detail && typeof detail === "object") {
    const { error: detailError } = await supabase
      .from("portfolio_details")
      .upsert(
        {
          portfolio_id: portfolio.id,
          ...(detail as Record<string, unknown>),
        },
        { onConflict: "portfolio_id" }
      );
    throwIfError(detailError);
  }

  return { data: portfolio };
}

export async function dbUpdatePortfolio(
  id: string,
  record: Record<string, unknown>
): Promise<{ data: unknown }> {
  const supabase = createClient();
  const { detail, ...portfolioData } = record;

  const { data: portfolio, error } = await supabase
    .from("portfolios")
    .update(portfolioData)
    .eq("id", id)
    .select()
    .single();
  throwIfError(error);

  if (detail && typeof detail === "object") {
    const { error: detailError } = await supabase
      .from("portfolio_details")
      .upsert(
        {
          portfolio_id: id,
          ...(detail as Record<string, unknown>),
        },
        { onConflict: "portfolio_id" }
      );
    throwIfError(detailError);
  }

  return { data: portfolio };
}

export async function dbDeletePortfolio(id: string): Promise<void> {
  const supabase = createClient();
  await supabase.from("portfolio_details").delete().eq("portfolio_id", id);
  const { error } = await supabase.from("portfolios").delete().eq("id", id);
  throwIfError(error);
}

// ─── Settings (keyed by `key`, not `id`) ──────────────────

export async function dbUpsertSetting(
  key: string,
  value: unknown
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key, value }, { onConflict: "key" });
  throwIfError(error);
}

export async function dbDeleteSetting(key: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("site_settings")
    .delete()
    .eq("key", key);
  throwIfError(error);
}

// ─── Media (Storage + table) ──────────────────────────────

export async function dbUploadMedia(
  file: File,
  altText?: string
): Promise<{
  data: {
    id: string;
    file_name: string;
    file_url: string;
    file_type: string;
    file_size: number;
    alt_text: string | null;
  };
}> {
  const supabase = createClient();

  const ext = file.name.split(".").pop() || "bin";
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  const path = `uploads/${ts}-${rand}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(path, file);
  if (uploadError) throw new Error(uploadError.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from("media").getPublicUrl(path);

  const { data, error } = await supabase
    .from("media")
    .insert({
      file_name: file.name,
      file_url: publicUrl,
      file_path: path,
      file_type: file.type,
      file_size: file.size,
      alt_text: altText || null,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);

  return { data };
}

export async function dbDeleteMedia(id: string): Promise<void> {
  const supabase = createClient();
  const { data: media } = await supabase
    .from("media")
    .select("file_path")
    .eq("id", id)
    .single();
  if (media?.file_path) {
    await supabase.storage.from("media").remove([media.file_path]);
  }
  const { error } = await supabase.from("media").delete().eq("id", id);
  throwIfError(error);
}

export async function dbCleanupMediaByUrl(url: string): Promise<void> {
  if (!url || !url.includes("/storage/")) return;
  const supabase = createClient();
  const match = url.match(/\/storage\/v1\/object\/public\/media\/(.+)$/);
  if (match?.[1]) {
    // Remove file from storage
    await supabase.storage.from("media").remove([match[1]]);
    // Remove matching record from media table
    await supabase.from("media").delete().eq("file_url", url);
  }
}
