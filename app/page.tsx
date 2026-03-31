import Link from 'next/link';

const features = [
  {
    href: '/lyrics',
    icon: '🎵',
    title: '歌詞分析',
    subtitle: 'Lyric Analyzer',
    description: '貼上J-POP歌詞，AI幫你加上假名注音、單字解釋和文法說明',
    color: 'from-purple-600/20 to-pink-600/20',
    border: 'hover:border-purple-500',
  },
  {
    href: '/vocabulary',
    icon: '📖',
    title: '生字本',
    subtitle: 'Vocabulary Book',
    description: '儲存學到的單字，方便複習，記錄單字來源（哪首歌/哪個Vtuber）',
    color: 'from-blue-600/20 to-purple-600/20',
    border: 'hover:border-blue-500',
  },
  {
    href: '/review',
    icon: '🎴',
    title: '單字複習',
    subtitle: 'Flashcard Review',
    description: '利用間隔重複（SRS）系統複習單字，記住了還是要再複習？',
    color: 'from-green-600/20 to-blue-600/20',
    border: 'hover:border-green-500',
  },
  {
    href: '/phrases',
    icon: '💬',
    title: '常用句',
    subtitle: 'Anime & Vtuber Phrases',
    description: 'Vtuber直播用語、動漫常見句、日常會話一覽，學地道日文表達',
    color: 'from-pink-600/20 to-red-600/20',
    border: 'hover:border-pink-500',
  },
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="text-6xl mb-4">🌸</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
          Nihongo with Otaku Culture
        </h1>
        <p className="text-xl text-gray-400 mb-2">透過動漫、Vtuber和J-POP學日文</p>
        <p className="text-gray-500">Learn Japanese through things you love</p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {features.map((feature) => (
          <Link
            key={feature.href}
            href={feature.href}
            className={`anime-card p-6 block transition-all ${feature.border}`}
          >
            <div className={`rounded-xl bg-gradient-to-br ${feature.color} p-4 mb-4 inline-block`}>
              <span className="text-3xl">{feature.icon}</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{feature.title}</h2>
            <p className="text-purple-400 text-sm mb-2">{feature.subtitle}</p>
            <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
          </Link>
        ))}
      </div>

      {/* Info Banner */}
      <div className="anime-card p-6 text-center">
        <p className="text-gray-400 text-sm">
          🎌 適合初學者・以繁體中文說明・結合流行文化 ✨
        </p>
        <p className="text-gray-600 text-xs mt-1">
          Beginner-friendly · Traditional Chinese explanations · Pop culture focused
        </p>
      </div>
    </div>
  );
}
