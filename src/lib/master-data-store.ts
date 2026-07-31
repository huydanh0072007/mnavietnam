import { getSupabaseServerClient, isSupabaseConfigured } from './supabase/server';

const supabaseAdmin = getSupabaseServerClient();

// === HARDCODED MOCK DATA (used when Supabase is not configured) ===
export const FALLBACK_MASTER_DATA = [
  // Loại giao dịch
  { id: 'dt-1', category: 'deal_type', key: 'buyout', label: 'Chuyển nhượng toàn phần (100%)', label_en: 'Buyout (100%)', sort_order: 1, is_active: true },
  { id: 'dt-2', category: 'deal_type', key: 'partial_transfer', label: 'Chuyển nhượng một phần', label_en: 'Partial Transfer', sort_order: 2, is_active: true },
  { id: 'dt-3', category: 'deal_type', key: 'share_transfer', label: 'Chuyển nhượng cổ phần / Vốn góp', label_en: 'Share Transfer', sort_order: 3, is_active: true },
  { id: 'dt-4', category: 'deal_type', key: 'joint_venture', label: 'Hợp tác đầu tư / Liên doanh', label_en: 'Joint Venture', sort_order: 4, is_active: true },
  { id: 'dt-5', category: 'deal_type', key: 'lease', label: 'Cho thuê dài hạn / Khai thác', label_en: 'Long-term Lease', sort_order: 5, is_active: true },

  // Loại dự án
  { id: 'pt-1', category: 'project_type', key: 'residential', label: 'Khu dân cư / Đô thị', label_en: 'Residential / Urban', sort_order: 1, is_active: true },
  { id: 'pt-2', category: 'project_type', key: 'resort', label: 'Khu nghỉ dưỡng / Resort', label_en: 'Resort', sort_order: 2, is_active: true },
  { id: 'pt-3', category: 'project_type', key: 'commercial', label: 'Thương mại / Văn phòng', label_en: 'Commercial / Office', sort_order: 3, is_active: true },
  { id: 'pt-4', category: 'project_type', key: 'industrial', label: 'Khu / Cụm Công nghiệp', label_en: 'Industrial', sort_order: 4, is_active: true },
  { id: 'pt-5', category: 'project_type', key: 'logistics', label: 'Kho bãi / Logistics', label_en: 'Logistics', sort_order: 5, is_active: true },
  { id: 'pt-6', category: 'project_type', key: 'hospitality', label: 'Khách sạn / Lưu trú', label_en: 'Hospitality', sort_order: 6, is_active: true },
  { id: 'pt-7', category: 'project_type', key: 'healthcare', label: 'Y tế / Chăm sóc sức khỏe', label_en: 'Healthcare', sort_order: 7, is_active: true },
  { id: 'pt-8', category: 'project_type', key: 'education', label: 'Giáo dục / Trường học', label_en: 'Education', sort_order: 8, is_active: true },
  { id: 'pt-9', category: 'project_type', key: 'energy', label: 'Năng lượng (Điện mặt trời, Điện gió)', label_en: 'Energy', sort_order: 9, is_active: true },
  { id: 'pt-10', category: 'project_type', key: 'agriculture', label: 'Nông lâm nghiệp / Trang trại', label_en: 'Agriculture', sort_order: 10, is_active: true },
  { id: 'pt-11', category: 'project_type', key: 'other', label: 'Loại hình khác', label_en: 'Other', sort_order: 11, is_active: true },

  // Lead Type
  { id: 'lt-1', category: 'lead_type', key: 'interest', label: 'Quan tâm dự án', label_en: 'Project Interest', sort_order: 1, is_active: true },
  { id: 'lt-2', category: 'lead_type', key: 'submission', label: 'Ký gửi dự án', label_en: 'Project Submission', sort_order: 2, is_active: true },

  // Investor Lead Status
  { id: 'ils-1', category: 'investor_lead_status', key: 'new', label: 'Mới tiếp nhận', label_en: 'New', sort_order: 1, is_active: true },
  { id: 'ils-2', category: 'investor_lead_status', key: 'contacted', label: 'Đã liên hệ', label_en: 'Contacted', sort_order: 2, is_active: true },
  { id: 'ils-3', category: 'investor_lead_status', key: 'nda_sent', label: 'Đã ký NDA', label_en: 'NDA Signed', sort_order: 3, is_active: true },
  { id: 'ils-4', category: 'investor_lead_status', key: 'due_diligence', label: 'Đang thẩm định', label_en: 'Due Diligence', sort_order: 4, is_active: true },
  { id: 'ils-5', category: 'investor_lead_status', key: 'closed_won', label: 'Giao dịch thành công', label_en: 'Closed Won', sort_order: 5, is_active: true },
  { id: 'ils-6', category: 'investor_lead_status', key: 'closed_lost', label: 'Không thành công', label_en: 'Closed Lost', sort_order: 6, is_active: true },

  // Submission Lead Status
  { id: 'sls-1', category: 'submission_lead_status', key: 'draft_pending', label: 'Chờ duyệt', label_en: 'Pending Review', sort_order: 1, is_active: true },
  { id: 'sls-2', category: 'submission_lead_status', key: 'in_progress', label: 'Đang xử lý / Đánh giá', label_en: 'In Progress / Evaluating', sort_order: 2, is_active: true },
  { id: 'sls-3', category: 'submission_lead_status', key: 'published', label: 'Đã xuất bản (Live)', label_en: 'Published (Live)', sort_order: 3, is_active: true },
  { id: 'sls-4', category: 'submission_lead_status', key: 'rejected', label: 'Từ chối', label_en: 'Rejected', sort_order: 4, is_active: true },
  
  // Publish Status
  { id: 'ps-1', category: 'publish_status', key: 'draft', label: 'Nháp', label_en: 'Draft', sort_order: 1, is_active: true },
  { id: 'ps-2', category: 'publish_status', key: 'published', label: 'Đã xuất bản', label_en: 'Published', sort_order: 2, is_active: true },
  { id: 'ps-3', category: 'publish_status', key: 'hidden', label: 'Đã ẩn', label_en: 'Hidden', sort_order: 3, is_active: true },
];

