'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getPublicGallery, type GalleryImage } from '@/lib/supabase';

const spanMap: string[] = [
  'col-span-2 row-span-2',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-2',
  'col-span-1 row-span-1',
  'col-span-2 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
];

const fallbackImages: GalleryImage[] = [
  { id: '1', created_at: '', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800', title_sl: 'Notranji prostor', title_en: 'Indoor Space', category: 'indoor', order_index: 0, published: true },
  { id: '2', created_at: '', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800', title_sl: 'Razgled', title_en: 'View', category: 'outdoor', order_index: 1, published: true },
  { id: '3', created_at: '', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800', title_sl: 'Narava', title_en: 'Nature', category: 'nature', order_index: 2, published: true },
  { id: '4', created_at: '', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800', title_sl: 'Dogodek', title_en: 'Event', category: 'events', order_index: 3, published: true },
  { id: '5', created_at: '', url: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=800', title_sl: 'Sončni zahod', title_en: 'Sunset', category: 'outdoor', order_index: 4, published: true },
  { id: '6', created_at: '', url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800', title_sl: 'Kampiranje', title_en: 'Camping', category: 'outdoor', order_index: 5, published: true },
  { id: '7', created_at: '', url: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=800', title_sl: 'Nastanitev', title_en: 'Accommodation', category: 'indoor', order_index: 6, published: true },
  { id: '8', created_at: '', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800', title_sl: 'Okolica', title_en: 'Surroundings', category: 'nature', order_index: 7, published: true },
];

export default function Gallery() {
  const { t, language } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [images, setImages] = useState<GalleryImage[]>(fallbackImages);

  useEffect(() => {
    getPublicGallery().then(data => {
      if (data && data.length > 0) setImages(data);
    }).catch(() => {});
  }, []);

  return (
    <section id="gallery" className="section-padding bg-gradient-to-b from-neutral-50 to-white" ref={ref}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg mb-4 text-neutral-900">{t('gallery.title')}</h2>
          <p className="text-xl text-primary font-medium tracking-wide">
            {t('gallery.subtitle')}
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {images.map((image, index) => {
            const span = spanMap[index % spanMap.length];
            const title = language === 'sl' ? image.title_sl : image.title_en;
            
            return (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={`${span} relative overflow-hidden rounded-lg cursor-pointer group`}
                onClick={() => setSelectedImage(image.url)}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('${image.url}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/0 group-hover:from-primary/50 to-transparent transition-all duration-300" />
                {title && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-medium">{title}</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-primary transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={selectedImage}
            alt="Gallery"
            className="max-w-full max-h-full object-contain"
          />
        </motion.div>
      )}
    </section>
  );
}
