import Link from 'next/link';
import { Users, Award, UserCircle, CalendarDays, ArrowRight, Shield, Zap, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-900/20" />
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            SaaS Platform for Sports Academies
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">ArenaOS</span>
            <br />
            Manage Your Academy Like a Pro
          </h1>

          <p className="mt-6 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Streamline student management, class scheduling, attendance tracking, membership plans, and payments &mdash; all in one powerful dashboard.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:-translate-y-0.5"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Users, title: 'Student Management', desc: 'Track enrollment, profiles, and progress for every student.', color: 'blue' },
            { icon: CalendarDays, title: 'Class Scheduling', desc: 'Organize classes, assign coaches, and manage capacity.', color: 'indigo' },
            { icon: Award, title: 'Membership Plans', desc: 'Create flexible plans with automated billing and renewals.', color: 'emerald' },
            { icon: BarChart3, title: 'Revenue Analytics', desc: 'Real-time dashboards with revenue tracking and insights.', color: 'violet' },
          ].map((feature) => {
            const Icon = feature.icon;
            const colorMap: Record<string, string> = {
              blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
              indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400',
              emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
              violet: 'bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400',
            };
            return (
              <div key={feature.title} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-lg ${colorMap[feature.color]} flex items-center justify-center mb-4`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security Badge */}
      <div className="max-w-6xl mx-auto px-6 pb-16 text-center">
        <div className="inline-flex items-center gap-2 text-sm text-slate-400">
          <Shield className="w-4 h-4" />
          Secured with Supabase Row Level Security &bull; Multi-tenant data isolation
        </div>
      </div>
    </main>
  );
}