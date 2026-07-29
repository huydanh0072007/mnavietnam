-- Master Data Categories Table (For Deal Types, Project Types, Statuses)
CREATE TABLE public.master_data (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    category VARCHAR(50) NOT NULL, -- e.g., 'deal_type', 'project_type', 'legal_status', 'project_status'
    key VARCHAR(50) NOT NULL,
    label VARCHAR(100) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(category, key)
);

-- Provinces Table
CREATE TABLE public.md_provinces (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Districts Table
CREATE TABLE public.md_districts (
    code VARCHAR(10) PRIMARY KEY,
    province_code VARCHAR(10) REFERENCES public.md_provinces(code) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    old_address_note VARCHAR(255), -- "Ghi chú địa chỉ cũ 3 cấp" (e.g. Phường, Xã)
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Row Level Security
ALTER TABLE public.master_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.md_provinces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.md_districts ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on master_data" ON public.master_data FOR SELECT USING (true);
CREATE POLICY "Allow public read access on md_provinces" ON public.md_provinces FOR SELECT USING (true);
CREATE POLICY "Allow public read access on md_districts" ON public.md_districts FOR SELECT USING (true);

-- Allow service role full access (bypass RLS)
-- Handled by service_role key automatically.

-- SEED DATA
INSERT INTO public.master_data (category, key, label, sort_order) VALUES
('deal_type', 'buyout', 'Chuyển nhượng', 1),
('deal_type', 'joint_venture', 'Hợp tác đầu tư', 2),

('project_type', 'residential', 'Khu dân cư', 1),
('project_type', 'resort', 'Khu nghỉ dưỡng', 2),
('project_type', 'commercial', 'Thương mại - Dịch vụ', 3),
('project_type', 'industrial', 'Công nghiệp', 4),
('project_type', 'other', 'Khác', 5),

('project_status', 'planning', 'Đang quy hoạch', 1),
('project_status', 'cleared', 'Đã đền bù giải tỏa', 2),
('project_status', 'construction', 'Đang xây dựng', 3),
('project_status', 'operating', 'Đang hoạt động', 4),

('legal_status', '1_500', 'Quy hoạch 1/500', 1),
('legal_status', 'land_use_cert', 'Giấy chứng nhận QSDĐ', 2),
('legal_status', 'construction_permit', 'Giấy phép xây dựng', 3);

INSERT INTO public.md_provinces (code, name, sort_order) VALUES
('SG', 'TP. Hồ Chí Minh', 1),
('HN', 'Hà Nội', 2),
('DN', 'Đà Nẵng', 3),
('BD', 'Bình Dương', 4),
('LA', 'Long An', 5),
('PQ', 'Kiên Giang (Phú Quốc)', 6);

INSERT INTO public.md_districts (code, province_code, name, old_address_note) VALUES
('SG_Q1', 'SG', 'Quận 1', 'Gồm Phường Bến Nghé, Bến Thành...'),
('SG_TPT', 'SG', 'TP. Thủ Đức', 'Sáp nhập Q2, Q9, Thủ Đức cũ'),
('HN_B', 'HN', 'Quận Ba Đình', 'Khu vực trung tâm'),
('BD_TA', 'BD', 'TP. Thuận An', 'Gồm nhiều phường công nghiệp');
