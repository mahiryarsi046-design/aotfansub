'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { getSavedContent, getCustomCategories } from '@/lib/store';
import { BookOpen, Heart, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function MangaPage() {
  const [contents, setContents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [categories, setCategories] = useState(['Tümü']);

  useEffect(() => {
    setContents(getSavedContent());
    const customCats = getCustomCategories();
    setCategories(['Tümü', ...customCats]);
  }, []);

  const mangaList = contents.filter(item => item.type === 'manga');
  const filteredList = selectedCategory === 'Tümü' 
    ? mangaList 
    : mangaList.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-rose-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-10 w-full space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black text-white">Mangalar</h1>
          <p className="text-sm text-slate-400">Yayınlanan tüm manga serileri ve bölümleri.</p>
        </div>

        {/* Kategori Filtreleri */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${selectedCategory === cat ? 'bg-rose-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* İçerik Listesi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredList.length > 0 ? (
            filteredList.map((item) => (
              <Link href={`/read/${item.id}`} key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-rose-500 transition group block">
                <div className="aspect-video bg-slate-950 flex items-center justify-center relative overflow-hidden">
                  {item.coverUrl ? (
                    <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  ) : (
                    <BookOpen size={40} className="text-rose-500 group-hover:scale-110 transition" />
                  )}
                  <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur border border-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-lg text-rose-400">
                    {item.category}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-white group-hover:text-rose-400 transition truncate">{item.title} - {item.season} {item.episodeNumber}</h3>
                  <p className="text-xs text-slate-400">Yazar: {item.author} | Çizer: {item.illustrator}</p>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                    <span className="flex items-center gap-1"><Heart size={14} className="text-rose-500" /> {item.likes || 0}</span>
                    <span className="flex items-center gap-1"><MessageSquare size={14} /> {item.comments?.length || 0}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-slate-500">Bu kategoride henüz manga bulunmuyor.</div>
          )}
        </div>
      </main>
    </div>
  );
}