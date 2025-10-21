'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { key: 'home', href: '#hero' },
    { key: 'about', href: '#about' },
    { key: 'venue', href: '#venue' },
    { key: 'events', href: '#events' },
    { key: 'accommodation', href: '#accommodation' },
    { key: 'gallery', href: '#gallery' },
    { key: 'packages', href: '#packages' },
    { key: 'contact', href: '#contact' },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'sl' ? 'en' : 'sl');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' 
          : 'bg-gradient-to-b from-black/40 to-transparent py-5'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo - Official Brand PNG */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 md:w-14 md:h-14 transition-transform group-hover:scale-110">
              <div className={`absolute inset-0 rounded-2xl border ${
                isScrolled ? 'border-neutral-200 bg-white' : 'border-white/30 bg-white/90'
              } shadow-lg shadow-black/10`}></div>
              <img
                src="/images/logo.png"
                alt="HEAVEN Resort Logo"
                className="relative z-10 w-full h-full object-contain p-1"
              />
            </div>
            <div className={`transition-colors ${isScrolled ? 'text-neutral-900' : 'text-white'}`}>
              <div className="text-lg md:text-xl font-thin tracking-[0.5em]">HEAVEN</div>
              <div className="text-xs font-thin tracking-[0.5em] -mt-1 opacity-80">resort</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className={`text-sm font-medium tracking-wide transition-all hover:scale-105 ${
                  isScrolled
                    ? 'text-neutral-700 hover:text-primary'
                    : 'text-white/90 hover:text-primary-light'
                }`}
              >
                {t(`nav.${item.key}`)}
              </a>
            ))}
          </nav>

          {/* Language Toggle & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all hover:scale-105 ${
                isScrolled
                  ? 'text-neutral-700 hover:bg-neutral-100'
                  : 'text-white/90 hover:bg-white/10'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">{language.toUpperCase()}</span>
            </button>
            <a
              href="#contact"
              className={`btn-primary transition-all hover:scale-105 ${
                isScrolled ? '' : 'shadow-lg shadow-primary/30'
              }`}
            >
              {t('nav.booking')}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isScrolled ? 'text-neutral-900 hover:bg-neutral-100' : 'text-white hover:bg-white/10'
            }`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`lg:hidden overflow-hidden rounded-b-2xl ${
                isScrolled ? 'bg-white' : 'bg-black/90 backdrop-blur-md'
              }`}
            >
              <nav className="flex flex-col space-y-3 pt-6 pb-4 px-4">
                {navItems.map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-sm font-medium tracking-wide transition-all py-2 px-4 rounded-lg ${
                      isScrolled
                        ? 'text-neutral-700 hover:text-primary hover:bg-neutral-50'
                        : 'text-white/90 hover:text-primary-light hover:bg-white/10'
                    }`}
                  >
                    {t(`nav.${item.key}`)}
                  </a>
                ))}
                <div className="flex flex-col space-y-3 pt-4 border-t border-white/10">
                  <button
                    onClick={toggleLanguage}
                    className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                      isScrolled
                        ? 'text-neutral-700 hover:bg-neutral-100'
                        : 'text-white/90 hover:bg-white/10'
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    <span className="text-sm font-medium">{language.toUpperCase()}</span>
                  </button>
                  <a
                    href="#contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-primary text-center"
                  >
                    {t('nav.booking')}
                  </a>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
