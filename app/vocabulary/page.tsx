'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import type { VocabularyItem } from '@/lib/db';

export default function VocabularyPage() {
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchVocabulary = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/vocabulary');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setVocabulary(data);
    } catch {
      setError('讀取生字本失敗');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVocabulary();
  }, [fetchVocabulary]);

  async function handleDelete(id: number) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/vocabulary/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setVocabulary((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeletingId(null);
    }
  }

  const filtered = vocabulary.filter(
    (item) =>
      item.word.includes(searchQuery) ||
      (item.reading && item.reading.includes(searchQuery)) ||
      item.meaning.includes(searchQuery)
  );

  const reviewDue = vocabulary.filter(
    (item) => item.next_review <= Math.floor(Date.now() / 1000)
  ).length;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-20 text-gray-400">
          <div className="text-4xl mb-4 animate-pulse">📖</div>
          <p>載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">📖 生字本</h1>
          <p className="text-gray-400">已儲存 {vocabulary.length} 個單字</p>
        </div>
        <div className="flex items-center gap-3">
          {reviewDue > 0 && (
            <span className="px-3 py-1 rounded-full text-sm font-medium"
              style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.4)' }}>
              {reviewDue} 個待複習
            </span>
          )}
          <Link href="/review" className="btn-primary px-5 py-2">
            🎴 開始複習
          </Link>
        </div>
      </div>

      {error && (
        <div className="anime-card p-4 mb-6" style={{ borderColor: 'rgba(239, 68, 68, 0.5)' }}>
          <p className="text-red-400">❌ {error}</p>
        </div>
      )}

      {/* Search */}
      {vocabulary.length > 0 && (
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋單字..."
            className="w-full px-4 py-2 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            style={{ background: '#1a1a2e', border: '1px solid #2d2d4e' }}
          />
        </div>
      )}

      {/* Empty State */}
      {vocabulary.length === 0 ? (
        <div className="anime-card p-12 text-center">
          <div className="text-5xl mb-4">📭</div>
          <h2 className="text-xl font-bold text-white mb-2">生字本還是空的</h2>
          <p className="text-gray-400 mb-6">去歌詞分析或常用句頁面加入單字吧！</p>
          <div className="flex gap-3 justify-center">
            <Link href="/lyrics" className="btn-primary px-5 py-2">
              🎵 去歌詞分析
            </Link>
            <Link href="/phrases" className="btn-secondary px-5 py-2">
              💬 去常用句
            </Link>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="anime-card p-8 text-center">
          <p className="text-gray-400">沒有符合「{searchQuery}」的單字</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const isDue = item.next_review <= Math.floor(Date.now() / 1000);
            return (
              <div
                key={item.id}
                className="anime-card p-4 flex items-start justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                    <span className="text-xl font-bold text-white">{item.word}</span>
                    {item.reading && (
                      <span className="text-purple-400 text-sm">【{item.reading}】</span>
                    )}
                    {isDue && (
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.4)' }}>
                        待複習
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm mb-1">{item.meaning}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    {item.source && <span>📌 {item.source}</span>}
                    <span>複習 {item.review_count} 次</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  className="btn-danger flex-shrink-0"
                >
                  {deletingId === item.id ? '...' : '刪除'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
