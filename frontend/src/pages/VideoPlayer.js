import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import VideoCard from '../components/VideoCard';
import { useLanguage } from '../context/LanguageContext';
import { Eye, Heart, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function VideoPlayer() {
  const { id } = useParams();
  const { t } = useLanguage();
  
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isWatchLater, setIsWatchLater] = useState(false);

  useEffect(() => {
    if (id) {
      fetchVideo();
      checkLocalStorage();
    }
  }, [id]);

  const checkLocalStorage = () => {
    const liked = JSON.parse(localStorage.getItem('likedVideos') || '[]');
    const watchLater = JSON.parse(localStorage.getItem('watchLater') || '[]');
    setIsLiked(liked.includes(id));
    setIsWatchLater(watchLater.includes(id));
  };

  const fetchVideo = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/videos/${id}`);
      setVideo(response.data);
      
      // Fetch related videos from same category
      if (response.data.category) {
        const relatedResponse = await axios.get(`${API}/videos?category=${encodeURIComponent(response.data.category)}`);
        const filtered = relatedResponse.data.filter(v => v.id !== id).slice(0, 8);
        setRelatedVideos(filtered);
      }
    } catch (error) {
      console.error('Failed to fetch video:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = () => {
    const liked = JSON.parse(localStorage.getItem('likedVideos') || '[]');
    if (isLiked) {
      const updated = liked.filter(videoId => videoId !== id);
      localStorage.setItem('likedVideos', JSON.stringify(updated));
      setIsLiked(false);
      toast.success('Removed from liked videos');
    } else {
      liked.push(id);
      localStorage.setItem('likedVideos', JSON.stringify(liked));
      setIsLiked(true);
      toast.success('Added to liked videos');
    }
  };

  const toggleWatchLater = () => {
    const watchLater = JSON.parse(localStorage.getItem('watchLater') || '[]');
    if (isWatchLater) {
      const updated = watchLater.filter(videoId => videoId !== id);
      localStorage.setItem('watchLater', JSON.stringify(updated));
      setIsWatchLater(false);
      toast.success('Removed from watch later');
    } else {
      watchLater.push(id);
      localStorage.setItem('watchLater', JSON.stringify(watchLater));
      setIsWatchLater(true);
      toast.success('Added to watch later');
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

  if (!video) {
    return (
      <Layout>
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400 text-lg">Video not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main video section */}
          <div className="lg:col-span-2">
            {/* Video player */}
            <div className="video-embed-container rounded-xl overflow-hidden bg-black" data-testid="video-player">
              <iframe
                src={video.embedUrl}
                title={video.title}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>

            {/* Video info */}
            <div className="mt-6">
              <h1 className="text-2xl sm:text-3xl font-bold mb-4" data-testid="video-title">{video.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Eye className="h-5 w-5" />
                  <span>{formatViews(video.views)} {t('views')}</span>
                </div>
                
                <Button
                  variant={isLiked ? "default" : "outline"}
                  size="sm"
                  onClick={toggleLike}
                  className="gap-2"
                  data-testid="like-btn"
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                  {isLiked ? 'Liked' : 'Like'}
                </Button>
                
                <Button
                  variant={isWatchLater ? "default" : "outline"}
                  size="sm"
                  onClick={toggleWatchLater}
                  className="gap-2"
                  data-testid="watch-later-btn"
                >
                  <Clock className="h-4 w-4" />
                  {isWatchLater ? 'Saved' : 'Watch Later'}
                </Button>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
                <div className="flex flex-wrap gap-4 mb-4">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{t('category')}:</span>
                    <Link
                      to={`/category/${video.category}`}
                      className="ml-2 font-semibold hover:text-blue-500 smooth-transition"
                    >
                      {video.category}
                    </Link>
                  </div>
                  
                  {video.episode && (
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{t('episode')}:</span>
                      <span className="ml-2 font-semibold">{video.episode}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">{t('description')}:</h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{video.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Related videos */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold mb-4">Related Videos</h2>
            <div className="space-y-4">
              {relatedVideos.map((relatedVideo) => (
                <VideoCard key={relatedVideo.id} video={relatedVideo} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}