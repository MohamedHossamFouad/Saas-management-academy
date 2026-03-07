'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { createPayment } from '@/app/actions/payments'

export default function AddPaymentModal({ students }: { students: any[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    await createPayment(formData)
    setIsLoading(false)
    setIsOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-[#1337ec] text-white hover:bg-[#1337ec]/90 shadow-sm"
      >
        <Plus className="w-4 h-4" /> Record Payment
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg w-full max-w-md border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-semibold text-lg">Record Payment</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form action={handleSubmit} className="p-4 space-y-4 text-left">
              <div className="space-y-2">
                <label className="text-sm font-medium">Student</label>
                <select required name="student_id" className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]">
                  <option value="" disabled selected>Select a student...</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <input required name="description" placeholder="e.g. Monthly Membership" className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount ($)</label>
                <input required type="number" step="0.01" name="amount" className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]" />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-md text-sm font-medium border border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
                  Cancel
                </button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-md text-sm font-medium bg-[#1337ec] text-white hover:bg-[#1337ec]/90 disabled:opacity-50">
                  {isLoading ? 'Saving...' : 'Save Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
