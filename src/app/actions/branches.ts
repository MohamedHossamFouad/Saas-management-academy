'use server'

import { createClient } from '@/utils/supabase/server'
import { getUserOrganization } from '@/utils/supabase/organization'
import { revalidatePath } from 'next/cache'

export async function getBranches() {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const { data, error } = await supabase
    .from('branches')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching branches:", error);
    return [];
  }

  return data;
}

export async function createBranch(formData: FormData) {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const branchData = {
    organization_id: organizationId,
    name: formData.get('name') as string,
    location: formData.get('location') as string,
    manager: formData.get('manager') as string,
  };

  const { error } = await supabase
    .from('branches')
    .insert([branchData]);

  if (error) {
    console.error("Error creating branch:", error);
    return { error: error.message };
  }

  revalidatePath('/branches');
  return { success: true };
}

export async function updateBranch(id: string, formData: FormData) {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const branchData = {
    name: formData.get('name') as string,
    location: formData.get('location') as string,
    manager: formData.get('manager') as string,
  };

  const { error } = await supabase
    .from('branches')
    .update(branchData)
    .eq('id', id)
    .eq('organization_id', organizationId);

  if (error) {
    console.error("Error updating branch:", error);
    return { error: error.message };
  }

  revalidatePath('/branches');
  return { success: true };
}

export async function deleteBranch(id: string) {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const { error } = await supabase
    .from('branches')
    .delete()
    .eq('id', id)
    .eq('organization_id', organizationId);

  if (error) {
    console.error("Error deleting branch:", error);
    return { error: error.message };
  }

  revalidatePath('/branches');
  return { success: true };
}
