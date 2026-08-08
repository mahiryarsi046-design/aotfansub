import Link from 'next/link';
import { Search, Tv, BookOpen, Compass } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-black tracking-wider text-rose-500 hover:opacity-90 transition">
          AOT<span className="text-white">FANSUB</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 font-medium text-slate-300">
          <Link href="/" className="hover:text-rose-500 transition flex items-center gap-2">
            <Compass size={18} /> Keşfet
          </Link>
          <Link href="/anime" className="hover:text-rose-500 transition flex items-center gap-2">
            <Tv size={18} /> Animeler
          </Link>
          <Link href="/manga" className="hover:text-rose-500 transition flex items-center gap-2">
            <BookOpen size={18} /> Mangalar & Webtoon
          </Link>
        </nav>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-xs">
          <input
            type="text"
            placeholder="Anime, manga veya webtoon ara..."
            className="w-full bg-slate-900 border border-slate-800 rounded-full py-1.5 pl-9 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition"
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        </div>
      </div>
    </header>
  );
}