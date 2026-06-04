import Link from 'next/link';
import CompanyLogo from '@/components/features/CompanyLogo';
import { Star, ClipboardList, ArrowUpRight, HelpCircle, Sparkles, Code, Layout, User, ChevronRight, MessageSquare, Plus, ArrowUp } from 'lucide-react';
import React from 'react';
export const runtime = "edge";
export const dynamic = 'force-dynamic';

export default async function InterviewsHubPage() {
  const recentQuestions = [
    {
      company: 'Google',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg',
      slug: 'google',
      role: 'Software Engineer',
      time: '2h ago',
      question: 'Given a binary tree, serialize and deserialize it. How would you design the serialization method?',
      difficulty: 'Easy',
      diffClass: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      tags: ['Algorithms', 'Binary Tree', 'Design'],
      answers: '128 answers'
    },
    {
      company: 'Microsoft',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
      slug: 'microsoft',
      role: 'Product Manager',
      time: '3h ago',
      question: 'How would you improve customer retention for Microsoft 365? Walk me through your approach.',
      difficulty: 'Medium',
      diffClass: 'bg-amber-50 text-amber-700 border-amber-100',
      tags: ['Product Sense', 'Metrics', 'Strategy'],
      answers: '96 answers'
    },
    {
      company: 'Amazon',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
      slug: 'amazon',
      role: 'SDE II',
      time: '5h ago',
      question: 'Design a rate limiter. How would you handle distributed systems and ensure scalability?',
      difficulty: 'Hard',
      diffClass: 'bg-rose-50 text-rose-700 border-rose-100',
      tags: ['System Design', 'Scalability', 'API'],
      answers: '64 answers'
    },
    {
      company: 'Apple',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
      slug: 'apple',
      role: 'Data Analyst',
      time: '6h ago',
      question: 'How would you analyze App Store performance and suggest data-driven improvements?',
      difficulty: 'Medium',
      diffClass: 'bg-amber-50 text-amber-700 border-amber-100',
      tags: ['SQL', 'Analytics', 'Data Visualization'],
      answers: '52 answers'
    },
    {
      company: 'Meta',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
      slug: 'meta',
      role: 'Product Designer',
      time: '7h ago',
      question: 'Redesign the Facebook Events creation flow to improve user engagement. What would you do?',
      difficulty: 'Medium',
      diffClass: 'bg-amber-50 text-amber-700 border-amber-100',
      tags: ['Product Design', 'UX', 'User Research'],
      answers: '41 answers'
    }
  ];

  const roles = [
    {
      name: 'Software Engineer',
      count: '12.4K questions',
      latest: 'Implement LRU Cache in O(1) time complexity',
      trend: '18%',
      trendUp: true,
      logos: [
        'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg',
        'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
        'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg'
      ],
      plusCount: '+3'
    },
    {
      name: 'Product Manager',
      count: '8.7K questions',
      latest: 'How would you launch a new payments feature?',
      trend: '14%',
      trendUp: true,
      logos: [
        'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg',
        'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
        'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg'
      ],
      plusCount: '+2'
    },
    {
      name: 'Data Analyst',
      count: '6.3K questions',
      latest: 'Analyze sales performance and identify trends',
      trend: '22%',
      trendUp: true,
      logos: [
        'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg',
        'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg'
      ],
      plusCount: '+2'
    },
    {
      name: 'Product Designer',
      count: '4.1K questions',
      latest: 'Improve the checkout flow for better conversion',
      trend: '16%',
      trendUp: true,
      logos: [
        'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg',
        'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg'
      ],
      plusCount: '+2'
    }
  ];

  const topics = [
    { name: 'System Design', count: '2.4K questions' },
    { name: 'Algorithms', count: '1.8K questions' },
    { name: 'SQL', count: '1.6K questions' },
    { name: 'Behavioral', count: '870 questions' },
    { name: 'Product Sense', count: '765 questions' },
    { name: 'Data Structures', count: '987 questions' },
    { name: 'API Design', count: '876 questions' },
    { name: 'Case Studies', count: '765 questions' },
    { name: 'Machine Learning', count: '654 questions' }
  ];

  return (
    <div className="space-y-10">
      {/* Hero Header Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-800 p-8 md:p-12 shadow-xl text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-primary/10 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none" />

        <div className="relative max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-violet-200 text-xs font-semibold backdrop-blur-sm">
            <ClipboardList className="w-3.5 h-3.5" />
            <span>INTERVIEWS</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none bg-gradient-to-r from-white via-neutral-100 to-indigo-100 bg-clip-text text-transparent">
            Real interview questions from real candidates.
          </h1>
          <p className="text-sm md:text-base text-indigo-100 max-w-xl font-medium leading-relaxed">
            Recent interview experiences shared by verified professionals. Get complete coding loop, system design, and behavioral questions.
          </p>
          <div className="pt-2">
            <button className="inline-flex items-center space-x-2 bg-white hover:bg-neutral-100 text-indigo-950 font-bold px-5 py-2.5 rounded-lg text-xs tracking-wider uppercase transition shadow-md active:scale-95">
              <span>Explore all interviews</span>
              <ChevronRight className="w-4 h-4 text-primary" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Questions Asked Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-black text-neutral-700 uppercase tracking-wider">Recent questions asked</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {recentQuestions.map((q, idx) => (
            <div key={idx} className="bg-white border border-border/80 rounded-xl p-4 card-shadow flex flex-col justify-between space-y-4 hover:border-primary/40 transition duration-200">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CompanyLogo logo={q.logo} name={q.company} size="sm" />
                    <div>
                      <h4 className="text-[10px] font-black text-neutral-800 leading-none">{q.company}</h4>
                      <span className="text-[8px] text-neutral-400 font-bold mt-0.5 block">{q.role} • {q.time}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-neutral-650 leading-relaxed font-semibold italic line-clamp-3">
                  "{q.question}"
                </p>
              </div>

              <div className="space-y-2 border-t border-neutral-50 pt-2.5">
                <div className="flex flex-wrap gap-1">
                  {q.tags.map((tag, tagIdx) => (
                    <span key={tagIdx} className="text-[8px] font-bold bg-neutral-50 border border-neutral-200 text-neutral-550 px-1.5 py-0.2 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-[9px] font-bold text-neutral-450 pt-0.5">
                  <span className={`px-2 py-0.2 rounded border ${q.diffClass}`}>
                    {q.difficulty}
                  </span>
                  <span>{q.answers}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Roles & Topics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Browse Questions by Role */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-neutral-700 uppercase tracking-wider">Browse questions by role</h2>
            <Link href="/interviews" className="text-xs font-bold text-primary hover:underline flex items-center">
              <span>View all roles</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="bg-white border border-border/80 rounded-2xl p-5 card-shadow space-y-4">
            {roles.map((r, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-neutral-50 pb-3.5 last:border-0 last:pb-0">
                <div className="space-y-1 max-w-[70%]">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs font-extrabold text-neutral-800">{r.name}</h4>
                    <span className="text-[9px] font-bold text-neutral-450">({r.count})</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-semibold italic block truncate">
                    Latest: "{r.latest}"
                  </span>
                  <div className="flex items-center space-x-1.5 pt-0.5">
                    {r.logos.map((logoUrl, logoIdx) => (
                      <img key={logoIdx} src={logoUrl} alt="logo" className="w-3.5 h-3.5 object-contain" />
                    ))}
                    <span className="text-[9px] font-bold text-neutral-400">{r.plusCount}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full flex items-center">
                    <ArrowUp className="w-2.5 h-2.5 mr-0.5" />
                    <span>{r.trend}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Interview Topics */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-sm font-black text-neutral-700 uppercase tracking-wider">Trending interview topics</h2>
          <div className="bg-white border border-border/80 rounded-2xl p-5 card-shadow flex flex-col justify-between min-h-[310px]">

            <div className="grid grid-cols-2 gap-3 flex-1">
              {topics.map((t, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-neutral-50 border border-neutral-200/80 hover:border-primary/45 rounded-xl cursor-pointer transition flex flex-col justify-between"
                >
                  <h4 className="text-[11px] font-extrabold text-neutral-800 leading-snug">{t.name}</h4>
                  <span className="text-[9px] font-bold text-neutral-400 mt-1 block">{t.count}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* CTA at the bottom */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-800 rounded-2xl p-8 shadow-xl text-white flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2">
          <h2 className="text-xl md:text-2xl font-black">Share your interview experience</h2>
          <p className="text-xs md:text-sm text-indigo-150 font-medium">Help other professionals by sharing the interview loop questions you faced.</p>
        </div>
        <button
          className="bg-white hover:bg-neutral-100 text-indigo-950 font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider shrink-0 transition shadow-md active:scale-95"
        >
          Submit interview questions
        </button>
      </div>

    </div>
  );
}
