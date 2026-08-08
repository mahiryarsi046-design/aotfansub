'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { getSavedContent, saveContent, deleteContent, getCustomCategories, addCustomCategory, deleteCustomCategory } from '@/lib/store';
import JSZip from 'jszip';
import { Lock, Trash2, PlusCircle, List, FolderPlus, X, Image as ImageIcon, Clock } from 'lucide-react';

import { uploadToCloudinary } from '@/lib/cloudinary';

// Admin panelindeki form gönderme veya dosya seçme fonksiyonunun içinde:
async function handleFileupload(e) {
  const file = e.target.files[0];
  if (!file) return;

  // Yükleniyor efekti verebilirsin
  console.log("Dosya buluta yükleniyor...");

  const cloudinaryUrl = await uploadToCloudinary(file);
  
  if (cloudinaryUrl) {
    console.log("Kalıcı Link:", cloudinaryUrl);
    // Artık bu linki veritabanına veya localStorage yerine kalıcı olarak kaydedebilirsin!
    // Örnek: setCoverImage(cloudinaryUrl);
  }
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('add');

  const [contents, setContents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategoryInput, setNewCategoryInput] = useState('');

  const ADMIN_SECRET = 'aotfansub2026'; 

  useEffect(() => {
    const auth = sessionStorage.getItem('aot_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      setContents(getSavedContent());
      setCategories(getCustomCategories());
    }
    setIsCheckingAuth(false);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_SECRET) {
      sessionStorage.setItem('aot_admin_auth', 'true');
      setIsAuthenticated(true);
      setContents(getSavedContent());
      setCategories(getCustomCategories());
      setAuthError('');
    } else {
      setAuthError('Hatalı şifre!');
    }
  };

  const [contentType, setContentType] = useState('anime'); 
  const [title, setTitle] = useState('');
  const [season, setSeason] = useState('Sezon 1');
  const [episodeNumber, setEpisodeNumber] = useState('');
  const [category, setCategory] = useState('Aksiyon');
  const [author, setAuthor] = useState('');
  const [illustrator, setIllustrator] = useState('');
  
  // Tarih ve Saat Sınırı
  const nowLocal = new Date();
  nowLocal.setMinutes(nowLocal.getMinutes() - nowLocal.getTimezoneOffset());
  const [releaseDateTime, setReleaseDateTime] = useState(nowLocal.toISOString().slice(0, 16));
  
  const [file, setFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Hızlı Bölüm Ekleme Modu (Aynı serinin altına yeni bölüm eklemek için)
  const handleQuickAddEpisode = (existingItem) => {
    setTitle(existingItem.title);
    setContentType(existingItem.type);
    setSeason(existingItem.season || 'Sezon 1');
    setCategory(existingItem.category || categories[0]);
    setAuthor(existingItem.author || '');
    setIllustrator(existingItem.illustrator || '');
    if (existingItem.coverUrl) {
      // Kapak URL'sini mevcut veriden koruyoruz
    }
    setActiveTab('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMessage(`"${existingItem.title}" için yeni bölüm ekleme modu açıldı. Lütfen bölüm adını ve dosyasını seçin.`);
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryInput.trim()) return;
    const updatedCategories = addCustomCategory(newCategoryInput.trim());
    setCategories(updatedCategories);
    setNewCategoryInput('');
    setMessage(`"${newCategoryInput}" kategorisi başarıyla eklendi!`);
  };

  const handleDeleteCategory = (catName) => {
    if (confirm(`"${catName}" kategorisini silmek istediğinize emin misiniz?`)) {
      const updated = deleteCustomCategory(catName);
      setCategories(updated);
      if (category === catName && updated.length > 0) {
        setCategory(updated[0]);
      }
      setMessage(`"${catName}" kategorisi silindi.`);
    }
  };

  const handleDelete = (id) => {
    if (confirm('Bu içeriği kalıcı olarak silmek istediğinize emin misiniz?')) {
      const updated = deleteContent(id);
      setContents(updated);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title || !episodeNumber) {
      setMessage('Lütfen zorunlu alanları (Başlık, Bölüm, Ana Dosya) doldurun.');
      return;
    }

    setLoading(true);
    setMessage('İşleniyor...');

    try {
      let coverUrl = '';
      if (coverFile) {
        coverUrl = URL.createObjectURL(coverFile);
      } else {
        // Eğer hızlı eklemeden gelindiyse ve önceden kapak varsa onu bulup koruyabiliriz
        const existingSameTitle = contents.find(c => c.title.toLowerCase() === title.toLowerCase() && c.coverUrl);
        if (existingSameTitle) coverUrl = existingSameTitle.coverUrl;
      }

      const newItem = {
        id: Date.now().toString(),
        type: contentType,
        title,
        season,
        episodeNumber,
        category,
        author: author || 'Bilinmiyor',
        illustrator: illustrator || 'Bilinmiyor',
        fileUrl: '',
        fileName: file.name,
        coverUrl,
        mangaImages: [],
        likes: 0,
        comments: [],
        releaseDateTime, // Zaman sınırı
        date: new Date(releaseDateTime).toLocaleDateString('tr-TR')
      };

      if (contentType === 'manga') {
        const zip = new JSZip();
        const zipContent = await zip.loadAsync(file);
        let mangaImages = [];

        const fileKeys = Object.keys(zipContent.files).filter(filename => {
          const lowerName = filename.toLowerCase();
          return (
            !zipContent.files[filename].dir &&
            !filename.startsWith('__MACOSX') &&
            !filename.includes('/.') &&
            (lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg') || lowerName.endsWith('.png') || lowerName.endsWith('.webp'))
          );
        });

        fileKeys.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

        for (const filename of fileKeys) {
          const imgBlob = await zipContent.files[filename].async('blob');
          mangaImages.push(URL.createObjectURL(imgBlob));
        }

        if (mangaImages.length === 0) {
          setMessage('Hata: ZIP içinde geçerli görsel bulunamadı!');
          setLoading(false);
          return;
        }
        newItem.mangaImages = mangaImages;
      } else {
        newItem.fileUrl = URL.createObjectURL(file);
      }

      saveContent(newItem);
      setContents(getSavedContent());

      setLoading(false);
      setMessage('Başarıyla yayınlandı!');
      setTitle('');
      setEpisodeNumber('');
      setFile(null);
      setCoverFile(null);
    } catch (err) {
      console.error(err);
      setMessage('Hata oluştu.');
      setLoading(false);
    }
  };

  if (isCheckingAuth) return null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center px-4">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full shadow-2xl">
            <h1 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Lock size={20} /> Admin Girişi</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Şifre"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-rose-500"
                required
              />
              {authError && <div className="text-red-400 text-xs">{authError}</div>}
              <button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl transition">Giriş Yap</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-100 flex flex-col relative overflow-hidden bg-slate-950 bg-[url('/aot-bg.jpg')] bg-cover bg-center bg-fixed">
      <div className="absolute inset-0 bg-slate-950/85 -z-10" />
      
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-10 w-full space-y-6">
        <div className="flex justify-between items-center bg-slate-900/90 backdrop-blur border border-slate-800 p-6 rounded-2xl">
          <h1 className="text-2xl font-black text-white">Admin Yönetim Paneli</h1>
          <button onClick={() => { sessionStorage.removeItem('aot_admin_auth'); setIsAuthenticated(false); }} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-lg">Çıkış Yap</button>
        </div>

        {/* Sekmeler */}
        <div className="flex gap-4 border-b border-slate-800 pb-4">
          <button
            onClick={() => setActiveTab('add')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition ${activeTab === 'add' ? 'bg-rose-600 text-white shadow' : 'bg-slate-900/80 text-slate-400 hover:text-white'}`}
          >
            <PlusCircle size={16} /> Seri / Bölüm Ekle
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition ${activeTab === 'list' ? 'bg-rose-600 text-white shadow' : 'bg-slate-900/80 text-slate-400 hover:text-white'}`}
          >
            <List size={16} /> Tüm Serileri Yönet ({contents.length})
          </button>
        </div>

        {activeTab === 'add' ? (
          <div className="space-y-6">
            {/* Kategori Yönetimi */}
            <div className="bg-slate-900/90 backdrop-blur border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FolderPlus size={18} className="text-rose-500" /> Kategori Yönetimi
              </h2>
              <form onSubmit={handleAddCategory} className="flex gap-3">
                <input
                  type="text"
                  value={newCategoryInput}
                  onChange={(e) => setNewCategoryInput(e.target.value)}
                  placeholder="Yeni Kategori Adı"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rose-500"
                />
                <button type="submit" className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition border border-slate-700">
                  Ekle
                </button>
              </form>
              <div className="flex flex-wrap gap-2 pt-2">
                {categories.map((cat, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300">
                    <span>{cat}</span>
                    <button type="button" onClick={() => handleDeleteCategory(cat)} className="text-slate-500 hover:text-red-400 transition ml-1">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* İçerik Ekleme Formu */}
            <div className="bg-slate-900/90 backdrop-blur border border-slate-800 rounded-2xl p-8">
              <div className="flex gap-4 mb-6">
                <button type="button" onClick={() => setContentType('anime')} className={`flex-1 py-3 rounded-xl font-bold transition ${contentType === 'anime' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'}`}>🎬 Anime Video</button>
                <button type="button" onClick={() => setContentType('manga')} className={`flex-1 py-3 rounded-xl font-bold transition ${contentType === 'manga' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'}`}>📚 Manga ZIP</button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Seri Başlığı</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Örn: Attack on Titan" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500" required />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Sezon / Kısım</label>
                    <input type="text" value={season} onChange={(e) => setSeason(e.target.value)} placeholder="Örn: Sezon 1" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Bölüm</label>
                    <input type="text" value={episodeNumber} onChange={(e) => setEpisodeNumber(e.target.value)} placeholder="Örn: Bölüm 2" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Kategori</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500">
                      {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Yazar</label>
                    <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Örn: Hajime Isayama" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Çizer</label>
                    <input type="text" value={illustrator} onChange={(e) => setIllustrator(e.target.value)} placeholder="Örn: Wit Studio" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-1.5"><Clock size={16} className="text-rose-500" /> Yayınlanma Tarih & Saat Sınırı</label>
                    <input type="datetime-local" value={releaseDateTime} onChange={(e) => setReleaseDateTime(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 text-xs" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-1.5"><ImageIcon size={16} /> Kapak / Poster Fotoğrafı</label>
                    <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files[0])} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:bg-rose-600 file:text-white cursor-pointer text-xs" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Ana Dosya ({contentType === 'manga' ? 'ZIP' : 'Video'})</label>
                    <input type="file" accept={contentType === 'manga' ? '.zip' : 'video/*'} onChange={(e) => setFile(e.target.files[0])} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:bg-rose-600 file:text-white cursor-pointer text-xs" required />
                  </div>
                </div>

                {message && <div className="p-4 rounded-xl text-sm bg-slate-950 border border-slate-800 text-rose-400">{message}</div>}
                
                <button type="submit" disabled={loading} className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-xl shadow-lg transition">{loading ? 'Yükleniyor...' : 'Yayınla'}</button>
              </form>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {contents.length > 0 ? (
              contents.map((item) => (
                <div key={item.id} className="bg-slate-900/90 backdrop-blur border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {item.coverUrl ? (
                      <img src={item.coverUrl} alt="" className="w-12 h-16 object-cover rounded-lg border border-slate-800" />
                    ) : (
                      <div className="w-12 h-16 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center text-slate-700 text-xs">Yok</div>
                    )}
                    <div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-900">{item.type.toUpperCase()} • {item.category}</span>
                      <h3 className="text-base font-bold text-white mt-1">{item.title} - {item.season} {item.episodeNumber}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Yayın Zamanı: {item.releaseDateTime ? item.releaseDateTime.replace('T', ' ') : item.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button onClick={() => handleQuickAddEpisode(item)} className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl transition text-xs font-bold flex items-center gap-1">
                      <PlusCircle size={14} /> Bölüm Ekle
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-900 p-2.5 rounded-xl transition flex items-center gap-1 text-xs font-bold">
                      <Trash2 size={16} /> Sil
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 text-slate-500">Sistemde kayıtlı seri bulunmuyor.</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}