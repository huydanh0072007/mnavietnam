-- Schema for M$A Vietnam Projects
-- To be executed in Supabase SQL Editor

-- 1. Create the projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_code text NOT NULL UNIQUE,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  deal_type text NOT NULL, -- 'buyout' or 'joint_venture'
  status_label text NOT NULL,
  project_type text NOT NULL,
  province text NOT NULL,
  district text NOT NULL,
  scale text NOT NULL,
  legal_status_summary text NOT NULL,
  current_status text NOT NULL,
  valuation_display text NOT NULL,
  show_valuation boolean NOT NULL DEFAULT false,
  capital_structure_summary text NOT NULL,
  highlights jsonb NOT NULL DEFAULT '[]'::jsonb,
  description text NOT NULL,
  gallery_images jsonb NOT NULL DEFAULT '[]'::jsonb,
  teaser_pdf text,
  is_featured boolean NOT NULL DEFAULT false,
  featured_order integer NOT NULL DEFAULT 0,
  publish_status text NOT NULL DEFAULT 'draft', -- 'draft', 'published', 'hidden'
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Setup RLS (Row Level Security)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published projects
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.projects FOR SELECT
  USING ( publish_status = 'published' );

-- Allow all operations for service role (used by Next.js API routes)
-- Service role bypasses RLS anyway, but good to be explicit if using anon key for admins later.

