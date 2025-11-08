import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  const socialLinks = [
    { name: 'TikTok', url: 'https://tiktok.com/@shindoranesub' },
    { name: 'Facebook', url: 'https://www.facebook.com/p/ShinDora-Nesub-61567024627372/' },
    { name: 'YouTube', url: 'https://www.youtube.com/channel/UCBmc1P810YLRcKimSfdtFRA' },
  ];

  const supportLinks = [
    { name: 'Trakteer', url: 'https://trakteer.id/ShinDoraNesub/tip' },
    { name: 'Saweria', url: 'https://saweria.co/ShinDoraNesub' },
    { name: 'Ko-fi', url: 'https://ko-fi.com/shindoranesub' },
    { name: 'Sociabuzz', url: 'https://sociabuzz.com/shindoranesub/tribe' },
  ];

  const infoLinks = [
    { label: t('aboutUs'), path: '/about' },
    { label: t('disclaimer'), path: '/disclaimer' },
    { label: t('privacy'), path: '/privacy' },
    { label: t('terms'), path: '/terms' },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-16 smooth-transition" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Follow Us */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('followUs')}:</h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full text-sm font-medium smooth-transition border border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500"
                  data-testid={`social-${link.name.toLowerCase()}`}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Support Us */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('supportUs')}:</h3>
            <div className="flex flex-wrap gap-3">
              {supportLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full text-sm font-medium smooth-transition border border-gray-300 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500"
                  data-testid={`support-${link.name.toLowerCase()}`}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Info Pages */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Info:</h3>
            <div className="space-y-2">
              {infoLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block text-sm hover:text-blue-500 dark:hover:text-blue-400 smooth-transition"
                  data-testid={`info-${link.path.substring(1)}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© 2025 ShinDora Nesub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}