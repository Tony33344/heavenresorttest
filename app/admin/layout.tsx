'use client';

import AdminNav from '@/components/admin/AdminNav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <AdminNav />
      <div className="pt-32">{children}</div>
    </div>
  );
}
