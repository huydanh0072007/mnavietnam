'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import {
  saveMasterData,
  saveProvince,
  MdProvince,
  batchUpsertLocations,
  updateProvinceName,
  toggleProvinceActive,
  addMasterDataItem,
  updateMasterDataItem,
  toggleMasterDataItemActive
} from '@/lib/master-data-store';

export async function actionSaveMasterData(item: any) {
  await saveMasterData(item);
  revalidatePath('/admin/master-data');
  revalidatePath('/admin/du-an/taomoi');
  revalidatePath('/danh-muc');
}

export async function actionUpdateProvinceName(code: string, name: string) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from('md_provinces')
    .update({ name })
    .eq('code', code);
  
  if (error) {
    console.error('Error updating province name:', error);
    await updateProvinceName(code, name);
  }
  
  revalidatePath('/admin/master-data');
  revalidatePath('/admin/du-an/taomoi');
  revalidatePath('/danh-muc');
}

export async function actionToggleProvinceActive(code: string, is_active: boolean) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from('md_provinces')
    .update({ is_active })
    .eq('code', code);

  if (error) {
    console.error('Error toggling province active:', error);
    await toggleProvinceActive(code, is_active);
  }

  revalidatePath('/admin/master-data');
  revalidatePath('/admin/du-an/taomoi');
  revalidatePath('/danh-muc');
}

export async function actionAddMasterDataItem(category: string, key: string, label: string) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from('master_data')
    .insert([{ category, key, label, is_active: true, sort_order: 99 }]);

  if (error) {
    console.error('Error adding master data item:', error);
    await addMasterDataItem(category, key, label);
  }

  revalidatePath('/admin/master-data');
  revalidatePath('/admin/du-an/taomoi');
  revalidatePath('/danh-muc');
}

export async function actionUpdateMasterDataItem(id: string, label: string) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from('master_data')
    .update({ label })
    .eq('id', id);

  if (error) {
    console.error('Error updating master data item:', error);
    await updateMasterDataItem(id, label);
  }

  revalidatePath('/admin/master-data');
  revalidatePath('/admin/du-an/taomoi');
  revalidatePath('/danh-muc');
}

export async function actionToggleMasterDataItemActive(id: string, is_active: boolean) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from('master_data')
    .update({ is_active })
    .eq('id', id);

  if (error) {
    console.error('Error toggling master data item active:', error);
    await toggleMasterDataItemActive(id, is_active);
  }

  revalidatePath('/admin/master-data');
  revalidatePath('/admin/du-an/taomoi');
  revalidatePath('/danh-muc');
}

export async function actionSaveProvince(province: Partial<MdProvince>) {
  await saveProvince(province);
  revalidatePath('/admin/master-data');
  revalidatePath('/admin/du-an/taomoi');
  revalidatePath('/danh-muc');
}

export async function actionBatchUpsertLocations(provinces: Partial<MdProvince>[]) {
  await batchUpsertLocations(provinces);
  revalidatePath('/admin/master-data');
  revalidatePath('/admin/du-an/taomoi');
  revalidatePath('/danh-muc');
}
