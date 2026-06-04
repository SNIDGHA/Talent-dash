'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Level, Currency } from '@prisma/client';
import { SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface SalaryFiltersProps {
  roles: string[];
  locations: string[];
  selectedRole: string;
  selectedLocation: string;
  selectedLevels: Level[];
  displayCurrency: Currency;
}

export default function SalaryFilters({
  roles,
  locations,
  selectedRole,
  selectedLocation,
  selectedLevels,
  displayCurrency,
}: SalaryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string | string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (key === 'level') {
      params.delete('level');
      const levels = value as string[];
      levels.forEach(lvl => params.append('level', lvl));
    } else {
      if (value) {
        params.set(key, value as string);
      } else {
        params.delete(key);
      }
    }
    
    params.set('page', '1'); // Reset to page 1
    router.push(`/salaries?${params.toString()}`);
  };

  const handleCheckboxChange = (lvl: Level, checked: boolean) => {
    const newLevels = checked
      ? [...selectedLevels, lvl]
      : selectedLevels.filter(l => l !== lvl);
    handleFilterChange('level', newLevels);
  };

  const company = searchParams.get('company') || '';

  return (
    <div className="bg-white border border-border rounded-xl p-5 card-shadow space-y-6">
      <div className="flex items-center space-x-2 border-b border-border pb-3">
        <SlidersHorizontal className="w-4 h-4 text-neutral-500" />
        <h2 className="text-sm font-bold text-neutral-700 uppercase tracking-wider">Filters</h2>
      </div>

      {/* Role Filter */}
      <div className="space-y-2">
        <label htmlFor="role-select" className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
          Job Role
        </label>
        <select
          id="role-select"
          value={selectedRole}
          onChange={(e) => handleFilterChange('role', e.target.value)}
          className="w-full bg-white border border-border rounded-lg px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:border-primary cursor-pointer font-semibold"
        >
          <option value="">All Roles</option>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      {/* Location Filter */}
      <div className="space-y-2">
        <label htmlFor="location-select" className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
          Location
        </label>
        <select
          id="location-select"
          value={selectedLocation}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          className="w-full bg-white border border-border rounded-lg px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:border-primary cursor-pointer font-semibold"
        >
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Level Checkboxes */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
          Levels
        </label>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {Object.values(Level).map((lvl) => (
            <label
              key={lvl}
              className="flex items-center space-x-2.5 text-sm text-neutral-600 hover:text-neutral-800 cursor-pointer font-semibold"
            >
              <input
                type="checkbox"
                checked={selectedLevels.includes(lvl)}
                onChange={(e) => handleCheckboxChange(lvl, e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary w-4 h-4"
              />
              <span>{lvl}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Reset Filters Link */}
      {(selectedRole || selectedLocation || selectedLevels.length > 0 || company) && (
        <Link
          href={`/salaries?currency=${displayCurrency}`}
          className="block text-center text-xs font-bold text-primary hover:underline pt-2 border-t border-border"
        >
          Clear all filters
        </Link>
      )}
    </div>
  );
}
