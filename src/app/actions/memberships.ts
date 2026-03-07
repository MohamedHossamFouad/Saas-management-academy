'use server'

import { createClient } from '@/utils/supabase/server'
import { getUserOrganization } from '@/utils/supabase/organization'
import { revalidatePath } from 'next/cache'

export async function getPlans() {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const { data, error } = await supabase
    .from('membership_plans')
    .select('*')
    .eq('organization_id', organizationId)
    .order('price', { ascending: true });

  if (error) {
    console.error("Error fetching plans:", error);
    return [];
  }

  return data;
}

export async function createPlan(formData: FormData) {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  // Convert features string (comma separated) to array
  const featuresStr = formData.get('features') as string || '';
  const features = featuresStr.split(',').map(f => f.trim()).filter(f => f.length > 0);

  const planData = {
    organization_id: organizationId,
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    price: parseFloat(formData.get('price') as string),
    billing_cycle: formData.get('billing_cycle') as string || 'monthly',
    is_popular: formData.get('is_popular') === 'true',
    features: features
  };

  const { error } = await supabase
    .from('membership_plans')
    .insert([planData]);

  if (error) {
    console.error("Error creating plan:", error);
    return { error: error.message };
  }

  revalidatePath('/memberships');
  return { success: true };
}

export async function updatePlan(id: string, formData: FormData) {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  // Convert features string (comma separated) to array
  const featuresStr = formData.get('features') as string || '';
  const features = featuresStr.split(',').map(f => f.trim()).filter(f => f.length > 0);

  const planData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    price: parseFloat(formData.get('price') as string),
    billing_cycle: formData.get('billing_cycle') as string,
    is_popular: formData.get('is_popular') === 'true',
    features: features
  };

  const { error } = await supabase
    .from('membership_plans')
    .update(planData)
    .eq('id', id)
    .eq('organization_id', organizationId);

  if (error) {
    console.error("Error updating plan:", error);
    return { error: error.message };
  }

  revalidatePath('/memberships');
  return { success: true };
}

export async function deletePlan(id: string) {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const { error } = await supabase
    .from('membership_plans')
    .delete()
    .eq('id', id)
    .eq('organization_id', organizationId);

  if (error) {
    console.error("Error deleting plan:", error);
    return { error: error.message };
  }

  revalidatePath('/memberships');
  return { success: true };
}
