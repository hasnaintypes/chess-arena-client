import { create } from "zustand"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"

export interface LeaderboardEntry {
  ratingChange(ratingChange: any): import("react").ReactNode
  rank: number
  username: string
  country?: string
  title?: string
  avatar?: string
  currentRating: number
  totalGames: number
  wins: number
  losses: number
  draws: number
  winRate: number
  lastActive: Date
  createdAt: Date
}

interface LeaderboardState {
  leaderboard: LeaderboardEntry[]
  loading: boolean
  filters: {
    timeControl: string
    timeframe: string
  }
  pagination: {
    current: number
    pages: number
    total: number
  }
  userPosition: {
    user: any
    nearbyUsers: LeaderboardEntry[]
  } | null
}

interface LeaderboardActions {
  fetchLeaderboard: (params?: any) => Promise<void>
  fetchUserPosition: (username: string, timeControl?: string) => Promise<void>
  setFilters: (filters: Partial<LeaderboardState["filters"]>) => void
  setLoading: (loading: boolean) => void
}

export const useLeaderboardStore = create<LeaderboardState & LeaderboardActions>((set, get) => ({
  // State
  leaderboard: [],
  loading: false,
  filters: {
    timeControl: "blitz",
    timeframe: "all-time",
  },
  pagination: {
    current: 1,
    pages: 1,
    total: 0,
  },
  userPosition: null,

  // Actions
  fetchLeaderboard: async (params = {}) => {
    try {
      set({ loading: true })
      const { filters } = get()

      const queryParams = {
        ...filters,
        ...params,
      }

      const response = await apiClient.getLeaderboard(queryParams)

      if (response.success && response.data) {
        const data = response.data as { leaderboard: any[]; pagination: any }
        const { leaderboard, pagination } = data
        set({
          leaderboard: leaderboard.map((entry: any) => ({
            ...entry,
            lastActive: new Date(entry.lastActive),
            createdAt: new Date(entry.createdAt),
          })),
          pagination,
          loading: false,
        })
      }
    } catch (error: any) {
      set({ loading: false })
      toast.error(error.message || "Failed to fetch leaderboard")
    }
  },

  fetchUserPosition: async (username: string, timeControl = "blitz") => {
    try {
      const response = await apiClient.getUserPosition(username, timeControl)

      if (response.success && response.data) {
        set({ userPosition: response.data as { user: any; nearbyUsers: LeaderboardEntry[] } })
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch user position")
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }))
    // Refetch leaderboard with new filters
    get().fetchLeaderboard()
  },

  setLoading: (loading) => set({ loading }),
}))
