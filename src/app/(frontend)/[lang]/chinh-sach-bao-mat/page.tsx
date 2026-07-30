import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chính sách bảo mật | M$A International',
  description: 'Chính sách bảo vệ dữ liệu cá nhân theo quy định của pháp luật hiện hành tại M$A International.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8F6F2] pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm">
          <h1 className="text-3xl font-serif font-bold text-[#1A1A2E] mb-6 border-b border-gray-100 pb-4">
            Chính Sách Bảo Vệ Dữ Liệu Cá Nhân
          </h1>
          
          <div className="prose prose-blue max-w-none text-gray-700 space-y-6">
            <p><strong>Cập nhật lần cuối:</strong> 28/07/2026</p>
            
            <p>M$A International tôn trọng và cam kết bảo vệ dữ liệu cá nhân của Người dùng. Chính sách Bảo vệ Dữ liệu Cá nhân này ("Chính sách") được lập ra nhằm tuân thủ <strong>Luật Bảo vệ Dữ liệu cá nhân số 91/2025/QH15</strong> (sau đây gọi tắt là "Luật số 91/2025/QH15") và các văn bản hướng dẫn thi hành hiện hành của Việt Nam, cũng như áp dụng các tiêu chuẩn bảo mật quốc tế phù hợp.</p>

            <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-4">1. Mục đích thu thập dữ liệu</h2>
            <p>Chúng tôi chỉ thu thập Dữ liệu Cá nhân của bạn cho các mục đích hợp pháp và cụ thể sau đây:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Tiếp nhận, xử lý, và đánh giá các hồ sơ ký gửi dự án M&A.</li>
              <li>Kết nối Chủ dự án với các Nhà đầu tư tiềm năng (chỉ khi có sự đồng ý rõ ràng).</li>
              <li>Liên hệ, hỗ trợ khách hàng, giải đáp thắc mắc và gửi các thông báo quan trọng.</li>
              <li>Cải thiện trải nghiệm người dùng và tối ưu hóa Nền tảng M$A International.</li>
              <li>Tuân thủ các nghĩa vụ pháp lý, kế toán, kiểm toán theo yêu cầu của cơ quan Nhà nước có thẩm quyền.</li>
            </ul>

            <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-4">2. Dữ liệu cá nhân được thu thập</h2>
            <p>Các dữ liệu chúng tôi thu thập bao gồm, nhưng không giới hạn ở:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Dữ liệu cá nhân cơ bản:</strong> Họ và tên, chức vụ, tên cơ quan/tổ chức, số điện thoại, địa chỉ email.</li>
              <li><strong>Dữ liệu giao dịch:</strong> Thông tin chi tiết về dự án (quy mô, vị trí, giá trị dự kiến, tài liệu đính kèm), hồ sơ năng lực đầu tư.</li>
              <li><strong>Dữ liệu kỹ thuật:</strong> Địa chỉ IP, loại trình duyệt, thời gian truy cập, cookies phục vụ cho việc vận hành website.</li>
            </ul>

            <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-4">3. Nguyên tắc xử lý dữ liệu (Theo Điều 3, Luật số 91/2025/QH15)</h2>
            <p>Chúng tôi cam kết xử lý dữ liệu của bạn dựa trên các nguyên tắc cốt lõi của Luật số 91/2025/QH15:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Hợp pháp & Minh bạch:</strong> Mọi hoạt động thu thập và xử lý đều được thông báo rõ ràng.</li>
              <li><strong>Giới hạn mục đích:</strong> Chỉ sử dụng cho những mục đích đã thông báo và được sự đồng ý.</li>
              <li><strong>Tối giản dữ liệu:</strong> Chỉ thu thập những dữ liệu cần thiết nhất cho giao dịch M&A.</li>
              <li><strong>Bảo mật & An toàn:</strong> Áp dụng các biện pháp kỹ thuật và tổ chức nghiêm ngặt (mã hóa dữ liệu, hệ thống giám sát VBSEC) để chống lại các hành vi truy cập, tiết lộ trái phép.</li>
            </ul>

            <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-4">4. Quyền của Chủ thể dữ liệu</h2>
            <p>Theo Luật số 91/2025/QH15, với tư cách là Chủ thể dữ liệu, bạn có các quyền sau đây đối với dữ liệu cá nhân của mình:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Quyền được biết & Truy cập:</strong> Yêu cầu cung cấp bản sao dữ liệu cá nhân mà chúng tôi đang lưu giữ.</li>
              <li><strong>Quyền chỉnh sửa:</strong> Yêu cầu cập nhật, sửa đổi khi dữ liệu không còn chính xác.</li>
              <li><strong>Quyền xóa & Thu hồi sự đồng ý:</strong> Yêu cầu xóa dữ liệu hồ sơ dự án hoặc thu hồi sự đồng ý xử lý dữ liệu bất kỳ lúc nào. Tuy nhiên, việc rút lại sự đồng ý có thể ảnh hưởng đến quá trình kết nối nhà đầu tư.</li>
              <li><strong>Quyền hạn chế xử lý & Phản đối:</strong> Yêu cầu hạn chế việc chia sẻ dữ liệu cho một số bên thứ ba nhất định.</li>
            </ul>
            <p>Để thực hiện các quyền này, vui lòng liên hệ với chúng tôi qua email: <a href="mailto:admin@mnainternational.com" className="text-blue-600 underline">admin@mnainternational.com</a>.</p>

            <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-4">5. Lưu trữ và Chia sẻ dữ liệu</h2>
            <p><strong>Lưu trữ:</strong> Dữ liệu của bạn được lưu trữ an toàn trên hệ thống máy chủ đám mây với cơ chế mã hóa tiêu chuẩn quốc tế. Thời gian lưu trữ kéo dài đến khi mục đích xử lý hoàn thành hoặc khi bạn có yêu cầu xóa.</p>
            <p><strong>Chia sẻ (Bên thứ ba):</strong> Trong lĩnh vực M&A, tính bảo mật là tối thượng. Chúng tôi <strong>chỉ</strong> chia sẻ thông tin Teaser/Hồ sơ dự án của bạn cho các Nhà đầu tư tổ chức uy tín (đã ký kết NDA) <strong>sau khi có sự đồng ý bằng văn bản/email</strong> từ bạn. Dữ liệu của bạn không bao giờ được bán cho các bên thứ ba vì mục đích tiếp thị.</p>

            <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-4">6. Cam kết bảo mật</h2>
            <p>M$A International áp dụng các tiêu chuẩn an toàn thông tin khắt khe nhất để chống lại các lỗ hổng bảo mật. Trong trường hợp xảy ra sự cố rò rỉ dữ liệu (Data Breach), chúng tôi cam kết tuân thủ quy trình thông báo vi phạm dữ liệu cá nhân cho Cơ quan chuyên trách bảo vệ dữ liệu cá nhân (thuộc Bộ Công an) và đến bạn trong vòng 72 giờ theo đúng yêu cầu của pháp luật.</p>

            <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-4">7. Thông tin Liên hệ</h2>
            <p>Mọi thắc mắc, khiếu nại liên quan đến Chính sách Bảo vệ Dữ liệu Cá nhân, xin vui lòng gửi về:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Đơn vị kiểm soát dữ liệu:</strong> Ban Bảo vệ Dữ liệu - M$A International</li>
              <li><strong>Email:</strong> admin@mnainternational.com</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
