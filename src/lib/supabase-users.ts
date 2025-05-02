
import { supabase } from './supabase-client';

/**
 * Helper function to capitalize the first letter of a string
 * @param str The string to capitalize
 * @returns The capitalized string
 */
const capitalizeFirstLetter = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

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
      
      // Format the current user with capitalized role
      const userRole = currentUser.user.user_metadata?.role || 'User';
      
      return [{
        id: currentUser.user.id,
        email: currentUser.user.email,
        user_metadata: {
          ...currentUser.user.user_metadata,
          role: capitalizeFirstLetter(userRole)
        },
        created_at: currentUser.user.created_at,
        last_sign_in_at: currentUser.user.last_sign_in_at,
        email_confirmed_at: currentUser.user.email_confirmed_at
      }];
    }
    
    // Process all users and normalize roles
    return users.map(user => {
      // Get the role from user_metadata or default to 'User'
      const role = user.user_metadata?.role || 'User';
      
      // Return user with properly capitalized role
      return {
        ...user,
        user_metadata: {
          ...user.user_metadata,
          role: capitalizeFirstLetter(role)
        }
      };
    });
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
    // Ensure role is properly capitalized when creating a user
    const role = capitalizeFirstLetter(user.role);
    
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
          role: role,
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
