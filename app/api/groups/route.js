import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    // Verify session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all groups the user is a member of
    const { data: groups, error: groupsError } = await supabase
      .from('group_members')
      .select(`
        group_id,
        role,
        chama_groups (*)
      `)
      .eq('user_id', session.user.id);

    if (groupsError) throw groupsError;

    return NextResponse.json(groups);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    // Verify session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, contribution_amount, contribution_frequency } = await request.json();
    
    // Create the group
    const { data: group, error: groupError } = await supabase
      .from('chama_groups')
      .insert({
        name,
        description,
        contribution_amount,
        contribution_frequency
      })
      .select()
      .single();
    
    if (groupError) throw groupError;

    // Add the creator as a member with 'admin' role
    const { error: memberError } = await supabase
      .from('group_members')
      .insert({
        user_id: session.user.id,
        group_id: group.id,
        role: 'admin'
      });

    if (memberError) throw memberError;

    return NextResponse.json(group);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}