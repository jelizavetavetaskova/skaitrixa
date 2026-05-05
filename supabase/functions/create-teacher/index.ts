// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts"
import {createClient} from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', {headers: corsHeaders})
  const {email, name, surname, school_id} = await req.json();
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({error: "Unauthorized"}), {status: 401, headers: corsHeaders});
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    global: {headers: {Authorization: authHeader}}
  })

  const {data: {user}} = await userClient.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({error: "Invalid token"}), {status: 401, headers: corsHeaders});
  }

  const {data: profile} = await userClient
      .from("users")
      .select("role")
      .eq("user_id", user.id)
      .single();

  if (profile?.role !== "admin") {
    return new Response(JSON.stringify({error: "Forbidden"}), {status: 403, headers: corsHeaders});
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  const {data: invited, error: inviteError} = await adminClient.auth.admin.inviteUserByEmail(email);

  if (inviteError) {
    return new Response(JSON.stringify({error: inviteError.message}), {status: 400, headers: corsHeaders});
  }

  const {error: insertError} = await adminClient
      .from("users")
      .insert({
        user_id: invited.user.id,
        email,
        name,
        surname,
        role: 'teacher',
        school_id
      })

  if (insertError) {
    return new Response(JSON.stringify({error: insertError.message}), {status: 400, headers: corsHeaders});
  }

  return new Response(JSON.stringify({success: true, user_id: invited.user.id}), {headers: {...corsHeaders, 'Content-Type': 'application/json'}})
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/create-teacher' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
