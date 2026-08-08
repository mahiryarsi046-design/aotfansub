'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Compass, Film, BookOpen, MessageSquare, LogOut, LogIn } from 'lucide-react';
import { getCurrentUser, logoutUser } from '@/lib/store';

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    window.location.reload();
  };

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-xl font-black tracking-wider text-white">
          AOT<span className="text-rose-500">FANSUB</span>
        </Link>

        {/* Navigasyon Linkleri - Ayrı Bölümler */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href="/" className="hover:text-rose-500 transition flex items-center gap-1.5">
            <Compass size={16} /> Keşfet
          </Link>
          <Link href="/anime" className="hover:text-rose-500 transition flex items-center gap-1.5">
            <Film size={16} /> Animeler
          </Link>
          <Link href="/manga" className="hover:text-rose-500 transition flex items-center gap-1.5">
            <BookOpen size={16} /> Mangalar
          </Link>
          <Link href="/community" className="hover:text-rose-500 transition flex items-center gap-1.5">
            <MessageSquare size={16} /> Topluluk Sohbeti
          </Link>
        </nav>

        {/* Sağ Taraf: Kullanıcı ve Admin */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
              <div className="w-7 h-7 rounded-full bg-rose-600/30 text-rose-400 border border-rose-900/50 flex items-center justify-center font-bold text-xs">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-slate-200 hidden sm:inline">{user.username}</span>
              <button onClick={handleLogout} title="Çıkış Yap" className="text-slate-400 hover:text-red-400 transition ml-2">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-rose-600/20 transition-all"
            >
              <LogIn size={16} /> Giriş Yap
            </Link>
          )}

          <Link
            href="/admin"
            className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all border border-slate-800"
          >
            Admin
          </Link>
        </div>

      </div>
    </header>
  );
}