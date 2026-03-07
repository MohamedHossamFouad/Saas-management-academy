'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  direction: 'ltr' | 'rtl';
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    dashboard: 'Dashboard',
    students: 'Students',
    coaches: 'Coaches',
    classes: 'Classes',
    attendance: 'Attendance',
    memberships: 'Memberships',
    payments: 'Payments',
    settings: 'Settings',
    signout: 'Sign out',
    management: 'Management',
  },
  ar: {
    dashboard: 'لوحة القيادة',
    students: 'الطلاب',
    coaches: 'المدربين',
    classes: 'الفصول',
    attendance: 'الحضور',
    memberships: 'العضويات',
    payments: 'المدفوعات',
    settings: 'الإعدادات',
    signout: 'تسجيل الخروج',
    management: 'إدارة',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Determine initial language from localStorage or default to English
    const saved = localStorage.getItem('app_language') as Language;
    if (saved && (saved === 'en' || saved === 'ar')) {
      setLanguage(saved);
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setDirection(lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('app_language', lang);
  };

  const t = (key: string): string => {
    return (translations[language] as any)[key] || key;
  };

  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
