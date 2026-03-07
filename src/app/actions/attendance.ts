'use server'

import { createClient } from '@/utils/supabase/server'
import { getUserOrganization } from '@/utils/supabase/organization'
import { revalidatePath } from 'next/cache'

export async function getTodaysSessions() {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const { data, error } = await supabase
    .from('classes')
    .select('*, coaches(first_name, last_name)')
    .eq('organization_id', organizationId);

  if (error) {
    console.error("Error fetching sessions:", error);
    return [];
  }

  return data;
}

export async function markAttendance(
  studentId: string,
  classId: string,
  status: string = 'present',
  trainerId?: string
) {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  // Check attendance rules (blocked days)
  const { data: org } = await supabase
    .from('organizations')
    .select('attendance_rules')
    .eq('id', organizationId)
    .single();

  if (org?.attendance_rules) {
    const rules = org.attendance_rules as any;
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon, ...
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todayName = dayNames[dayOfWeek];

    if (rules.blocked_days && Array.isArray(rules.blocked_days) && rules.blocked_days.includes(todayName)) {
      return { error: `Attendance is not allowed on ${todayName}` };
    }
  }

  // Get or create a session for today
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  let { data: session } = await supabase
    .from('class_sessions')
    .select('id')
    .eq('class_id', classId)
    .gte('session_date', todayStart.toISOString())
    .single();

  if (!session) {
    const { data: newSession, error: sessionError } = await supabase
      .from('class_sessions')
      .insert([{ organization_id: organizationId, class_id: classId, session_date: new Date().toISOString() }])
      .select()
      .single();

    if (sessionError) throw new Error("Failed to create session");
    session = newSession;
  }

  // Mark attendance with trainer and check-in time
  const { error } = await supabase
    .from('attendance')
    .upsert({
      organization_id: organizationId,
      session_id: session!.id,
      student_id: studentId,
      status: status,
      trainer_id: trainerId || null,
      check_in_time: new Date().toISOString(),
    }, { onConflict: 'session_id, student_id' });

  if (error) {
    console.error("Error marking attendance:", error);
    return { error: error.message };
  }

  // Auto-decrement remaining_classes when marking present
  if (status === 'present') {
    // Decrement on student record
    const { data: student } = await supabase
      .from('students')
      .select('remaining_classes')
      .eq('id', studentId)
      .single();

    if (student && student.remaining_classes > 0) {
      await supabase
        .from('students')
        .update({ remaining_classes: student.remaining_classes - 1 })
        .eq('id', studentId);
    }

    // Decrement on active membership
    const { data: membership } = await supabase
      .from('student_memberships')
      .select('id, remaining_classes')
      .eq('student_id', studentId)
      .eq('organization_id', organizationId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (membership && membership.remaining_classes > 0) {
      await supabase
        .from('student_memberships')
        .update({ remaining_classes: membership.remaining_classes - 1 })
        .eq('id', membership.id);
    }
  }

  revalidatePath('/attendance');
  revalidatePath('/students');
  return { success: true };
}

export async function getAttendanceHistory() {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const { data, error } = await supabase
    .from('attendance')
    .select(`
      id,
      status,
      check_in_time,
      created_at,
      trainer_id,
      students (
        id,
        first_name,
        last_name
      ),
      class_sessions (
        id,
        session_date,
        classes (
          id,
          name
        )
      ),
      coaches:trainer_id (
        first_name,
        last_name
      )
    `)
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error("Error fetching attendance history:", error);
    return [];
  }

  return data || [];
}

export async function getMonthlyAttendance(year: number, month: number) {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endMonth = month === 12 ? 1 : month + 1;
  const endYear = month === 12 ? year + 1 : year;
  const endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-01`;

  const { data, error } = await supabase
    .from('attendance')
    .select(`
      id,
      status,
      check_in_time,
      created_at,
      students (id, first_name, last_name),
      class_sessions (session_date, classes(name))
    `)
    .eq('organization_id', organizationId)
    .gte('created_at', startDate)
    .lt('created_at', endDate)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching monthly attendance:", error);
    return [];
  }

  return data || [];
}

// Coach attendance tracking
export async function markCoachAttendance(coachId: string, date: string, status: string = 'present') {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const { error } = await supabase
    .from('coach_attendance')
    .upsert({
      organization_id: organizationId,
      coach_id: coachId,
      date: date,
      status: status,
    }, { onConflict: 'coach_id, date' });

  if (error) {
    console.error("Error marking coach attendance:", error);
    return { error: error.message };
  }

  revalidatePath('/coaches');
  return { success: true };
}

export async function getCoachAttendance(coachId: string, month?: string) {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  let query = supabase
    .from('coach_attendance')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('coach_id', coachId)
    .order('date', { ascending: false });

  if (month) {
    query = query.gte('date', `${month}-01`);
    const [year, mon] = month.split('-').map(Number);
    const nextMonth = mon === 12 ? `${year + 1}-01-01` : `${year}-${String(mon + 1).padStart(2, '0')}-01`;
    query = query.lt('date', nextMonth);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching coach attendance:", error);
    return [];
  }

  return data || [];
}
