import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/crm/lib/api";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  companyId?: string;
  companyName?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isLoading: boolean;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = async (): Promise<boolean> => {
    try {
      // Set credentials to true for cookie transmission
      api.defaults.withCredentials = true;
      const res = await api.get("/auth/me");
      if (res.data.success) {
        const userData = res.data.user;
        setUser(userData);
        // If we got a token back, store it
        if (res.data.token) {
          setToken(res.data.token);
          sessionStorage.setItem("jobmela_crm_token", res.data.token);
        }
        sessionStorage.setItem("jobmela_crm_user", JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      // CRM session is tab-bound using sessionStorage
      const storedToken = sessionStorage.getItem("jobmela_crm_token");
      const storedUser = sessionStorage.getItem("jobmela_crm_user");

      if (storedToken) {
        api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        api.defaults.withCredentials = true;
        setToken(storedToken);
      }

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (err) {}
      }

      if (storedToken) {
        // Validate token against backend and retrieve fresh user permissions
        const success = await refreshSession();
        if (!success) {
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
    sessionStorage.setItem("jobmela_crm_token", newToken);
    sessionStorage.setItem("jobmela_crm_user", JSON.stringify(userData));
    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    api.defaults.withCredentials = true;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem("jobmela_crm_token");
    sessionStorage.removeItem("jobmela_crm_user");
    delete api.defaults.headers.common["Authorization"];
    
    // Clear cookies
    api.post("/auth/logout").catch(() => {});
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, logout, isLoading, refreshSession }}>
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
