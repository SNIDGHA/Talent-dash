'use client';

import React, { useState } from 'react';
import { Calculator, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

export default function ToolsPage() {
  // 1. Hike Calculator State
  const [currentCTC, setCurrentCTC] = useState<number>(1500000);
  const [hikePercentage, setHikePercentage] = useState<number>(30);

  // Hike calculations
  const hikeAmount = Math.round(currentCTC * (hikePercentage / 100));
  const newCTC = currentCTC + hikeAmount;
  const estimatedMonthlyTakeHome = Math.round((newCTC / 12) * 0.76); // rough estimate of 24% tax/PF deductions

  // 2. Vesting Calculator State
  const [grantValue, setGrantValue] = useState<number>(4000000);
  const [vestingYears, setVestingYears] = useState<number>(4);
  const [growthRate, setGrowthRate] = useState<number>(10);
  const [scheduleType, setScheduleType] = useState<'even' | 'amazon'>('even');

  // Vesting calculations helper
  const calculateVestingSchedule = () => {
    const years = Array.from({ length: vestingYears }, (_, i) => i + 1);
    
    // Get vesting distribution percentages
    let distribution: number[] = [];
    if (scheduleType === 'even') {
      distribution = Array(vestingYears).fill(100 / vestingYears);
    } else {
      // Amazon backloaded split: 5%, 15%, 40%, 40%
      if (vestingYears === 4) {
        distribution = [5, 15, 40, 40];
      } else {
        // Fallback for non-4 years backloaded
        distribution = [10, 20, 30, 40];
      }
    }

    let accumulatedProjected = 0;
    const rows = years.map((yr, idx) => {
      const pct = distribution[idx] || 0;
      const baseValue = Math.round(grantValue * (pct / 100));
      
      // Calculate compound interest for projected stock price growth
      // Year 1 growth = baseValue * (1 + growthRate/100)^1
      const projectedValue = Math.round(baseValue * Math.pow(1 + growthRate / 100, yr));
      accumulatedProjected += projectedValue;

      return {
        year: yr,
        percentage: pct,
        baseValue,
        projectedValue
      };
    });

    return { rows, accumulatedProjected };
  };

  const { rows: vestingRows, accumulatedProjected: totalProjected } = calculateVestingSchedule();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center space-x-1.5 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Interactive Calculators</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-800">
          Compensation Intelligence Tools
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Perform real-time calculations to evaluate job offers, project stock vesting values, and estimate take-home pay increments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Tool 1: Salary Hike Calculator */}
        <div className="bg-white border border-border rounded-xl p-6 card-shadow space-y-6">
          <div className="flex items-center space-x-2.5 border-b border-border pb-3">
            <Calculator className="w-5 h-5 text-primary" />
            <h2 className="text-base font-extrabold text-neutral-800">Salary Hike Calculator</h2>
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-neutral-500">
                <label htmlFor="ctc-input">CURRENT CTC (INR)</label>
                <span>₹{currentCTC.toLocaleString()}</span>
              </div>
              <input
                id="ctc-input"
                type="range"
                min="300000"
                max="10000000"
                step="50000"
                value={currentCTC}
                onChange={(e) => setCurrentCTC(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 font-semibold">
                <span>₹3L</span>
                <span>₹50L</span>
                <span>₹1Cr</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-neutral-500">
                <label htmlFor="hike-input">EXPECTED HIKE (%)</label>
                <span>{hikePercentage}%</span>
              </div>
              <input
                id="hike-input"
                type="range"
                min="0"
                max="150"
                step="1"
                value={hikePercentage}
                onChange={(e) => setHikePercentage(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 font-semibold">
                <span>0%</span>
                <span>75%</span>
                <span>150%</span>
              </div>
            </div>
          </div>

          {/* Outputs */}
          <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Absolute Hike</span>
                <span className="text-sm font-extrabold text-neutral-700">₹{hikeAmount.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">New CTC</span>
                <span className="text-sm font-extrabold text-primary">₹{newCTC.toLocaleString()}</span>
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-4">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                Estimated Monthly Take-Home
              </span>
              <span className="text-lg font-black text-neutral-800">
                ₹{estimatedMonthlyTakeHome.toLocaleString()}
              </span>
              <span className="text-[9px] text-neutral-400 font-semibold block pt-1">
                *Estimated post-tax and provident fund deductions at standard slabs.
              </span>
            </div>
          </div>
        </div>

        {/* Tool 2: Equity Vesting Calculator */}
        <div className="bg-white border border-border rounded-xl p-6 card-shadow space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2.5 border-b border-border pb-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-base font-extrabold text-neutral-800">Equity Vesting Calculator</h2>
            </div>

            {/* Inputs */}
            <div className="space-y-4 mt-5">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-neutral-500">
                  <label htmlFor="grant-input">TOTAL STOCK GRANT VALUE</label>
                  <span>₹{grantValue.toLocaleString()}</span>
                </div>
                <input
                  id="grant-input"
                  type="range"
                  min="500000"
                  max="50000000"
                  step="100000"
                  value={grantValue}
                  onChange={(e) => setGrantValue(Number(e.target.value))}
                  className="w-full h-1.5 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="growth-input" className="text-xs font-bold text-neutral-500 block">ANNUAL STOCK GROWTH (%)</label>
                  <input
                    id="growth-input"
                    type="number"
                    min="-50"
                    max="100"
                    value={growthRate}
                    onChange={(e) => setGrowthRate(Number(e.target.value))}
                    className="w-full bg-neutral-550/5 border border-border rounded-lg px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-neutral-500 block">VESTING PATTERN</span>
                  <div className="grid grid-cols-2 border border-border rounded-lg overflow-hidden p-0.5 bg-neutral-50">
                    <button
                      onClick={() => setScheduleType('even')}
                      className={`py-1.5 text-[10px] font-bold rounded-md transition ${
                        scheduleType === 'even' ? 'bg-primary text-white' : 'text-neutral-500'
                      }`}
                    >
                      Even Split
                    </button>
                    <button
                      onClick={() => setScheduleType('amazon')}
                      className={`py-1.5 text-[10px] font-bold rounded-md transition ${
                        scheduleType === 'amazon' ? 'bg-primary text-white' : 'text-neutral-500'
                      }`}
                    >
                      Amazon (5/15/40/40)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Vesting Schedule Table */}
            <div className="mt-6 border border-border rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse text-xs font-semibold">
                <thead>
                  <tr className="bg-neutral-50 border-b border-border text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Year</th>
                    <th className="py-2.5 px-3 text-right">Vesting %</th>
                    <th className="py-2.5 px-3 text-right">Base Value</th>
                    <th className="py-2.5 px-3 text-right">Projected Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-neutral-700">
                  {vestingRows.map((row) => (
                    <tr key={row.year} className="hover:bg-neutral-50 transition">
                      <td className="py-2.5 px-3">Year {row.year}</td>
                      <td className="py-2.5 px-3 text-right">{row.percentage}%</td>
                      <td className="py-2.5 px-3 text-right">₹{row.baseValue.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-primary">₹{row.projectedValue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-4.5 mt-5 flex items-center justify-between text-xs font-semibold">
            <span className="text-neutral-500">Total Projected Stock Value:</span>
            <span className="text-base font-black text-neutral-800">₹{totalProjected.toLocaleString()}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
