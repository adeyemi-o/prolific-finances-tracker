
import { supabase } from './supabase-client';

/**
 * Signs in a user with email and password
 * @param email User's email
 * @param password User's password
 * @returns Authentication data
 */
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    throw error;
  }
  
  return data;
};

/**
 * Signs up a new user
 * @param email User's email
 * @param password User's password
 * @param role User's role
 * @returns Authentication data
 */
export const signUp = async (email: string, password: string, role: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
      },
    },
  });
  
  if (error) {
    throw error;
  }
  
  return data;
};

/**
 * Signs out the current user
 * @returns True if successful
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw error;
  }
  
  return true;
};

/**
 * Gets the current user
 * @returns Current user or null if not authenticated
 */
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  
  if (error) {
    return null;
  }
  
  return data.user;
};

/**
 * Gets the current session
 * @returns Current session or null if not authenticated
 */
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    return null;
  }
  
  return data.session;
};
