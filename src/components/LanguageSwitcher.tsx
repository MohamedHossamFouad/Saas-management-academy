'use client'

import { useState, useEffect } from 'react'

export function LanguageSwitcher() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en')

  useEffect(() => {
    const saved = localStorage.getItem('app_language') as 'en' | 'ar'
    if (saved && (saved === 'en' || saved === 'ar')) {
      setLanguage(saved)
    }
  }, [])

  const handleChange = (lang: 'en' | 'ar') => {
    setLanguage(lang)
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
    localStorage.setItem('app_language', lang)
  }

  return (
    <select
      value={language}
      onChange={(e) => handleChange(e.target.value as 'en' | 'ar')}
      className="h-8 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-[#1337ec] text-slate-700 dark:text-slate-300 cursor-pointer"
    >
      <option value="en">English (En)</option>
      <option value="ar">العربية (Ar)</option>
    </select>
  )
}
