'use server'

import { createClient } from '@/utils/supabase/server'
import { getUserOrganization } from '@/utils/supabase/organization'
import { revalidatePath } from 'next/cache'

export async function getPayments() {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const { data, error } = await supabase
    .from('payments')
    .select('*, students(first_name, last_name)')
    .eq('organization_id', organizationId)
    .order('payment_date', { ascending: false });

  if (error) {
    console.error("Error fetching payments:", error);
    return [];
  }

  return data;
}

export async function createPayment(formData: FormData) {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const paymentData = {
    organization_id: organizationId,
    student_id: formData.get('student_id') as string,
    amount: parseFloat(formData.get('amount') as string),
    description: formData.get('description') as string,
    status: 'paid'
  };

  const { error } = await supabase
    .from('payments')
    .insert([paymentData]);

  if (error) {
    console.error("Error processing payment:", error);
    return { error: error.message };
  }

  revalidatePath('/payments');
  return { success: true };
}

export async function updatePayment(id: string, formData: FormData) {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const paymentData = {
    amount: parseFloat(formData.get('amount') as string),
    description: formData.get('description') as string,
    status: formData.get('status') as string,
  };

  const { error } = await supabase
    .from('payments')
    .update(paymentData)
    .eq('id', id)
    .eq('organization_id', organizationId);

  if (error) {
    console.error("Error updating payment:", error);
    return { error: error.message };
  }

  revalidatePath('/payments');
  return { success: true };
}

export async function deletePayment(id: string) {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const { error } = await supabase
    .from('payments')
    .delete()
    .eq('id', id)
    .eq('organization_id', organizationId);

  if (error) {
    console.error("Error deleting payment:", error);
    return { error: error.message };
  }

  revalidatePath('/payments');
  return { success: true };
}
