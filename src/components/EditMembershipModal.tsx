'use client'

import { useState } from 'react'
import { Edit, X, Trash2 } from 'lucide-react'
import { updatePlan, deletePlan } from '@/app/actions/memberships'

export default function EditMembershipModal({ plan }: { plan: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    await updatePlan(plan.id, formData)
    setIsLoading(false)
    setIsOpen(false)
  }

  async function handleDelete() {
    if (confirm("Are you sure you want to delete this membership plan?")) {
      setIsDeleting(true)
      await deletePlan(plan.id)
      setIsDeleting(false)
      setIsOpen(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`mt-auto w-full rounded-md px-4 py-2 text-sm font-semibold transition ${plan.is_popular ? 'bg-[#1337ec] text-white hover:bg-[#1337ec]/90 shadow-sm' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
      >
        Edit Plan
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg w-full max-w-md border border-slate-200 dark:border-slate-800 overflow-hidden text-left">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Edit Membership Plan</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form action={handleSubmit} className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Plan Name</label>
                <input required defaultValue={plan.name} name="name" className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                <input required defaultValue={plan.description || ''} name="description" className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Price</label>
                  <input required defaultValue={plan.price} type="number" step="0.01" name="price" className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Billing Cycle</label>
                  <select defaultValue={plan.billing_cycle} name="billing_cycle" className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]">
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="weekly">Weekly</option>
                    <option value="one-time">One-time</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Features (comma separated)</label>
                <textarea required defaultValue={plan.features ? plan.features.join(', ') : ''} name="features" rows={3} placeholder="Feature 1, Feature 2, Feature 3" className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec] resize-none" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked={plan.is_popular} id={`popular-${plan.id}`} name="is_popular" value="true" className="w-4 h-4 rounded border-slate-300 text-[#1337ec] focus:ring-[#1337ec]" />
                <label htmlFor={`popular-${plan.id}`} className="text-sm font-medium text-slate-700 dark:text-slate-300">Mark as Popular Plan</label>
              </div>
              <div className="pt-4 flex items-center justify-between">
                <button type="button" onClick={handleDelete} disabled={isDeleting} className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isDeleting ? '...' : 'Delete'}
                </button>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-md text-sm font-medium border border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
                    Cancel
                  </button>
                  <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-md text-sm font-medium bg-[#1337ec] text-white hover:bg-[#1337ec]/90 disabled:opacity-50">
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
