"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  adminFetchServices,
  createService,
  updateService,
  deleteService,
  updateServiceOrder,
  fetchMedia,
  type Service,
  type MediaItem,
} from "@/lib/supabase";
import { motion } from "framer-motion";

export default function AdminServicesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login?returnTo=/admin/services");
  }, [user, loading, router]);

  if (!user) return null;

  return (
    <div className="container-custom pt-8 pb-16">
      <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-neutral-900 mb-6">
        Services
      </motion.h1>
      <ServiceManager />
    </div>
  );
}

function ServiceManager() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminFetchServices({ includeUnpublished: true });
      const sorted = [...data].sort((a, b) => a.order_index - b.order_index);
      setItems(sorted);
    } catch (e: any) {
      setError(e?.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("title") || "").trim();
    const slug = String(fd.get("slug") || "").trim();
    const description = String(fd.get("description") || "").trim();
    const price = fd.get("price") ? Number(fd.get("price")) : undefined;
    const currency = (fd.get("currency") as string) || "EUR";
    const price_text = String(fd.get("price_text") || "").trim() || undefined;
    const published = fd.get("published") === "on";

    await createService({
      title,
      slug,
      description,
      price,
      currency,
      price_text,
      images: [],
      order_index: 9999,
      published,
    });

    e.currentTarget.reset();
    await load();
  };

  const move = async (idx: number, dir: -1 | 1) => {
    const arr = [...items];
    const ni = idx + dir;
    if (ni < 0 || ni >= arr.length) return;
    const a = arr[idx];
    const b = arr[ni];
    // swap order indices
    await updateServiceOrder(a.id, b.order_index);
    await updateServiceOrder(b.id, a.order_index);
    await load();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>;

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Add Service</h2>
        <form onSubmit={onCreate} className="space-y-4">
          <input name="title" placeholder="Title" className="input-field" required />
          <input name="slug" placeholder="Slug (unique)" className="input-field" required />
          <textarea name="description" placeholder="Description" className="input-field" rows={3} />
          <div className="grid grid-cols-2 gap-3">
            <input name="price" placeholder="Price (e.g. 3500)" className="input-field" type="number" step="0.01" />
            <input name="currency" defaultValue="EUR" placeholder="Currency" className="input-field" />
          </div>
          <input name="price_text" placeholder="Price Display (e.g. From €3,500)" className="input-field" />
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input type="checkbox" name="published" /> Published
          </label>
          <button className="btn-primary w-full" type="submit">Create</button>
        </form>
      </div>

      <div className="lg:col-span-2 space-y-6">
        {items.map((s, idx) => (
          <ServiceItem key={s.id} svc={s} onSaved={load} onMove={(d) => move(idx, d)} onDeleted={load} />
        ))}
      </div>
    </div>
  );
}

