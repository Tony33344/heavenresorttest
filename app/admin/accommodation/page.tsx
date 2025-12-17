"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { adminFetchAccommodation, createAccommodation, updateAccommodation, deleteAccommodation, fetchMedia, type AccommodationUnit, type MediaItem } from "@/lib/supabase";

export default function AdminAccommodationPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<AccommodationUnit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.replace("/login?returnTo=/admin/accommodation");
  }, [user, loading, router]);

  const load = async () => {
    setIsLoading(true);
    const data = await adminFetchAccommodation();
    setItems(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) load();
  }, [user]);

  const onCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await createAccommodation({
      name_sl: String(fd.get('name_sl') || ''),
      name_en: String(fd.get('name_en') || ''),
      description_sl: String(fd.get('description_sl') || ''),
      description_en: String(fd.get('description_en') || ''),
      price: fd.get('price') ? Number(fd.get('price')) : undefined,
      currency: String(fd.get('currency') || 'EUR'),
      price_text_sl: String(fd.get('price_text_sl') || '') || undefined,
      price_text_en: String(fd.get('price_text_en') || '') || undefined,
      capacity: fd.get('capacity') ? Number(fd.get('capacity')) : undefined,
      images: [],
      amenities_sl: [],
      amenities_en: [],
      order_index: 9999,
      published: fd.get('published') === 'on',
    });
    e.currentTarget.reset();
    await load();
  };

  if (!user) return null;

  return (
    <div className="container-custom pt-8 pb-16">
      <h1 className="text-3xl font-bold text-neutral-900 mb-6">Accommodation / Nastanitev</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Add Unit</h2>
          <form onSubmit={onCreate} className="space-y-3">
            <input name="name_sl" placeholder="Name (SL)" className="input-field" required />
            <input name="name_en" placeholder="Name (EN)" className="input-field" required />
            <textarea name="description_sl" placeholder="Description (SL)" className="input-field" rows={3} />
            <textarea name="description_en" placeholder="Description (EN)" className="input-field" rows={3} />
            <input name="price" type="number" step="0.01" placeholder="Price" className="input-field" />
            <input name="currency" placeholder="Currency" defaultValue="EUR" className="input-field" />
            <input name="price_text_sl" placeholder="Price Text (SL)" className="input-field" />
            <input name="price_text_en" placeholder="Price Text (EN)" className="input-field" />
            <input name="capacity" type="number" placeholder="Capacity (guests)" className="input-field" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="published" /> Published
            </label>
            <button type="submit" className="btn-primary w-full">Create</button>
          </form>
        </div>
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? <div>Loading...</div> : items.map(unit => <AccommodationItem key={unit.id} unit={unit} onSaved={load} />)}
        </div>
      </div>
    </div>
  );
}

