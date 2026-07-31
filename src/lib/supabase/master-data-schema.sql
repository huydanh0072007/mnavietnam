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
('SG', 'TP. Hồ Chí Minh', 1),
('HN', 'Hà Nội', 2),
('DN', 'Đà Nẵng', 3),
('HP', 'Hải Phòng', 4),
('CT', 'Cần Thơ', 5),
('AG', 'An Giang', 6),
('BV', 'Bà Rịa - Vũng Tàu', 7),
('BG', 'Bắc Giang', 8),
('BK', 'Bắc Kạn', 9),
('BL', 'Bạc Liêu', 10),
('BN', 'Bắc Ninh', 11),
('BT', 'Bến Tre', 12),
('BDI', 'Bình Định', 13),
('BD', 'Bình Dương', 14),
('BP', 'Bình Phước', 15),
('BTH', 'Bình Thuận', 16),
('CM', 'Cà Mau', 17),
('CB', 'Cao Bằng', 18),
('DL', 'Đắk Lắk', 19),
('DNO', 'Đắk Nông', 20),
('DB', 'Điện Biên', 21),
('DNA', 'Đồng Nai', 22),
('DT', 'Đồng Tháp', 23),
('GL', 'Gia Lai', 24),
('HG', 'Hà Giang', 25),
('HNA', 'Hà Nam', 26),
('HT', 'Hà Tĩnh', 27),
('HD', 'Hải Dương', 28),
('HGI', 'Hậu Giang', 29),
('HB', 'Hòa Bình', 30),
('HY', 'Hưng Yên', 31),
('KH', 'Khánh Hòa', 32),
('KG', 'Kiên Giang', 33),
('KT', 'Kon Tum', 34),
('LC', 'Lai Châu', 35),
('LD', 'Lâm Đồng', 36),
('LS', 'Lạng Sơn', 37),
('LA', 'Long An', 38),
('ND', 'Nam Định', 39),
('NA', 'Nghệ An', 40),
('NB', 'Ninh Bình', 41),
('NT', 'Ninh Thuận', 42),
('PT', 'Phú Thọ', 43),
('PY', 'Phú Yên', 44),
('QB', 'Quảng Bình', 45),
('QNA', 'Quảng Nam', 46),
('QNG', 'Quảng Ngãi', 47),
('QN', 'Quảng Ninh', 48),
('QT', 'Quảng Trị', 49),
('ST', 'Sóc Trăng', 50),
('SL', 'Sơn La', 51),
('TN', 'Tây Ninh', 52),
('TB', 'Thái Bình', 53),
('TNG', 'Thái Nguyên', 54),
('TH', 'Thanh Hóa', 55),
('TTH', 'Thừa Thiên Huế', 56),
('TG', 'Tiền Giang', 57),
('TV', 'Trà Vinh', 58),
('TQ', 'Tuyên Quang', 59),
('VL', 'Vĩnh Long', 60),
('VP', 'Vĩnh Phúc', 61),
('YB', 'Yên Bái', 62);

INSERT INTO public.md_districts (code, province_code, name, old_address_note, sort_order) VALUES
('SG_Q1', 'SG', 'Quận 1', 'Trung tâm', 1),
('SG_TPT', 'SG', 'TP. Thủ Đức', 'Sáp nhập Q2, Q9, Thủ Đức', 2),
('SG_Q7', 'SG', 'Quận 7', 'Nam Sài Gòn', 3),
('HN_B', 'HN', 'Quận Ba Đình', 'Trung tâm', 4),
('HN_CG', 'HN', 'Quận Cầu Giấy', 'Tây Hà Nội', 5),
('DN_HC', 'DN', 'Quận Hải Châu', 'Trung tâm', 6),
('BD_TA', 'BD', 'TP. Thuận An', 'Công nghiệp', 7),
('BD_DA', 'BD', 'TP. Dĩ An', 'Công nghiệp', 8),
('DNA_BH', 'DNA', 'TP. Biên Hòa', 'Trung tâm', 9),
('LA_TA', 'LA', 'TP. Tân An', 'Trung tâm', 10),
('KG_PQ', 'KG', 'TP. Phú Quốc', 'Nghỉ dưỡng', 11);
