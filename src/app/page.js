import Header from '@/components/Header';

export default async function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* İstediğin AoT Arka Plan Görseli ve Karartma Katmanı */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed z-0"
        style={{ 
          backgroundImage: `url('/aot-bg.jpg')` 
        }}
      >
        {/* Yazıların net okunması için koyu şeffaf tül katmanı */}
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        {/* İçerik Alanı */}
        <main className="flex-grow max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
          <div className="bg-slate-900/60 border border-rose-900/40 rounded-2xl p-10 shadow-2xl backdrop-blur-md max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-black tracking-wider text-white mb-4">
              AOT<span className="text-rose-500">FANSUB</span>
            </h1>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              Duvarların ötesindeki gerçeği arayanlar için özel çeviriler ve projeler çok yakında burada!
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}