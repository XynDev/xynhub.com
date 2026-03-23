-- Add social_links JSONB column to team_members
-- Stores array of {url: string} objects, e.g. [{"url":"https://linkedin.com/in/..."},{"url":"https://github.com/..."}]
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '[]'::jsonb;
