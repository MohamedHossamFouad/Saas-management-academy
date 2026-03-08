'use client'

import { useLanguage } from './LanguageProvider'

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value as 'en' | 'ar')}
      className="h-8 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-[#1337ec] text-slate-700 dark:text-slate-300 cursor-pointer"
    >
      <option value="en">English (En)</option>
      <option value="ar">العربية (Ar)</option>
    </select>
  )
}
