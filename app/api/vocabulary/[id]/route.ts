import { NextRequest, NextResponse } from 'next/server';
import { deleteVocabulary } from '@/lib/db';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numId = parseInt(id, 10);

    if (isNaN(numId)) {
      return NextResponse.json({ error: '無效的ID' }, { status: 400 });
    }

    const deleted = deleteVocabulary(numId);

    if (!deleted) {
      return NextResponse.json({ error: '找不到該單字' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting vocabulary:', error);
    return NextResponse.json({ error: '刪除單字時發生錯誤' }, { status: 500 });
  }
}
