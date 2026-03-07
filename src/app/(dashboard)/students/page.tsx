import { Users, Search } from 'lucide-react';
import { getStudents } from '@/app/actions/students';
import AddStudentModal from '@/components/AddStudentModal';
import EditStudentModal from '@/components/EditStudentModal';

export default async function StudentsPage() {
  const students = await getStudents();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Students Management</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">View and manage enrolled students.</p>
        </div>
        <AddStudentModal />
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <input
              className="flex h-9 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1337ec] pl-9"
              placeholder="Search students..."
              type="search"
            />
          </div>
        </div>

        {students.length === 0 ? (
          <div className="p-6 text-center text-slate-500 py-16">
            <Users className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">No students found</h3>
            <p className="mt-1">Get started by adding a new student to your academy.</p>
          </div>
        ) : (
          <div className="w-full relative overflow-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Phone</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Joined</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      {student.first_name} {student.last_name}
                    </td>
                    <td className="px-6 py-4 text-slate-500">{student.email}</td>
                    <td className="px-6 py-4 text-slate-500">{student.phone || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100 capitalize">
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(student.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <EditStudentModal student={student} />
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
