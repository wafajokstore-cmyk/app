import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    home: 'Home',
    trending: 'Trending',
    watchLater: 'Watch Later',
    likedVideos: 'Liked Videos',
    autoplay: 'Autoplay',
    allCategories: 'All Categories',
    search: 'Search videos...',
    views: 'views',
    episode: 'Episode',
    category: 'Category',
    description: 'Description',
    noVideos: 'No videos found',
    loading: 'Loading...',
    previous: 'Previous',
    next: 'Next',
    upNext: 'Up Next',
    autoplayEnabled: 'Autoplay Enabled',
    autoplayDisabled: 'Autoplay Disabled',
    followUs: 'Follow ShinDoraNesub',
    supportUs: 'Support Us',
    aboutUs: 'About Us',
    disclaimer: 'Disclaimer',
    privacy: 'Privacy Policy',
    terms: 'Terms & Conditions',
    admin: 'Admin Panel',
    login: 'Login',
    password: 'Password',
    logout: 'Logout',
    addVideo: 'Add Video',
    editVideo: 'Edit Video',
    deleteVideo: 'Delete Video',
    addCategory: 'Add Category',
    title: 'Title',
    embedUrl: 'Embed URL',
    thumbnail: 'Thumbnail',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    themeSettings: 'Theme Settings',
    primaryColor: 'Primary Color',
    darkBackground: 'Dark Background',
    lightBackground: 'Light Background',
    textColor: 'Text Color',
    resetToDefault: 'Reset to Default',
    uploadLogo: 'Upload Logo',
    manageCategories: 'Manage Categories',
    manageVideos: 'Manage Videos',
    categoryName: 'Category Name',
    categorySlug: 'Category Slug'
  },
  id: {
    home: 'Beranda',
    trending: 'Trending',
    watchLater: 'Tonton Nanti',
    likedVideos: 'Video Disukai',
    autoplay: 'Putar Otomatis',
    allCategories: 'Semua Kategori',
    search: 'Cari video...',
    views: 'tayangan',
    episode: 'Episode',
    category: 'Kategori',
    description: 'Deskripsi',
    noVideos: 'Tidak ada video',
    loading: 'Memuat...',
    previous: 'Sebelumnya',
    next: 'Selanjutnya',
    upNext: 'Selanjutnya',
    autoplayEnabled: 'Putar Otomatis Aktif',
    autoplayDisabled: 'Putar Otomatis Nonaktif',
    followUs: 'Ikuti ShinDoraNesub',
    supportUs: 'Dukung Kami',
    aboutUs: 'Tentang Kami',
    disclaimer: 'Penafian',
    privacy: 'Kebijakan Privasi',
    terms: 'Syarat & Ketentuan',
    admin: 'Panel Admin',
    login: 'Masuk',
    password: 'Kata Sandi',
    logout: 'Keluar',
    addVideo: 'Tambah Video',
    editVideo: 'Edit Video',
    deleteVideo: 'Hapus Video',
    addCategory: 'Tambah Kategori',
    title: 'Judul',
    embedUrl: 'URL Embed',
    thumbnail: 'Thumbnail',
    save: 'Simpan',
    cancel: 'Batal',
    delete: 'Hapus',
    edit: 'Edit',
    themeSettings: 'Pengaturan Tema',
    primaryColor: 'Warna Utama',
    darkBackground: 'Latar Gelap',
    lightBackground: 'Latar Terang',
    textColor: 'Warna Teks',
    resetToDefault: 'Reset ke Default',
    uploadLogo: 'Upload Logo',
    manageCategories: 'Kelola Kategori',
    manageVideos: 'Kelola Video',
    categoryName: 'Nama Kategori',
    categorySlug: 'Slug Kategori'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'id';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'id' : 'en');
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};