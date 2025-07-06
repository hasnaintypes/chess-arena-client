import { io, type Socket } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

class SocketManager {
  private socket: Socket | null = null;
  private token: string | null = null;

  connect(token: string) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.token = token;
    this.socket = io(SOCKET_URL, {
      auth: { token },
      withCredentials: true,
    });

    this.setupEventHandlers();
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }

  private setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("Connected to server");
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Disconnected from server:", reason);
    });

    this.socket.on("error", (error) => {
      console.error("Socket error:", error);

      // Handle different types of socket errors with friendly messages
      let friendlyMessage = "Connection error occurred";

      if (error && typeof error === "object") {
        if (error.message) {
          // Use the server's error message if available
          friendlyMessage = error.message;
        } else if (error.type === "TransportError") {
          friendlyMessage =
            "Connection lost. Please check your internet connection";
        } else if (error.type === "UnauthorizedError") {
          friendlyMessage = "Authentication failed. Please log in again";
        }
      }

      // Don't show error toast for certain expected errors
      const ignoredErrors = [
        "Failed to start game", // This is handled by race condition recovery
        "Transport close",
        "websocket error",
      ];

      const shouldShowError = !ignoredErrors.some((ignored) =>
        friendlyMessage.toLowerCase().includes(ignored.toLowerCase())
      );

      if (shouldShowError) {
        // Import toast dynamically to avoid circular dependencies
        import("sonner").then(({ toast }) => {
          toast.error(friendlyMessage);
        });
      }
    });

    this.socket.on("connect_error", (error) => {
      console.error("Connection error:", error);

      let friendlyMessage = "Failed to connect to server";

      if (error.message.includes("xhr poll error")) {
        friendlyMessage =
          "Connection failed. Please check your internet connection";
      } else if (error.message.includes("timeout")) {
        friendlyMessage = "Connection timeout. Please try again";
      } else if (error.message.includes("websocket error")) {
        friendlyMessage = "Connection error. Please refresh the page";
      }

      // Import toast dynamically to avoid circular dependencies
      import("sonner").then(({ toast }) => {
        toast.error(friendlyMessage);
      });
    });
  }

  // Lobby methods
  joinLobby() {
    this.socket?.emit("lobby:join");
  }

  leaveLobby() {
    this.socket?.emit("lobby:leave");
  }

  createRoom(roomData: any) {
    this.socket?.emit("room:create", roomData);
  }

  joinRoom(roomId: string, password?: string) {
    this.socket?.emit("room:join", { roomId, password });
  }

  // Game methods
  joinGame(gameId: string) {
    this.socket?.emit("game:join", { gameId });
  }

  makeMove(gameId: string, from: string, to: string, promotion?: string) {
    this.socket?.emit("game:move", { gameId, from, to, promotion });
  }

  resignGame(gameId: string) {
    this.socket?.emit("game:resign", { gameId });
  }

  offerDraw(gameId: string) {
    this.socket?.emit("game:draw-offer", { gameId });
  }

  // Timer methods
  sendTimeout(gameId: string, playerColor: string) {
    this.socket?.emit("game:timeout", { gameId, playerColor });
  }

  // Chat methods
  sendChatMessage(gameId: string, message: string) {
    this.socket?.emit("chat:message", { gameId, message });
  }

  // Event listeners
  onLobbyRooms(callback: (data: any) => void) {
    this.socket?.on("lobby:rooms", callback);
  }

  onRoomCreated(callback: (data: any) => void) {
    this.socket?.on("room:created", callback);
  }

  onRoomUpdated(callback: (data: any) => void) {
    this.socket?.on("room:updated", callback);
  }

  onGameStarted(callback: (data: any) => void) {
    this.socket?.on("game:started", callback);
  }

  onGameMove(callback: (data: any) => void) {
    this.socket?.on("game:move", callback);
  }

  onGameEnded(callback: (data: any) => void) {
    this.socket?.on("game:ended", callback);
  }

  onGameTimer(callback: (data: any) => void) {
    this.socket?.on("game:timer", callback);
  }

  onGameTimeout(callback: (data: any) => void) {
    this.socket?.on("game:timeout", callback);
  }

  onChatMessage(callback: (data: any) => void) {
    this.socket?.on("chat:message", callback);
  }

  // Remove listeners
  off(event: string, callback?: any) {
    this.socket?.off(event, callback);
  }
}

export const socketManager = new SocketManager();
