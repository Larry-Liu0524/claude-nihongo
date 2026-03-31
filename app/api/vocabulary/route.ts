import { NextRequest, NextResponse } from 'next/server';
import { getAllVocabulary, addVocabulary } from '@/lib/db';

export async function GET() {
  try {
    const vocabulary = getAllVocabulary();
    return NextResponse.json(vocabulary);
  } catch (error) {
    console.error('Error fetching vocabulary:', error);
    return NextResponse.json({ error: '讀取生字本時發生錯誤' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { word, reading, meaning, source } = body;

    if (!word || typeof word !== 'string' || word.trim().length === 0) {
      return NextResponse.json({ error: '請提供單字' }, { status: 400 });
    }
    if (!meaning || typeof meaning !== 'string' || meaning.trim().length === 0) {
      return NextResponse.json({ error: '請提供意思' }, { status: 400 });
    }

    const item = addVocabulary(
      word.trim(),
      reading ? reading.trim() : null,
      meaning.trim(),
      source ? source.trim() : null
    );

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error adding vocabulary:', error);
    return NextResponse.json({ error: '新增單字時發生錯誤' }, { status: 500 });
  }
}
