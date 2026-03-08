import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { academyName, adminName, email, password } = await request.json()

    if (!academyName || !email || !password) {
      return NextResponse.json(
        { error: 'Academy name, email, and password are required.' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters.' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: adminName || email,
        },
      },
    })

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: authError?.message || 'Failed to create user account.' },
        { status: 400 }
      )
    }

    // 2. Create organization
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .insert([{ name: academyName }])
      .select()
      .single()

    if (orgError || !orgData) {
      console.error('Failed to create organization:', orgError)
      return NextResponse.json(
        { error: 'Failed to create organization. Please try again.' },
        { status: 500 }
      )
    }

    // 3. Insert into organization_members with role = owner
    const { error: memberError } = await supabase
      .from('organization_members')
      .insert([{
        organization_id: orgData.id,
        user_id: authData.user.id,
        role: 'owner',
      }])

    if (memberError) {
      console.error('Failed to create org member:', memberError)
      return NextResponse.json(
        { error: 'Failed to setup permissions. Please contact support.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Account created successfully! Check your email to verify.' },
      { status: 200 }
    )
  } catch (err) {
    console.error('Signup error:', err)
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    )
  }
}
