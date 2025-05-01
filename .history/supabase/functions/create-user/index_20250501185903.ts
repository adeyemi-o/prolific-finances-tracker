// Secure user creation function
// This edge function uses service role to create users
// Never expose your service role key in client-side code!

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.29.0';
import { corsHeaders } from '../_shared/cors.ts';

// Create a Supabase client with the service role key
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Allow only POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }

  try {
    // Parse the request body
    const { email, password, role, name } = await req.json();

    // Input validation
    if (!email || !password || !role) {
      return new Response(
        JSON.stringify({ error: 'Email, password, and role are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Create the user with admin API
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm the email
      user_metadata: { 
        role,
        name 
      }
    });

    if (error) {
      throw error;
    }

    // Create entry in user_roles table
    if (data.user) {
      const { error: roleError } = await supabaseAdmin
        .from('user_roles')
        .insert([{ user_id: data.user.id, role }]);

      if (roleError) {
        console.error('Error adding role to user_roles table:', roleError);
      }
    }

    return new Response(
      JSON.stringify({ 
        user: data.user,
        message: 'User created successfully' 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error) {
    console.error('Error creating user:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred while creating the user' 
      }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});