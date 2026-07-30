import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text, targetLang = 'en', sourceLang = 'vi' } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Missing text to translate' }, { status: 400 });
    }

    // Call the free Google Translate API endpoint
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(
      text
    )}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Google Translate API returned status ${response.status}`);
    }

    const data = await response.json();
    
    // The response is an array where the first element is an array of translated parts
    // e.g. [[["Hello", "Xin chào", null, null, 1]], null, "vi"]
    if (data && data[0] && Array.isArray(data[0])) {
      const translatedText = data[0].map((part: any) => part[0]).join('');
      return NextResponse.json({ translatedText });
    }

    throw new Error('Invalid response format from Google Translate');
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Failed to translate text' },
      { status: 500 }
    );
  }
}
