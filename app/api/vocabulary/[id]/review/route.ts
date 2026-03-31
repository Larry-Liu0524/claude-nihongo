import { NextRequest, NextResponse } from 'next/server';
import { updateReview } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numId = parseInt(id, 10);

    if (isNaN(numId)) {
      return NextResponse.json({ error: '無效的ID' }, { status: 400 });
    }

    const body = await request.json();
    const { remembered } = body;

    if (typeof remembered !== 'boolean') {
      return NextResponse.json({ error: '請提供remembered參數（true/false）' }, { status: 400 });
    }

    const updated = updateReview(numId, remembered);

    if (!updated) {
      return NextResponse.json({ error: '找不到該單字' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ error: '更新複習狀態時發生錯誤' }, { status: 500 });
  }
}
