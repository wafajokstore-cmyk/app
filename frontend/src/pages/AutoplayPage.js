import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import VideoCard from '../components/VideoCard';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AutoplayPage() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const videoId = searchParams.get('video');
  
  const [autoplayEnabled, setAutoplayEnabled] = useState(() => {
    return localStorage.getItem('autoplayEnabled') === 'true';
  });
  const [currentVideo, setCurrentVideo] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlaylist();
  }, []);

  useEffect(() => {
    if (videoId && playlist.length > 0) {
      const index = playlist.findIndex(v => v.id === videoId);
      if (index !== -1) {
        setCurrentIndex(index);
        setCurrentVideo(playlist[index]);
      }
    } else if (playlist.length > 0 && !currentVideo) {
      setCurrentVideo(playlist[0]);
      setCurrentIndex(0);
    }
  }, [videoId, playlist]);

  useEffect(() => {
    localStorage.setItem('autoplayEnabled', autoplayEnabled);
  }, [autoplayEnabled]);

  const fetchPlaylist = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/videos?limit=50`);
      setPlaylist(response.data);
    } catch (error) {
      console.error('Failed to fetch playlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const playNext = () => {
    if (currentIndex < playlist.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentVideo(playlist[nextIndex]);
      navigate(`/autoplay?video=${playlist[nextIndex].id}`);
    }
  };

  const playPrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentVideo(playlist[prevIndex]);
      navigate(`/autoplay?video=${playlist[prevIndex].id}`);
    }
  };

  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views;
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

  if (!currentVideo) {
    return (
      <Layout>
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400 text-lg">{t('noVideos')}</p>
        </div>
      </Layout>
    );
  }

  const upNextVideos = playlist.slice(currentIndex + 1, currentIndex + 6);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold" data-testid="page-title">{t('autoplay')}</h1>
          
          <div className="flex items-center gap-3">
            <Switch
              checked={autoplayEnabled}
              onCheckedChange={setAutoplayEnabled}
              data-testid="autoplay-toggle"
            />
            <span className="text-sm font-medium">
              {autoplayEnabled ? t('autoplayEnabled') : t('autoplayDisabled')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main video section */}
          <div className="lg:col-span-2">
            {/* Video player */}
            <div className="video-embed-container rounded-xl overflow-hidden bg-black" data-testid="video-player">
              <iframe
                src={currentVideo.embedUrl}
                title={currentVideo.title}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>

            {/* Video info */}
            <div className="mt-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-3" data-testid="video-title">{currentVideo.title}</h2>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                  {currentVideo.category}
                </span>
                {currentVideo.episode && (
                  <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                    {t('episode')} {currentVideo.episode}
                  </span>
                )}
                <span>{formatViews(currentVideo.views)} {t('views')}</span>
              </div>

              {/* Navigation buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={playPrevious}
                  disabled={currentIndex === 0}
                  variant="outline"
                  className="gap-2"
                  data-testid="previous-btn"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {t('previous')}
                </Button>
                
                <Button
                  onClick={playNext}
                  disabled={currentIndex === playlist.length - 1}
                  className="gap-2"
                  data-testid="next-btn"
                >
                  {t('next')}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Description */}
              {currentVideo.description && (
                <div className="mt-6 bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                  <h3 className="font-semibold mb-2">{t('description')}:</h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{currentVideo.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Up next sidebar */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-4">{t('upNext')}</h3>
            <div className="space-y-4">
              {upNextVideos.length > 0 ? (
                upNextVideos.map((video, index) => (
                  <div
                    key={video.id}
                    onClick={() => {
                      const newIndex = currentIndex + index + 1;
                      setCurrentIndex(newIndex);
                      setCurrentVideo(video);
                      navigate(`/autoplay?video=${video.id}`);
                    }}
                    className="cursor-pointer"
                  >
                    <VideoCard video={video} />
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No more videos</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}