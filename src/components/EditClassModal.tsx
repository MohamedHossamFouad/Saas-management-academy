'use client'

import { useState } from 'react'
import { Edit, X, Trash2 } from 'lucide-react'
import { updateClass, deleteClass } from '@/app/actions/classes'

export default function EditClassModal({ cls, coaches }: { cls: any, coaches: any[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    await updateClass(cls.id, formData)
    setIsLoading(false)
    setIsOpen(false)
  }

  async function handleDelete() {
    if (confirm("Are you sure you want to delete this class?")) {
      setIsDeleting(true)
      await deleteClass(cls.id)
      setIsDeleting(false)
      setIsOpen(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-xs text-[#1337ec] hover:underline"
      >
        Edit Class
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg w-full max-w-md border border-slate-200 dark:border-slate-800 overflow-hidden text-left">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Edit Class</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form action={handleSubmit} className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Class Name</label>
                <input required defaultValue={cls.name} name="name" className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Schedule Info</label>
                <input required defaultValue={cls.schedule_info} name="schedule_info" className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Capacity</label>
                  <input required defaultValue={cls.capacity} type="number" name="capacity" className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Assigned Coach</label>
                  <select defaultValue={cls.coach_id || ''} name="coach_id" className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]">
                    <option value="">Unassigned</option>
                    {coaches.map(c => (
                      <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                <select defaultValue={cls.status} name="status" className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
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
