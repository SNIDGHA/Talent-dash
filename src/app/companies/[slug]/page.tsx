import { prisma, serializeBigInt } from '@/lib/db';
import { Level, Currency } from '@prisma/client';
import { formatSalary } from '@/lib/formatters';
import CompanyLogo from '@/components/features/CompanyLogo';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Calendar, Users, Briefcase, ArrowUpRight, Scale, Sparkles, Building, MessageSquare, Heart, ClipboardList, HelpCircle, Star, Check, AlertCircle, Award } from 'lucide-react';
import React from 'react';
import { getMockCompanyData } from '@/lib/mockCompanyData';
import { GET as getCompanyApi } from '@/app/api/companies/[slug]/route';
import { NextRequest } from 'next/server';


export const revalidate = 3600; // Cache and revalidate company page hourly (ISR)
export const dynamicParams = true; // Dynamically generate pages for new company slugs on demand

console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);

interface CompanyPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    currency?: string;
    tab?: string;
  }>;
}

export async function generateStaticParams() {
  const companies = await prisma.company.findMany({
    select: { slug: true }
  });
  return companies.map((c: any) => ({
    slug: c.slug
  }));
}

function calculateBigIntMedian(values: bigint[]): bigint {
  if (values.length === 0) return 0n;
  const sorted = [...values].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 !== 0) {
    return sorted[mid];
  }
  return (sorted[mid - 1] + sorted[mid]) / 2n;
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

const DISTRIBUTION_COLORS = [
  'bg-primary',
  'bg-indigo-600',
  'bg-sky-500',
  'bg-emerald-600',
  'bg-amber-500',
  'bg-purple-600',
  'bg-teal-500',
  'bg-rose-500',
  'bg-slate-500',
];

