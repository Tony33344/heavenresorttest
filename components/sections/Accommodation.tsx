'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Home, Tent, Users, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Accommodation() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const accommodations = [
    {
      icon: Home,
      title: t('accommodation.indoor.title'),
      capacity: t('accommodation.indoor.capacity'),
      features: t('accommodation.indoor.features'),
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2071',
    },
    {
      icon: Tent,
      title: t('accommodation.camping.title'),
      capacity: t('accommodation.camping.capacity'),
      features: t('accommodation.camping.features'),
      image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=2070',
    },
  ];

  return (
    <section id="accommodation" className="section-padding bg-white" ref={ref}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg mb-4 text-neutral-900">{t('accommodation.title')}</h2>
          <p className="text-xl text-primary font-medium tracking-wide mb-6">
            {t('accommodation.subtitle')}
          </p>
          <p className="text-lg text-neutral-700 max-w-3xl mx-auto">
            {t('accommodation.description')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {accommodations.map((accommodation, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="card-elegant overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-64">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${accommodation.image}')` }}
                />
                <div className="absolute top-4 left-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/40">
                    <accommodation.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">
                <div>
                  <h3 className="text-2xl font-light mb-2">{accommodation.title}</h3>
                  <div className="flex items-center space-x-2 text-primary">
                    <Users className="w-5 h-5" />
                    <span className="font-medium">{accommodation.capacity}</span>
                  </div>
                </div>

                <ul className="space-y-3">
                  {Array.isArray(accommodation.features) && accommodation.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-center space-x-3 group">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      </div>
                      <span className="text-neutral-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a href="#contact" className="btn-secondary w-full block text-center hover:scale-105 transition-transform">
                  {t('nav.booking')}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
