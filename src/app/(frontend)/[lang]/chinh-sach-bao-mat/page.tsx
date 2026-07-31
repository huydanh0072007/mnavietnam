import React from 'react';
import { Metadata } from 'next';
import { getDictionary } from '@/lib/get-dictionary';

export async function generateMetadata({ params: { lang } }: { params: { lang: string } }): Promise<Metadata> {
  const dict = await getDictionary(lang as any);
  return {
    title: `${dict.privacy.title} | M$A International`,
    description: dict.privacy.description,
  };
}

export default async function PrivacyPolicyPage({ params: { lang } }: { params: { lang: string } }) {
  const dict = await getDictionary(lang as any);
  
  return (
    <div className="min-h-screen bg-[#F8F6F2] pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm">
          <h1 className="text-3xl font-serif font-bold text-[#1A1A2E] mb-6 border-b border-gray-100 pb-4">
            {dict.privacy.title}
          </h1>
          
          <div className="prose prose-blue max-w-none text-gray-700 space-y-6">
            <p><strong>{dict.privacy.last_updated}</strong></p>
            
            <p dangerouslySetInnerHTML={{ __html: dict.privacy.intro }} />

            <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-4">{dict.privacy.section_1_title}</h2>
            <p>{dict.privacy.section_1_desc}</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>{dict.privacy.section_1_item_1}</li>
              <li>{dict.privacy.section_1_item_2}</li>
              <li>{dict.privacy.section_1_item_3}</li>
              <li>{dict.privacy.section_1_item_4}</li>
              <li>{dict.privacy.section_1_item_5}</li>
            </ul>

            <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-4">{dict.privacy.section_2_title}</h2>
            <p>{dict.privacy.section_2_desc}</p>
            <ul className="list-disc pl-5 space-y-2">
              <li dangerouslySetInnerHTML={{ __html: dict.privacy.section_2_item_1 }} />
              <li dangerouslySetInnerHTML={{ __html: dict.privacy.section_2_item_2 }} />
              <li dangerouslySetInnerHTML={{ __html: dict.privacy.section_2_item_3 }} />
            </ul>

            <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-4">{dict.privacy.section_3_title}</h2>
            <p>{dict.privacy.section_3_desc}</p>
            <ul className="list-disc pl-5 space-y-2">
              <li dangerouslySetInnerHTML={{ __html: dict.privacy.section_3_item_1 }} />
              <li dangerouslySetInnerHTML={{ __html: dict.privacy.section_3_item_2 }} />
              <li dangerouslySetInnerHTML={{ __html: dict.privacy.section_3_item_3 }} />
              <li dangerouslySetInnerHTML={{ __html: dict.privacy.section_3_item_4 }} />
            </ul>

            <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-4">{dict.privacy.section_4_title}</h2>
            <p>{dict.privacy.section_4_desc}</p>
            <ul className="list-disc pl-5 space-y-2">
              <li dangerouslySetInnerHTML={{ __html: dict.privacy.section_4_item_1 }} />
              <li dangerouslySetInnerHTML={{ __html: dict.privacy.section_4_item_2 }} />
              <li dangerouslySetInnerHTML={{ __html: dict.privacy.section_4_item_3 }} />
              <li dangerouslySetInnerHTML={{ __html: dict.privacy.section_4_item_4 }} />
            </ul>
            <p>{dict.privacy.section_4_contact} <a href="mailto:admin@mnainternational.com" className="text-blue-600 underline">admin@mnainternational.com</a>.</p>

            <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-4">{dict.privacy.section_5_title}</h2>
            <p dangerouslySetInnerHTML={{ __html: dict.privacy.section_5_item_1 }} />
            <p dangerouslySetInnerHTML={{ __html: dict.privacy.section_5_item_2 }} />

            <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-4">{dict.privacy.section_6_title}</h2>
            <p dangerouslySetInnerHTML={{ __html: dict.privacy.section_6_desc }} />

            <h2 className="text-xl font-bold text-[#1A1A2E] mt-8 mb-4">{dict.privacy.section_7_title}</h2>
            <p>{dict.privacy.section_7_desc}</p>
            <ul className="list-disc pl-5 space-y-2">
              <li dangerouslySetInnerHTML={{ __html: dict.privacy.section_7_item_1 }} />
              <li dangerouslySetInnerHTML={{ __html: dict.privacy.section_7_item_2 }} />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
