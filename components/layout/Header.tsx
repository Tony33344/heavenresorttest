'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Globe, User, LogOut } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { key: 'home', href: '/' },
    { key: 'about', href: '/#about' },
    { key: 'venue', href: '/#venue' },
    { key: 'events', href: '/#events' },
    { key: 'accommodation', href: '/#accommodation' },
    { key: 'gallery', href: '/#gallery' },
    { key: 'packages', href: '/#packages' },
    { key: 'services', href: '/services' },
    { key: 'contact', href: '/#contact' },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'sl' ? 'en' : 'sl');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white/95 backdrop-blur-md shadow-md ${
        isScrolled 
          ? 'py-2' 
          : 'py-3'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo - Official Brand PNG */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 md:w-14 md:h-14 transition-transform group-hover:scale-105">
              <img
                src="/images/logo.png"
                alt="HEAVEN Resort Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-neutral-900">
              <div className="text-xl md:text-2xl font-light tracking-[0.3em]">HEAVEN</div>
              <div className="text-xs md:text-sm font-light tracking-[0.3em] -mt-1 text-primary">resort</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="text-sm font-medium tracking-wide transition-all hover:scale-105 whitespace-nowrap text-neutral-700 hover:text-primary"
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
          </nav>

          {/* Language Toggle & Auth */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-4 py-2 rounded-full transition-all hover:scale-105 text-neutral-700 hover:bg-neutral-100"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">{language.toUpperCase()}</span>
            </button>
            
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-neutral-700">
                  {user.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full transition-all hover:scale-105 text-neutral-700 hover:bg-neutral-100"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-2 btn-primary transition-all hover:scale-105"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg transition-colors text-neutral-900 hover:bg-neutral-100"
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
              className="lg:hidden overflow-hidden rounded-b-2xl bg-white border-t border-neutral-100"
            >
              <nav className="flex flex-col space-y-1 py-4 px-4">
                {navItems.map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm font-medium tracking-wide transition-all py-2 px-4 rounded-lg text-neutral-700 hover:text-primary hover:bg-neutral-50"
                  >
                    {t(`nav.${item.key}`)}
                  </a>
                ))}
                <div className="flex flex-col space-y-3 pt-4 mt-2 border-t border-neutral-200">
                  <button
                    onClick={toggleLanguage}
                    className="flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors text-neutral-700 hover:bg-neutral-100"
                  >
                    <Globe className="w-4 h-4" />
                    <span className="text-sm font-medium">{language.toUpperCase()}</span>
                  </button>
                  <a
                    href="/book"
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
