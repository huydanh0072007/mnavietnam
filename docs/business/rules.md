# Business & Logic Rules - MNA Vietnam

Ngày cập nhật: 2026-07-31
Phiên bản: v2.0.0

Tài liệu này ghi lại các quy định nghiệp vụ (Business Rules) và logic đặc thù được cấu hình trong hệ thống MNA Vietnam.

---

## 1. Phân cấp Hành chính Địa phương (Provinces Merger)
- **Quy tắc:** Hệ thống quản lý địa bàn hoạt động hành chính rút gọn từ 63 tỉnh thành cũ xuống còn **34 Tỉnh/Thành phố mới** sau sáp nhập.
- **Bỏ cấp Huyện/Quận:** Loại bỏ hoàn toàn cấp Huyện (Districts) khỏi các bộ lọc tìm kiếm dự án, form ký gửi và các trang hiển thị chi tiết dự án để tối giản hóa dữ liệu địa phương.
- **Cấu hình Master Data:** Admin có thể thay đổi trực tiếp tên hiển thị hoặc ẩn/hiện từng tỉnh trong 34 tỉnh này.

---

## 2. Quản lý trạng thái và Ẩn thông tin (Soft Delete Policy)
- **Quy tắc:** Hệ thống áp dụng chính sách **xóa mềm (Soft Delete)** đối với Dự án và Leads:
  - Dự án/Lead bị xóa sẽ không mất vĩnh viễn khỏi database để phục vụ kiểm toán và báo cáo thống kê.
  - Trạng thái được cập nhật thành `is_active = false`.
  - Phía Client-side / Frontend chỉ fetch và hiển thị các bản ghi có `is_active = true` (hoặc khác false).

---

## 3. Quy trình bảo mật Virtual Data Room (VDR Flow)
- **Yêu cầu bắt buộc:** Để tiếp cận tài liệu VDR của dự án, nhà đầu tư phải hoàn tất ký cam kết bảo mật bằng **Chữ ký tay điện tử** (Digital signature dạng canvas vẽ trực tiếp từ frontend) và tải lên tệp tin đính kèm (nếu có).
- **Phê duyệt Admin:**
  - Trạng thái ban đầu: `nda_sent` (Đã gửi NDA, chờ duyệt).
  - Phê duyệt cấp quyền: Admin duyệt -> trạng thái cập nhật thành `due_diligence` -> ghi nhận log audit.
  - Từ chối cấp quyền: Trạng thái cập nhật thành `rejected`.
  - Thu hồi quyền: Trạng thái cập nhật quay lại `nda_sent`.
- **Lưu vết:** Mọi hoạt động Duyệt/Từ chối/Thu hồi đều ghi log chi tiết thời gian và tài khoản thực hiện vào bảng nhật ký Lead.

---

## 4. Thuật toán Khớp lệnh Tự động (Smart Matching Engine)
Hệ thống gợi ý dự án tương thích cho nhà đầu tư dựa trên tổng điểm **Matching Score (tối đa 100%)**:
- **Khớp Hình thức Giao dịch (+50%):** Cộng 50% điểm nếu `project.deal_type === lead.preferred_deal_type` (ví dụ: cùng là Chuyển nhượng hoặc cùng là Hợp tác đầu tư).
- **Khớp Địa phương (+50%):**
  - Tên tỉnh thành của dự án (`project.province`) được chuẩn hóa bằng cách loại bỏ toàn bộ dấu tiếng Việt và chuyển về dạng chữ thường.
  - Lời nhắn hoặc địa bàn hoạt động quan tâm của lead (`message`, `project_name_location`) cũng được chuẩn hóa tương tự.
  - Nếu từ khóa tỉnh thành xuất hiện trong thông tin của Lead -> Cộng 50% điểm.
- **Phân loại kết quả:**
  - `100%`: Khớp hoàn toàn (Khớp cả giao dịch và địa điểm).
  - `50%`: Khớp một phần (Chỉ khớp giao dịch hoặc địa điểm).
  - `0%`: Chưa tương thích.
- **Log matching:** Khi admin bấm "Giới thiệu", hệ thống ghi nhật ký trực tiếp vào `internal_notes` của Lead dưới tên tác giả `"Hệ thống Matching"`.

---

## 5. Xuất dữ liệu CSV Tiếng Việt (UTF-8 BOM Prefix)
- **Vấn đề:** Khi xuất dữ liệu CSV mặc định, Microsoft Excel thường hiển thị sai lệch font chữ tiếng Việt có dấu.
- **Giải pháp quy chuẩn:** Toàn bộ nội dung chuỗi CSV xuất ra (cả trang VDR audit logs và Admin Projects) bắt buộc phải được chèn tiền tố Byte Order Mark **`\uFEFF`** ở dòng đầu tiên để Excel tự động nhận diện bảng mã UTF-8.
