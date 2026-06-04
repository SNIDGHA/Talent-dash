import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Level } from '@prisma/client';
export const runtime = "edge";

export const dynamic = 'force-dynamic';

function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const half = Math.floor(sorted.length / 2);
  if (sorted.length % 2 !== 0) {
    return sorted[half];
  }
  return Math.round((sorted[half - 1] + sorted[half]) / 2);
}

export async function GET(request: NextRequest) {
  try {
    const salaries = await prisma.salary.findMany({
      where: {
        isVerified: true
      },
      include: {
        company: true
      }
    });

    if (salaries.length === 0) {
      return NextResponse.json({
        byTier: [],
        byCompany: [],
        byLocation: [],
        stats: { avgTC: 0, count: 0, topCompany: 'N/A' }
      });
    }

    const processedSalaries = salaries.map((s: any) => ({
      id: s.id,
      companyName: s.company.name,
      level: s.level,
      location: s.location,
      totalCompensation: Number(s.totalCompensation) / 100,
      baseSalary: Number(s.baseSalary) / 100,
      stock: Number(s.stock) / 100,
      bonus: Number(s.bonus) / 100
    }));

    const allTC = processedSalaries.map((s: any) => s.totalCompensation);
    const avgTC = Math.round(allTC.reduce((sum: number, val: number) => sum + val, 0) / processedSalaries.length);
    const totalCount = processedSalaries.length;

    const companyTotals: Record<string, number[]> = {};
    processedSalaries.forEach((s: any) => {
      if (!companyTotals[s.companyName]) {
        companyTotals[s.companyName] = [];
      }
      companyTotals[s.companyName].push(s.totalCompensation);
    });

    let topCompany = 'N/A';
    let maxMedianPay = 0;
    Object.entries(companyTotals).forEach(([name, pays]: [string, number[]]) => {
      const med = calculateMedian(pays);
      if (med > maxMedianPay) {
        maxMedianPay = med;
        topCompany = name;
      }
    });

    const levelsList = Object.values(Level);
    const byTier = levelsList.map((lvl: any) => {
      const filtered = processedSalaries.filter((s: any) => s.level === lvl);
      return {
        tier: lvl,
        displayName: lvl,
        medianTC: calculateMedian(filtered.map((s: any) => s.totalCompensation)),
        medianBase: calculateMedian(filtered.map((s: any) => s.baseSalary)),
        medianStock: calculateMedian(filtered.map((s: any) => s.stock)),
        medianBonus: calculateMedian(filtered.map((s: any) => s.bonus)),
        count: filtered.length
      };
    }).filter(t => t.count > 0);

    const activeCompanies = Array.from(new Set(processedSalaries.map((s: any) => s.companyName))) as string[];
    const companyData = activeCompanies
      .map((compName: string) => {
        const filtered = processedSalaries.filter((s: any) => s.companyName === compName);
        return {
          company: compName,
          medianTC: calculateMedian(filtered.map((s: any) => s.totalCompensation)),
          medianBase: calculateMedian(filtered.map((s: any) => s.baseSalary)),
          medianStock: calculateMedian(filtered.map((s: any) => s.stock)),
          medianBonus: calculateMedian(filtered.map((s: any) => s.bonus)),
          count: filtered.length
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const locations = Array.from(new Set(processedSalaries.map((s: any) => s.location))) as string[];
    const byLocation = locations
      .map((loc: string) => {
        const filtered = processedSalaries.filter((s: any) => s.location === loc);
        return {
          location: loc,
          medianTC: calculateMedian(filtered.map((s: any) => s.totalCompensation)),
          count: filtered.length
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return NextResponse.json({
      byTier,
      byCompany: companyData,
      byLocation,
      stats: {
        avgTC,
        count: totalCount,
        topCompany: `${topCompany} (₹${Math.round(maxMedianPay / 100000)}L median)`
      }
    });
  } catch (error: any) {
    console.error('GET /api/analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to compute analytics' },
      { status: 500 }
    );
  }
}