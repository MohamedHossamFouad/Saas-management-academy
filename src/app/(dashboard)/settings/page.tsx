import { getOrganizationSettings, updateOrganizationSettings } from '@/app/actions/settings';
import { Save } from 'lucide-react';

export default async function SettingsPage() {
  const settings = await getOrganizationSettings();

  const attendanceRules = (settings?.attendance_rules as any) || { blocked_days: [], grace_period_days: 7 };
  const blockedDaysStr = (attendanceRules.blocked_days || []).join(', ');

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your academy&apos;s configuration and preferences.</p>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <form action={updateOrganizationSettings} className="p-6 space-y-8">

          {/* General Information */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-800">General Information</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Academy Name</label>
                <input
                  required
                  name="name"
                  defaultValue={settings?.name || ''}
                  className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Logo URL</label>
                <input
                  name="logo_url"
                  defaultValue={settings?.logo_url || ''}
                  placeholder="https://example.com/logo.png"
                  className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]"
                />
              </div>
            </div>
          </section>

          {/* Localization */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-800">Localization</h3>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">System Language</label>
                <select
                  name="language"
                  defaultValue={settings?.language || 'en'}
                  className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]"
                >
                  <option value="en">English (US)</option>
                  <option value="ar">Arabic (العربية)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Currency</label>
                <select
                  name="currency"
                  defaultValue={settings?.currency || 'USD'}
                  className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="AED">AED (د.إ)</option>
                  <option value="SAR">SAR (ر.س)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="EGP">EGP (ج.م)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Timezone</label>
                <select
                  name="timezone"
                  defaultValue={settings?.timezone || 'UTC'}
                  className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="Asia/Dubai">Gulf Standard Time (GST)</option>
                  <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                  <option value="Africa/Cairo">Eastern European Time (EET)</option>
                  <option value="Asia/Riyadh">Arabia Standard Time (AST)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Attendance Rules */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-800">Attendance Rules</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Blocked Days</label>
                <input
                  name="blocked_days"
                  defaultValue={blockedDaysStr}
                  placeholder="e.g. friday, saturday"
                  className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]"
                />
                <p className="text-xs text-slate-400">Comma-separated day names. Attendance won&apos;t be allowed on these days.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Grace Period (days)</label>
                <input
                  name="grace_period_days"
                  type="number"
                  defaultValue={attendanceRules.grace_period_days || 7}
                  min={0}
                  className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#1337ec]"
                />
                <p className="text-xs text-slate-400">Days after membership expiry where payment is still accepted.</p>
              </div>
            </div>
          </section>

          <div className="pt-4 flex justify-end border-t border-slate-200 dark:border-slate-800">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-[#1337ec] text-white hover:bg-[#1337ec]/90 shadow-sm transition-colors"
            >
              <Save className="w-4 h-4" /> Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
