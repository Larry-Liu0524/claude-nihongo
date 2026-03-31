'use client';

import { useState } from 'react';
import type { LyricAnalysisResult } from '@/app/api/analyze-lyrics/route';

interface VocabItem {
  word: string;
  reading: string;
  meaning: string;
  part_of_speech: string;
}

export default function LyricsPage() {
  const [lyrics, setLyrics] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LyricAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [addedWords, setAddedWords] = useState<Set<string>>(new Set());
  const [addingWord, setAddingWord] = useState<string | null>(null);

  async function handleAnalyze() {
    if (!lyrics.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setAddedWords(new Set());

    try {
      const res = await fetch('/api/analyze-lyrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lyrics }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '分析失敗');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '發生未知錯誤');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddVocabulary(item: VocabItem) {
    const key = item.word;
    setAddingWord(key);

    try {
      const res = await fetch('/api/vocabulary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: item.word,
          reading: item.reading,
          meaning: item.meaning,
          source: songTitle ? `from: ${songTitle}` : 'from: 歌詞分析',
        }),
      });

      if (res.ok) {
        setAddedWords((prev) => new Set([...prev, key]));
      }
    } catch (err) {
      console.error('Failed to add vocabulary:', err);
    } finally {
      setAddingWord(null);
    }
  }

  function renderAnnotatedLyrics(text: string) {
    // Split by newlines and render each line
    const lines = text.split('\n');
    return lines.map((line, i) => (
      <div
        key={i}
        className="mb-1 text-lg leading-loose"
        dangerouslySetInnerHTML={{ __html: line || '&nbsp;' }}
      />
    ));
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">🎵 歌詞分析</h1>
        <p className="text-gray-400">貼上J-POP歌詞，AI幫你加上假名注音和單字解釋</p>
      </div>

      {/* Input Section */}
      <div className="anime-card p-6 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            歌曲名稱（選填）
          </label>
          <input
            type="text"
            value={songTitle}
            onChange={(e) => setSongTitle(e.target.value)}
            placeholder="例：紅蓮華、残酷な天使のテーゼ..."
            className="w-full px-4 py-2 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            style={{ background: '#0d0d1a', border: '1px solid #2d2d4e' }}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            日文歌詞 <span className="text-red-400">*</span>
          </label>
          <textarea
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            placeholder="在這裡貼上日文歌詞..."
            rows={8}
            className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            style={{ background: '#0d0d1a', border: '1px solid #2d2d4e' }}
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading || !lyrics.trim()}
          className="btn-primary px-8 py-3 text-base"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span> AI分析中...
            </span>
          ) : (
            '✨ 開始分析'
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="anime-card p-4 mb-6 border-red-500/50" style={{ borderColor: 'rgba(239, 68, 68, 0.5)' }}>
          <p className="text-red-400">❌ {error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Annotated Lyrics */}
          <div className="anime-card p-6">
            <h2 className="text-xl font-bold text-white mb-4">📝 帶注音歌詞</h2>
            <div className="leading-loose text-gray-100 bg-black/20 rounded-lg p-4">
              {renderAnnotatedLyrics(result.annotated_lyrics)}
            </div>
          </div>

          {/* Vocabulary List */}
          <div className="anime-card p-6">
            <h2 className="text-xl font-bold text-white mb-4">📚 重要單字</h2>
            <div className="space-y-3">
              {result.vocabulary.map((item, i) => {
                const key = item.word;
                const isAdded = addedWords.has(key);
                const isAdding = addingWord === key;
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-lg"
                    style={{ background: '#0d0d1a', border: '1px solid #2d2d4e' }}
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="min-w-0">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-xl font-bold text-white">{item.word}</span>
                          <span className="text-purple-400 text-sm">【{item.reading}】</span>
                          <span className="text-gray-500 text-xs px-2 py-0.5 rounded-full"
                            style={{ background: '#1a1a2e', border: '1px solid #2d2d4e' }}>
                            {item.part_of_speech}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm">{item.meaning}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddVocabulary(item)}
                      disabled={isAdded || isAdding}
                      className={`ml-4 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                        isAdded
                          ? 'bg-green-900/30 text-green-400 border border-green-700/50 cursor-default'
                          : 'btn-secondary'
                      }`}
                    >
                      {isAdded ? '✓ 已加入' : isAdding ? '...' : '加入生字本'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grammar Notes */}
          <div className="anime-card p-6">
            <h2 className="text-xl font-bold text-white mb-4">📐 文法重點</h2>
            <div className="space-y-3">
              {result.grammar_notes.map((note, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-4 rounded-lg"
                  style={{ background: '#0d0d1a', border: '1px solid #2d2d4e' }}
                >
                  <span className="text-purple-400 font-bold text-lg flex-shrink-0">
                    {i + 1}.
                  </span>
                  <p className="text-gray-300 leading-relaxed">{note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Tips */}
          <div className="anime-card p-6" style={{ borderColor: 'rgba(168, 85, 247, 0.3)', background: 'rgba(168, 85, 247, 0.05)' }}>
            <h2 className="text-xl font-bold text-white mb-3">💡 學習建議</h2>
            <p className="text-gray-300 leading-relaxed">{result.learning_tips}</p>
          </div>
        </div>
      )}
    </div>
  );
}
