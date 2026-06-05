import { NextRequest, NextResponse } from 'next/server';
import { prisma, serializeBigInt } from '@/lib/db';
import { validateSalaryIngest } from '@/lib/validation';
import { normalizeCompanyName, getCompanyDisplayName, getCompanySlug } from '@/lib/normalization';
export const runtime = "nodejs";
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Validation pipeline
    const { isValid, errors, validatedData } = validateSalaryIngest(body);
    if (!isValid || !validatedData) {
      // Return 400 with per-field errors
      return NextResponse.json(
        { error: true, errors },
        { status: 400 }
      );
    }

    // 2. Normalisation
    const normalizedName = normalizeCompanyName(validatedData.company);
    const displayName = getCompanyDisplayName(normalizedName);
    const slug = getCompanySlug(normalizedName);

    // Find or create Company record
    let company = await prisma.company.findUnique({
      where: { normalizedName }
    });

    if (!company) {
      // In case slug conflicts, we can append a random string or keep it simple.
      // Since normalizedName is unique, slug will also be unique.
      company = await prisma.company.create({
        data: {
          name: displayName,
          slug,
          normalizedName,
          industry: 'Technology',
          headquarters: validatedData.location.includes('San Francisco') ||
            validatedData.location.includes('Redmond') ||
            validatedData.location.includes('Seattle') ? 'United States' : 'India'
        }
      });
    }

    // Convert numeric inputs (standard units) to BigInt paise/cents for DB storage
    const baseBig = BigInt(validatedData.baseSalary) * 100n;
    const bonusBig = BigInt(validatedData.bonus) * 100n;
    const stockBig = BigInt(validatedData.stock) * 100n;

    // 3. Duplicate Check
    // If a record with same company_id + role + level + location has been submitted in the last 48 hours
    // with base_salary within 10% of this record, return 409 Conflict.
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const existingSimilarRecords = await prisma.salary.findMany({
      where: {
        companyId: company.id,
        role: { equals: validatedData.role, mode: 'insensitive' },
        level: validatedData.level,
        location: { equals: validatedData.location, mode: 'insensitive' },
        submittedAt: { gte: fortyEightHoursAgo }
      }
    });

    const isDuplicate = existingSimilarRecords.some((rec: any) => {
      const existingBase = Number(rec.baseSalary);
      const newBase = Number(baseBig);
      const diffPercent = Math.abs(existingBase - newBase) / newBase;
      return diffPercent <= 0.10; // within 10%
    });

    if (isDuplicate) {
      return NextResponse.json(
        {
          error: true,
          message: 'A similar salary record was already submitted for this company, role, level, and location within the last 48 hours.'
        },
        { status: 409 }
      );
    }

    // 4. Recompute total_compensation server-side
    const totalCompensationBig = baseBig + bonusBig + stockBig;

    // 5. Store record
    const newSalary = await prisma.salary.create({
      data: {
        companyId: company.id,
        role: validatedData.role,
        level: validatedData.level,
        location: validatedData.location,
        currency: validatedData.currency,
        experienceYears: validatedData.experienceYears,
        baseSalary: baseBig,
        bonus: bonusBig,
        stock: stockBig,
        totalCompensation: totalCompensationBig,
        source: validatedData.source,
        confidenceScore: validatedData.confidenceScore,
        isVerified: false // defaults to false, moderator review
      },
      include: {
        company: true
      }
    });

    // Return 201 Created with stored serialized record
    return NextResponse.json(
      serializeBigInt(newSalary),
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Ingest error:', error);
    return NextResponse.json(
      { error: true, message: 'Internal server error during ingestion.' },
      { status: 500 }
    );
  }
}
