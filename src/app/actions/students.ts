'use server'

import { createClient } from '@/utils/supabase/server'
import { getUserOrganization } from '@/utils/supabase/organization'
import { revalidatePath } from 'next/cache'

export async function getStudents() {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching students:", error);
    return [];
  }

  return data;
}

export async function createStudent(formData: FormData) {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const studentData = {
    organization_id: organizationId,
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    date_of_birth: formData.get('dob') as string || null,
    status: formData.get('status') as string || 'active'
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

  const studentData = {
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    status: formData.get('status') as string
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
