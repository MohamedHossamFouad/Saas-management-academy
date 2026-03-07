import { getUserOrganization } from '@/utils/supabase/organization';
import { createClient } from '@/utils/supabase/server';
import { getOrganizationSettings } from '@/app/actions/settings';
import {
  Users,
  DollarSign,
  Activity,
  Calendar,
  TrendingUp
} from 'lucide-react';

export default async function DashboardOverview() {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();
  const settings = await getOrganizationSettings();

  const locale = settings?.language === 'ar' ? 'ar-AE' : 'en-US';
  const currencyCode = settings?.currency || 'USD';

  const [
    { count: studentsCount },
    { data: paymentsData },
    { count: classesCount },
    { count: activeMemberships },
    { count: totalAttendance },
    { count: presentAttendance }
  ] = await Promise.all([
    supabase.from('students').select('*', { count: 'exact', head: true }).eq('organization_id', organizationId),
    supabase.from('payments').select('amount, payment_date').eq('organization_id', organizationId).eq('status', 'paid'),
    supabase.from('classes').select('*', { count: 'exact', head: true }).eq('organization_id', organizationId),
    supabase.from('student_memberships').select('*', { count: 'exact', head: true }).eq('organization_id', organizationId).eq('status', 'active'),
    supabase.from('attendance').select('*', { count: 'exact', head: true }).eq('organization_id', organizationId),
    supabase.from('attendance').select('*', { count: 'exact', head: true }).eq('organization_id', organizationId).eq('status', 'present'),
  ]);

  const totalRevenue = paymentsData?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;
  const attendanceRate = totalAttendance && totalAttendance > 0
    ? Math.round((presentAttendance || 0) / totalAttendance * 100)
    : 0;

  const monthlyRevenue: { month: string; amount: number }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthLabel = d.toLocaleString(locale, { month: 'short' });
    const monthStart = new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59).toISOString();
    const monthAmount = paymentsData
      ?.filter(p => p.payment_date >= monthStart && p.payment_date <= monthEnd)
      .reduce((sum, p) => sum + Number(p.amount), 0) || 0;
    monthlyRevenue.push({ month: monthLabel, amount: monthAmount });
  }
  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.amount), 1);

  const { data: recentPayments } = await supabase
    .from('payments')
    .select('id, amount, description, payment_date, students(first_name, last_name)')
    .eq('organization_id', organizationId)
    .order('payment_date', { ascending: false })
    .limit(4);

  const formattedRevenue = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(totalRevenue);

  const stats = [
    { name: 'Total Students', value: String(studentsCount || 0), icon: Users },
    { name: 'Total Revenue', value: formattedRevenue, icon: DollarSign },
    { name: 'Active Memberships', value: String(activeMemberships || 0), icon: Activity },
    { name: 'Total Classes', value: String(classesCount || 0), icon: Calendar },
    { name: 'Attendance Rate', value: `${attendanceRate}%`, icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Executive Overview</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Welcome back. Here&apos;s what&apos;s happening today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="flex flex-row items-center justify-between pb-2">
                <h3 className="tracking-tight text-sm font-medium text-slate-500">{stat.name}</h3>
                <Icon className="h-4 w-4 text-slate-400" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm col-span-4 p-6">
          <div className="flex flex-col space-y-1.5 pb-4">
            <h3 className="font-semibold leading-none tracking-tight text-lg text-slate-900 dark:text-white">Revenue Growth</h3>
            <p className="text-sm text-slate-500">Performance over last 6 months</p>
          </div>
          <div className="flex items-end gap-3 h-[200px] px-2">
            {monthlyRevenue.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">
                  {new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode, notation: 'compact' }).format(m.amount)}
                </span>
                <div className="w-full rounded-t-md bg-gradient-to-t from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 transition-all duration-500"
                  style={{ height: `${Math.max((m.amount / maxRevenue) * 150, 4)}px` }}
                />
                <span className="text-xs text-slate-400 font-medium">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm col-span-3 p-6 flex flex-col">
          <div className="flex flex-col space-y-1.5 pb-4">
            <h3 className="font-semibold leading-none tracking-tight text-lg text-slate-900 dark:text-white">Recent Activity</h3>
            <p className="text-sm text-slate-500">Real-time check-ins and member updates</p>
          </div>
          <div className="flex-1 overflow-y-auto pr-4 space-y-6">
            {!recentPayments || recentPayments.length === 0 ? (
              <p className="text-slate-400 text-sm mt-4 text-center">No recent activity.</p>
            ) : (
              recentPayments.map((activity) => {
                const name = activity.students ? `${(activity.students as any).first_name} ${(activity.students as any).last_name}` : 'Unknown';
                const time = new Date(activity.payment_date).toLocaleDateString();
                return (
                  <div key={activity.id} className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400 font-bold text-sm">
                      {name.charAt(0)}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-slate-900 dark:text-slate-200 font-medium">
                        {name} <span className="font-normal text-slate-500">paid {activity.description}</span>
                      </p>
                      <p className="text-xs text-slate-400">
                        {time} • <span className="text-emerald-500 font-medium">+{new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode }).format(activity.amount)}</span>
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
