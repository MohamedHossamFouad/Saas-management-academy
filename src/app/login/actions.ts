'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?message=Could not authenticate user')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError || !authData.user) {
    return redirect('/login?message=Could not authenticate user')
  }

  // Auto-provision an organization for the new user
  // This uses the service role or relies on RLS policies that let user insert into orgs.
  // Wait, RLS for 'organizations' has `WITH CHECK (true)` for insert.
  const { data: orgData, error: orgError } = await supabase
    .from('organizations')
    .insert([{ name: 'My Academy' }])
    .select()
    .single()

  if (orgError || !orgData) {
    console.error("Failed to create organization:", orgError)
    // In production, you'd want compensation logic or better error handling
    return redirect('/login?message=Failed to create organization')
  }

  // Create organization_members record
  // RLS for 'organization_members' lets user insert their own membership (`user_id = auth.uid()`)
  const { error: memberError } = await supabase
    .from('organization_members')
    .insert([{
      organization_id: orgData.id,
      user_id: authData.user.id,
      role: 'owner'
    }])

  if (memberError) {
    console.error("Failed to create org member:", memberError)
    return redirect('/login?message=Failed to setup permissions')
  }

  revalidatePath('/', 'layout')
  redirect('/login?message=Check email to continue sign in process')
}
