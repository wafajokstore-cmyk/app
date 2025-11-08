import { Link } from 'react-router-dom';

export default function Footer() {
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
    { label: 'About', path: '/about' },
    { label: 'Disclaimer', path: '/disclaimer' },
    { label: 'Privacy', path: '/privacy' },
    { label: 'Terms', path: '/terms' },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-16 smooth-transition" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          {/* Follow */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">Follow:</span>
            {socialLinks.map((link, index) => (
              <span key={link.name}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-500 dark:hover:text-blue-400 smooth-transition"
                  data-testid={`social-${link.name.toLowerCase()}`}
                >
                  {link.name}
                </a>
                {index < socialLinks.length - 1 && <span className="ml-2">|</span>}
              </span>
            ))}
          </div>

          {/* Support */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">Support:</span>
            {supportLinks.map((link, index) => (
              <span key={link.name}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-500 dark:hover:text-green-400 smooth-transition"
                  data-testid={`support-${link.name.toLowerCase()}`}
                >
                  {link.name}
                </a>
                {index < supportLinks.length - 1 && <span className="ml-2">|</span>}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">Link:</span>
            {infoLinks.map((link, index) => (
              <span key={link.path}>
                <Link
                  to={link.path}
                  className="hover:text-blue-500 dark:hover:text-blue-400 smooth-transition"
                  data-testid={`info-${link.path.substring(1)}`}
                >
                  {link.label}
                </Link>
                {index < infoLinks.length - 1 && <span className="ml-2">|</span>}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-xs text-gray-500 dark:text-gray-500">
          <p>© 2025 ShinDora Nesub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}