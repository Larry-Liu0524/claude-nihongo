'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import type { VocabularyItem } from '@/lib/db';

type ReviewState = 'idle' | 'reviewing' | 'revealed' | 'done';

export default function ReviewPage() {
  const [allVocabulary, setAllVocabulary] = useState<VocabularyItem[]>([]);
  const [queue, setQueue] = useState<VocabularyItem[]>([]);
  const [current, setCurrent] = useState<VocabularyItem | null>(null);
  const [state, setState] = useState<ReviewState>('idle');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ remembered: 0, again: 0 });
  const [submitting, setSubmitting] = useState(false);

  const fetchVocabulary = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/vocabulary');
      if (!res.ok) throw new Error('Failed to fetch');
      const data: VocabularyItem[] = await res.json();
      setAllVocabulary(data);

      const now = Math.floor(Date.now() / 1000);
      const due = data.filter((item) => item.next_review <= now);
      setQueue(due);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVocabulary();
  }, [fetchVocabulary]);

  function startReview() {
    if (queue.length === 0) return;
    const shuffled = [...queue].sort(() => Math.random() - 0.5);
    setQueue(shuffled);
    setCurrent(shuffled[0]);
    setState('reviewing');
    setStats({ remembered: 0, again: 0 });
  }

  function revealCard() {
    setState('revealed');
  }

  async function handleAnswer(remembered: boolean) {
    if (!current || submitting) return;
    setSubmitting(true);

    try {
      await fetch(`/api/vocabulary/${current.id}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ remembered }),
      });

      setStats((prev) => ({
        remembered: remembered ? prev.remembered + 1 : prev.remembered,
        again: remembered ? prev.again : prev.again + 1,
      }));

      // Move to next card
      const currentIndex = queue.indexOf(current);
      if (remembered) {
        // Remove from queue
        const newQueue = queue.filter((_, i) => i !== currentIndex);
        if (newQueue.length === 0) {
          setState('done');
          setCurrent(null);
        } else {
          const nextIndex = currentIndex < newQueue.length ? currentIndex : 0;
          setQueue(newQueue);
          setCurrent(newQueue[nextIndex]);
          setState('reviewing');
        }
      } else {
        // Keep in queue, move to end
        const newQueue = [
          ...queue.filter((_, i) => i !== currentIndex),
          current,
        ];
        const nextIndex = currentIndex < newQueue.length - 1 ? currentIndex : 0;
        setQueue(newQueue);
        setCurrent(newQueue[nextIndex]);
        setState('reviewing');
      }
    } catch (err) {
      console.error('Review update error:', err);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center py-20 text-gray-400">
          <div className="text-4xl mb-4 animate-pulse">🎴</div>
          <p>載入中...</p>
        </div>
      </div>
    );
  }

  const now = Math.floor(Date.now() / 1000);
  const dueCount = allVocabulary.filter((item) => item.next_review <= now).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">🎴 單字複習</h1>
        <p className="text-gray-400">間隔重複記憶法（SRS）複習</p>
      </div>

      {/* Idle State */}
      {state === 'idle' && (
        <div className="anime-card p-8 text-center">
          {allVocabulary.length === 0 ? (
            <>
              <div className="text-5xl mb-4">📭</div>
              <h2 className="text-xl font-bold text-white mb-2">生字本是空的</h2>
              <p className="text-gray-400 mb-6">先去加入一些單字吧！</p>
              <div className="flex gap-3 justify-center">
                <Link href="/lyrics" className="btn-primary px-5 py-2">
                  🎵 去歌詞分析
                </Link>
                <Link href="/phrases" className="btn-secondary px-5 py-2">
                  💬 去常用句
                </Link>
              </div>
            </>
          ) : dueCount === 0 ? (
            <>
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-xl font-bold text-white mb-2">今天的複習已完成！</h2>
              <p className="text-gray-400 mb-2">目前共有 {allVocabulary.length} 個單字</p>
              <p className="text-gray-500 text-sm mb-6">下次複習時間將根據SRS演算法自動安排</p>
              <Link href="/vocabulary" className="btn-secondary px-5 py-2">
                📖 查看生字本
              </Link>
            </>
          ) : (
            <>
              <div className="text-5xl mb-4">🎴</div>
              <h2 className="text-xl font-bold text-white mb-2">
                有 {dueCount} 個單字待複習
              </h2>
              <p className="text-gray-400 mb-6">
                生字本共 {allVocabulary.length} 個單字
              </p>
              <button onClick={startReview} className="btn-primary px-8 py-3 text-base">
                ▶ 開始複習
              </button>
            </>
          )}
        </div>
      )}

      {/* Reviewing / Revealed State */}
      {(state === 'reviewing' || state === 'revealed') && current && (
        <div className="space-y-6">
          {/* Progress */}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>剩餘 {queue.length} 張</span>
            <div className="flex gap-4">
              <span className="text-green-400">記住 {stats.remembered}</span>
              <span className="text-red-400">再複習 {stats.again}</span>
            </div>
          </div>

          {/* Card */}
          <div className="anime-card p-8 text-center min-h-[280px] flex flex-col items-center justify-center">
            {current.source && (
              <p className="text-gray-600 text-sm mb-4">📌 {current.source}</p>
            )}

            <div className="mb-6">
              <p className="text-5xl font-bold text-white mb-3">{current.word}</p>
              {current.reading && state === 'revealed' && (
                <p className="text-purple-400 text-xl">【{current.reading}】</p>
              )}
            </div>

            {state === 'reviewing' ? (
              <button
                onClick={revealCard}
                className="btn-secondary px-8 py-3 text-base"
              >
                👁 顯示意思
              </button>
            ) : (
              <div className="w-full">
                <div className="rounded-lg p-4 mb-6" style={{ background: '#0d0d1a', border: '1px solid #2d2d4e' }}>
                  <p className="text-white text-xl">{current.meaning}</p>
                </div>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => handleAnswer(false)}
                    disabled={submitting}
                    className="flex-1 max-w-[180px] py-3 px-6 rounded-lg font-medium transition-all"
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#f87171',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                    }}
                  >
                    🔄 再複習
                  </button>
                  <button
                    onClick={() => handleAnswer(true)}
                    disabled={submitting}
                    className="flex-1 max-w-[180px] py-3 px-6 rounded-lg font-medium transition-all"
                    style={{
                      background: 'rgba(34, 197, 94, 0.1)',
                      color: '#4ade80',
                      border: '1px solid rgba(34, 197, 94, 0.4)',
                    }}
                  >
                    ✓ 記住了
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Done State */}
      {state === 'done' && (
        <div className="anime-card p-8 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-white mb-2">本次複習完成！</h2>
          <div className="flex justify-center gap-8 my-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-400">{stats.remembered}</p>
              <p className="text-gray-400 text-sm">記住了</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-400">{stats.again}</p>
              <p className="text-gray-400 text-sm">需再複習</p>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setState('idle');
                fetchVocabulary();
              }}
              className="btn-primary px-5 py-2"
            >
              再複習一次
            </button>
            <Link href="/vocabulary" className="btn-secondary px-5 py-2">
              📖 查看生字本
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
