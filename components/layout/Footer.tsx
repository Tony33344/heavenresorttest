'use client';

import Link from 'next/link';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  const quickLinks = [
    { key: 'about', href: '#about' },
    { key: 'venue', href: '#venue' },
    { key: 'events', href: '#events' },
    { key: 'accommodation', href: '#accommodation' },
    { key: 'gallery', href: '#gallery' },
    { key: 'packages', href: '#packages' },
  ];

  return (
    <footer className="bg-gradient-to-b from-neutral-900 to-black text-white border-t border-primary/20">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand - Official Logo */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4 group">
              <div className="w-16 h-16 transition-transform group-hover:scale-110">
                <div className="w-full h-full rounded-3xl border border-white/30 bg-white/95 shadow-lg shadow-black/30">
                  <img
                    src="/images/logo.png"
                    alt="HEAVEN Resort Logo"
                    className="w-full h-full object-contain p-2"
                  />
                </div>
              </div>
              <div>
                <div className="text-2xl font-thin tracking-[0.5em]">HEAVEN</div>
                <div className="text-sm font-thin tracking-[0.5em] -mt-1 opacity-80">resort</div>
              </div>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed">
              {t('footer.tagline')}
            </p>
            <div className="text-xs font-bold tracking-[0.3em] uppercase text-primary-light">
              TRANSFORMATIVNA IDOŽIVETJA
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-medium mb-6 text-primary-light">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <a
                    href={link.href}
                    className="text-neutral-400 hover:text-primary-light transition-all text-sm hover:translate-x-1 inline-block"
                  >
                    {t(`nav.${link.key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-medium mb-6 text-primary-light">{t('contact.info.title')}</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 group">
                <MapPin className="w-5 h-5 text-primary-light flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-neutral-400 text-sm leading-relaxed">
                  {t('contact.info.address')}
                </span>
              </li>
              <li className="flex items-center space-x-3 group">
                <Mail className="w-5 h-5 text-primary-light flex-shrink-0 group-hover:scale-110 transition-transform" />
                <a
                  href="mailto:info@heavenresort.com"
                  className="text-neutral-400 hover:text-primary-light transition-colors text-sm"
                >
                  {t('contact.info.email')}
                </a>
              </li>
              <li className="flex items-center space-x-3 group">
                <Phone className="w-5 h-5 text-primary-light flex-shrink-0 group-hover:scale-110 transition-transform" />
                <a
                  href="tel:+386XXXXXXX"
                  className="text-neutral-400 hover:text-primary-light transition-colors text-sm"
                >
                  {t('contact.info.phone')}
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-medium mb-6 text-primary-light">{t('footer.followUs')}</h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-neutral-800 hover:bg-primary hover:shadow-lg hover:shadow-primary/50 flex items-center justify-center transition-all hover:scale-110"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-neutral-800 hover:bg-primary hover:shadow-lg hover:shadow-primary/50 flex items-center justify-center transition-all hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            <p className="text-neutral-500 text-xs mt-6 leading-relaxed">
              Follow us for exclusive offers and behind-the-scenes content
            </p>
          </div>
        </div>

        {/* Bottom Bar with Purple Accent */}
        <div className="border-t border-primary/20 mt-12 pt-8 text-center">
          <p className="text-neutral-400 text-sm">
            © {new Date().getFullYear()} <span className="text-primary-light font-medium">HEAVEN Resort</span>. {t('footer.rights')}
          </p>
          <p className="text-neutral-600 text-xs mt-2">
            Designed with elegance and care
          </p>
        </div>
      </div>
    </footer>
  );
}
