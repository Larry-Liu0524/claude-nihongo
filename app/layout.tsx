import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Nihongo with Otaku Culture",
  description: "Learn Japanese through anime, Vtubers, and J-POP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full flex flex-col" style={{ background: '#0d0d1a', color: '#e8e8ff' }}>
        <NavBar />
        <main className="flex-1">
          {children}
        </main>
        <footer className="text-center py-4 text-sm" style={{ color: '#6b6b9a', borderTop: '1px solid #2d2d4e' }}>
          Nihongo with Otaku Culture — 日本語を楽しく学ぼう ✨
        </footer>
      </body>
    </html>
  );
}
