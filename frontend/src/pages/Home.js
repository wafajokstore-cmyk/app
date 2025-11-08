import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import VideoCard from '../components/VideoCard';
import { useLanguage } from '../context/LanguageContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Home() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      searchVideos(searchQuery);
    } else {
      fetchVideos();
    }
  }, [searchQuery, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const url = selectedCategory
        ? `${API}/videos?category=${encodeURIComponent(selectedCategory)}`
        : `${API}/videos`;
      const response = await axios.get(url);
      setVideos(response.data);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchVideos = async (query) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/search?q=${encodeURIComponent(query)}`);
      setVideos(response.data);
    } catch (error) {
      console.error('Failed to search videos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category filter */}
        {!searchQuery && categories.length > 0 && (
          <div className="mb-8" data-testid="category-filter">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap smooth-transition ${
                  selectedCategory === ''
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                data-testid="category-all"
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap smooth-transition ${
                    selectedCategory === category.name
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  data-testid={`category-${category.slug}`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search results header */}
        {searchQuery && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Search results for "{searchQuery}"</h2>
          </div>
        )}

        {/* Videos grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64" data-testid="loading-spinner">
            <div className="spinner" />
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" data-testid="videos-grid">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16" data-testid="no-videos">
            <p className="text-gray-500 dark:text-gray-400 text-lg">{t('noVideos')}</p>
          </div>
        )}
      </div>
    </Layout>
  );
}