export const FALLBACK_PROVINCES = [
  { code: 'SG', name: 'TP. Hồ Chí Minh', sort_order: 1, is_active: true },
  { code: 'HN', name: 'Hà Nội', sort_order: 2, is_active: true },
  { code: 'DN', name: 'Đà Nẵng', sort_order: 3, is_active: true },
  { code: 'HP', name: 'Hải Phòng', sort_order: 4, is_active: true },
  { code: 'CT', name: 'Cần Thơ', sort_order: 5, is_active: true },
  { code: 'AG', name: 'An Giang', sort_order: 6, is_active: true },
  { code: 'BV', name: 'Bà Rịa - Vũng Tàu', sort_order: 7, is_active: true },
  { code: 'BG', name: 'Bắc Giang', sort_order: 8, is_active: true },
  { code: 'BK', name: 'Bắc Kạn', sort_order: 9, is_active: true },
  { code: 'BL', name: 'Bạc Liêu', sort_order: 10, is_active: true },
  { code: 'BN', name: 'Bắc Ninh', sort_order: 11, is_active: true },
  { code: 'BT', name: 'Bến Tre', sort_order: 12, is_active: true },
  { code: 'BDI', name: 'Bình Định', sort_order: 13, is_active: true },
  { code: 'BD', name: 'Bình Dương', sort_order: 14, is_active: true },
  { code: 'BP', name: 'Bình Phước', sort_order: 15, is_active: true },
  { code: 'BTH', name: 'Bình Thuận', sort_order: 16, is_active: true },
  { code: 'CM', name: 'Cà Mau', sort_order: 17, is_active: true },
  { code: 'CB', name: 'Cao Bằng', sort_order: 18, is_active: true },
  { code: 'DL', name: 'Đắk Lắk', sort_order: 19, is_active: true },
  { code: 'DNO', name: 'Đắk Nông', sort_order: 20, is_active: true },
  { code: 'DB', name: 'Điện Biên', sort_order: 21, is_active: true },
  { code: 'DNA', name: 'Đồng Nai', sort_order: 22, is_active: true },
  { code: 'DT', name: 'Đồng Tháp', sort_order: 23, is_active: true },
  { code: 'GL', name: 'Gia Lai', sort_order: 24, is_active: true },
  { code: 'HG', name: 'Hà Giang', sort_order: 25, is_active: true },
  { code: 'HNA', name: 'Hà Nam', sort_order: 26, is_active: true },
  { code: 'HT', name: 'Hà Tĩnh', sort_order: 27, is_active: true },
  { code: 'HD', name: 'Hải Dương', sort_order: 28, is_active: true },
  { code: 'HGI', name: 'Hậu Giang', sort_order: 29, is_active: true },
  { code: 'HB', name: 'Hòa Bình', sort_order: 30, is_active: true },
  { code: 'HY', name: 'Hưng Yên', sort_order: 31, is_active: true },
  { code: 'KH', name: 'Khánh Hòa', sort_order: 32, is_active: true },
  { code: 'KG', name: 'Kiên Giang', sort_order: 33, is_active: true },
  { code: 'KT', name: 'Kon Tum', sort_order: 34, is_active: true },
  { code: 'LC', name: 'Lai Châu', sort_order: 35, is_active: true },
  { code: 'LD', name: 'Lâm Đồng', sort_order: 36, is_active: true },
  { code: 'LS', name: 'Lạng Sơn', sort_order: 37, is_active: true },
  { code: 'LA', name: 'Long An', sort_order: 38, is_active: true },
  { code: 'ND', name: 'Nam Định', sort_order: 39, is_active: true },
  { code: 'NA', name: 'Nghệ An', sort_order: 40, is_active: true },
  { code: 'NB', name: 'Ninh Bình', sort_order: 41, is_active: true },
  { code: 'NT', name: 'Ninh Thuận', sort_order: 42, is_active: true },
  { code: 'PT', name: 'Phú Thọ', sort_order: 43, is_active: true },
  { code: 'PY', name: 'Phú Yên', sort_order: 44, is_active: true },
  { code: 'QB', name: 'Quảng Bình', sort_order: 45, is_active: true },
  { code: 'QNA', name: 'Quảng Nam', sort_order: 46, is_active: true },
  { code: 'QNG', name: 'Quảng Ngãi', sort_order: 47, is_active: true },
  { code: 'QN', name: 'Quảng Ninh', sort_order: 48, is_active: true },
  { code: 'QT', name: 'Quảng Trị', sort_order: 49, is_active: true },
  { code: 'ST', name: 'Sóc Trăng', sort_order: 50, is_active: true },
  { code: 'SL', name: 'Sơn La', sort_order: 51, is_active: true },
  { code: 'TN', name: 'Tây Ninh', sort_order: 52, is_active: true },
  { code: 'TB', name: 'Thái Bình', sort_order: 53, is_active: true },
  { code: 'TNG', name: 'Thái Nguyên', sort_order: 54, is_active: true },
  { code: 'TH', name: 'Thanh Hóa', sort_order: 55, is_active: true },
  { code: 'TTH', name: 'Thừa Thiên Huế', sort_order: 56, is_active: true },
  { code: 'TG', name: 'Tiền Giang', sort_order: 57, is_active: true },
  { code: 'TV', name: 'Trà Vinh', sort_order: 58, is_active: true },
  { code: 'TQ', name: 'Tuyên Quang', sort_order: 59, is_active: true },
  { code: 'VL', name: 'Vĩnh Long', sort_order: 60, is_active: true },
  { code: 'VP', name: 'Vĩnh Phúc', sort_order: 61, is_active: true },
  { code: 'YB', name: 'Yên Bái', sort_order: 62, is_active: true },
];

