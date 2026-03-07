import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function getUserOrganization() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get the user's organization from organization_members
  const { data: memberData, error: memberError } = await supabase
    .from('organization_members')
    .select('organization_id, role, organizations(name)')
    .eq('user_id', user.id)
    .single();

  if (memberError || !memberData) {
    // If the user somehow has no organization, redirect or handle error
    console.error("User has no organization member record.");
    redirect('/login?message=No organization found');
  }

  return {
    user,
    organizationId: memberData.organization_id,
    role: memberData.role,
    organizationName: Array.isArray(memberData.organizations) ? memberData.organizations[0]?.name : (memberData.organizations as any)?.name
  };
}
