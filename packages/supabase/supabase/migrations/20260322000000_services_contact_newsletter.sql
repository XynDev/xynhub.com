-- ============================================================
-- Migration: services, contact_messages, newsletter_subscribers
-- + portfolio columns (short_description, is_featured)
-- ============================================================

-- ============================================================
-- 1. SERVICES TABLE
-- ============================================================
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    short_description TEXT NOT NULL DEFAULT '',
    icon VARCHAR(100),
    image_url TEXT,
    number VARCHAR(20),
    metrics JSONB NOT NULL DEFAULT '{}',
    tooling JSONB NOT NULL DEFAULT '[]',
    features JSONB NOT NULL DEFAULT '[]',
    is_featured BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_services_slug ON services(slug);
CREATE INDEX idx_services_sort ON services(sort_order);
CREATE INDEX idx_services_featured ON services(is_featured) WHERE is_featured = true;

-- ============================================================
-- 2. CONTACT MESSAGES TABLE (public INSERT)
-- ============================================================
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    email VARCHAR(320) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contact_messages_created ON contact_messages(created_at DESC);

-- ============================================================
-- 3. NEWSLETTER SUBSCRIBERS TABLE (public INSERT)
-- ============================================================
CREATE TABLE newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(320) UNIQUE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);

-- ============================================================
-- 4. ADD COLUMNS TO PORTFOLIOS
-- ============================================================
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS short_description TEXT NOT NULL DEFAULT '';
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX idx_portfolios_featured ON portfolios(is_featured) WHERE is_featured = true;

-- ============================================================
-- 5. UPDATED_AT TRIGGERS
-- ============================================================
CREATE TRIGGER trigger_update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 6. ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Services: public read active, admin CRUD
CREATE POLICY "Public read services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Admin insert services" ON services FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update services" ON services FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin delete services" ON services FOR DELETE TO authenticated USING (true);

-- Contact messages: public INSERT (anyone can send), admin read/delete
CREATE POLICY "Public insert contact_messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read contact_messages" ON contact_messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin update contact_messages" ON contact_messages FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin delete contact_messages" ON contact_messages FOR DELETE TO authenticated USING (true);

-- Newsletter: public INSERT (anyone can subscribe), admin read/delete
CREATE POLICY "Public insert newsletter_subscribers" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read newsletter_subscribers" ON newsletter_subscribers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin delete newsletter_subscribers" ON newsletter_subscribers FOR DELETE TO authenticated USING (true);

-- ============================================================
-- 7. PAGE CONTENT SEEDS for privacy-policy and terms-of-service
-- ============================================================
INSERT INTO page_contents (page_slug, section_key, content, sort_order) VALUES
  ('privacy-policy', 'content', '{"title": "Privacy Policy", "body": "# Privacy Policy\n\nLast updated: March 22, 2026\n\nYour privacy is important to us. This Privacy Policy explains how XYNHub collects, uses, and protects your information.\n\n## Information We Collect\n\nWe collect information you provide directly, such as your name, email address, and any messages you send through our contact form.\n\n## How We Use Your Information\n\n- To respond to your inquiries\n- To send newsletters (if you subscribe)\n- To improve our services\n\n## Data Protection\n\nWe implement appropriate security measures to protect your personal information.\n\n## Contact Us\n\nIf you have questions about this Privacy Policy, please contact us."}', 1),
  ('terms-of-service', 'content', '{"title": "Terms of Service", "body": "# Terms of Service\n\nLast updated: March 22, 2026\n\nBy using XYNHub services, you agree to these terms.\n\n## Services\n\nXYNHub provides web development, mobile app development, cloud solutions, and related technology services.\n\n## User Responsibilities\n\nYou agree to use our services in compliance with all applicable laws and regulations.\n\n## Intellectual Property\n\nAll content and materials on this website are the property of XYNHub unless otherwise stated.\n\n## Limitation of Liability\n\nXYNHub shall not be liable for any indirect, incidental, or consequential damages.\n\n## Changes to Terms\n\nWe reserve the right to modify these terms at any time.\n\n## Contact Us\n\nFor questions about these Terms of Service, please contact us."}', 1)
ON CONFLICT (page_slug, section_key) DO NOTHING;
