'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Check, Heart, Briefcase, Sparkles, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Packages() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const packages = [
    {
      icon: Heart,
      title: t('packages.wedding.title'),
      price: t('packages.wedding.price'),
      features: t('packages.wedding.features'),
      color: 'from-pink-500 to-rose-500',
      featured: true,
    },
    {
      icon: Briefcase,
      title: t('packages.corporate.title'),
      price: t('packages.corporate.price'),
      features: t('packages.corporate.features'),
      color: 'from-blue-500 to-indigo-500',
      featured: false,
    },
    {
      icon: Sparkles,
      title: t('packages.retreat.title'),
      price: t('packages.retreat.price'),
      features: t('packages.retreat.features'),
      color: 'from-primary to-primary-dark',
      featured: false,
    },
    {
      icon: MessageCircle,
      title: t('packages.custom.title'),
      price: t('packages.custom.price'),
      features: t('packages.custom.features'),
      color: 'from-primary-light to-primary',
      featured: false,
    },
  ];

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
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`card-elegant overflow-hidden ${
                pkg.featured ? 'ring-2 ring-primary transform lg:scale-105' : ''
              }`}
            >
              {/* Header */}
              <div className={`bg-gradient-to-br ${pkg.color} p-8 text-white`}>
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                  <pkg.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-light mb-2">{pkg.title}</h3>
                <div className="text-3xl font-light">{pkg.price}</div>
              </div>

              {/* Features */}
              <div className="p-8">
                <ul className="space-y-4">
                  {Array.isArray(pkg.features) && pkg.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-neutral-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

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
          ))}
        </div>
      </div>
    </section>
  );
}
