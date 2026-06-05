import { NextRequest, NextResponse } from 'next/server';
import { prisma, serializeBigInt } from '@/lib/db';
import { CONVERSION_RATES } from '@/lib/config';
export const runtime = "nodejs";
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const s1 = searchParams.get('s1') || '';
    const s2 = searchParams.get('s2') || '';

    // 1. Validation
    if (!s1 || !s2) {
      return NextResponse.json(
        { error: true, message: 'Both s1 and s2 parameters are required.' },
        { status: 400 }
      );
    }

    if (s1 === s2) {
      return NextResponse.json(
        { error: true, message: 'Comparison records must be different.' },
        { status: 400 }
      );
    }

    // 2. Query database
    const [record1, record2] = await prisma.$transaction([
      prisma.salary.findUnique({
        where: { id: s1 },
        include: { company: true }
      }),
      prisma.salary.findUnique({
        where: { id: s2 },
        include: { company: true }
      })
    ]);

    // 3. Verify existence
    if (!record1 || !record2) {
      return NextResponse.json(
        { error: true, message: 'One or both of the salary records were not found.' },
        { status: 404 }
      );
    }

    // 4. Calculate deltas.
    // Note: If records are in different currencies, we must convert values to a common currency (e.g. USD)
    // to calculate a meaningful delta, OR calculate direct subtraction.
    // Let's check: the spec says "Delta = record_1_value minus record_2_value."
    // If they have different currencies, direct subtraction might be misleading, but we can do it.
    // However, to make it extremely professional, let's normalize both to USD (or the first record's currency)
    // for comparison if they differ, OR just subtract standard unit values.
    // Let's look at B5: "Delta = record_1_value minus record_2_value. Positive = record 1 is higher. Negative = record 2 is higher."
    // Let's convert them to standard units first (divide by 100).
    const r1Base = Number(record1.baseSalary) / 100;
    const r1Bonus = Number(record1.bonus) / 100;
    const r1Stock = Number(record1.stock) / 100;
    const r1Tc = Number(record1.totalCompensation) / 100;

    const r2Base = Number(record2.baseSalary) / 100;
    const r2Bonus = Number(record2.bonus) / 100;
    const r2Stock = Number(record2.stock) / 100;
    const r2Tc = Number(record2.totalCompensation) / 100;

    // Convert Record 2 to Record 1's currency for accurate delta calculation if they differ
    let base2Converted = r2Base;
    let bonus2Converted = r2Bonus;
    let stock2Converted = r2Stock;
    let tc2Converted = r2Tc;

    if (record1.currency !== record2.currency) {
      // Convert record 2 to USD, then to record 1's currency
      const r2Rate = CONVERSION_RATES[record2.currency] || 1.0;
      const r1Rate = CONVERSION_RATES[record1.currency] || 1.0;

      base2Converted = (r2Base / r2Rate) * r1Rate;
      bonus2Converted = (r2Bonus / r2Rate) * r1Rate;
      stock2Converted = (r2Stock / r2Rate) * r1Rate;
      tc2Converted = (r2Tc / r2Rate) * r1Rate;
    }

    // Deltas computed in Record 1's currency (or direct raw diff if same currency)
    const base_delta = r1Base - base2Converted;
    const bonus_delta = r1Bonus - bonus2Converted;
    const stock_delta = r1Stock - stock2Converted;
    const tc_delta = r1Tc - tc2Converted;
    const experience_delta = record1.experienceYears - record2.experienceYears;

    const responsePayload = {
      record1: serializeBigInt(record1),
      record2: serializeBigInt(record2),
      delta: {
        base_delta,
        bonus_delta,
        stock_delta,
        tc_delta,
        experience_delta
      }
    };

    return NextResponse.json(responsePayload);

  } catch (error: any) {
    console.error('GET /api/compare error:', error);
    return NextResponse.json(
      { error: true, message: 'Failed to execute comparison' },
      { status: 500 }
    );
  }
}
