import nodemailer from 'nodemailer';
import { getSettings } from './config-store';

/**
 * Creates a configured Nodemailer transporter using dynamic settings from the database.
 */
async function getTransporter() {
  const settings = await getSettings();
  
  if (!settings.smtp_host || !settings.smtp_user || !settings.smtp_pass) {
    throw new Error('Cấu hình SMTP chưa đầy đủ. Vui lòng cập nhật trong phần Cài đặt.');
  }

  return nodemailer.createTransport({
    host: settings.smtp_host,
    port: settings.smtp_port,
    secure: settings.smtp_secure, // true for 465, false for other ports
    auth: {
      user: settings.smtp_user,
      pass: settings.smtp_pass,
    },
  });
}

/**
 * Gets the configured "From" address string.
 */
async function getFromAddress() {
  const settings = await getSettings();
  return `"${settings.smtp_from_name}" <${settings.smtp_from_email}>`;
}

/**
 * Sends a test email to verify SMTP configuration.
 */
export async function sendTestEmail(toEmail: string) {
  const transporter = await getTransporter();
  const from = await getFromAddress();

  const mailOptions = {
    from,
    to: toEmail,
    subject: 'M$A International - Kiểm tra kết nối SMTP',
    text: 'Cấu hình SMTP của bạn đã hoạt động thành công!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #0A1628;">Kết nối SMTP Thành Công!</h2>
        <p>Hệ thống gửi email tự động từ M$A International đã được cấu hình chính xác.</p>
        <p>Bây giờ bạn có thể nhận thông báo Lead mới và gửi cập nhật tiến độ cho khách hàng.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888;">Đây là email tự động, vui lòng không trả lời.</p>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}

/**
 * Sends an email notification to Admin when a new Lead is submitted.
 */
export async function sendLeadNotificationToAdmin(leadDetails: any) {
  const settings = await getSettings();
  
  // We can use the generic contact email as the admin email if not specified otherwise, 
  // or add a dedicated admin_email field. For now, let's use the contact email.
  const adminEmail = settings.email; 
  
  const transporter = await getTransporter();
  const from = await getFromAddress();

  const mailOptions = {
    from,
    to: adminEmail,
    subject: `[MNA] Có yêu cầu ${leadDetails.lead_type === 'submission' ? 'ký gửi' : 'quan tâm'} mới từ ${leadDetails.full_name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #0A1628;">Có yêu cầu mới trên hệ thống!</h2>
        <p><strong>Khách hàng:</strong> ${leadDetails.full_name}</p>
        <p><strong>Công ty:</strong> ${leadDetails.organization}</p>
        <p><strong>Điện thoại:</strong> ${leadDetails.phone}</p>
        <p><strong>Email:</strong> ${leadDetails.email}</p>
        <br/>
        <a href="http://localhost:3060/admin/leads" style="display: inline-block; padding: 10px 20px; background-color: #C4A35A; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold;">
          Xem chi tiết trên Admin
        </a>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}

/**
 * Sends a status update email to the client.
 */
export async function sendStatusUpdateToClient(clientEmail: string, clientName: string, projectName: string, newStatusLabel: string) {
  const transporter = await getTransporter();
  const from = await getFromAddress();

  const mailOptions = {
    from,
    to: clientEmail,
    subject: `[M$A International] Cập nhật trạng thái dự án: ${projectName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #0A1628;">Xin chào ${clientName},</h2>
        <p>Hệ thống M$A International xin thông báo trạng thái yêu cầu của bạn đối với dự án <strong>${projectName}</strong> đã được cập nhật thành:</p>
        <p style="padding: 12px; background-color: #f8f9fa; border-left: 4px solid #C4A35A; font-size: 16px; font-weight: bold; color: #0A1628;">
          ${newStatusLabel}
        </p>
        <p>Chuyên viên của chúng tôi sẽ sớm liên hệ với bạn để trao đổi các bước tiếp theo.</p>
        <br/>
        <p>Trân trọng,<br/><strong>Đội ngũ M$A International</strong></p>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}
