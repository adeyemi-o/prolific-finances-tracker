import { createClient } from '@supabase/supabase-js';

// Check for required environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl) {
  console.error('CRITICAL ERROR: VITE_SUPABASE_URL environment variable is missing');
}

if (!supabaseKey) {
  console.error('CRITICAL ERROR: VITE_SUPABASE_ANON_KEY environment variable is missing');
}

// Create a flag to check if Supabase is properly configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseKey);

// Initialize the Supabase client with empty strings as fallbacks to prevent runtime errors
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co', 
  supabaseKey || 'placeholder-key'
);
