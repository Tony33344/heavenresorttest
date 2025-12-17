'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Home, Users, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getPublicAccommodation, type AccommodationUnit } from '@/lib/supabase';

const fallbackAccommodations: AccommodationUnit[] = [
  { id: '1', created_at: '', updated_at: '', name_sl: 'Glavna Hiša', name_en: 'Main House', description_sl: 'Elegantno opremljena glavna hiša z modernim komfortom in čudovitim razgledom.', description_en: 'Elegantly furnished main house with modern comfort and stunning views.', price: 150, currency: 'EUR', price_text_sl: 'na noč', price_text_en: 'per night', capacity: 8, images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800'], amenities_sl: ['Zasebne sobe', 'Skupni prostori', 'Moderna kopalnica', 'Wi-Fi', 'Popolnoma opremljena kuhinja'], amenities_en: ['Private rooms', 'Common areas', 'Modern bathroom', 'Wi-Fi', 'Fully equipped kitchen'], order_index: 0, published: true },
  { id: '2', created_at: '', updated_at: '', name_sl: 'Glamping Šotori', name_en: 'Glamping Tents', description_sl: 'Luksuzno kampiranje pod zvezdami z vsem udobjem.', description_en: 'Luxury camping under the stars with all amenities.', price: 80, currency: 'EUR', price_text_sl: 'na noč', price_text_en: 'per night', capacity: 4, images: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800'], amenities_sl: ['Udobne postelje', 'Električna napeljava', 'Zunanji prostor', 'Dostop do sanitarij'], amenities_en: ['Comfortable beds', 'Electricity', 'Outdoor space', 'Access to facilities'], order_index: 1, published: true },
  { id: '3', created_at: '', updated_at: '', name_sl: 'Kampiranje', name_en: 'Camping', description_sl: 'Pristno kampiranje v naravi s sodobnimi sanitarijami.', description_en: 'Authentic camping in nature with modern sanitary facilities.', price: 25, currency: 'EUR', price_text_sl: 'na noč', price_text_en: 'per night', capacity: 20, images: ['https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=800'], amenities_sl: ['Šotorski prostori', 'Sanitarije', 'Skupna kuhinja', 'Ognjiščni prostor'], amenities_en: ['Tent spaces', 'Sanitary facilities', 'Shared kitchen', 'Fire pit area'], order_index: 2, published: true },
];

export default function Accommodation() {
  const { t, language } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [accommodations, setAccommodations] = useState<AccommodationUnit[]>(fallbackAccommodations);

  useEffect(() => {
    getPublicAccommodation().then(data => {
      if (data && data.length > 0) setAccommodations(data);
    }).catch(() => {});
  }, []);

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {accommodations.map((accommodation, index) => {
            const name = language === 'sl' ? accommodation.name_sl : accommodation.name_en;
            const description = language === 'sl' ? accommodation.description_sl : accommodation.description_en;
            const amenities = language === 'sl' ? accommodation.amenities_sl : accommodation.amenities_en;
            const mainImage = accommodation.images?.[0] || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2071';
            const priceText = language === 'sl' ? accommodation.price_text_sl : accommodation.price_text_en;
            
            return (
              <motion.div
                key={accommodation.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="card-elegant overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-64">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${mainImage}')` }}
                  />
                  <div className="absolute top-4 left-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/40">
                      <Home className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                  <div>
                    <h3 className="text-2xl font-light mb-2">{name}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-primary">
                        <Users className="w-5 h-5" />
                        <span className="font-medium">{accommodation.capacity} {t('accommodation.indoor.capacity').split(' ')[1]}</span>
                      </div>
                      {accommodation.price && (
                        <div className="text-xl font-semibold text-primary">
                          €{accommodation.price}
                        </div>
                      )}
                    </div>
                    {priceText && <div className="text-sm text-neutral-600 mt-1">{priceText}</div>}
                  </div>

                  {description && (
                    <p className="text-neutral-700 text-sm leading-relaxed">{description}</p>
                  )}

                  {amenities && amenities.length > 0 && (
                    <ul className="space-y-3">
                      {amenities.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-center space-x-3 group">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                          </div>
                          <span className="text-neutral-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <a href="#contact" className="btn-secondary w-full block text-center hover:scale-105 transition-transform">
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
