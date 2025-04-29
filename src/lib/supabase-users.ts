
import { supabase } from './supabase-client';

/**
 * Gets all users
 * @returns Array of users
 */
export const getUsers = async () => {
  const { data, error } = await supabase.auth.admin.listUsers();
  
  if (error) {
    throw error;
  }
  
  return data.users || [];
};

/**
 * Creates a new user
 * @param user User data including email, password, and role
 * @returns Created user data
 */
export const createUser = async (user: { email: string; password: string; role: string }) => {
  const { data, error } = await supabase.auth.admin.createUser({
    email: user.email,
    password: user.password,
    user_metadata: { role: user.role },
  });
  
  if (error) {
    throw error;
  }
  
  return data;
};

/**
 * Deletes a user
 * @param id User ID
 * @returns True if successful
 */
export const deleteUser = async (id: string) => {
  const { error } = await supabase.auth.admin.deleteUser(id);
  
  if (error) {
    throw error;
  }
  
  return true;
};
