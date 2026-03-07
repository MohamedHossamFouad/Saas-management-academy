import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import {
  BarChart,
  Users,
  UserCircle,
  CalendarDays,
  ClipboardCheck,
  CreditCard,
  Wallet,
  Settings,
  LogOut,
  Building2,
  BarChart3,
  Calculator,
} from 'lucide-react';
import { createClient } from '@/utils/supabase/server';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return <DashboardLayoutClient user={user}>{children}</DashboardLayoutClient>;
}

function DashboardLayoutClient({ children, user }: { children: React.ReactNode; user: any }) {

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart },
    { name: 'Students', href: '/students', icon: Users },
    { name: 'Coaches', href: '/coaches', icon: UserCircle },
    { name: 'Classes', href: '/classes', icon: CalendarDays },
    { name: 'Attendance', href: '/attendance', icon: ClipboardCheck },
    { name: 'Memberships', href: '/memberships', icon: CreditCard },
    { name: 'Payments', href: '/payments', icon: Wallet },
    { name: 'Branches', href: '/branches', icon: Building2 },
    { name: 'Payroll', href: '/payroll', icon: Calculator },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 rtl:flex-row-reverse">
      {/* Sidebar */}
      <aside className="w-64 border-r dark:border-slate-800 border-slate-200 rtl:border-l rtl:border-r-0 bg-white dark:bg-slate-900 flex flex-col pt-6 shrink-0 z-10 transition-colors duration-200">
        <div className="px-6 mb-8 text-left rtl:text-right">
          <h1 className="text-xl font-bold text-[#1337ec] dark:text-blue-400 font-sans tracking-tight">Apex Academy</h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Management</p>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 mt-auto text-left rtl:text-right">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-slate-500">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">
                {user?.email ? user.email.split('@')[0] : 'Administrator'}
              </p>
              <p className="text-xs text-slate-500 truncate">Admin Profile</p>
            </div>
          </div>
          <form action="/auth/signout" method="post" className="mt-2">
            <button className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span>Sign out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative transition-colors duration-200">
        {/* Header */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex items-center justify-end px-8 shrink-0 gap-4 z-10 transition-colors duration-200">
          <LanguageSwitcher />
          <ThemeToggle />
        </header>

        <div className="flex-1 overflow-y-auto p-8 relative">
          {children}
        </div>
      </main>
    </div>
  );
}
