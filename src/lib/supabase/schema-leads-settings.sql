-- ==========================================
-- M$A Vietnam - Leads & Settings Schema
-- Execute this file in your Supabase SQL Editor
-- ==========================================

-- 1. Create `settings` table
CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    phone TEXT NOT NULL DEFAULT '090 123 4567',
    email TEXT NOT NULL DEFAULT 'contact@mnavietnam.com',
    address TEXT NOT NULL DEFAULT 'Tầng 12, Tòa nhà MNA, Quận 1, TP.HCM',
    zalo_url TEXT NOT NULL DEFAULT 'https://zalo.me/',
    facebook_url TEXT NOT NULL DEFAULT 'https://facebook.com/',
    linkedin_url TEXT NOT NULL DEFAULT 'https://linkedin.com/',
    hero_title TEXT NOT NULL DEFAULT 'CỔNG THÔNG TIN DỰ ÁN M&A<br/>HÀNG ĐẦU VIỆT NAM',
    hero_subtitle TEXT NOT NULL DEFAULT 'Nền tảng kết nối Độc quyền giữa các Chủ đầu tư uy tín và Mạng lưới Nhà đầu tư Quốc tế.',
    ai_provider TEXT NOT NULL DEFAULT 'google',
    ai_api_key TEXT NOT NULL DEFAULT '',
    ai_model TEXT NOT NULL DEFAULT 'gemini-1.5-pro',
    about_hero_title TEXT NOT NULL DEFAULT 'Về M$AVietnam',
    about_hero_subtitle TEXT NOT NULL DEFAULT 'Cầu nối tin cậy giữa các nhà phát triển bất động sản và mạng lưới nhà đầu tư trong nước cũng như quốc tế.',
    about_vision_title TEXT NOT NULL DEFAULT 'Tầm nhìn & Sứ mệnh',
    about_vision_desc_1 TEXT NOT NULL DEFAULT 'Được thành lập với mục tiêu minh bạch hóa và chuyên nghiệp hóa thị trường mua bán, sáp nhập dự án bất động sản tại Việt Nam, M$AVietnam tự hào là nền tảng tiên phong kết nối các cơ hội đầu tư chất lượng cao.',
    about_vision_desc_2 TEXT NOT NULL DEFAULT 'Chúng tôi hiểu rằng mỗi thương vụ M&A bất động sản đều đòi hỏi sự am hiểu sâu sắc về thị trường, pháp lý và tài chính. Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi không chỉ là người kết nối mà còn là nhà tư vấn đáng tin cậy xuyên suốt quá trình giao dịch.',
    about_stats JSONB NOT NULL DEFAULT '[
        {"value": "5+", "label": "Năm kinh nghiệm"},
        {"value": "200+", "label": "Đối tác đầu tư"},
        {"value": "$500M+", "label": "Giá trị giao dịch"},
        {"value": "100%", "label": "Bảo mật thông tin"}
    ]'::jsonb,
    about_values JSONB NOT NULL DEFAULT '[
        {"id": 1, "title": "Minh bạch", "desc": "Mọi thông tin dự án đều được thẩm định sơ bộ, đảm bảo tính xác thực và pháp lý rõ ràng trước khi giới thiệu đến nhà đầu tư."},
        {"id": 2, "title": "Bảo mật", "desc": "Chúng tôi tuân thủ nghiêm ngặt quy trình NDA, đảm bảo thông tin thương vụ và danh tính khách hàng được giữ kín tuyệt đối."},
        {"id": 3, "title": "Hiệu quả", "desc": "Rút ngắn thời gian tìm kiếm đối tác và đàm phán thông qua mạng lưới kết nối sâu rộng và quy trình làm việc chuyên nghiệp."}
    ]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed default settings
INSERT INTO public.settings (id) VALUES ('global') ON CONFLICT (id) DO NOTHING;


-- 2. Create `leads` table
CREATE TABLE IF NOT EXISTS public.leads (
    id TEXT PRIMARY KEY,
    lead_type TEXT NOT NULL CHECK (lead_type IN ('interest', 'submission')),
    full_name TEXT NOT NULL,
    organization TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    role_title TEXT,
    message TEXT,
    project_name_location TEXT,
    preferred_deal_type TEXT,
    estimated_scale TEXT,
    attachment_url TEXT,
    signature_url TEXT,
    related_project_title TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    assigned_admin TEXT DEFAULT 'Chưa gán',
    internal_notes JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed mock leads for demonstration
INSERT INTO public.leads (id, lead_type, full_name, organization, email, phone, role_title, message, related_project_title, status, assigned_admin, internal_notes, created_at)
VALUES 
('L-001', 'interest', 'Nguyễn Văn Minh', 'Quỹ Đầu Tư VinaCapital', 'minh.nguyen@vinacapital.com', '0903 123 456', 'Giám đốc Đầu tư M&A', 'Chúng tôi muốn tiếp cận Teaser và xin mẫu NDA dự án MNA-01. Ngân sách dự kiến 1,500 tỷ.', 'MNA-01 — Khu đô thị sinh thái Bình Dương', 'new', 'Chưa gán', '[{"text": "Lead chất lượng cao từ quỹ lớn, đã xác minh thông tin qua LinkedIn.", "author": "Content Admin", "timestamp": "2026-07-25 14:30"}]'::jsonb, '2026-07-25 14:20:00Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.leads (id, lead_type, full_name, organization, email, phone, role_title, project_name_location, preferred_deal_type, estimated_scale, message, status, assigned_admin, internal_notes, created_at)
VALUES
('L-002', 'submission', 'Trần Thị Thu Trang', 'Công ty BĐS Thu Trang', 'thutrang.bds@gmail.com', '0988 765 432', 'Chủ sở hữu', 'Dự án Đất sạch Phú Quốc 15ha (Bãi Trường)', 'joint_venture', '15 ha', 'Cần tìm đối tác có vốn mạnh hợp tác xây dựng resort 5 sao. Đã có 1/500.', 'draft_pending', 'Sales Admin 1', '[]'::jsonb, '2026-07-25 11:05:00Z')
ON CONFLICT (id) DO NOTHING;

-- 3. Row Level Security
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow public read access to settings
CREATE POLICY "Allow public read-only on settings" ON public.settings FOR SELECT USING (true);

-- Allow public insert to leads
CREATE POLICY "Allow public insert on leads" ON public.leads FOR INSERT WITH CHECK (true);
-- Allow public select on leads? Usually leads shouldn't be publicly readable, only admins. Since we use supabaseAdmin server client, we bypass RLS for reads.
