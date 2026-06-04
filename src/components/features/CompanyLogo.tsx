'use client';

import React, { useState } from 'react';

interface CompanyLogoProps {
  logo?: string | null;
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function CompanyLogo({ logo, name, className = '', size = 'md' }: CompanyLogoProps) {
  const [error, setError] = useState(false);

  // Generate color palette based on company name hash
  const getColors = (companyName: string) => {
    const cleanName = companyName.trim();
    const hash = cleanName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    const palettes = [
      { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100' },
      { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100' },
      { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' },
      { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
      { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-100' },
      { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-100' },
      { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
      { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100' },
      { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-100' },
      { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-100' },
    ];
    
    return palettes[hash % palettes.length];
  };

  const getInitials = (companyName: string) => {
    const clean = companyName.trim().toUpperCase();
    if (!clean) return '?';
    const words = clean.split(/\s+/);
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`;
    }
    return clean.slice(0, 2);
  };

  const palette = getColors(name);
  const initials = getInitials(name);

  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px] rounded',
    md: 'w-10 h-10 text-xs rounded-lg',
    lg: 'w-14 h-14 text-base rounded-xl',
  };

  const dimensions = sizeClasses[size];

  if (logo && !error) {
    return (
      <img
        src={logo}
        alt={`${name} Logo`}
        className={`${dimensions} object-contain bg-white border border-border/60 p-1 shrink-0 ${className}`}
        onError={() => setError(true)}
      />
    );
  }

  return (
    <div
      className={`${dimensions} flex items-center justify-center font-extrabold border shrink-0 ${palette.bg} ${palette.text} ${palette.border} ${className}`}
    >
      {initials}
    </div>
  );
}
