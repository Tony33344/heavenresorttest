'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState } from 'react';
import { getContentBlock } from '@/lib/supabase';

export default function Hero() {
  const { t, language } = useLanguage();
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    getContentBlock('hero', language).then(block => {
      if (block?.data) setContent(block.data);
    }).catch(() => {});
  }, [language]);

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Dark Elegant Background with Purple Gradient */}
      <div className="absolute inset-0">
        {/* Base gradient - deep purple to black */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-primary-dark" />
        
        {/* Subtle background image with heavy overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2560&auto=format&fit=crop')",
          }}
        />
        
        {/* Radial gradient spotlight effect */}
        <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent opacity-50" />
        
        {/* Animated gradient orbs for elegance */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-light/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-20 container-custom text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          {/* Official HEAVEN Resort Logo & Branding */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center space-y-10"
          >
            {/* Official Logo - PNG asset on white presentation card */}
            <div className="flex flex-col items-center">
              <div className="w-48 md:w-64 lg:w-72 mb-8 rounded-3xl border border-white/40 bg-white/95 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-sm">
                <div className="p-6 md:p-8">
                  <img
                    src="/images/logo.png"
                    alt="HEAVEN Resort Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              
              {/* Brand Typography - White text on dark background */}
              <div className="text-center space-y-1">
                <h1 className="text-5xl md:text-6xl lg:text-8xl font-thin tracking-[0.5em] text-white">
                  HEAVEN
                </h1>
                <p className="text-2xl md:text-3xl lg:text-5xl font-thin tracking-[0.5em] text-white/90">
                  resort
                </p>
              </div>
            </div>
            
            {/* Tagline - Bold uppercase with brand color accent */}
            <p className="text-sm md:text-base lg:text-xl font-bold tracking-[0.3em] uppercase text-primary-light">
              {content?.subtitle || t('hero.subtitle')}
            </p>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-base md:text-lg lg:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
          >
            {content?.description || t('hero.description')}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
          >
            <a 
              href="#contact" 
              className="btn-primary text-base md:text-lg px-10 py-4 shadow-2xl hover:shadow-primary/50 transition-all hover:scale-105"
            >
              {content?.cta_text || t('hero.cta')}
            </a>
            <a 
              href="#about" 
              className="text-base md:text-lg px-10 py-4 rounded-full border-2 border-white/50 text-white hover:bg-white hover:text-primary transition-all duration-300 font-medium tracking-wide hover:scale-105"
            >
              {t('hero.learnMore')}
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.a
          href="#about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 hover:text-primary-light transition-colors cursor-pointer"
        >
          <ChevronDown className="w-8 h-8 animate-bounce" />
        </motion.a>
      </div>
    </section>
  );
}
