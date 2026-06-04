// Global Configuration for TalentDash Platform

// Currency conversion rate: 1 USD = 83 INR
export const CURRENCY_CONVERSION_RATE = 83;

// Multipliers for smallest currency units:
// base_salary is stored in paise for INR and cents for USD/GBP/EUR.
// For simplicity in conversion:
// 1 USD = 83 INR
// 1 USD Cent = 83 INR Paise (since 1 USD = 100 Cents and 1 INR = 100 Paise)
// Thus: Cents to Paise multiplier = 83
// Paise to Cents multiplier = 1 / 83

export const CONVERSION_RATES: Record<string, number> = {
  USD: 1.0,
  INR: 83.0,
  GBP: 0.8,
  EUR: 0.92,
};

// Map each currency code to its symbol
export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  INR: '₹',
  GBP: '£',
  EUR: '€',
};
