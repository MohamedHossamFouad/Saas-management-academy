'use server'

import { createClient } from '@/utils/supabase/server'
import { getUserOrganization } from '@/utils/supabase/organization'
import { revalidatePath } from 'next/cache'

export async function getOrganizationSettings() {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const { data, error } = await supabase
    .from('organizations')
    .select('name, logo_url, language, currency, timezone')
    .eq('id', organizationId)
    .single();

  if (error) {
    console.error("Error fetching settings:", error);
    return null;
  }

  return data;
}

export async function updateOrganizationSettings(formData: FormData) {
  const { organizationId } = await getUserOrganization();
  const supabase = createClient();

  const settingsData = {
    name: formData.get('name') as string,
    logo_url: formData.get('logo_url') as string,
    language: formData.get('language') as string || 'en',
    currency: formData.get('currency') as string || 'USD',
    timezone: formData.get('timezone') as string || 'UTC',
  };

  const { error } = await supabase
    .from('organizations')
    .update(settingsData)
    .eq('id', organizationId);

  if (error) {
    console.error("Error updating settings:", error);
    return;
  }

  revalidatePath('/', 'layout');
}
