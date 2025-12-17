"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { fetchMedia, createMedia, deleteMedia, updateMediaOrder, type MediaItem } from "@/lib/supabase";

export default function AdminMediaPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login?returnTo=/admin/media");
  }, [user, loading, router]);

  if (!user) return null;

  return (
    <div className="container-custom pt-8 pb-16">
      <h1 className="text-3xl font-bold text-neutral-900 mb-6">Media</h1>
      <MediaManager />
    </div>
  );
}

function MediaManager() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMedia();
      setItems(data);
    } catch (e: any) {
      setError(e?.message || "Failed to load media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    if (!url) return;
    await createMedia(url, title || undefined, tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : []);
    setUrl("");
    setTitle("");
    setTags("");
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this media item?")) return;
    await deleteMedia(id);
    await load();
  };

  const move = async (idx: number, dir: -1 | 1) => {
    const arr = [...items];
    const ni = idx + dir;
    if (ni < 0 || ni >= arr.length) return;
    const a = arr[idx];
    const b = arr[ni];
    await updateMediaOrder(a.id, b.order_index);
    await updateMediaOrder(b.id, a.order_index);
    await load();
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Add Media (by URL)</h2>
        <div className="space-y-3">
          <input className="input-field" placeholder="Image URL" value={url} onChange={(e) => setUrl(e.target.value)} />
          <input className="input-field" placeholder="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input className="input-field" placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
          <button className="btn-primary w-full" onClick={add}>Add</button>
        </div>
      </div>

      <div className="lg:col-span-2">
        {loading && <div>Loading...</div>}
        {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((m, idx) => (
            <div key={m.id} className="border rounded-xl overflow-hidden bg-white">
              <img src={m.url} alt={m.title || ''} className="w-full h-40 object-cover" />
              <div className="p-3 text-sm">
                <div className="font-medium truncate" title={m.title || ''}>{m.title || 'Untitled'}</div>
                <div className="text-neutral-500 truncate" title={m.url}>{m.url}</div>
                <div className="flex gap-2 mt-2">
                  <button className="px-2 py-1 rounded border bg-white" onClick={() => move(idx, -1)}>↑</button>
                  <button className="px-2 py-1 rounded border bg-white" onClick={() => move(idx, 1)}>↓</button>
                  <button className="px-2 py-1 rounded border bg-red-100 text-red-700 ml-auto" onClick={() => remove(m.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