export interface MasterDataItem {
  id: string;
  category: string;
  key: string;
  label: string;
  label_en?: string;
  sort_order: number;
  is_active: boolean;
}

export interface MdProvince {
  code: string;
  name: string;
  sort_order: number;
  is_active: boolean;
}

export interface MdDistrict {
  code: string;
  province_code: string;
  name: string;
  old_address_note?: string;
  sort_order: number;
  is_active: boolean;
}

// === Master Data Categories ===

export async function getMasterData(category: string): Promise<MasterDataItem[]> {
  if (!isSupabaseConfigured) return FALLBACK_MASTER_DATA.filter(item => item.category === category);
  try {
    const { data, error } = await supabaseAdmin
      .from('master_data')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error(`Error fetching master data for ${category}:`, error);
      return [];
    }
    
    // Inject label_en from fallback if missing
    return (data as MasterDataItem[]).map(item => {
      if (!item.label_en) {
        const fallback = FALLBACK_MASTER_DATA.find(f => f.key === item.key && f.category === item.category);
        if (fallback) item.label_en = fallback.label_en;
      }
      return item;
    });
  } catch (err) {
    console.error(`Exception fetching master data for ${category}:`, err);
    return [];
  }
}

export async function getAllMasterData(): Promise<MasterDataItem[]> {
  if (!isSupabaseConfigured) return FALLBACK_MASTER_DATA;
  try {
    const { data, error } = await supabaseAdmin
      .from('master_data')
      .select('*')
      .order('category', { ascending: true })
      .order('sort_order', { ascending: true });

    if (error) {
      console.error(`Error fetching all master data:`, error);
      return [];
    }
    
    // Inject label_en from fallback if missing
    return (data as MasterDataItem[]).map(item => {
      if (!item.label_en) {
        const fallback = FALLBACK_MASTER_DATA.find(f => f.key === item.key && f.category === item.category);
        if (fallback) item.label_en = fallback.label_en;
      }
      return item;
    });
  } catch (err) {
    console.error(`Exception fetching all master data:`, err);
    return [];
  }
}

