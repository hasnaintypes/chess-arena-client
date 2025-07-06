import { create } from "zustand";
import { apiClient } from "@/lib/api";
import { socketManager } from "@/lib/socket";
import { toast } from "sonner";

interface GameRoom {
  id: string;
  name: string;
  host: {
    name: string;
    avatar?: string;
    rating: number;
  };
  players: number;
  maxPlayers: number;
  timeControl: string;
  gameType: "casual" | "ranked" | "tournament";
  status: "waiting" | "in-progress" | "finished";
  createdAt: Date;
  isPrivate: boolean;
}

interface LobbyState {
  rooms: GameRoom[];
  loading: boolean;
  filters: {
    searchTerm: string;
    gameType: string;
    status: string;
    timeControl: string;
  };
  pagination: {
    current: number;
    pages: number;
    total: number;
  };
}

interface LobbyActions {
  fetchRooms: () => Promise<void>;
  createRoom: (roomData: {
    name: string;
    timeControl: string;
    gameType: "casual" | "ranked" | "tournament";
    maxPlayers?: number;
    isPrivate?: boolean;
    password?: string;
  }) => Promise<string | undefined>;
  joinRoom: (roomId: string, password?: string) => Promise<string | undefined>;
  leaveRoom: (roomId: string) => Promise<void>;
  setFilters: (filters: Partial<LobbyState["filters"]>) => void;
  setLoading: (loading: boolean) => void;
  updateRoom: (roomId: string, updates: Partial<GameRoom>) => void;
  addRoom: (room: GameRoom) => void;
  removeRoom: (roomId: string) => void;
  joinLobby: () => void;
  leaveLobby: () => void;
}

export const useLobbyStore = create<LobbyState & LobbyActions>((set, get) => ({
  // State
  rooms: [],
  loading: false,
  filters: {
    searchTerm: "",
    gameType: "all",
    status: "all",
    timeControl: "all",
  },
  pagination: {
    current: 1,
    pages: 1,
    total: 0,
  },

  // Actions
  fetchRooms: async () => {
    try {
      set({ loading: true });
      const { filters } = get();

      const params: any = {};
      if (filters.gameType !== "all") params.gameType = filters.gameType;
      if (filters.status !== "all") params.status = filters.status;
      if (filters.timeControl !== "all")
        params.timeControl = filters.timeControl;

      const response = await apiClient.getRooms(params);

      if (response.success && response.data) {
        const { rooms, pagination } = response.data;
        set({
          rooms: rooms.map((room: any) => ({
            ...room,
            createdAt: new Date(room.createdAt),
          })),
          pagination,
          loading: false,
        });
      }
    } catch (error: any) {
      set({ loading: false });
      toast.error(error.message || "Failed to fetch rooms");
    }
  },

  createRoom: async (roomData) => {
    try {
      const response = await apiClient.createRoom(roomData);

      if (response.success && response.data) {
        // Room will be added via socket event
        toast.success("Room created successfully!");

        // Return the room ID so components can auto-join
        return response.data.room.roomId;
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create room");
      throw error;
    }
  },

  joinRoom: async (roomId, password) => {
    try {
      const response = await apiClient.joinRoom(roomId, { password });

      if (response.success) {
        toast.success("Joined room successfully!");
        // Return the roomId so components can handle navigation
        return roomId;
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to join room");
      throw error;
    }
  },

  leaveRoom: async (roomId) => {
    try {
      const response = await apiClient.leaveRoom(roomId);

      if (response.success) {
        toast.success("Left room successfully!");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to leave room");
      throw error;
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    // Refetch rooms with new filters
    get().fetchRooms();
  },

  setLoading: (loading) => set({ loading }),

  updateRoom: (roomId, updates) => {
    set((state) => ({
      rooms: state.rooms.map((room) =>
        room.id === roomId ? { ...room, ...updates } : room
      ),
    }));
  },

  addRoom: (room) => {
    set((state) => ({
      rooms: [room, ...state.rooms],
    }));
  },

  removeRoom: (roomId) => {
    set((state) => ({
      rooms: state.rooms.filter((room) => room.id !== roomId),
    }));
  },

  joinLobby: () => {
    const socket = socketManager.getSocket();
    if (socket) {
      socket.emit("lobby:join");

      // Set up socket listeners
      socket.on("lobby:rooms", (data) => {
        set({
          rooms: data.rooms.map((room: any) => ({
            ...room,
            createdAt: new Date(room.createdAt),
          })),
        });
      });

      socket.on("room:created", (room) => {
        get().addRoom({
          ...room,
          createdAt: new Date(room.createdAt),
        });
      });

      socket.on("room:updated", (update) => {
        get().updateRoom(update.id, update);
      });
    }
  },

  leaveLobby: () => {
    const socket = socketManager.getSocket();
    if (socket) {
      socket.emit("lobby:leave");

      // Remove socket listeners
      socket.off("lobby:rooms");
      socket.off("room:created");
      socket.off("room:updated");
    }
  },
}));
