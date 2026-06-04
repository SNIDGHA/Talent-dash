'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/nextjs';
import {
  Search, MapPin, Briefcase, Star, Building2, BarChart2,
  MessageSquare, ClipboardList, ShoppingBag, Scale, Wrench,
  Gift, Shield, Users, Lock, ArrowRight, ChevronDown,
  TrendingUp, Heart
} from 'lucide-react';

const trendingSearches = [
  'Software Engineer',
  'Data Scientist',
  'Product Manager',
  'Marketing Manager',
  'Remote Jobs',
];

const trustStats = [
  { icon: Shield, label: 'Verified & Trusted', sub: 'Real data. Real people.' },
  { icon: Users, label: '10M+ Users', sub: 'Across the globe' },
  { icon: Building2, label: '500K+ Companies', sub: 'Researched & reviewed' },
  { icon: Lock, label: '100% Free', sub: 'No hidden charges' },
];

const subNavItems = [
  { name: 'Companies', path: '/companies', icon: Building2, hasDropdown: true },
  { name: 'Salaries', path: '/salaries', icon: BarChart2 },
  { name: 'Reviews', path: '/reviews', icon: MessageSquare },
  { name: 'Interviews', path: '/interviews', icon: ClipboardList },
  { name: 'Jobs', path: '/jobs', icon: ShoppingBag },
  { name: 'Forum', path: '/community', icon: Users },
  { name: 'Offers', path: '/compare', icon: Gift },
  { name: 'Tools', path: '/tools', icon: Wrench, hasDropdown: true },
  { name: 'Brands', path: '/workplace-index', icon: Star, hasDropdown: true },
];

const searchTabs = [
  { id: 'salaries', label: 'Salaries', icon: BarChart2 },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'interviews', label: 'Interviews', icon: ClipboardList },
  { id: 'forum', label: 'Forum', icon: Users },
];

