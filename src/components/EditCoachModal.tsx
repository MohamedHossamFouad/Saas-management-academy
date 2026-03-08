'use client'

import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { updateCoach, deleteCoach } from '@/app/actions/coaches';
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog';

export default function EditCoachModal({ coach, branches }: { coach: any; branches?: any[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#1337ec] transition-colors">
        <Pencil className="w-3.5 h-3.5" /> Edit
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg w-full max-w-md p-6 m-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Edit Coach</h3>
            <form
              action={async (formData) => {
                await updateCoach(coach.id, formData);
                setOpen(false);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">First Name *</label>
                  <input required name="first_name" defaultValue={coach.first_name} className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Name *</label>
                  <input required name="last_name" defaultValue={coach.last_name} className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email *</label>
                <input required name="email" type="email" defaultValue={coach.email} className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone</label>
                <input name="phone" defaultValue={coach.phone || ''} className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Specialty</label>
                <input name="specialty" defaultValue={coach.specialty || ''} className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]" />
              </div>
              {branches && branches.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Branch</label>
                  <select name="branch_id" defaultValue={coach.branch_id || ''} className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]">
                    <option value="">No branch</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Salary</label>
                  <input name="salary" type="number" step="0.01" defaultValue={coach.salary || ''} className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">PT Rate</label>
                  <input name="pt_session_rate" type="number" step="0.01" defaultValue={coach.pt_session_rate || ''} className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Work Days/Mo</label>
                  <input name="working_days_per_month" type="number" defaultValue={coach.working_days_per_month || ''} className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]" />
                </div>
              </div>
              <div className="flex justify-between items-center pt-4">
                <ConfirmDeleteDialog
                  title="Delete Coach"
                  message={`Are you sure you want to delete "${coach.first_name} ${coach.last_name}"? This action cannot be undone.`}
                  onConfirm={async () => {
                    await deleteCoach(coach.id);
                    setOpen(false);
                  }}
                >
                  <button type="button" className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </ConfirmDeleteDialog>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setOpen(false)} className="h-10 px-4 py-2 rounded-md text-sm font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">Cancel</button>
                  <button type="submit" className="h-10 px-4 py-2 rounded-md text-sm font-medium bg-[#1337ec] text-white hover:bg-[#1337ec]/90">Save Changes</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
