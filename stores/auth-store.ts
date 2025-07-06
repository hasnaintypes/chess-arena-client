import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient } from "@/lib/api";
import { socketManager } from "@/lib/socket";
import { toast } from "sonner";

interface User {
  _id: string;
  avatar: string | Blob | undefined;
  id: string;
  username: string;
  email: string;
  rating: {
    bullet: number;
    blitz: number;
    rapid: number;
    classical: number;
  };
  peakRating: {
    bullet: number;
    blitz: number;
    rapid: number;
    classical: number;
  };
  country?: string;
  title?: string;
  gamesPlayed: {
    bullet: number;
    blitz: number;
    rapid: number;
    classical: number;
    total: number;
  };
  gamesWon: {
    bullet: number;
    blitz: number;
    rapid: number;
    classical: number;
    total: number;
  };
  gamesLost: {
    bullet: number;
    blitz: number;
    rapid: number;
    classical: number;
    total: number;
  };
  gamesDrawn: {
    bullet: number;
    blitz: number;
    rapid: number;
    classical: number;
    total: number;
  };
  winRate: number;
  isVerified: boolean;
  preferences: {
    soundEnabled: boolean;
    autoQueen: boolean;
    showCoordinates: boolean;
    highlightMoves: boolean;
  };
  lastActive: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  token: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
    country?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  setLoading: (loading: boolean) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      loading: true,
      isAuthenticated: false,
      token: null,

      // Actions
      login: async (email: string, password: string) => {
        try {
          set({ loading: true });
          const response = await apiClient.login({ email, password });

          if (response.success && response.data) {
            const { user, token } = response.data;
            set({
              user,
              token,
              isAuthenticated: true,
              loading: false,
            });

            // Connect socket
            if (token) {
              socketManager.connect(token);
            }

            toast.success("Logged in successfully!");
          }
        } catch (error: any) {
          set({ loading: false });
          toast.error(error.message || "Login failed");
          throw error;
        }
      },

      register: async (userData) => {
        try {
          set({ loading: true });
          const response = await apiClient.register(userData);

          if (response.success && response.data) {
            const { user, token } = response.data;
            set({
              user,
              token,
              isAuthenticated: true,
              loading: false,
            });

            // Connect socket
            if (token) {
              socketManager.connect(token);
            }

            toast.success("Account created successfully!");
          }
        } catch (error: any) {
          set({ loading: false });
          toast.error(error.message || "Registration failed");
          throw error;
        }
      },

      logout: async () => {
        try {
          await apiClient.logout();
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });

          // Disconnect socket
          socketManager.disconnect();
          toast.success("Logged out successfully!");
        } catch (error: any) {
          toast.error(error.message || "Logout failed");
        }
      },

      refreshUser: async () => {
        try {
          const response = await apiClient.getMe();
          if (response.success && response.data) {
            set({ user: response.data.user });
          }
        } catch (error) {
          console.error("Failed to refresh user:", error);
          // If refresh fails, user might be logged out
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },

      updateProfile: async (data) => {
        try {
          const response = await apiClient.updateProfile(data);
          if (response.success && response.data) {
            set({ user: response.data.user });
            toast.success("Profile updated successfully!");
          }
        } catch (error: any) {
          toast.error(error.message || "Failed to update profile");
          throw error;
        }
      },

      setLoading: (loading) => set({ loading }),

      checkAuth: async () => {
        try {
          set({ loading: true });
          const response = await apiClient.getMe();

          if (response.success && response.data) {
            const { user } = response.data;
            set({
              user,
              isAuthenticated: true,
              loading: false,
            });

            // Connect socket if we have a token
            const { token } = get();
            if (token) {
              socketManager.connect(token);
            }
          } else {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              loading: false,
            });
          }
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
