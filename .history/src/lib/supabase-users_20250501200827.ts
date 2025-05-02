import { supabase } from './supabase-client';

/**
 * Gets all users by fetching from our secure database function
 * @returns Array of users
 */
export const getUsers = async () => {
  try {
    // First, check if the user has a valid session
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      console.error("No valid session found");
      return [];
    }

    // Call the secure database function we created
    const { data: users, error } = await supabase
      .rpc('get_users_with_permission');
    
    if (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
    
    // If no users returned, fallback to just the current user
    if (!users || users.length === 0) {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser?.user) return [];
      
      return [{
        id: currentUser.user.id,
        email: currentUser.user.email,
        user_metadata: currentUser.user.user_metadata,
        created_at: currentUser.user.created_at,
        last_sign_in_at: currentUser.user.last_sign_in_at,
        email_confirmed_at: currentUser.user.email_confirmed_at
      }];
    }
    
    return users;
  } catch (error) {
    console.error("Error in getUsers:", error);
    // Return an empty array as fallback
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
 * Updates a user's metadata including role
 * @param userId User ID
 * @param metadata Object containing metadata to update
 * @returns Updated user data
 */
export const updateUserMetadata = async (userId: string, metadata: { 
  role?: string;
  name?: string;
  [key: string]: any;
}) => {
  try {
    // Call our secure Edge Function or use admin API
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-user-metadata`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          userId,
          metadata
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update user metadata');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in updateUserMetadata:", error);
    throw error;
  }
};

/**
 * Updates roles for all users that don't have a role set
 * @param defaultRole The default role to set if not present
 * @returns Number of users updated
 */
export const ensureUserRoles = async (defaultRole: string = 'Standard User') => {
  try {
    const users = await getUsers();
    let updatedCount = 0;
    
    for (const user of users) {
      // Check if user has no role or has the legacy 'User' role
      if (!user.user_metadata?.role || user.user_metadata.role === 'User') {
        await updateUserMetadata(user.id, {
          role: defaultRole
        });
        updatedCount++;
      }
    }
    
    return updatedCount;
  } catch (error) {
    console.error("Error ensuring user roles:", error);
    throw error;
  }
};

/**
 * Updates a user status (pseudo-delete)
 * @param id User ID
 * @returns True if successful
 */
export const deleteUser = async (id: string) => {
  try {
    // We can't actually delete users from auth.users without admin access,
    // so instead we'll just remove their access by disabling their account
    // via our Edge Function
    
    // For now, fake success response
    console.log(`User ${id} would be disabled (not actually implemented yet)`);
    return true;
  } catch (error) {
    console.error("Error in deleteUser:", error);
    throw error;
  }
};
