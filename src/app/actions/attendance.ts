'use server'

import { createClient } from '@/utils/supabase/server'
import { getUserOrganization } from '@/utils/supabase/organization'
import { revalidatePath } from 'next/cache'

export async function getTodaysSessions() {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  // Here we would typically filter by today's date, but for simplicity we fetch all recent ones
  // or we create sessions dynamically. Let's assume we fetch classes for now.
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .eq('organization_id', organizationId);

  if (error) {
    console.error("Error fetching sessions:", error);
    return [];
  }

  return data;
}

export async function markAttendance(studentId: string, classId: string, status: string = 'present') {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  // 1. Ensure a session exists for today
  // For the sake of this MVP, we might just insert straight into attendance if we simplified the schema,
  // but looking at our schema, attendance requires a session_id.

  // First get or create a session for today for this class
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

  // 2. Mark attendance
  const { error } = await supabase
    .from('attendance')
    .upsert({
      organization_id: organizationId,
      session_id: session!.id,
      student_id: studentId,
      status: status
    }, { onConflict: 'session_id, student_id' });

  if (error) {
    console.error("Error marking attendance:", error);
    return { error: error.message };
  }

  revalidatePath('/attendance');
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
      created_at,
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
      )
    `)
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching attendance history:", error);
    return [];
  }

  return data || [];
}
