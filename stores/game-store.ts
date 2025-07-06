import { create } from "zustand";
import { apiClient } from "@/lib/api";
import { socketManager } from "@/lib/socket";
import { toast } from "sonner";
import { useAuthStore } from "./auth-store";

interface Player {
  userId: string;
  username: string;
  rating: number;
  ratingChange?: number;
}

interface GameInfo {
  timeControl: string;
  gameType: "casual" | "ranked" | "tournament";
  startTime: Date;
  endTime?: Date;
  result: "white-wins" | "black-wins" | "draw" | "ongoing";
  termination:
    | "checkmate"
    | "resignation"
    | "timeout"
    | "draw-agreement"
    | "stalemate"
    | "ongoing";
}

interface Move {
  _id: string;
  moveNumber: number;
  white?: {
    move: string;
    san: string;
    from: string;
    to: string;
    piece: string;
    captured?: string;
    promotion?: string;
    check?: boolean;
    checkmate?: boolean;
    timestamp: Date;
    timeRemaining?: number;
  };
  black?: {
    move: string;
    san: string;
    from: string;
    to: string;
    piece: string;
    captured?: string;
    promotion?: string;
    check?: boolean;
    checkmate?: boolean;
    timestamp: Date;
    timeRemaining?: number;
  };
}

export interface Game {
  id: string;
  _id?: string;
  roomId: string;
  players: {
    white: Player;
    black: Player;
  };
  gameInfo: GameInfo;
  moves: Move[];
  currentPosition: string;
  spectators: Array<{
    userId: string;
    username: string;
  }>;
}

interface GameState {
  currentGame: Game | null;
  gameHistory: Game[];
  loading: boolean;
  playerColor: "white" | "black" | null;
  isSpectator: boolean;
  timers: {
    white: number;
    black: number;
  };
  lastMoveTime: Date | null;
  gameStats: {
    totalGames: number;
    wins: number;
    losses: number;
    draws: number;
    winRate: number;
  } | null;
}

