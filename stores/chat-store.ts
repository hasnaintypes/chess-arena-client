import { create } from "zustand"
import { socketManager } from "@/lib/socket"
import { toast } from "sonner"
import { ReactNode } from "react"

interface ChatMessage {
  user: ReactNode
  id: string
  userId: string
  username: string
  message: string
  timestamp: Date
  avatar?: string
  rating?: number
  type: "message" | "system"
}

interface ChatState {
  messages: ChatMessage[]
  currentChatId: string | null
  isConnected: boolean
}

interface ChatActions {
  sendMessage: (gameId: string, message: string) => Promise<void>
  addMessage: (message: ChatMessage) => void
  clearMessages: () => void
  joinGameChat: (gameId: string) => void
  leaveGameChat: () => void
}

export const useChatStore = create<ChatState & ChatActions>((set, get) => ({
  // State
  messages: [],
  currentChatId: null,
  isConnected: false,

  // Actions
  sendMessage: async (gameId: string, message: string) => {
    const socket = socketManager.getSocket()
    if (socket) {
      socket.emit("chat:message", {
        gameId,
        message,
        timestamp: new Date(),
      })
    }
  },

  addMessage: (message: ChatMessage) => {
    set((state) => ({
      messages: [...state.messages, message],
    }))
  },

  clearMessages: () => {
    set({ messages: [] })
  },

  joinGameChat: (gameId: string) => {
    const socket = socketManager.getSocket()
    if (socket) {
      socket.emit("chat:join", { gameId })
      set({ currentChatId: gameId, isConnected: true })

      // Listen for messages
      socket.on("chat:message", (data) => {
        get().addMessage({
          id: data.id || Date.now().toString(),
          userId: data.userId,
          username: data.username,
          message: data.message,
          timestamp: new Date(data.timestamp),
          type: data.type || "message",
          avatar: data.avatar,
          rating: data.rating,
          user: undefined
        })
      })

      // Listen for system messages (like moves)
      socket.on("chat:system", (data) => {
        get().addMessage({
          id: data.id || Date.now().toString(),
          userId: "system",
          username: "System",
          message: data.message,
          timestamp: new Date(data.timestamp),
          type: "system",
          user: undefined
        })
      })
    }
  },

  leaveGameChat: () => {
    const socket = socketManager.getSocket()
    if (socket) {
      socket.emit("chat:leave")
      socket.off("chat:message")
      socket.off("chat:system")
      set({ currentChatId: null, isConnected: false })
    }
  },
}))
