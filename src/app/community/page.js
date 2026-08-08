'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { getCommunityMessages, addCommunityMessage, getCurrentUser } from '@/lib/store';
import { Send, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function CommunityPage() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getCurrentUser());
    setMessages(getCommunityMessages());
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (!user) {
      alert('Sohbet etmek için giriş yapmalısınız!');
      return;
    }

    const updated = addCommunityMessage(user.username, text);
    setMessages(updated);
    setText('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header />

      <main className="flex-grow max-w-4xl mx-auto px-4 py-8 w-full flex flex-col">
        <div className="bg-slate-900/80 border border-rose-900/40 rounded-2xl p-6 mb-6 shadow-xl backdrop-blur-md flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <MessageSquare className="text-rose-500" /> Topluluk Sohbet Odası
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm">Manialar, animeler ve teoriler hakkında diğer izleyicilerle sohbet et.</p>
          </div>
        </div>

        {/* Sohbet Akışı */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex-grow flex flex-col justify-between backdrop-blur-md min-h-[450px]">
          <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 mb-4">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div key={msg.id} className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-rose-500 text-sm">{msg.user}</span>
                    <span className="text-[10px] text-slate-500">{msg.date}</span>
                  </div>
                  <p className="text-slate-300 text-sm">{msg.text}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-20 text-slate-500 text-sm">
                Henüz mesaj yazılmamış. İlk mesajı sen gönder!
              </div>
            )}
          </div>

          {/* Mesaj Gönderme Formu */}
          {user ? (
            <form onSubmit={handleSend} className="flex gap-2 pt-4 border-t border-slate-800">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Mesajınızı yazın..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-rose-500"
                required
              />
              <button
                type="submit"
                className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-rose-600/30 text-sm"
              >
                <Send size={16} /> Gönder
              </button>
            </form>
          ) : (
            <div className="text-center py-4 bg-slate-950/80 border border-slate-800 rounded-xl">
              <p className="text-xs text-slate-400 mb-2">Sohbete katılmak ve mesaj göndermek için giriş yapmalısınız.</p>
              <Link href="/auth" className="inline-block bg-rose-600 text-white font-bold px-4 py-2 rounded-lg text-xs hover:bg-rose-700 transition">
                Giriş Yap / Kayıt Ol
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}