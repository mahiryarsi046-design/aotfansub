export async function uploadToCloudinary(file) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
  
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
  
      const data = await response.json();
      if (data.secure_url) {
        return data.secure_url; // Kalıcı bulut linkini döndürür!
      } else {
        throw new Error(data.error?.message || 'Yükleme başarısız oldu.');
      }
    } catch (error) {
      console.error('Cloudinary yükleme hatası:', error);
      alert('Dosya yüklenirken hata oluştu: ' + error.message);
      return null;
    }
  }