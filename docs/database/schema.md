# Database Schema - MNA Vietnam

Ngày cập nhật: 2026-07-31
Phiên bản: v2.0.0
Hệ quản trị CSDL: Supabase PostgreSQL

---

## 1. Danh sách các Bảng dữ liệu (Tables)

### 1.1. Bảng `projects` (Danh sách Dự án M&A)
Lưu trữ thông tin dự án M&A bất động sản công khai.

| Tên cột | Kiểu dữ liệu | Mặc định | Mô tả |
|---------|--------------|----------|-------|
| `id` | UUID | gen_random_uuid() | Khóa chính (Primary Key) |
| `project_code` | VARCHAR | NOT NULL | Mã dự án duy nhất (Ví dụ: `MNA-01`) |
| `title` | VARCHAR | NOT NULL | Tiêu đề tiếng Việt |
| `title_en` | VARCHAR | NULL | Tiêu đề tiếng Anh |
| `slug` | VARCHAR | NOT NULL | Slug thân thiện SEO (Ví dụ: `khu-do-thi-sinh-thai-dong-nai`) |
| `deal_type` | VARCHAR | NOT NULL | Loại giao dịch (`buyout` hoặc `joint_venture`) |
| `status_label` | VARCHAR | NOT NULL | Trạng thái hiển thị tiếng Việt |
| `status_label_en` | VARCHAR | NULL | Trạng thái hiển thị tiếng Anh |
| `project_type` | VARCHAR | NOT NULL | Loại hình bất động sản |
| `province` | VARCHAR | NOT NULL | Tỉnh thành của dự án |
| `district` | VARCHAR | NOT NULL | (Deprecated - Không còn dùng) |
| `scale` | VARCHAR | NOT NULL | Quy mô dự án tiếng Việt |
| `scale_en` | VARCHAR | NULL | Quy mô dự án tiếng Anh |
| `legal_status_summary` | TEXT | NULL | Tóm tắt pháp lý tiếng Việt |
| `legal_status_summary_en` | TEXT | NULL | Tóm tắt pháp lý tiếng Anh |
| `current_status` | VARCHAR | NULL | Hiện trạng dự án tiếng Việt |
| `current_status_en` | VARCHAR | NULL | Hiện trạng dự án tiếng Anh |
| `valuation_display` | VARCHAR | NULL | Giá trị định giá tiếng Việt |
| `valuation_display_en` | VARCHAR | NULL | Giá trị định giá tiếng Anh |
| `show_valuation` | BOOLEAN | false | Bật/tắt hiển thị định giá ra frontend |
| `capital_structure_summary`| TEXT | NULL | Tóm tắt cơ cấu nguồn vốn tiếng Việt |
| `capital_structure_summary_en`| TEXT| NULL | Tóm tắt cơ cấu nguồn vốn tiếng Anh |
| `highlights` | JSONB | '[]'::jsonb | Điểm nổi bật dự án (mảng chuỗi) - tiếng Việt |
| `highlights_en` | JSONB | '[]'::jsonb | Điểm nổi bật dự án (mảng chuỗi) - tiếng Anh |
| `description` | TEXT | NULL | Mô tả chi tiết tiếng Việt |
| `description_en` | TEXT | NULL | Mô tả chi tiết tiếng Anh |
| `gallery_images` | JSONB | '[]'::jsonb | Danh sách URL ảnh thư viện |
| `teaser_pdf` | VARCHAR | NULL | URL tài liệu giới thiệu ngắn (PDF Teaser) |
| `is_featured` | BOOLEAN | false | Đánh dấu là dự án tiêu điểm nổi bật |
| `featured_order` | INTEGER | 0 | Thứ tự ưu tiên hiển thị tiêu điểm |
| `publish_status` | VARCHAR | 'draft' | Trạng thái phát hành (`draft`, `published`, `hidden`) |
| `is_active` | BOOLEAN | true | Trạng thái hoạt động phục vụ ẩn dự án (soft delete) |
| `created_at` | TIMESTAMPTZ | now() | Thời gian khởi tạo |
| `updated_at` | TIMESTAMPTZ | now() | Thời gian cập nhật gần nhất |

---

### 1.2. Bảng `leads` (Yêu cầu & Ký gửi)
Lưu trữ thông tin liên hệ, yêu cầu VDR hoặc biểu mẫu ký gửi dự án từ khách hàng.

