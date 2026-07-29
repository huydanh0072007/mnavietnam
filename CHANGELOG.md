# Changelog

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
