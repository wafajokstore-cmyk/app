import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import VideoCard from '../components/VideoCard';
import { useLanguage } from '../context/LanguageContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function WatchLater() {
  const { t } = useLanguage();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWatchLater();
  }, []);

  const fetchWatchLater = async () => {
    setLoading(true);
    try {
      const watchLaterIds = JSON.parse(localStorage.getItem('watchLater') || '[]');
      
      if (watchLaterIds.length === 0) {
        setVideos([]);
        setLoading(false);
        return;
      }

      // Fetch all videos and filter by IDs
      const response = await axios.get(`${API}/videos?limit=100`);
      const filtered = response.data.filter(video => watchLaterIds.includes(video.id));
      setVideos(filtered);
    } catch (error) {
      console.error('Failed to fetch watch later:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8" data-testid="page-title">{t('watchLater')}</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="spinner" />
          </div>
        ) : videos.length > 0 ? (
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