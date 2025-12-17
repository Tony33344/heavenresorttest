'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminNav() {
  const pathname = usePathname();
  const link = (href: string, label: string) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
          active
            ? 'bg-primary text-white border-primary'
            : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-100'
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="w-full border-b-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary-light/5 backdrop-blur sticky top-[88px] md:top-[96px] z-40 shadow-md mt-8">
      <div className="container-custom py-5 flex items-center gap-3 overflow-x-auto">
        <div className="text-xs font-bold text-primary uppercase tracking-wider mr-4 whitespace-nowrap">
          Admin Panel
        </div>
        {link('/admin', 'Dashboard')}
        {link('/admin/content', 'Content')}
        {link('/admin/events', 'Events')}
        {link('/admin/accommodation', 'Accommodation')}
        {link('/admin/packages', 'Packages')}
        {link('/admin/services', 'Services')}
        {link('/admin/gallery', 'Gallery')}
        {link('/admin/media', 'Media')}
        <div className="ml-auto" />
        <Link href="/" className="px-4 py-2 rounded-lg text-sm font-medium border-2 border-primary bg-white text-primary hover:bg-primary hover:text-white transition-all whitespace-nowrap">
          ← View Site
        </Link>
      </div>
    </div>
  );
}
