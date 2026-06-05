import { NextRequest, NextResponse } from 'next/server';
import { prisma, serializeBigInt } from '@/lib/db';
import { Level } from '@prisma/client';
export const runtime = "nodejs";
export const dynamic = 'force-dynamic';

function calculateBigIntMedian(values: bigint[]): bigint {
  if (values.length === 0) return 0n;
  const sorted = [...values].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 !== 0) {
    return sorted[mid];
  }
  return (sorted[mid - 1] + sorted[mid]) / 2n;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // 1. Fetch Company metadata
    const company = await prisma.company.findUnique({
      where: { slug }
    });

    if (!company) {
      return NextResponse.json(
        { error: true, message: 'Company not found' },
        { status: 404 }
      );
    }

    // 2. Fetch all verified/submitted salaries for this company, sorted by totalCompensation descending
    const salaries = await prisma.salary.findMany({
      where: { companyId: company.id },
      orderBy: { totalCompensation: 'desc' }
    });

    // 3. Compute statistical median total compensation (true median)
    const tcValues = salaries.map((s: any) => s.totalCompensation);
    const medianTotalCompensation = calculateBigIntMedian(tcValues);

    // 4. Compute level distribution counts
    const levelDistribution: Record<string, number> = {};
    // Initialise all levels to 0 to ensure they display consistently
    Object.values(Level).forEach((lvl: any) => {
      levelDistribution[lvl] = 0;
    });

    salaries.forEach((s: any) => {
      levelDistribution[s.level] = (levelDistribution[s.level] || 0) + 1;
    });

    // Filter out levels with 0 counts to keep output clean, but let's keep them if requested
    // B4 says: "level_distribution: { L3: 12, L4: 34... } — counts per level for this company"
    // Let's remove 0-count levels to keep it concise and exact
    const filteredLevelDistribution: Record<string, number> = {};
    Object.entries(levelDistribution).forEach(([lvl, count]) => {
      if (count > 0) {
        filteredLevelDistribution[lvl] = count;
      }
    });

    const responsePayload = {
      company,
      salaries: salaries,
      median_total_compensation: medianTotalCompensation,
      level_distribution: filteredLevelDistribution
    };

    // Return with Cache-Control headers
    return new NextResponse(
      JSON.stringify(serializeBigInt(responsePayload)),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400'
        }
      }
    );

  } catch (error: any) {
    console.error('GET /api/companies/[slug] error:', error);
    return NextResponse.json(
      { error: true, message: 'Failed to fetch company details' },
      { status: 500 }
    );
  }
}
