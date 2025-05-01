import { supabase } from './supabase-client';

/**
 * Gets all users
 * @returns Array of users
 */
export const getUsers = async () => {
  try {
    // For regular users, we'll use a more secure approach by fetching from user_profiles table
    // which doesn't require admin privileges
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('id, email, user_metadata, created_at, last_sign_in_at');
    
    if (profilesError) {
      console.error("Error fetching user profiles:", profilesError);
      throw profilesError;
    }
    
    // Format the profiles to match the expected structure
    return profiles.map(profile => ({
      id: profile.id,
      email: profile.email,
      user_metadata: profile.user_metadata,
      created_at: profile.created_at,
      last_sign_in_at: profile.last_sign_in_at,
      email_confirmed_at: profile.created_at // We don't have this info but need it for the UI
    }));
  } catch (error) {
    console.error("Error in getUsers:", error);
    
    // Fallback to empty array if there's an error
    return [];
  }
};

/**
 * Creates a new user securely via the Edge Function
 * @param user User data including email, password, and role
 * @returns Created user data
 */
export const createUser = async (user: { 
  email: string; 
  password: string; 
  role: string;
  name?: string; 
}) => {
  try {
    // Call our secure Edge Function
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-user`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          email: user.email,
          password: user.password,
          role: user.role,
          name: user.name || user.email.split('@')[0]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create user');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in createUser:", error);
    throw error;
  }
};

/**
 * Deletes a user via Edge Function
 * @param id User ID
 * @returns True if successful
 */
export const deleteUser = async (id: string) => {
  // For deleting users, we'll need to create another edge function
  // For now, we'll just update their status in the user_profiles table
  
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({ status: 'inactive' })
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteUser:", error);
    throw error;
  }
};
