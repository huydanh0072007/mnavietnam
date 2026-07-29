-- ==========================================
-- SUPABASE SCHEMA SETUP FOR MNA VIETNAM
-- ==========================================

-- 1. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_code VARCHAR NOT NULL UNIQUE,
  title VARCHAR NOT NULL,
  slug VARCHAR NOT NULL UNIQUE,
  deal_type VARCHAR NOT NULL,
  status_label VARCHAR NOT NULL,
  project_type VARCHAR NOT NULL,
  province VARCHAR NOT NULL,
  district VARCHAR NOT NULL,
  scale VARCHAR NOT NULL,
  legal_status_summary TEXT,
  current_status VARCHAR,
  valuation_display VARCHAR,
  show_valuation BOOLEAN DEFAULT false,
  capital_structure_summary TEXT,
  highlights JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  teaser_pdf VARCHAR,
  is_featured BOOLEAN DEFAULT false,
  featured_order INTEGER DEFAULT 0,
  publish_status VARCHAR DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Leads Table
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_type VARCHAR NOT NULL,
  full_name VARCHAR NOT NULL,
  organization VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  role_title VARCHAR,
  message TEXT,
  project_name_location VARCHAR,
  preferred_deal_type VARCHAR,
  estimated_scale VARCHAR,
  attachment_url VARCHAR,
  related_project_id UUID REFERENCES public.projects(id),
  status VARCHAR NOT NULL,
  assigned_admin_id UUID,
  internal_notes JSONB DEFAULT '[]'::jsonb,
  audit_logs JSONB DEFAULT '[]'::jsonb,
  signature_url VARCHAR,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Settings Table (Global configuration)
CREATE TABLE IF NOT EXISTS public.settings (
  id VARCHAR PRIMARY KEY DEFAULT 'global',
  smtp_host VARCHAR,
  smtp_port INTEGER,
  smtp_secure BOOLEAN,
  smtp_user VARCHAR,
  smtp_pass VARCHAR,
  smtp_from_name VARCHAR,
  smtp_from_email VARCHAR,
  notify_emails JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Master Data Table
CREATE TABLE IF NOT EXISTS public.master_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category VARCHAR NOT NULL,
  key VARCHAR NOT NULL,
  label VARCHAR NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(category, key)
);

-- 5. Create Provinces Table
CREATE TABLE IF NOT EXISTS public.md_provinces (
  code VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- 6. Create Districts Table
CREATE TABLE IF NOT EXISTS public.md_districts (
  code VARCHAR PRIMARY KEY,
  province_code VARCHAR REFERENCES public.md_provinces(code) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  old_address_note VARCHAR,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Set RLS (Row Level Security) - Default disable for this project structure since backend handles auth via API routes
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.md_provinces DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.md_districts DISABLE ROW LEVEL SECURITY;
