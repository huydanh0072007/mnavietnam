-- Migration 002: Alter settings and create admin_notifications table

-- 1. Alter Settings Table
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS phone VARCHAR;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS email VARCHAR;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS zalo_url VARCHAR;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS facebook_url VARCHAR;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS hero_title VARCHAR;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS hero_subtitle VARCHAR;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS ai_provider VARCHAR;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS ai_api_key VARCHAR;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS ai_model VARCHAR;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS about_hero_title VARCHAR;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS about_hero_subtitle VARCHAR;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS about_vision_title VARCHAR;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS about_vision_desc_1 VARCHAR;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS about_vision_desc_2 VARCHAR;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS about_stats JSONB;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS about_values JSONB;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS enable_email_notif BOOLEAN DEFAULT true;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS notification_email_recipients VARCHAR;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS notification_frequency VARCHAR DEFAULT 'immediate';

-- 2. Create Admin Notifications Table
CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR NOT NULL,
  content TEXT,
  type VARCHAR NOT NULL, -- 'new_lead' | 'vdr_sign' | 'project_update'
  link VARCHAR,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Disable to match the project's config-based API access
ALTER TABLE public.admin_notifications DISABLE ROW LEVEL SECURITY;
