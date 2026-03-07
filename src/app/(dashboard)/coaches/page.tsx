import { Contact, Search } from 'lucide-react';
import { getCoaches } from '@/app/actions/coaches';
import { getBranches } from '@/app/actions/branches';
import AddCoachModal from '@/components/AddCoachModal';
import EditCoachModal from '@/components/EditCoachModal';

export default async function CoachesPage() {
  const [coaches, branches] = await Promise.all([
    getCoaches(),
    getBranches(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Coaches Management</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">View and manage your academy&apos;s coaching staff.</p>
        </div>
        <AddCoachModal branches={branches} />
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <input
              className="flex h-9 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1337ec] pl-9"
              placeholder="Search coaches..."
              type="search"
            />
          </div>
        </div>

        {coaches.length === 0 ? (
          <div className="p-6 text-center text-slate-500 py-16">
            <Contact className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">No coaches found</h3>
            <p className="mt-1">Get started by adding a new coach to your academy.</p>
          </div>
        ) : (
          <div className="w-full relative overflow-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Specialty</th>
                  <th className="px-6 py-3 font-medium">Branch</th>
                  <th className="px-6 py-3 font-medium">Salary</th>
                  <th className="px-6 py-3 font-medium">PT Rate</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {coaches.map((coach) => (
                  <tr key={coach.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      {coach.first_name} {coach.last_name}
                    </td>
                    <td className="px-6 py-4 text-slate-500">{coach.email}</td>
                    <td className="px-6 py-4 text-slate-500">{coach.specialty || '-'}</td>
                    <td className="px-6 py-4 text-slate-500">{(coach.branches as any)?.name || '-'}</td>
                    <td className="px-6 py-4 text-slate-500">${Number(coach.salary || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-500">${Number(coach.pt_session_rate || 0).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${coach.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100'
                        : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100'
                        }`}>
                        {coach.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <EditCoachModal coach={coach} branches={branches} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