export async function saveMasterData(item: Partial<MasterDataItem>) {
  if (item.id) {
    const { error } = await supabaseAdmin
      .from('master_data')
      .update(item)
      .eq('id', item.id);
    if (error) throw error;
  } else {
    const { error } = await supabaseAdmin
      .from('master_data')
      .insert([item]);
    if (error) throw error;
  }
}

export async function deleteMasterData(id: string) {
  const { error } = await supabaseAdmin
    .from('master_data')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// === Locations ===

export async function getProvinces(all: boolean = false): Promise<MdProvince[]> {
  if (!isSupabaseConfigured) return all ? FALLBACK_PROVINCES : FALLBACK_PROVINCES.filter(p => p.is_active);
  try {
    let query = supabaseAdmin
      .from('md_provinces')
      .select('*')
      .order('sort_order', { ascending: true });
      
    if (!all) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching provinces:', error);
      return [];
    }
    return data as MdProvince[];
  } catch (err) {
    console.error('Exception fetching provinces:', err);
    return [];
  }
}

export async function getDistricts(provinceCode?: string, all: boolean = false): Promise<MdDistrict[]> {
  if (!isSupabaseConfigured) return [];
  try {
    let query = supabaseAdmin
      .from('md_districts')
      .select('*')
      .order('sort_order', { ascending: true });
      
    if (provinceCode) {
      query = query.eq('province_code', provinceCode);
    }
    
    if (!all) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching districts:', error);
      return [];
    }
    return data as MdDistrict[];
  } catch (err) {
    console.error('Exception fetching districts:', err);
    return [];
  }
}

export async function saveProvince(province: Partial<MdProvince>) {
  // Upsert using code as PK
  const { error } = await supabaseAdmin
    .from('md_provinces')
    .upsert([province], { onConflict: 'code' });
  if (error) throw error;
}

export async function deleteProvince(code: string) {
  const { error } = await supabaseAdmin
    .from('md_provinces')
    .delete()
    .eq('code', code);
  if (error) throw error;
}

export async function saveDistrict(district: Partial<MdDistrict>) {
  const { error } = await supabaseAdmin
    .from('md_districts')
    .upsert([district], { onConflict: 'code' });
  if (error) throw error;
}

export async function deleteDistrict(code: string) {
  const { error } = await supabaseAdmin
    .from('md_districts')
    .delete()
    .eq('code', code);
  if (error) throw error;
}

export async function batchUpsertLocations(provinces: Partial<MdProvince>[], districts: Partial<MdDistrict>[]) {
  // Upsert Provinces first
  if (provinces.length > 0) {
    const { error: provError } = await supabaseAdmin
      .from('md_provinces')
      .upsert(provinces, { onConflict: 'code' });
    if (provError) throw provError;
  }

  // Then Upsert Districts
  if (districts.length > 0) {
    const { error: distError } = await supabaseAdmin
      .from('md_districts')
      .upsert(districts, { onConflict: 'code' });
    if (distError) throw distError;
  }
}