export default async function CompanyPage({ params, searchParams }: CompanyPageProps) {
  const { slug } = await params;
  const sParams = await searchParams;

  const response = await getCompanyApi(
    new NextRequest(`http://localhost:3000/api/companies/${slug}`),
    { params: Promise.resolve({ slug }) }
  );

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch company details from API route: ${response.status}`);
  }

  const data = await response.json();
  const company = data.company;
  const salaries = data.salaries;
  const median_total_compensation = data.median_total_compensation;
  const level_distribution = data.level_distribution;

  const totalRecords = salaries.length;
  if (totalRecords === 0) {
    return notFound();
  }

  const displayCurrency = (sParams.currency as Currency) || Currency.INR;
  const activeTab = sParams.tab || 'overview';

  // Compute stats
  const tcValues = salaries.map((s: any) => Number(s.totalCompensation));
  const medianTC = BigInt(median_total_compensation);

  const sortedTCs = [...tcValues].sort((a, b) => a - b);
  const minTC = BigInt(sortedTCs[0]);
  const maxTC = BigInt(sortedTCs[sortedTCs.length - 1]);

  // Compute Level Distribution
  const levelDistribution = Object.entries(level_distribution)
    .map(([level, count]: [any, any]) => ({
      level: level as Level,
      count,
      percentage: (count / totalRecords) * 100
    }))
    .sort((a, b) => b.percentage - a.percentage);

  // Load custom mock details for additional tabs
  const mockData = getMockCompanyData(company.name);

  // Tab definition
  const tabs = [
    { id: 'overview', name: 'Overview', icon: Building },
    { id: 'salaries', name: 'Salaries', icon: Briefcase },
    { id: 'reviews', name: 'Reviews', icon: MessageSquare },
    { id: 'benefits', name: 'Benefits', icon: Heart },
    { id: 'jobs', name: 'Jobs', icon: Users },
    { id: 'interviews', name: 'Interviews', icon: ClipboardList },
    { id: 'qa', name: 'Q&A', icon: HelpCircle }
  ];

  const getTabUrl = (tabId: string) => {
    const newParams = new URLSearchParams();
    newParams.set('tab', tabId);
    newParams.set('currency', displayCurrency);
    return `/companies/${company.slug}?${newParams.toString()}`;
  };

  return (
    <div className="space-y-8">
      {/* Schema Markups */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            'name': company.name,
            'url': `https://talentdash.com/companies/${company.slug}`,
            'foundingDate': company.foundedYear ? `${company.foundedYear}` : undefined,
            'address': {
              '@type': 'PostalAddress',
              'addressLocality': company.headquarters
            }
          })
        }}
      />

      {/* FAQ Page Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': mockData.faqs.map(f => ({
              '@type': 'Question',
              'name': f.question,
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': f.answer
              }
            }))
          })
        }}
      />

      {/* Back link */}
      <div>
        <Link href="/companies" className="text-xs font-bold text-neutral-500 hover:text-primary transition flex items-center space-x-1">
          <span>&larr; Back to Companies</span>
        </Link>
      </div>

      {/* Profile Header Grid */}
      <div className="bg-white border border-border rounded-2xl p-6 card-shadow grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Left Column: Metadata */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center space-x-3.5">
            <CompanyLogo logo={company.logo} name={company.name} size="lg" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-neutral-800 tracking-tight">
                {company.name}
              </h1>
              <span className="inline-block text-[11px] font-bold bg-neutral-100 text-neutral-600 px-2.5 py-0.5 rounded-full mt-1 border border-neutral-200">
                {company.industry}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-medium text-neutral-500 pt-2 border-t border-neutral-100">
            {company.foundedYear && (
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>Founded {company.foundedYear}</span>
              </div>
            )}
            {company.headcountRange && (
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>{company.headcountRange} Employees</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
              <span>HQ: {company.headquarters}</span>
            </div>
          </div>
        </div>

        {/* Right Column: High-level overview CTA & Stats */}
        <div className="bg-neutral-50 border border-border rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider block">
              Median Total Compensation
            </span>
            <div className="text-2xl font-black text-primary tracking-tight">
              {formatSalary(medianTC, Currency.INR, displayCurrency)}
            </div>
            <span className="text-[10px] text-neutral-400 font-semibold block pt-0.5">
              Based on {totalRecords} submitted records
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-1">
            <Link
              href={`/compare?c1=${company.slug}`}
              className="flex-1 text-center py-2 rounded-lg border border-border bg-white text-xs font-bold text-neutral-700 hover:bg-neutral-50 active:scale-95 transition shadow-sm flex items-center justify-center space-x-1"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Compare</span>
            </Link>

            {/* Currency toggle */}
            <Link
              href={`/companies/${company.slug}?tab=${activeTab}&currency=${displayCurrency === Currency.INR ? 'USD' : 'INR'}`}
              className="px-3 py-2 rounded-lg border border-border bg-white text-xs font-bold text-neutral-500 hover:text-neutral-800 transition shadow-sm"
            >
              {displayCurrency === Currency.INR ? 'View USD' : 'View INR'}
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-border flex space-x-2 overflow-x-auto pb-px">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <Link
              key={tab.id}
              href={getTabUrl(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 text-xs font-bold whitespace-nowrap transition ${isActive
                ? 'border-primary text-primary'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 hover:border-neutral-300'
                }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="pt-2">
        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side: Description & FAQ */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white border border-border rounded-xl p-6 card-shadow space-y-4">
                <h2 className="text-lg font-extrabold text-neutral-800">About {company.name}</h2>
                <p className="text-sm leading-relaxed text-neutral-550">{mockData.description}</p>
              </div>

              {/* FAQs Section */}
              <div className="bg-white border border-border rounded-xl p-6 card-shadow space-y-6">
                <h2 className="text-lg font-extrabold text-neutral-800">Frequently Asked Questions</h2>
                <div className="space-y-4 divide-y divide-border">
                  {mockData.faqs.map((faq, index) => (
                    <div key={index} className={`pt-4 ${index === 0 ? 'pt-0' : ''}`}>
                      <h3 className="text-sm font-bold text-neutral-800 flex items-center space-x-2">
                        <HelpCircle className="w-4 h-4 text-primary shrink-0" />
                        <span>{faq.question}</span>
                      </h3>
                      <p className="text-xs text-neutral-500 mt-2 pl-6 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side: Quick Stats & Distribution */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white border border-border rounded-xl p-5 card-shadow space-y-5">
                <div className="flex items-center space-x-2 border-b border-border pb-3">
                  <Briefcase className="w-4 h-4 text-neutral-500" />
                  <h2 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Salary Bands</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Min Pay</span>
                    <span className="text-sm font-bold text-neutral-700">
                      {formatSalary(minTC, Currency.INR, displayCurrency)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Max Pay</span>
                    <span className="text-sm font-bold text-neutral-700">
                      {formatSalary(maxTC, Currency.INR, displayCurrency)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Level Distribution Stacked Bar */}
              <div className="bg-white border border-border rounded-xl p-5 card-shadow space-y-5">
                <div className="flex items-center space-x-2 border-b border-border pb-3">
                  <Sparkles className="w-4 h-4 text-neutral-550" />
                  <h2 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Level Distribution</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex h-5 w-full rounded-full overflow-hidden bg-neutral-100 border border-neutral-200">
                    {levelDistribution.map((ld, idx) => (
                      <div
                        key={ld.level}
                        style={{ width: `${ld.percentage}%` }}
                        className={`h-full ${DISTRIBUTION_COLORS[idx % DISTRIBUTION_COLORS.length]} transition-all`}
                        title={`${ld.level}: ${ld.count} records (${ld.percentage.toFixed(1)}%)`}
                      />
                    ))}
                  </div>

                  <div className="space-y-2">
                    {levelDistribution.map((ld, idx) => (
                      <div key={ld.level} className="flex items-center justify-between text-xs font-semibold">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-md ${DISTRIBUTION_COLORS[idx % DISTRIBUTION_COLORS.length]}`} />
                          <span className="text-neutral-700">{ld.level}</span>
                        </div>
                        <div className="text-neutral-500">
                          {ld.count} {ld.count === 1 ? 'record' : 'records'} ({ld.percentage.toFixed(1)}%)
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. SALARIES TAB */}
        {activeTab === 'salaries' && (
          <div className="space-y-4">
            <div className="bg-white border border-border rounded-xl p-4 card-shadow flex items-center justify-between">
              <h2 className="text-sm font-bold text-neutral-700 uppercase tracking-wider">
                {company.name} Salary Submissions ({totalRecords})
              </h2>
            </div>

            <div className="bg-white border border-border rounded-xl overflow-hidden card-shadow">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-border text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                      <th className="py-4 px-5">Role</th>
                      <th className="py-4 px-5">Level</th>
                      <th className="py-4 px-5">Location</th>
                      <th className="py-4 px-5 text-right hidden sm:table-cell">Base Salary</th>
                      <th className="py-4 px-5 text-right hidden md:table-cell">Stock / Yr</th>
                      <th className="py-4 px-5 text-right hidden md:table-cell">Bonus</th>
                      <th className="py-4 px-5 text-right">Total Comp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {salaries.map((s: any) => (
                      <tr
                        key={s.id}
                        className="hover:bg-hoverSurface transition text-sm text-neutral-700"
                      >
                        <td className="py-4 px-5">
                          <span className="font-bold text-neutral-800 block">{s.role}</span>
                          <span className="text-[10px] text-neutral-400 font-medium">{s.experienceYears} yrs experience</span>
                        </td>
                        <td className="py-4 px-5">
                          <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getLevelBadgeClass(s.level)}`}>
                            {s.level}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-neutral-500 font-medium">
                          <div className="flex items-center space-x-1.5">
                            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                            <span className="truncate">{s.location}</span>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-right font-medium text-neutral-600 hidden sm:table-cell">
                          {formatSalary(s.baseSalary, s.currency, displayCurrency)}
                        </td>
                        <td className="py-4 px-5 text-right text-neutral-500 hidden md:table-cell font-medium">
                          {s.stock > 0 ? formatSalary(s.stock, s.currency, displayCurrency) : '—'}
                        </td>
                        <td className="py-4 px-5 text-right text-neutral-500 hidden md:table-cell font-medium">
                          {s.bonus > 0 ? formatSalary(s.bonus, s.currency, displayCurrency) : '—'}
                        </td>
                        <td className="py-4 px-5 text-right">
                          <div className="font-extrabold text-dataBlue tracking-tight text-[15px]">
                            {formatSalary(s.totalCompensation, s.currency, displayCurrency)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Ratings Summary */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white border border-border rounded-xl p-5 card-shadow space-y-4">
                <h2 className="text-sm font-bold text-neutral-700 uppercase tracking-wider">Reviews Overview</h2>
                <div className="flex items-center space-x-4">
                  <div className="text-4xl font-black text-primary">{mockData.rating}</div>
                  <div className="space-y-1">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs text-neutral-400 font-semibold">{mockData.recommendPct}% Recommend to a Friend</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Reviews List */}
            <div className="lg:col-span-2 space-y-6">
              {mockData.reviews.map((review, idx) => (
                <div key={idx} className="bg-white border border-border rounded-xl p-5 card-shadow space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-extrabold text-neutral-800 text-base">{review.title}</h3>
                      <span className="text-[10px] text-neutral-400 font-semibold">{review.role} • {review.location} • {review.date}</span>
                    </div>
                    <div className="flex items-center bg-primary/10 text-primary font-bold px-2.5 py-0.5 rounded text-xs">
                      <Star className="w-3 h-3 fill-current mr-1 text-primary" />
                      <span>{review.rating}.0</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs leading-relaxed text-neutral-600">
                    <p><strong className="text-emerald-600 font-bold">Pros:</strong> {review.pros}</p>
                    <p><strong className="text-rose-500 font-bold">Cons:</strong> {review.cons}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. BENEFITS TAB */}
        {activeTab === 'benefits' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockData.benefits.map((benefit, idx) => {
              return (
                <div key={idx} className="bg-white border border-border rounded-xl p-5 card-shadow flex items-start space-x-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${benefit.included ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-500 border border-rose-100'
                    }`}>
                    {benefit.included ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-extrabold text-neutral-800 text-sm">{benefit.name}</h3>
                      <span className="text-[9px] font-bold bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full uppercase border border-neutral-200">
                        {benefit.category}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 5. JOBS TAB */}
        {activeTab === 'jobs' && (
          <div className="space-y-4">
            {mockData.jobs.map((job, idx) => (
              <div key={idx} className="bg-white border border-border rounded-xl p-5 card-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-primary transition">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-neutral-800 text-base">{job.title}</h3>
                  <div className="flex items-center space-x-3 text-xs font-semibold text-neutral-400">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{job.location}</span>
                    </span>
                    <span>•</span>
                    <span>{job.type}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Estimated Pay</span>
                    <span className="font-extrabold text-primary text-sm">{job.salaryRange}</span>
                  </div>
                  <button className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/95 transition active:scale-95 shadow-sm">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 6. INTERVIEWS TAB */}
        {activeTab === 'interviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Difficulty and Prep */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white border border-border rounded-xl p-5 card-shadow space-y-4">
                <h2 className="text-sm font-bold text-neutral-700 uppercase tracking-wider">Interview Process</h2>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-neutral-400">Difficulty Rating</span>
                    <span className="text-primary font-bold">{mockData.interviews.difficulty}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-neutral-400">Positive Experience</span>
                    <span className="text-neutral-850">{mockData.interviews.positivePct}%</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-neutral-400">Average Timeline</span>
                    <span className="text-neutral-850">{mockData.interviews.processDuration}</span>
                  </div>
                </div>
              </div>

              {/* Sample Questions */}
              <div className="bg-white border border-border rounded-xl p-5 card-shadow space-y-4">
                <h2 className="text-sm font-bold text-neutral-700 uppercase tracking-wider">Sample Questions</h2>
                <ul className="space-y-3 text-xs list-disc pl-4 text-neutral-600 leading-relaxed font-semibold">
                  {mockData.interviews.questions.map((q: any, idx: number) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Interview Reports */}
            <div className="lg:col-span-2 space-y-6">
              {mockData.interviews.reports.map((report: any, idx: number) => (
                <div key={idx} className="bg-white border border-border rounded-xl p-5 card-shadow space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-extrabold text-neutral-800 text-base">{report.title}</h3>
                      <span className="text-[10px] text-neutral-400 font-semibold">{report.role} • Outcome: {report.outcome}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${report.difficulty === 'Hard' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                      {report.difficulty} Difficulty
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed italic">"{report.question}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. Q&A TAB */}
        {activeTab === 'qa' && (
          <div className="space-y-6">
            {mockData.qa.map((item, idx) => (
              <div key={idx} className="bg-white border border-border rounded-xl p-5 card-shadow space-y-4">
                <div className="flex items-start space-x-3.5">
                  <div className="w-8 h-8 rounded-lg bg-neutral-50 border border-border flex items-center justify-center text-neutral-400 shrink-0 font-extrabold text-xs">
                    Q
                  </div>
                  <div>
                    <h3 className="font-extrabold text-neutral-800 text-sm leading-snug">{item.question}</h3>
                    <span className="text-[10px] text-neutral-450 font-semibold mt-1 block">{item.votes} upvotes</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3.5 border-t border-neutral-100 pt-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 font-extrabold text-xs">
                    A
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed pt-1.5">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
