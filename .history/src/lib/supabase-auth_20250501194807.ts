import { supabase } from './supabase-client';

/**
 * Signs in a user with email and password
 * @param email User's email
 * @param password User's password
 * @returns Authentication data
 */
export const signIn = async (email: string, password: string) => {
  try {
    console.log("supabase-auth: Attempting signIn...");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error("supabase-auth: Sign in error:", error);
      throw error;
    }
    
    console.log("supabase-auth: Sign in successful");
    return data;
  } catch (err) {
    console.error("supabase-auth: Exception during sign in:", err);
    throw err;
  }
};

/**
 * Signs up a new user
 * @param email User's email
 * @param password User's password
 * @param role User's role
 * @returns Authentication data
 */
export const signUp = async (email: string, password: string, role: string) => {
  try {
    console.log("supabase-auth: Attempting signUp...");
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
      console.error("supabase-auth: Sign up error:", error);
      throw error;
    }
    
    console.log("supabase-auth: Sign up successful");
    return data;
  } catch (err) {
    console.error("supabase-auth: Exception during sign up:", err);
    throw err;
  }
};

/**
 * Signs out the current user
 * @returns True if successful
 */
export const signOut = async () => {
  try {
    console.log("supabase-auth: Attempting signOut...");
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("supabase-auth: Sign out error:", error);
      throw error;
    }
    
    console.log("supabase-auth: Sign out successful");
    return true;
  } catch (err) {
    console.error("supabase-auth: Exception during sign out:", err);
    throw err;
  }
};

/**
 * Gets the current user
 * @returns Current user or null if not authenticated
 */
export const getCurrentUser = async () => {
  try {
    console.log("supabase-auth: Attempting to get current user...");
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error("supabase-auth: Get user error:", error);
      return null;
    }
    
    console.log("supabase-auth: Get user successful, user exists:", !!data.user);
    return data.user;
  } catch (err) {
    console.error("supabase-auth: Exception getting current user:", err);
    return null;
  }
};

/**
 * Gets the current session
 * @returns Current session or null if not authenticated
 */
export const getSession = async () => {
  try {
    console.log("supabase-auth: Attempting to get session...");
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("supabase-auth: Get session error:", error);
      return null;
    }
    
    console.log("supabase-auth: Get session successful, session exists:", !!data.session);
    return data.session;
  } catch (err) {
    console.error("supabase-auth: Exception getting session:", err);
    return null;
  }
};
