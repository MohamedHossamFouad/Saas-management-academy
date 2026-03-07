import {
  BarChart3,
  Users,
  DollarSign,
  Activity,
  TrendingUp,
} from 'lucide-react';
import {
  getRevenueReport,
  getPlayerGrowthReport,
  getAttendanceTrendsReport,
  getPlayerAttendanceReport,
  getTrainerAttendanceReport,
  getPaymentsReport,
} from '@/app/actions/reports';

export default async function ReportsPage() {
  const [revenue, playerGrowth, attendanceTrends, playerAttendance, trainerAttendance, paymentsReport] = await Promise.all([
    getRevenueReport(),
    getPlayerGrowthReport(),
    getAttendanceTrendsReport(),
    getPlayerAttendanceReport(),
    getTrainerAttendanceReport(),
    getPaymentsReport(),
  ]);

  const maxRevenue = Math.max(...revenue.map(r => r.amount), 1);
  const maxGrowth = Math.max(...playerGrowth.map(r => r.count), 1);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Reports & Analytics</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Comprehensive insights into your academy&apos;s performance.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-slate-500">Total Revenue</h3>
            <DollarSign className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">${paymentsReport.totalRevenue.toLocaleString()}</div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-slate-500">Total Discounts</h3>
            <Activity className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">${paymentsReport.totalDiscount.toLocaleString()}</div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-slate-500">Paid Invoices</h3>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{paymentsReport.paidCount}</div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-slate-500">Pending</h3>
            <DollarSign className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-amber-600">{paymentsReport.pendingCount}</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Revenue Chart */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-1">Monthly Revenue</h3>
          <p className="text-sm text-slate-500 mb-4">Revenue over the last 12 months</p>
          <div className="flex items-end gap-2 h-[180px]">
            {revenue.length === 0 ? (
              <p className="text-slate-400 text-sm m-auto">No data yet</p>
            ) : (
              revenue.map((r) => (
                <div key={r.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-slate-500 font-medium">${Math.round(r.amount)}</span>
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300"
                    style={{ height: `${Math.max((r.amount / maxRevenue) * 140, 4)}px` }}
                  />
                  <span className="text-[10px] text-slate-400">{r.month.split('-')[1]}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Player Growth Chart */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-1">Player Growth</h3>
          <p className="text-sm text-slate-500 mb-4">New players per month</p>
          <div className="flex items-end gap-2 h-[180px]">
            {playerGrowth.length === 0 ? (
              <p className="text-slate-400 text-sm m-auto">No data yet</p>
            ) : (
              playerGrowth.map((g) => (
                <div key={g.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-slate-500 font-medium">{g.count}</span>
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-emerald-600 to-emerald-400 dark:from-emerald-500 dark:to-emerald-300"
                    style={{ height: `${Math.max((g.count / maxGrowth) * 140, 4)}px` }}
                  />
                  <span className="text-[10px] text-slate-400">{g.month.split('-')[1]}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Attendance Trends Chart */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-1">Attendance Trends</h3>
          <p className="text-sm text-slate-500 mb-4">Monthly attendance rate</p>
          <div className="flex items-end gap-2 h-[180px]">
            {attendanceTrends.length === 0 ? (
              <p className="text-slate-400 text-sm m-auto">No data yet</p>
            ) : (
              attendanceTrends.map((a) => (
                <div key={a.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-slate-500 font-medium">{a.rate}%</span>
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-purple-600 to-purple-400 dark:from-purple-500 dark:to-purple-300"
                    style={{ height: `${Math.max((a.rate / 100) * 140, 4)}px` }}
                  />
                  <span className="text-[10px] text-slate-400">{a.month.split('-')[1]}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Attendance Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Player Attendance Report */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-400" />
            <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Player Attendance Summary</h3>
          </div>
          {playerAttendance.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">No attendance data</div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3 font-medium">Player</th>
                  <th className="px-6 py-3 font-medium">Present</th>
                  <th className="px-6 py-3 font-medium">Absent</th>
                  <th className="px-6 py-3 font-medium">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {playerAttendance.slice(0, 10).map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-3 font-medium text-slate-900 dark:text-white">{p.name}</td>
                    <td className="px-6 py-3 text-emerald-600">{p.present}</td>
                    <td className="px-6 py-3 text-red-500">{p.absent}</td>
                    <td className="px-6 py-3 text-slate-600 dark:text-slate-300">{p.total > 0 ? Math.round((p.present / p.total) * 100) : 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Trainer Attendance Report */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-slate-400" />
            <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Trainer Attendance Summary</h3>
          </div>
          {trainerAttendance.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">No attendance data</div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3 font-medium">Trainer</th>
                  <th className="px-6 py-3 font-medium">Present</th>
                  <th className="px-6 py-3 font-medium">Absent</th>
                  <th className="px-6 py-3 font-medium">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {trainerAttendance.slice(0, 10).map((t, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-3 font-medium text-slate-900 dark:text-white">{t.name}</td>
                    <td className="px-6 py-3 text-emerald-600">{t.present}</td>
                    <td className="px-6 py-3 text-red-500">{t.absent}</td>
                    <td className="px-6 py-3 text-slate-600 dark:text-slate-300">{t.total > 0 ? Math.round((t.present / t.total) * 100) : 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
