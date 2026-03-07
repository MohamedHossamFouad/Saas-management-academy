'use server'

import { createClient } from '@/utils/supabase/server'
import { getUserOrganization } from '@/utils/supabase/organization'
import { revalidatePath } from 'next/cache'

export async function getClasses() {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const { data, error } = await supabase
    .from('classes')
    .select(`
      *,
      coaches (
        id,
        first_name,
        last_name
      )
    `)
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching classes:", error);
    return [];
  }

  return data;
}

export async function getCoaches() {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const { data, error } = await supabase
    .from('coaches')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('status', 'active');

  if (error) return [];
  return data;
}

export async function createClass(formData: FormData) {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const coachId = formData.get('coach_id') as string;

  const classData = {
    organization_id: organizationId,
    name: formData.get('name') as string,
    schedule_info: formData.get('schedule_info') as string,
    capacity: parseInt(formData.get('capacity') as string) || 20,
    coach_id: coachId ? coachId : null,
    status: 'active'
  };

  const { error } = await supabase
    .from('classes')
    .insert([classData]);

  if (error) console.error("Error creating class:", error);
  revalidatePath('/classes');
}

export async function updateClass(id: string, formData: FormData) {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const coachId = formData.get('coach_id') as string;

  const classData = {
    name: formData.get('name') as string,
    schedule_info: formData.get('schedule_info') as string,
    capacity: parseInt(formData.get('capacity') as string) || 20,
    coach_id: coachId ? coachId : null,
    status: formData.get('status') as string || 'active'
  };

  const { error } = await supabase
    .from('classes')
    .update(classData)
    .eq('id', id)
    .eq('organization_id', organizationId);

  if (error) console.error("Error updating class:", error);
  revalidatePath('/classes');
}

export async function deleteClass(id: string) {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const { error } = await supabase
    .from('classes')
    .delete()
    .eq('id', id)
    .eq('organization_id', organizationId);

  if (error) console.error("Error deleting class:", error);
  revalidatePath('/classes');
}
