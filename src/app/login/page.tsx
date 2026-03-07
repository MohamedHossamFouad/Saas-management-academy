'use client'

import { useEffect, useState } from 'react'
import { login, signup } from './actions'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const savedEmail = localStorage.getItem('apex_remembered_email')
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  const handleAction = async (formData: FormData, actionFn: (data: FormData) => Promise<void>) => {
    if (rememberMe) {
      localStorage.setItem('apex_remembered_email', email)
    } else {
      localStorage.removeItem('apex_remembered_email')
    }
    await actionFn(formData)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Apex Academy</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Sign in to manage your sports academy</p>
        </div>

        {isMounted && (
          <form className="space-y-4 text-slate-900 dark:text-white">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex h-10 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1337ec]"
                placeholder="admin@apexacademy.com"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="flex h-10 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1337ec]"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-[#1337ec] focus:ring-[#1337ec]"
              />
              <label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700 dark:text-slate-300">
                Remember Me
              </label>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <button
                formAction={(formData) => handleAction(formData, login)}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-[#1337ec] text-white hover:bg-[#1337ec]/90 shadow-sm"
              >
                Sign In
              </button>
              <button
                formAction={(formData) => handleAction(formData, signup)}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 border border-slate-300 bg-transparent hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                Sign Up
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
