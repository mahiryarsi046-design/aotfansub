import { getTopAnime, getTopManga } from '@/lib/api';
import Header from '@/components/Header';
import AnimeCard from '@/components/AnimeCard';

export default async function Home() {
  const topAnime = await getTopAnime();
  const topManga = await getTopManga();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Trend Animeler */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2 h-6 bg-rose-500 rounded-full inline-block"></span>
              Trend Animeler
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {topAnime.map((anime) => (
              <AnimeCard key={anime.mal_id} item={anime} type="anime" />
            ))}
          </div>
        </section>

        {/* Popüler Mangalar & Webtoonlar */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2 h-6 bg-indigo-500 rounded-full inline-block"></span>
              Popüler Manga & Webtoon
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
  );
}