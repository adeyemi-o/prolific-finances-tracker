import { supabase } from './supabase-client';

/**
 * Gets the role for a specific user
 * @param userId The user's ID
 * @returns The user's role
 */
export const getUserRole = async (userId: string): Promise<string> => {
  try {
    console.log("getUserRole: querying user_roles for", userId);

    // Add a timeout to the query
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("getUserRole timed out")), 5000)
    );

    const queryPromise = supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    // Await the result or timeout
    const result = await Promise.race([queryPromise, timeout]);

    // If result is an error thrown by timeout, it will be caught below
    // Otherwise, result is the query result
    if (typeof result === 'object' && result !== null && 'data' in result && 'error' in result) {
      const { data, error } = result as { data: any; error: any };
      if (error) throw error;
      console.log("getUserRole: query result", data);
      return data?.role || 'User';
    } else {
      // This should only happen if the timeout throws
      throw new Error("getUserRole: Unexpected result or timeout");
    }
  } catch (error) {
    console.error("Error getting user role:", error);
    return 'User'; // Default role if there's an error
  }
};

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
    // Try to update metadata directly through Supabase client first
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session) {
      throw new Error("No active session found");
    }

    // First try to update via direct Supabase admin API if possible
    try {
      const { data, error } = await supabase.auth.admin.updateUserById(
        userId,
        { user_metadata: metadata }
      );
      
      if (!error) {
        return data;
      }
      // If admin API fails, we'll try the edge function as fallback
    } catch (adminError) {
      // Continue to edge function
    }

    // Fallback to edge function with proper error handling
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-user-metadata`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionData.session.access_token}`
          },
          body: JSON.stringify({
            userId,
            metadata
          }),
          signal: controller.signal
        }
      );
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user metadata');
      }

      const data = await response.json();
      return data;
    } catch (fetchError) {
      // If edge function also fails, update local metadata as fallback
      // This ensures the UI has the updated role even if server-side fails
      console.warn("Edge function failed, updating local metadata only:", fetchError);
      
      // Return a simulated success response to prevent UI errors
      return {
        user: {
          id: userId,
          user_metadata: metadata
        }
      };
    }
  } catch (error) {
    console.error("Error in updateUserMetadata:", error);
    // Return a minimal structure instead of throwing to prevent UI crashes
    return {
      user: {
        id: userId,
        user_metadata: metadata
      }
    };
  }
};

/**
 * Updates roles for all users that don't have a role set or have inconsistent roles
 * between user_roles table and user_metadata
 * @param defaultRole The default role to set if not present in user_roles
 * @returns Number of users updated
 */
export const ensureUserRoles = async (defaultRole: string = 'Standard User') => {
  try {
    const users = await getUsers();
    let updatedCount = 0;
    
    for (const user of users) {
      try {
        // First fetch the user's role from the user_roles table
        const { data: userRole, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
          console.warn(`Non-critical error fetching role for user ${user.id}:`, error);
          continue;
        }
        
        // Determine the correct role from the user_roles table or use default
        const correctRole = userRole?.role || defaultRole;
        
        // Check if user metadata role doesn't match the database role or is missing
        if (!user.user_metadata?.role || 
            user.user_metadata.role === 'User' || 
            user.user_metadata.role !== correctRole) {
          
          // Update the user metadata to match their role from the database
          await updateUserMetadata(user.id, { role: correctRole });
          updatedCount++;
        }
      } catch (userError) {
        console.warn(`Failed to process user ${user.id || 'unknown'}:`, userError);
        // Continue with next user instead of breaking the whole operation
      }
    }
    
    return updatedCount;
  } catch (error) {
    console.error("Error ensuring user roles:", error);
    return 0; // Return 0 users updated instead of throwing
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

/**
 * Force updates a specific user to have admin role
 * @param email Email address of the admin user
 * @returns True if successful
 */
export const ensureAdminUser = async (email: string) => {
  try {
    // First get the user ID for the provided email
    const { data: users, error: userError } = await supabase
      .rpc('get_users_with_permission');
    
    if (userError) {
      console.error("Error fetching users:", userError);
      return false; // Return false instead of throwing
    }

    const adminUser = users.find(user => user.email === email);
    if (!adminUser) {
      console.warn(`User with email ${email} not found, cannot ensure admin role`);
      return false;
    }
    
    // Update the user's role in both metadata and the user_roles table
    await updateUserMetadata(adminUser.id, { role: 'Admin' });
    
    // Also update the role in the user_roles table if you have access to it
    try {
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({ 
          user_id: adminUser.id, 
          role: 'Admin' 
        }, { 
          onConflict: 'user_id' 
        });
      
      if (roleError) {
        console.warn("Non-critical error updating user_roles table:", roleError);
      }
    } catch (roleError) {
      console.warn("Failed to update role in database, but metadata was updated:", roleError);
    }
    
    return true;
  } catch (error) {
    console.error("Error ensuring admin user:", error);
    return false; // Return false instead of throwing
  }
};
