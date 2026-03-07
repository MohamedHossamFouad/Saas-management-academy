'use client'

import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { updatePlan, deletePlan } from '@/app/actions/memberships';

export default function EditMembershipModal({ plan }: { plan: any }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#1337ec] transition-colors w-full justify-center mt-auto"
      >
        <Pencil className="w-3.5 h-3.5" /> Edit Plan
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg w-full max-w-md p-6 m-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Edit Membership Plan</h3>
            <form
              action={async (formData) => {
                await updatePlan(plan.id, formData);
                setOpen(false);
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Plan Name *</label>
                <input required name="name" defaultValue={plan.name} className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                <input name="description" defaultValue={plan.description || ''} className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Price *</label>
                  <input required name="price" type="number" step="0.01" defaultValue={plan.price} className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Billing Cycle</label>
                  <select name="billing_cycle" defaultValue={plan.billing_cycle} className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]">
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="weekly">Weekly</option>
                    <option value="one-time">One-time</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Number of Classes</label>
                  <input name="number_of_classes" type="number" defaultValue={plan.number_of_classes || 0} min={0} className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Duration (days)</label>
                  <input name="duration_days" type="number" defaultValue={plan.duration_days || 30} min={1} className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Features (comma separated)</label>
                <input name="features" defaultValue={plan.features?.join(', ') || ''} className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]" />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <input type="checkbox" name="is_popular" value="true" defaultChecked={plan.is_popular} className="rounded" /> Mark as Popular
                </label>
              </div>
              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={async () => {
                    if (confirm('Are you sure you want to delete this plan?')) {
                      await deletePlan(plan.id);
                      setOpen(false);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
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
