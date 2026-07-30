# Changelog

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
