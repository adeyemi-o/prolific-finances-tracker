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

// Initialize the Supabase client with empty strings as fallbacks to prevent runtime errors
// Add custom fetch options with longer timeout
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co', 
  supabaseKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    global: {
      fetch: (...args) => {
        // Create a custom fetch with a longer timeout (30 seconds)
        return new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new Error('Supabase request timed out after 30 seconds'));
          }, 30000);
          
          fetch(...args)
            .then(response => {
              clearTimeout(timeoutId);
              resolve(response);
            })
            .catch(error => {
              clearTimeout(timeoutId);
              reject(error);
            });
        });
      }
    }
  }
);
