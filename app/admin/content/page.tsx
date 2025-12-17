"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { getContentBlock, upsertContentBlock } from "@/lib/supabase";

export default function AdminContentPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login?returnTo=/admin/content");
  }, [user, loading, router]);

  if (!user) return null;

  return (
    <div className="container-custom pt-8 pb-16">
      <h1 className="text-3xl font-bold text-neutral-900 mb-6">Website Content</h1>
      <div className="space-y-8">
        <ContentSection section="hero" title="Hero Section" />
        <ContentSection section="about" title="About Section" />
        <ContentSection section="venue" title="Venue Section" />
        <ContentSection section="footer" title="Footer" />
      </div>
    </div>
  );
}

function ContentSection({ section, title }: { section: string; title: string }) {
  const [slData, setSlData] = useState<Record<string, any>>({});
  const [enData, setEnData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      getContentBlock(section, 'sl'),
      getContentBlock(section, 'en')
    ]).then(([sl, en]) => {
      setSlData(sl?.data || {});
      setEnData(en?.data || {});
      setLoading(false);
    });
  }, [section]);

  const save = async () => {
    setSaving(true);
    try {
      await Promise.all([
        upsertContentBlock(section, 'sl', slData),
        upsertContentBlock(section, 'en', enData)
      ]);
      alert('Saved!');
    } catch (e: any) {
      alert('Error: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="bg-white rounded-xl p-6">Loading...</div>;

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-neutral-700 mb-3">Slovenian (SL)</h3>
          <JsonEditor data={slData} onChange={setSlData} />
        </div>
        <div>
          <h3 className="text-sm font-medium text-neutral-700 mb-3">English (EN)</h3>
          <JsonEditor data={enData} onChange={setEnData} />
        </div>
      </div>
      <button onClick={save} disabled={saving} className="btn-primary mt-6">
        {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
}

function JsonEditor({ data, onChange }: { data: Record<string, any>; onChange: (d: Record<string, any>) => void }) {
  const keys = Object.keys(data);
  
  const update = (key: string, value: any) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-3">
      {keys.map(key => (
        <div key={key}>
          <label className="block text-xs font-medium text-neutral-600 mb-1">{key}</label>
          {typeof data[key] === 'string' && data[key].length > 60 ? (
            <textarea
              className="input-field"
              rows={3}
              value={data[key]}
              onChange={(e) => update(key, e.target.value)}
            />
          ) : (
            <input
              className="input-field"
              value={data[key]}
              onChange={(e) => update(key, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
