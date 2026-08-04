import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy file' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Whitelist file extensions
    const ext = path.extname(file.name).toLowerCase();
    const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.png', '.jpg', '.jpeg'];
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json({ success: false, error: `Định dạng file không được hỗ trợ: ${ext}` }, { status: 400 });
    }

    const uniqueFilename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

    // Try Supabase Storage 'attachments' bucket if configured
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseServerClient();
        const { data, error } = await supabase.storage
          .from('attachments')
          .upload(uniqueFilename, buffer, {
            contentType: file.type || 'application/octet-stream',
            upsert: true,
          });

        if (!error && data) {
          const { data: publicUrlData } = supabase.storage.from('attachments').getPublicUrl(data.path);
          return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl,
            filename: file.name,
          });
        } else {
          console.warn('Supabase storage upload error, falling back to local:', error);
        }
      } catch (err) {
        console.warn('Supabase storage exception, falling back to local:', err);
      }
    }

    // Fallback to local uploads directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, uniqueFilename);
    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${uniqueFilename}`,
      filename: file.name,
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi xử lý file upload' },
      { status: 500 }
    );
  }
}
