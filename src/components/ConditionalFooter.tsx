'use client';

import { usePathname } from 'next/navigation';

export default function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname === '/') return null;
  return (
    <footer className="border-t border-border bg-white py-8 text-center text-xs text-neutral-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="font-bold text-neutral-700">© {new Date().getFullYear()} TalentDash. Real Leveling. Structured Data.</p>
        <p className="mt-1 text-neutral-400">All rights reserved. TalentDash is a career intelligence platform designed to serve structured, action-ready data at internet scale.</p>
      </div>
    </footer>
  );
}
