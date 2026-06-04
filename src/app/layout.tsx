import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import ConditionalNavbar from '@/components/ConditionalNavbar';
import ConditionalFooter from '@/components/ConditionalFooter';
import ConditionalMain from '@/components/ConditionalMain';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'TalentDash — Career Intelligence and Tech Salary Database',
  description: 'Demystify software engineering, product manager, and data analyst compensation. Search verified salaries, base pay, and stock grants across top Indian and global tech firms.',
  keywords: [
    'levels fyi india',
    'tech salaries india',
    'software engineer salary amazon',
    'software engineer salary google',
    'compensation intelligence',
    'levels mapping',
    'talentdash'
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/salaries',
  },
  openGraph: {
    title: 'TalentDash — Tech Compensation and Salary Database',
    description: 'Vetted, level-mapped software engineering and tech salaries in Bengaluru and worldwide.',
    url: '/salaries',
    siteName: 'TalentDash',
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${inter.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-background text-neutral-800 font-sans selection:bg-primary/10 selection:text-primary">
          {/* Conditionally rendered — hidden on landing page */}
          <ConditionalNavbar />

          {/* Content Area — landing page manages its own padding/layout */}
          <main className="flex-1">
            <ConditionalMain>
              {children}
            </ConditionalMain>
          </main>

          {/* Conditionally rendered footer — hidden on landing page */}
          <ConditionalFooter />
        </body>
      </html>
    </ClerkProvider>
  );
}
