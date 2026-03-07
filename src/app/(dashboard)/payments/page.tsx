import { Wallet, Download, CheckCircle2 } from 'lucide-react';
import { getPayments } from '@/app/actions/payments';
import { getStudents } from '@/app/actions/students';
import AddPaymentModal from '@/components/AddPaymentModal';
import EditPaymentModal from '@/components/EditPaymentModal';

export default async function PaymentsPage() {
  const [payments, students] = await Promise.all([
    getPayments(),
    getStudents()
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Payments & Revenue</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Manage transactions and billing history.</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none h-10 px-4 py-2 border border-slate-300 bg-transparent hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
            <Download className="w-4 h-4" /> Export Data
          </button>
          <AddPaymentModal students={students} />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
        </div>
        <div className="p-0">
          {payments.length === 0 ? (
            <div className="p-6 text-center text-slate-500 py-16">
              <Wallet className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">No payments yet</h3>
              <p className="mt-1">Record your first transaction to see it here.</p>
            </div>
          ) : (
            <div className="w-full relative overflow-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-3 font-medium">Student</th>
                    <th className="px-6 py-3 font-medium">Plan/Item</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Amount</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                        {payment.students ? `${(payment.students as any).first_name} ${(payment.students as any).last_name}` : 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-slate-500">{payment.description}</td>
                      <td className="px-6 py-4 text-slate-500">{new Date(payment.payment_date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">${payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${payment.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100'
                          }`}>
                          {payment.status === 'paid' && <CheckCircle2 className="w-3 h-3" />}
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <EditPaymentModal payment={payment} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
