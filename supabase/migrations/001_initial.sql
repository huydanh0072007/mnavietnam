-- MNAVietnam Database Schema
-- Supabase PostgreSQL Migration

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROJECTS TABLE
-- ============================================
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  deal_type TEXT NOT NULL CHECK (deal_type IN ('buyout', 'joint_venture')),
  status_label TEXT DEFAULT 'Sẵn Sàng Giao Dịch',
  project_type TEXT CHECK (project_type IN ('residential', 'resort', 'commercial', 'urban_low_rise', 'industrial', 'other')),
  province TEXT,
  district TEXT,
  scale TEXT,
  legal_status_summary TEXT,
  current_status TEXT,
  valuation_display TEXT,
  show_valuation BOOLEAN DEFAULT FALSE,
  capital_structure_summary TEXT,
  highlights JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  gallery_images TEXT[] DEFAULT '{}',
  teaser_pdf TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  featured_order INT DEFAULT 0,
  publish_status TEXT DEFAULT 'draft' CHECK (publish_status IN ('draft', 'published', 'hidden')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LEADS TABLE
-- ============================================
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_type TEXT NOT NULL CHECK (lead_type IN ('interest', 'submission')),
  full_name TEXT NOT NULL,
  organization TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  role_title TEXT,
  message TEXT,
  project_name_location TEXT,
  preferred_deal_type TEXT CHECK (preferred_deal_type IN ('buyout', 'joint_venture')),
  estimated_scale TEXT,
  attachment_url TEXT,
  related_project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'new',
  assigned_admin_id UUID,
  internal_notes JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ADMIN PROFILES TABLE
-- ============================================
CREATE TABLE admin_profiles (
  id UUID PRIMARY KEY, -- References auth.users(id) in Supabase
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'content_admin', 'sales_admin')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NOTIFICATION SETTINGS TABLE
-- ============================================
CREATE TABLE notification_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'telegram', 'zalo')),
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES admin_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_projects_publish_status ON projects(publish_status);
CREATE INDEX idx_projects_deal_type ON projects(deal_type);
CREATE INDEX idx_projects_is_featured ON projects(is_featured);
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_leads_lead_type ON leads(lead_type);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_related_project ON leads(related_project_id);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_settings_updated_at
  BEFORE UPDATE ON notification_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for published projects
CREATE POLICY "Public can view published projects"
  ON projects FOR SELECT
  USING (publish_status = 'published');

-- Admins can do everything with projects
CREATE POLICY "Admins can manage projects"
  ON projects FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE admin_profiles.id = auth.uid()
      AND admin_profiles.is_active = TRUE
    )
  );

-- Anyone can create leads (form submissions)
CREATE POLICY "Anyone can create leads"
  ON leads FOR INSERT
  WITH CHECK (TRUE);

-- Only admins can view/update leads
CREATE POLICY "Admins can view leads"
  ON leads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE admin_profiles.id = auth.uid()
      AND admin_profiles.is_active = TRUE
    )
  );

CREATE POLICY "Admins can update leads"
  ON leads FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE admin_profiles.id = auth.uid()
      AND admin_profiles.is_active = TRUE
    )
  );

-- Admin profiles: admins can view their own, super_admin can see all
CREATE POLICY "Users can view own profile"
  ON admin_profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Super admin can manage all profiles"
  ON admin_profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE admin_profiles.id = auth.uid()
      AND admin_profiles.role = 'super_admin'
      AND admin_profiles.is_active = TRUE
    )
  );

-- Notification settings: only admins
CREATE POLICY "Admins can manage notification settings"
  ON notification_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE admin_profiles.id = auth.uid()
      AND admin_profiles.is_active = TRUE
    )
  );
