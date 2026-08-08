'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import { getSavedContent, updateContentLikes, addCommentToContent, isContentUnlocked } from '@/lib/store';
import { Heart, MessageSquare, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function WatchPage() {
  const params = useParams();
  const [content, setContent] = useState(null);
  const [allContents, setAllContents] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const data = getSavedContent();
    setAllContents(data);
    const found = data.find(item => item.id === params.id);
    setContent(found);
  }, [params.id]);

  if (!content) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Yükleniyor...</div>;

  const unlocked = isContentUnlocked(content);

  // Aynı serinin diğer bölümlerini bulup sıralama
  const seriesEpisodes = allContents
    .filter(item => item.title.toLowerCase() === content.title.toLowerCase() && item.type === 'anime')
    .sort((a, b) => a.episodeNumber.localeCompare(b.episodeNumber, undefined, { numeric: true }));

  const currentIndex = seriesEpisodes.findIndex(item => item.id === content.id);
  const prevEpisode = currentIndex > 0 ? seriesEpisodes[currentIndex - 1] : null;
  const nextEpisode = currentIndex < seriesEpisodes.length - 1 ? seriesEpisodes[currentIndex + 1] : null;

  const handleLike = () => {
    const updated = updateContentLikes(content.id);
    const found = updated.find(item => item.id === params.id);
    setContent(found);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const updated = addCommentToContent(content.id, commentText, username.trim() || 'Misafir');
    const found = updated.find(item => item.id === params.id);
    setContent(found);
    setCommentText('');
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col relative overflow-hidden bg-slate-950 bg-[url('/aot-bg.jpg')] bg-cover bg-center bg-fixed">
      <div className="absolute inset-0 bg-slate-950/85 -z-10" />
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-10 w-full space-y-6 flex-grow">
        <div className="flex items-center justify-between bg-slate-900/90 backdrop-blur border border-slate-800 p-4 rounded-2xl">
          <div>
            <span className="text-xs font-bold text-rose-400">{content.category} • {content.season}</span>
            <h1 className="text-xl font-black text-white">{content.title} - {content.episodeNumber}</h1>
          </div>
          <div className="flex items-center gap-2">
            {prevEpisode && (
              <Link href={`/watch/${prevEpisode.id}`} className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition">
                <ChevronLeft size={16} /> Önceki
              </Link>
            )}
            {nextEpisode && (
              <Link href={`/watch/${nextEpisode.id}`} className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition">
                Sonraki <ChevronRight size={16} />
              </Link>
            )}
          </div>
        </div>

        {/* Video veya Kilit Ekranı */}
        <div className="bg-slate-900/90 backdrop-blur border border-slate-800 rounded-2xl overflow-hidden shadow-2xl aspect-video flex items-center justify-center relative">
          {unlocked ? (
            <video src={content.fileUrl} controls className="w-full h-full object-contain bg-black" />
          ) : (
            <div className="text-center p-8 space-y-3">
              <Lock size={48} className="text-rose-500 mx-auto" />
              <h2 className="text-lg font-bold text-white">Bu Bölüm Henüz Yayınlanmadı!</h2>
              <p className="text-xs text-slate-400">Belirlenen yayınlanma tarihi ve saati: {content.releaseDateTime?.replace('T', ' ')}</p>
            </div>
          )}
        </div>

        {/* Etkileşimler */}
        <div className="flex items-center justify-between bg-slate-900/90 backdrop-blur border border-slate-800 p-4 rounded-2xl">
          <div className="text-xs text-slate-300">Yazar: <span className="text-white font-bold">{content.author}</span> | Çizer: <span className="text-white font-bold">{content.illustrator}</span></div>
          <button onClick={handleLike} className="flex items-center gap-2 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-900 px-4 py-2 rounded-xl text-xs font-bold transition">
            <Heart size={16} className="text-rose-500 fill-rose-500" /> Beğen ({content.likes || 0})
          </button>
        </div>

        {/* Yorumlar Alanı */}
        <div className="bg-slate-900/90 backdrop-blur border border-slate-800 p-6 rounded-2xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2"><MessageSquare size={18} /> Yorumlar ({content.comments?.length || 0})</h3>
          <form onSubmit={handleCommentSubmit} className="space-y-3">
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="İsminiz (İsteğe bağlı)" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500" />
            <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Düşüncelerini paylaş..." rows={3} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-rose-500 resize-none" required />
            <button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition">Yorum Yap</button>
          </form>
          <div className="space-y-3 pt-4 border-t border-slate-800">
            {content.comments?.length > 0 ? (
              content.comments.map(c => (
                <div key={c.id} className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-xl space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400 font-bold">
                    <span className="text-rose-400">{c.user}</span>
                    <span>{c.date}</span>
                  </div>
                  <p className="text-xs text-slate-200">{c.text}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">İlk yorumu sen yap!</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}