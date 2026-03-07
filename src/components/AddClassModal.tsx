'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { createClass } from '@/app/actions/classes'

export default function AddClassModal({ coaches }: { coaches?: any[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    await createClass(formData)
    setIsLoading(false)
    setIsOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-[#1337ec] text-white hover:bg-[#1337ec]/90 shadow-sm"
      >
        <Plus className="w-4 h-4" /> Create Class
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg w-full max-w-md border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-semibold text-lg">Create New Class</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form action={handleSubmit} className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Class Name</label>
                <input required name="name" placeholder="e.g. Advanced Basketball" className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Schedule Info</label>
                <input required name="schedule_info" placeholder="e.g. Mon, Wed, Fri • 4:00 PM" className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Capacity</label>
                  <input required type="number" name="capacity" defaultValue="20" min="1" className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Assigned Coach</label>
                  <select name="coach_id" className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]">
                    <option value="">Unassigned</option>
                    {coaches && coaches.map(c => (
                      <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-md text-sm font-medium border border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
                  Cancel
                </button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-md text-sm font-medium bg-[#1337ec] text-white hover:bg-[#1337ec]/90 disabled:opacity-50">
                  {isLoading ? 'Saving...' : 'Save Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
