import Link from 'next/link';
import CompanyLogo from '@/components/features/CompanyLogo';
import { Award, Star, ChevronRight, ShieldCheck, Sparkles, Briefcase, TrendingUp } from 'lucide-react';
import React from 'react';
export const runtime = "edge";
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Workplace Index — TalentDash',
  description: 'Data-driven rankings of companies, industries and workplaces based on what professionals value the most. No sponsored listings, pure data.'
};

export default async function WorkplaceIndexPage() {
  const rankingLists = [
    {
      title: 'Top 100 Companies Overall',
      href: '/companies',
      companies: [
        { rank: 1, name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg', slug: 'google' },
        { rank: 2, name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg', slug: 'microsoft' },
        { rank: 3, name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', slug: 'apple' }
      ]
    },
    {
      title: 'Top 100 Companies for Millennials',
      href: '/companies',
      companies: [
        { rank: 1, name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg', slug: 'google' },
        { rank: 2, name: 'Meta', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg', slug: 'meta' },
        { rank: 3, name: 'Netflix', logo: null, slug: 'netflix' }
      ]
    },
    {
      title: 'Top 100 Companies for Gen Z',
      href: '/companies',
      companies: [
        { rank: 1, name: 'NVIDIA', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg', slug: 'nvidia' },
        { rank: 2, name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg', slug: 'google' },
        { rank: 3, name: 'Spotify', logo: null, slug: 'spotify' }
      ]
    },
    {
      title: 'Top 100 Best Paying Companies',
      href: '/salaries',
      companies: [
        { rank: 1, name: 'NVIDIA', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg', slug: 'nvidia' },
        { rank: 2, name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg', slug: 'google' },
        { rank: 3, name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg', slug: 'microsoft' }
      ]
    },
    {
      title: 'Top 100 for Work-Life Balance',
      href: '/companies',
      companies: [
        { rank: 1, name: 'Salesforce', logo: null, slug: 'salesforce' },
        { rank: 2, name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg', slug: 'microsoft' },
        { rank: 3, name: 'SAP', logo: null, slug: 'sap' }
      ]
    },
    {
      title: 'Top 100 Most Loved Workplaces',
      href: '/reviews',
      companies: [
        { rank: 1, name: 'Salesforce', logo: null, slug: 'salesforce' },
        { rank: 2, name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg', slug: 'microsoft' },
        { rank: 3, name: 'Intuit', logo: null, slug: 'intuit' }
      ]
    }
  ];

  const industryExplore = [
    {
      name: 'IT Services',
      href: '/companies?industry=Technology',
      logos: [
        { name: 'Google', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg' },
        { name: 'Infosys', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&fit=crop&auto=format' },
        { name: 'TCS', url: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=80&fit=crop&auto=format' },
        { name: 'Wipro', url: 'https://images.unsplash.com/photo-1618005198143-e5283b519a7f?w=80&fit=crop&auto=format' }
      ]
    },
    {
      name: 'BFSI',
      href: '/companies?industry=Finance',
      logos: [
        { name: 'SBI', url: null },
        { name: 'HDFC', url: null },
        { name: 'ICICI', url: null }
      ]
    },
    {
      name: 'FMCG',
      href: '/companies',
      logos: [
        { name: 'Nestle', url: null },
        { name: 'HUL', url: null },
        { name: 'ITC', url: null }
      ]
    },
    {
      name: 'E-Commerce',
      href: '/companies',
      logos: [
        { name: 'Amazon', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
        { name: 'Flipkart', url: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Flipkart_logo.svg' },
        { name: 'Meesho', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&fit=crop&auto=format' },
        { name: 'Zepto', url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=80&fit=crop&auto=format' }
      ]
    }
  ];

  const toolsList = [
    { name: 'Salary Calculator', desc: 'Calculate your in-hand salary & deductions.', count: '120K+ used', href: '/tools' },
    { name: 'Salary Hike Calculator', desc: 'Plan your next hike with confidence.', count: '95K+ used', href: '/tools' },
    { name: 'Equity Calculator', desc: 'Calculate RSU/ESOP value & future worth.', count: '80K+ used', href: '/tools' },
    { name: 'Offer Comparator', desc: 'Compare multiple offers side-by-side.', count: '65K+ used', href: '/compare' },
    { name: 'Resume Analyzer', desc: 'Get AI feedback to improve your resume.', count: '110K+ used', href: '/tools' },
    { name: 'Tax Calculator', desc: 'Estimate your taxes & take-home pay.', count: '90K+ used', href: '/tools' }
  ];

  const trustAvatars = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80'
  ];

  return (
    <div className="space-y-10">
      {/* Hero Header Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-800 p-8 md:p-12 shadow-xl text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-primary/10 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none" />

        <div className="relative max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-violet-200 text-xs font-semibold backdrop-blur-sm">
            <Award className="w-3.5 h-3.5" />
            <span>WORKPLACE INDEX</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none bg-gradient-to-r from-white via-neutral-100 to-indigo-100 bg-clip-text text-transparent">
            TalentDash Workplace Index
          </h1>
          <p className="text-sm md:text-base text-indigo-100 max-w-xl font-medium leading-relaxed">
            Data-driven rankings of companies, industries and workplaces based on what professionals value the most. No sponsored listings, pure data.
          </p>
          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <Link
              href="/companies"
              id="explore-all-rankings-btn"
              className="inline-flex items-center space-x-2 bg-white hover:bg-neutral-100 text-indigo-950 font-bold px-5 py-2.5 rounded-lg text-xs tracking-wider uppercase transition shadow-md active:scale-95"
            >
              <span>Explore all rankings</span>
              <ChevronRight className="w-4 h-4 text-primary" />
            </Link>
            <Link
              href="/salaries"
              id="view-salaries-btn"
              className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-5 py-2.5 rounded-lg text-xs tracking-wider uppercase transition backdrop-blur-sm active:scale-95"
            >
              <TrendingUp className="w-4 h-4" />
              <span>View salaries</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Companies ranked', value: '500+', desc: 'Across 50+ countries' },
          { label: 'Verified data points', value: '15M+', desc: 'From real professionals' },
          { label: 'Ranking categories', value: '30+', desc: 'Updated monthly' },
          { label: 'No paid placements', value: '100%', desc: 'Transparent methodology' }
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

      {/* Popular Ranking Lists Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-black text-neutral-700 uppercase tracking-wider">Popular ranking lists</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {rankingLists.map((list, idx) => (
            <div key={idx} className="bg-white border border-border/80 rounded-xl p-4 card-shadow flex flex-col justify-between space-y-4 hover:border-primary/30 transition duration-200">
              <h3 className="text-xs font-black text-neutral-850 leading-tight">
                {list.title}
              </h3>

              <div className="space-y-2.5">
                {list.companies.map((comp, compIdx) => (
                  <Link
                    key={compIdx}
                    href={`/companies/${comp.slug}`}
                    id={`ranking-${idx}-company-${comp.slug}`}
                    className="flex items-center space-x-2 p-1 hover:bg-neutral-50 rounded-lg transition"
                  >
                    <span className="text-[10px] font-black text-neutral-400 w-3">{comp.rank}</span>
                    <CompanyLogo logo={comp.logo} name={comp.name} size="sm" />
                    <span className="text-[10px] font-extrabold text-neutral-700 truncate">{comp.name}</span>
                  </Link>
                ))}
              </div>

              <Link
                href={list.href}
                id={`view-full-list-${idx}`}
                className="flex items-center justify-between border-t border-neutral-50 pt-2.5 text-[9px] font-black text-primary uppercase hover:underline"
              >
                <span>View full list</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Explore by Industry Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-black text-neutral-700 uppercase tracking-wider">Explore by industry</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {industryExplore.map((ind, idx) => (
            <Link
              key={idx}
              href={ind.href}
              id={`industry-${ind.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="bg-white border border-border/80 rounded-xl p-4 card-shadow space-y-3 hover:border-primary/30 hover:-translate-y-0.5 transition duration-200 group block"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-neutral-850 group-hover:text-primary transition-colors">{ind.name}</h3>
                <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider">Top Companies</span>
              </div>
              <div className="flex items-center space-x-2">
                {ind.logos.map((logo, logoIdx) => (
                  <div key={logoIdx} className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-200/80 flex items-center justify-center p-1 overflow-hidden">
                    {logo.url ? (
                      <img src={logo.url} alt={logo.name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-[8px] font-black text-neutral-400">{logo.name.slice(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                ))}
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[9px] font-black text-primary group-hover:bg-primary group-hover:text-white transition">
                  →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Trust & Offer Evaluator Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Rankings You Can Trust */}
        <div className="xl:col-span-1 bg-white border border-border/80 rounded-2xl p-6 card-shadow flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-black text-neutral-800 uppercase tracking-wider border-b border-neutral-50 pb-3 flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>Rankings you can trust</span>
            </h3>
            <ul className="space-y-3 text-xs font-bold text-neutral-600 leading-relaxed">
              <li className="flex items-center space-x-2">
                <span className="text-emerald-500 font-extrabold text-sm">✔</span>
                <span>Verified data only (work email/offer letter required)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-emerald-500 font-extrabold text-sm">✔</span>
                <span>No sponsored rankings or paid company placements</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-emerald-500 font-extrabold text-sm">✔</span>
                <span>Updated monthly using statistical median pay calculations</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-emerald-500 font-extrabold text-sm">✔</span>
                <span>Transparent methodology reviewed by data experts</span>
              </li>
            </ul>
          </div>

          <div className="flex items-center space-x-3 pt-4 border-t border-neutral-50">
            <div className="flex -space-x-2.5">
              {trustAvatars.map((url, i) => (
                <img key={i} src={url} alt="Contributor" className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm" />
              ))}
            </div>
            <span className="text-[10px] font-bold text-neutral-450">Backed by 15M+ verified professionals globally</span>
          </div>
        </div>

        {/* Decode Your Offer (Evaluate Offer) */}
        <div className="xl:col-span-2 bg-white border border-border/80 rounded-2xl p-6 card-shadow grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-violet-50 text-indigo-700 border border-indigo-150 text-[9px] font-black uppercase">
              <Sparkles className="w-3 h-3 text-primary" />
              <span>OFFERS</span>
            </div>
            <h3 className="text-lg font-black text-neutral-800 leading-tight">
              Decode your offer. Know your worth.
            </h3>
            <p className="text-xs font-semibold text-neutral-500 leading-relaxed">
              AI-powered insights to evaluate your total compensation package against real market benchmarks. Make confident negotiation decisions.
            </p>
            <div className="space-y-2 text-[10px] font-bold text-neutral-450">
              <p>⏱ Evaluate your offer in 2 minutes</p>
              <p>📊 Get percentile rank for base pay and stock grants</p>
            </div>
            <div className="pt-1">
              <Link
                href="/compare"
                id="evaluate-offer-btn"
                className="inline-flex items-center space-x-2 bg-primary hover:bg-primary/95 text-white font-black px-4 py-2.5 rounded-lg text-xs uppercase tracking-wider transition shadow-sm active:scale-95"
              >
                <span>Evaluate my offer</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Offer Evaluation Score Preview Card */}
          <div className="bg-neutral-50 border border-neutral-250/60 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-200/60 pb-3">
              <span className="text-[10px] font-black text-neutral-450 uppercase tracking-wider">Your Offer Score</span>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase">Above Market</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold text-neutral-400 block">Overall Rank</span>
                <span className="text-3xl font-black text-neutral-800 tracking-tight">82<span className="text-xs text-neutral-450">/100</span></span>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-emerald-500 flex items-center justify-center font-black text-emerald-600 text-sm">
                82%
              </div>
            </div>
            <div className="space-y-2 pt-2 border-t border-neutral-200/60 text-[9px] font-bold">
              <div className="flex justify-between">
                <span className="text-neutral-500">Base Salary</span>
                <span className="text-emerald-600">Above Market</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Bonus</span>
                <span className="text-amber-600">Average</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Equity (RSUs)</span>
                <span className="text-emerald-600">Above Market</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Benefits</span>
                <span className="text-emerald-600">Excellent</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Powerful Tools Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Briefcase className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-black text-neutral-700 uppercase tracking-wider">Powerful tools. Smarter career moves.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {toolsList.map((tool, idx) => (
            <Link
              key={idx}
              href={tool.href}
              id={`tool-${idx}`}
              className="bg-white border border-border/80 rounded-xl p-4 card-shadow flex flex-col justify-between space-y-4 hover:border-primary/45 hover:-translate-y-0.5 transition duration-200 group"
            >
              <div className="space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Star className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-black text-neutral-850 leading-tight group-hover:text-primary transition-colors">{tool.name}</h3>
                <p className="text-[10px] font-semibold text-neutral-450 leading-relaxed">{tool.desc}</p>
              </div>
              <div className="flex items-center justify-between border-t border-neutral-50 pt-2.5">
                <span className="text-[9px] font-bold text-neutral-400">{tool.count}</span>
                <span className="text-[9px] font-black text-primary uppercase flex items-center group-hover:underline">
                  <span>Use Tool</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
