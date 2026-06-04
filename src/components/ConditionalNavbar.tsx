'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function ConditionalNavbar() {
  const pathname = usePathname();
  // Hide the full app navbar on the landing page — it has its own header
  if (pathname === '/') return null;
  return <Navbar />;
}
