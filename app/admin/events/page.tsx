"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { adminFetchEvents, createEvent, updateEvent, deleteEvent, type Event } from "@/lib/supabase";

export default function AdminEventsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.replace("/login?returnTo=/admin/events");
  }, [user, loading, router]);

  const load = async () => {
    setIsLoading(true);
    const data = await adminFetchEvents();
    setItems(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) load();
  }, [user]);

  const onCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await createEvent({
      title_sl: String(fd.get('title_sl') || ''),
      title_en: String(fd.get('title_en') || ''),
      description_sl: String(fd.get('description_sl') || ''),
      description_en: String(fd.get('description_en') || ''),
      image_url: String(fd.get('image_url') || '') || undefined,
      capacity: fd.get('capacity') ? Number(fd.get('capacity')) : undefined,
      duration_hours: fd.get('duration_hours') ? Number(fd.get('duration_hours')) : undefined,
      order_index: 9999,
      published: fd.get('published') === 'on',
    });
    e.currentTarget.reset();
    await load();
  };

  if (!user) return null;

  return (
    <div className="container-custom pt-8 pb-16">
      <h1 className="text-3xl font-bold text-neutral-900 mb-6">Events / Dogodki</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Add Event</h2>
          <form onSubmit={onCreate} className="space-y-3">
            <input name="title_sl" placeholder="Title (SL)" className="input-field" required />
            <input name="title_en" placeholder="Title (EN)" className="input-field" required />
            <textarea name="description_sl" placeholder="Description (SL)" className="input-field" rows={3} />
            <textarea name="description_en" placeholder="Description (EN)" className="input-field" rows={3} />
            <input name="image_url" placeholder="Image URL" className="input-field" />
            <input name="capacity" type="number" placeholder="Capacity" className="input-field" />
            <input name="duration_hours" type="number" placeholder="Duration (hours)" className="input-field" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="published" /> Published
            </label>
            <button type="submit" className="btn-primary w-full">Create</button>
          </form>
        </div>
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? <div>Loading...</div> : items.map(ev => <EventItem key={ev.id} event={ev} onSaved={load} />)}
        </div>
      </div>
    </div>
  );
}

function EventItem({ event, onSaved }: { event: Event; onSaved: () => void }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    await updateEvent(event.id, {
      title_sl: String(fd.get('title_sl') || event.title_sl),
      title_en: String(fd.get('title_en') || event.title_en),
      description_sl: String(fd.get('description_sl') || ''),
      description_en: String(fd.get('description_en') || ''),
      image_url: String(fd.get('image_url') || ''),
      capacity: fd.get('capacity') ? Number(fd.get('capacity')) : undefined,
      duration_hours: fd.get('duration_hours') ? Number(fd.get('duration_hours')) : undefined,
      published: fd.get('published') === 'on',
    });
    setSaving(false);
    setEditing(false);
    onSaved();
  };

  const remove = async () => {
    if (!confirm('Delete this event?')) return;
    await deleteEvent(event.id);
    onSaved();
  };

  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-semibold">{event.title_sl} / {event.title_en}</div>
          <div className="text-sm text-neutral-500">{event.published ? 'Published' : 'Draft'}</div>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded border" onClick={() => setEditing(!editing)}>{editing ? 'Close' : 'Edit'}</button>
          <button className="px-3 py-2 rounded border bg-red-100 text-red-700" onClick={remove}>Delete</button>
        </div>
      </div>
      {editing && (
        <form onSubmit={save} className="space-y-3 mt-4">
          <input name="title_sl" defaultValue={event.title_sl} className="input-field" placeholder="Title (SL)" />
          <input name="title_en" defaultValue={event.title_en} className="input-field" placeholder="Title (EN)" />
          <textarea name="description_sl" defaultValue={event.description_sl || ''} className="input-field" rows={3} placeholder="Description (SL)" />
          <textarea name="description_en" defaultValue={event.description_en || ''} className="input-field" rows={3} placeholder="Description (EN)" />
          <input name="image_url" defaultValue={event.image_url || ''} className="input-field" placeholder="Image URL" />
          <div className="grid grid-cols-2 gap-3">
            <input name="capacity" type="number" defaultValue={event.capacity ?? ''} className="input-field" placeholder="Capacity" />
            <input name="duration_hours" type="number" defaultValue={event.duration_hours ?? ''} className="input-field" placeholder="Duration (hours)" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked={event.published} /> Published
          </label>
          <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save'}</button>
        </form>
      )}
    </div>
  );
}
