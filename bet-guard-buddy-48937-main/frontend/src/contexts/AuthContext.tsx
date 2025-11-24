import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authApi } from "@/lib/api";

interface User {
  id: string;
  email?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  adminSignIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify token on mount
    const verifyToken = async () => {
      try {
        const { data, error } = await authApi.verify();
        if (error || !data?.user) {
          setUser(null);
        } else {
          setUser(data.user);
        }
      } catch (error) {
        console.warn("Token verification error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await authApi.signIn(email, password);
    if (error) {
      return { error: { message: error } };
    }
    if (data?.user) {
      setUser(data.user);
    }
    return { error: null };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await authApi.signUp(email, password);
    if (error) {
      return { error: { message: error } };
    }
    if (data?.user) {
      setUser(data.user);
    }
    return { error: null };
  };

  const adminSignIn = async (email: string, password: string) => {
    const { data, error } = await authApi.adminSignIn(email, password);
    if (error) {
      return { error: { message: error } };
    }
    if (data?.user) {
      setUser(data.user);
    }
    return { error: null };
  };

  const signOut = async () => {
    await authApi.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, adminSignIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