-- 3. Seed Mock Data (Execute only once if table is empty)
INSERT INTO public.projects (
  project_code, title, slug, deal_type, status_label, project_type, province, district, 
  scale, legal_status_summary, current_status, valuation_display, show_valuation, 
  capital_structure_summary, highlights, description, gallery_images, teaser_pdf, 
  is_featured, featured_order, publish_status
) VALUES 
(
  'MNA-01', 
  'Khu đô thị Bình Dương 50ha', 
  'khu-do-thi-binh-duong-50ha', 
  'buyout', 
  'Sẵn sàng giao dịch', 
  'urban_low_rise', 
  'Bình Dương', 
  'Thủ Dầu Một', 
  '50ha', 
  'Đã có 1/500, Quyết định giao đất', 
  'Đã hoàn thiện hạ tầng 80%', 
  '1,500 Tỷ VNĐ', 
  true, 
  'Chuyển nhượng 100% cổ phần dự án', 
  '["Vị trí đắc địa trung tâm Bình Dương", "Pháp lý hoàn chỉnh, sẵn sàng xây dựng", "Tiềm năng sinh lời cao"]'::jsonb, 
  'Dự án Khu đô thị cao cấp quy mô 50ha tại trung tâm Bình Dương, định hướng phát triển thành khu đô thị xanh hiện đại với đầy đủ tiện ích: trường học, bệnh viện, công viên, trung tâm thương mại.', 
  '["https://picsum.photos/seed/mna01/800/600", "https://picsum.photos/seed/mna01_2/800/600", "https://picsum.photos/seed/mna01_3/800/600"]'::jsonb, 
  '#', 
  true, 
  1, 
  'published'
),
(
  'MNA-02', 
  'Resort Phú Quốc 30ha', 
  'resort-phu-quoc-30ha', 
  'joint_venture', 
  'Đang kêu gọi', 
  'resort', 
  'Kiên Giang', 
  'Phú Quốc', 
  '30ha', 
  'Chủ trương đầu tư, Đang lập 1/500', 
  'Đang đền bù giải tỏa 90%', 
  'Thỏa thuận', 
  false, 
  'Cần đối tác góp vốn 50%', 
  '["Sở hữu 1km bờ biển đẹp", "Thuộc khu quy hoạch du lịch sinh thái", "Chính sách ưu đãi đầu tư đặc biệt"]'::jsonb, 
  'Dự án Resort 5 sao và biệt thự nghỉ dưỡng ven biển. Tìm kiếm đối tác có kinh nghiệm vận hành khách sạn quốc tế để cùng phát triển.', 
  '["https://picsum.photos/seed/mna02/800/600", "https://picsum.photos/seed/mna02_2/800/600"]'::jsonb, 
  '#', 
  true, 
  2, 
  'published'
),
(
  'MNA-03', 
  'Khu dân cư cao cấp Quận 2 - 12ha', 
  'khu-dan-cu-cao-cap-quan-2-12ha', 
  'buyout', 
  'Sẵn sàng giao dịch', 
  'residential', 
  'Hồ Chí Minh', 
  'Quận 2', 
  '12ha', 
  'Đã đóng tiền sử dụng đất, sổ đỏ toàn khu', 
  'Đất sạch 100%', 
  '2,800 Tỷ VNĐ', 
  true, 
  'Bán 100% dự án', 
  '["Vị trí lõi trung tâm Quận 2", "Đất ở đô thị, sở hữu lâu dài", "Kết nối giao thông thuận tiện"]'::jsonb, 
  'Quỹ đất hiếm hoi còn lại tại trung tâm Quận 2 phù hợp phát triển khu phức hợp căn hộ thương mại cao cấp.', 
  '["https://picsum.photos/seed/mna03/800/600"]'::jsonb, 
  '#', 
  true, 
  3, 
  'published'
),
(
  'MNA-04', 
  'Khu công nghiệp Long An 100ha', 
  'khu-cong-nghiep-long-an-100ha', 
  'joint_venture', 
  'Mới', 
  'industrial', 
  'Long An', 
  'Bến Lức', 
  '100ha', 
  'Đã có giấy phép đầu tư', 
  'Đang san lấp mặt bằng', 
  'Liên hệ', 
  false, 
  'Hợp tác đầu tư hạ tầng', 
  '["Gần cao tốc TP.HCM - Trung Lương", "Mặt bằng sẵn có để bàn giao sớm", "Khu vực thu hút FDI mạnh"]'::jsonb, 
  'Dự án KCN quy mô vừa, thuận tiện thu hút các ngành công nghiệp sạch và kho vận logistics.', 
  '["https://picsum.photos/seed/mna04/800/600"]'::jsonb, 
  '#', 
  false, 
  4, 
  'published'
),
(
  'MNA-05', 
  'Đô thị sinh thái Đồng Nai 80ha', 
  'do-thi-sinh-thai-dong-nai-80ha', 
  'buyout', 
  'Sẵn sàng giao dịch', 
  'urban_low_rise', 
  'Đồng Nai', 
  'Nhơn Trạch', 
  '80ha', 
  '1/500', 
  'Chưa đền bù 10%', 
  '1,200 Tỷ VNĐ', 
  true, 
  'Chuyển nhượng 100%', 
  '["Gần sân bay Long Thành", "Giao thông kết nối tương lai tốt", "Cảnh quan sông nước tự nhiên"]'::jsonb, 
  'Dự án đô thị sinh thái ven sông Đồng Nai, tiềm năng đón sóng hạ tầng.', 
  '["https://picsum.photos/seed/mna05/800/600"]'::jsonb, 
  '#', 
  false, 
  5, 
  'published'
),
(
  'MNA-06', 
  'Khu nghỉ dưỡng Đà Nẵng 25ha', 
  'khu-nghi-duong-da-nang-25ha', 
  'joint_venture', 
  'Đang kêu gọi', 
  'resort', 
  'Đà Nẵng', 
  'Sơn Trà', 
  '25ha', 
  'Đã cấp phép xây dựng', 
  'Đã xây dựng phần thô 30%', 
  'Thỏa thuận', 
  false, 
  'Cần vốn hoàn thiện dự án', 
  '["View biển trực diện", "Pháp lý hoàn chỉnh nhất khu vực", "Tài sản đảm bảo chất lượng cao"]'::jsonb, 
  'Dự án đang trong quá trình xây dựng, cần đối tác rót vốn tiếp tục thi công và vận hành.', 
  '["https://picsum.photos/seed/mna06/800/600"]'::jsonb, 
  '#', 
  false, 
  6, 
  'published'
)
ON CONFLICT DO NOTHING;