| Tên cột | Kiểu dữ liệu | Mặc định | Mô tả |
|---------|--------------|----------|-------|
| `id` | UUID | gen_random_uuid() | Khóa chính (Primary Key) |
| `lead_type` | VARCHAR | NOT NULL | Loại Lead (`interest`: Quan tâm/VDR, `submission`: Ký gửi) |
| `full_name` | VARCHAR | NOT NULL | Họ và tên khách hàng |
| `organization` | VARCHAR | NOT NULL | Đơn vị / Doanh nghiệp công tác |
| `email` | VARCHAR | NOT NULL | Địa chỉ Email |
| `phone` | VARCHAR | NOT NULL | Số điện thoại liên hệ |
| `role_title` | VARCHAR | NULL | Chức danh công tác |
| `message` | TEXT | NULL | Nội dung lời nhắn/yêu cầu |
| `project_name_location`| VARCHAR | NULL | Tên & địa điểm dự án (dành cho form ký gửi/matching) |
| `preferred_deal_type` | VARCHAR | NULL | Hình thức giao dịch ưa thích |
| `estimated_scale` | VARCHAR | NULL | Quy mô tài sản ước tính |
| `attachment_url` | VARCHAR | NULL | URL tài liệu/pháp lý đính kèm lưu trên Storage |
| `related_project_id` | UUID | REFERENCES projects(id) | Liên kết với dự án cụ thể nếu khách hàng quan tâm |
| `status` | VARCHAR | NOT NULL | Trạng thái Lead (`new`, `contacted`, `nda_sent`, `due_diligence`, `closed_won`, `closed_lost`) |
| `assigned_admin_id` | UUID | NULL | ID của admin được chỉ định xử lý |
| `internal_notes` | JSONB | '[]'::jsonb | Ghi chú nội bộ và nhật ký Matching tự động |
| `audit_logs` | JSONB | '[]'::jsonb | Nhật ký kiểm thử hoạt động |
| `signature_url` | VARCHAR | NULL | URL chữ ký tay điện tử nhà đầu tư dùng khi mở VDR |
| `is_active` | BOOLEAN | true | Hỗ trợ ẩn lead khỏi danh sách (soft delete) |
| `created_at` | TIMESTAMPTZ | now() | Thời gian tạo yêu cầu |

---

### 1.3. Bảng `settings` (Cấu hình SMTP Hệ thống)
Chứa cấu hình SMTP động để gửi email tự động và nhận địa chỉ email quản trị nhận tin.

| Tên cột | Kiểu dữ liệu | Mặc định | Mô tả |
|---------|--------------|----------|-------|
| `id` | VARCHAR | 'global' | Khóa chính duy nhất đại diện cấu hình toàn hệ thống |
| `smtp_host` | VARCHAR | NULL | Địa chỉ SMTP Host (Ví dụ: `smtp.gmail.com`) |
| `smtp_port` | INTEGER | NULL | Cổng kết nối (Ví dụ: `465` hoặc `587`) |
| `smtp_secure` | BOOLEAN | false | Bật/tắt SSL/TLS |
| `smtp_user` | VARCHAR | NULL | Tài khoản gửi Email |
| `smtp_pass` | VARCHAR | NULL | Mật khẩu ứng dụng gửi Email (đã mã hóa) |
| `smtp_from_name` | VARCHAR | NULL | Tên hiển thị người gửi |
| `smtp_from_email` | VARCHAR | NULL | Địa chỉ email người gửi |
| `notify_emails` | JSONB | '[]'::jsonb | Mảng các email nhận thông báo khi có Lead mới |
| `updated_at` | TIMESTAMPTZ | now() | Thời gian cập nhật cấu hình |

---

### 1.4. Bảng `master_data` (Danh mục chung)
Lưu trữ các giá trị tùy chọn cấu hình động trên hệ thống cho các dropdown filter.

| Tên cột | Kiểu dữ liệu | Mặc định | Mô tả |
|---------|--------------|----------|-------|
| `id` | UUID | gen_random_uuid() | Khóa chính |
| `category` | VARCHAR | NOT NULL | Nhóm danh mục (`deal_type`, `project_type`, `legal_status`...) |
| `key` | VARCHAR | NOT NULL | Khóa định danh của item |
| `label` | VARCHAR | NOT NULL | Nhãn hiển thị tiếng Việt |
| `sort_order` | INTEGER | 0 | Thứ tự sắp xếp hiển thị |
| `is_active` | BOOLEAN | true | Trạng thái hiển thị (soft delete qua toggle) |

---

### 1.5. Bảng `md_provinces` (Địa giới Hành chính - Tỉnh thành)
Lưu danh sách 34 Tỉnh/Thành phố sau sáp nhập hành chính mới của Việt Nam.

| Tên cột | Kiểu dữ liệu | Mặc định | Mô tả |
|---------|--------------|----------|-------|
| `code` | VARCHAR | Primary Key | Mã code tỉnh thành (Ví dụ: `HN`, `SG`, `BD`...) |
| `name` | VARCHAR | NOT NULL | Tên địa danh hành chính mới |
| `sort_order` | INTEGER | 0 | Thứ tự sắp xếp |
| `is_active` | BOOLEAN | true | Trạng thái hoạt động (bật/tắt hiển thị) |

---

## 2. Quan hệ (Relationships Explained)
- Một **Lead** thuộc loại Quan tâm (`lead_type = 'interest'`) có mối quan hệ nhiều-một với bảng **Projects** thông qua khóa ngoại `related_project_id REFERENCES projects(id)`.
- Bảng **md_districts** (Quận/Huyện) đã dừng sử dụng trên toàn hệ thống sau yêu cầu cắt bỏ địa giới cấp quận huyện của chủ đầu tư, mọi thao tác phân loại vị trí địa lý chỉ cần xử lý trực tiếp qua `md_provinces` hoặc text địa điểm cụ thể.
