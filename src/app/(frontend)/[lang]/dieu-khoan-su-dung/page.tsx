import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Điều khoản sử dụng | M$A International',
  description: 'Điều khoản sử dụng nền tảng M$A International.',
};

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-[#F8F6F2] pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm">
          <h1 className="text-3xl font-serif font-bold text-[#1A1A2E] mb-6 border-b border-gray-100 pb-4">
            Điều Khoản Sử Dụng
          </h1>
          
          <div className="prose prose-blue max-w-none text-gray-700 space-y-6">
            <p><strong>Cập nhật lần cuối:</strong> 28/07/2026</p>
            
            <p>Chào mừng bạn đến với M$A International ("Chúng tôi", "Nền tảng"). Khi truy cập và sử dụng trang web của chúng tôi, bạn ("Người dùng") đồng ý tuân thủ các Điều khoản sử dụng này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản, vui lòng không sử dụng Nền tảng của chúng tôi.</p>

            <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-4">1. Dịch vụ của chúng tôi</h2>
            <p>M$A International là nền tảng kết nối các nhà đầu tư, chủ dự án, và các bên liên quan trong lĩnh vực Mua bán & Sáp nhập (M&A) và Hợp tác đầu tư Bất động sản. Chúng tôi đóng vai trò là bên trung gian cung cấp thông tin và hỗ trợ kết nối, không phải là một bên trong bất kỳ hợp đồng giao dịch bất động sản nào trừ khi có thỏa thuận khác bằng văn bản.</p>

            <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-4">2. Tính chính xác của Thông tin</h2>
            <p>Chúng tôi nỗ lực tối đa để đảm bảo các dự án được niêm yết có thông tin minh bạch, rõ ràng. Tuy nhiên, M$A International không đảm bảo tính chính xác tuyệt đối, đầy đủ hoặc tính hợp pháp của mọi thông tin do bên thứ ba (Chủ dự án, Người ký gửi) cung cấp. Các nhà đầu tư cần tiến hành thẩm định chuyên sâu (Due Diligence) trước khi ra quyết định đầu tư.</p>

            <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-4">3. Trách nhiệm của Người dùng</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Người dùng cam kết cung cấp thông tin trung thực, chính xác khi đăng ký ký gửi dự án hoặc liên hệ đầu tư.</li>
              <li>Nghiêm cấm việc sử dụng Nền tảng cho các mục đích lừa đảo, vi phạm pháp luật, rửa tiền, hoặc xâm phạm quyền lợi hợp pháp của bên thứ ba.</li>
              <li>Người dùng phải tự bảo mật thông tin tài khoản và thông tin giao dịch liên quan.</li>
            </ul>

            <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-4">4. Sở hữu trí tuệ</h2>
            <p>Mọi nội dung, thương hiệu, biểu tượng, hình ảnh, văn bản, thiết kế đồ họa trên trang web này thuộc sở hữu của M$A International hoặc các đối tác hợp pháp của chúng tôi và được bảo hộ bởi luật sở hữu trí tuệ. Bất kỳ hành vi sao chép, tái bản hoặc sử dụng trái phép nào đều bị nghiêm cấm.</p>

            <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-4">5. Chấm dứt sử dụng</h2>
            <p>Chúng tôi có quyền đơn phương tạm ngưng hoặc chấm dứt quyền truy cập của Người dùng vào Nền tảng bất cứ lúc nào, không cần báo trước, nếu phát hiện Người dùng vi phạm các Điều khoản sử dụng này hoặc có hành vi gây tổn hại đến uy tín của M$A International.</p>

            <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-4">6. Miễn trừ trách nhiệm</h2>
            <p>M$A International sẽ không chịu trách nhiệm pháp lý đối với bất kỳ thiệt hại trực tiếp, gián tiếp, ngẫu nhiên, hoặc hệ quả nào phát sinh từ việc sử dụng hoặc không thể sử dụng Nền tảng của chúng tôi, hoặc từ các giao dịch phát sinh thông qua Nền tảng.</p>

            <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-4">7. Sửa đổi Điều khoản</h2>
            <p>Chúng tôi có quyền sửa đổi, bổ sung các Điều khoản này bất cứ lúc nào. Các thay đổi sẽ có hiệu lực ngay khi được đăng tải trên trang web. Việc Người dùng tiếp tục sử dụng Nền tảng sau khi có thay đổi đồng nghĩa với việc chấp nhận các sửa đổi đó.</p>

            <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-4">8. Luật điều chỉnh</h2>
            <p>Các Điều khoản sử dụng này được điều chỉnh và giải thích theo quy định của pháp luật nước Cộng hòa Xã hội Chủ nghĩa Việt Nam.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
