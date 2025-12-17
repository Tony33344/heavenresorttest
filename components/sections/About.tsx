'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Sparkles, Heart, Mountain, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getContentBlock } from '@/lib/supabase';

export default function About() {
  const { t, language } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    getContentBlock('about', language).then(block => {
      if (block?.data) setContent(block.data);
    }).catch(() => {});
  }, [language]);

  const features = [
    {
      icon: Mountain,
      title: t('about.features.nature'),
      description: t('about.features.natureDesc'),
    },
    {
      icon: Sparkles,
      title: t('about.features.elegance'),
      description: t('about.features.eleganceDesc'),
    },
    {
      icon: Heart,
      title: t('about.features.transformation'),
      description: t('about.features.transformationDesc'),
    },
    {
      icon: Users,
      title: t('about.features.experience'),
      description: t('about.features.experienceDesc'),
    },
  ];

  return (
    <section id="about" className="section-padding bg-gradient-to-b from-white to-neutral-50 relative" ref={ref}>
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-20 w-64 h-64 bg-primary-light/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg mb-4 text-neutral-900">{t('about.title')}</h2>
          <p className="text-xl text-primary font-medium tracking-wide">
            {t('about.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('${content?.image_url || 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=2070'}')`,
              }}
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col justify-center space-y-6"
          >
            <p className="text-lg text-neutral-700 leading-relaxed">
              {content?.description1 || t('about.description1')}
            </p>
            <p className="text-lg text-neutral-700 leading-relaxed">
              {content?.description2 || t('about.description2')}
            </p>
            <p className="text-lg text-neutral-700 leading-relaxed">
              {content?.description3 || t('about.description3')}
            </p>
            <div className="pt-4">
              <a href="#contact" className="btn-primary shadow-lg hover:shadow-primary/50 transition-all hover:scale-105">
                {t('nav.booking')}
              </a>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="heading-sm text-center mb-12">{t('about.features.title')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="text-center space-y-4 group"
              >
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-primary-light/10 group-hover:from-primary/20 group-hover:to-primary-light/20 flex items-center justify-center transition-all group-hover:scale-110 shadow-md group-hover:shadow-lg group-hover:shadow-primary/20">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h4 className="text-xl font-medium text-neutral-900">{feature.title}</h4>
                <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
