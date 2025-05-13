// @deno-types="supabase edge function"
// Required env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Environment variables for service role key and project URL
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  try {
    // Only allow GET
    if (req.method !== 'GET') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    // Parse query params
    const url = new URL(req.url);
    const params = url.searchParams;
    const start_date = params.get('start_date');
    const end_date = params.get('end_date');
    const display_name = params.get('display_name');
    const event_type = params.get('event_type');
    const resource = params.get('resource');
    const outcome = params.get('outcome');
    const sort = params.get('sort') || 'timestamp:desc';
    const page = parseInt(params.get('page') || '1', 10);
    const page_size = Math.min(parseInt(params.get('page_size') || '20', 10), 100);

    // Get user from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401 });
    }
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(jwt);
    if (userError || !user) {
      return new Response('Unauthorized', { status: 401 });
    }
    // Check admin role
    const role = user.user_metadata?.role;
    if (role !== 'Admin') {
      return new Response('Forbidden', { status: 403 });
    }

    // Build query
    let query = supabase.from('audit_logs').select('*', { count: 'exact' });
    if (start_date) query = query.gte('timestamp', start_date);
    if (end_date) query = query.lte('timestamp', end_date);
    if (display_name) query = query.ilike('display_name', `%${display_name}%`);
    if (event_type) query = query.eq('event_type', event_type);
    if (resource) query = query.eq('resource', resource);
    if (outcome) query = query.eq('outcome', outcome);

    // Sorting
    const [sortField, sortDir] = sort.split(':');
    query = query.order(sortField, { ascending: sortDir === 'asc' });

    // Pagination
    const from = (page - 1) * page_size;
    const to = from + page_size - 1;
    query = query.range(from, to);

    // Execute query
    const { data, count, error } = await query;
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(
      JSON.stringify({
        data,
        total: count,
        page,
        page_size,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 });
  }
}); 