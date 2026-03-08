'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Building2, User, Mail, Lock } from 'lucide-react'

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const academyName = formData.get('academy_name') as string
    const adminName = formData.get('admin_name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ academyName, adminName, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
        setLoading(false)
        return
      }

      // Redirect to login with success message
      window.location.href = '/login?message=Account created! Check your email to verify, then sign in.'
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Create Your Academy
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Get started with ArenaOS in seconds
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-slate-900 dark:text-white">
          <div className="space-y-2">
            <label htmlFor="academy_name" className="text-sm font-medium leading-none flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-400" /> Academy Name
            </label>
            <input
              id="academy_name"
              name="academy_name"
              type="text"
              required
              className="flex h-10 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1337ec]"
              placeholder="My Sports Academy"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="admin_name" className="text-sm font-medium leading-none flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" /> Your Name
            </label>
            <input
              id="admin_name"
              name="admin_name"
              type="text"
              required
              className="flex h-10 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1337ec]"
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium leading-none flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" /> Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="flex h-10 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1337ec]"
              placeholder="admin@academy.com"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium leading-none flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-400" /> Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                className="flex h-10 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 pr-10 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1337ec]"
                placeholder="Min 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center w-full whitespace-nowrap rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 bg-[#1337ec] text-white hover:bg-[#1337ec]/90 shadow-sm disabled:opacity-50"
            >
              {loading ? 'Creating Academy...' : 'Create Academy'}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="text-[#1337ec] hover:underline font-medium">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
