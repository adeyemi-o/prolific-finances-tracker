
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Session } from '@supabase/supabase-js';
import { supabase } from "@/lib/supabase-client";
import { toast } from "@/components/ui/use-toast";

type AuthUser = {
  id: string;
  email: string;
  role?: string;
};

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getUserRole = async (userId: string): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();

    if (error) throw error;
    return data?.role || "User";
  } catch (error) {
    console.error("Error fetching user role:", error);
    return "User";
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log("Starting auth initialization...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session?.user && mounted) {
          const role = await getUserRole(session.user.id);
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            role
          });
          console.log("Session restored successfully");
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Failed to restore session"
        });
      } finally {
        if (mounted) {
          setLoading(false);
          console.log("Auth initialization complete");
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, "Session:", !!session);
        
        if (!mounted) return;

        try {
          setLoading(true);
          if (session?.user) {
            console.log("Processing auth state change with session");
            const role = await getUserRole(session.user.id);
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              role
            });
          } else {
            console.log("Clearing user state");
            setUser(null);
          }
        } catch (error) {
          console.error("Error processing auth state change:", error);
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [initialized]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log("Attempting login...");
      
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
        console.log("Login successful");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      console.log("Attempting logout...");
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: error instanceof Error ? error.message : "An error occurred"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
