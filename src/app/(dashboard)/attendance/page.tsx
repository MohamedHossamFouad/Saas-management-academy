import { ClipboardCheck, Clock } from 'lucide-react';
import { getTodaysSessions, getAttendanceHistory } from '@/app/actions/attendance';
import { getStudents } from '@/app/actions/students';
import { getCoaches } from '@/app/actions/coaches';
import RecordAttendanceModal from '@/components/RecordAttendanceModal';

export default async function AttendancePage() {
  const [classes, students, coaches, history] = await Promise.all([
    getTodaysSessions(),
    getStudents(),
    getCoaches(),
    getAttendanceHistory(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Attendance</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Track daily active members and check-ins.</p>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
        {classes.length === 0 ? (
          <div className="text-center py-20">
            <ClipboardCheck className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">No classes available</h3>
            <p className="mt-1 text-slate-500">Create a class first before taking attendance.</p>
          </div>
        ) : (
          <RecordAttendanceModal classes={classes} students={students} coaches={coaches} />
        )}
      </div>

      {/* Attendance History */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-400" />
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Attendance History</h3>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-sm">No attendance records yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-3 font-medium">Student</th>
                <th className="px-6 py-3 font-medium">Class</th>
                <th className="px-6 py-3 font-medium">Trainer</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Check-in</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {history.map((record: any) => {
                const studentName = record.students
                  ? `${record.students.first_name} ${record.students.last_name}`
                  : 'Unknown';
                const className = record.class_sessions?.classes?.name || 'N/A';
                const trainerName = record.coaches
                  ? `${(record.coaches as any).first_name} ${(record.coaches as any).last_name}`
                  : '-';
                const sessionDate = record.class_sessions?.session_date
                  ? new Date(record.class_sessions.session_date).toLocaleDateString()
                  : 'N/A';
                const checkInTime = record.check_in_time
                  ? new Date(record.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : record.created_at
                    ? new Date(record.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : 'N/A';
                const status = record.status || 'unknown';

                return (
                  <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{studentName}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{className}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{trainerName}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{sessionDate}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{checkInTime}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status === 'present'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400'
                        : status === 'absent'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
