import Link from 'next/link';
import CompanyLogo from '@/components/features/CompanyLogo';
import { Star, MessageSquare, ThumbsUp, ThumbsDown, CheckCircle, ChevronRight, Sparkles, PenLine, Building } from 'lucide-react';
import React from 'react';
export const runtime = "edge";
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Company Reviews — TalentDash',
  description: 'Read honest company reviews from verified tech professionals. Discover work culture, salary insights, and career growth at top tech firms.'
};

export default async function ReviewsHubPage() {
  const topRatedCompanies = [
    {
      name: 'Google',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg',
      slug: 'google',
      rating: 4.3,
      reviewsCount: '12.4K',
      workLife: 4.4,
      comp: 4.2,
      culture: 4.5,
      badge: 'Best Work Culture 2026',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-250'
    },
    {
      name: 'Microsoft',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
      slug: 'microsoft',
      rating: 4.2,
      reviewsCount: '9.8K',
      workLife: 4.0,
      comp: 4.1,
      culture: 4.3,
      badge: 'Top Companies 2026',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-250'
    },
    {
      name: 'Apple',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
      slug: 'apple',
      rating: 4.1,
      reviewsCount: '8.2K',
      workLife: 3.8,
      comp: 4.3,
      culture: 4.0,
      badge: 'Most Loved Workplace',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-250'
    },
    {
      name: 'Amazon',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
      slug: 'amazon',
      rating: 3.8,
      reviewsCount: '14.2K',
      workLife: 3.0,
      comp: 4.2,
      culture: 3.7,
      badge: 'Trending Choice',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-250'
    }
  ];

  const tags = [
    'Great work culture', 'Learning & growth', 'Good WLB', 'Supportive management',
    'High compensation', 'Innovative projects', 'Career growth', 'Flexible work',
    'Inclusive environment', 'Strong brand value', 'Job security', 'Work pressure',
    'Long working hours', 'Heavy bureaucracy', 'Toxic culture'
  ];

  const recentReviews = [
    {
      company: 'Google',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg',
      slug: 'google',
      rating: 4.5,
      title: 'Great learning culture, amazing colleagues, strong brand value.',
      pros: 'Free food, solid health benefits, smart colleagues, and standard tooling make developer experience seamless.',
      cons: 'Promotion cycles can be extremely slow and corporate politics are rising.',
      role: 'Software Engineer',
      location: 'Bengaluru',
      date: '2h ago'
    },
    {
      company: 'Microsoft',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
      slug: 'microsoft',
      rating: 4.2,
      title: 'Work-life balance, great benefits, supportive management.',
      pros: 'Excellent work-life balance, great benefits, supportive management.',
      cons: 'Bureaucracy and slow decision making processes.',
      role: 'Product Manager',
      location: 'Hyderabad',
      date: '5h ago'
    },
    {
      company: 'Amazon',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
      slug: 'amazon',
      rating: 3.8,
      title: 'High compensation, career growth opportunities.',
      pros: 'High compensation, career growth opportunities.',
      cons: 'Work pressure, long hours, heavy bureaucracy.',
      role: 'SDE II',
      location: 'Bengaluru',
      date: '1d ago'
    }
  ];

  const positives = [
    { name: 'Flexible work hours', pct: '28%' },
    { name: 'Good work life balance', pct: '24%' },
    { name: 'Supportive team', pct: '18%' }
  ];

  const concerns = [
    { name: 'Long working hours', pct: '32%' },
    { name: 'High work pressure', pct: '26%' },
    { name: 'Weekend expectations', pct: '15%' }
  ];

  return (
    <div className="space-y-10">
      {/* Hero Header Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-800 p-8 md:p-12 shadow-xl text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-primary/10 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none" />

        <div className="relative max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-violet-200 text-xs font-semibold backdrop-blur-sm">
            <Star className="w-3.5 h-3.5" />
            <span>COMPANY REVIEWS</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none bg-gradient-to-r from-white via-neutral-100 to-indigo-100 bg-clip-text text-transparent">
            Real reviews from real professionals.
          </h1>
          <p className="text-sm md:text-base text-indigo-100 max-w-xl font-medium leading-relaxed">
            Discover honest insights about companies, work culture, salaries, and more. Make informed decisions about where you work next.
          </p>
          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <Link
              href="/companies"
              id="explore-all-reviews-btn"
              className="inline-flex items-center space-x-2 bg-white hover:bg-neutral-100 text-indigo-950 font-bold px-5 py-2.5 rounded-lg text-xs tracking-wider uppercase transition shadow-md active:scale-95"
            >
              <span>Explore all companies</span>
              <ChevronRight className="w-4 h-4 text-primary" />
            </Link>
            <Link
              href="/submit"
              id="write-review-hero-btn"
              className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-5 py-2.5 rounded-lg text-xs tracking-wider uppercase transition shadow-md active:scale-95 backdrop-blur-sm"
            >
              <PenLine className="w-4 h-4" />
              <span>Write a review</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Reviews', value: '2.4M+', desc: 'From verified professionals' },
          { label: 'Companies', value: '14.7K+', desc: 'Reviewed across industries' },
          { label: 'Avg. satisfaction', value: '4.1★', desc: 'Across all companies' },
          { label: 'Verified reviews', value: '96%', desc: 'From real professionals' }
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

      {/* Top Rated Companies & Tag Cloud Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Top Rated Companies List */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-neutral-700 uppercase tracking-wider">Top rated companies</h2>
            <Link href="/companies" className="text-xs font-bold text-primary hover:underline flex items-center">
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topRatedCompanies.map((c, idx) => (
              <Link
                key={idx}
                href={`/companies/${c.slug}`}
                id={`top-company-${c.slug}`}
                className="bg-white border border-border/80 rounded-xl p-5 card-shadow flex flex-col justify-between space-y-4 hover:border-primary/30 hover:-translate-y-0.5 transition duration-200 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <CompanyLogo logo={c.logo} name={c.name} size="md" />
                    <div>
                      <h3 className="text-sm font-extrabold text-neutral-800 group-hover:text-primary transition-colors">{c.name}</h3>
                      <div className="flex items-center space-x-1 mt-0.5 text-xs text-amber-500 font-bold">
                        <span>{c.rating}</span>
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-neutral-400 font-semibold">({c.reviewsCount} reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 border-t border-neutral-50 pt-3 text-[10px] font-bold text-neutral-400">
                  <div className="text-center space-y-1">
                    <span>Work Life</span>
                    <span className="block text-xs font-extrabold text-neutral-700">{c.workLife}</span>
                  </div>
                  <div className="text-center space-y-1">
                    <span>Comp & Benefits</span>
                    <span className="block text-xs font-extrabold text-neutral-700">{c.comp}</span>
                  </div>
                  <div className="text-center space-y-1">
                    <span>Culture</span>
                    <span className="block text-xs font-extrabold text-neutral-700">{c.culture}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-50 flex items-center justify-between">
                  <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded border text-[9px] font-bold ${c.badgeColor}`}>
                    <span>★</span>
                    <span>{c.badge}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Tag Cloud Column */}
        <div className="xl:col-span-1 space-y-4">
          <h2 className="text-sm font-black text-neutral-700 uppercase tracking-wider">What professionals say</h2>
          <div className="bg-white border border-border/80 rounded-2xl p-5 card-shadow flex flex-wrap gap-2.5 items-center justify-start min-h-[265px]">
            {tags.map((tag, idx) => {
              const isPositive = idx < 11;
              return (
                <Link
                  key={idx}
                  href={`/companies?search=${encodeURIComponent(tag)}`}
                  id={`tag-${idx}`}
                  className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition duration-150 hover:scale-105 cursor-pointer ${isPositive
                    ? 'bg-neutral-50 text-neutral-600 border-neutral-200/80 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200'
                    : 'bg-neutral-50 text-neutral-600 border-neutral-200/80 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-250'
                    }`}
                >
                  {tag}
                </Link>
              );
            })}
          </div>
        </div>

      </div>

      {/* Recent Reviews & Highlights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Latest Reviews List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-neutral-700 uppercase tracking-wider">Latest reviews</h2>
            <Link href="/companies" className="text-xs font-bold text-primary hover:underline flex items-center">
              <span>View all reviews</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentReviews.map((r, idx) => (
              <Link
                key={idx}
                href={`/companies/${r.slug}`}
                id={`review-${r.slug}-${idx}`}
                className="bg-white border border-border/80 rounded-xl p-5 card-shadow space-y-4 hover:border-primary/30 hover:-translate-y-0.5 transition duration-200 block group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <CompanyLogo logo={r.logo} name={r.company} size="sm" />
                    <div>
                      <h3 className="text-xs font-extrabold text-neutral-800 group-hover:text-primary transition-colors">{r.company}</h3>
                      <div className="flex items-center space-x-1.5 text-[10px] font-bold text-neutral-400 mt-0.5">
                        <span className="text-amber-500 flex items-center">{r.rating} <Star className="w-2.5 h-2.5 fill-current ml-0.5" /></span>
                        <span>•</span>
                        <span>{r.role}</span>
                        <span>•</span>
                        <span>{r.location}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-neutral-400">{r.date}</span>
                </div>

                <div className="space-y-2 text-xs leading-relaxed text-neutral-650 font-semibold">
                  <h4 className="font-extrabold text-neutral-800 text-sm">&quot;{r.title}&quot;</h4>
                  <p className="flex items-start space-x-2">
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong className="text-emerald-600 font-bold">Pros: </strong>{r.pros}</span>
                  </p>
                  <p className="flex items-start space-x-2">
                    <ThumbsDown className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span><strong className="text-rose-500 font-bold">Cons: </strong>{r.cons}</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Review Highlights */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-sm font-black text-neutral-700 uppercase tracking-wider">Review highlights</h2>
          <div className="bg-white border border-border/80 rounded-2xl p-5 card-shadow space-y-5 min-h-[350px] flex flex-col justify-between">

            {/* Overall Rating Section */}
            <div className="text-center pb-4 border-b border-neutral-50 space-y-1">
              <span className="text-4xl font-black text-neutral-800 tracking-tight">4.2<span className="text-sm font-bold text-neutral-400">/5</span></span>
              <div className="flex items-center justify-center text-amber-500 space-x-0.5">
                {[1, 2, 3, 4].map(star => (
                  <Star key={star} className="w-4 h-4 fill-current" />
                ))}
                <Star className="w-4 h-4 fill-current text-neutral-200" />
              </div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block pt-1">Average Work Life Score</span>
              <span className="text-[9px] font-semibold text-neutral-400 block mt-0.5">Based on 128K reviews</span>
            </div>

            {/* Positives & Concerns Breakdown */}
            <div className="space-y-4 flex-1 pt-4">
              {/* Positives */}
              <div className="space-y-2">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider block">Top positives</span>
                <div className="space-y-1.5">
                  {positives.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-semibold text-neutral-700">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-extrabold text-neutral-500">{item.pct}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Concerns */}
              <div className="space-y-2">
                <span className="text-[10px] font-black text-rose-600 uppercase tracking-wider block">Top concerns</span>
                <div className="space-y-1.5">
                  {concerns.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-semibold text-neutral-700">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-extrabold text-neutral-500">{item.pct}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* CTA card at the bottom */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-800 rounded-2xl p-8 shadow-xl text-white flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2">
          <h2 className="text-xl md:text-2xl font-black">Share your workplace experience</h2>
          <p className="text-xs md:text-sm text-indigo-150 font-medium">Write a review to help other tech professionals navigate their career search.</p>
        </div>
        <Link
          href="/submit"
          id="write-review-cta-btn"
          className="inline-flex items-center space-x-2 bg-white hover:bg-neutral-100 text-indigo-950 font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider shrink-0 transition shadow-md active:scale-95"
        >
          <PenLine className="w-4 h-4 text-primary" />
          <span>Write a review</span>
        </Link>
      </div>

    </div>
  );
}
