-- Add social_links JSONB column to team_members
-- Stores object with named platform keys:
-- {"linkedin": "https://...", "instagram": "https://...", "whatsapp": "https://wa.me/...", "website": "https://...", "other": "https://..."}
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb;
