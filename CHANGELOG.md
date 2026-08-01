# Changelog

## [2026-08-01]
### Added
- **Sprint 5 (Advanced Features):**
  - Hệ thống thông báo admin thời gian thực: bell dropdown panel động, Polling 30s, đếm số lượng chưa đọc, tự động lưu thông báo mới khi có lead/VDR signature.
  - Chọn & Thao tác hàng loạt (Bulk actions): check/select-all, thanh Bulk actions nổi, batch API xử lý array ids.
  - Cấu hình tùy chọn nhận thông báo: Tần suất gửi (ngay lập tức / hàng giờ / hàng ngày) đồng bộ qua API settings.

### Fixed
- **Bảo mật (Security Fix):** Vá lỗ hổng Broken Access Control ở toàn bộ Next.js Server Actions trong `actions.ts` bằng cách tích hợp xác thực cookie phiên admin.
- Sửa lỗi kiểu dữ liệu TypeScript trong `SettingsContext.tsx` khi thiếu các thuộc tính cài đặt thông báo mới.

## [2026-07-31]
### Added
- **Sprint 1 (CRUD Cốt lõi):**
  - Quản lý Master Data: hỗ trợ sửa tên và ẩn/hiện 34 Tỉnh mới, CRUD danh mục chung.
  - Quản lý Master Data: hỗ trợ sửa tên và ẩn/hiện 34 Tỉnh mới, CRUD danh mục chung.
  - Quản lý Dự án: Trang Sửa dự án (`du-an/[id]/sua`) và nút Ẩn dự án.
  - Quản lý Lead: Modal Tạo Lead mới thủ công hỗ trợ upload tài liệu pháp lý lên Supabase Storage và ẩn Lead.
- **Sprint 2 (Nâng cấp UX & VDR):**
  - Leads panel: Phân trang (20 items/page), bộ lọc trạng thái và tháng tạo nâng cao.
  - Dashboard: Kết nối dữ liệu thật từ Supabase DB.
  - Phân hệ VDR: Workflows Duyệt/Từ chối/Thu hồi quyền VDR, xem Zoom chữ ký tay, lọc theo dự án và xuất logs VDR ra CSV.
- **Sprint 3 (Tiện ích & Thống kê):**
  - Sắp xếp danh mục dự án, nút xuất Excel (.CSV) dự án có UTF-8 BOM chống lỗi font tiếng Việt.
  - Dashboard SVG bar chart 6 tháng động có hover tooltip, danh sách Hoạt động Gần đây (live activity logs).
- **Sprint 4 (Khớp lệnh - Matching):**
  - Phân hệ Khớp lệnh Thông minh (`admin/matching`) tính điểm tương thích (+50% Deal Type, +50% Province diacritics-normalized).
  - Nút "Giới thiệu Dự án" tự động ghi nhật ký vào `internal_notes` của Lead, vô hiệu hóa các dự án đã gửi.
- **Tính năng lọc khoảng ngày:** Bộ lọc lịch đôi "Từ ngày" - "Đến ngày" đồng bộ trên cả 3 trang Leads, Projects và VDR.

### Changed
- Loại bỏ hoàn toàn hiển thị cấp hành chính Quận/Huyện trên toàn hệ thống (cả trang quản trị và giao diện chi tiết dự án ngoài frontend).

### Fixed
- Sửa lỗi TypeScript build và đảm bảo đồng bộ layout CSS ở các trang sửa đổi.

## [2026-07-30]
### Added
- Thêm file `.gitignore` để loại trừ các file `.vbsec-tmp` sinh ra từ phần mềm quét bảo mật.

### Changed
- Hoàn thiện tính năng Đa ngôn ngữ (i18n):
  - Đồng bộ hoá ngôn ngữ tiếng Anh cho nội dung Điều khoản sử dụng.
  - Cập nhật thông báo lỗi tiếng Anh trong Form Ký gửi dự án.
  - Đồng bộ các thẻ Meta (Title/Description) thành tiếng Anh khi xem giao diện EN.

### Security
- Xác thực thành công hệ thống:
  - An toàn 100% trước lỗi SSRF (API `translate` đã được hardcode URL an toàn).
  - Rate Limiting hoạt động chính xác ở 2 đầu mối quan trọng (`/api/leads` và `/api/auth/login`).
  - Zero CRITICAL/HIGH/MEDIUM vulnerabilities reported.

### Deployment & Infra
- Fix lỗi thiếu CSS giao diện Admin (do file layout chưa import thư viện TailwindCSS).
- Fix các lỗi gõ sai tên biến Dictionary (TypeScript) gây ra lỗi Build trên Vercel:
  - Lỗi tại trang Giới thiệu (`dict.about.hero_desc`)
  - Lỗi tại trang Chủ (`dict.home.hero_subtitle`)
- Hoàn tất Deploy lên Vercel thành công và cấu hình đầy đủ Environment Variables.

## [2026-07-29]
### Added
- Tính năng cấu hình SMTP động lưu trong cơ sở dữ liệu (Global Settings).
- Giao diện Admin UI cho cài đặt SMTP và chức năng Test Email.
- Tự động gửi email thông báo khi thay đổi trạng thái Lead (Ký gửi/Quan tâm dự án).
- Báo cáo phân tích UI/UX `PROJECT_REVIEW_UI_UX_260729.md`.

### Changed
- Refactor các component sử dụng `window.confirm` sang các Modals chuyên nghiệp (StatusUpdateModal, SuccessModal).
- Refactor `Button` component: Thêm thư viện `@radix-ui/react-slot` để tối ưu hóa thẻ `Link` lồng trong `Button` (asChild prop).

### Fixed
- Lỗi lọc danh mục dự án không hoạt động do sai lệch tham số (`deal_type` vs `type`).
- Lỗi đăng xuất Admin không xoá cookie phiên làm việc (bổ sung API call `/api/auth/logout` trong AdminHeader).
