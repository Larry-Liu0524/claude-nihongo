'use client';

import { useState } from 'react';

interface Phrase {
  japanese: string;
  reading: string;
  meaning: string;
  example?: string;
}

interface Category {
  id: string;
  label: string;
  icon: string;
  phrases: Phrase[];
}

const categories: Category[] = [
  {
    id: 'vtuber',
    label: 'Vtuber直播用語',
    icon: '📺',
    phrases: [
      { japanese: 'おはよう / おはようございます', reading: 'ohayou / ohayou gozaimasu', meaning: '早安', example: '配信開始時常用：おはようございます！' },
      { japanese: 'お疲れ様', reading: 'otsukaresama', meaning: '辛苦了', example: '看完直播說：お疲れ様でした！' },
      { japanese: 'ありがとう / ありがとうございます', reading: 'arigatou / arigatou gozaimasu', meaning: '謝謝', example: '收到超級留言時：ありがとうございます！' },
      { japanese: 'かわいい', reading: 'kawaii', meaning: '可愛', example: '看到可愛的東西：かわいい！！' },
      { japanese: 'すごい', reading: 'sugoi', meaning: '厲害/太棒了', example: '看到精彩的遊戲操作：すごい！' },
      { japanese: 'やばい', reading: 'yabai', meaning: '不得了（可好可壞）', example: '驚訝時：やばい！！什麼情況' },
      { japanese: 'なるほど', reading: 'naruhodo', meaning: '原來如此', example: '理解某件事時：なるほど、そういうことか' },
      { japanese: 'ちょっと待って', reading: 'chotto matte', meaning: '等一下', example: '需要暫停時：ちょっと待って！' },
      { japanese: '草', reading: 'kusa', meaning: 'XD / 哈哈（網路用語）', example: '看到好笑的東西：草www' },
      { japanese: '草生える', reading: 'kusa haeru', meaning: '笑死', example: '非常好笑時：草生えるwww' },
      { japanese: '配信', reading: 'haishin', meaning: '直播', example: '今日の配信、楽しかった！' },
      { japanese: '切り抜き', reading: 'kirinuki', meaning: '剪輯片段', example: '配信の切り抜きを見た' },
      { japanese: 'メンバーシップ', reading: 'menbāshippu', meaning: '會員訂閱', example: 'メンバーシップに入りました！' },
      { japanese: 'スパチャ', reading: 'supacha', meaning: 'SuperChat 超級留言', example: 'スパチャありがとうございます！' },
    ],
  },
  {
    id: 'anime',
    label: '動漫常見句',
    icon: '⚔️',
    phrases: [
      { japanese: '俺は絶対諦めない', reading: 'ore wa zettai akiramenai', meaning: '我絕對不放棄', example: '熱血主角常說的台詞' },
      { japanese: '信じてる', reading: 'shinjiteru', meaning: '我相信你', example: '朋友之間的鼓勵：信じてるよ！' },
      { japanese: '大丈夫', reading: 'daijoubu', meaning: '沒問題/沒事', example: '受傷後說：大丈夫です！' },
      { japanese: '行くぞ', reading: 'ikuzo', meaning: '出發了/走吧', example: '戰鬥前：行くぞ！' },
      { japanese: 'うそ', reading: 'uso', meaning: '騙人的/不會吧', example: '驚訝時：うそ！本当に？' },
      { japanese: 'マジで', reading: 'maji de', meaning: '認真的？/真的嗎', example: '不敢置信時：マジで！？' },
      { japanese: '最高', reading: 'saikou', meaning: '最棒了', example: '表達最高評價：最高だ！' },
      { japanese: '頑張れ', reading: 'ganbare', meaning: '加油', example: '為朋友打氣：頑張れ！できるよ！' },
      { japanese: 'ありえない', reading: 'arienai', meaning: '不可能/難以置信', example: '看到不可思議的事：ありえない！' },
      { japanese: '仕方ない', reading: 'shikatanai', meaning: '沒辦法/無可奈何', example: '接受現實時：仕方ないな...' },
      { japanese: '何で', reading: 'nande', meaning: '為什麼', example: '困惑時：何でそんなことするの！？' },
      { japanese: 'まさか', reading: 'masaka', meaning: '沒想到/不會吧', example: '意外的轉折：まさか、お前が...' },
    ],
  },
  {
    id: 'daily',
    label: '日常會話',
    icon: '💬',
    phrases: [
      { japanese: 'よろしくお願いします', reading: 'yoroshiku onegaishimasu', meaning: '請多指教/拜託了', example: '自我介紹後：よろしくお願いします！' },
      { japanese: 'お願いします', reading: 'onegaishimasu', meaning: '請/拜託', example: '點餐時：これをお願いします' },
      { japanese: 'すみません', reading: 'sumimasen', meaning: '不好意思/對不起', example: '引起注意時：すみません！' },
      { japanese: 'ごめんなさい', reading: 'gomennasai', meaning: '對不起', example: '道歉時：ごめんなさい！' },
      { japanese: 'どういたしまして', reading: 'douitashimashite', meaning: '不客氣', example: '別人說謝謝時：どういたしまして' },
      { japanese: 'わかりました', reading: 'wakarimashita', meaning: '我明白了/好的', example: '確認理解：わかりました！' },
      { japanese: 'わかりません', reading: 'wakarimasen', meaning: '我不知道/我不懂', example: '不明白時：すみません、わかりません...' },
      { japanese: 'ちょっと', reading: 'chotto', meaning: '一點/稍微/等一下', example: '多用途：ちょっとまって！' },
      { japanese: 'いただきます', reading: 'itadakimasu', meaning: '開動了（飯前用語）', example: '吃飯前：いただきます！' },
      { japanese: 'ごちそうさまでした', reading: 'gochisousamadeshita', meaning: '我吃飽了（飯後用語）', example: '吃完飯：ごちそうさまでした！' },
      { japanese: 'お休みなさい', reading: 'oyasuminasai', meaning: '晚安', example: '睡前：お休みなさい！' },
      { japanese: 'ただいま', reading: 'tadaima', meaning: '我回來了', example: '回家時：ただいま！' },
    ],
  },
];

