import { prisma, serializeBigInt } from '@/lib/db';
import CompareClient from '@/components/features/CompareClient';

export const dynamic = 'force-dynamic';

export default async function ComparePage() {
  // Query all verified/available salary records for the dropdown selectors
  // We only fetch the minimal fields needed to represent records in the dropdown
  const rawRecords = await prisma.salary.findMany({
    select: {
      id: true,
      role: true,
      level: true,
      location: true,
      currency: true,
      totalCompensation: true,
      company: {
        select: {
          name: true
        }
      }
    },
    orderBy: [
      {
        company: {
          name: 'asc'
        }
      },
      {
        totalCompensation: 'desc'
      }
    ]
  });

  // Flatten structure for the dropdowns
  const records = rawRecords.map((r: any) => ({
    id: r.id,
    companyName: r.company.name,
    role: r.role,
    level: r.level,
    location: r.location,
    currency: r.currency,
    totalCompensation: Number(r.totalCompensation) // safe cast
  }));

  return (
    <div className="max-w-4xl mx-auto">
      <CompareClient records={serializeBigInt(records)} />
    </div>
  );
}
