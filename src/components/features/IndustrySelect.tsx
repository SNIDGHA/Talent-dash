'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

interface IndustrySelectProps {
  industries: string[];
  selectedIndustry: string;
}

export default function IndustrySelect({
  industries,
  selectedIndustry,
}: IndustrySelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set('industry', val);
    } else {
      params.delete('industry');
    }
    router.push(`/companies?${params.toString()}`);
  };

  return (
    <select
      value={selectedIndustry}
      onChange={(e) => handleChange(e.target.value)}
      className="w-full md:w-auto bg-white border border-border rounded-lg px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:border-primary cursor-pointer font-semibold"
    >
      <option value="">All Industries</option>
      {industries.map((ind) => (
        <option key={ind} value={ind}>
          {ind}
        </option>
      ))}
    </select>
  );
}