function ServiceItem({ svc, onSaved, onMove, onDeleted }: { svc: Service; onSaved: () => void; onMove: (dir: -1 | 1) => void; onDeleted: () => void }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [images, setImages] = useState<string[]>(svc.images || []);

  useEffect(() => {
    fetchMedia().then(setMedia).catch(() => setMedia([]));
  }, []);

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const patch: Partial<Service> = {
      title: String(fd.get("title") || svc.title),
      slug: String(fd.get("slug") || svc.slug),
      description: String(fd.get("description") || svc.description || ""),
      currency: String(fd.get("currency") || svc.currency || "EUR"),
      price_text: String(fd.get("price_text") || svc.price_text || ""),
      images,
      published: fd.get("published") === "on",
    };
    const priceRaw = fd.get("price") as string;
    if (priceRaw !== null && priceRaw !== "") patch.price = Number(priceRaw);

    await updateService(svc.id, patch);
    setSaving(false);
    setEditing(false);
    onSaved();
  };

  const addImageUrl = (url: string) => {
    if (!url) return;
    setImages((prev) => (prev.includes(url) ? prev : [...prev, url]));
  };

  const addSelectedMedia = (selected: string[]) => {
    setImages((prev) => Array.from(new Set([...prev, ...selected])));
  };

  const removeImage = (url: string) => setImages((prev) => prev.filter((u) => u !== url));
  const moveImage = (i: number, d: -1 | 1) =>
    setImages((prev) => {
      const ni = i + d;
      if (ni < 0 || ni >= prev.length) return prev;
      const arr = [...prev];
      const tmp = arr[i];
      arr[i] = arr[ni];
      arr[ni] = tmp;
      return arr;
    });

  const destroy = async () => {
    if (!confirm("Delete this service?")) return;
    await deleteService(svc.id);
    onDeleted();
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-lg font-semibold text-neutral-900">{svc.title}</div>
          <div className="text-sm text-neutral-500">/{svc.slug}</div>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded border bg-white" onClick={() => onMove(-1)}>↑</button>
          <button className="px-3 py-2 rounded border bg-white" onClick={() => onMove(1)}>↓</button>
          <button className="px-3 py-2 rounded border bg-white" onClick={() => setEditing((v) => !v)}>{editing ? "Close" : "Edit"}</button>
          <button className="px-3 py-2 rounded border bg-red-100 text-red-700" onClick={destroy}>Delete</button>
        </div>
      </div>

      {editing && (
        <form onSubmit={save} className="mt-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input name="title" defaultValue={svc.title} className="input-field" />
            <input name="slug" defaultValue={svc.slug} className="input-field" />
          </div>
          <textarea name="description" defaultValue={svc.description || ""} rows={4} className="input-field" />
          <div className="grid md:grid-cols-3 gap-4">
            <input name="price" type="number" step="0.01" defaultValue={svc.price ?? undefined} className="input-field" placeholder="Price" />
            <input name="currency" defaultValue={svc.currency || "EUR"} className="input-field" placeholder="Currency" />
            <input name="price_text" defaultValue={svc.price_text || ""} className="input-field" placeholder="Price Text" />
          </div>
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input name="published" type="checkbox" defaultChecked={svc.published} /> Published
          </label>

          <div>
            <div className="text-sm font-medium mb-2">Images</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              {images.map((url, i) => (
                <div key={url} className="relative group border rounded overflow-hidden">
                  <img src={url} alt="" className="w-full h-28 object-cover" />
                  <div className="absolute inset-x-0 bottom-0 flex justify-between p-1 bg-black/50 opacity-0 group-hover:opacity-100 transition">
                    <button type="button" className="text-white text-xs px-2" onClick={() => moveImage(i, -1)}>↑</button>
                    <button type="button" className="text-red-300 text-xs px-2" onClick={() => removeImage(url)}>Delete</button>
                    <button type="button" className="text-white text-xs px-2" onClick={() => moveImage(i, 1)}>↓</button>
                  </div>
                </div>
              ))}
            </div>

            <AddImagesPanel media={media} onAddUrl={addImageUrl} onAddSelection={addSelectedMedia} />
          </div>

          <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving..." : "Save"}</button>
        </form>
      )}
    </div>
  );
}

function AddImagesPanel({ media, onAddUrl, onAddSelection }: { media: MediaItem[]; onAddUrl: (url: string) => void; onAddSelection: (urls: string[]) => void }) {
  const [url, setUrl] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  const addSel = () => onAddSelection(Object.entries(selected).filter(([, v]) => v).map(([id]) => media.find((m) => m.id === id)?.url || "").filter(Boolean));

  return (
    <div className="bg-neutral-50 border rounded p-3">
      <div className="flex gap-2 mb-3">
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste image URL" className="input-field flex-1" />
        <button type="button" className="btn-secondary" onClick={() => { onAddUrl(url); setUrl(""); }}>Add URL</button>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 max-h-64 overflow-auto">
        {media.map((m) => (
          <button type="button" key={m.id} onClick={() => toggle(m.id)} className={`relative border rounded overflow-hidden ${selected[m.id] ? 'ring-2 ring-primary' : ''}`}>
            <img src={m.url} alt={m.title || ''} className="w-full h-20 object-cover" />
          </button>
        ))}
      </div>
      <div className="mt-3">
        <button type="button" className="btn-primary" onClick={addSel}>Add Selected</button>
      </div>
    </div>
  );
}
