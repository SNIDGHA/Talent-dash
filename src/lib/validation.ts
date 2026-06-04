import { Level, Currency, Source } from '@prisma/client';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidatedIngestInput {
  company: string;
  role: string;
  level: Level;
  location: string;
  currency: Currency;
  experienceYears: number;
  baseSalary: number; // raw value (Standard unit, e.g. 150000 or 4200000)
  bonus: number;
  stock: number;
  source: Source;
  confidenceScore: number;
}

export function validateSalaryIngest(body: any): {
  isValid: boolean;
  errors: ValidationError[];
  validatedData?: ValidatedIngestInput;
} {
  const errors: ValidationError[] = [];

  // Extract fields supporting both camelCase and snake_case
  const company = body.company;
  const role = body.role;
  const level = body.level || body.level_standardized;
  const location = body.location;
  const currency = body.currency;

  const rawExp = body.experienceYears !== undefined ? body.experienceYears : body.experience_years;
  const rawBase = body.baseSalary !== undefined ? body.baseSalary : body.base_salary;
  const rawBonus = body.bonus !== undefined ? body.bonus : 0;
  const rawStock = body.stock !== undefined ? body.stock : 0;

  const rawConf = body.confidenceScore !== undefined ? body.confidenceScore : body.confidence_score;
  const source = body.source;

  // 1. Check required fields present
  if (company === undefined || company === null || company === '') {
    errors.push({ field: 'company', message: 'Company is required.' });
  }
  if (role === undefined || role === null || role === '') {
    errors.push({ field: 'role', message: 'Role is required.' });
  }
  if (level === undefined || level === null || level === '') {
    errors.push({ field: 'level', message: 'Level is required.' });
  }
  if (location === undefined || location === null || location === '') {
    errors.push({ field: 'location', message: 'Location is required.' });
  }
  if (currency === undefined || currency === null || currency === '') {
    errors.push({ field: 'currency', message: 'Currency is required.' });
  }
  if (rawExp === undefined || rawExp === null) {
    errors.push({ field: 'experience_years', message: 'Experience years is required.' });
  }
  if (rawBase === undefined || rawBase === null) {
    errors.push({ field: 'base_salary', message: 'Base salary is required.' });
  }
  if (source === undefined || source === null || source === '') {
    errors.push({ field: 'source', message: 'Source is required.' });
  }
  if (rawConf === undefined || rawConf === null) {
    errors.push({ field: 'confidence_score', message: 'Confidence score is required.' });
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  // 2. Check types
  if (typeof company !== 'string' || !company.trim()) {
    errors.push({ field: 'company', message: 'Company must be a non-empty string.' });
  }
  if (typeof role !== 'string' || !role.trim()) {
    errors.push({ field: 'role', message: 'Role must be a non-empty string.' });
  }
  if (typeof location !== 'string' || !location.trim()) {
    errors.push({ field: 'location', message: 'Location must be a non-empty string.' });
  }

  // 3. Level Enum Check
  const validLevels = Object.values(Level);
  if (!validLevels.includes(level as Level)) {
    errors.push({
      field: 'level',
      message: `Level must be one of: ${validLevels.join(', ')}`
    });
  }

  // Currency Enum Check
  const validCurrencies = Object.values(Currency);
  if (!validCurrencies.includes(currency as Currency)) {
    errors.push({
      field: 'currency',
      message: `Currency must be one of: ${validCurrencies.join(', ')}`
    });
  }

  // Source Enum Check
  const validSources = Object.values(Source);
  if (!validSources.includes(source as Source)) {
    errors.push({
      field: 'source',
      message: `Source must be one of: ${validSources.join(', ')}`
    });
  }

  // Numeric parsing
  const experienceYears = Number(rawExp);
  const baseSalary = Number(rawBase);
  const bonus = Number(rawBonus);
  const stock = Number(rawStock);
  const confidenceScore = Number(rawConf);

  if (isNaN(experienceYears)) {
    errors.push({ field: 'experience_years', message: 'Experience years must be a valid number.' });
  }
  if (isNaN(baseSalary)) {
    errors.push({ field: 'base_salary', message: 'Base salary must be a valid number.' });
  }
  if (isNaN(bonus)) {
    errors.push({ field: 'bonus', message: 'Bonus must be a valid number.' });
  }
  if (isNaN(stock)) {
    errors.push({ field: 'stock', message: 'Stock must be a valid number.' });
  }
  if (isNaN(confidenceScore)) {
    errors.push({ field: 'confidence_score', message: 'Confidence score must be a valid number.' });
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  // 4. Check ranges
  if (experienceYears <= 0 || experienceYears >= 51) {
    errors.push({
      field: 'experience_years',
      message: 'Experience years must be greater than 0 and less than 51.'
    });
  }

  if (baseSalary <= 0) {
    errors.push({
      field: 'base_salary',
      message: 'Base salary must be greater than 0.'
    });
  }

  if (bonus < 0) {
    errors.push({ field: 'bonus', message: 'Bonus cannot be negative.' });
  }
  if (stock < 0) {
    errors.push({ field: 'stock', message: 'Stock cannot be negative.' });
  }

  if (confidenceScore < 0.0 || confidenceScore > 1.0) {
    errors.push({
      field: 'confidence_score',
      message: 'Confidence score must be between 0.0 and 1.0.'
    });
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: [],
    validatedData: {
      company: company.trim(),
      role: role.trim(),
      level: level as Level,
      location: location.trim(),
      currency: currency as Currency,
      experienceYears,
      baseSalary,
      bonus,
      stock,
      source: source as Source,
      confidenceScore
    }
  };
}
