import Link from 'next/link';
import CompanyLogo from '@/components/features/CompanyLogo';
import { Users, MessageSquare, ArrowUpRight, Sparkles, Flame, Plus, TrendingUp, Star, Award, Compass, MessageCircle, ChevronRight, Eye } from 'lucide-react';
import React from 'react';

export const dynamic = 'force-dynamic';

export default async function CommunityPage() {
  const hotDiscussions = [
    {
      company: 'Amazon',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
      title: 'Amazon appraisal discussion 2026',
      tag: 'Hot',
      tagColor: 'bg-orange-50 text-orange-700 border-orange-200',
      replies: 312,
      views: '4.2K'
    },
    {
      company: 'Google',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg',
      title: 'Google hiring freeze impact on offers?',
      tag: 'Hot',
      tagColor: 'bg-orange-50 text-orange-700 border-orange-200',
      replies: 245,
      views: '3.1K'
    },
    {
      company: 'DataEngineers',
      logo: null,
      title: 'Best companies for DataEngineers?',
      tag: 'Trending',
      tagColor: 'bg-blue-50 text-blue-700 border-blue-200',
      replies: 154,
      views: '1.8K'
    },
    {
      company: 'Remote',
      logo: null,
      title: 'Remote work vs office in 2026',
      tag: 'Hot',
      tagColor: 'bg-orange-50 text-orange-700 border-orange-200',
      replies: 386,
      views: '4.5K'
    },
    {
      company: 'Fintech',
      logo: null,
      title: '2026 PM salaries in India',
      tag: 'Trending',
      tagColor: 'bg-blue-50 text-blue-700 border-blue-200',
      replies: 278,
      views: '3.2K'
    },
    {
      company: 'Startups',
      logo: null,
      title: 'Startup layoffs megathread',
      tag: 'New',
      tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      replies: 112,
      views: '950'
    }
  ];

  const trendingNow = [
    {
      num: '01',
      title: 'Amazon SDE-2 salary hike 2026 - What are you expecting?',
      votes: '+112',
      company: 'Amazon',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
      slug: 'amazon'
    },
    {
      num: '02',
      title: 'Google L4 hiring bar - Is it really that high in 2026?',
      votes: '+95',
      company: 'Google',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg',
      slug: 'google'
    },
    {
      num: '03',
      title: "Microsoft return to office mandate - How's it going?",
      votes: '+78',
      company: 'Microsoft',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
      slug: 'microsoft'
    },
    {
      num: '04',
      title: 'Meta E5 performance cycle experience',
      votes: '+65',
      company: 'Meta',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
      slug: 'meta'
    },
    {
      num: '05',
      title: 'Apple PM salary band lookup - Real numbers?',
      votes: '+54',
      company: 'Apple',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
      slug: 'apple'
    }
  ];

  const popularCommunities = [
    { name: 'Software Engineering', members: '12.4K members', icon: Users, joined: false },
    { name: 'Product Management', members: '8.2K members', icon: Compass, joined: true },
    { name: 'Data Science', members: '6.3K members', icon: Star, joined: false },
    { name: 'MBA / Business', members: '4.1K members', icon: Award, joined: false },
    { name: 'Startups', members: '4.9K members', icon: Flame, joined: false }
  ];

  const topContributors = [
    {
      name: 'Ananya M.',
      handle: '@ananya_m',
      badge: 'Top 1%',
      badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      replies: '2.4K replies'
    },
    {
      name: 'Priya S.',
      handle: '@priya_s',
      badge: 'Top 1%',
      badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      replies: '1.8K replies'
    },
    {
      name: 'Kartik M.',
      handle: '@kartik_m',
      badge: 'Top 5%',
      badgeColor: 'bg-indigo-105 text-indigo-700 border-indigo-200',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      replies: '1.2K replies'
    },
    {
      name: 'Harini P.',
      handle: '@harini_p',
      badge: 'Top 5%',
      badgeColor: 'bg-indigo-105 text-indigo-700 border-indigo-200',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      replies: '990 replies'
    },
    {
      name: 'Nikhil P.',
      handle: '@nikhil_p',
      badge: 'Top 10%',
      badgeColor: 'bg-sky-100 text-sky-700 border-sky-200',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      replies: '870 replies'
    }
  ];

  return (
    <div className="space-y-10">
      {/* Hero Header Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-800 p-8 md:p-12 shadow-xl text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-primary/10 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none" />
        
        <div className="relative max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-violet-200 text-xs font-semibold backdrop-blur-sm">
            <Users className="w-3.5 h-3.5" />
            <span>COMMUNITY</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none bg-gradient-to-r from-white via-neutral-100 to-indigo-100 bg-clip-text text-transparent">
            What professionals are discussing.
          </h1>
          <p className="text-sm md:text-base text-indigo-100 max-w-xl font-medium leading-relaxed">
            Real conversations. Real insights. Share offers, seek referral advice, or check cultural feedback anonymously.
          </p>
          <div className="pt-2">
            <button className="inline-flex items-center space-x-2 bg-white hover:bg-neutral-100 text-indigo-950 font-bold px-5 py-2.5 rounded-lg text-xs tracking-wider uppercase transition shadow-md active:scale-95">
              <span>View all discussions</span>
              <ChevronRight className="w-4 h-4 text-primary" />
            </button>
          </div>
        </div>
      </div>

      {/* Hot discussions cards carousel */}
      <div className="space-y-4">
        <h2 className="text-sm font-black text-neutral-700 uppercase tracking-wider">Hot Topics & Discussions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {hotDiscussions.map((disc, idx) => (
            <div key={idx} className="bg-white border border-border/80 rounded-xl p-4 card-shadow flex flex-col justify-between space-y-4 hover:border-primary/40 transition duration-200">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  {disc.logo ? (
                    <img src={disc.logo} alt={disc.company} className="w-5 h-5 object-contain" />
                  ) : (
                    <div className="w-5 h-5 bg-neutral-100 rounded flex items-center justify-center text-[8px] font-black text-neutral-500 border border-border">
                      {disc.company.slice(0,2).toUpperCase()}
                    </div>
                  )}
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${disc.tagColor}`}>
                    {disc.tag}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-neutral-800 leading-snug line-clamp-2 hover:text-primary cursor-pointer transition">
                  {disc.title}
                </h3>
              </div>
              <div className="flex items-center justify-between text-[10px] font-bold text-neutral-400 border-t border-neutral-50 pt-2">
                <span className="flex items-center space-x-1">
                  <MessageSquare className="w-3 h-3 text-neutral-350" />
                  <span>{disc.replies} replies</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Eye className="w-3 h-3 text-neutral-350" />
                  <span>{disc.views}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3-Column Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Column 1: Trending Now */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-neutral-700 uppercase tracking-wider flex items-center space-x-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>Trending Now</span>
          </h3>
          <div className="bg-white border border-border/80 rounded-2xl p-5 card-shadow space-y-4">
            {trendingNow.map((item, idx) => (
              <div key={idx} className="flex items-start space-x-4 border-b border-neutral-50 pb-3 last:border-0 last:pb-0">
                <span className="text-sm font-black text-neutral-300 tracking-tight shrink-0 mt-0.5">
                  {item.num}
                </span>
                <div className="space-y-1.5 flex-1">
                  <h4 className="text-xs font-bold text-neutral-800 leading-snug hover:text-primary cursor-pointer transition">
                    {item.title}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-200 text-[9px] font-bold text-neutral-500">
                      {item.logo && <img src={item.logo} alt={item.company} className="w-2.5 h-2.5 object-contain mr-1 shrink-0" />}
                      <span>{item.company}</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                      {item.votes} votes
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Popular Communities */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-neutral-700 uppercase tracking-wider flex items-center space-x-2">
            <Compass className="w-4 h-4 text-indigo-500" />
            <span>Popular Communities</span>
          </h3>
          <div className="bg-white border border-border/80 rounded-2xl p-5 card-shadow space-y-4">
            {popularCommunities.map((comm, idx) => {
              const Icon = comm.icon;
              return (
                <div key={idx} className="flex items-center justify-between border-b border-neutral-50 pb-3.5 last:border-0 last:pb-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-primary shrink-0">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-800 hover:text-primary cursor-pointer transition">{comm.name}</h4>
                      <span className="text-[10px] font-bold text-neutral-400 block mt-0.5">{comm.members}</span>
                    </div>
                  </div>
                  <button 
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition border active:scale-95 ${
                      comm.joined 
                        ? 'bg-neutral-50 border-neutral-200 text-neutral-400 cursor-default' 
                        : 'bg-primary border-primary hover:bg-primary/95 text-white shadow-sm'
                    }`}
                  >
                    {comm.joined ? 'Joined' : 'Join'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 3: Top Contributors */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-neutral-700 uppercase tracking-wider flex items-center space-x-2">
            <Award className="w-4 h-4 text-yellow-500" />
            <span>Top Contributors</span>
          </h3>
          <div className="bg-white border border-border/80 rounded-2xl p-5 card-shadow space-y-4">
            {topContributors.map((user, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-neutral-50 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center space-x-3">
                  <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border border-neutral-200 shrink-0" />
                  <div>
                    <h4 className="text-xs font-extrabold text-neutral-800">{user.name}</h4>
                    <span className="text-[10px] font-bold text-neutral-400 block mt-0.5">{user.handle}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${user.badgeColor}`}>
                    {user.badge}
                  </span>
                  <span className="text-[9px] font-bold text-neutral-400">{user.replies}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* CTA start discussion card */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-800 rounded-2xl p-8 shadow-xl text-white flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2">
          <h2 className="text-xl md:text-2xl font-black">Share your experience. Help millions.</h2>
          <p className="text-xs md:text-sm text-indigo-150 font-medium">Contribute to the conversation. All posts are fully anonymous by default.</p>
        </div>
        <button
          className="bg-white hover:bg-neutral-100 text-indigo-950 font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider shrink-0 transition shadow-md active:scale-95"
        >
          Start a discussion
        </button>
      </div>

    </div>
  );
}
