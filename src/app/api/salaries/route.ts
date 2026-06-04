import { NextRequest, NextResponse } from 'next/server';
import { prisma, serializeBigInt } from '@/lib/db';
import { Level, Currency } from '@prisma/client';
import { validateSalaryIngest } from '@/lib/validation';
import { normalizeCompanyName, getCompanyDisplayName, getCompanySlug } from '@/lib/normalization';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Query parameters
    const company = searchParams.get('company') || '';
    const role = searchParams.get('role') || '';
    const levels = searchParams.getAll('level');
    const location = searchParams.get('location') || '';
    const currency = searchParams.get('currency') || '';
    const sort = searchParams.get('sort') || 'total_comp_desc';

    let page = parseInt(searchParams.get('page') || '1', 10);
    let limit = parseInt(searchParams.get('limit') || '25', 10);

    // Validation & defaults
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 25;
    if (limit > 100) limit = 100; // Cap at 100

    // Construct Prisma where filters
    const where: any = {};

    if (company) {
      where.company = {
        name: { contains: company, mode: 'insensitive' }
      };
    }

    if (role) {
      where.role = { contains: role, mode: 'insensitive' };
    }

    if (levels.length > 0) {
      const validLevels = levels.filter(l => Object.values(Level).includes(l as Level)) as Level[];
      if (validLevels.length > 0) {
        where.level = { in: validLevels };
      }
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (currency) {
      if (Object.values(Currency).includes(currency as Currency)) {
        where.currency = currency as Currency;
      }
    }

    // Sorting
    let orderBy: any = { totalCompensation: 'desc' };
    if (sort === 'total_comp_asc') {
      orderBy = { totalCompensation: 'asc' };
    } else if (sort === 'date_desc') {
      orderBy = { submittedAt: 'desc' };
    }

    // Query database with count
    const [total, data] = await prisma.$transaction([
      prisma.salary.count({ where }),
      prisma.salary.findMany({
        where,
        include: {
          company: true
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit
      })
    ]);

    const totalPages = Math.ceil(total / limit);

    const responsePayload = {
      data: serializeBigInt(data),
      meta: {
        total,
        page,
        limit,
        totalPages
      }
    };

    // Return response with CDN Cache-Control headers
    return new NextResponse(
      JSON.stringify(responsePayload),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 's-maxage=300, stale-while-revalidate=3600'
        }
      }
    );

  } catch (error: any) {
    console.error('GET /api/salaries error:', error);
    return NextResponse.json(
      { error: true, message: 'Failed to fetch salaries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Map frontend fields to backend validation fields
    const processedBody = {
      company: body.company,
      role: body.role || body.title || '',
      level: body.level || '',
      location: body.location || '',
      currency: body.currency || 'USD',
      experienceYears: body.experienceYears !== undefined ? Number(body.experienceYears) : (body.experience_years !== undefined ? Number(body.experience_years) : 1),
      baseSalary: body.baseSalary !== undefined ? Number(body.baseSalary) : (body.base_salary !== undefined ? Number(body.base_salary) : 0),
      bonus: body.bonus !== undefined ? Number(body.bonus) : 0,
      stock: body.stock !== undefined ? Number(body.stock) : (body.stockGrant !== undefined ? Number(body.stockGrant) : 0),
      source: body.source || 'CONTRIBUTOR',
      confidenceScore: body.confidenceScore !== undefined ? Number(body.confidenceScore) : (body.confidence_score !== undefined ? Number(body.confidence_score) : 1.0)
    };

    // 1. Validation pipeline
    const { isValid, errors, validatedData } = validateSalaryIngest(processedBody);
    if (!isValid || !validatedData) {
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
        isVerified: false
      },
      include: {
        company: true
      }
    });

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
