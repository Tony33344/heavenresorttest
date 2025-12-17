"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { adminFetchPackages, createPackage, updatePackage, deletePackage, type Package } from "@/lib/supabase";

export default function AdminPackagesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.replace("/login?returnTo=/admin/packages");
  }, [user, loading, router]);

  const load = async () => {
    setIsLoading(true);
    const data = await adminFetchPackages();
    setItems(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) load();
  }, [user]);

  const onCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await createPackage({
      name_sl: String(fd.get('name_sl') || ''),
      name_en: String(fd.get('name_en') || ''),
      description_sl: String(fd.get('description_sl') || ''),
      description_en: String(fd.get('description_en') || ''),
      price: fd.get('price') ? Number(fd.get('price')) : undefined,
      currency: String(fd.get('currency') || 'EUR'),
      price_text_sl: String(fd.get('price_text_sl') || '') || undefined,
      price_text_en: String(fd.get('price_text_en') || '') || undefined,
      duration_days: fd.get('duration_days') ? Number(fd.get('duration_days')) : undefined,
      includes_sl: [],
      includes_en: [],
      image_url: String(fd.get('image_url') || '') || undefined,
      featured: fd.get('featured') === 'on',
      order_index: 9999,
      published: fd.get('published') === 'on',
    });
    e.currentTarget.reset();
    await load();
  };

  if (!user) return null;

  return (
    <div className="container-custom pt-8 pb-16">
      <h1 className="text-3xl font-bold text-neutral-900 mb-6">Packages / Paketi</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Add Package</h2>
          <form onSubmit={onCreate} className="space-y-3">
            <input name="name_sl" placeholder="Name (SL)" className="input-field" required />
            <input name="name_en" placeholder="Name (EN)" className="input-field" required />
            <textarea name="description_sl" placeholder="Description (SL)" className="input-field" rows={3} />
            <textarea name="description_en" placeholder="Description (EN)" className="input-field" rows={3} />
            <input name="price" type="number" step="0.01" placeholder="Price" className="input-field" />
            <input name="currency" placeholder="Currency" defaultValue="EUR" className="input-field" />
            <input name="price_text_sl" placeholder="Price Text (SL)" className="input-field" />
            <input name="price_text_en" placeholder="Price Text (EN)" className="input-field" />
            <input name="duration_days" type="number" placeholder="Duration (days)" className="input-field" />
            <input name="image_url" placeholder="Image URL" className="input-field" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="featured" /> Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="published" /> Published
            </label>
            <button type="submit" className="btn-primary w-full">Create</button>
          </form>
        </div>
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? <div>Loading...</div> : items.map(pkg => <PackageItem key={pkg.id} pkg={pkg} onSaved={load} />)}
        </div>
      </div>
    </div>
  );
}

function PackageItem({ pkg, onSaved }: { pkg: Package; onSaved: () => void }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [includesSl, setIncludesSl] = useState<string>(pkg.includes_sl?.join(', ') || '');
  const [includesEn, setIncludesEn] = useState<string>(pkg.includes_en?.join(', ') || '');

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    await updatePackage(pkg.id, {
      name_sl: String(fd.get('name_sl') || pkg.name_sl),
      name_en: String(fd.get('name_en') || pkg.name_en),
      description_sl: String(fd.get('description_sl') || ''),
      description_en: String(fd.get('description_en') || ''),
      price: fd.get('price') ? Number(fd.get('price')) : undefined,
      currency: String(fd.get('currency') || 'EUR'),
      price_text_sl: String(fd.get('price_text_sl') || ''),
      price_text_en: String(fd.get('price_text_en') || ''),
      duration_days: fd.get('duration_days') ? Number(fd.get('duration_days')) : undefined,
      includes_sl: includesSl.split(',').map(s => s.trim()).filter(Boolean),
      includes_en: includesEn.split(',').map(s => s.trim()).filter(Boolean),
      image_url: String(fd.get('image_url') || ''),
      featured: fd.get('featured') === 'on',
      published: fd.get('published') === 'on',
    });
    setSaving(false);
    setEditing(false);
    onSaved();
  };

  const remove = async () => {
    if (!confirm('Delete this package?')) return;
    await deletePackage(pkg.id);
    onSaved();
  };

  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-semibold">{pkg.name_sl} / {pkg.name_en}</div>
          <div className="text-sm text-neutral-500">
            {pkg.featured && <span className="text-primary mr-2">★ Featured</span>}
            {pkg.published ? 'Published' : 'Draft'}
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded border" onClick={() => setEditing(!editing)}>{editing ? 'Close' : 'Edit'}</button>
          <button className="px-3 py-2 rounded border bg-red-100 text-red-700" onClick={remove}>Delete</button>
        </div>
      </div>
      {editing && (
        <form onSubmit={save} className="space-y-3 mt-4">
          <div className="grid md:grid-cols-2 gap-3">
            <input name="name_sl" defaultValue={pkg.name_sl} className="input-field" placeholder="Name (SL)" />
            <input name="name_en" defaultValue={pkg.name_en} className="input-field" placeholder="Name (EN)" />
          </div>
          <textarea name="description_sl" defaultValue={pkg.description_sl || ''} className="input-field" rows={3} placeholder="Description (SL)" />
          <textarea name="description_en" defaultValue={pkg.description_en || ''} className="input-field" rows={3} placeholder="Description (EN)" />
          <div className="grid md:grid-cols-3 gap-3">
            <input name="price" type="number" step="0.01" defaultValue={pkg.price ?? ''} className="input-field" placeholder="Price" />
            <input name="currency" defaultValue={pkg.currency || 'EUR'} className="input-field" placeholder="Currency" />
            <input name="duration_days" type="number" defaultValue={pkg.duration_days ?? ''} className="input-field" placeholder="Duration (days)" />
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <input name="price_text_sl" defaultValue={pkg.price_text_sl || ''} className="input-field" placeholder="Price Text (SL)" />
            <input name="price_text_en" defaultValue={pkg.price_text_en || ''} className="input-field" placeholder="Price Text (EN)" />
          </div>
          <input name="image_url" defaultValue={pkg.image_url || ''} className="input-field" placeholder="Image URL" />
          <div className="grid md:grid-cols-2 gap-3">
            <input value={includesSl} onChange={e => setIncludesSl(e.target.value)} className="input-field" placeholder="Includes (SL, comma-separated)" />
            <input value={includesEn} onChange={e => setIncludesEn(e.target.value)} className="input-field" placeholder="Includes (EN, comma-separated)" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="featured" defaultChecked={pkg.featured} /> Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked={pkg.published} /> Published
          </label>
          <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save'}</button>
        </form>
      )}
    </div>
  );
}
