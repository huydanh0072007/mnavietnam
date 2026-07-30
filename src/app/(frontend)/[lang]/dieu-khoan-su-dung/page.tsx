import React from 'react';
import { Metadata } from 'next';
import { getDictionary } from '@/lib/get-dictionary';

export async function generateMetadata({ params }: { params: Promise<any> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  return {
    title: `${dict.terms.title} | M$A International`,
    description: dict.terms.title,
  };
}

export default async function TermsOfUsePage({ params }: { params: Promise<any> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);

  return (
    <div className="min-h-screen bg-[#F8F6F2] pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm">
          <h1 className="text-3xl font-serif font-bold text-[#1A1A2E] mb-6 border-b border-gray-100 pb-4">
            {dict.terms.title}
          </h1>
          
          <div className="prose prose-blue max-w-none text-gray-700 space-y-6">
            <p><strong>{dict.terms.last_updated}</strong></p>
            
            <p>{dict.terms.welcome}</p>

            <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-4">{dict.terms.section_1_title}</h2>
            <p>{dict.terms.section_1_desc}</p>

            <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-4">{dict.terms.section_2_title}</h2>
            <p>{dict.terms.section_2_desc}</p>

            <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-4">{dict.terms.section_3_title}</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>{dict.terms.section_3_item_1}</li>
              <li>{dict.terms.section_3_item_2}</li>
              <li>{dict.terms.section_3_item_3}</li>
            </ul>

            <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-4">{dict.terms.section_4_title}</h2>
            <p>{dict.terms.section_4_desc}</p>

            <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-4">{dict.terms.section_5_title}</h2>
            <p>{dict.terms.section_5_desc}</p>

            <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-4">{dict.terms.section_6_title}</h2>
            <p>{dict.terms.section_6_desc}</p>

            <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-4">{dict.terms.section_7_title}</h2>
            <p>{dict.terms.section_7_desc}</p>

            <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-4">{dict.terms.section_8_title}</h2>
            <p>{dict.terms.section_8_desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
