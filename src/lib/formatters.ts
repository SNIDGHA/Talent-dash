import { Currency } from '@prisma/client';
import { CONVERSION_RATES } from './config';

// Convert raw database bigint (paise/cents) to standard currency units (rupees/dollars)
// And convert between currencies if required
export function convertSalary(
  amountInSmallestUnit: bigint | number,
  fromCurrency: Currency,
  toCurrency: Currency
): number {
  // Convert BigInt to standard JS number and scale back from cents/paise (divide by 100)
  const standardAmount = Number(amountInSmallestUnit) / 100;

  if (fromCurrency === toCurrency) {
    return standardAmount;
  }

  // Convert to USD base first
  const fromRate = CONVERSION_RATES[fromCurrency] || 1.0;
  const toRate = CONVERSION_RATES[toCurrency] || 1.0;

  const usdValue = standardAmount / fromRate;
  const convertedAmount = usdValue * toRate;

  return convertedAmount;
}

// Format a salary value for display using en-IN (Lakh/Crore) or standard Western locales
export function formatSalary(
  amountInSmallestUnit: bigint | number,
  fromCurrency: Currency,
  displayCurrency: Currency
): string {
  const converted = convertSalary(amountInSmallestUnit, fromCurrency, displayCurrency);

  // Set up formatting locale and options
  const locale = displayCurrency === Currency.INR ? 'en-IN' : 'en-US';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: displayCurrency,
      maximumFractionDigits: 0
    }).format(converted);
  } catch (e) {
    // Fallback if formatting fails
    const symbol = displayCurrency === Currency.INR ? '₹' : displayCurrency === Currency.USD ? '$' : '';
    return `${symbol}${Math.round(converted).toLocaleString()}`;
  }
}
