export function getSavedContent() {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('aot_content');
    return data ? JSON.parse(data) : [];
  }
  
  export function saveContent(newItem) {
    if (typeof window === 'undefined') return;
    const current = getSavedContent();
    const updated = [newItem, ...current];
    localStorage.setItem('aot_content', JSON.stringify(updated));
  }
  
  export function deleteContent(id) {
    if (typeof window === 'undefined') return;
    const current = getSavedContent();
    const updated = current.filter(item => item.id !== id);
    localStorage.setItem('aot_content', JSON.stringify(updated));
    return updated;
  }
  
  export function getCustomCategories() {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('aot_custom_categories');
    return data ? JSON.parse(data) : ['Aksiyon', 'Romantik', 'Fantastik', 'Macera', 'Dram', 'Komedi', 'Korku / Gerilim', 'Bilim Kurgu', 'Hentai / 18+'];
  }
  
  export function addCustomCategory(newCategory) {
    if (typeof window === 'undefined') return [];
    const current = getCustomCategories();
    if (!current.includes(newCategory)) {
      const updated = [...current, newCategory];
      localStorage.setItem('aot_custom_categories', JSON.stringify(updated));
      return updated;
    }
    return current;
  }
  
  export function deleteCustomCategory(categoryName) {
    if (typeof window === 'undefined') return [];
    const current = getCustomCategories();
    const updated = current.filter(c => c !== categoryName);
    localStorage.setItem('aot_custom_categories', JSON.stringify(updated));
    return updated;
  }
  
  export function updateContentLikes(id) {
    if (typeof window === 'undefined') return;
    const current = getSavedContent();
    const updated = current.map(item => {
      if (item.id === id) {
        return { ...item, likes: (item.likes || 0) + 1 };
      }
      return item;
    });
    localStorage.setItem('aot_content', JSON.stringify(updated));
    return updated;
  }
  
  export function addCommentToContent(id, commentText, username = 'Misafir') {
    if (typeof window === 'undefined') return;
    const current = getSavedContent();
    const updated = current.map(item => {
      if (item.id === id) {
        const newComment = { id: Date.now(), user: username, text: commentText, date: new Date().toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'}) };
        return { ...item, comments: [...(item.comments || []), newComment] };
      }
      return item;
    });
    localStorage.setItem('aot_content', JSON.stringify(updated));
    return updated;
  }
  
  // Zaman sınırı kontrolü (Belirlenen tarih ve saat gelmediyse kilitli sayılır)
  export function isContentUnlocked(item) {
    if (!item.releaseDateTime) return true;
    return new Date().getTime() >= new Date(item.releaseDateTime).getTime();
  }
  // Kullanıcı oturum yönetimi için eklenen fonksiyonlar
export function getCurrentUser() {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('aot_current_user');
    return user ? JSON.parse(user) : null;
  }
  
  export function setCurrentUser(user) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('aot_current_user', JSON.stringify(user));
  }
  
  export function logoutUser() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('aot_current_user');
  }
  // Topluluk mesajları yönetimi için fonksiyonlar
export function getCommunityMessages() {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('aot_community_messages');
    return data ? JSON.parse(data) : [];
  }
  
  export function addCommunityMessage(messageText, user) {
    if (typeof window === 'undefined') return [];
    const current = getCommunityMessages();
    const newMessage = {
      id: Date.now().toString(),
      text: messageText,
      user: user || { name: 'Misafir', role: 'Üye' },
      date: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };
    const updated = [newMessage, ...current];
    localStorage.setItem('aot_community_messages', JSON.stringify(updated));
    return updated;
  }