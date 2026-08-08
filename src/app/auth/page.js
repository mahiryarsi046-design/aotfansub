'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { setCurrentUser } from '@/lib/store';
import { User, Lock, ArrowRight } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }

    // Basit yerel kullanıcı veritabanı simülasyonu
    const users = JSON.parse(localStorage.getItem('aot_users') || '[]');

    if (isLogin) {
      const found = users.find(u => u.username === username && u.password === password);
      if (found) {
        setCurrentUser(found);
        router.push('/');
      } else {
        setError('Kullanıcı adı veya şifre hatalı!');
      }
    } else {
      const exists = users.find(u => u.username === username);
      if (exists) {
        setError('Bu kullanıcı adı zaten alınmış!');
        return;
      }
      const newUser = { username, password };
      users.push(newUser);
      localStorage.setItem('aot_users', JSON.stringify(users));
      setCurrentUser(newUser);
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-2xl max-w-md w-full shadow-2xl backdrop-blur-md">
          <h1 className="text-2xl font-black text-white mb-2">
            {isLogin ? 'Tekrar Hoş Geldin!' : 'A Aramıza Katıl'}
          </h1>
          <p className="text-slate-400 text-sm mb-6">
            {isLogin ? 'Hesabına giriş yaparak yorum yap ve tartışmalara katıl.' : 'Hızlıca bir hesap oluştur ve topluluğumuzun bir parçası ol.'}
          </p>

          <div className="flex gap-2 mb-6 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${isLogin ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Giriş Yap
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${!isLogin ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Kayıt Ol
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Kullanıcı Adı</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Kullanıcı adınızı girin"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-rose-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Şifre</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifrenizi girin"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-rose-500"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-950/40 border border-red-900/50 text-red-200 p-3 rounded-xl text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 text-sm"
            >
              {isLogin ? 'Giriş Yap' : 'Kayıt Ol'} <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}