import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import VideoCard from '../components/VideoCard';
import { useLanguage } from '../context/LanguageContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function CategoryPage() {
  const { slug } = useParams();
  const { t } = useLanguage();
  const [videos, setVideos] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchCategoryAndVideos();
    }
  }, [slug]);

  const fetchCategoryAndVideos = async () => {
    setLoading(true);
    try {
      // Fetch all categories to find the matching one
      const categoriesResponse = await axios.get(`${API}/categories`);
      const foundCategory = categoriesResponse.data.find(cat => cat.slug === slug);
      setCategory(foundCategory);

      if (foundCategory) {
        // Fetch videos for this category
        const videosResponse = await axios.get(`${API}/videos?category=${encodeURIComponent(foundCategory.name)}`);
        setVideos(videosResponse.data);
      }
    } catch (error) {
      console.error('Failed to fetch category:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="spinner" />
        </div>
      </Layout>
    );
  }

  if (!category) {
    return (
      <Layout>
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400 text-lg">Category not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8" data-testid="page-title">{category.name}</h1>

        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg">{t('noVideos')}</p>
          </div>
        )}
      </div>
    </Layout>
  );
}