import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Home, TrendingUp, Clock, Heart, Play, Grid } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Sidebar({ isOpen, onClose }) {
  const { t } = useLanguage();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: t('home'), path: '/', testId: 'sidebar-home' },
    { icon: TrendingUp, label: t('trending'), path: '/trending', testId: 'sidebar-trending' },
    { icon: Clock, label: t('watchLater'), path: '/watch-later', testId: 'sidebar-watch-later' },
    { icon: Heart, label: t('likedVideos'), path: '/liked', testId: 'sidebar-liked' },
    { icon: Play, label: t('autoplay'), path: '/autoplay', testId: 'sidebar-autoplay' },
    { icon: Grid, label: t('allCategories'), path: '/categories', testId: 'sidebar-categories' },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          data-testid="sidebar-overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40 transform transition-transform duration-300 smooth-transition overflow-y-auto",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:sticky"
        )}
        data-testid="sidebar"
      >
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-lg smooth-transition",
                  isActive
                    ? "bg-gray-100 dark:bg-gray-800 font-semibold"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                )}
                style={isActive ? { color: 'var(--primary-color)' } : {}}
                data-testid={item.testId}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}