'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Scale, BarChart2, Menu, X, ArrowUpRight, Building, MessageSquare, ClipboardList, Briefcase, Users, Calculator, Award } from 'lucide-react';
import { SignInButton, SignUpButton, SignOutButton, UserButton, useAuth } from '@clerk/nextjs';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();

  const navItems = [
    { name: 'Companies', path: '/companies', icon: Building },
    { name: 'Salaries', path: '/salaries', icon: BarChart2 },
    { name: 'Compare', path: '/compare', icon: Scale },
    { name: 'Reviews', path: '/reviews', icon: MessageSquare },
    { name: 'Interviews', path: '/interviews', icon: ClipboardList },
    { name: 'Jobs', path: '/jobs', icon: Briefcase },
    { name: 'Community', path: '/community', icon: Users },
    { name: 'Tools', path: '/tools', icon: Calculator },
    { name: 'Workplace Index', path: '/workplace-index', icon: Award }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/salaries" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
                <Scale className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-black text-neutral-800 tracking-tight">
                Talent<span className="text-primary font-black">Dash</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-155 ${
                    isActive
                      ? 'bg-neutral-50 text-primary border border-border/80 shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Side: Auth + Submit CTA */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Auth buttons (only show once Clerk has loaded) */}
            {isLoaded && (
              <>
                {isSignedIn ? (
                  /* Signed-in: show avatar + sign out */
                  <div className="flex items-center space-x-2">
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: 'w-8 h-8 rounded-lg border border-border shadow-sm'
                        }
                      }}
                    />
                  </div>
                ) : (
                  /* Signed-out: show sign in + sign up */
                  <>
                    <SignInButton mode="modal">
                      <button
                        id="navbar-sign-in-btn"
                        className="px-3.5 py-2 rounded-lg text-xs font-bold text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50 border border-border/60 transition duration-155"
                      >
                        Sign in
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button
                        id="navbar-sign-up-btn"
                        className="px-3.5 py-2 rounded-lg text-xs font-bold bg-neutral-800 hover:bg-neutral-900 text-white transition duration-155 shadow-sm active:scale-95"
                      >
                        Sign up
                      </button>
                    </SignUpButton>
                  </>
                )}
              </>
            )}

            {/* Submit salary CTA (always visible) */}
            <Link
              href="/submit"
              id="navbar-submit-salary-btn"
              className="inline-flex items-center space-x-1 px-4 py-2 rounded-lg bg-primary text-white font-bold text-xs hover:bg-primary/95 transition duration-155 shadow-sm active:scale-95"
            >
              <span>Submit Salary</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile auth state */}
            {isLoaded && isSignedIn && (
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8 rounded-lg border border-border shadow-sm'
                  }
                }}
              />
            )}
            {isLoaded && !isSignedIn && (
              <SignInButton mode="modal">
                <button className="text-xs font-bold text-neutral-600 hover:text-primary px-2 py-1 rounded transition">
                  Sign in
                </button>
              </SignInButton>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50 focus:outline-none transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-border px-4 pt-2 pb-4 space-y-1 shadow-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-neutral-50 text-primary border border-border/85'
                    : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <div className="pt-4 border-t border-border mt-3 space-y-2">
            <Link
              href="/submit"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center space-x-1.5 py-3 rounded-lg bg-primary text-white font-bold text-sm shadow-sm hover:bg-primary/95 active:scale-95 transition"
            >
              <span>Submit Salary</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            {isLoaded && !isSignedIn && (
              <SignUpButton mode="modal">
                <button className="w-full py-3 rounded-lg bg-neutral-800 text-white font-bold text-sm hover:bg-neutral-900 active:scale-95 transition">
                  Create Account
                </button>
              </SignUpButton>
            )}
            {isLoaded && isSignedIn && (
              <SignOutButton>
                <button className="w-full py-3 rounded-lg border border-border text-neutral-600 font-bold text-sm hover:bg-neutral-50 active:scale-95 transition">
                  Sign out
                </button>
              </SignOutButton>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
