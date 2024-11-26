import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase-service';

export async function POST(request) {
  try {
    const { name, phone, password } = await request.json();

    // Create auth user with service role client
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: `${phone}@mchama.com`,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: name,
        phone_number: phone,
      }
    });

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { error: 'Auth failed', details: authError.message },
        { status: 400 }
      );
    }

    if (!authData?.user?.id) {
      return NextResponse.json(
        { error: 'No user ID returned from auth' },
        { status: 400 }
      );
    }

    // Create user profile with service role client
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .insert([
        {
          id: authData.user.id,
          full_name: name,
          phone_number: phone,
          created_at: new Date().toISOString(),
        },
      ])
      .select('*')
      .single();

    if (userError) {
      console.error('Database error:', userError);
      // Clean up auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: 'Failed to create user profile', details: userError.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Registration successful',
        user: userData 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        error: 'Registration failed', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}