import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';

export default function AnimeCard({ item, type = 'anime' }) {
  const title = item.title_japanese || item.title;
  const image = item.images?.jpg?.large_image_url || item.images?.jpg?.image_url;

  return (
    <div className="group relative flex flex-col bg-slate-900 border border-slate-800/80 rounded-xl overflow-hidden hover:scale-[1.03] transition-all duration-300 shadow-md">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 50vw, 20vw"
          className="object-cover group-hover:opacity-90 transition-opacity"
        />
        {item.score && (
          <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 text-xs font-bold text-amber-400 border border-slate-800">
            <Star size={12} fill="currentColor" />
            {item.score}
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col justify-between flex-1">
        <h3 className="font-bold text-sm text-slate-100 line-clamp-1 group-hover:text-rose-400 transition">
          {title}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          {type === 'anime' ? `${item.episodes || '?'} Bölüm` : `${item.chapters || '?'} Bölüm`}
        </p>
      </div>
    </div>
  );
}