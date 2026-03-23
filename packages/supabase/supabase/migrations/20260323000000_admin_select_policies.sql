-- ============================================================
-- Migration: Add authenticated SELECT policies for admin CMS
-- ============================================================
-- The admin panel now queries Supabase directly (bypassing the API).
-- Public SELECT policies filter by is_active/published status,
-- but admin users need to see ALL records.
-- PostgreSQL RLS policies are OR'd — adding these supplements
-- existing public policies without breaking them.
-- ============================================================

-- Tables from initial schema
DO $$ BEGIN
  CREATE POLICY "Admin read all page_contents" ON page_contents FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admin read all blogs" ON blogs FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admin read all portfolios" ON portfolios FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admin read all portfolio_details" ON portfolio_details FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admin read all testimonials" ON testimonials FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admin read all team_members" ON team_members FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admin read all faqs" ON faqs FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admin read all navigation_items" ON navigation_items FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admin read all footer_sections" ON footer_sections FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admin read all site_settings" ON site_settings FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admin read all media" ON media FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Tables from second migration (services already has public read with is_active filter)
DO $$ BEGIN
  CREATE POLICY "Admin read all services" ON services FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- Storage policies for direct browser uploads
-- ============================================================
DO $$ BEGIN
  CREATE POLICY "Authenticated upload media" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated delete media" ON storage.objects
    FOR DELETE TO authenticated USING (bucket_id = 'media');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public read media storage" ON storage.objects
    FOR SELECT USING (bucket_id = 'media');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
