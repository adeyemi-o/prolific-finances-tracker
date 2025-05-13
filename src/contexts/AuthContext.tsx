import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Session } from '@supabase/supabase-js';
import { supabase } from "@/lib/supabase-client";
import { getUserRole } from "@/lib/supabase-users";

interface User {
  id: string;
  email: string;
  role: string;
  raw_user_meta_data?: { display_name?: string };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log("Calling getSession...");
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (mounted) {
          console.log("Session received:", session);
          await handleSession(session);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          console.log("Setting loading to false (init)");
          setLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        console.log("Auth state changed:", event, session);
        await handleSession(session);
      } catch (error) {
        console.error("Auth state change error:", error);
        setUser(null);
      } finally {
        if (mounted) {
          console.log("Setting loading to false (auth change)");
          setLoading(false);
        }
      }
    });

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSession = async (session: Session | null) => {
    if (session?.user) {
      try {
        let role = 'User'; // Default role
        try {
          console.log("Getting user role for:", session.user.id);
          role = await getUserRole(session.user.id);
          console.log("Role received:", role);
        } catch (roleError) {
          console.warn("Could not get user role, using default:", roleError);
        }
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          role,
          raw_user_meta_data: session.user.user_metadata || session.user.raw_user_meta_data || {},
        });
      } catch (error) {
        console.error("Error handling session:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      if (data.user && data.session) {
        await handleSession(data.session);
      }
    } catch (error) {
      console.error("Login error:", error);
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
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}