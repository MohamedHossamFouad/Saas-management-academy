import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  ClipboardCheck,
  Building2,
} from 'lucide-react';
import Link from 'next/link';
import { getStudentById, getStudentMemberships, getStudentPayments, getStudentAttendance } from '@/app/actions/students';
import { notFound } from 'next/navigation';

export default async function StudentProfilePage({ params }: { params: { id: string } }) {
  const [student, memberships, payments, attendance] = await Promise.all([
    getStudentById(params.id),
    getStudentMemberships(params.id),
    getStudentPayments(params.id),
    getStudentAttendance(params.id),
  ]);

  if (!student) return notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/students" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition">
          <ArrowLeft className="w-4 h-4" /> Back to Students
        </Link>
      </div>

      {/* Profile Header */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-bold">
            {student.first_name.charAt(0)}{student.last_name.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{student.first_name} {student.last_name}</h2>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
              {student.email && (
                <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {student.email}</span>
              )}
              {student.phone && (
                <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {student.phone}</span>
              )}
              {student.date_of_birth && (
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(student.date_of_birth).toLocaleDateString()}</span>
              )}
              {(student.branches as any)?.name && (
                <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> {(student.branches as any).name}</span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${student.status === 'active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100'}`}>
              {student.status}
            </span>
            <span className="text-sm text-slate-500">Remaining Classes: <strong className="text-slate-900 dark:text-white">{student.remaining_classes}</strong></span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Memberships */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-slate-400" />
            <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Memberships</h3>
          </div>
          {memberships.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">No memberships</div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3 font-medium">Plan</th>
                  <th className="px-6 py-3 font-medium">Start</th>
                  <th className="px-6 py-3 font-medium">End</th>
                  <th className="px-6 py-3 font-medium">Classes Left</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {memberships.map((m: any) => (
                  <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-3 font-medium text-slate-900 dark:text-white">{m.membership_plans?.name || '-'}</td>
                    <td className="px-6 py-3 text-slate-500">{m.start_date}</td>
                    <td className="px-6 py-3 text-slate-500">{m.end_date || '-'}</td>
                    <td className="px-6 py-3 text-slate-500">{m.remaining_classes ?? '-'}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${m.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'}`}>
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Payment History */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-slate-400" />
            <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Payment History</h3>
          </div>
          {payments.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">No payments</div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Description</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {payments.map((p: any) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-3 text-slate-500">{new Date(p.payment_date).toLocaleDateString()}</td>
                    <td className="px-6 py-3 text-slate-900 dark:text-white">{p.description}</td>
                    <td className="px-6 py-3 font-medium text-slate-900 dark:text-white">${Number(p.amount).toLocaleString()}</td>
                    <td className="px-6 py-3 text-xs text-slate-400 font-mono">{p.invoice_number || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Attendance History */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-slate-400" />
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Attendance History</h3>
        </div>
        {attendance.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm">No attendance records</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Class</th>
                <th className="px-6 py-3 font-medium">Check-in</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {attendance.map((a: any) => (
                <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-3 text-slate-500">
                    {a.class_sessions?.session_date ? new Date(a.class_sessions.session_date).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-3 text-slate-900 dark:text-white">{a.class_sessions?.classes?.name || '-'}</td>
                  <td className="px-6 py-3 text-slate-500">
                    {a.check_in_time ? new Date(a.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${a.status === 'present' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' : a.status === 'absent' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'}`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
