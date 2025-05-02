import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase, getCurrentUser, getSession } from "@/lib/supabase";
import { isSupabaseConfigured } from "@/lib/supabase-client";
import { toast } from "@/components/ui/use-toast";

type User = {
  id: string;
  email: string;
  role?: string;
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context with a more explicit undefined type assertion
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to capitalize role names
const capitalizeRole = (role: string): string => {
  // If the role is "admin", return "Admin"
  if (role.toLowerCase() === "admin") return "Admin";
  // For "standard user" or any multi-word role
  if (role.toLowerCase() === "user") return "Standard User";
  // For any other roles, capitalize first letter
  return role.charAt(0).toUpperCase() + role.slice(1);
};

// Fetch user role from user_roles table with error logging
const getUserRole = async (userId: string): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();
    if (error) {
      console.error("Error fetching user role from user_roles table:", error);
      return "Standard User";
    }
    if (!data) {
      console.warn("No user_roles entry found for user:", userId);
      return "Standard User";
    }
    // Standardize role capitalization
    return capitalizeRole(data.role || "User");
  } catch (err) {
    console.error("Exception in getUserRole:", err);
    return "Standard User";
  }
};

// Export the AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthContext: useEffect initializing");
    let mounted = true;
    
    const checkUser = async () => {
      if (!mounted) return;
      console.log("AuthContext: Starting to check user session");
      
      if (!isSupabaseConfigured) {
        console.error("AuthContext: Supabase is not properly configured");
        if (mounted) {
          toast({
            variant: "destructive",
            title: "Configuration Error",
            description: "The application is missing required configuration. Please contact support.",
          });
          setUser(null);
          setLoading(false);
        }
        return;
      }
      
      try {
        const session = await getSession();
        console.log("AuthContext: Session check result:", !!session);
        
        if (!mounted) return;

        if (session) {
          const currentUser = await getCurrentUser();
          console.log("AuthContext: Current user check result:", !!currentUser);
          
          if (!mounted) return;
          
          if (currentUser) {
            const role = await getUserRole(currentUser.id);
            console.log("AuthContext: User role:", role);
            if (mounted) {
              setUser({
                id: currentUser.id,
                email: currentUser.email || '',
                role
              });
            }
          } else {
            if (mounted) setUser(null);
          }
        } else {
          if (mounted) setUser(null);
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
        if (mounted) setUser(null);
      } finally {
        if (mounted) {
          console.log("AuthContext: Setting loading to false");
          setLoading(false);
        }
      }
    };

    checkUser();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        setLoading(true);
        try {
          console.log("Auth state changed:", event);
          if (event === "SIGNED_IN" && session) {
            const user = session.user;
            const role = await getUserRole(user.id);
            if (mounted) {
              setUser({
                id: user.id,
                email: user.email || '',
                role
              });
            }
          } else if (event === "SIGNED_OUT" || event === "USER_DELETED") {
            if (mounted) {
              setUser(null);
            }
          }
        } catch (error) {
          console.error("Error in auth state change handler:", error);
          if (mounted) {
            setUser(null);
          }
        } finally {
          if (mounted) {
            console.log("Setting loading to false after auth state change");
            setLoading(false);
          }
        }
      }
    );

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Double-check that Supabase is configured
      if (!isSupabaseConfigured) {
        throw new Error("Supabase configuration is missing. Please check your environment variables.");
      }
      
      console.log("Attempting login with Supabase...");
      
      // Simple direct login with Supabase - no extra wrappers
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Supabase login error:", error);
        throw error;
      }
      
      if (data?.user) {
        console.log("Login successful, processing user data...");
        // Get user role
        const role = await getUserRole(data.user.id);
        console.log("Setting user state with role:", role);
        
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          role
        });
        
        toast({
          title: "Login successful",
          description: "Welcome to Prolific Homecare Financial Tracker.",
        });
      } else {
        console.warn("Login returned success but no user data");
        setUser(null);
        throw new Error("Authentication succeeded but no user data was returned.");
      }
    } catch (error: unknown) {
      console.error("Login process failed:", error);
      
      // Provide more specific error messages based on the error type
      let errorMessage = "Invalid email or password.";
      
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch") || error.message.includes("network")) {
          errorMessage = "Connection to authentication server failed. Please check your internet connection and try again.";
        } else if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Invalid email or password. Please check your credentials and try again.";
        } else if (error.message.includes("rate limited")) {
          errorMessage = "Too many login attempts. Please try again later.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        variant: "destructive",
        title: "Login failed",
        description: errorMessage,
      });
      
      setUser(null);
    } finally {
      console.log("Login attempt finished, resetting loading state");
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      toast({
        title: "Logout successful",
        description: "You have been logged out.",
      });
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Create a separate function for useAuth hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
