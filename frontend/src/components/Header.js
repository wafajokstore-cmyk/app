import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Search, Menu, Moon, Sun, Globe } from 'lucide-react';
import { Button } from './ui/button';

export default function Header({ onMenuClick }) {
  const { theme, toggleTheme, logo } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 smooth-transition">
      <div className="flex items-center justify-between px-4 h-16">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
            data-testid="menu-toggle-btn"
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          <Link to="/" className="flex items-center gap-2" data-testid="home-link">
            {logo ? (
              <img src={logo} alt="Logo" className="h-8 w-auto" />
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: 'var(--primary-color)' }}></div>
                <span className="font-bold text-xl hidden sm:block">ShinDoraNesub</span>
              </div>
            )}
          </Link>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-2xl mx-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder={t('search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pr-10 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 smooth-transition text-sm"
              data-testid="search-input"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full smooth-transition"
              data-testid="search-btn"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            title={language === 'en' ? 'Switch to Indonesian' : 'Ganti ke English'}
            data-testid="language-toggle-btn"
          >
            <Globe className="h-5 w-5" />
            <span className="ml-1 text-xs font-semibold">{language.toUpperCase()}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Dark mode' : 'Light mode'}
            data-testid="theme-toggle-btn"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
}