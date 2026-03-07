'use server'

import { createClient } from '@/utils/supabase/server'
import { getUserOrganization } from '@/utils/supabase/organization'
import { revalidatePath } from 'next/cache'

export async function calculatePayroll(coachId: string, month: string) {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  // Get coach salary info
  const { data: coach } = await supabase
    .from('coaches')
    .select('salary, pt_session_rate')
    .eq('id', coachId)
    .eq('organization_id', organizationId)
    .single();

  if (!coach) return { error: 'Coach not found' };

  const baseSalary = Number(coach.salary) || 0;
  const ptRate = Number(coach.pt_session_rate) || 0;

  // Count PT sessions for the month from attendance records where this coach was the trainer
  const monthStart = `${month}-01`;
  const [year, mon] = month.split('-').map(Number);
  const nextMonth = mon === 12 ? `${year + 1}-01-01` : `${year}-${String(mon + 1).padStart(2, '0')}-01`;

  const { count: ptSessions } = await supabase
    .from('attendance')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', organizationId)
    .eq('trainer_id', coachId)
    .gte('created_at', monthStart)
    .lt('created_at', nextMonth);

  const sessionsCount = ptSessions || 0;
  const total = baseSalary + (sessionsCount * ptRate);

  // Upsert payroll record
  const { error } = await supabase
    .from('payroll')
    .upsert({
      organization_id: organizationId,
      coach_id: coachId,
      month: month,
      base_salary: baseSalary,
      pt_sessions: sessionsCount,
      pt_rate: ptRate,
      total: total,
    }, { onConflict: 'coach_id, month' });

  if (error) {
    console.error("Error calculating payroll:", error);
    return { error: error.message };
  }

  revalidatePath('/payroll');
  return { success: true, total, baseSalary, ptSessions: sessionsCount, ptRate };
}

export async function getPayrollReport(month: string) {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const { data, error } = await supabase
    .from('payroll')
    .select('*, coaches(first_name, last_name)')
    .eq('organization_id', organizationId)
    .eq('month', month)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching payroll report:", error);
    return [];
  }

  return data || [];
}

export async function calculateAllPayroll(month: string) {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  // Get all active coaches
  const { data: coaches } = await supabase
    .from('coaches')
    .select('id')
    .eq('organization_id', organizationId)
    .eq('status', 'active');

  if (!coaches) return { error: 'No coaches found' };

  const results = [];
  for (const coach of coaches) {
    const result = await calculatePayroll(coach.id, month);
    results.push(result);
  }

  revalidatePath('/payroll');
  return { success: true, count: results.length };
}
