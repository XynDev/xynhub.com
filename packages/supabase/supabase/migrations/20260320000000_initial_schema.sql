-- ============================================================
-- XYNHub CMS Database Schema
-- Scalable, secure, dynamic content management
-- ============================================================

-- ============================================================
-- 1. SITE SETTINGS - Global key-value configuration
-- ============================================================
CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL DEFAULT '{}',
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_site_settings_key ON site_settings(key);

-- ============================================================
-- 2. NAVIGATION - Menu items with self-referencing hierarchy
-- ============================================================
CREATE TABLE navigation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label VARCHAR(100) NOT NULL,
    path VARCHAR(255) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    parent_id UUID REFERENCES navigation_items(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_navigation_sort ON navigation_items(sort_order);
CREATE INDEX idx_navigation_parent ON navigation_items(parent_id);

-- ============================================================
-- 3. FOOTER SECTIONS - Dynamic footer content
-- ============================================================
CREATE TABLE footer_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL DEFAULT '',
    content JSONB NOT NULL DEFAULT '{}',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_footer_sort ON footer_sections(sort_order);

-- ============================================================
-- 4. PAGE CONTENTS - JSONB-based content for static pages
-- ============================================================
CREATE TABLE page_contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_slug VARCHAR(100) NOT NULL,
    section_key VARCHAR(100) NOT NULL,
    content JSONB NOT NULL DEFAULT '{}',
    sort_order INTEGER NOT NULL DEFAULT 0,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(page_slug, section_key)
);

CREATE INDEX idx_page_contents_slug ON page_contents(page_slug);
CREATE INDEX idx_page_contents_lookup ON page_contents(page_slug, section_key);

-- ============================================================
-- 5. BLOGS - Full blog management
-- ============================================================
CREATE TABLE blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'general',
    tag VARCHAR(100),
    description TEXT NOT NULL DEFAULT '',
    content JSONB NOT NULL DEFAULT '{}',
    author_name VARCHAR(200) NOT NULL,
    author_role VARCHAR(200) NOT NULL DEFAULT '',
    author_image TEXT,
    image_url TEXT,
    icon VARCHAR(50),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    read_time VARCHAR(50),
    published_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_blogs_category ON blogs(category);
CREATE INDEX idx_blogs_featured ON blogs(is_featured) WHERE is_featured = true;
CREATE INDEX idx_blogs_published ON blogs(published_at DESC) WHERE is_active = true;

-- ============================================================
-- 6. PORTFOLIOS - Portfolio list items
-- ============================================================
CREATE TABLE portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    tag VARCHAR(100) NOT NULL DEFAULT '',
    description TEXT,
    image_url TEXT,
    tech_stack JSONB,
    metrics JSONB,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_portfolios_slug ON portfolios(slug);
CREATE INDEX idx_portfolios_sort ON portfolios(sort_order);

-- ============================================================
-- 7. PORTFOLIO DETAILS - Extended portfolio detail content
-- ============================================================
CREATE TABLE portfolio_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID UNIQUE NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    hero JSONB NOT NULL DEFAULT '{}',
    stats JSONB NOT NULL DEFAULT '{}',
    narrative JSONB NOT NULL DEFAULT '{}',
    features JSONB NOT NULL DEFAULT '[]',
    gallery JSONB NOT NULL DEFAULT '[]',
    cta JSONB NOT NULL DEFAULT '{}',
    tags TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_portfolio_details_portfolio ON portfolio_details(portfolio_id);

-- ============================================================
-- 8. TESTIMONIALS
-- ============================================================
CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote TEXT NOT NULL,
    author_name VARCHAR(200) NOT NULL,
    author_role VARCHAR(200) NOT NULL DEFAULT '',
    author_initials VARCHAR(10) NOT NULL DEFAULT '',
    author_image TEXT,
    span_class VARCHAR(100),
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_testimonials_sort ON testimonials(sort_order);

