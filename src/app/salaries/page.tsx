import { prisma } from '@/lib/db';
import { Level, Currency } from '@prisma/client';
import { formatSalary } from '@/lib/formatters';
import SearchInput from '@/components/features/SearchInput';
import CompanyLogo from '@/components/features/CompanyLogo';
import Link from 'next/link';
import { MapPin, ArrowUpDown, ChevronLeft, ChevronRight, Sparkles, TrendingUp, Building2, Briefcase, Star, Award } from 'lucide-react';
import React from 'react';
import SalaryFilters from '@/components/features/SalaryFilters';

export const revalidate = 60; // Cache and revalidate salaries page every 60 seconds (ISR)

interface PageProps {
  searchParams: Promise<{
    company?: string;
    role?: string;
    level?: string | string[];
    location?: string;
    currency?: string;
    sort?: string;
    page?: string;
  }>;
}

function getLevelBadgeClass(level: Level) {
  switch (level) {
    case Level.L3:
    case Level.SDE_I:
      return 'bg-slate-100 text-slate-700 border border-slate-200';
    case Level.L4:
    case Level.SDE_II:
      return 'bg-blue-50 text-blue-700 border border-blue-100';
    case Level.L5:
    case Level.SDE_III:
      return 'bg-indigo-50 text-indigo-700 border border-indigo-100';
    case Level.L6:
    case Level.STAFF:
    case Level.IC4:
      return 'bg-purple-50 text-purple-700 border border-purple-100';
    case Level.PRINCIPAL:
    case Level.IC5:
      return 'bg-slate-900 text-slate-100 border border-slate-950';
    default:
      return 'bg-slate-50 text-slate-650 border border-slate-200';
  }
}

