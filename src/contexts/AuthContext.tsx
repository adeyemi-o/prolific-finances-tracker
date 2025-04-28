
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
            setUser({
              id: currentUser.id,
              email: currentUser.email || '',
              role: currentUser.user_metadata?.role || 'User'
            });
          }
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          const user = session.user;
          setUser({
            id: user.id,
            email: user.email || '',
            role: user.user_metadata?.role || 'User'
          });
        } else if (event === "SIGNED_OUT") {
          setUser(null);
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
      const { user: authUser } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (authUser) {
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          role: authUser.user_metadata?.role || 'User'
        });
        
        toast({
          title: "Login successful",
          description: "Welcome to Prolific Homecare Financial Tracker.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Invalid email or password.",
      });
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
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: error.message,
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
