'use client'

import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { updateBranch, deleteBranch } from '@/app/actions/branches';
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog';

export default function EditBranchModal({ branch }: { branch: any }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#1337ec] transition-colors">
        <Pencil className="w-3.5 h-3.5" /> Edit
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg w-full max-w-md p-6 m-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Edit Branch</h3>
            <form
              action={async (formData) => {
                await updateBranch(branch.id, formData);
                setOpen(false);
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Branch Name *</label>
                <input required name="name" defaultValue={branch.name} className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Location</label>
                <input name="location" defaultValue={branch.location || ''} className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Manager</label>
                <input name="manager" defaultValue={branch.manager || ''} className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]" />
              </div>
              <div className="flex justify-between items-center pt-4">
                <ConfirmDeleteDialog
                  title="Delete Branch"
                  message={`Are you sure you want to delete the "${branch.name}" branch? This action cannot be undone.`}
                  onConfirm={async () => {
                    await deleteBranch(branch.id);
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
