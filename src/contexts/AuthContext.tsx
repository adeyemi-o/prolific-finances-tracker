
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
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
    const setupAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const role = await getUserRole(session.user.id);
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            role
          });
        }
      } catch (error) {
        console.error("Error in setupAuth:", error);
      } finally {
        setLoading(false);
      }
    };

    setupAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, "User:", session?.user?.id);
        
        if (event === "SIGNED_IN" && session?.user) {
          const role = await getUserRole(session.user.id);
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            role
          });
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
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
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
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