export default function PhrasesPage() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [addedPhrases, setAddedPhrases] = useState<Set<string>>(new Set());
  const [addingPhrase, setAddingPhrase] = useState<string | null>(null);

  const currentCategory = categories.find((c) => c.id === activeCategory)!;

  async function handleAddVocabulary(phrase: Phrase) {
    const key = phrase.japanese;
    setAddingPhrase(key);

    try {
      const res = await fetch('/api/vocabulary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: phrase.japanese,
          reading: phrase.reading,
          meaning: phrase.meaning,
          source: `from: ${currentCategory.label}`,
        }),
      });

      if (res.ok) {
        setAddedPhrases((prev) => new Set([...prev, key]));
      }
    } catch (err) {
      console.error('Add vocabulary error:', err);
    } finally {
      setAddingPhrase(null);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">💬 常用句</h1>
        <p className="text-gray-400">動漫、Vtuber直播和日常生活常見的日文表達</p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeCategory === cat.id ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
            <span className="text-xs opacity-70">({categories.find(c => c.id === cat.id)?.phrases.length})</span>
          </button>
        ))}
      </div>

      {/* Phrases Grid */}
      <div className="space-y-3">
        {currentCategory.phrases.map((phrase, i) => {
          const key = phrase.japanese;
          const isAdded = addedPhrases.has(key);
          const isAdding = addingPhrase === key;

          return (
            <div
              key={i}
              className="anime-card p-5 flex items-start justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                  <span className="text-xl font-bold text-white">{phrase.japanese}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-purple-400 text-sm">({phrase.reading})</span>
                </div>
                <p className="text-gray-200 font-medium mb-2">{phrase.meaning}</p>
                {phrase.example && (
                  <div className="flex items-start gap-2">
                    <span className="text-gray-600 text-sm flex-shrink-0">例：</span>
                    <p className="text-gray-500 text-sm italic">{phrase.example}</p>
                  </div>
                )}
              </div>
              <button
                onClick={() => handleAddVocabulary(phrase)}
                disabled={isAdded || isAdding}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isAdded
                    ? 'cursor-default'
                    : 'btn-secondary'
                }`}
                style={isAdded ? {
                  background: 'rgba(34, 197, 94, 0.1)',
                  color: '#4ade80',
                  border: '1px solid rgba(34, 197, 94, 0.4)',
                } : {}}
              >
                {isAdded ? '✓ 已加入' : isAdding ? '...' : '加入生字本'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