-- ============================================================
-- 9. TEAM MEMBERS
-- ============================================================
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    role VARCHAR(200) NOT NULL,
    group_name VARCHAR(100) NOT NULL DEFAULT 'default',
    image_url TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_team_members_group ON team_members(group_name);
CREATE INDEX idx_team_members_sort ON team_members(sort_order);

-- ============================================================
-- 10. FAQS
-- ============================================================
CREATE TABLE faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    page_slug VARCHAR(100) NOT NULL DEFAULT 'home',
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_faqs_page ON faqs(page_slug);
CREATE INDEX idx_faqs_sort ON faqs(sort_order);

-- ============================================================
-- 11. MEDIA - File uploads tracking
-- ============================================================
CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name VARCHAR(500) NOT NULL,
    file_url TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL DEFAULT 0,
    alt_text VARCHAR(500),
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_media_type ON media(file_type);

-- ============================================================
-- AUTO-UPDATE TIMESTAMPS TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN
        SELECT unnest(ARRAY[
            'site_settings', 'navigation_items', 'footer_sections',
            'page_contents', 'blogs', 'portfolios', 'portfolio_details',
            'testimonials', 'team_members', 'faqs', 'media'
        ])
    LOOP
        EXECUTE format(
            'CREATE TRIGGER trigger_update_%s_updated_at
             BEFORE UPDATE ON %I
             FOR EACH ROW EXECUTE FUNCTION update_updated_at()',
            t, t
        );
    END LOOP;
END;
$$;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Public read policies (anon can read active content)
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read navigation_items" ON navigation_items FOR SELECT USING (is_active = true);
CREATE POLICY "Public read footer_sections" ON footer_sections FOR SELECT USING (true);
CREATE POLICY "Public read page_contents" ON page_contents FOR SELECT USING (true);
CREATE POLICY "Public read blogs" ON blogs FOR SELECT USING (is_active = true);
CREATE POLICY "Public read portfolios" ON portfolios FOR SELECT USING (is_active = true);
CREATE POLICY "Public read portfolio_details" ON portfolio_details FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Public read team_members" ON team_members FOR SELECT USING (is_active = true);
CREATE POLICY "Public read faqs" ON faqs FOR SELECT USING (is_active = true);
CREATE POLICY "Public read media" ON media FOR SELECT USING (true);

-- Admin write policies (authenticated users can CRUD)
-- Note: Email whitelist check is done at the API middleware level
CREATE POLICY "Admin insert site_settings" ON site_settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update site_settings" ON site_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin delete site_settings" ON site_settings FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin insert navigation_items" ON navigation_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update navigation_items" ON navigation_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin delete navigation_items" ON navigation_items FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin insert footer_sections" ON footer_sections FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update footer_sections" ON footer_sections FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin delete footer_sections" ON footer_sections FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin insert page_contents" ON page_contents FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update page_contents" ON page_contents FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin delete page_contents" ON page_contents FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin insert blogs" ON blogs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update blogs" ON blogs FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin delete blogs" ON blogs FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin insert portfolios" ON portfolios FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update portfolios" ON portfolios FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin delete portfolios" ON portfolios FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin insert portfolio_details" ON portfolio_details FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update portfolio_details" ON portfolio_details FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin delete portfolio_details" ON portfolio_details FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin insert testimonials" ON testimonials FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update testimonials" ON testimonials FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin delete testimonials" ON testimonials FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin insert team_members" ON team_members FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update team_members" ON team_members FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin delete team_members" ON team_members FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin insert faqs" ON faqs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update faqs" ON faqs FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin delete faqs" ON faqs FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin insert media" ON media FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update media" ON media FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin delete media" ON media FOR DELETE TO authenticated USING (true);

-- ============================================================
-- STORAGE BUCKET for media uploads
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'media',
    'media',
    true,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'application/pdf']
) ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public read media bucket" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Admin upload media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media');
CREATE POLICY "Admin update media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'media');
CREATE POLICY "Admin delete media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media');
