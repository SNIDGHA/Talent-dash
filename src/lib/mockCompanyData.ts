export interface Review {
  rating: number;
  title: string;
  pros: string;
  cons: string;
  role: string;
  location: string;
  date: string;
}

export interface Benefit {
  category: 'Health' | 'Financial' | 'PTO' | 'Perks';
  name: string;
  included: boolean;
  description: string;
}

export interface Job {
  title: string;
  location: string;
  salaryRange: string;
  type: string;
}

export interface InterviewReport {
  title: string;
  role: string;
  question: string;
  outcome: 'Offer' | 'No Offer';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rating: number;
}

export interface InterviewData {
  difficulty: string;
  positivePct: number;
  processDuration: string;
  questions: string[];
  reports: InterviewReport[];
}

export interface QAItem {
  question: string;
  answer: string;
  votes: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface MockCompanyDetails {
  description: string;
  rating: number;
  recommendPct: number;
  reviews: Review[];
  benefits: Benefit[];
  jobs: Job[];
  interviews: InterviewData;
  qa: QAItem[];
  faqs: FAQItem[];
}

export function getMockCompanyData(companyName: string): MockCompanyDetails {
  const name = companyName || 'this company';
  
  // Custom descriptions per company
  let desc = `Working at ${name} offers competitive salaries, comprehensive benefits, and opportunities for career growth. Employees generally appreciate the collaborative culture and the scale of problems being solved.`;
  if (name.toLowerCase() === 'google') {
    desc = `Google is known for its high compensation, smart engineering talent, and industry-leading perks. Employees enjoy high technical autonomy, free gourmet food, and comprehensive health programs, though some note bureaucracy and slow promotion cycles.`;
  } else if (name.toLowerCase() === 'amazon') {
    desc = `Amazon operates at a massive global scale. SDEs gain rapid engineering experience and deal with high system ownership. Compensation is heavily weighted towards base salary and stock appreciation, though work-life balance varies by team.`;
  } else if (name.toLowerCase() === 'meta') {
    desc = `Meta offers top-of-market compensation, strong engineering execution, and high stock liquidity. Developers appreciate the open internal codebases and impact-focused leveling, but note intense performance reviews and fast pacing.`;
  } else if (name.toLowerCase() === 'microsoft') {
    desc = `Microsoft is highly rated for its excellent work-life balance, collaborative culture, and stable career trajectories. SDEs enjoy comprehensive benefits and flexible work models, though compensation ranges are occasionally lower than pure social media peers.`;
  }

  // Reviews
  const reviews: Review[] = [
    {
      rating: 5,
      title: 'Top-tier tech stack and great compensation',
      pros: 'Smartest peers in the industry, amazing work-life balance on most teams, and top-of-market stock grants.',
      cons: 'Promotion speed can feel slow due to stack ranking at higher levels.',
      role: 'Senior Software Engineer',
      location: 'Bengaluru, India',
      date: 'April 2026'
    },
    {
      rating: 4,
      title: 'Excellent learning but high pace',
      pros: 'Ownership of services is huge. Excellent learning opportunities for junior and mid-level developers.',
      cons: 'On-call rotations can be highly stressful and burn out team members.',
      role: 'Software Engineer II',
      location: 'Hyderabad, India',
      date: 'March 2026'
    },
    {
      rating: 4,
      title: 'Great benefits and stable work environment',
      pros: 'Comprehensive health insurance, nice office layouts, and very mature engineering practices.',
      cons: 'Legacy codebases on older products can slow down feature shipping.',
      role: 'Software Engineer I',
      location: 'Pune, India',
      date: 'February 2026'
    }
  ];

  // Benefits
  const benefits: Benefit[] = [
    { category: 'Health', name: 'Comprehensive Medical Insurance', included: true, description: 'Covers employee, spouse, children, and parents with zero co-pay.' },
    { category: 'Health', name: 'Gym & Wellness Reimbursement', included: true, description: 'Up to ₹40,000 per year for gym memberships or fitness equipment.' },
    { category: 'Financial', name: 'Employee Stock Purchase Plan (ESPP)', included: true, description: 'Purchase company stock at a 15% discount with convenient payroll deductions.' },
    { category: 'Financial', name: 'Gratuity & Pension Matching', included: true, description: 'Full statutory gratuity matching plus optional corporate NPS contribution.' },
    { category: 'PTO', name: 'Paid Vacation Leave', included: true, description: '25 days of paid annual vacation plus 12 regional public holidays.' },
    { category: 'PTO', name: 'Parental Leave', included: true, description: '18 weeks of fully paid maternity and paternity leave.' },
    { category: 'Perks', name: 'Free Meals & Catering', included: name.toLowerCase() !== 'tcs' && name.toLowerCase() !== 'infosys', description: 'Gourmet cafeteria offering breakfast, lunch, and dinner options.' },
    { category: 'Perks', name: 'Remote Work Budget', included: true, description: 'One-time stipend of ₹50,000 to purchase home-office equipment.' }
  ];

  // Jobs
  const jobs: Job[] = [
    { title: 'Software Engineer - Frontend', location: 'Bengaluru, India', salaryRange: '₹22L - ₹35L', type: 'Full-time' },
    { title: 'Senior Backend Developer (Java/Go)', location: 'Bengaluru, India', salaryRange: '₹40L - ₹65L', type: 'Full-time' },
    { title: 'Product Manager - Machine Learning', location: 'Bengaluru, India', salaryRange: '₹35L - ₹55L', type: 'Full-time' },
    { title: 'Site Reliability Engineer', location: 'Hyderabad, India', salaryRange: '₹25L - ₹42L', type: 'Full-time' }
  ];

  // Interviews
  const interviews: InterviewData = {
    difficulty: name.toLowerCase() === 'tcs' || name.toLowerCase() === 'infosys' ? 'Medium' : 'Hard',
    positivePct: 82,
    processDuration: '3-5 weeks',
    questions: [
      'Given a binary tree, serialize and deserialize it to/from a string format.',
      'Design a system like TinyURL that can handle 10,000 write requests per second.',
      'Explain how you would resolve a technical conflict between two developers in your team.'
    ],
    reports: [
      {
        title: 'Rigorous but structured technical loops',
        role: 'SDE II Interview',
        question: 'Main coding round was an optimization problem involving dynamic programming and graphs.',
        outcome: 'Offer',
        difficulty: 'Hard',
        rating: 4
      },
      {
        title: 'Standard LeetCode and System Design focus',
        role: 'SDE I Interview',
        question: 'Asked to find the longest substring without repeating characters, followed by standard behavioral questions.',
        outcome: 'Offer',
        difficulty: 'Medium',
        rating: 5
      }
    ]
  };

  // Q&A
  const qa: QAItem[] = [
    {
      question: `What is the current hybrid remote policy at ${name}?`,
      answer: 'Currently, the company mandates 3 days of work from the office (Tuesday-Thursday) and allows 2 days remote.',
      votes: 18
    },
    {
      question: 'How are bonuses structured and when are they paid out?',
      answer: 'Variable bonuses are paid out annually in March, based on a mix of individual performance ratings and company performance metrics.',
      votes: 12
    }
  ];

  // FAQs
  const faqs: FAQItem[] = [
    {
      question: `What is the average total compensation at ${name}?`,
      answer: `The average total compensation at ${name} depends on the level, starting from junior engineering bands up to staff leadership positions, with additional stock options and annual cash bonuses.`
    },
    {
      question: `Where is the headquarters of ${name}?`,
      answer: `The main headquarters is located in the primary tech hub listed for ${name}, with extensive development offices in major hubs across India including Bengaluru, Hyderabad, and Pune.`
    },
    {
      question: `What are the typical interview rounds at ${name}?`,
      answer: 'The process usually consists of an initial recruiter screen, followed by 1-2 coding phone screens, and finally a virtual on-site loop consisting of 2 coding rounds, 1 system design round, and 1 behavioral interview.'
    }
  ];

  return {
    description: desc,
    rating: name.toLowerCase() === 'google' || name.toLowerCase() === 'meta' ? 4.5 : name.toLowerCase() === 'microsoft' ? 4.3 : 4.1,
    recommendPct: name.toLowerCase() === 'google' || name.toLowerCase() === 'microsoft' ? 88 : 82,
    reviews,
    benefits,
    jobs,
    interviews,
    qa,
    faqs
  };
}
