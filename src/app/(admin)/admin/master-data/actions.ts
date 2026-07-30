'use server';

import { revalidatePath } from 'next/cache';
import {
  saveMasterData,
  deleteMasterData,
  saveProvince,
  deleteProvince,
  saveDistrict,
  deleteDistrict,
  MasterDataItem,
  MdProvince,
  MdDistrict,
  batchUpsertLocations
} from '@/lib/master-data-store';

export async function actionSaveMasterData(item: Partial<MasterDataItem>) {
  await saveMasterData(item);
  revalidatePath('/admin/master-data');
  revalidatePath('/admin/du-an/taomoi');
  revalidatePath('/danh-muc');
  revalidatePath('/ky-gui');
}

export async function actionDeleteMasterData(id: string) {
  await deleteMasterData(id);
  revalidatePath('/admin/master-data');
  revalidatePath('/admin/du-an/taomoi');
  revalidatePath('/danh-muc');
  revalidatePath('/ky-gui');
}

export async function actionSaveProvince(province: Partial<MdProvince>) {
  await saveProvince(province);
  revalidatePath('/admin/master-data');
  revalidatePath('/admin/du-an/taomoi');
  revalidatePath('/danh-muc');
  revalidatePath('/ky-gui');
}

export async function actionDeleteProvince(code: string) {
  await deleteProvince(code);
  revalidatePath('/admin/master-data');
  revalidatePath('/admin/du-an/taomoi');
  revalidatePath('/danh-muc');
  revalidatePath('/ky-gui');
}

export async function actionSaveDistrict(district: Partial<MdDistrict>) {
  await saveDistrict(district);
  revalidatePath('/admin/master-data');
  revalidatePath('/admin/du-an/taomoi');
  revalidatePath('/danh-muc');
  revalidatePath('/ky-gui');
}

export async function actionDeleteDistrict(code: string) {
  await deleteDistrict(code);
  revalidatePath('/admin/master-data');
  revalidatePath('/admin/du-an/taomoi');
  revalidatePath('/danh-muc');
  revalidatePath('/ky-gui');
}

export async function actionBatchUpsertLocations(provinces: Partial<MdProvince>[], districts: Partial<MdDistrict>[]) {
  await batchUpsertLocations(provinces, districts);
  revalidatePath('/admin/master-data');
  revalidatePath('/admin/du-an/taomoi');
  revalidatePath('/danh-muc');
  revalidatePath('/ky-gui');
}