interface GameActions {
  joinGame: (gameId: string) => Promise<void>;
  joinGameByRoom: (roomId: string) => Promise<void>;
  joinGameSocket: (gameId: string) => void;
  leaveGame: () => void;
  makeMove: (from: string, to: string, promotion?: string) => Promise<void>;
  resignGame: () => Promise<void>;
  offerDraw: () => Promise<void>;
  fetchGameHistory: (params?: any) => Promise<void>;
  fetchGame: (gameId: string) => Promise<void>;
  fetchUserStats: (username: string) => Promise<void>;
  setCurrentGame: (game: Game | null) => void;
  updateGameState: (updates: Partial<Game>) => void;
  addMove: (move: any) => void;
  endGame: (result: string, termination: string) => void;
  updateTimers: (timers: { white: number; black: number }) => void;
  setLastMoveTime: (time: Date) => void;
  initializeTimers: (timeControl: string) => void;
}

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  // State
  currentGame: null,
  gameHistory: [],
  loading: false,
  playerColor: null,
  isSpectator: false,
  timers: {
    white: 300000, // 5 minutes in milliseconds
    black: 300000,
  },
  lastMoveTime: null,
  gameStats: null,

  // Actions
  joinGame: async (gameId: string) => {
    try {
      set({ loading: true });

      // Fetch game data
      const response = await apiClient.getGame(gameId);
      if (response.success && response.data) {
        const game = response.data as Game;

        // Defensive check for gameInfo
        if (!game.gameInfo) {
          console.warn("Game found but gameInfo is missing:", game);
          set({ loading: false });
          toast.error("Game data is incomplete");
          return;
        }

        set({
          currentGame: {
            ...game,
            gameInfo: {
              ...game.gameInfo,
              startTime: game.gameInfo.startTime
                ? new Date(game.gameInfo.startTime)
                : new Date(),
              endTime: game.gameInfo.endTime
                ? new Date(game.gameInfo.endTime)
                : undefined,
            },
          },
          loading: false,
        });

        // Join via socket
        const socket = socketManager.getSocket();
        if (socket) {
          socket.emit("game:join", { gameId });

          // Set up game event listeners
          socket.on("game:state", (data) => {
            set({ currentGame: data.game });
          });

          socket.on("game:move", (data) => {
            get().addMove(data.move);
            get().updateGameState({
              currentPosition: data.gameState.fen,
              moves: data.gameState.moves || get().currentGame?.moves || [],
            });
          });

          socket.on("game:timer", (data) => {
            // Handle timer updates from server
            set({
              timers: data.timers,
              lastMoveTime: new Date(),
            });
          });

          socket.on("game:timeout", (data) => {
            get().endGame(
              data.playerColor === "white" ? "black-wins" : "white-wins",
              "timeout"
            );
            toast.error(`${data.playerColor} ran out of time!`);
          });

          socket.on("game:ended", (data) => {
            get().endGame(data.result, data.termination);
          });
        }
      }
    } catch (error: any) {
      set({ loading: false });
      toast.error(error.message || "Failed to join game");
    }
  },

  joinGameByRoom: async (roomId: string) => {
    try {
      set({ loading: true });

      // Fetch game data by room ID
      const response = await apiClient.getGameByRoom(roomId);
      if (response.success && response.data) {
        // The server returns the game nested in a game property
        const gameData = (response.data as any).game || response.data;
        const game = gameData as Game;
        const gameId = game.id || game._id;

        if (gameId && gameId.toString().trim() !== "") {
          // Defensive check for gameInfo before proceeding
          console.log("Game object:", game);
          console.log("Game gameInfo:", game.gameInfo);

          if (!game.gameInfo || typeof game.gameInfo !== "object") {
            console.warn(
              "Game found but gameInfo is missing or invalid:",
              game
            );
            set({ loading: false });
            toast.error("Game data is incomplete");
            return;
          }

          // Set the game data directly instead of calling joinGame again
          set({
            currentGame: {
              ...game,
              gameInfo: {
                ...game.gameInfo,
                startTime: game.gameInfo.startTime
                  ? new Date(game.gameInfo.startTime)
                  : new Date(),
                endTime: game.gameInfo.endTime
                  ? new Date(game.gameInfo.endTime)
                  : undefined,
              },
            },
            loading: false,
          });

          // Set up socket listeners for the game
          get().joinGameSocket(gameId.toString());
        } else {
          console.warn("Game found but no valid ID", game);
          set({ loading: false });
        }
      } else {
        set({ loading: false });
      }
    } catch (error: any) {
      set({ loading: false });
      // Don't show error for "not found" - this is expected when game hasn't started yet
      if (
        !error.message.includes("not found") &&
        !error.message.includes("requested resource was not found")
      ) {
        console.error("Failed to join game by room:", error);
        toast.error(error.message || "Failed to join game");
      } else {
        // Game doesn't exist yet - this is normal, just log it
        console.log(
          `No game found for room ${roomId} yet - waiting for game to start`
        );
      }
    }
  },

  leaveGame: () => {
    const socket = socketManager.getSocket();
    if (socket) {
      socket.off("game:state");
      socket.off("game:move");
      socket.off("game:timer");
      socket.off("game:timeout");
      socket.off("game:ended");
    }
    set({
      currentGame: null,
      playerColor: null,
      isSpectator: false,
      timers: { white: 300000, black: 300000 },
      lastMoveTime: null,
    });
  },

  makeMove: async (from: string, to: string, promotion?: string) => {
    try {
      const { currentGame } = get();
      if (!currentGame) {
        console.error("❌ No current game found for move");
        return;
      }

      const socket = socketManager.getSocket();
      if (!socket) {
        console.error("❌ No socket connection found");
        toast.error("No connection to server");
        return;
      }

      if (!socket.connected) {
        console.error("❌ Socket is not connected");
        toast.error("Connection to server lost");
        return;
      }

      console.log("🎯 Making move:", {
        from,
        to,
        promotion,
        gameId: currentGame.id,
      });

      socket.emit("game:move", {
        gameId: currentGame.id,
        from,
        to,
        promotion,
      });

      console.log("📡 Move emitted to server");
    } catch (error: any) {
      console.error("❌ Move failed:", error);
      toast.error(error.message || "Failed to make move");
    }
  },

  resignGame: async () => {
    try {
      const { currentGame } = get();
      if (!currentGame) return;

      const socket = socketManager.getSocket();
      if (socket) {
        socket.emit("game:resign", { gameId: currentGame.id });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to resign");
    }
  },

  offerDraw: async () => {
    try {
      const { currentGame } = get();
      if (!currentGame) return;

      const socket = socketManager.getSocket();
      if (socket) {
        socket.emit("game:draw-offer", { gameId: currentGame.id });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to offer draw");
    }
  },

  fetchGameHistory: async (params = {}) => {
    try {
      set({ loading: true });
      const response = await apiClient.getGameHistory(params);

      if (response.success && response.data) {
        set({
          gameHistory: (response.data as { games: Game[] }).games
            .filter((game) => game.gameInfo) // Filter out games without gameInfo first
            .map((game) => ({
              ...game,
              gameInfo: {
                ...game.gameInfo,
                startTime: new Date(game.gameInfo.startTime),
                endTime: game.gameInfo.endTime
                  ? new Date(game.gameInfo.endTime)
                  : undefined,
              },
            })),
          loading: false,
        });
      }
    } catch (error: any) {
      set({ loading: false });
      toast.error(error.message || "Failed to fetch game history");
    }
  },

  fetchGame: async (gameId: string): Promise<void> => {
    try {
      const response = await apiClient.getGame(gameId);
      if (response.success && response.data) {
        return response.data as any;
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch game");
    }
  },

  fetchUserStats: async (username: string) => {
    try {
      const response = await apiClient.getUserStats(username);
      if (response.success && response.data) {
        set({ gameStats: response.data as GameState["gameStats"] });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch user stats");
    }
  },

  setCurrentGame: (game) => {
    if (game) {
      // Determine user's role in the game
      const authStore = useAuthStore.getState();
      const user = authStore.user;
      let userColor = null;
      let userIsSpectator = true;

      console.log("🔍 Determining user role:", {
        userId: user?.id,
        whiteUserId: game.players.white.userId,
        blackUserId: game.players.black.userId,
        gameId: game.id || game._id,
      });

      if (user) {
        // Check both id formats for compatibility
        const userId = user.id;
        const whiteUserId = game.players.white.userId;
        const blackUserId = game.players.black.userId;

        if (whiteUserId === userId || whiteUserId === user._id) {
          userColor = "white";
          userIsSpectator = false;
        } else if (blackUserId === userId || blackUserId === user._id) {
          userColor = "black";
          userIsSpectator = false;
        }
      }

      // Ensure game has proper structure
      const gameData = {
        ...game,
        id: game.id || game._id || "",
        gameInfo: {
          ...game.gameInfo,
          startTime: game.gameInfo.startTime
            ? new Date(game.gameInfo.startTime)
            : new Date(),
          endTime: game.gameInfo.endTime
            ? new Date(game.gameInfo.endTime)
            : undefined,
        },
        moves: game.moves || [],
        spectators: game.spectators || [],
      };

      set({
        currentGame: gameData,
        playerColor: userColor as "white" | "black" | null,
        isSpectator: userIsSpectator,
      });
    } else {
      set({ currentGame: null, playerColor: null, isSpectator: false });
    }
  },

  updateGameState: (updates) => {
    set((state) => ({
      currentGame: state.currentGame
        ? { ...state.currentGame, ...updates }
        : null,
    }));
  },

  addMove: (move) => {
    set((state) => {
      if (!state.currentGame) return state;

      return {
        currentGame: {
          ...state.currentGame,
          moves: [...state.currentGame.moves, move],
        },
      };
    });
  },

  endGame: (result, termination) => {
    set((state) => {
      if (!state.currentGame) return state;

      return {
        currentGame: {
          ...state.currentGame,
          gameInfo: {
            ...state.currentGame.gameInfo,
            result: result as any,
            termination: termination as any,
            endTime: new Date(),
          },
        },
      };
    });
  },

  updateTimers: (timers) => {
    set({ timers });
  },

  setLastMoveTime: (time) => {
    set({ lastMoveTime: time });
  },

  initializeTimers: (timeControl) => {
    const [minutes, increment] = timeControl.split("+").map(Number);
    const timeInMs = minutes * 60 * 1000;

    set({
      timers: { white: timeInMs, black: timeInMs },
      lastMoveTime: new Date(),
    });
  },

  joinGameSocket: (gameId: string) => {
    // Join via socket and set up event listeners
    const socket = socketManager.getSocket();
    if (socket) {
      console.log("🔌 Setting up socket listeners for game:", gameId);

      // Clear existing listeners to prevent duplicates
      socket.off("game:state");
      socket.off("game:move");
      socket.off("game:timer");
      socket.off("game:timeout");
      socket.off("game:ended");

      socket.emit("game:join", { gameId });

      // Set up game event listeners
      socket.on("game:state", (data) => {
        console.log("📡 Game state received:", data);
        if (data.game) {
          // Use setCurrentGame to properly determine player color and spectator status
          get().setCurrentGame(data.game);

          // Update timers if provided
          if (data.game.timers) {
            get().updateTimers(data.game.timers);
          }
        }
      });

      socket.on("game:move", (data) => {
        console.log("📡 Game move received:", data);
        if (data.move && data.gameState) {
          // Update game state
          get().updateGameState({
            currentPosition: data.gameState.fen,
            moves: data.gameState.moves || get().currentGame?.moves || [],
          });

          // Update timers if provided
          if (data.gameState.timeRemaining) {
            get().updateTimers(data.gameState.timeRemaining);
            get().setLastMoveTime(new Date());
          }
        }
      });

      socket.on("game:timer", (data) => {
        console.log("📡 Timer update received:", data);
        if (data.timers) {
          get().updateTimers(data.timers);
          get().setLastMoveTime(new Date());
        }
      });

      socket.on("game:timeout", (data) => {
        console.log("📡 Game timeout received:", data);
        get().endGame(
          data.playerColor === "white" ? "black-wins" : "white-wins",
          "timeout"
        );
        toast.error(`${data.playerColor} ran out of time!`);
      });

      socket.on("game:ended", (data) => {
        console.log("📡 Game ended received:", data);
        get().endGame(data.result, data.termination);
      });
    }
  },
}));
