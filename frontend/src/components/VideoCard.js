import { Link } from 'react-router-dom';
import { Eye, Heart, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function VideoCard({ video }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isWatchLater, setIsWatchLater] = useState(false);

  useEffect(() => {
    // Check if video is in liked or watch later
    const liked = JSON.parse(localStorage.getItem('likedVideos') || '[]');
    const watchLater = JSON.parse(localStorage.getItem('watchLater') || '[]');
    setIsLiked(liked.includes(video.id));
    setIsWatchLater(watchLater.includes(video.id));
  }, [video.id]);

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views;
  };

  const toggleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const liked = JSON.parse(localStorage.getItem('likedVideos') || '[]');
    if (isLiked) {
      const updated = liked.filter(id => id !== video.id);
      localStorage.setItem('likedVideos', JSON.stringify(updated));
      setIsLiked(false);
      toast.success('Removed from liked videos');
    } else {
      liked.push(video.id);
      localStorage.setItem('likedVideos', JSON.stringify(liked));
      setIsLiked(true);
      toast.success('Added to liked videos');
    }
  };

  const toggleWatchLater = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const watchLater = JSON.parse(localStorage.getItem('watchLater') || '[]');
    if (isWatchLater) {
      const updated = watchLater.filter(id => id !== video.id);
      localStorage.setItem('watchLater', JSON.stringify(updated));
      setIsWatchLater(false);
      toast.success('Removed from watch later');
    } else {
      watchLater.push(video.id);
      localStorage.setItem('watchLater', JSON.stringify(watchLater));
      setIsWatchLater(true);
      toast.success('Added to watch later');
    }
  };

  return (
    <Link
      to={`/video/${video.id}`}
      className="block animate-fade-in"
      data-testid={`video-card-${video.id}`}
    >
      <div className="w-full bg-white dark:bg-zinc-900 rounded-2xl shadow hover:shadow-lg transition overflow-hidden border border-zinc-200 dark:border-zinc-800">
        {/* Thumbnail */}
        <div className="relative aspect-video">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180'%3E%3Crect width='320' height='180' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
            }}
          />
        </div>

        {/* Info */}
        <div className="p-3 flex flex-col justify-between">
          <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 line-clamp-2">
            {video.title}
          </h3>

          <div className="flex items-center justify-between text-sm text-zinc-500 mt-2">
            <div className="flex items-center gap-1">
              <Eye size={15} />
              <span>{formatViews(video.views)}</span>
            </div>
            <span className="text-xs italic">{video.category}</span>
          </div>

          {/* Buttons */}
          <div className="mt-3 flex justify-between">
            <button 
              onClick={toggleLike}
              className={`w-1/2 flex items-center justify-center gap-1 text-sm transition ${
                isLiked 
                  ? 'text-red-500' 
                  : 'text-zinc-700 dark:text-zinc-300 hover:text-red-500'
              }`}
              data-testid={`like-btn-${video.id}`}
            >
              <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
            </button>
            <button 
              onClick={toggleWatchLater}
              className={`w-1/2 flex items-center justify-center gap-1 text-sm transition ${
                isWatchLater 
                  ? 'text-blue-500' 
                  : 'text-zinc-700 dark:text-zinc-300 hover:text-blue-500'
              }`}
              data-testid={`watch-later-btn-${video.id}`}
            >
              <Clock size={16} fill={isWatchLater ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}