'use server'

import { createClient } from '@/utils/supabase/server'
import { getUserOrganization } from '@/utils/supabase/organization'
import { revalidatePath } from 'next/cache'

export async function getStudents(branchId?: string) {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  let query = supabase
    .from('students')
    .select('*, branches(name)')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });

  if (branchId) {
    query = query.eq('branch_id', branchId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching students:", error);
    return [];
  }

  return data;
}

export async function getStudentById(id: string) {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const { data, error } = await supabase
    .from('students')
    .select('*, branches(name)')
    .eq('id', id)
    .eq('organization_id', organizationId)
    .single();

  if (error) {
    console.error("Error fetching student:", error);
    return null;
  }

  return data;
}

export async function getStudentMemberships(studentId: string) {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const { data, error } = await supabase
    .from('student_memberships')
    .select('*, membership_plans(name, price)')
    .eq('organization_id', organizationId)
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching student memberships:", error);
    return [];
  }

  return data || [];
}

export async function getStudentPayments(studentId: string) {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('student_id', studentId)
    .order('payment_date', { ascending: false });

  if (error) {
    console.error("Error fetching student payments:", error);
    return [];
  }

  return data || [];
}

export async function getStudentAttendance(studentId: string) {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const { data, error } = await supabase
    .from('attendance')
    .select(`
      id,
      status,
      check_in_time,
      created_at,
      class_sessions (
        session_date,
        classes (name)
      )
    `)
    .eq('organization_id', organizationId)
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching student attendance:", error);
    return [];
  }

  return data || [];
}

export async function createStudent(formData: FormData) {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const branchId = formData.get('branch_id') as string;

  const studentData = {
    organization_id: organizationId,
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    date_of_birth: formData.get('dob') as string || null,
    status: formData.get('status') as string || 'active',
    branch_id: branchId || null,
    remaining_classes: parseInt(formData.get('remaining_classes') as string) || 0,
  };

  const { error } = await supabase
    .from('students')
    .insert([studentData]);

  if (error) {
    console.error("Error creating student:", error);
  }

  revalidatePath('/students');
}

export async function updateStudent(id: string, formData: FormData) {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const branchId = formData.get('branch_id') as string;

  const studentData = {
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    date_of_birth: formData.get('dob') as string || null,
    status: formData.get('status') as string,
    branch_id: branchId || null,
    remaining_classes: parseInt(formData.get('remaining_classes') as string) || 0,
  };

  const { error } = await supabase
    .from('students')
    .update(studentData)
    .eq('id', id)
    .eq('organization_id', organizationId);

  if (error) console.error("Error updating student:", error);
  revalidatePath('/students');
}

export async function deleteStudent(id: string) {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', id)
    .eq('organization_id', organizationId);

  if (error) console.error("Error deleting student:", error);
  revalidatePath('/students');
}

export async function importStudents(studentsArray: Array<{
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  status?: string;
}>) {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const rows = studentsArray.map(s => ({
    organization_id: organizationId,
    first_name: s.first_name,
    last_name: s.last_name,
    email: s.email || null,
    phone: s.phone || null,
    date_of_birth: s.date_of_birth || null,
    status: s.status || 'active',
    remaining_classes: 0,
  }));

  const { error } = await supabase
    .from('students')
    .insert(rows);

  if (error) {
    console.error("Error importing students:", error);
    return { error: error.message };
  }

  revalidatePath('/students');
  return { success: true, count: rows.length };
}
