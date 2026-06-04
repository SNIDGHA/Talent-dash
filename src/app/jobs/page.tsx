import Link from 'next/link';
import { Star, MapPin, Users, Briefcase, ArrowUpRight, Sparkles } from 'lucide-react';
import React from 'react';

export const dynamic = 'force-dynamic';

export default async function JobsBoardPage() {
  const jobs = [
    {
      title: 'Senior Software Engineer - Backend (Go/Java)',
      company: 'Google',
      slug: 'google',
      location: 'Bengaluru, India',
      salaryRange: '₹40L - ₹65L',
      type: 'Full-time',
      posted: '2 days ago'
    },
    {
      title: 'Software Engineer II - React / TypeScript',
      company: 'Razorpay',
      slug: 'razorpay',
      location: 'Bengaluru, India',
      salaryRange: '₹24L - ₹38L',
      type: 'Full-time',
      posted: '3 days ago'
    },
    {
      title: 'Staff Machine Learning Specialist',
      company: 'Meta',
      slug: 'meta',
      location: 'Menlo Park, CA',
      salaryRange: '$220k - $310k',
      type: 'Full-time',
      posted: '4 days ago'
    },
    {
      title: 'Cloud Solutions SRE',
      company: 'Amazon',
      slug: 'amazon',
      location: 'Hyderabad, India',
      salaryRange: '₹22L - ₹36L',
      type: 'Full-time',
      posted: '1 week ago'
    },
    {
      title: 'Full-Stack Web Architect',
      company: 'Zepto',
      slug: 'zepto',
      location: 'Mumbai, India',
      salaryRange: '₹30L - ₹48L',
      type: 'Full-time',
      posted: '1 week ago'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center space-x-1.5 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Job Postings</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-800">
          Tech Job Board
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Find verified engineering, product, and tech positions at leading companies. Align your skills with real salary bands.
        </p>
      </div>

      {/* Jobs List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Job Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-border rounded-xl p-4 card-shadow flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-700 uppercase tracking-wider">Open Positions ({jobs.length})</h2>
          </div>

          <div className="space-y-4">
            {jobs.map((job, idx) => (
              <div key={idx} className="bg-white border border-border rounded-xl p-5 card-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-primary transition duration-150">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-neutral-800 text-base group-hover:text-primary transition-colors">{job.title}</h3>
                  <div className="flex items-center space-x-3 text-xs font-semibold text-neutral-450">
                    <Link href={`/companies/${job.slug}`} className="hover:text-primary font-bold transition">
                      {job.company}
                    </Link>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{job.location}</span>
                    </span>
                    <span>•</span>
                    <span>{job.type}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Est. Range</span>
                    <span className="font-extrabold text-primary text-sm">{job.salaryRange}</span>
                    <span className="text-[9px] text-neutral-400 block pt-0.5">Posted {job.posted}</span>
                  </div>
                  <button className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/95 transition active:scale-95 shadow-sm">
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick Stats Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-border rounded-xl p-5 card-shadow space-y-4">
            <h2 className="text-sm font-bold text-neutral-700 uppercase tracking-wider border-b border-border pb-3 flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-neutral-500" />
              <span>Career Advice</span>
            </h2>
            <div className="space-y-3 text-xs leading-relaxed text-neutral-600 font-semibold">
              <p>📌 Always negotiate stock grants based on recent levels.fyi data points.</p>
              <p>📌 India remote work stipends are standard at ₹30k - ₹50k for office setup.</p>
              <p>📌 Leverage multiple offers to push for sign-on cash bonuses.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
