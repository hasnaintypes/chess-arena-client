"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { apiClient } from "@/lib/api";
import { socketManager } from "@/lib/socket";
import { toast } from "sonner";

interface User {
  id: string;
  username: string;
  email: string;
  rating: {
    bullet: number;
    blitz: number;
    rapid: number;
    classical: number;
  };
  country?: string;
  title?: string;
  gamesPlayed: any;
  gamesWon: any;
  gamesLost: any;
  gamesDrawn: any;
  winRate: number;
  isVerified: boolean;
  preferences: any;
  lastActive: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await apiClient.getMe();
      if (response.success && response.data) {
        setUser(response.data.user);
        // Connect socket with user token
        const token =
          localStorage.getItem("token") ||
          document.cookie.split("token=")[1]?.split(";")[0];
        if (token) {
          socketManager.connect(token);
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login({ email, password });
      if (response.success && response.data) {
        setUser(response.data.user);
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          socketManager.connect(response.data.token);
        }
        toast.success("Logged in successfully!");
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed");
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await apiClient.register(userData);
      if (response.success && response.data) {
        setUser(response.data.user);
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          socketManager.connect(response.data.token);
        }
        toast.success("Account created successfully!");
      }
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
      setUser(null);
      localStorage.removeItem("token");
      socketManager.disconnect();
      toast.success("Logged out successfully!");
    } catch (error: any) {
      toast.error(error.message || "Logout failed");
    }
  };

  const refreshUser = async () => {
    try {
      const response = await apiClient.getMe();
      if (response.success && response.data) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshUser }}
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
