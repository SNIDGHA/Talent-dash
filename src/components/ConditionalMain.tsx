'use client';

import { usePathname } from 'next/navigation';

export default function ConditionalMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Landing page manages its own layout and padding
  if (pathname === '/') {
    return <>{children}</>;
  }
  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {children}
    </div>
  );
}
