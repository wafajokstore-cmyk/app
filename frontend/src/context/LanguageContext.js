import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const LanguageContext = createContext();

// Base translations (English as source)
const baseTranslations = {
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
  }
};

// Indonesian translations (pre-translated for better accuracy)
const idTranslations = {
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
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'id';
  });

  const [translationCache] = useState(idTranslations);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const translateText = async (text, targetLang = 'id') => {
    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.post(`${BACKEND_URL}/api/translate`, {
        text: text,
        source: 'en',
        target: targetLang
      });
      return response.data.translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Fallback to original text
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'id' : 'en');
  };

  const t = (key) => {
    if (language === 'en') {
      return baseTranslations.en[key] || key;
    }
    
    // Return cached Indonesian translation or English fallback
    return translationCache[key] || baseTranslations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, translateText }}>
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