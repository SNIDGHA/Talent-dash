'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatSalary, convertSalary } from '@/lib/formatters';
import { Currency } from '@prisma/client';
import { Scale, ArrowUpDown, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface DropdownRecord {
  id: string;
  companyName: string;
  role: string;
  level: string;
  location: string;
  currency: Currency;
  totalCompensation: number; // in cents/paise
}

interface CompareClientProps {
  records: DropdownRecord[];
}

export default function CompareClient({ records }: CompareClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search parameters A and B
  const paramS1 = searchParams.get('s1') || '';
  const paramS2 = searchParams.get('s2') || '';

  // Selection states
  const [selectedIdA, setSelectedIdA] = useState(paramS1);
  const [selectedIdB, setSelectedIdB] = useState(paramS2);

  // Detailed records state
  const [recordA, setRecordA] = useState<any>(null);
  const [recordB, setRecordB] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sync state with URL params
  useEffect(() => {
    setSelectedIdA(paramS1);
    setSelectedIdB(paramS2);
  }, [paramS1, paramS2]);

  // Fetch full details of A and B when selection changes
  useEffect(() => {
    const fetchDetails = async () => {
      if (!selectedIdA || !selectedIdB) {
        setRecordA(null);
        setRecordB(null);
        setError('');
        return;
      }

      setLoading(true);
      setError('');

      try {
        const res = await fetch(`/api/compare?s1=${selectedIdA}&s2=${selectedIdB}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || 'Failed to fetch comparison details.');
        }

        const data = await res.json();
        setRecordA(data.record1);
        setRecordB(data.record2);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'An error occurred during comparison.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [selectedIdA, selectedIdB]);

  // Handle dropdown selections
  const handleSelectA = (id: string) => {
    setSelectedIdA(id);
    updateUrlParams(id, selectedIdB);
  };

  const handleSelectB = (id: string) => {
    setSelectedIdB(id);
    updateUrlParams(selectedIdA, id);
  };

  const updateUrlParams = (idA: string, idB: string) => {
    const params = new URLSearchParams();
    if (idA) params.set('s1', idA);
    if (idB) params.set('s2', idB);
    router.push(`/compare?${params.toString()}`);
  };

  // Delta Helper
  const getDeltaDisplay = (valA: number, valB: number, currA: Currency, currB: Currency) => {
    // If different currencies, convert valB to valA's currency
    const valBConverted = convertSalary(valB, currB, currA) * 100; // convert standard back to paise/cents representation
    const diff = valA - valBConverted;
    const formatted = formatSalary(Math.abs(diff), currA, currA);

    if (diff > 0) {
      return { text: `+${formatted}`, color: 'text-successGreen font-bold bg-green-50 px-2 py-0.5 rounded border border-green-150' };
    } else if (diff < 0) {
      return { text: `-${formatted}`, color: 'text-errorRed font-bold bg-red-50 px-2 py-0.5 rounded border border-red-150' };
    }
    return { text: '—', color: 'text-neutral-500 font-medium' };
  };

  const getWinnerBadge = (tcA: number, tcB: number, currA: Currency, currB: Currency) => {
    const tcBConverted = convertSalary(tcB, currB, currA) * 100;
    if (tcA > tcBConverted) return 'winner-A';
    if (tcBConverted > tcA) return 'winner-B';
    return 'tie';
  };

  const winner = recordA && recordB ? getWinnerBadge(recordA.totalCompensation, recordB.totalCompensation, recordA.currency, recordB.currency) : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-neutral-800 tracking-tight flex items-center space-x-2">
          <Scale className="w-8 h-8 text-primary" />
          <span>Compensation Side-by-Side Comparer</span>
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Select any two salary records from our database to compare base pay, stock grants, and bonuses.
        </p>
      </div>

      {/* Selectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Selector A */}
        <div className="bg-white border border-border rounded-xl p-5 card-shadow space-y-3">
          <label htmlFor="compare-a" className="text-xs font-extrabold text-neutral-400 uppercase tracking-wider block">
            Select Offer / Position A
          </label>
          <select
            id="compare-a"
            value={selectedIdA}
            onChange={(e) => handleSelectA(e.target.value)}
            className="w-full bg-white border border-border rounded-lg px-3 py-2.5 text-sm text-neutral-800 focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="">-- Choose Position A --</option>
            {records.map(r => (
              <option key={`a-${r.id}`} value={r.id} disabled={r.id === selectedIdB}>
                {r.companyName} | {r.role} ({r.level}) - {formatSalary(r.totalCompensation, r.currency, r.currency)}
              </option>
            ))}
          </select>
        </div>

        {/* Selector B */}
        <div className="bg-white border border-border rounded-xl p-5 card-shadow space-y-3">
          <label htmlFor="compare-b" className="text-xs font-extrabold text-neutral-400 uppercase tracking-wider block">
            Select Offer / Position B
          </label>
          <select
            id="compare-b"
            value={selectedIdB}
            onChange={(e) => handleSelectB(e.target.value)}
            className="w-full bg-white border border-border rounded-lg px-3 py-2.5 text-sm text-neutral-800 focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="">-- Choose Position B --</option>
            {records.map(r => (
              <option key={`b-${r.id}`} value={r.id} disabled={r.id === selectedIdA}>
                {r.companyName} | {r.role} ({r.level}) - {formatSalary(r.totalCompensation, r.currency, r.currency)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3 text-sm text-errorRed font-semibold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="bg-white border border-border rounded-xl p-12 text-center text-neutral-400 font-semibold card-shadow animate-pulse">
          <p className="text-sm">Calculating deltas and comparing packages...</p>
        </div>
      )}

      {/* Comparison Details Table */}
      {!loading && recordA && recordB && (
        <div className="space-y-4">
          <div className="bg-white border border-border rounded-xl overflow-hidden card-shadow">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-border text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  <th className="py-4 px-6 w-1/3">Feature</th>
                  <th className="py-4 px-6 w-1/3 text-center border-x border-border relative">
                    Position A
                    {winner === 'winner-A' && (
                      <span className="absolute top-2 right-2 bg-dataBlue text-white text-[9px] font-black uppercase px-2 py-0.5 rounded">
                        Higher TC
                      </span>
                    )}
                  </th>
                  <th className="py-4 px-6 w-1/3 text-center relative">
                    Position B
                    {winner === 'winner-B' && (
                      <span className="absolute top-2 right-2 bg-dataBlue text-white text-[9px] font-black uppercase px-2 py-0.5 rounded">
                        Higher TC
                      </span>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm font-semibold text-neutral-700">
                {/* Company Name */}
                <tr>
                  <td className="py-4 px-6 text-neutral-400 font-bold uppercase text-xs">Company</td>
                  <td className="py-4 px-6 text-center border-x border-border font-extrabold text-neutral-800 text-[15px]">
                    <Link href={`/companies/${recordA.company.slug}`} className="hover:text-primary transition-colors">
                      {recordA.company.name}
                    </Link>
                  </td>
                  <td className="py-4 px-6 text-center font-extrabold text-neutral-800 text-[15px]">
                    <Link href={`/companies/${recordB.company.slug}`} className="hover:text-primary transition-colors">
                      {recordB.company.name}
                    </Link>
                  </td>
                </tr>

                {/* Job Title / Role */}
                <tr>
                  <td className="py-4 px-6 text-neutral-400 font-bold uppercase text-xs">Role</td>
                  <td className="py-4 px-6 text-center border-x border-border text-neutral-700">{recordA.role}</td>
                  <td className="py-4 px-6 text-center text-neutral-700">{recordB.role}</td>
                </tr>

                {/* Level standard mapping */}
                <tr>
                  <td className="py-4 px-6 text-neutral-400 font-bold uppercase text-xs">Level</td>
                  <td className="py-4 px-6 text-center border-x border-border">
                    <span className="inline-block text-[10px] font-black uppercase bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded border border-slate-200">
                      {recordA.level}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-block text-[10px] font-black uppercase bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded border border-slate-200">
                      {recordB.level}
                    </span>
                  </td>
                </tr>

                {/* City Location */}
                <tr>
                  <td className="py-4 px-6 text-neutral-400 font-bold uppercase text-xs">Location</td>
                  <td className="py-4 px-6 text-center border-x border-border text-neutral-600">{recordA.location}</td>
                  <td className="py-4 px-6 text-center text-neutral-600">{recordB.location}</td>
                </tr>

                {/* Total Experience Years */}
                <tr>
                  <td className="py-4 px-6 text-neutral-400 font-bold uppercase text-xs">Experience</td>
                  <td className="py-4 px-6 text-center border-x border-border text-neutral-600">{recordA.experienceYears} Years</td>
                  <td className="py-4 px-6 text-center text-neutral-600">
                    {recordB.experienceYears} Years
                    <span className="block text-[10px] text-neutral-400 font-medium mt-1">
                      {recordA.experienceYears > recordB.experienceYears ? 
                        `A has +${recordA.experienceYears - recordB.experienceYears} yrs more` : 
                        recordB.experienceYears > recordA.experienceYears ? 
                        `B has +${recordB.experienceYears - recordA.experienceYears} yrs more` : 
                        'Equal experience'
                      }
                    </span>
                  </td>
                </tr>

                {/* Base Salary */}
                <tr>
                  <td className="py-4 px-6 text-neutral-400 font-bold uppercase text-xs">Base Salary</td>
                  <td className="py-4 px-6 text-center border-x border-border font-bold text-neutral-800">
                    {formatSalary(recordA.baseSalary, recordA.currency, recordA.currency)}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="font-bold text-neutral-800">
                      {formatSalary(recordB.baseSalary, recordB.currency, recordB.currency)}
                    </div>
                    <div className={`inline-block text-[10px] mt-1.5 ${getDeltaDisplay(recordA.baseSalary, recordB.baseSalary, recordA.currency, recordB.currency).color}`}>
                      {getDeltaDisplay(recordA.baseSalary, recordB.baseSalary, recordA.currency, recordB.currency).text}
                    </div>
                  </td>
                </tr>

                {/* Stock Grant Value */}
                <tr>
                  <td className="py-4 px-6 text-neutral-400 font-bold uppercase text-xs">Stock Grant / Yr</td>
                  <td className="py-4 px-6 text-center border-x border-border text-neutral-700">
                    {recordA.stock > 0 ? formatSalary(recordA.stock, recordA.currency, recordA.currency) : '—'}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="text-neutral-700">
                      {recordB.stock > 0 ? formatSalary(recordB.stock, recordB.currency, recordB.currency) : '—'}
                    </div>
                    <div className={`inline-block text-[10px] mt-1.5 ${getDeltaDisplay(recordA.stock, recordB.stock, recordA.currency, recordB.currency).color}`}>
                      {getDeltaDisplay(recordA.stock, recordB.stock, recordA.currency, recordB.currency).text}
                    </div>
                  </td>
                </tr>

                {/* Annual Performance Bonus */}
                <tr>
                  <td className="py-4 px-6 text-neutral-400 font-bold uppercase text-xs">Annual Bonus</td>
                  <td className="py-4 px-6 text-center border-x border-border text-neutral-700">
                    {recordA.bonus > 0 ? formatSalary(recordA.bonus, recordA.currency, recordA.currency) : '—'}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="text-neutral-700">
                      {recordB.bonus > 0 ? formatSalary(recordB.bonus, recordB.currency, recordB.currency) : '—'}
                    </div>
                    <div className={`inline-block text-[10px] mt-1.5 ${getDeltaDisplay(recordA.bonus, recordB.bonus, recordA.currency, recordB.currency).color}`}>
                      {getDeltaDisplay(recordA.bonus, recordB.bonus, recordA.currency, recordB.currency).text}
                    </div>
                  </td>
                </tr>

                {/* Total Compensation Row */}
                <tr className="bg-neutral-50/50">
                  <td className="py-5 px-6 text-neutral-400 font-extrabold uppercase text-xs">Total Comp</td>
                  <td className="py-5 px-6 text-center border-x border-border text-[16px] font-black text-dataBlue">
                    {formatSalary(recordA.totalCompensation, recordA.currency, recordA.currency)}
                  </td>
                  <td className="py-5 px-6 text-center">
                    <div className="text-[16px] font-black text-dataBlue">
                      {formatSalary(recordB.totalCompensation, recordB.currency, recordB.currency)}
                    </div>
                    <div className={`inline-block text-[10px] mt-1.5 ${getDeltaDisplay(recordA.totalCompensation, recordB.totalCompensation, recordA.currency, recordB.currency).color}`}>
                      {getDeltaDisplay(recordA.totalCompensation, recordB.totalCompensation, recordA.currency, recordB.currency).text}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {recordA.currency !== recordB.currency && (
            <div className="text-[11px] text-neutral-400 font-medium flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400" />
              <span>Deltas calculated in Position A&apos;s currency using conversion rate: 1 USD = 83 INR.</span>
            </div>
          )}
        </div>
      )}

      {/* Select state reminder */}
      {(!selectedIdA || !selectedIdB) && (
        <div className="bg-white border border-border rounded-xl p-12 text-center text-neutral-400 font-medium card-shadow">
          <Scale className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm">Please select a position in both boxes above to begin comparison.</p>
        </div>
      )}
    </div>
  );
}
