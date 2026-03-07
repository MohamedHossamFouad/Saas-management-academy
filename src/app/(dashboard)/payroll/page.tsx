import { Calculator, Download } from 'lucide-react';
import { getPayrollReport } from '@/app/actions/payroll';
import { getCoaches } from '@/app/actions/coaches';
import PayrollActions from '@/components/PayrollActions';

export default async function PayrollPage() {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const [payrollData, coaches] = await Promise.all([
    getPayrollReport(currentMonth),
    getCoaches(),
  ]);

  const totalPayroll = payrollData.reduce((sum, p) => sum + Number(p.total), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Payroll Management</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Calculate and manage trainer salaries.</p>
        </div>
        <PayrollActions coaches={coaches} currentMonth={currentMonth} />
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 pb-2">Current Month</h3>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{currentMonth}</div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 pb-2">Total Payroll</h3>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">${totalPayroll.toLocaleString()}</div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 pb-2">Coaches</h3>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{payrollData.length}</div>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Payroll Report — {currentMonth}</h3>
          </div>
        </div>

        {payrollData.length === 0 ? (
          <div className="p-6 text-center text-slate-500 py-16">
            <Calculator className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">No payroll data</h3>
            <p className="mt-1">Click &quot;Calculate All&quot; to generate payroll for the current month.</p>
          </div>
        ) : (
          <div className="w-full relative overflow-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3 font-medium">Coach</th>
                  <th className="px-6 py-3 font-medium">Base Salary</th>
                  <th className="px-6 py-3 font-medium">PT Sessions</th>
                  <th className="px-6 py-3 font-medium">PT Rate</th>
                  <th className="px-6 py-3 font-medium">PT Earnings</th>
                  <th className="px-6 py-3 font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {payrollData.map((record) => {
                  const coachName = record.coaches
                    ? `${(record.coaches as any).first_name} ${(record.coaches as any).last_name}`
                    : 'Unknown';
                  const ptEarnings = Number(record.pt_sessions) * Number(record.pt_rate);

                  return (
                    <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{coachName}</td>
                      <td className="px-6 py-4 text-slate-500">${Number(record.base_salary).toLocaleString()}</td>
                      <td className="px-6 py-4 text-slate-500">{record.pt_sessions}</td>
                      <td className="px-6 py-4 text-slate-500">${Number(record.pt_rate).toLocaleString()}</td>
                      <td className="px-6 py-4 text-slate-500">${ptEarnings.toLocaleString()}</td>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">${Number(record.total).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
