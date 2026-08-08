import { getTopAnime, getTopManga } from '@/lib/api';
import Header from '@/components/Header';
import AnimeCard from '@/components/AnimeCard';

export default async function Home() {
  const topAnime = await getTopAnime();
  const topManga = await getTopManga();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* AoT Arka Plan Görseli ve Karartma Efekti */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed opacity-20 pointer-events-none z-0"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1920&auto=format&fit=crop')` 
        }}
      ></div>

      <div className="relative z-10">
        <Header />

        {/* Hero Banner / Karşılama Alanı */}
        <div className="max-w-7xl mx-auto px-4 pt-12 pb-6">
          <div className="bg-gradient-to-r from-rose-950/60 via-slate-900/80 to-slate-950 border border-rose-900/40 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
            <h1 className="text-4xl md:text-5xl font-black tracking-wider text-white mb-3">
              AOT<span className="text-rose-500">FANSUB</span>
            </h1>
            <p className="text-slate-300 max-w-xl text-sm md:text-base">
              Duvarların ötesindeki gerçeği arayanlar için en güncel Attack on Titan bölümleri, özel çeviriler ve manga arşivleri burada!
            </p>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 pb-16 space-y-12">
          {/* AoT Animeleri */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <span className="w-2 h-6 bg-rose-500 rounded-full inline-block"></span>
                Attack on Titan Serileri
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {topAnime.map((anime) => (
                <AnimeCard key={anime.mal_id} item={anime} type="anime" />
              ))}
            </div>
          </section>

          {/* AoT Mangaları */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <span className="w-2 h-6 bg-rose-700 rounded-full inline-block"></span>
                Manga & Yan Hikayeler
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {topManga.map((manga) => (
                <AnimeCard key={manga.mal_id} item={manga} type="manga" />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}