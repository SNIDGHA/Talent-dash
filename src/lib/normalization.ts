import { Level } from '@prisma/client';

// Alias table for company variants
const COMPANY_ALIASES: Record<string, string> = {
  'google india pvt ltd': 'google',
  'google india': 'google',
  'google pvt ltd': 'google',
  'google inc': 'google',
  'tata consultancy services': 'tcs',
  'tcs ltd': 'tcs',
  'tcs limited': 'tcs',
  'tata consultancy': 'tcs',
  'amazon.com': 'amazon',
  'amazon web services': 'amazon',
  'aws': 'amazon',
  'infosys bpo': 'infosys',
  'infosys technologies': 'infosys',
  'wipro technologies': 'wipro',
  'flipkart internet pvt ltd': 'flipkart',
  'flipkart internet': 'flipkart',
  'meesho inc': 'meesho',
  'razorpay software': 'razorpay',
};

// Map normalized names to standard display names
const COMPANY_DISPLAY_NAMES: Record<string, string> = {
  'google': 'Google',
  'amazon': 'Amazon',
  'tcs': 'TCS',
  'meta': 'Meta',
  'microsoft': 'Microsoft',
  'nvidia': 'NVIDIA',
  'flipkart': 'Flipkart',
  'meesho': 'Meesho',
  'razorpay': 'Razorpay',
  'zepto': 'Zepto',
  'infosys': 'Infosys',
  'wipro': 'Wipro',
};

export function normalizeCompanyName(name: string): string {
  const clean = name.trim().toLowerCase();

  // 1. Check exact or partial match in alias table
  if (COMPANY_ALIASES[clean]) {
    return COMPANY_ALIASES[clean];
  }

  // Iterate to find partial matches for common aliases
  for (const [alias, standard] of Object.entries(COMPANY_ALIASES)) {
    if (clean === alias || clean.startsWith(alias + ' ') || clean.endsWith(' ' + alias)) {
      return standard;
    }
  }

  // 2. Programmatic suffix stripping
  // Strip legal suffixes
  const suffixPattern = /\b(inc|llc|corp|co|ltd|incorporated|corporation|limited|pvt|pvt\.? ltd|internet pvt ltd|\.com)\b/g;
  let stripped = clean.replace(suffixPattern, '').trim();

  // Remove special characters, keep only alphanumerics and spaces
  stripped = stripped.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').trim();
  // Standardize multiple spaces to single space
  stripped = stripped.replace(/\s+/g, ' ');

  if (!stripped) {
    return clean;
  }

  // Check aliases again on the stripped string
  if (COMPANY_ALIASES[stripped]) {
    return COMPANY_ALIASES[stripped];
  }

  return stripped;
}

export function getCompanyDisplayName(normalizedName: string): string {
  const norm = normalizedName.toLowerCase();
  if (COMPANY_DISPLAY_NAMES[norm]) {
    return COMPANY_DISPLAY_NAMES[norm];
  }
  // Title Case fallback
  return normalizedName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getCompanySlug(normalizedName: string): string {
  return normalizedName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

export function calculateTotalCompensation(base: bigint, bonus: bigint = 0n, stock: bigint = 0n): bigint {
  return base + bonus + stock;
}
