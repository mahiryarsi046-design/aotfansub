'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { getSavedContent, getCustomCategories } from '@/lib/store';
import { Heart, MessageSquare, BookOpen, Play, Search, Compass, Flame } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [contents, setContents] = useState([]);
  const [categories, setCategories] = useState(['Tümü']);
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all'); // all, anime, manga

  useEffect(() => {
    setContents(getSavedContent());
    const customCats = getCustomCategories();
    setCategories(['Tümü', ...customCats]);
  }, []);

  const filteredContents = contents.filter(item => {
    const matchesCategory = selectedCategory === 'Tümü' || item.category === selectedCategory;
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.author && item.author.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen text-slate-100 flex flex-col relative overflow-hidden bg-slate-950 bg-[url('/aot-bg.jpg')] bg-cover bg-center bg-fixed">
      {/* Arka planın okunabilirliği için koyu katman */}
      <div className="absolute inset-0 bg-slate-950/85 -z-10" />
      
      {/* Üst Kısım / Navbar */}
      <Header />

      {/* Ana İçerik */}
      <main className="max-w-6xl mx-auto px-4 py-10 w-full space-y-8 flex-grow">
        
        {/* Karşılama ve Arama Alanı */}
        <div className="bg-slate-900/90 backdrop-blur border border-slate-800 p-6 sm:p-10 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl font-black text-white flex items-center justify-center md:justify-start gap-3">
              <Flame className="text-rose-500" size={32} /> AOT Fansub Keşfet
            </h1>
            <p className="text-sm text-slate-400">En güncel anime ve manga çevirilerini keşfet, oku ve izle.</p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Seri veya yazar ara..."
              className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500 transition"
            />
          </div>
        </div>

        {/* Filtre Butonları (Tür ve Kategori) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 backdrop-blur border border-slate-800/80 p-4 rounded-2xl">
          {/* Tür Seçimi */}
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setSelectedType('all')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition ${selectedType === 'all' ? 'bg-rose-600 text-white shadow' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'}`}
            >
              Tümü
            </button>
            <button
              onClick={() => setSelectedType('anime')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition ${selectedType === 'anime' ? 'bg-rose-600 text-white shadow' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'}`}
            >
              Animeler
            </button>
            <button
              onClick={() => setSelectedType('manga')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition ${selectedType === 'manga' ? 'bg-rose-600 text-white shadow' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'}`}
            >
              Mangalar
            </button>
          </div>

          {/* Kategori Yatay Kaydırma */}
          <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${selectedCategory === cat ? 'bg-rose-600 text-white shadow' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* İçerik Grid Listesi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredContents.length > 0 ? (
            filteredContents.map((item) => {
              const targetUrl = item.type === 'manga' ? `/read/${item.id}` : `/watch/${item.id}`;
              return (
                <Link 
                  href={targetUrl} 
                  key={item.id} 
                  className="bg-slate-900/90 backdrop-blur border border-slate-800 rounded-2xl overflow-hidden hover:border-rose-500 transition group block shadow-xl"
                >
                  {/* Kapak / Poster Alanı */}
                  <div className="aspect-video bg-slate-950 flex items-center justify-center relative overflow-hidden">
                    {item.coverUrl ? (
                      <img 
                        src={item.coverUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-600 gap-1">
                        {item.type === 'manga' ? <BookOpen size={32} /> : <Play size={32} />}
                        <span className="text-[10px]">Kapak Yok</span>
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur border border-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-lg text-rose-400 shadow">
                      {item.category}
                    </span>
                    <span className="absolute top-3 right-3 bg-rose-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {item.type}
                    </span>
                  </div>

                  {/* Detay Bilgileri */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-white group-hover:text-rose-400 transition truncate text-base">
                      {item.title} - {item.season} {item.episodeNumber}
                    </h3>
                    <p className="text-xs text-slate-400 truncate">
                      Yazar: <span className="text-slate-300">{item.author || 'Bilinmiyor'}</span>
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80">
                      <span className="flex items-center gap-1"><Heart size={14} className="text-rose-500" /> {item.likes || 0}</span>
                      <span className="flex items-center gap-1"><MessageSquare size={14} /> {item.comments?.length || 0}</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full text-center py-20 text-slate-500 bg-slate-900/50 rounded-2xl border border-slate-800">
              Aradığınız kriterlere uygun içerik bulunamadı.
            </div>
          )}
        </div>

      </main>
    </div>
  );
}