import { CalendarDays } from 'lucide-react';
import { getClasses, getCoaches } from '@/app/actions/classes';
import AddClassModal from '@/components/AddClassModal';
import EditClassModal from '@/components/EditClassModal';

export default async function ClassesPage() {
  const [classes, coaches] = await Promise.all([
    getClasses(),
    getCoaches()
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Classes & Schedule</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your academy's programs and schedules.</p>
        </div>
        <AddClassModal coaches={coaches} />
      </div>

      {classes.length === 0 ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-12 text-center text-slate-500">
          <CalendarDays className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">No classes scheduled</h3>
          <p className="mt-1">Create your first class to open up enrollments.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => (
            <div key={cls.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg hover:underline cursor-pointer">{cls.name}</h3>
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${cls.status === 'active'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100'
                  : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100'
                  }`}>
                  {cls.status}
                </span>
              </div>
              <p className="text-sm text-slate-500">
                Coach: {cls.coaches ? `${(cls.coaches as any).first_name} ${(cls.coaches as any).last_name}` : 'Unassigned'}
              </p>
              <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                <CalendarDays className="mr-2 h-4 w-4" /> {cls.schedule_info || 'TBD'}
              </div>
              <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                <span>Capacity: {cls.capacity} students</span>
                <EditClassModal cls={cls} coaches={coaches} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
