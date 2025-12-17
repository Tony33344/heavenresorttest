"use client";

import { useEffect, useState } from "react";
import { getPublicServices, type Service } from "@/lib/supabase";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";

export default function ServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicServices()
      .then((data) => setItems(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 py-16">
      <div className="container-custom">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">Services</h1>
          <p className="text-neutral-600 mb-10">Explore our offerings and curated experiences.</p>

          {loading ? (
            <div>Loading...</div>
          ) : items.length === 0 ? (
            <div className="text-neutral-600">No services published yet.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((s) => (
                <div key={s.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-neutral-200 flex flex-col">
                  {s.images?.[0] ? (
                    <img src={s.images[0]} alt={s.title} className="w-full h-48 object-cover" />
                  ) : (
                    <div className="w-full h-48 bg-neutral-100" />
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-xl font-semibold text-neutral-900 mb-1">{s.title}</h2>
                    <div className="text-neutral-500 text-sm mb-4">/{s.slug}</div>
                    {s.description && (
                      <p className="text-neutral-700 line-clamp-4 mb-4">{s.description}</p>
                    )}
                    <div className="mt-auto flex items-center justify-between">
                      <div className="text-primary font-semibold">
                        {s.price_text ? s.price_text : s.price != null ? formatPrice(s.price) : ''}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
