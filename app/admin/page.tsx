"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchBookings,
  fetchContactMessages,
  updateBookingStatus,
  updateContactMessage,
  type Booking,
  type ContactMessage,
} from "@/lib/supabase";
import { motion } from "framer-motion";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<"bookings" | "contacts">("bookings");

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?returnTo=/admin`);
    }
  }, [user, loading, router]);

  const content = useMemo(() => {
    if (!user) return null;
    return tab === "bookings" ? <BookingsTab /> : <ContactsTab />;
  }, [tab, user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 py-16">
      <div className="container-custom">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-neutral-900 mb-6">Admin Dashboard</h1>

          <div className="flex gap-2 mb-8">
            <button
              className={`px-4 py-2 rounded-lg border ${tab === "bookings" ? "bg-primary text-white border-primary" : "bg-white border-neutral-200"}`}
              onClick={() => setTab("bookings")}
            >
              Bookings
            </button>
            <button
              className={`px-4 py-2 rounded-lg border ${tab === "contacts" ? "bg-primary text-white border-primary" : "bg-white border-neutral-200"}`}
              onClick={() => setTab("contacts")}
            >
              Contact Messages
            </button>
          </div>

          {content}
        </motion.div>
      </div>
    </div>
  );
}

function BookingsTab() {
  const [status, setStatus] = useState<Booking["status"] | "all">("all");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBookings({ status, page, pageSize: 10 });
      setItems(data);
    } catch (e: any) {
      setError(e?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page]);

  const changeStatus = async (id: string, s: Booking["status"]) => {
    await updateBookingStatus(id, s);
    load();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-primary/10 p-6">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value as any);
          }}
          className="input-field max-w-xs"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-neutral-500 border-b">
              <th className="py-3 pr-4">Name</th>
              <th className="py-3 pr-4">Email</th>
              <th className="py-3 pr-4">Type</th>
              <th className="py-3 pr-4">Date</th>
              <th className="py-3 pr-4">Guests</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((b) => (
              <tr key={b.id} className="border-b last:border-0">
                <td className="py-3 pr-4 font-medium text-neutral-900">{b.name}</td>
                <td className="py-3 pr-4">{b.email}</td>
                <td className="py-3 pr-4">{b.event_type || "-"}</td>
                <td className="py-3 pr-4">{b.event_date || "-"}</td>
                <td className="py-3 pr-4">{b.guests ?? 0}</td>
                <td className="py-3 pr-4 capitalize">{b.status}</td>
                <td className="py-3 pr-4">
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 rounded bg-neutral-100 hover:bg-neutral-200"
                      onClick={() => changeStatus(b.id, "pending")}
                    >
                      Pending
                    </button>
                    <button
                      className="px-3 py-1 rounded bg-green-100 text-green-800 hover:bg-green-200"
                      onClick={() => changeStatus(b.id, "confirmed")}
                    >
                      Confirm
                    </button>
                    <button
                      className="px-3 py-1 rounded bg-red-100 text-red-800 hover:bg-red-200"
                      onClick={() => changeStatus(b.id, "cancelled")}
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-6">
        <button
          className="px-4 py-2 rounded border border-neutral-200 bg-white disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <div className="text-sm text-neutral-600">Page {page}</div>
        <button
          className="px-4 py-2 rounded border border-neutral-200 bg-white"
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

function ContactsTab() {
  const [status, setStatus] = useState<ContactMessage["status"] | "all">("all");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchContactMessages({ status, page, pageSize: 10 });
      setItems(data);
    } catch (e: any) {
      setError(e?.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page]);

  const save = async (id: string, updates: Partial<Pick<ContactMessage, "status" | "reply">>) => {
    await updateContactMessage(id, updates);
    load();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-primary/10 p-6">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value as any);
          }}
          className="input-field max-w-xs"
        >
          <option value="all">All</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
        </select>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>}

      <div className="space-y-4">
        {items.map((m) => (
          <div key={m.id} className="border border-neutral-200 rounded-xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-medium text-neutral-900">{m.name} <span className="text-neutral-400">• {m.email}</span></div>
                <div className="text-neutral-600 text-sm mt-1">{m.message}</div>
              </div>
              <select
                value={m.status}
                onChange={(e) => save(m.id, { status: e.target.value as any })}
                className="input-field max-w-[160px]"
              >
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
              </select>
            </div>
            <div className="mt-3">
              <textarea
                defaultValue={m.reply || ""}
                onBlur={(e) => save(m.id, { reply: e.target.value })}
                className="input-field w-full"
                placeholder="Reply note (optional)"
                rows={3}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-6">
        <button
          className="px-4 py-2 rounded border border-neutral-200 bg-white disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <div className="text-sm text-neutral-600">Page {page}</div>
        <button
          className="px-4 py-2 rounded border border-neutral-200 bg-white"
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