export default function LandingPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  const [activeTab, setActiveTab] = useState('salaries');
  const [jobQuery, setJobQuery] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (jobQuery) params.set('company', jobQuery);
    if (location) params.set('location', location);

    const tabRoutes: Record<string, string> = {
      salaries: '/salaries',
      reviews: '/reviews',
      interviews: '/interviews',
      forum: '/community',
    };

    const base = tabRoutes[activeTab] || '/salaries';
    router.push(`${base}${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* ── TOP HEADER ──────────────────────────────────────────────── */}
      <header className="border-b border-neutral-100 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-base leading-none">D</span>
            </div>
            <span className="text-lg font-black text-neutral-900 tracking-tight">TalentDash</span>
          </Link>

          {/* Right: auth + extra actions */}
          <div className="flex items-center space-x-2">
            {isLoaded && (
              isSignedIn ? (
                /* Signed in: show avatar + go to app */
                <div className="flex items-center space-x-3">
                  <Link
                    href="/companies"
                    className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm"
                  >
                    <span>Go to Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <UserButton
                    appearance={{
                      elements: { avatarBox: 'w-8 h-8 rounded-full border-2 border-emerald-200 shadow-sm' }
                    }}
                  />
                </div>
              ) : (
                /* Signed out: show log in + sign up */
                <>
                  <SignInButton mode="modal" forceRedirectUrl="/companies">
                    <button
                      id="landing-login-btn"
                      className="flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-neutral-700 hover:bg-neutral-50 font-semibold text-sm transition border border-neutral-200"
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-500 rotate-180" />
                      <span>Log in</span>
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal" forceRedirectUrl="/companies">
                    <button
                      id="landing-signup-btn"
                      className="px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition shadow-sm active:scale-95"
                    >
                      Sign up
                    </button>
                  </SignUpButton>
                  <div className="hidden sm:flex items-center space-x-1 text-neutral-600 border-l border-neutral-200 pl-2 ml-1">
                    <button className="flex items-center space-x-1.5 px-3 py-1.5 hover:bg-neutral-50 rounded-full text-sm font-medium transition">
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      <span>Contribute</span>
                    </button>
                    <button className="flex items-center space-x-1.5 px-3 py-1.5 hover:bg-neutral-50 rounded-full text-sm font-medium transition">
                      <Briefcase className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Employer</span>
                    </button>
                  </div>
                </>
              )
            )}
          </div>
        </div>

        {/* ── SECONDARY NAV ─────────────────────────────────────────── */}
        <nav className="border-t border-neutral-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide h-11">
              {subNavItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-neutral-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg whitespace-nowrap transition group"
                >
                  <span>{item.name}</span>
                  {item.hasDropdown && <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-600" />}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {/* ── HERO SECTION ────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-b from-emerald-50/60 via-white to-white flex-1 flex flex-col items-center pt-16 pb-20 px-4">
        {/* Background blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-16 -left-20 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl" />
          <div className="absolute top-32 -right-16 w-72 h-72 bg-emerald-50/60 rounded-full blur-2xl" />
        </div>

        <div className="relative z-10 w-full max-w-3xl flex flex-col items-center text-center space-y-5">

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-neutral-900 leading-none">
            Explore.&nbsp;Compare.&nbsp;Grow.
          </h1>
          <p className="text-base sm:text-lg text-neutral-500 font-medium max-w-lg leading-relaxed">
            Explore salaries, read real reviews, prepare for interviews,<br className="hidden sm:block" />
            and find the right opportunities — all in one place.
          </p>

          {/* Search Card */}
          <div className="w-full max-w-2xl bg-white border border-neutral-200 rounded-2xl shadow-lg overflow-hidden mt-4">
            {/* Tabs */}
            <div className="flex border-b border-neutral-100">
              {searchTabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-1.5 px-5 py-3.5 text-sm font-semibold transition-all ${
                      active
                        ? 'text-emerald-700 border-b-2 border-emerald-600 -mb-px bg-emerald-50/50'
                        : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-emerald-600' : 'text-neutral-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search inputs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center divide-y sm:divide-y-0 sm:divide-x divide-neutral-100 p-1">
              {/* Job title / company */}
              <div className="flex items-center space-x-2.5 px-4 py-3 flex-1 min-w-0">
                <Search className="w-4 h-4 text-neutral-400 shrink-0" />
                <div className="min-w-0">
                  <input
                    type="text"
                    placeholder="Search by job title, skill or company"
                    value={jobQuery}
                    onChange={(e) => setJobQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none bg-transparent font-medium"
                  />
                  <p className="text-[10px] text-neutral-350 mt-0.5 font-medium hidden sm:block">e.g. Software Engineer, Data Analyst</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-2.5 px-4 py-3 flex-1 min-w-0">
                <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
                <div className="min-w-0">
                  <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none bg-transparent font-medium"
                  />
                  <p className="text-[10px] text-neutral-350 mt-0.5 font-medium hidden sm:block">e.g. New York, Remote</p>
                </div>
              </div>

              {/* Experience */}
              <div className="flex items-center space-x-2.5 px-4 py-3 flex-1 min-w-0">
                <Briefcase className="w-4 h-4 text-neutral-400 shrink-0" />
                <div className="min-w-0">
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full text-sm text-neutral-800 focus:outline-none bg-transparent font-medium cursor-pointer"
                  >
                    <option value="">Experience</option>
                    <option value="0-1">0–1 years</option>
                    <option value="1-3">1–3 years</option>
                    <option value="3-5">3–5 years</option>
                    <option value="5-8">5–8 years</option>
                    <option value="8+">8+ years</option>
                  </select>
                  <p className="text-[10px] text-neutral-350 mt-0.5 font-medium hidden sm:block">e.g. 0–2 years</p>
                </div>
              </div>

              {/* Search button */}
              <div className="px-2 py-2 flex items-center justify-end">
                <button
                  id="landing-search-btn"
                  onClick={handleSearch}
                  className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition shadow-md active:scale-95 whitespace-nowrap"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </div>

          {/* Trending searches */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span className="text-xs font-semibold text-neutral-400">Trending searches:</span>
            {trendingSearches.map((term) => (
              <button
                key={term}
                onClick={() => {
                  setJobQuery(term);
                  router.push(`/salaries?company=${encodeURIComponent(term)}`);
                }}
                className="text-xs font-semibold text-neutral-700 bg-white border border-neutral-200 hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-full transition shadow-sm"
              >
                {term}
              </button>
            ))}
          </div>

        </div>

        {/* ── TRUST STATS ───────────────────────────────────────────── */}
        <div className="relative z-10 w-full max-w-3xl mt-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustStats.map(({ icon: Icon, label, sub }, i) => (
              <div
                key={i}
                className="flex items-center space-x-3 bg-white/80 border border-neutral-100 rounded-xl px-4 py-3.5 shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-neutral-800">{label}</p>
                  <p className="text-[10px] text-neutral-400 font-medium mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* ── EXPLORE SECTION ─────────────────────────────────────────── */}
      <section className="bg-white border-t border-neutral-100 py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900">Everything you need to grow your career</h2>
            <p className="text-sm text-neutral-500">From salary benchmarks to interview prep — all verified, all free.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: BarChart2, name: 'Salary Data', desc: 'Real verified comp data across roles & levels', href: '/salaries', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
              { icon: Building2, name: 'Companies', desc: 'Explore 500K+ companies with reviews & ratings', href: '/companies', color: 'bg-blue-50 text-blue-700 border-blue-100' },
              { icon: MessageSquare, name: 'Reviews', desc: 'Anonymous employee reviews from real insiders', href: '/reviews', color: 'bg-purple-50 text-purple-700 border-purple-100' },
              { icon: ClipboardList, name: 'Interview Prep', desc: 'Questions & tips from people who got the job', href: '/interviews', color: 'bg-amber-50 text-amber-700 border-amber-100' },
              { icon: Scale, name: 'Offer Comparator', desc: 'Compare multiple offers side-by-side instantly', href: '/compare', color: 'bg-rose-50 text-rose-700 border-rose-100' },
              { icon: TrendingUp, name: 'Workplace Index', desc: 'Data-driven company rankings, no sponsored spots', href: '/workplace-index', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <Link
                  key={i}
                  href={card.href}
                  className="group flex flex-col space-y-3 p-5 bg-white border border-neutral-100 hover:border-emerald-200 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${card.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-neutral-800 group-hover:text-emerald-700 transition-colors">{card.name}</h3>
                    <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">{card.desc}</p>
                  </div>
                  <div className="flex items-center text-xs font-bold text-emerald-700 space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA FOOTER ──────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-emerald-700 to-emerald-900 py-14 px-4 text-white text-center">
        <div className="max-w-xl mx-auto space-y-5">
          <h2 className="text-2xl sm:text-3xl font-black">Join 10M+ professionals today</h2>
          <p className="text-emerald-100 text-sm font-medium">Share your salary anonymously and unlock full access to all salary insights, company reviews, and career tools.</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <SignUpButton mode="modal" forceRedirectUrl="/companies">
              <button
                id="landing-cta-signup-btn"
                className="px-6 py-3 bg-white hover:bg-neutral-50 text-emerald-800 font-black rounded-xl text-sm transition shadow-md active:scale-95"
              >
                Get started — it&apos;s free
              </button>
            </SignUpButton>
            <Link
              href="/salaries"
              className="px-6 py-3 bg-emerald-600/40 hover:bg-emerald-600/60 border border-emerald-400/50 text-white font-bold rounded-xl text-sm transition active:scale-95 backdrop-blur-sm"
            >
              Browse salaries
            </Link>
          </div>
        </div>
      </section>

      {/* Minimal landing footer */}
      <footer className="border-t border-neutral-100 bg-white py-5 text-center text-xs text-neutral-400">
        © {new Date().getFullYear()} TalentDash — Real Leveling. Structured Data.
        <span className="mx-2">·</span>
        <Link href="/salaries" className="hover:text-emerald-700 transition">Salaries</Link>
        <span className="mx-2">·</span>
        <Link href="/companies" className="hover:text-emerald-700 transition">Companies</Link>
        <span className="mx-2">·</span>
        <Link href="/reviews" className="hover:text-emerald-700 transition">Reviews</Link>
      </footer>

    </div>
  );
}
