'use client'

import { useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import { markAttendance } from '@/app/actions/attendance'

export default function RecordAttendanceModal({ classes, students }: { classes: any[], students: any[] }) {
  const [selectedClass, setSelectedClass] = useState<string>('')

  async function handleAction(studentId: string, status: string) {
    if (!selectedClass) return;
    await markAttendance(studentId, selectedClass, status);
    // In a real app we'd optimistically update a local state array or toast a success.
    alert(`Marked ${status}`);
  }

  return (
    <div className="space-y-6 text-left">
      <div className="space-y-2 max-w-sm">
        <label className="text-sm font-medium">Select Active Class</label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]"
        >
          <option value="" disabled>Select a class...</option>
          {classes.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {selectedClass && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-3 font-medium">Student</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    {student.first_name} {student.last_name}
                  </td>
                  <td className="px-6 py-4 flex justify-end gap-2">
                    <button
                      onClick={() => handleAction(student.id, 'present')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium text-emerald-700 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-400 dark:hover:bg-emerald-900 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" /> Present
                    </button>
                    <button
                      onClick={() => handleAction(student.id, 'absent')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-400 dark:hover:bg-red-900 transition-colors"
                    >
                      <XCircle className="w-4 h-4" /> Absent
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
