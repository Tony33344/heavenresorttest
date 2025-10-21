'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Gallery() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = [
    {
      src: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=2070',
      category: 'nature',
      span: 'col-span-2 row-span-2',
    },
    {
      src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070',
      category: 'indoor',
      span: 'col-span-1 row-span-1',
    },
    {
      src: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=2070',
      category: 'outdoor',
      span: 'col-span-1 row-span-1',
    },
    {
      src: 'https://images.unsplash.com/photo-1519167758481-83f29da8c2b6?q=80&w=2070',
      category: 'events',
      span: 'col-span-1 row-span-2',
    },
    {
      src: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070',
      category: 'events',
      span: 'col-span-1 row-span-1',
    },
    {
      src: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=2070',
      category: 'outdoor',
      span: 'col-span-2 row-span-1',
    },
    {
      src: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2071',
      category: 'indoor',
      span: 'col-span-1 row-span-1',
    },
    {
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070',
      category: 'nature',
      span: 'col-span-1 row-span-1',
    },
  ];

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
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className={`${image.span} relative overflow-hidden rounded-lg cursor-pointer group`}
              onClick={() => setSelectedImage(image.src)}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url('${image.src}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/0 group-hover:from-primary/50 to-transparent transition-all duration-300" />
            </motion.div>
          ))}
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