function AccommodationItem({ unit, onSaved }: { unit: AccommodationUnit; onSaved: () => void }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<string[]>(unit.images || []);
  const [amenitiesSl, setAmenitiesSl] = useState<string>(unit.amenities_sl?.join(', ') || '');
  const [amenitiesEn, setAmenitiesEn] = useState<string>(unit.amenities_en?.join(', ') || '');
  const [media, setMedia] = useState<MediaItem[]>([]);

  useEffect(() => {
    if (editing) fetchMedia().then(setMedia).catch(() => setMedia([]));
  }, [editing]);

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    await updateAccommodation(unit.id, {
      name_sl: String(fd.get('name_sl') || unit.name_sl),
      name_en: String(fd.get('name_en') || unit.name_en),
      description_sl: String(fd.get('description_sl') || ''),
      description_en: String(fd.get('description_en') || ''),
      price: fd.get('price') ? Number(fd.get('price')) : undefined,
      currency: String(fd.get('currency') || 'EUR'),
      price_text_sl: String(fd.get('price_text_sl') || ''),
      price_text_en: String(fd.get('price_text_en') || ''),
      capacity: fd.get('capacity') ? Number(fd.get('capacity')) : undefined,
      images,
      amenities_sl: amenitiesSl.split(',').map(s => s.trim()).filter(Boolean),
      amenities_en: amenitiesEn.split(',').map(s => s.trim()).filter(Boolean),
      published: fd.get('published') === 'on',
    });
    setSaving(false);
    setEditing(false);
    onSaved();
  };

  const remove = async () => {
    if (!confirm('Delete this unit?')) return;
    await deleteAccommodation(unit.id);
    onSaved();
  };

  const addImageUrl = (url: string) => {
    if (url && !images.includes(url)) setImages([...images, url]);
  };

  const removeImage = (url: string) => setImages(images.filter(u => u !== url));

  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-semibold">{unit.name_sl} / {unit.name_en}</div>
          <div className="text-sm text-neutral-500">{unit.published ? 'Published' : 'Draft'}</div>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded border" onClick={() => setEditing(!editing)}>{editing ? 'Close' : 'Edit'}</button>
          <button className="px-3 py-2 rounded border bg-red-100 text-red-700" onClick={remove}>Delete</button>
        </div>
      </div>
      {editing && (
        <form onSubmit={save} className="space-y-3 mt-4">
          <div className="grid md:grid-cols-2 gap-3">
            <input name="name_sl" defaultValue={unit.name_sl} className="input-field" placeholder="Name (SL)" />
            <input name="name_en" defaultValue={unit.name_en} className="input-field" placeholder="Name (EN)" />
          </div>
          <textarea name="description_sl" defaultValue={unit.description_sl || ''} className="input-field" rows={3} placeholder="Description (SL)" />
          <textarea name="description_en" defaultValue={unit.description_en || ''} className="input-field" rows={3} placeholder="Description (EN)" />
          <div className="grid md:grid-cols-3 gap-3">
            <input name="price" type="number" step="0.01" defaultValue={unit.price ?? ''} className="input-field" placeholder="Price" />
            <input name="currency" defaultValue={unit.currency || 'EUR'} className="input-field" placeholder="Currency" />
            <input name="capacity" type="number" defaultValue={unit.capacity ?? ''} className="input-field" placeholder="Capacity" />
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <input name="price_text_sl" defaultValue={unit.price_text_sl || ''} className="input-field" placeholder="Price Text (SL)" />
            <input name="price_text_en" defaultValue={unit.price_text_en || ''} className="input-field" placeholder="Price Text (EN)" />
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <input value={amenitiesSl} onChange={e => setAmenitiesSl(e.target.value)} className="input-field" placeholder="Amenities (SL, comma-separated)" />
            <input value={amenitiesEn} onChange={e => setAmenitiesEn(e.target.value)} className="input-field" placeholder="Amenities (EN, comma-separated)" />
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Images</div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {images.map(url => (
                <div key={url} className="relative group border rounded overflow-hidden">
                  <img src={url} alt="" className="w-full h-24 object-cover" />
                  <button type="button" onClick={() => removeImage(url)} className="absolute inset-0 bg-black/50 text-white text-xs opacity-0 group-hover:opacity-100">Delete</button>
                </div>
              ))}
            </div>
            <ImageSelector media={media} onSelect={addImageUrl} />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked={unit.published} /> Published
          </label>
          <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save'}</button>
        </form>
      )}
    </div>
  );
}

function ImageSelector({ media, onSelect }: { media: MediaItem[]; onSelect: (url: string) => void }) {
  const [url, setUrl] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <div className="bg-neutral-50 border rounded p-3">
      <div className="flex gap-2 mb-2">
        <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Image URL" className="input-field flex-1" />
        <button type="button" onClick={() => { onSelect(url); setUrl(''); }} className="btn-secondary">Add</button>
      </div>
      <div className="grid grid-cols-4 gap-2 max-h-40 overflow-auto">
        {media.map(m => (
          <button type="button" key={m.id} onClick={() => { onSelect(m.url); }} className="border rounded overflow-hidden hover:ring-2 ring-primary">
            <img src={m.url} alt="" className="w-full h-16 object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
