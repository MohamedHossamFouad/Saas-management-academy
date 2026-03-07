'use client'

import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { calculateAllPayroll } from '@/app/actions/payroll';

export default function PayrollActions({ coaches, currentMonth }: { coaches: any[]; currentMonth: string }) {
  const [loading, setLoading] = useState(false);

  const handleCalculateAll = async () => {
    setLoading(true);
    await calculateAllPayroll(currentMonth);
    setLoading(false);
    window.location.reload();
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleCalculateAll}
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none h-10 px-4 py-2 bg-[#1337ec] text-white hover:bg-[#1337ec]/90 shadow-sm disabled:opacity-50"
      >
        <Calculator className="w-4 h-4" />
        {loading ? 'Calculating...' : 'Calculate All'}
      </button>
    </div>
  );
}
