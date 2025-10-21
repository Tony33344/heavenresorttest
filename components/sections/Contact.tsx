'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Send } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useForm } from 'react-hook-form';

type FormData = {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  guests: string;
  message: string;
};

export default function Contact() {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Here you would integrate with Supabase or your backend
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Form data:', data);
      setSubmitStatus('success');
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-gradient-to-b from-white to-neutral-50 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary-light/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg mb-4 text-neutral-900">{t('contact.title')}</h2>
          <p className="text-xl text-primary font-medium tracking-wide">{t('contact.subtitle')}</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                    {t('contact.form.name')} *
                  </label>
                  <input
                    {...register('name', { required: true })}
                    type="text"
                    id="name"
                    className="input-field"
                    placeholder={t('contact.form.name')}
                  />
                  {errors.name && <span className="text-red-500 text-sm">This field is required</span>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                    {t('contact.form.email')} *
                  </label>
                  <input
                    {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                    type="email"
                    id="email"
                    className="input-field"
                    placeholder={t('contact.form.email')}
                  />
                  {errors.email && <span className="text-red-500 text-sm">Valid email required</span>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                    {t('contact.form.phone')}
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    id="phone"
                    className="input-field"
                    placeholder={t('contact.form.phone')}
                  />
                </div>

                <div>
                  <label htmlFor="eventType" className="block text-sm font-medium text-neutral-700 mb-2">
                    {t('contact.form.eventType')}
                  </label>
                  <select
                    {...register('eventType')}
                    id="eventType"
                    className="input-field"
                  >
                    <option value="">Select...</option>
                    <option value="wedding">Wedding</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="workshop">Workshop</option>
                    <option value="private">Private Event</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="eventDate" className="block text-sm font-medium text-neutral-700 mb-2">
                    {t('contact.form.eventDate')}
                  </label>
                  <input
                    {...register('eventDate')}
                    type="date"
                    id="eventDate"
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="guests" className="block text-sm font-medium text-neutral-700 mb-2">
                    {t('contact.form.guests')}
                  </label>
                  <input
                    {...register('guests')}
                    type="number"
                    id="guests"
                    className="input-field"
                    placeholder="10"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
                  {t('contact.form.message')} *
                </label>
                <textarea
                  {...register('message', { required: true })}
                  id="message"
                  rows={6}
                  className="input-field"
                  placeholder={t('contact.form.message')}
                />
                {errors.message && <span className="text-red-500 text-sm">This field is required</span>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full flex items-center justify-center space-x-2 shadow-lg hover:shadow-primary/50 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{isSubmitting ? t('contact.form.sending') : t('contact.form.submit')}</span>
                <Send className="w-4 h-4" />
              </button>

              {submitStatus === 'success' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                  {t('contact.form.success')}
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                  {t('contact.form.error')}
                </div>
              )}
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Info Cards */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-primary/10">
              <h3 className="text-2xl font-semibold mb-6 text-neutral-900">{t('contact.info.title')}</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary-light/10 group-hover:from-primary/20 group-hover:to-primary-light/20 rounded-full flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-neutral-900">Address</h4>
                    <p className="text-neutral-600 leading-relaxed">{t('contact.info.address')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary-light/10 group-hover:from-primary/20 group-hover:to-primary-light/20 rounded-full flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-neutral-900">Email</h4>
                    <a href={`mailto:${t('contact.info.email')}`} className="text-neutral-600 hover:text-primary transition-colors">
                      {t('contact.info.email')}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary-light/10 group-hover:from-primary/20 group-hover:to-primary-light/20 rounded-full flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-neutral-900">Phone</h4>
                    <a href={`tel:${t('contact.info.phone')}`} className="text-neutral-600 hover:text-primary transition-colors">
                      {t('contact.info.phone')}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-primary/10">
              <h3 className="text-2xl font-semibold mb-4 text-neutral-900">{t('contact.location.title')}</h3>
              <p className="text-neutral-600 mb-6 leading-relaxed">{t('contact.location.description')}</p>
              
              {/* Map placeholder - integrate with Google Maps or similar */}
              <div className="w-full h-64 bg-neutral-200 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11034.123456789!2d15.6!3d46.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDbCsDA2JzAwLjAiTiAxNcKwMzYnMDAuMCJF!5e0!3m2!1sen!2ssi!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="HEAVEN Resort Location"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
