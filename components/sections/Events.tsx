'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Heart, Briefcase, Sparkles, Gift } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Events() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const events = [
    {
      icon: Heart,
      title: t('events.weddings.title'),
      description: t('events.weddings.description'),
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: Briefcase,
      title: t('events.corporate.title'),
      description: t('events.corporate.description'),
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069',
      color: 'from-blue-500 to-indigo-500',
    },
    {
      icon: Sparkles,
      title: t('events.workshops.title'),
      description: t('events.workshops.description'),
      image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=2070',
      color: 'from-primary to-primary-dark',
    },
    {
      icon: Gift,
      title: t('events.private.title'),
      description: t('events.private.description'),
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=2070',
      color: 'from-primary-light to-primary',
    },
  ];

  return (
    <section id="events" className="section-padding bg-white relative overflow-hidden" ref={ref}>
      {/* Subtle background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-light/5 rounded-full blur-3xl" />
      
      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg mb-4 text-neutral-900">{t('events.title')}</h2>
          <p className="text-xl text-primary font-medium tracking-wide">
            {t('events.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative h-[400px] rounded-2xl overflow-hidden shadow-xl cursor-pointer"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url('${event.image}')` }}
              />
              
              {/* Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-b ${event.color} opacity-80 group-hover:opacity-90 transition-opacity`} />
              
              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-8 text-white">
                <div className="transform transition-transform duration-300 group-hover:translate-y-[-10px]">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                    <event.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-light mb-3">{event.title}</h3>
                  <p className="text-white/90 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <a href="#contact" className="btn-primary text-lg px-10 py-4 shadow-lg hover:shadow-primary/50 transition-all hover:scale-105">
            {t('nav.booking')}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
