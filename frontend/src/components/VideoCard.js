import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function VideoCard({ video }) {
  const { t } = useLanguage();

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views;
  };

  return (
    <Link
      to={`/video/${video.id}`}
      className="group block animate-fade-in"
      data-testid={`video-card-${video.id}`}
    >
      <div className="relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 aspect-video">
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 smooth-transition duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No thumbnail
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 smooth-transition" />
      </div>

      <div className="mt-3">
        <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-blue-500 dark:group-hover:text-blue-400 smooth-transition">
          {video.title}
        </h3>
        
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-600 dark:text-gray-400">
          <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
            {video.category}
          </span>
          
          {video.episode && (
            <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
              {t('episode')} {video.episode}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-500">
          <Eye className="h-3 w-3" />
          <span>{formatViews(video.views)} {t('views')}</span>
        </div>
      </div>
    </Link>
  );
}