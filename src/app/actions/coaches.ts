'use server'

import { createClient } from '@/utils/supabase/server'
import { getUserOrganization } from '@/utils/supabase/organization'
import { revalidatePath } from 'next/cache'

export async function getCoaches() {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const { data, error } = await supabase
    .from('coaches')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching coaches:", error);
    return [];
  }

  return data;
}

export async function createCoach(formData: FormData) {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const coachData = {
    organization_id: organizationId,
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    specialty: formData.get('specialty') as string,
    status: formData.get('status') as string || 'active'
  };

  const { error } = await supabase
    .from('coaches')
    .insert([coachData]);

  if (error) {
    console.error("Error creating coach:", error);
    return { error: error.message };
  }

  revalidatePath('/coaches');
  return { success: true };
}

export async function updateCoach(id: string, formData: FormData) {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const coachData = {
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    specialty: formData.get('specialty') as string,
    status: formData.get('status') as string,
  };

  const { error } = await supabase
    .from('coaches')
    .update(coachData)
    .eq('id', id)
    .eq('organization_id', organizationId);

  if (error) {
    console.error("Error updating coach:", error);
    return { error: error.message };
  }

  revalidatePath('/coaches');
  return { success: true };
}

export async function deleteCoach(id: string) {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const { error } = await supabase
    .from('coaches')
    .delete()
    .eq('id', id)
    .eq('organization_id', organizationId);

  if (error) {
    console.error("Error deleting coach:", error);
    return { error: error.message };
  }

  revalidatePath('/coaches');
  return { success: true };
}
