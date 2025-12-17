'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Home, Trees, Calendar, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getContentBlock } from '@/lib/supabase';

export default function VenueFeatures() {
  const { t, language } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    getContentBlock('venue', language).then(block => {
      if (block?.data) setContent(block.data);
    }).catch(() => {});
  }, [language]);

  const venues = [
    {
      icon: Home,
      title: t('venue.indoor.title'),
      description: t('venue.indoor.description'),
      features: t('venue.indoor.features'),
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070',
    },
    {
      icon: Trees,
      title: t('venue.outdoor.title'),
      description: t('venue.outdoor.description'),
      features: t('venue.outdoor.features'),
      image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=2070',
    },
    {
      icon: Calendar,
      title: t('venue.event.title'),
      description: t('venue.event.description'),
      features: t('venue.event.features'),
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2070',
    },
  ];

  return (
    <section id="venue" className="section-padding bg-gradient-to-b from-white via-neutral-50 to-white" ref={ref}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-block mb-4">
            <div className="w-20 mx-auto mb-6 rounded-3xl border border-primary/20 bg-white/95 shadow-lg shadow-black/10">
              <div className="p-4">
                <img src="/images/logo.png" alt="HEAVEN Resort" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>
          <h2 className="heading-lg mb-4 text-neutral-900">{t('venue.title')}</h2>
          <p className="text-xl text-primary font-medium tracking-wide">
            {t('venue.subtitle')}
          </p>
        </motion.div>

        <div className="space-y-24">
          {venues.map((venue, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image */}
              <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${venue.image}')` }}
                  />
                </div>
              </div>

              {/* Content */}
              <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-dark shadow-lg shadow-primary/30 flex items-center justify-center">
                    <venue.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="heading-sm text-neutral-900">{venue.title}</h3>
                </div>
                <p className="text-lg text-neutral-700 leading-relaxed">
                  {venue.description}
                </p>
                <ul className="space-y-3">
                  {Array.isArray(venue.features) && venue.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-center space-x-3 group">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      </div>
                      <span className="text-neutral-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
