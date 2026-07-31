-- Master Data Categories Table (For Deal Types, Project Types, Statuses)
CREATE TABLE IF NOT EXISTS public.master_data (
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
CREATE TABLE IF NOT EXISTS public.md_provinces (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Districts Table
CREATE TABLE IF NOT EXISTS public.md_districts (
    code VARCHAR(10) PRIMARY KEY,
    province_code VARCHAR(10) REFERENCES public.md_provinces(code) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    old_address_note VARCHAR(255),
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
DROP POLICY IF EXISTS "Allow public read access on master_data" ON public.master_data;
CREATE POLICY "Allow public read access on master_data" ON public.master_data FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on md_provinces" ON public.md_provinces;
CREATE POLICY "Allow public read access on md_provinces" ON public.md_provinces FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on md_districts" ON public.md_districts;
CREATE POLICY "Allow public read access on md_districts" ON public.md_districts FOR SELECT USING (true);

-- Clear existing data if necessary or use upsert
TRUNCATE TABLE public.master_data CASCADE;
TRUNCATE TABLE public.md_provinces CASCADE;
TRUNCATE TABLE public.md_districts CASCADE;

-- SEED DATA
INSERT INTO public.master_data (category, key, label, sort_order) VALUES
('deal_type', 'buyout', 'Chuyển nhượng toàn phần (100%)', 1),
('deal_type', 'partial_transfer', 'Chuyển nhượng một phần', 2),
('deal_type', 'share_transfer', 'Chuyển nhượng cổ phần / Vốn góp', 3),
('deal_type', 'joint_venture', 'Hợp tác đầu tư / Liên doanh', 4),
('deal_type', 'lease', 'Cho thuê dài hạn / Khai thác', 5),

('project_type', 'residential', 'Khu dân cư / Đô thị', 1),
('project_type', 'resort', 'Khu nghỉ dưỡng / Resort', 2),
('project_type', 'commercial', 'Thương mại / Văn phòng', 3),
('project_type', 'industrial', 'Khu / Cụm Công nghiệp', 4),
('project_type', 'logistics', 'Kho bãi / Logistics', 5),
('project_type', 'hospitality', 'Khách sạn / Lưu trú', 6),
('project_type', 'healthcare', 'Y tế / Chăm sóc sức khỏe', 7),
('project_type', 'education', 'Giáo dục / Trường học', 8),
('project_type', 'energy', 'Năng lượng (Điện mặt trời, Điện gió)', 9),
('project_type', 'agriculture', 'Nông lâm nghiệp / Trang trại', 10),
('project_type', 'other', 'Loại hình khác', 11),

('project_status', 'concept', 'Lên ý tưởng / Nghiên cứu khả thi', 1),
('project_status', 'planning', 'Đang lập quy hoạch', 2),
('project_status', 'compensation_in_progress', 'Đang đền bù giải tỏa (GPMB)', 3),
('project_status', 'cleared', 'Đất sạch (Đã hoàn tất đền bù)', 4),
('project_status', 'construction_ready', 'Sẵn sàng thi công', 5),
('project_status', 'under_construction', 'Đang xây dựng', 6),
('project_status', 'completed', 'Đã hoàn thiện xây dựng', 7),
('project_status', 'operating', 'Đang vận hành / Khai thác', 8),

('legal_status', 'in_principle_approval', 'Chấp thuận chủ trương đầu tư', 1),
('legal_status', '1_2000', 'Quy hoạch chi tiết 1/2000', 2),
('legal_status', '1_500', 'Quy hoạch chi tiết 1/500', 3),
('legal_status', 'land_allocation', 'Quyết định giao đất / Cho thuê đất', 4),
('legal_status', 'financial_obligation', 'Đã hoàn thành nghĩa vụ tài chính', 5),
('legal_status', 'land_use_cert', 'Giấy chứng nhận QSDĐ (Sổ đỏ)', 6),
('legal_status', 'construction_permit', 'Giấy phép xây dựng', 7),
('legal_status', 'fire_safety_approval', 'Thẩm duyệt PCCC', 8),
('legal_status', 'environment_approval', 'Phê duyệt ĐTM', 9);

INSERT INTO public.md_provinces (code, name, sort_order) VALUES
  ('01', 'Thành phố Hà Nội', 1),
  ('TT-HUE', 'Thành phố Huế', 2),
  ('20', 'Tỉnh Lạng Sơn', 3),
  ('17', 'Tỉnh Quảng Ninh', 4),
  ('38', 'Tỉnh Thanh Hóa', 5),
  ('40', 'Tỉnh Nghệ An', 6),
  ('42', 'Tỉnh Hà Tĩnh', 7),
  ('04', 'Tỉnh Cao Bằng', 8),
  ('12', 'Tỉnh Lai Châu', 9),
  ('11', 'Tỉnh Điện Biên', 10),
  ('14', 'Tỉnh Sơn La', 11),
  ('TQ-HG', 'Tỉnh Tuyên Quang', 12),
  ('LC-YB', 'Tỉnh Lào Cai', 13),
  ('TN-BK', 'Tỉnh Thái Nguyên', 14),
  ('PT-VP-HB', 'Tỉnh Phú Thọ', 15),
  ('BN-BG', 'Tỉnh Bắc Ninh', 16),
  ('HY-TB', 'Tỉnh Hưng Yên', 17),
  ('HP-HD', 'Thành phố Hải Phòng', 18),
  ('NB-HN-ND', 'Tỉnh Ninh Bình', 19),
  ('QT-QB', 'Tỉnh Quảng Trị', 20),
  ('DN-QN', 'Thành phố Đà Nẵng', 21),
  ('QNG-KT', 'Tỉnh Quảng Ngãi', 22),
  ('GL-BD', 'Tỉnh Gia Lai', 23),
  ('KH-NT', 'Tỉnh Khánh Hòa', 24),
  ('LD-DN-BT', 'Tỉnh Lâm Đồng', 25),
  ('DL-PY', 'Tỉnh Đắk Lắk', 26),
  ('HCM-BD-BRVT', 'Thành phố Hồ Chí Minh', 27),
  ('DN-BP', 'Thành phố Đồng Nai', 28),
  ('TN-LA', 'Tỉnh Tây Ninh', 29),
  ('CT-ST-HG', 'Thành phố Cần Thơ', 30),
  ('VL-BT-TV', 'Tỉnh Vĩnh Long', 31),
  ('DT-TG', 'Tỉnh Đồng Tháp', 32),
  ('CM-BL', 'Tỉnh Cà Mau', 33),
  ('AG-KG', 'Tỉnh An Giang', 34);

INSERT INTO public.md_districts (code, province_code, name, old_address_note, sort_order) VALUES
('SG_Q1', 'HCM-BD-BRVT', 'Quận 1', 'Trung tâm TP.HCM', 1),
('SG_TPT', 'HCM-BD-BRVT', 'TP. Thủ Đức', 'Sáp nhập Q2, Q9, Thủ Đức', 2),
('SG_Q7', 'HCM-BD-BRVT', 'Quận 7', 'Nam Sài Gòn', 3),
('HN_B', '01', 'Quận Ba Đình', 'Trung tâm', 4),
('HN_CG', '01', 'Quận Cầu Giấy', 'Tây Hà Nội', 5),
('DN_HC', 'DN-QN', 'Quận Hải Châu', 'Trung tâm Đà Nẵng', 6),
('BD_TA', 'HCM-BD-BRVT', 'TP. Thuận An', 'Công nghiệp Bình Dương cũ', 7),
('BD_DA', 'HCM-BD-BRVT', 'TP. Dĩ An', 'Công nghiệp Bình Dương cũ', 8),
('DNA_BH', 'DN-BP', 'TP. Biên Hòa', 'Trung tâm Đồng Nai', 9),
('LA_TA', 'TN-LA', 'TP. Tân An', 'Trung tâm Long An cũ', 10),
('KG_PQ', 'AG-KG', 'TP. Phú Quốc', 'Nghỉ dưỡng Kiên Giang cũ', 11);
