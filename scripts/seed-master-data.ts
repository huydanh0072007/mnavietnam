import { loadEnvConfig } from '@next/env';
import { createClient } from '@supabase/supabase-js';

// Tải biến môi trường từ .env.local
const projectDir = process.cwd();
loadEnvConfig(projectDir);

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!rawUrl || !rawKey || rawUrl === 'your_supabase_url') {
  console.error("Supabase credentials not found or not configured properly in .env.local.");
  process.exit(1);
}

const supabaseAdmin = createClient(rawUrl, rawKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const MASTER_DATA = [
  // Loại giao dịch
  { category: 'deal_type', key: 'buyout', label: 'Chuyển nhượng', sort_order: 1, is_active: true },
  { category: 'deal_type', key: 'joint_venture', label: 'Hợp tác đầu tư', sort_order: 2, is_active: true },

  // Loại dự án
  { category: 'project_type', key: 'residential', label: 'Khu dân cư / Đô thị', sort_order: 1, is_active: true },
  { category: 'project_type', key: 'resort', label: 'Khu nghỉ dưỡng / Khách sạn', sort_order: 2, is_active: true },
  { category: 'project_type', key: 'commercial', label: 'Thương mại / Văn phòng', sort_order: 3, is_active: true },
  { category: 'project_type', key: 'urban_low_rise', label: 'Đô thị thấp tầng', sort_order: 4, is_active: true },
  { category: 'project_type', key: 'industrial', label: 'Khu công nghiệp / Cụm CN', sort_order: 5, is_active: true },
  { category: 'project_type', key: 'other', label: 'Khác', sort_order: 6, is_active: true },

  // Lead Type
  { category: 'lead_type', key: 'interest', label: 'Quan tâm dự án', sort_order: 1, is_active: true },
  { category: 'lead_type', key: 'submission', label: 'Ký gửi dự án', sort_order: 2, is_active: true },

  // Investor Lead Status
  { category: 'investor_lead_status', key: 'new', label: 'Mới tiếp nhận', sort_order: 1, is_active: true },
  { category: 'investor_lead_status', key: 'contacted', label: 'Đã liên hệ', sort_order: 2, is_active: true },
  { category: 'investor_lead_status', key: 'nda_sent', label: 'Đã ký NDA', sort_order: 3, is_active: true },
  { category: 'investor_lead_status', key: 'due_diligence', label: 'Đang thẩm định', sort_order: 4, is_active: true },
  { category: 'investor_lead_status', key: 'closed_won', label: 'Giao dịch thành công', sort_order: 5, is_active: true },
  { category: 'investor_lead_status', key: 'closed_lost', label: 'Không thành công', sort_order: 6, is_active: true },

  // Submission Lead Status
  { category: 'submission_lead_status', key: 'draft_pending', label: 'Chờ duyệt', sort_order: 1, is_active: true },
  { category: 'submission_lead_status', key: 'in_progress', label: 'Đang xử lý / Đánh giá', sort_order: 2, is_active: true },
  { category: 'submission_lead_status', key: 'published', label: 'Đã xuất bản (Live)', sort_order: 3, is_active: true },
  { category: 'submission_lead_status', key: 'rejected', label: 'Từ chối', sort_order: 4, is_active: true },
  
  // Publish Status
  { category: 'publish_status', key: 'draft', label: 'Nháp', sort_order: 1, is_active: true },
  { category: 'publish_status', key: 'published', label: 'Đã xuất bản', sort_order: 2, is_active: true },
  { category: 'publish_status', key: 'hidden', label: 'Đã ẩn', sort_order: 3, is_active: true },
];

const PROVINCES = [
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

async function seed() {
  console.log("Starting Master Data seed...");

  // 1. Seed Master Data
  for (const item of MASTER_DATA) {
    const { data: existing, error: checkError } = await supabaseAdmin
      .from('master_data')
      .select('id')
      .eq('category', item.category)
      .eq('key', item.key)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') { // Not found error is expected
      console.error(`Error checking ${item.category}/${item.key}:`, checkError);
      continue;
    }

    if (!existing) {
      console.log(`Inserting: ${item.category} -> ${item.key}`);
      const { error: insertError } = await supabaseAdmin
        .from('master_data')
        .insert([item]);
      
      if (insertError) {
        console.error(`Failed to insert ${item.category}/${item.key}:`, insertError);
      }
    } else {
      console.log(`Skipping (already exists): ${item.category} -> ${item.key}`);
    }
  }

  // 2. Seed Provinces
  console.log("\nStarting Provinces seed...");
  for (const prov of PROVINCES) {
    const { error: upsertError } = await supabaseAdmin
      .from('md_provinces')
      .upsert([prov], { onConflict: 'code' });
      
    if (upsertError) {
      console.error(`Failed to upsert province ${prov.name}:`, upsertError);
    } else {
      console.log(`Upserted province: ${prov.name}`);
    }
  }

  console.log("\nSeeding completed successfully.");
}

seed().catch(console.error);
