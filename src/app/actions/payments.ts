'use server'

import { createClient } from '@/utils/supabase/server'
import { getUserOrganization } from '@/utils/supabase/organization'
import { revalidatePath } from 'next/cache'

function generateInvoiceNumber(): string {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `INV-${datePart}-${rand}`;
}

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

  const amount = parseFloat(formData.get('amount') as string);
  const discount = parseFloat(formData.get('discount') as string) || 0;

  const paymentData = {
    organization_id: organizationId,
    student_id: formData.get('student_id') as string,
    amount: amount - discount,
    discount: discount,
    description: formData.get('description') as string,
    paid_for_month: formData.get('paid_for_month') as string || null,
    invoice_number: generateInvoiceNumber(),
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

  const amount = parseFloat(formData.get('amount') as string);
  const discount = parseFloat(formData.get('discount') as string) || 0;

  const paymentData = {
    amount: amount,
    discount: discount,
    description: formData.get('description') as string,
    status: formData.get('status') as string,
    paid_for_month: formData.get('paid_for_month') as string || null,
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

export async function checkGracePeriod(studentId: string) {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  // Get grace period days from settings
  const { data: org } = await supabase
    .from('organizations')
    .select('attendance_rules')
    .eq('id', organizationId)
    .single();

  const gracePeriodDays = (org?.attendance_rules as any)?.grace_period_days || 7;

  // Get student's active membership
  const { data: membership } = await supabase
    .from('student_memberships')
    .select('end_date, status')
    .eq('student_id', studentId)
    .eq('organization_id', organizationId)
    .order('end_date', { ascending: false })
    .limit(1)
    .single();

  if (!membership) return { inGracePeriod: false, expired: true };

  const endDate = new Date(membership.end_date);
  const graceEnd = new Date(endDate);
  graceEnd.setDate(graceEnd.getDate() + gracePeriodDays);
  const now = new Date();

  if (now <= endDate) {
    return { inGracePeriod: false, expired: false, daysUntilExpiry: Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) };
  } else if (now <= graceEnd) {
    return { inGracePeriod: true, expired: false, daysInGrace: Math.ceil((now.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24)) };
  } else {
    return { inGracePeriod: false, expired: true };
  }
}
