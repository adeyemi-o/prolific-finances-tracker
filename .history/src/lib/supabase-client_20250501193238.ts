import { createClient } from '@supabase/supabase-js';

// Check for required environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Add debugging to check if variables are loading
console.log("Supabase URL defined:", !!supabaseUrl);
console.log("Supabase Key defined:", !!supabaseKey);
// Log the first few characters of the key for debugging (don't log the full key for security)
if (supabaseKey) {
  console.log("Key starts with:", supabaseKey.substring(0, 10) + "...");
}

// Validate environment variables
if (!supabaseUrl) {
  console.error('CRITICAL ERROR: VITE_SUPABASE_URL environment variable is missing');
}

if (!supabaseKey) {
  console.error('CRITICAL ERROR: VITE_SUPABASE_ANON_KEY environment variable is missing');
}

// Create a flag to check if Supabase is properly configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseKey);

// Initialize the Supabase client with specific options to improve reliability
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co', 
  supabaseKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false // Set to false to avoid potential URL parsing issues
    },
    realtime: {
      params: {
        eventsPerSecond: 1 // Reduce realtime events to avoid potential performance issues
      }
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'x-application-name': 'prolific-finances-tracker'
      }
    }
  }
);
