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

  const featuresStr = formData.get('features') as string || '';
  const features = featuresStr.split(',').map(f => f.trim()).filter(f => f.length > 0);

  const planData = {
    organization_id: organizationId,
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    price: parseFloat(formData.get('price') as string),
    billing_cycle: formData.get('billing_cycle') as string || 'monthly',
    is_popular: formData.get('is_popular') === 'true',
    features: features,
    number_of_classes: parseInt(formData.get('number_of_classes') as string) || 0,
    duration_days: parseInt(formData.get('duration_days') as string) || 30,
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

  const featuresStr = formData.get('features') as string || '';
  const features = featuresStr.split(',').map(f => f.trim()).filter(f => f.length > 0);

  const planData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    price: parseFloat(formData.get('price') as string),
    billing_cycle: formData.get('billing_cycle') as string,
    is_popular: formData.get('is_popular') === 'true',
    features: features,
    number_of_classes: parseInt(formData.get('number_of_classes') as string) || 0,
    duration_days: parseInt(formData.get('duration_days') as string) || 30,
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

export async function assignMembership(studentId: string, planId: string) {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  // Get plan details
  const { data: plan } = await supabase
    .from('membership_plans')
    .select('number_of_classes, duration_days, price')
    .eq('id', planId)
    .single();

  if (!plan) return { error: 'Plan not found' };

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + (plan.duration_days || 30));

  const { error } = await supabase
    .from('student_memberships')
    .insert([{
      organization_id: organizationId,
      student_id: studentId,
      plan_id: planId,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      status: 'active',
      remaining_classes: plan.number_of_classes || 0,
    }]);

  if (error) {
    console.error("Error assigning membership:", error);
    return { error: error.message };
  }

  // Also update remaining_classes on the student record
  await supabase
    .from('students')
    .update({ remaining_classes: plan.number_of_classes || 0 })
    .eq('id', studentId);

  revalidatePath('/memberships');
  revalidatePath('/students');
  return { success: true };
}
