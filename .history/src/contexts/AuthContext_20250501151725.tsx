import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase, getCurrentUser, getSession } from "@/lib/supabase";
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
      return "User";
    }
    if (!data) {
      console.warn("No user_roles entry found for user:", userId);
      return "User";
    }
    return data.role || "User";
  } catch (err) {
    console.error("Exception in getUserRole:", err);
    return "User";
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const session = await getSession();
        if (session) {
          const currentUser = await getCurrentUser();
          if (currentUser) {
            const role = await getUserRole(currentUser.id);
            setUser({
              id: currentUser.id,
              email: currentUser.email || '',
              role
            });
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (event === "SIGNED_IN" && session) {
            const user = session.user;
            const role = await getUserRole(user.id);
            setUser({
              id: user.id,
              email: user.email || '',
              role
            });
          } else if (event === "SIGNED_OUT") {
            setUser(null);
          }
        } catch (error) {
          console.error("Error in auth state change handler:", error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      if (error) throw error;
      if (data.user) {
        const role = await getUserRole(data.user.id);
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
        setUser(null);
      }
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid email or password.",
      });
      setUser(null);
      throw error;
    } finally {
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
        description: error instanceof Error ? error.message : "An unknown error occurred.",
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
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
