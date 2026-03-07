'use server'

import { createClient } from '@/utils/supabase/server'
import { getUserOrganization } from '@/utils/supabase/organization'

export async function getPlayerAttendanceReport(startDate?: string, endDate?: string) {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  let query = supabase
    .from('attendance')
    .select(`
      id,
      status,
      created_at,
      students (id, first_name, last_name)
    `)
    .eq('organization_id', organizationId);

  if (startDate) query = query.gte('created_at', startDate);
  if (endDate) query = query.lte('created_at', endDate);

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching player attendance report:", error);
    return [];
  }

  // Aggregate by student
  const studentMap: Record<string, { name: string; present: number; absent: number; late: number; total: number }> = {};
  for (const record of (data || [])) {
    const student = record.students as any;
    if (!student) continue;
    const key = student.id;
    if (!studentMap[key]) {
      studentMap[key] = { name: `${student.first_name} ${student.last_name}`, present: 0, absent: 0, late: 0, total: 0 };
    }
    studentMap[key][record.status as 'present' | 'absent' | 'late']++;
    studentMap[key].total++;
  }

  return Object.values(studentMap);
}

export async function getTrainerAttendanceReport(startDate?: string, endDate?: string) {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  let query = supabase
    .from('coach_attendance')
    .select(`
      id,
      status,
      date,
      coaches (id, first_name, last_name)
    `)
    .eq('organization_id', organizationId);

  if (startDate) query = query.gte('date', startDate);
  if (endDate) query = query.lte('date', endDate);

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching trainer attendance report:", error);
    return [];
  }

  // Aggregate by coach
  const coachMap: Record<string, { name: string; present: number; absent: number; late: number; total: number }> = {};
  for (const record of (data || [])) {
    const coach = record.coaches as any;
    if (!coach) continue;
    const key = coach.id;
    if (!coachMap[key]) {
      coachMap[key] = { name: `${coach.first_name} ${coach.last_name}`, present: 0, absent: 0, late: 0, total: 0 };
    }
    coachMap[key][record.status as 'present' | 'absent' | 'late']++;
    coachMap[key].total++;
  }

  return Object.values(coachMap);
}

export async function getPaymentsReport(startDate?: string, endDate?: string) {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  let query = supabase
    .from('payments')
    .select('amount, status, payment_date, discount')
    .eq('organization_id', organizationId);

  if (startDate) query = query.gte('payment_date', startDate);
  if (endDate) query = query.lte('payment_date', endDate);

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching payments report:", error);
    return { totalRevenue: 0, totalDiscount: 0, paidCount: 0, pendingCount: 0 };
  }

  const totalRevenue = (data || []).filter(p => p.status === 'paid').reduce((sum, p) => sum + Number(p.amount), 0);
  const totalDiscount = (data || []).reduce((sum, p) => sum + Number(p.discount || 0), 0);
  const paidCount = (data || []).filter(p => p.status === 'paid').length;
  const pendingCount = (data || []).filter(p => p.status === 'pending').length;

  return { totalRevenue, totalDiscount, paidCount, pendingCount };
}

export async function getRevenueReport() {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const { data, error } = await supabase
    .from('payments')
    .select('amount, payment_date')
    .eq('organization_id', organizationId)
    .eq('status', 'paid');

  if (error) {
    console.error("Error fetching revenue report:", error);
    return [];
  }

  // Group by month
  const monthMap: Record<string, number> = {};
  for (const p of (data || [])) {
    const d = new Date(p.payment_date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthMap[key] = (monthMap[key] || 0) + Number(p.amount);
  }

  return Object.entries(monthMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([month, amount]) => ({ month, amount }));
}

export async function getPlayerGrowthReport() {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const { data, error } = await supabase
    .from('students')
    .select('created_at')
    .eq('organization_id', organizationId);

  if (error) {
    console.error("Error fetching player growth report:", error);
    return [];
  }

  // Group by month
  const monthMap: Record<string, number> = {};
  for (const s of (data || [])) {
    const d = new Date(s.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthMap[key] = (monthMap[key] || 0) + 1;
  }

  return Object.entries(monthMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([month, count]) => ({ month, count }));
}

export async function getAttendanceTrendsReport() {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const { data, error } = await supabase
    .from('attendance')
    .select('status, created_at')
    .eq('organization_id', organizationId);

  if (error) {
    console.error("Error fetching attendance trends:", error);
    return [];
  }

  // Group by month
  const monthMap: Record<string, { present: number; total: number }> = {};
  for (const a of (data || [])) {
    const d = new Date(a.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!monthMap[key]) monthMap[key] = { present: 0, total: 0 };
    monthMap[key].total++;
    if (a.status === 'present') monthMap[key].present++;
  }

  return Object.entries(monthMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([month, data]) => ({
      month,
      rate: data.total > 0 ? Math.round((data.present / data.total) * 100) : 0
    }));
}
