'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Heart, Briefcase, Sparkles, Gift } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getPublicEvents, type Event } from '@/lib/supabase';

const iconMap: Record<number, any> = {
  0: Heart,
  1: Briefcase,
  2: Sparkles,
  3: Gift,
};

const colorMap: string[] = [
  'from-pink-500 to-rose-500',
  'from-blue-500 to-indigo-500',
  'from-primary to-primary-dark',
  'from-primary-light to-primary',
];

const fallbackEvents: Event[] = [
  { id: '1', created_at: '', updated_at: '', title_sl: 'Poroke', title_en: 'Weddings', description_sl: 'Sanjska poročna lokacija v objemu narave. Eleganten prostor za vaš posebni dan.', description_en: 'Dream wedding location embraced by nature. Elegant space for your special day.', image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800', capacity: 100, duration_hours: 12, order_index: 0, published: true },
  { id: '2', created_at: '', updated_at: '', title_sl: 'Korporativni Dogodki', title_en: 'Corporate Events', description_sl: 'Profesionalni prostori za sestanke, teambuilding in korporativne retreat-e.', description_en: 'Professional spaces for meetings, team building, and corporate retreats.', image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800', capacity: 50, duration_hours: 8, order_index: 1, published: true },
  { id: '3', created_at: '', updated_at: '', title_sl: 'Delavnice', title_en: 'Workshops', description_sl: 'Inspirativno okolje za osebnostno rast, jogo, meditacijo in kreativne delavnice.', description_en: 'Inspiring environment for personal growth, yoga, meditation, and creative workshops.', image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800', capacity: 30, duration_hours: 6, order_index: 2, published: true },
  { id: '4', created_at: '', updated_at: '', title_sl: 'Zasebni Dogodki', title_en: 'Private Events', description_sl: 'Praznujte rojstne dneve, obletnice in družinska srečanja v ekskluzivnem okolju.', description_en: 'Celebrate birthdays, anniversaries, and family gatherings in an exclusive setting.', image_url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800', capacity: 40, duration_hours: 8, order_index: 3, published: true },
];

export default function Events() {
  const { t, language } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [events, setEvents] = useState<Event[]>(fallbackEvents);

  useEffect(() => {
    getPublicEvents().then(data => {
      if (data && data.length > 0) setEvents(data);
    }).catch(() => {});
  }, []);

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
          {events.map((event, index) => {
            const Icon = iconMap[index % 4] || Sparkles;
            const color = colorMap[index % colorMap.length];
            const title = language === 'sl' ? event.title_sl : event.title_en;
            const description = language === 'sl' ? event.description_sl : event.description_en;
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative h-[400px] rounded-2xl overflow-hidden shadow-xl cursor-pointer"
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('${event.image_url || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070'}')` }}
                />
                
                {/* Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-b ${color} opacity-65 group-hover:opacity-75 transition-opacity`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
                
                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-8 text-white">
                  <div className="transform transition-transform duration-300 group-hover:translate-y-[-10px]">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-3xl font-medium mb-3 drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)]">{title}</h3>
                    <p className="text-white/90 leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)]">
                      {description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
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
