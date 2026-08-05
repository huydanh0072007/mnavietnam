import type { Metadata } from 'next';
import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n-config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return {
    title: dict.about_metadata.title,
    description: dict.about_metadata.description,
  };
}

export default function GioiThieuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
