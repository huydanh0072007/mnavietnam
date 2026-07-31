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
('01', 'Hà Nội', 1),
('02', 'Hà Giang', 2),
('04', 'Cao Bằng', 3),
('06', 'Bắc Kạn', 4),
('08', 'Tuyên Quang', 5),
('10', 'Lào Cai', 6),
('11', 'Điện Biên', 7),
('12', 'Lai Châu', 8),
('14', 'Sơn La', 9),
('15', 'Yên Bái', 10),
('17', 'Hòa Bình', 11),
('19', 'Thái Nguyên', 12),
('20', 'Lạng Sơn', 13),
('22', 'Quảng Ninh', 14),
('24', 'Bắc Giang', 15),
('25', 'Phú Thọ', 16),
('26', 'Vĩnh Phúc', 17),
('27', 'Bắc Ninh', 18),
('30', 'Hải Dương', 19),
('31', 'Hải Phòng', 20),
('33', 'Hưng Yên', 21),
('34', 'Thái Bình', 22),
('35', 'Hà Nam', 23),
('36', 'Nam Định', 24),
('37', 'Ninh Bình', 25),
('38', 'Thanh Hóa', 26),
('40', 'Nghệ An', 27),
('42', 'Hà Tĩnh', 28),
('44', 'Quảng Bình', 29),
('45', 'Quảng Trị', 30),
('46', 'Thừa Thiên Huế', 31),
('48', 'Đà Nẵng', 32),
('49', 'Quảng Nam', 33),
('51', 'Quảng Ngãi', 34),
('52', 'Bình Định', 35),
('54', 'Phú Yên', 36),
('56', 'Khánh Hòa', 37),
('58', 'Ninh Thuận', 38),
('60', 'Bình Thuận', 39),
('62', 'Kon Tum', 40),
('64', 'Gia Lai', 41),
('66', 'Đắk Lắk', 42),
('67', 'Đắk Nông', 43),
('68', 'Lâm Đồng', 44),
('70', 'Bình Phước', 45),
('72', 'Tây Ninh', 46),
('74', 'Bình Dương', 47),
('75', 'Đồng Nai', 48),
('77', 'Bà Rịa - Vũng Tàu', 49),
('79', 'Hồ Chí Minh', 50),
('80', 'Long An', 51),
('82', 'Tiền Giang', 52),
('83', 'Bến Tre', 53),
('84', 'Trà Vinh', 54),
('86', 'Vĩnh Long', 55),
('87', 'Đồng Tháp', 56),
('89', 'An Giang', 57),
('91', 'Kiên Giang', 58),
('92', 'Cần Thơ', 59),
('93', 'Hậu Giang', 60),
('94', 'Sóc Trăng', 61),
('95', 'Bạc Liêu', 62),
('96', 'Cà Mau', 63);

INSERT INTO public.md_districts (code, province_code, name, old_address_note, sort_order) VALUES
('SG_Q1', '79', 'Quận 1', 'Trung tâm', 1),
('SG_TPT', '79', 'TP. Thủ Đức', 'Sáp nhập Q2, Q9, Thủ Đức', 2),
('SG_Q7', '79', 'Quận 7', 'Nam Sài Gòn', 3),
('HN_B', '01', 'Quận Ba Đình', 'Trung tâm', 4),
('HN_CG', '01', 'Quận Cầu Giấy', 'Tây Hà Nội', 5),
('DN_HC', '48', 'Quận Hải Châu', 'Trung tâm', 6),
('BD_TA', '74', 'TP. Thuận An', 'Công nghiệp', 7),
('BD_DA', '74', 'TP. Dĩ An', 'Công nghiệp', 8),
('DNA_BH', '75', 'TP. Biên Hòa', 'Trung tâm', 9),
('LA_TA', '80', 'TP. Tân An', 'Trung tâm', 10),
('KG_PQ', '91', 'TP. Phú Quốc', 'Nghỉ dưỡng', 11);
