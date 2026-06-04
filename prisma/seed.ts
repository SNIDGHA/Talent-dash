import { PrismaClient, Level, Currency, Source } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to normalize company name and return normalized name, slug, and display name
function getCompanyDetails(rawName: string) {
  const clean = rawName.trim().toLowerCase();

  // 1. Apply alias mapping
  if (clean.includes('google')) {
    return { normalizedName: 'google', slug: 'google', displayName: 'Google' };
  }
  if (clean.includes('amazon') || clean.includes('aws')) {
    return { normalizedName: 'amazon', slug: 'amazon', displayName: 'Amazon' };
  }
  if (clean.includes('tata consultancy') || clean.includes('tcs')) {
    return { normalizedName: 'tcs', slug: 'tcs', displayName: 'TCS' };
  }
  if (clean.includes('meta') || clean.includes('facebook')) {
    return { normalizedName: 'meta', slug: 'meta', displayName: 'Meta' };
  }
  if (clean.includes('microsoft')) {
    return { normalizedName: 'microsoft', slug: 'microsoft', displayName: 'Microsoft' };
  }
  if (clean.includes('nvidia')) {
    return { normalizedName: 'nvidia', slug: 'nvidia', displayName: 'NVIDIA' };
  }
  if (clean.includes('apple')) {
    return { normalizedName: 'apple', slug: 'apple', displayName: 'Apple' };
  }
  if (clean.includes('flipkart')) {
    return { normalizedName: 'flipkart', slug: 'flipkart', displayName: 'Flipkart' };
  }
  if (clean.includes('meesho')) {
    return { normalizedName: 'meesho', slug: 'meesho', displayName: 'Meesho' };
  }
  if (clean.includes('razorpay')) {
    return { normalizedName: 'razorpay', slug: 'razorpay', displayName: 'Razorpay' };
  }
  if (clean.includes('zepto')) {
    return { normalizedName: 'zepto', slug: 'zepto', displayName: 'Zepto' };
  }
  if (clean.includes('infosys')) {
    return { normalizedName: 'infosys', slug: 'infosys', displayName: 'Infosys' };
  }
  if (clean.includes('wipro')) {
    return { normalizedName: 'wipro', slug: 'wipro', displayName: 'Wipro' };
  }

  // 2. Programmatic stripping of suffixes
  const suffixPattern = /\b(inc|llc|corp|co|ltd|incorporated|corporation|limited|pvt|pvt\.? ltd|internet pvt ltd|\.com)\b/g;
  let stripped = clean.replace(suffixPattern, '').replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').trim();
  stripped = stripped.replace(/\s+/g, ' ');

  if (!stripped) {
    stripped = clean;
  }

  // Standard Slug Generation
  const slug = stripped.replace(/\s+/g, '-');

  // Standard Title Case Display Name
  const displayName = stripped
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    normalizedName: stripped,
    slug,
    displayName
  };
}
const seedCompaniesData = [
  { rawName: 'Google India Pvt. Ltd.', industry: 'Technology', headquarters: 'Mountain View, CA', foundedYear: 1998, headcountRange: '100,000+', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg' },
  { rawName: 'amazon.com', industry: 'E-commerce & Cloud', headquarters: 'Seattle, WA', foundedYear: 1994, headcountRange: '1,000,000+', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
  { rawName: 'Meta', industry: 'Social Media', headquarters: 'Menlo Park, CA', foundedYear: 2004, headcountRange: '50,000-99,999', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' },
  { rawName: 'MICROSOFT', industry: 'Technology', headquarters: 'Redmond, WA', foundedYear: 1975, headcountRange: '100,000+', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
  { rawName: 'NVIDIA', industry: 'Hardware & AI', headquarters: 'Santa Clara, CA', foundedYear: 1993, headcountRange: '20,000-49,999', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg' },
  { rawName: 'Apple Inc.', industry: 'Technology', headquarters: 'Cupertino, CA', foundedYear: 1976, headcountRange: '100,000+', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
  { rawName: 'Flipkart Internet Pvt Ltd', industry: 'E-commerce', headquarters: 'Bengaluru, India', foundedYear: 2007, headcountRange: '10,000-49,999', logo: 'https://logos-world.net/flipkart-logo/' },
  { rawName: 'Meesho', industry: 'E-commerce', headquarters: 'Bengaluru, India', foundedYear: 2015, headcountRange: '1,000-4,999', logo: 'https://commons.wikimedia.org/wiki/File:Meesho_logo.png' },
  { rawName: 'Razorpay', industry: 'Fintech', headquarters: 'Bengaluru, India', foundedYear: 2014, headcountRange: '1,000-4,999', logo: 'https://commons.wikimedia.org/wiki/File:Razorpay_logo.svg' },
  { rawName: 'Zepto', industry: 'Quick Commerce', headquarters: 'Mumbai, India', foundedYear: 2021, headcountRange: '1,000-4,999', logo: 'https://thehardcopy.co/how-landor-fitch-named-zepto/' },
  { rawName: 'Tata Consultancy Services', industry: 'IT Services', headquarters: 'Mumbai, India', foundedYear: 1968, headcountRange: '500,000+', logo: 'https://en.m.wikipedia.org/wiki/File:Tata_Consultancy_Services_Logo.svg' },
  { rawName: 'Infosys BPO', industry: 'IT Services', headquarters: 'Bengaluru, India', foundedYear: 1981, headcountRange: '100,000+', logo: 'https://www.freefonts.io/infosys-logo-font/' },
  { rawName: 'Wipro Technologies', industry: 'IT Services', headquarters: 'Bengaluru, India', foundedYear: 1945, headcountRange: '100,000+', logo: 'https://wiproconsumercare.com/brand-wipro/' }
];

// Helper to construct salaries
// base, stock, bonus values are in raw standard currency (Rupees or Dollars)
// The function will convert them to paise (for INR) or cents (for USD)
interface SalarySeedInput {
  companyName: string;
  role: string;
  level: Level;
  location: string;
  currency: Currency;
  experienceYears: number;
  baseSalary: number; // in Rupees or Dollars
  bonus?: number; // in Rupees or Dollars
  stock?: number; // in Rupees or Dollars
  source: Source;
  confidenceScore: number;
  isVerified?: boolean;
}

const seedSalariesData: SalarySeedInput[] = [
  // Google USA (USD)
  { companyName: 'GOOGLE', role: 'Software Engineer', level: 'L3', location: 'San Francisco', currency: 'USD', experienceYears: 1, baseSalary: 140000, stock: 45000, bonus: 15000, source: 'CONTRIBUTOR', confidenceScore: 0.95, isVerified: true },
  { companyName: 'Google', role: 'Software Engineer', level: 'L4', location: 'San Francisco', currency: 'USD', experienceYears: 3, baseSalary: 165000, stock: 80000, bonus: 25000, source: 'CONTRIBUTOR', confidenceScore: 0.90, isVerified: true },
  { companyName: 'google', role: 'Software Engineer', level: 'L5', location: 'San Francisco', currency: 'USD', experienceYears: 6, baseSalary: 210000, stock: 150000, bonus: 40000, source: 'CONTRIBUTOR', confidenceScore: 0.98, isVerified: true },
  { companyName: 'Google India Pvt. Ltd.', role: 'Software Engineer', level: 'L6', location: 'San Francisco', currency: 'USD', experienceYears: 9, baseSalary: 260000, stock: 250000, bonus: 60000, source: 'AI_INFERRED', confidenceScore: 0.85, isVerified: true },
  { companyName: 'Google', role: 'Product Manager', level: 'L5', location: 'New York', currency: 'USD', experienceYears: 5, baseSalary: 200000, stock: 120000, bonus: 35000, source: 'SCRAPED', confidenceScore: 0.70, isVerified: true },

  // Google India (INR)
  { companyName: 'Google India', role: 'Software Engineer', level: 'L3', location: 'Bengaluru', currency: 'INR', experienceYears: 1, baseSalary: 2000000, stock: 800000, bonus: 200000, source: 'CONTRIBUTOR', confidenceScore: 0.90, isVerified: true },
  { companyName: 'google', role: 'Software Engineer', level: 'L4', location: 'Bengaluru', currency: 'INR', experienceYears: 4, baseSalary: 3200000, stock: 1200000, bonus: 400000, source: 'CONTRIBUTOR', confidenceScore: 0.95, isVerified: true },
  { companyName: 'GOOGLE', role: 'Software Engineer', level: 'L5', location: 'Bengaluru', currency: 'INR', experienceYears: 7, baseSalary: 4500000, stock: 2500000, bonus: 600000, source: 'CONTRIBUTOR', confidenceScore: 0.92, isVerified: true },
  { companyName: 'Google', role: 'Data Analyst', level: 'L3', location: 'Bengaluru', currency: 'INR', experienceYears: 2, baseSalary: 1500000, stock: 400000, bonus: 150000, source: 'SCRAPED', confidenceScore: 0.65, isVerified: true },

  // Apple USA (USD)
  { companyName: 'Apple', role: 'Software Engineer', level: 'L3', location: 'Cupertino', currency: 'USD', experienceYears: 1, baseSalary: 138000, stock: 40000, bonus: 12000, source: 'CONTRIBUTOR', confidenceScore: 0.93, isVerified: true },
  { companyName: 'Apple', role: 'Software Engineer', level: 'L4', location: 'Cupertino', currency: 'USD', experienceYears: 3, baseSalary: 162000, stock: 75000, bonus: 20000, source: 'CONTRIBUTOR', confidenceScore: 0.91, isVerified: true },
  { companyName: 'Apple', role: 'Software Engineer', level: 'L5', location: 'Cupertino', currency: 'USD', experienceYears: 6, baseSalary: 205000, stock: 140000, bonus: 35000, source: 'CONTRIBUTOR', confidenceScore: 0.95, isVerified: true },

  // Apple India (INR)
  { companyName: 'Apple', role: 'Software Engineer', level: 'L3', location: 'Bengaluru', currency: 'INR', experienceYears: 1, baseSalary: 1900000, stock: 700000, bonus: 180000, source: 'CONTRIBUTOR', confidenceScore: 0.90, isVerified: true },
  { companyName: 'Apple', role: 'Software Engineer', level: 'L4', location: 'Bengaluru', currency: 'INR', experienceYears: 4, baseSalary: 3000000, stock: 1100000, bonus: 350000, source: 'CONTRIBUTOR', confidenceScore: 0.92, isVerified: true },

  // Amazon USA (USD)
  { companyName: 'Amazon', role: 'Software Engineer', level: 'SDE_I', location: 'Seattle', currency: 'USD', experienceYears: 1, baseSalary: 135000, stock: 35000, bonus: 20000, source: 'CONTRIBUTOR', confidenceScore: 0.90, isVerified: true },
  { companyName: 'amazon.com', role: 'Software Engineer', level: 'SDE_II', location: 'Seattle', currency: 'USD', experienceYears: 4, baseSalary: 168000, stock: 95000, bonus: 30000, source: 'CONTRIBUTOR', confidenceScore: 0.95, isVerified: true },
  { companyName: 'Amazon Web Services', role: 'Software Engineer', level: 'SDE_III', location: 'Seattle', currency: 'USD', experienceYears: 7, baseSalary: 205000, stock: 180000, bonus: 45000, source: 'SCRAPED', confidenceScore: 0.75, isVerified: true },
  { companyName: 'Amazon', role: 'Software Engineer', level: 'STAFF', location: 'Seattle', currency: 'USD', experienceYears: 10, baseSalary: 250000, stock: 320000, bonus: 60000, source: 'CONTRIBUTOR', confidenceScore: 0.96, isVerified: true },

  // Amazon India (INR)
  { companyName: 'Amazon', role: 'Software Engineer', level: 'SDE_I', location: 'Bengaluru', currency: 'INR', experienceYears: 1, baseSalary: 1800000, stock: 600000, bonus: 350000, source: 'CONTRIBUTOR', confidenceScore: 0.90, isVerified: true },
  { companyName: 'Amazon India', role: 'Software Engineer', level: 'SDE_II', location: 'Bengaluru', currency: 'INR', experienceYears: 3, baseSalary: 2800000, stock: 1000000, bonus: 500000, source: 'CONTRIBUTOR', confidenceScore: 0.94, isVerified: true },
  { companyName: 'Amazon', role: 'Software Engineer', level: 'SDE_III', location: 'Hyderabad', currency: 'INR', experienceYears: 8, baseSalary: 4800000, stock: 2400000, bonus: 700000, source: 'SCRAPED', confidenceScore: 0.60, isVerified: true },

  // Meta (USD & INR)
  { companyName: 'Meta', role: 'Software Engineer', level: 'L3', location: 'Menlo Park', currency: 'USD', experienceYears: 1, baseSalary: 142000, stock: 60000, bonus: 15000, source: 'CONTRIBUTOR', confidenceScore: 0.95, isVerified: true },
  { companyName: 'Meta', role: 'Software Engineer', level: 'L4', location: 'Menlo Park', currency: 'USD', experienceYears: 3, baseSalary: 172000, stock: 110000, bonus: 25000, source: 'CONTRIBUTOR', confidenceScore: 0.98, isVerified: true },
  { companyName: 'Meta', role: 'Software Engineer', level: 'L5', location: 'Menlo Park', currency: 'USD', experienceYears: 6, baseSalary: 218000, stock: 220000, bonus: 45000, source: 'CONTRIBUTOR', confidenceScore: 0.92, isVerified: true },
  { companyName: 'Meta', role: 'Software Engineer', level: 'L5', location: 'London', currency: 'GBP', experienceYears: 7, baseSalary: 145000, stock: 120000, bonus: 30000, source: 'SCRAPED', confidenceScore: 0.72, isVerified: true },

  // Microsoft (USD & INR)
  { companyName: 'MICROSOFT', role: 'Software Engineer', level: 'SDE_I', location: 'Redmond', currency: 'USD', experienceYears: 1, baseSalary: 125000, stock: 30000, bonus: 15000, source: 'CONTRIBUTOR', confidenceScore: 0.91, isVerified: true },
  { companyName: 'Microsoft Corporation', role: 'Software Engineer', level: 'SDE_II', location: 'Redmond', currency: 'USD', experienceYears: 4, baseSalary: 155000, stock: 60000, bonus: 25000, source: 'CONTRIBUTOR', confidenceScore: 0.93, isVerified: true },
  { companyName: 'Microsoft', role: 'Software Engineer', level: 'SDE_III', location: 'Redmond', currency: 'USD', experienceYears: 7, baseSalary: 195000, stock: 110000, bonus: 35000, source: 'SCRAPED', confidenceScore: 0.68, isVerified: true },
  { companyName: 'Microsoft', role: 'Software Engineer', level: 'SDE_II', location: 'Bengaluru', currency: 'INR', experienceYears: 4, baseSalary: 2600000, stock: 700000, bonus: 350000, source: 'CONTRIBUTOR', confidenceScore: 0.90, isVerified: true },

  // NVIDIA
  { companyName: 'NVIDIA', role: 'Hardware Engineer', level: 'IC4', location: 'Santa Clara', currency: 'USD', experienceYears: 5, baseSalary: 185000, stock: 110000, bonus: 30000, source: 'CONTRIBUTOR', confidenceScore: 0.94, isVerified: true },
  { companyName: 'Nvidia Corp', role: 'Software Engineer', level: 'IC5', location: 'Santa Clara', currency: 'USD', experienceYears: 9, baseSalary: 230000, stock: 210000, bonus: 45000, source: 'CONTRIBUTOR', confidenceScore: 0.97, isVerified: true },

  // Flipkart (INR)
  { companyName: 'Flipkart Internet Pvt Ltd', role: 'Software Engineer', level: 'SDE_I', location: 'Bengaluru', currency: 'INR', experienceYears: 1, baseSalary: 1600000, stock: 300000, bonus: 150000, source: 'CONTRIBUTOR', confidenceScore: 0.92, isVerified: true },
  { companyName: 'Flipkart', role: 'Software Engineer', level: 'SDE_II', location: 'Bengaluru', currency: 'INR', experienceYears: 4, baseSalary: 2600000, stock: 600000, bonus: 250000, source: 'CONTRIBUTOR', confidenceScore: 0.95, isVerified: true },
  { companyName: 'Flipkart', role: 'Software Engineer', level: 'SDE_III', location: 'Bengaluru', currency: 'INR', experienceYears: 8, baseSalary: 4200000, stock: 1200000, bonus: 400000, source: 'SCRAPED', confidenceScore: 0.70, isVerified: true },

  // Meesho (INR)
  { companyName: 'Meesho', role: 'Software Engineer', level: 'SDE_I', location: 'Bengaluru', currency: 'INR', experienceYears: 1, baseSalary: 1400000, stock: 200000, bonus: 100000, source: 'CONTRIBUTOR', confidenceScore: 0.89, isVerified: true },
  { companyName: 'Meesho Inc', role: 'Software Engineer', level: 'SDE_II', location: 'Bengaluru', currency: 'INR', experienceYears: 3, baseSalary: 2300000, stock: 450000, bonus: 200000, source: 'CONTRIBUTOR', confidenceScore: 0.91, isVerified: true },

  // Razorpay (INR)
  { companyName: 'Razorpay', role: 'Software Engineer', level: 'SDE_II', location: 'Bengaluru', currency: 'INR', experienceYears: 3, baseSalary: 2400000, stock: 500000, bonus: 200000, source: 'CONTRIBUTOR', confidenceScore: 0.93, isVerified: true },
  { companyName: 'Razorpay Software', role: 'Software Engineer', level: 'SDE_III', location: 'Bengaluru', currency: 'INR', experienceYears: 7, baseSalary: 3800000, stock: 1000000, bonus: 350000, source: 'CONTRIBUTOR', confidenceScore: 0.92, isVerified: true },

  // Zepto (INR)
  { companyName: 'Zepto', role: 'Software Engineer', level: 'SDE_II', location: 'Mumbai', currency: 'INR', experienceYears: 3, baseSalary: 2500000, stock: 600000, bonus: 200000, source: 'CONTRIBUTOR', confidenceScore: 0.90, isVerified: true },

  // TCS (INR) - Indian Services
  { companyName: 'Tata Consultancy Services', role: 'Software Engineer', level: 'SDE_I', location: 'Mumbai', currency: 'INR', experienceYears: 1, baseSalary: 450000, stock: 0, bonus: 50000, source: 'CONTRIBUTOR', confidenceScore: 0.95, isVerified: true },
  { companyName: 'TCS Ltd.', role: 'Software Engineer', level: 'SDE_II', location: 'Pune', currency: 'INR', experienceYears: 4, baseSalary: 850000, stock: 0, bonus: 80000, source: 'CONTRIBUTOR', confidenceScore: 0.93, isVerified: true },
  { companyName: 'Tata Consultancy', role: 'Software Engineer', level: 'SDE_III', location: 'Mumbai', currency: 'INR', experienceYears: 8, baseSalary: 1600000, stock: 0, bonus: 150000, source: 'SCRAPED', confidenceScore: 0.72, isVerified: true },

  // Infosys (INR)
  { companyName: 'Infosys BPO', role: 'Software Engineer', level: 'SDE_I', location: 'Bengaluru', currency: 'INR', experienceYears: 1, baseSalary: 400000, stock: 0, bonus: 40000, source: 'SCRAPED', confidenceScore: 0.60, isVerified: true },
  { companyName: 'Infosys Technologies', role: 'Software Engineer', level: 'SDE_II', location: 'Hyderabad', currency: 'INR', experienceYears: 3, baseSalary: 750000, stock: 0, bonus: 60000, source: 'CONTRIBUTOR', confidenceScore: 0.91, isVerified: true },

  // Wipro (INR)
  { companyName: 'Wipro Technologies', role: 'Software Engineer', level: 'SDE_I', location: 'Pune', currency: 'INR', experienceYears: 1, baseSalary: 380000, stock: 0, bonus: 35000, source: 'SCRAPED', confidenceScore: 0.65, isVerified: true },
  { companyName: 'Wipro', role: 'Software Engineer', level: 'SDE_II', location: 'Bengaluru', currency: 'INR', experienceYears: 4, baseSalary: 820000, stock: 0, bonus: 70000, source: 'CONTRIBUTOR', confidenceScore: 0.92, isVerified: true }
];

// Add intentional edge cases:
// 1. One record with zero bonus
// 2. One record with zero stock
// 3. One record with very high equity
// 4. One record with Principal level
const edgeCases: SalarySeedInput[] = [
  // Edge Case 1: Zero Bonus
  { companyName: 'Google', role: 'Software Engineer', level: 'L4', location: 'San Francisco', currency: 'USD', experienceYears: 3, baseSalary: 160000, stock: 90000, bonus: 0, source: 'CONTRIBUTOR', confidenceScore: 0.90, isVerified: true },
  // Edge Case 2: Zero Stock
  { companyName: 'TCS', role: 'Software Engineer', level: 'SDE_II', location: 'Bengaluru', currency: 'INR', experienceYears: 5, baseSalary: 950000, stock: 0, bonus: 90000, source: 'CONTRIBUTOR', confidenceScore: 0.94, isVerified: true },
  // Edge Case 3: Very High Equity (Netflix model or Principal)
  { companyName: 'Meta', role: 'Software Engineer', level: 'STAFF', location: 'Menlo Park', currency: 'USD', experienceYears: 12, baseSalary: 260000, stock: 1200000, bonus: 70000, source: 'CONTRIBUTOR', confidenceScore: 0.99, isVerified: true },
  // Edge Case 4: Principal level
  { companyName: 'Microsoft', role: 'Software Engineer', level: 'PRINCIPAL', location: 'Redmond', currency: 'USD', experienceYears: 15, baseSalary: 320000, stock: 550000, bonus: 95000, source: 'CONTRIBUTOR', confidenceScore: 0.98, isVerified: true }
];

// Generate additional records to satisfy 60+ count
const generatedSalaries: SalarySeedInput[] = [...seedSalariesData, ...edgeCases];
const roles = ['Software Engineer', 'Data Analyst', 'Product Manager', 'Solutions Architect', 'Hardware Engineer'];
const cities = ['Bengaluru', 'Mumbai', 'Hyderabad', 'Pune', 'Delhi', 'San Francisco', 'London'];

const baseTemplates = [
  { company: 'Google', level: 'L3' as Level, base: 140000, stock: 40000, bonus: 15000, currency: 'USD' as Currency },
  { company: 'Google', level: 'L4' as Level, base: 160000, stock: 80000, bonus: 25000, currency: 'USD' as Currency },
  { company: 'Google', level: 'L5' as Level, base: 200000, stock: 150000, bonus: 40000, currency: 'USD' as Currency },
  { company: 'Amazon', level: 'SDE_I' as Level, base: 130000, stock: 30000, bonus: 20000, currency: 'USD' as Currency },
  { company: 'Amazon', level: 'SDE_II' as Level, base: 160000, stock: 85000, bonus: 25000, currency: 'USD' as Currency },
  { company: 'Meta', level: 'L3' as Level, base: 140000, stock: 50000, bonus: 15000, currency: 'USD' as Currency },
  { company: 'Meta', level: 'L4' as Level, base: 170000, stock: 100000, bonus: 25000, currency: 'USD' as Currency },
  { company: 'Microsoft', level: 'SDE_I' as Level, base: 120000, stock: 25000, bonus: 12000, currency: 'USD' as Currency },
  { company: 'Microsoft', level: 'SDE_II' as Level, base: 150000, stock: 55000, bonus: 22000, currency: 'USD' as Currency }
];

// Add random entries until we hit 70 total
while (generatedSalaries.length < 75) {
  const template = baseTemplates[Math.floor(Math.random() * baseTemplates.length)];
  const role = roles[Math.floor(Math.random() * roles.length)];
  const location = cities[Math.floor(Math.random() * cities.length)];

  const isINR = ['Bengaluru', 'Mumbai', 'Hyderabad', 'Pune', 'Delhi'].includes(location);
  const currency = isINR ? ('INR' as Currency) : template.currency;

  // Calculate regional scaling
  const scale = 0.85 + Math.random() * 0.3; // +/- 15%
  let multiplier = 1.0;
  if (isINR) {
    multiplier = 83.0; // scale USD rates up to INR values
  } else if (location === 'London') {
    multiplier = 0.8; // scale USD to GBP
  }

  const baseSalary = Math.round(template.base * scale * multiplier);
  const stock = Math.round(template.stock * scale * multiplier);
  const bonus = Math.round(template.bonus * scale * multiplier);
  const experienceYears = Math.max(1, Math.min(25, Math.floor(scale * 5)));

  generatedSalaries.push({
    companyName: template.company,
    role,
    level: template.level,
    location,
    currency,
    experienceYears,
    baseSalary,
    stock,
    bonus,
    source: 'SCRAPED',
    confidenceScore: Math.round((0.5 + Math.random() * 0.3) * 100) / 100,
    isVerified: true
  });
}

async function main() {
  console.log('Seeding TalentDash PostgreSQL database...');

  // 1. Create or Find Companies
  const companyCache = new Map<string, string>();

  // Initialize and seed defined companies first
  for (const compData of seedCompaniesData) {
    const details = getCompanyDetails(compData.rawName);

    const company = await prisma.company.upsert({
      where: { normalizedName: details.normalizedName },
      update: {
        name: details.displayName,
        slug: details.slug,
        logo: compData.logo,
        industry: compData.industry,
        headquarters: compData.headquarters,
        foundedYear: compData.foundedYear,
        headcountRange: compData.headcountRange
      },
      create: {
        name: details.displayName,
        slug: details.slug,
        normalizedName: details.normalizedName,
        logo: compData.logo,
        industry: compData.industry,
        headquarters: compData.headquarters,
        foundedYear: compData.foundedYear,
        headcountRange: compData.headcountRange
      }
    });

    companyCache.set(details.normalizedName, company.id);
  }

  console.log('Seeded metadata for core companies.');

  // 2. Insert Salaries
  console.log(`Ingesting ${generatedSalaries.length} salary records...`);

  let insertedCount = 0;
  for (const s of generatedSalaries) {
    const details = getCompanyDetails(s.companyName);

    // Resolve Company ID (create basic company metadata if it wasn't in seed list)
    let companyId = companyCache.get(details.normalizedName);
    if (!companyId) {
      const company = await prisma.company.create({
        data: {
          name: details.displayName,
          slug: details.slug,
          normalizedName: details.normalizedName,
          industry: 'Technology',
          headquarters: s.location.includes('San Francisco') || s.location.includes('Redmond') || s.location.includes('Seattle') ? 'United States' : 'India',
        }
      });
      companyId = company.id;
      companyCache.set(details.normalizedName, companyId);
    }

    // Convert numeric base, bonus, stock to BigInt in paise (INR) or cents (USD/GBP/EUR)
    // Paise/cents = raw amount * 100
    const rawBase = s.baseSalary;
    const rawBonus = s.bonus || 0;
    const rawStock = s.stock || 0;

    const baseBig = BigInt(rawBase) * 100n;
    const bonusBig = BigInt(rawBonus) * 100n;
    const stockBig = BigInt(rawStock) * 100n;

    // Compute total compensation server-side
    const totalCompBig = baseBig + bonusBig + stockBig;

    await prisma.salary.create({
      data: {
        companyId,
        role: s.role,
        level: s.level,
        location: s.location,
        currency: s.currency,
        experienceYears: s.experienceYears,
        baseSalary: baseBig,
        bonus: bonusBig,
        stock: stockBig,
        totalCompensation: totalCompBig,
        source: s.source,
        confidenceScore: s.confidenceScore,
        isVerified: s.isVerified ?? false,
        submittedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000) // Random date in last 30 days
      }
    });
    insertedCount++;
  }

  console.log(`Database seeding finished! Successfully ingested ${insertedCount} records.`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
