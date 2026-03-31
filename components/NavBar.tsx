'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: '首頁', icon: '🏠' },
  { href: '/lyrics', label: '歌詞分析', icon: '🎵' },
  { href: '/vocabulary', label: '生字本', icon: '📖' },
  { href: '/review', label: '複習', icon: '🎴' },
  { href: '/phrases', label: '常用句', icon: '💬' },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav style={{ background: '#1a1a2e', borderBottom: '1px solid #2d2d4e' }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌸</span>
            <span className="font-bold text-lg" style={{
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Nihongo with Otaku
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: isActive ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                    color: isActive ? '#c084fc' : '#9898c0',
                    border: isActive ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid transparent',
                  }}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