export default async function SalariesPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Extract and sanitize query parameters
  const company = params.company || '';
  const selectedRole = params.role || '';
  const selectedLocation = params.location || '';
  const sort = params.sort || 'total_comp_desc';
  const displayCurrency = (params.currency as Currency) || Currency.INR;

  // Handle multi-select levels (level param can be string or array)
  let selectedLevels: Level[] = [];
  if (params.level) {
    if (Array.isArray(params.level)) {
      selectedLevels = params.level as Level[];
    } else {
      selectedLevels = [params.level as Level];
    }
  }

  let page = parseInt(params.page || '1', 10);
  if (isNaN(page) || page < 1) page = 1;
  const limit = 10; // Reduce page size slightly for better UX with the rich UI layout

  // Construct filters for Prisma query
  const where: any = {};
  if (company) {
    where.company = {
      name: { contains: company, mode: 'insensitive' }
    };
  }
  if (selectedRole) {
    where.role = { equals: selectedRole, mode: 'insensitive' };
  }
  if (selectedLocation) {
    where.location = { equals: selectedLocation, mode: 'insensitive' };
  }
  if (selectedLevels.length > 0) {
    where.level = { in: selectedLevels };
  }

  // Sorting
  let orderBy: any = { totalCompensation: 'desc' };
  if (sort === 'total_comp_asc') {
    orderBy = { totalCompensation: 'asc' };
  } else if (sort === 'date_desc') {
    orderBy = { submittedAt: 'desc' };
  }

  // Fetch unique categories for form filters (all records, no filter applied)
  const roles = await prisma.salary.findMany({
    select: { role: true },
    distinct: ['role'],
    orderBy: { role: 'asc' }
  });

  const locations = await prisma.salary.findMany({
    select: { location: true },
    distinct: ['location'],
    orderBy: { location: 'asc' }
  });

  // Query database directly (RSC best practice — no HTTP self-call)
  const [total, rawSalaries] = await prisma.$transaction([
    prisma.salary.count({ where }),
    prisma.salary.findMany({
      where,
      include: { company: true },
      orderBy,
      skip: (page - 1) * limit,
      take: limit
    })
  ]);

  const salaries = rawSalaries;
  const totalPages = Math.ceil(total / limit);

  // Helper to generate URLs for sorting and toggles
  const getFilterUrl = (overrides: Record<string, string | string[] | number | null>) => {
    const newParams = new URLSearchParams();

    // Copy existing params
    if (company) newParams.set('company', company);
    if (selectedRole) newParams.set('role', selectedRole);
    if (selectedLocation) newParams.set('location', selectedLocation);
    if (displayCurrency) newParams.set('currency', displayCurrency);
    if (sort) newParams.set('sort', sort);
    if (page > 1) newParams.set('page', page.toString());

    selectedLevels.forEach(lvl => {
      newParams.append('level', lvl);
    });

    // Apply overrides
    Object.entries(overrides).forEach(([key, val]) => {
      if (val === null) {
        newParams.delete(key);
      } else if (Array.isArray(val)) {
        newParams.delete(key);
        val.forEach(v => newParams.append(key, v));
      } else {
        newParams.set(key, val.toString());
      }
    });

    return `/salaries?${newParams.toString()}`;
  };

  // Top Paying Companies — dynamically fetched from DB, ranked by median TC
  const allCompaniesWithSalaries = await prisma.company.findMany({
    include: {
      salaries: {
        select: {
          totalCompensation: true,
          currency: true,
          isVerified: true
        }
      }
    }
  });

  const conversionRates: Record<string, number> = { INR: 83.0, USD: 1.0, GBP: 0.8, EUR: 0.9 };

  const topCompanies = allCompaniesWithSalaries
    .filter((c: any) => c.salaries.length > 0)
    .map((c: any) => {
      const normalizedTCs = c.salaries.map((s: any) => {
        const standardAmount = Number(s.totalCompensation) / 100;
        if (s.currency === displayCurrency) return standardAmount;
        const fromRate = conversionRates[s.currency] || 1.0;
        const toRate = conversionRates[displayCurrency] || 1.0;
        return (standardAmount / fromRate) * toRate;
      });
      const sorted = [...normalizedTCs].sort((a: number, b: number) => a - b);
      const mid = Math.floor(sorted.length / 2);
      const medianTC = sorted.length % 2 !== 0
        ? sorted[mid]
        : (sorted[mid - 1] + sorted[mid]) / 2;

      return {
        name: c.name,
        logo: c.logo,
        slug: c.slug,
        medianTC: Math.round(medianTC),
        trend: '+1.5% YoY',
        isUp: true
      };
    })
    .sort((a: any, b: any) => b.medianTC - a.medianTC)
    .slice(0, 5); // Show top 5

  // Heatmap values
  const heatmapRows = ['Software Engineer', 'Product Manager', 'Data Scientist', 'Data Analyst', 'UX Designer'];
  const heatmapCols = ['New York', 'San Francisco', 'London', 'Berlin', 'Singapore', 'Sydney'];
  const heatmapData = [
    [135, 175, 120, 95, 125, 110], // SWE
    [142, 178, 128, 98, 130, 112], // PM
    [130, 168, 115, 92, 120, 105], // Data Scientist
    [98, 125, 88, 72, 90, 80],     // Data Analyst
    [110, 145, 100, 80, 105, 95]    // UX Designer
  ];

  const getHeatmapColor = (val: number) => {
    if (val >= 150) return 'bg-emerald-500 text-white';
    if (val >= 120) return 'bg-emerald-450 text-white';
    if (val >= 100) return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    if (val >= 85) return 'bg-amber-100 text-amber-800 border border-amber-250';
    return 'bg-rose-100 text-rose-800 border border-rose-200';
  };

  return (
    <div className="space-y-10">
      {/* JSON-LD Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Dataset',
            name: 'TalentDash Tech Salary Database',
            description: 'Structured, level-mapped technology salaries including base pay, stock grants, and bonuses for top firms in India and worldwide.',
            url: 'https://talentdash.com/salaries',
            license: 'https://creativecommons.org/licenses/by/4.0/',
            creator: {
              '@type': 'Organization',
              name: 'TalentDash'
            }
          })
        }}
      />

      {/* Hero Header Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-800 p-8 md:p-12 shadow-xl text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-primary/10 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none" />
        
        <div className="relative max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-violet-200 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SALARIES</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none bg-gradient-to-r from-white via-neutral-100 to-indigo-100 bg-clip-text text-transparent">
            Real salary insights.<br />Real career growth.
          </h1>
          <p className="text-sm md:text-base text-indigo-100 max-w-xl font-medium leading-relaxed">
            Explore verified compensation data from professionals around the world. Make data-driven decisions for your next career move.
          </p>
          <div className="pt-2">
            <Link 
              href="/submit" 
              className="inline-flex items-center space-x-2 bg-primary hover:bg-primary/95 text-white font-bold px-5 py-2.5 rounded-lg text-xs tracking-wider uppercase transition shadow-lg hover:shadow-indigo-500/20 active:scale-95"
            >
              <span>Explore all salaries</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Salary data points', value: '12.5M+', desc: 'Updated daily' },
          { label: 'Companies', value: '35K+', desc: 'Across 140+ countries' },
          { label: 'Job titles', value: '900+', desc: 'From entry to executive' },
          { label: 'YoY salary growth', value: '18%', desc: 'For tech roles globally' },
          { label: 'Verified professionals only', value: '100%', desc: 'Verified by email/offer' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white border border-border/80 rounded-xl p-5 card-shadow flex flex-col justify-between space-y-2 hover:border-primary/30 transition duration-200">
            <span className="text-[10px] font-bold text-neutral-450 uppercase tracking-wider leading-tight">{stat.label}</span>
            <div>
              <span className="text-xl md:text-2xl font-black text-neutral-800 tracking-tight block">{stat.value}</span>
              <span className="text-[10px] font-semibold text-neutral-400 block mt-0.5">{stat.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Top Paying Companies & Heatmap Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Top Paying Companies */}
        <div className="xl:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-neutral-700 uppercase tracking-wider">Top paying companies</h2>
            <Link href="/companies" className="text-xs font-bold text-primary hover:underline flex items-center">
              <span>View all companies</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="bg-white border border-border/80 rounded-2xl p-5 card-shadow space-y-4">
            {topCompanies.map((item: any, idx: number) => (
              <Link 
                key={idx} 
                href={`/companies/${item.slug}`} 
                className="flex items-center justify-between group p-2 hover:bg-neutral-50 rounded-xl transition duration-150 border border-transparent hover:border-border/40"
              >
                <div className="flex items-center space-x-3.5">
                  <CompanyLogo logo={item.logo} name={item.name} size="md" />
                  <div>
                    <h3 className="text-sm font-extrabold text-neutral-800 group-hover:text-primary transition-colors">{item.name}</h3>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider mt-0.5 block">
                      {displayCurrency === 'INR' ? '₹' : '$'}{Math.round(item.medianTC / 1000)}K <span className="text-neutral-400 font-semibold lowercase">median</span>
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center space-x-0.5">
                    <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                    <span>{item.trend}</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Heatmap Section */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-neutral-700 uppercase tracking-wider">Salary heatmap by role & location</h2>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Currency: {displayCurrency} (in Thousands)</span>
          </div>
          <div className="bg-white border border-border/80 rounded-2xl p-5 card-shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-border/60">
                    <th className="py-2.5 pb-4 text-[10px] font-black text-neutral-450 uppercase tracking-wider">Role</th>
                    {heatmapCols.map((col, idx) => (
                      <th key={idx} className="py-2.5 pb-4 text-center text-[10px] font-black text-neutral-450 uppercase tracking-wider">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {heatmapRows.map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-neutral-50/50 transition">
                      <td className="py-3.5 pr-4 text-xs font-extrabold text-neutral-800">{row}</td>
                      {heatmapCols.map((col, colIdx) => {
                        let val = heatmapData[rowIdx][colIdx];
                        if (displayCurrency === 'INR') val = Math.round(val * 8.3); // simple display scale
                        return (
                          <td key={colIdx} className="py-2 px-1">
                            <div className={`mx-auto w-16 py-1.5 rounded-lg text-[10px] font-extrabold text-center transition ${getHeatmapColor(heatmapData[rowIdx][colIdx])}`}>
                              {displayCurrency === 'INR' ? `₹${val}L` : `$${val}k`}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Heatmap Legend */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-border/40 mt-3 text-[10px] font-bold text-neutral-400">
              <span>Heatmap Level:</span>
              <div className="flex items-center space-x-1.5">
                <span className="w-3.5 h-3.5 rounded bg-rose-100 border border-rose-200" />
                <span>Lower</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3.5 h-3.5 rounded bg-amber-100 border border-amber-200" />
                <span>Medium</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3.5 h-3.5 rounded bg-emerald-100 border border-emerald-250" />
                <span>Good</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3.5 h-3.5 rounded bg-emerald-500" />
                <span>Highest</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Top Roles & Experience Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Top Roles by TC */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-neutral-700 uppercase tracking-wider">Top roles by median total compensation</h2>
          </div>
          <div className="bg-white border border-border/80 rounded-2xl p-5 card-shadow space-y-4">
            {[
              { role: 'Software Engineer', pay: displayCurrency === 'INR' ? '₹32.4L' : '$134K', trend: '+12% YoY', points: [20, 25, 23, 28, 30, 32] },
              { role: 'Product Manager', pay: displayCurrency === 'INR' ? '₹34.8L' : '$142K', trend: '+8% YoY', points: [15, 18, 22, 21, 23, 25] },
              { role: 'Data Scientist', pay: displayCurrency === 'INR' ? '₹28.5L' : '$115K', trend: '+15% YoY', points: [10, 12, 14, 18, 20, 24] },
              { role: 'Marketing Manager', pay: displayCurrency === 'INR' ? '₹20.1L' : '$82K', trend: '+3% YoY', points: [18, 17, 19, 18, 20, 21] },
              { role: 'Design Manager', pay: displayCurrency === 'INR' ? '₹24.5L' : '$98K', trend: '+5% YoY', points: [12, 14, 15, 18, 17, 19] }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-neutral-50 pb-3 last:border-0 last:pb-0">
                <div className="space-y-0.5">
                  <span className="text-xs font-extrabold text-neutral-800 block">{item.role}</span>
                  <div className="flex items-center space-x-2 text-[10px] font-bold text-neutral-400">
                    <span className="text-primary">{item.pay}</span>
                    <span>•</span>
                    <span className="text-emerald-600">{item.trend}</span>
                  </div>
                </div>
                {/* Micro SVG sparkline */}
                <div className="w-14 h-8 shrink-0">
                  <svg className="w-full h-full text-emerald-500" viewBox="0 0 100 40">
                    <path
                      d={`M ${item.points.map((p, i) => `${i * 20} ${40 - p}`).join(' L ')}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Salary by Experience */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-sm font-black text-neutral-700 uppercase tracking-wider">Salary by experience</h2>
          <div className="bg-white border border-border/80 rounded-2xl p-5 card-shadow space-y-4 flex flex-col justify-between min-h-[295px]">
            <div className="space-y-3.5">
              {[
                { range: '0-1 year', pay: displayCurrency === 'INR' ? '₹18.5L' : '$75K', pct: 'w-1/3 bg-slate-200' },
                { range: '1-3 years', pay: displayCurrency === 'INR' ? '₹28.0L' : '$115K', pct: 'w-1/2 bg-slate-300' },
                { range: '3-5 years', pay: displayCurrency === 'INR' ? '₹38.5L' : '$155K', pct: 'w-2/3 bg-indigo-200' },
                { range: '5-8 years', pay: displayCurrency === 'INR' ? '₹48.0L' : '$195K', pct: 'w-5/6 bg-indigo-300' },
                { range: '8+ years', pay: displayCurrency === 'INR' ? '₹60.5L' : '$245K', pct: 'w-full bg-primary/40' }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-neutral-600">
                    <span>{item.range}</span>
                    <span className="text-neutral-800">{item.pay}</span>
                  </div>
                  <div className="w-full h-2 rounded bg-neutral-50 overflow-hidden border border-neutral-100">
                    <div className={`h-full rounded transition-all duration-500 ${item.pct}`} />
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-violet-50 text-indigo-800 rounded-xl p-3 border border-indigo-100 text-[10px] font-bold leading-relaxed flex items-start space-x-2">
              <TrendingUp className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
              <span>Professionals with 5+ years of experience earn 2.2x more than those just starting out.</span>
            </div>
          </div>
        </div>

        {/* Explore Salaries Category Buttons */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-sm font-black text-neutral-700 uppercase tracking-wider">Explore salaries by</h2>
          <div className="bg-white border border-border/80 rounded-2xl p-5 card-shadow grid grid-cols-2 gap-4 min-h-[295px] items-center">
            {[
              { name: 'Role', icon: Briefcase, color: 'bg-emerald-50 text-emerald-600 border-emerald-100', path: '/salaries' },
              { name: 'Company', icon: Building2, color: 'bg-blue-50 text-blue-600 border-blue-100', path: '/companies' },
              { name: 'Location', icon: MapPin, color: 'bg-purple-50 text-purple-600 border-purple-100', path: '/salaries?location=Bengaluru' },
              { name: 'Experience', icon: TrendingUp, color: 'bg-amber-50 text-amber-600 border-amber-100', path: '/salaries' },
              { name: 'Industry', icon: Star, color: 'bg-rose-50 text-rose-600 border-rose-100', path: '/companies' },
              { name: 'Compare', icon: Award, color: 'bg-sky-50 text-sky-600 border-sky-100', path: '/compare' }
            ].map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link 
                  key={idx} 
                  href={cat.path} 
                  className={`flex items-center space-x-3 p-4 rounded-xl border font-black text-xs transition duration-150 active:scale-95 hover:shadow-sm ${cat.color}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

      </div>

      {/* Main Filter & Table Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <SalaryFilters
            roles={roles.map((r: any) => r.role)}
            locations={locations.map((l: any) => l.location)}
            selectedRole={selectedRole}
            selectedLocation={selectedLocation}
            selectedLevels={selectedLevels}
            displayCurrency={displayCurrency}
          />
        </div>

        {/* Database Table Side */}
        <div className="lg:col-span-3 space-y-4">

          {/* Company Search Bar */}
          <div className="flex bg-white border border-border rounded-xl p-3 card-shadow items-center">
            <SearchInput defaultValue={company} placeholder="Filter database by company name..." />
          </div>

          {/* Table Container */}
          <div className="bg-white border border-border rounded-xl overflow-hidden card-shadow">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50 border-b border-border text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                    <th className="py-4 px-5">Company / Role</th>
                    <th className="py-4 px-5">Level</th>
                    <th className="py-4 px-5">Location</th>
                    <th className="py-4 px-5 text-right hidden sm:table-cell">Base Salary</th>
                    <th className="py-4 px-5 text-right hidden md:table-cell">Stock / Yr</th>
                    <th className="py-4 px-5 text-right hidden md:table-cell">Bonus</th>
                    <th className="py-4 px-5 text-right">
                      <Link
                        href={getFilterUrl({ sort: sort === 'total_comp_desc' ? 'total_comp_asc' : 'total_comp_desc' })}
                        className="inline-flex items-center space-x-1 hover:text-neutral-800 transition"
                      >
                        <span>Total Comp</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-primary" />
                      </Link>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {salaries.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 px-5 text-center text-neutral-400">
                        <p className="text-sm font-semibold">No records found matching these filters.</p>
                        <Link
                          href={`/salaries?currency=${displayCurrency}`}
                          className="mt-3 inline-block text-xs font-bold text-primary hover:underline"
                        >
                          Clear all filters
                        </Link>
                      </td>
                    </tr>
                  ) : (
                    salaries.map((s: any) => (
                      <tr
                        key={s.id}
                        className="hover:bg-hoverSurface transition text-sm text-neutral-700"
                      >
                        <td className="py-4 px-5 flex items-center space-x-3">
                          <CompanyLogo logo={s.company.logo} name={s.company.name} size="sm" />
                          <div>
                            <Link
                              href={`/companies/${s.company.slug}`}
                              className="font-extrabold text-neutral-800 hover:text-primary transition-colors block"
                            >
                              {s.company.name}
                            </Link>
                            <span className="text-xs text-neutral-400 font-bold">{s.role}</span>
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getLevelBadgeClass(s.level)}`}>
                            {s.level}
                          </span>
                          <span className="text-[10px] text-neutral-450 block mt-1 font-bold">{s.experienceYears} yrs exp</span>
                        </td>
                        <td className="py-4 px-5 text-neutral-500 font-bold">
                          <div className="flex items-center space-x-1.5">
                            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                            <span className="truncate">{s.location}</span>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-right font-bold text-neutral-600 hidden sm:table-cell">
                          {formatSalary(s.baseSalary, s.currency, displayCurrency)}
                        </td>
                        <td className="py-4 px-5 text-right text-neutral-500 hidden md:table-cell font-bold">
                          {s.stock > 0 ? formatSalary(s.stock, s.currency, displayCurrency) : '—'}
                        </td>
                        <td className="py-4 px-5 text-right text-neutral-500 hidden md:table-cell font-bold">
                          {s.bonus > 0 ? formatSalary(s.bonus, s.currency, displayCurrency) : '—'}
                        </td>
                        <td className="py-4 px-5 text-right">
                          <div className="font-black text-dataBlue tracking-tight text-[15px]">
                            {formatSalary(s.totalCompensation, s.currency, displayCurrency)}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border px-5 py-4 bg-neutral-50 text-xs font-semibold text-neutral-500">
                <div>
                  Showing {Math.min(total, (page - 1) * limit + 1)}–{Math.min(total, page * limit)} of {total} records
                </div>
                <div className="flex space-x-2">
                  <Link
                    href={page > 1 ? getFilterUrl({ page: page - 1 }) : '#'}
                    className={`p-2 rounded-lg border border-border bg-white shadow-sm transition ${page === 1
                      ? 'opacity-50 pointer-events-none'
                      : 'hover:bg-neutral-50 active:scale-95'
                      }`}
                  >
                    <ChevronLeft className="w-4 h-4 text-neutral-600" />
                  </Link>
                  <Link
                    href={page < totalPages ? getFilterUrl({ page: page + 1 }) : '#'}
                    className={`p-2 rounded-lg border border-border bg-white shadow-sm transition ${page === totalPages
                      ? 'opacity-50 pointer-events-none'
                      : 'hover:bg-neutral-50 active:scale-95'
                      }`}
                  >
                    <ChevronRight className="w-4 h-4 text-neutral-600" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* CTA section at the bottom */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-800 rounded-2xl p-8 shadow-xl text-white flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2">
          <h2 className="text-xl md:text-2xl font-black">Add your salary & unlock all insights</h2>
          <p className="text-xs md:text-sm text-indigo-150 font-medium">Join 100K+ tech professionals anonymously sharing data to get complete leveling visibility.</p>
        </div>
        <Link
          href="/submit"
          className="bg-white hover:bg-neutral-100 text-indigo-950 font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider shrink-0 transition shadow-md active:scale-95"
        >
          Add your salary
        </Link>
      </div>

    </div>
  );
}
