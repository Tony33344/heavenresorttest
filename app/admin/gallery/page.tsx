"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { adminFetchGallery, createGalleryImage, updateGalleryImage, deleteGalleryImage, type GalleryImage } from "@/lib/supabase";

export default function AdminGalleryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.replace("/login?returnTo=/admin/gallery");
  }, [user, loading, router]);

  const load = async () => {
    setIsLoading(true);
    const data = await adminFetchGallery();
    setItems(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) load();
  }, [user]);

  const onCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await createGalleryImage({
      url: String(fd.get('url') || ''),
      title_sl: String(fd.get('title_sl') || '') || undefined,
      title_en: String(fd.get('title_en') || '') || undefined,
      category: String(fd.get('category') || '') || undefined,
      order_index: 9999,
      published: fd.get('published') === 'on',
    });
    e.currentTarget.reset();
    await load();
  };

  if (!user) return null;

  return (
    <div className="container-custom pt-8 pb-16">
      <h1 className="text-3xl font-bold text-neutral-900 mb-6">Gallery / Galerija</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Add Gallery Image</h2>
          <form onSubmit={onCreate} className="space-y-3">
            <input name="url" placeholder="Image URL" className="input-field" required />
            <input name="title_sl" placeholder="Title (SL)" className="input-field" />
            <input name="title_en" placeholder="Title (EN)" className="input-field" />
            <select name="category" className="input-field">
              <option value="">Category</option>
              <option value="venue">Venue</option>
              <option value="events">Events</option>
              <option value="accommodation">Accommodation</option>
              <option value="nature">Nature</option>
              <option value="other">Other</option>
            </select>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="published" defaultChecked /> Published
            </label>
            <button type="submit" className="btn-primary w-full">Add to Gallery</button>
          </form>
        </div>
        <div className="lg:col-span-2">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {items.map(img => <GalleryImageItem key={img.id} img={img} onSaved={load} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GalleryImageItem({ img, onSaved }: { img: GalleryImage; onSaved: () => void }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    await updateGalleryImage(img.id, {
      title_sl: String(fd.get('title_sl') || ''),
      title_en: String(fd.get('title_en') || ''),
      category: String(fd.get('category') || '') || undefined,
      published: fd.get('published') === 'on',
    });
    setSaving(false);
    setEditing(false);
    onSaved();
  };

  const remove = async () => {
    if (!confirm('Delete this image?')) return;
    await deleteGalleryImage(img.id);
    onSaved();
  };

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <img src={img.url} alt={img.title_sl || ''} className="w-full h-48 object-cover" />
      <div className="p-3">
        <div className="text-sm font-medium truncate">{img.title_sl || img.title_en || 'Untitled'}</div>
        <div className="text-xs text-neutral-500">{img.category || 'No category'} • {img.published ? 'Published' : 'Draft'}</div>
        <div className="flex gap-2 mt-2">
          <button className="px-2 py-1 text-xs rounded border bg-white" onClick={() => setEditing(!editing)}>{editing ? 'Close' : 'Edit'}</button>
          <button className="px-2 py-1 text-xs rounded border bg-red-100 text-red-700" onClick={remove}>Delete</button>
        </div>
        {editing && (
          <form onSubmit={save} className="space-y-2 mt-3">
            <input name="title_sl" defaultValue={img.title_sl || ''} className="input-field text-sm" placeholder="Title (SL)" />
            <input name="title_en" defaultValue={img.title_en || ''} className="input-field text-sm" placeholder="Title (EN)" />
            <select name="category" defaultValue={img.category || ''} className="input-field text-sm">
              <option value="">Category</option>
              <option value="venue">Venue</option>
              <option value="events">Events</option>
              <option value="accommodation">Accommodation</option>
              <option value="nature">Nature</option>
              <option value="other">Other</option>
            </select>
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" name="published" defaultChecked={img.published} /> Published
            </label>
            <button type="submit" disabled={saving} className="btn-primary w-full text-sm">{saving ? 'Saving...' : 'Save'}</button>
          </form>
        )}
      </div>
    </div>
  );
}
