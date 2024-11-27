import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const { name, description, contribution_amount, contribution_frequency } = await request.json();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

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
        user_id: user.id,
        group_id: group.id,
        role: 'admin'
      });

    if (memberError) throw memberError;

    return NextResponse.json(group);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    // Get all groups the user is a member of
    const { data: groups, error: groupsError } = await supabase
      .from('group_members')
      .select(`
        group_id,
        role,
        chama_groups (*)
      `)
      .eq('user_id', user.id);

    if (groupsError) throw groupsError;

    return NextResponse.json(groups);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}