'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Check, Heart, Briefcase, Sparkles, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getPublicPackages, type Package } from '@/lib/supabase';

const iconMap: Record<number, any> = {
  0: Heart,
  1: Briefcase,
  2: Sparkles,
  3: MessageCircle,
};

const colorMap: string[] = [
  'from-pink-500 to-rose-500',
  'from-blue-500 to-indigo-500',
  'from-primary to-primary-dark',
  'from-primary-light to-primary',
];

const fallbackPackages: Package[] = [
  { id: '1', created_at: '', updated_at: '', name_sl: 'Poročni Paket', name_en: 'Wedding Package', description_sl: 'Popoln paket za vaš posebni dan', description_en: 'Complete package for your special day', price: 3500, currency: 'EUR', price_text_sl: 'Od €3,500', price_text_en: 'From €3,500', duration_days: 1, includes_sl: ['Celodnevna uporaba prostora', 'Nastanitev za 10 gostov', 'Poročna dekoracija', 'Catering koordinacija', 'Osebni koordinator'], includes_en: ['Full-day venue use', 'Accommodation for 10 guests', 'Wedding decoration', 'Catering coordination', 'Personal coordinator'], image_url: '', featured: true, order_index: 0, published: true },
  { id: '2', created_at: '', updated_at: '', name_sl: 'Korporativni Paket', name_en: 'Corporate Package', description_sl: 'Idealno za poslovne dogodke', description_en: 'Ideal for business events', price: 2000, currency: 'EUR', price_text_sl: 'Od €2,000', price_text_en: 'From €2,000', duration_days: 1, includes_sl: ['Konferenčni prostori', 'AV oprema', 'Catering', 'Nastanitev', 'Teambuilding aktivnosti'], includes_en: ['Conference spaces', 'AV equipment', 'Catering', 'Accommodation', 'Team building activities'], image_url: '', featured: false, order_index: 1, published: true },
  { id: '3', created_at: '', updated_at: '', name_sl: 'Retreat Paket', name_en: 'Retreat Package', description_sl: 'Za transformativne izkušnje', description_en: 'For transformative experiences', price: 1500, currency: 'EUR', price_text_sl: 'Od €1,500', price_text_en: 'From €1,500', duration_days: 3, includes_sl: ['Večdnevna nastanitev', 'Delavniški prostori', 'Obroki', 'Joga/meditacija', 'Naravne aktivnosti'], includes_en: ['Multi-day accommodation', 'Workshop spaces', 'Meals', 'Yoga/meditation', 'Nature activities'], image_url: '', featured: false, order_index: 2, published: true },
  { id: '4', created_at: '', updated_at: '', name_sl: 'Po Meri', name_en: 'Custom', description_sl: 'Prilagojeno vašim željam', description_en: 'Tailored to your needs', price: undefined, currency: 'EUR', price_text_sl: 'Ponudba', price_text_en: 'Quote', duration_days: undefined, includes_sl: ['Prilagojeni paketi', 'Fleksibilne možnosti', 'Osebna pomoč', 'Posebne želje', 'Kontaktirajte nas'], includes_en: ['Customized packages', 'Flexible options', 'Personal assistance', 'Special requests', 'Contact us'], image_url: '', featured: false, order_index: 3, published: true },
];

export default function Packages() {
  const { t, language } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [packages, setPackages] = useState<Package[]>(fallbackPackages);

  useEffect(() => {
    getPublicPackages().then(data => {
      if (data && data.length > 0) setPackages(data);
    }).catch(() => {});
  }, []);

  return (
    <section id="packages" className="section-padding bg-gradient-to-b from-neutral-50 to-white" ref={ref}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg mb-4 text-neutral-900">{t('packages.title')}</h2>
          <p className="text-xl text-primary font-medium tracking-wide">
            {t('packages.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {packages.map((pkg, index) => {
            const Icon = iconMap[index % 4] || Sparkles;
            const color = colorMap[index % colorMap.length];
            const name = language === 'sl' ? pkg.name_sl : pkg.name_en;
            const description = language === 'sl' ? pkg.description_sl : pkg.description_en;
            const includes = language === 'sl' ? pkg.includes_sl : pkg.includes_en;
            const priceText = language === 'sl' ? pkg.price_text_sl : pkg.price_text_en;
            const priceDisplay = pkg.price ? `€${pkg.price}` : priceText || t('packages.custom.price');
            
            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`card-elegant overflow-hidden ${
                  pkg.featured ? 'ring-2 ring-primary transform lg:scale-105' : ''
                }`}
              >
                {/* Header */}
                <div className={`bg-gradient-to-br ${color} p-8 text-white`}>
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-light mb-2">{name}</h3>
                  <div className="text-3xl font-light">{priceDisplay}</div>
                  {pkg.duration_days && (
                    <div className="text-sm text-white/80 mt-2">
                      {pkg.duration_days} {language === 'sl' ? 'dni' : 'days'}
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="p-8">
                  {description && (
                    <p className="text-neutral-700 text-sm leading-relaxed mb-4">{description}</p>
                  )}
                  
                  {includes && includes.length > 0 && (
                    <ul className="space-y-4">
                      {includes.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start space-x-3">
                          <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-neutral-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <a
                    href="#contact"
                    className={`mt-8 w-full block text-center transition-transform hover:scale-105 ${
                      pkg.featured ? 'btn-primary shadow-lg hover:shadow-primary/50' : 'btn-secondary'
                    }`}
                  >
                    {t('nav.booking')}
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
