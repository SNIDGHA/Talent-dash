import { prisma } from '@/lib/db';
import { Currency } from '@prisma/client';
import { formatSalary } from '@/lib/formatters';
import Link from 'next/link';
import CompanyLogo from '@/components/features/CompanyLogo';
import { Building, MapPin, Users, Calendar, ArrowUpRight, Search, Sparkles } from 'lucide-react';
import React from 'react';
import Script from 'next/script';
import IndustrySelect from '@/components/features/IndustrySelect';
export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    industry?: string;
    currency?: string;
  }>;
}

function calculateMedian(values: bigint[]): bigint {
  if (values.length === 0) return 0n;
  const sorted = [...values].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 !== 0) {
    return sorted[mid];
  }
  return (sorted[mid - 1] + sorted[mid]) / 2n;
}

export default async function CompaniesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || '';
  const selectedIndustry = params.industry || '';
  const displayCurrency = (params.currency as Currency) || Currency.INR;

  // 1. Fetch distinct industries for filter dropdown
  const distinctIndustries = await prisma.company.findMany({
    select: { industry: true },
    distinct: ['industry'],
    orderBy: { industry: 'asc' }
  });

  // 2. Build where filter
  const where: any = {};
  if (search) {
    where.name = { contains: search, mode: 'insensitive' };
  }
  if (selectedIndustry) {
    where.industry = { equals: selectedIndustry };
  }

  // 3. Fetch companies with salaries
  const companies = await prisma.company.findMany({
    where,
    include: {
      salaries: {
        select: {
          totalCompensation: true,
          currency: true
        }
      }
    },
    orderBy: { name: 'asc' }
  });

  // 4. Calculate aggregates per company
  const companiesWithStats = companies.map((c: any) => {
    const totalRecords = c.salaries.length;

    // Calculate median total compensation
    // Convert all salary totalComp to INR/USD based on their own currency,
    // but to calculate a true median, let's normalize all of them to the displayCurrency.
    // Or we can just calculate standard median in displayCurrency.
    // Let's use the displayCurrency!
    const tcs = c.salaries.map((s: any) => {
      // In prisma/schema.prisma: baseSalary, stock, bonus, totalCompensation are BigInt
      // They are in cents/paise (scaled by 100).
      return s.totalCompensation;
    });

    const medianTC = calculateMedian(tcs);

    return {
      id: c.id,
      name: c.name,
      slug: c.slug,
      industry: c.industry,
      headquarters: c.headquarters,
      foundedYear: c.foundedYear,
      headcountRange: c.headcountRange,
      totalRecords,
      medianTC,
      // For display, we can use the first salary's currency, or displayCurrency.
      // Since formatSalary takes (amount, fromCurrency, displayCurrency),
      // we'll assume the median is in the displayCurrency for display simplicity,
      // or we can pass displayCurrency as both parameters if we normalize first.
      // Let's normalize salaries first to calculate a precise median!
    };
  });

  // Precise calculation helper with normalization
  const calculatedCompanies = companies.map((c: any) => {
    const totalRecords = c.salaries.length;

    // Normalize all compensation values to displayCurrency
    const normalizedTCs = c.salaries.map((s: any) => {
      // If s.currency === displayCurrency, keep it. Otherwise, convert it!
      // Since convertSalary handles the scaling from paise/cents to standard units,
      // we'll convert it, then scale it back to "smallest unit" (cents/paise) for formatSalary.
      // Let's do that!
      if (s.currency === displayCurrency) {
        return s.totalCompensation;
      }

      // Let's scale from bigint cents/paise
      const standardAmount = Number(s.totalCompensation) / 100;

      // Currency conversion rates
      const conversionRates: Record<string, number> = {
        INR: 83.0,
        USD: 1.0,
        GBP: 0.8,
        EUR: 0.9
      };

      const fromRate = conversionRates[s.currency] || 1.0;
      const toRate = conversionRates[displayCurrency] || 1.0;

      const usdValue = standardAmount / fromRate;
      const convertedAmount = usdValue * toRate;

      // Convert back to smallest unit (BigInt)
      return BigInt(Math.round(convertedAmount * 100));
    });

    const medianTC = calculateMedian(normalizedTCs);

    return {
      id: c.id,
      name: c.name,
      slug: c.slug,
      logo: c.logo,
      industry: c.industry,
      headquarters: c.headquarters,
      foundedYear: c.foundedYear,
      headcountRange: c.headcountRange,
      totalRecords,
      medianTC
    };
  }).sort((a: any, b: any) => b.totalRecords - a.totalRecords); // Sort by number of records descending

  // Helper to generate search URLs
  const getFilterUrl = (overrides: Record<string, string | number | null>) => {
    const newParams = new URLSearchParams();
    if (search) newParams.set('search', search);
    if (selectedIndustry) newParams.set('industry', selectedIndustry);
    newParams.set('currency', displayCurrency);

    Object.entries(overrides).forEach(([key, val]: [string, any]) => {
      if (val === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, val.toString());
      }
    });

    return `/companies?${newParams.toString()}`;
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-1.5 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Company Directory</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-800">
            Explore Tech Companies
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Compare compensation bands, employee reviews, and leveling across top firms.
          </p>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center border border-border rounded-lg p-0.5 bg-white shadow-sm">
          <Link
            href={getFilterUrl({ currency: 'INR' })}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${displayCurrency === Currency.INR
              ? 'bg-primary text-white shadow-sm'
              : 'text-neutral-500 hover:text-neutral-800'
              }`}
          >
            INR (₹)
          </Link>
          <Link
            href={getFilterUrl({ currency: 'USD' })}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${displayCurrency === Currency.USD
              ? 'bg-primary text-white shadow-sm'
              : 'text-neutral-500 hover:text-neutral-800'
              }`}
          >
            USD ($)
          </Link>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-border rounded-xl p-4 card-shadow flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <form action="/companies" method="GET" className="relative w-full md:max-w-md flex items-center">
          <input type="hidden" name="currency" value={displayCurrency} />
          {selectedIndustry && <input type="hidden" name="industry" value={selectedIndustry} />}
          <Search className="absolute left-3 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search companies by name..."
            className="w-full bg-neutral-50 border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-neutral-800 focus:outline-none focus:border-primary focus:bg-white transition"
          />
        </form>

        {/* Industry Filter */}
        <div className="w-full md:w-auto flex items-center space-x-2 justify-end">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider whitespace-nowrap hidden sm:inline">
            Filter Industry:
          </span>
          <IndustrySelect
            industries={distinctIndustries.map((di: any) => di.industry)}
            selectedIndustry={selectedIndustry}
          />
        </div>
      </div>

      {/* Companies Grid */}
      {calculatedCompanies.length === 0 ? (
        <div className="bg-white border border-border rounded-xl p-12 text-center text-neutral-400 card-shadow">
          <Building className="w-12 h-12 text-neutral-350 mx-auto mb-3" />
          <p className="text-sm font-semibold">No companies found matching these criteria.</p>
          <Link
            href={`/companies?currency=${displayCurrency}`}
            className="mt-3 inline-block text-xs font-bold text-primary hover:underline"
          >
            Reset Filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculatedCompanies.map((c: any) => (
            <Link
              key={c.id}
              href={`/companies/${c.slug}?currency=${displayCurrency}`}
              className="group bg-white border border-border rounded-xl p-5 hover:border-primary card-shadow transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3.5">
                    <CompanyLogo logo={c.logo} name={c.name} size="md" />
                    <div className="space-y-1">
                      <h2 className="text-base font-extrabold text-neutral-800 group-hover:text-primary transition-colors">
                        {c.name}
                      </h2>
                      <span className="inline-block text-[10px] font-bold bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full border border-neutral-200">
                        {c.industry}
                      </span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-neutral-400 mt-5 pt-3 border-t border-neutral-100">
                  {c.foundedYear && (
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-neutral-350 shrink-0" />
                      <span>Est. {c.foundedYear}</span>
                    </div>
                  )}
                  {c.headcountRange && (
                    <div className="flex items-center space-x-1.5">
                      <Users className="w-3.5 h-3.5 text-neutral-350 shrink-0" />
                      <span>{c.headcountRange} size</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1.5 col-span-2">
                    <MapPin className="w-3.5 h-3.5 text-neutral-350 shrink-0" />
                    <span className="truncate">{c.headquarters}</span>
                  </div>
                </div>
              </div>

              {/* Stats Summary */}
              <div className="bg-neutral-50 rounded-lg p-3.5 mt-5 flex items-center justify-between text-xs border border-neutral-100">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Median Total Comp
                  </span>
                  <span className="font-extrabold text-primary text-sm">
                    {c.totalRecords > 0 ? formatSalary(c.medianTC, displayCurrency, displayCurrency) : '—'}
                  </span>
                </div>
                <div className="text-right space-y-0.5">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Data Points
                  </span>
                  <span className="font-bold text-neutral-700">
                    {c.totalRecords} {c.totalRecords === 1 ? 'salary' : 'salaries'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
