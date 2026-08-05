import { getSupabaseServerClient, isSupabaseConfigured } from './supabase/server';

export interface GlobalSettings {
  phone: string;
  email: string;
  address: string;
  zalo_url: string;
  facebook_url: string;
  linkedin_url: string;
  hero_title: string;
  hero_subtitle: string;
  ai_provider: string;
  ai_api_key: string;
  ai_model: string;
  about_hero_title: string;
  about_hero_subtitle: string;
  about_vision_title: string;
  about_vision_desc_1: string;
  about_vision_desc_2: string;
  about_stats: { value: string; label: string }[];
  about_values: { id: number; title: string; desc: string }[];
  
  // SMTP Config
  smtp_host: string;
  smtp_port: number;
  smtp_secure: boolean;
  smtp_user: string;
  smtp_pass: string;
  smtp_from_name: string;
  smtp_from_email: string;

  // Notification Config
  enable_email_notif: boolean;
  notification_email_recipients: string;
  notification_frequency: string;
}

const defaultSettings: GlobalSettings = {
  phone: "090 123 4567",
  email: "contact@mnainternational.com",
  address: "Tầng 12, Tòa nhà MNA, Quận 1, TP.HCM",
  zalo_url: "https://zalo.me/",
  facebook_url: "https://facebook.com/",
  linkedin_url: "https://linkedin.com/",
  hero_title: "CỔNG THÔNG TIN DỰ ÁN M&A<br/>HÀNG ĐẦU VIỆT NAM",
  hero_subtitle: "Nền tảng kết nối Độc quyền giữa các Chủ đầu tư uy tín và Mạng lưới Nhà đầu tư Quốc tế.",
  ai_provider: "google",
  ai_api_key: "",
  ai_model: "gemini-1.5-pro",
  about_hero_title: "Về M$AVietnam",
  about_hero_subtitle: "Cầu nối tin cậy giữa các nhà phát triển bất động sản và mạng lưới nhà đầu tư trong nước cũng như quốc tế.",
  about_vision_title: "Tầm nhìn & Sứ mệnh",
  about_vision_desc_1: "Được thành lập với mục tiêu minh bạch hóa và chuyên nghiệp hóa thị trường mua bán, sáp nhập dự án bất động sản tại Việt Nam, M$AVietnam tự hào là nền tảng tiên phong kết nối các cơ hội đầu tư chất lượng cao.",
  about_vision_desc_2: "Chúng tôi hiểu rằng mỗi thương vụ M&A bất động sản đều đòi hỏi sự am hiểu sâu sắc về thị trường, pháp lý và tài chính. Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi không chỉ là người kết nối mà còn là nhà tư vấn đáng tin cậy xuyên suốt quá trình giao dịch.",
  about_stats: [
    { value: "5+", label: "Năm kinh nghiệm" },
    { value: "200+", label: "Đối tác đầu tư" },
    { value: "$500M+", label: "Giá trị giao dịch" },
    { value: "100%", label: "Bảo mật thông tin" }
  ],
  about_values: [
    { id: 1, title: "Minh bạch", "desc": "Mọi thông tin dự án đều được thẩm định sơ bộ, đảm bảo tính xác thực và pháp lý rõ ràng trước khi giới thiệu đến nhà đầu tư." },
    { id: 2, title: "Bảo mật", "desc": "Chúng tôi tuân thủ nghiêm ngặt quy trình NDA, đảm bảo thông tin thương vụ và danh tính khách hàng được giữ kín tuyệt đối." },
    { id: 3, title: "Hiệu quả", "desc": "Rút ngắn thời gian tìm kiếm đối tác và đàm phán thông qua mạng lưới kết nối sâu rộng và quy trình làm việc chuyên nghiệp." }
  ],
  smtp_host: "",
  smtp_port: 587,
  smtp_secure: false,
  smtp_user: "",
  smtp_pass: "",
  smtp_from_name: "M$A International",
  smtp_from_email: "noreply@mnainternational.com",
  enable_email_notif: true,
  notification_email_recipients: "admin@mnainternational.com, legal@mnainternational.com",
  notification_frequency: "immediate"
};

export async function getSettings(): Promise<GlobalSettings> {
  if (!isSupabaseConfigured()) {
    return defaultSettings;
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 'global')
    .single();

  if (error || !data) {
    console.error('Error fetching settings:', error);
    return defaultSettings;
  }

  return { ...defaultSettings, ...data } as GlobalSettings;
}

export async function saveSettings(newSettings: Partial<GlobalSettings>): Promise<GlobalSettings> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured! Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.');
  }

  const currentSettings = await getSettings();
  const mergedSettings = { ...currentSettings, ...newSettings };
  
  // Only send known DB columns to Supabase (exclude id, updated_at, and any non-column fields)
  const dbPayload: Record<string, unknown> = {
    phone: mergedSettings.phone,
    email: mergedSettings.email,
    address: mergedSettings.address,
    zalo_url: mergedSettings.zalo_url,
    facebook_url: mergedSettings.facebook_url,
    linkedin_url: mergedSettings.linkedin_url,
    hero_title: mergedSettings.hero_title,
    hero_subtitle: mergedSettings.hero_subtitle,
    ai_provider: mergedSettings.ai_provider,
    ai_api_key: mergedSettings.ai_api_key,
    ai_model: mergedSettings.ai_model,
    about_hero_title: mergedSettings.about_hero_title,
    about_hero_subtitle: mergedSettings.about_hero_subtitle,
    about_vision_title: mergedSettings.about_vision_title,
    about_vision_desc_1: mergedSettings.about_vision_desc_1,
    about_vision_desc_2: mergedSettings.about_vision_desc_2,
    about_stats: mergedSettings.about_stats,
    about_values: mergedSettings.about_values,
    smtp_host: mergedSettings.smtp_host,
    smtp_port: mergedSettings.smtp_port,
    smtp_secure: mergedSettings.smtp_secure,
    smtp_user: mergedSettings.smtp_user,
    smtp_pass: mergedSettings.smtp_pass,
    smtp_from_name: mergedSettings.smtp_from_name,
    smtp_from_email: mergedSettings.smtp_from_email,
    enable_email_notif: mergedSettings.enable_email_notif,
    notification_email_recipients: mergedSettings.notification_email_recipients,
    notification_frequency: mergedSettings.notification_frequency,
  };

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('settings')
    .upsert({ id: 'global', ...dbPayload }, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    console.error('Error saving settings:', error);
    throw new Error(`Failed to save settings: ${error.message}`);
  }

  if (!data) {
    throw new Error('Failed to save settings: No data returned after upsert.');
  }

  return { ...mergedSettings, ...data } as GlobalSettings;
}
