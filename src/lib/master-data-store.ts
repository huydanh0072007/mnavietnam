import { getSupabaseServerClient, isSupabaseConfigured } from './supabase/server';

const supabaseAdmin = getSupabaseServerClient();

// === HARDCODED MOCK DATA (used when Supabase is not configured) ===
export const FALLBACK_MASTER_DATA = [
  // Loại giao dịch
  { id: 'dt-1', category: 'deal_type', key: 'buyout', label: 'Chuyển nhượng', label_en: 'Buyout', sort_order: 1, is_active: true },
  { id: 'dt-2', category: 'deal_type', key: 'joint_venture', label: 'Hợp tác đầu tư', label_en: 'Joint Venture', sort_order: 2, is_active: true },

  // Loại dự án
  { id: 'pt-1', category: 'project_type', key: 'residential', label: 'Khu dân cư / Đô thị', label_en: 'Residential / Urban', sort_order: 1, is_active: true },
  { id: 'pt-2', category: 'project_type', key: 'resort', label: 'Khu nghỉ dưỡng / Khách sạn', label_en: 'Resort / Hotel', sort_order: 2, is_active: true },
  { id: 'pt-3', category: 'project_type', key: 'commercial', label: 'Thương mại / Văn phòng', label_en: 'Commercial / Office', sort_order: 3, is_active: true },
  { id: 'pt-4', category: 'project_type', key: 'urban_low_rise', label: 'Đô thị thấp tầng', label_en: 'Low-rise Urban', sort_order: 4, is_active: true },
  { id: 'pt-5', category: 'project_type', key: 'industrial', label: 'Khu công nghiệp / Cụm CN', label_en: 'Industrial Park', sort_order: 5, is_active: true },
  { id: 'pt-6', category: 'project_type', key: 'other', label: 'Khác', label_en: 'Other', sort_order: 6, is_active: true },

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
  { code: '01', name: 'Hà Nội', sort_order: 1, is_active: true },
  { code: '79', name: 'Hồ Chí Minh', sort_order: 2, is_active: true },
  { code: '48', name: 'Đà Nẵng', sort_order: 3, is_active: true },
  { code: '31', name: 'Hải Phòng', sort_order: 4, is_active: true },
  { code: '92', name: 'Cần Thơ', sort_order: 5, is_active: true },
  { code: '74', name: 'Bình Dương', sort_order: 6, is_active: true },
  { code: '75', name: 'Đồng Nai', sort_order: 7, is_active: true },
  { code: '77', name: 'Bà Rịa - Vũng Tàu', sort_order: 8, is_active: true },
  { code: '80', name: 'Long An', sort_order: 9, is_active: true },
  { code: '17', name: 'Quảng Ninh', sort_order: 10, is_active: true },
  { code: '91', name: 'Kiên Giang', sort_order: 11, is_active: true },
  { code: '56', name: 'Khánh Hòa', sort_order: 12, is_active: true },
  { code: '60', name: 'Bình Thuận', sort_order: 13, is_active: true },
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
