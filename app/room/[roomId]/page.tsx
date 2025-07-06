"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { PlayerPanel } from "@/components/room/player-panel";
import { ChessBoard } from "@/components/room/chess-board";
import { ChatPanel } from "@/components/room/chat-panel";
import { GameOverModal } from "@/components/room/game-over-modal";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/stores/game-store";
import { useChatStore } from "@/stores/chat-store";
import { useAuthStore } from "@/stores/auth-store";
import { socketManager } from "@/lib/socket";
import { toast } from "sonner";
import { LogOut, Flag, Handshake } from "lucide-react";

export default function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);
  const router = useRouter();
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState(false);

  // Store hooks
  const {
    currentGame,
    loading,
    playerColor,
    isSpectator,
    timers,
    lastMoveTime,
    joinGame,
    joinGameByRoom,
    joinGameSocket,
    leaveGame,
    makeMove,
    resignGame,
    offerDraw,
    updateTimers,
    setLastMoveTime,
    initializeTimers,
    setCurrentGame,
  } = useGameStore();

  const { joinGameChat, leaveGameChat } = useChatStore();
  const { isAuthenticated } = useAuthStore();

  // Join room and chat on mount
  useEffect(() => {
    if (roomId) {
      console.log("🔄 Joining room:", roomId);

      // Check auth state
      const authStore = useAuthStore.getState();
      console.log("🔍 Auth debug:", {
        isAuthenticated: authStore.isAuthenticated,
        user: authStore.user,
        token: authStore.token ? "present" : "missing",
      });

      // NOTE: We don't immediately try to joinGameByRoom here because:
      // 1. If this is a new room, no game exists yet (will be created when room fills)
      // 2. If game exists, we'll get it via the game:started event or room status
      // 3. This prevents unnecessary 404 errors when joining new rooms

      // Join the room via socket
      const socket = socketManager.getSocket();
      console.log("🔍 Socket debug:", {
        socketExists: !!socket,
        socketConnected: socket?.connected,
        socketId: socket?.id,
        roomId: roomId,
      });

      if (socket) {
        console.log("📡 Socket available, joining room via socket");

        // Ensure socket is connected before emitting
        if (!socket.connected) {
          console.log("⚠️ Socket not connected, waiting for connection...");
          socket.on("connect", () => {
            console.log("✅ Socket connected, now joining room");
            socket.emit("room:join", { roomId });
          });
        } else {
          console.log("✅ Socket already connected, joining room immediately");
          socket.emit("room:join", { roomId });
        }

        // Listen for when a game starts in this room
        socket.on("game:started", (data) => {
          console.log("Game started event received:", data);
          if (data.gameId && data.players && data.gameInfo) {
            // Set the game data directly from the socket event
            const gameData = {
              id: data.gameId,
              _id: data.gameId,
              roomId: roomId,
              players: data.players,
              gameInfo: {
                ...data.gameInfo,
                startTime: new Date(data.gameInfo.startTime),
              },
              moves: data.moves || [],
              currentPosition:
                data.currentPosition ||
                "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", // Starting position fallback
              spectators: data.spectators || [],
            };

            console.log("🎯 Setting game data:", gameData);

            // Set the game data in the store (this will also determine player color/spectator status)
            setCurrentGame(gameData);

            // Set up socket listeners for the game
            joinGameSocket(data.gameId);
          }
        });

        // Listen for room updates
        socket.on("room:player-joined", (data) => {
          console.log("👤 Player joined room:", data);
        });

        // Listen for room status updates that might indicate an existing game
        socket.on("room:updated", (data) => {
          console.log("🏠 Room updated:", data);
          if (data.status === "in-progress" && !currentGame) {
            console.log("🔄 Room is in-progress, trying to join existing game");
            joinGameByRoom(roomId);
          }
        });

        // Listen for errors
        socket.on("error", (error) => {
          console.error("❌ Socket error:", error);

          // Handle different types of errors with friendly messages
          let friendlyMessage = "Connection error occurred";

          if (error && typeof error === "object" && error.message) {
            // Check if this is a race condition error (game creation)
            if (error.message.includes("Failed to start game")) {
              // Don't show error for race condition - it's handled by recovery
              return;
            }

            // Use server's error message
            friendlyMessage = error.message;
          } else if (typeof error === "string") {
            friendlyMessage = error;
          }

          // Only show error toast for meaningful errors
          const ignoredErrors = [
            "Failed to start game",
            "Transport close",
            "websocket error",
          ];

          const shouldShowError = !ignoredErrors.some((ignored) =>
            friendlyMessage.toLowerCase().includes(ignored.toLowerCase())
          );

          if (shouldShowError) {
            toast.error(friendlyMessage);
          }
        });
      } else {
        console.log("❌ No socket available");
      }

      joinGameChat(roomId);
    }

    return () => {
      const socket = socketManager.getSocket();
      if (socket) {
        socket.off("game:started");
        socket.off("room:player-joined");
        socket.off("room:updated");
        socket.off("error");
        socket.emit("room:leave", { roomId });
      }
      leaveGame();
      leaveGameChat();
    };
  }, [roomId]); // Only depend on roomId since functions are stable from zustand store

  // Try to join existing game after a short delay (in case room is already in-progress)
  useEffect(() => {
    if (roomId) {
      const timeoutId = setTimeout(() => {
        console.log("🔄 Checking for existing game in room:", roomId);
        joinGameByRoom(roomId);
      }, 1000); // Give time for room socket to establish and receive status

      return () => clearTimeout(timeoutId);
    }
  }, [roomId]); // Remove joinGameByRoom from dependencies to prevent infinite loop

  // Initialize timers from game data
  useEffect(() => {
    if (currentGame?.gameInfo?.timeControl) {
      console.log("🕐 Initializing timers for game:", currentGame.id);

      // Only initialize timers if they haven't been set from the server yet
      const currentTimers = useGameStore.getState().timers;
      const defaultTime = 300000; // 5 minutes

      // Check if we have saved timer values from moves
      const lastMove = currentGame.moves[currentGame.moves.length - 1];
      if (
        lastMove &&
        (lastMove.white?.timeRemaining !== undefined ||
          lastMove.black?.timeRemaining !== undefined)
      ) {
        console.log("🕐 Using timer values from last move:", {
          white: lastMove.white?.timeRemaining,
          black: lastMove.black?.timeRemaining,
        });

        updateTimers({
          white: lastMove.white?.timeRemaining || defaultTime,
          black: lastMove.black?.timeRemaining || defaultTime,
        });
      } else if (
        currentTimers.white === defaultTime &&
        currentTimers.black === defaultTime
      ) {
        // Only initialize if timers are still at default values
        console.log(
          "🕐 Initializing timers from time control:",
          currentGame.gameInfo.timeControl
        );
        initializeTimers(currentGame.gameInfo.timeControl);
      } else {
        console.log("🕐 Keeping existing timer values:", currentTimers);
      }

      setLastMoveTime(new Date());
    }
  }, [currentGame?.id]); // Only depend on game ID to prevent reinitialization

  // Timer countdown effect
  useEffect(() => {
    if (
      !currentGame ||
      !currentGame.gameInfo ||
      currentGame.gameInfo.result !== "ongoing" ||
      !lastMoveTime
    ) {
      return;
    }

    const interval = setInterval(() => {
      // Use the correct turn calculation
      const currentTurn =
        currentGame.currentPosition.split(" ")[1] === "w" ? "white" : "black";

      // Get current timer values directly from the store
      const currentTimers = useGameStore.getState().timers;
      const newTimers = {
        ...currentTimers,
        [currentTurn]: Math.max(0, currentTimers[currentTurn] - 1000),
      };

      updateTimers(newTimers);

      // Check for timeout
      if (newTimers[currentTurn] <= 1000) {
        toast.error(`${currentTurn} ran out of time!`);

        // Emit timeout to server
        const socket = socketManager.getSocket();
        if (socket) {
          socket.emit("game:timeout", {
            gameId: currentGame.id,
            playerColor: currentTurn,
          });
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentGame, lastMoveTime]); // Remove timers and updateTimers from dependencies

  // Update timer when move is made
  useEffect(() => {
    if (currentGame?.moves.length) {
      setLastMoveTime(new Date());
    }
  }, [currentGame?.moves.length]); // Remove setLastMoveTime from dependencies

  // Handle game over modal
  useEffect(() => {
    if (currentGame?.gameInfo && currentGame.gameInfo.result !== "ongoing") {
      setIsGameOverModalOpen(true);
    }
  }, [currentGame?.gameInfo?.result]);

  const handleLeaveRoom = () => {
    leaveGame();
    router.push("/lobby");
  };

  const handleResign = async () => {
    try {
      await resignGame();
      toast.success("Game resigned");
    } catch (error) {
      // Error handled in store
    }
  };

  const handleOfferDraw = async () => {
    try {
      await offerDraw();
      toast.success("Draw offered");
    } catch (error) {
      // Error handled in store
    }
  };

  const handleMove = async (moveData: any) => {
    try {
      console.log("🎯 Move attempt:", moveData);
      console.log("🎯 Current game:", currentGame);
      console.log("🎯 Player color:", playerColor);
      console.log("🎯 Is spectator:", isSpectator);
      console.log("🎯 Is my turn:", isMyTurn);
      console.log("🎯 Game info result:", gameInfo?.result);

      const { from, to, promotion } = moveData;
      await makeMove(from, to, promotion);
    } catch (error) {
      console.error("❌ Move failed:", error);
      // Error handled in store
    }
  };

  const handleRematch = () => {
    setIsGameOverModalOpen(false);
    // TODO: Implement rematch functionality
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#111714]">
        <div className="text-white">Loading game...</div>
      </div>
    );
  }

  if (!currentGame) {
    return (
      <div className="flex flex-col min-h-screen bg-[#111714]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-xl font-bold mb-2">
              Waiting for game to start...
            </div>
            <div className="text-[#9eb7a8]">Room ID: {roomId}</div>
            <div className="text-sm text-[#9eb7a8] mt-4">
              Share this room ID with friends to invite them to play!
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { players, gameInfo } = currentGame;

  // Add defensive check for gameInfo
  if (!gameInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a2421] to-[#0f1611] flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold text-[#9eb7a8] mb-4">
            Game data incomplete...
          </div>
          <div className="text-[#9eb7a8]">Please refresh the page.</div>
        </div>
      </div>
    );
  }

  const isMyTurn =
    playerColor &&
    currentGame.currentPosition.split(" ")[1] ===
      (playerColor === "white" ? "w" : "b");
  const currentTurn =
    currentGame.currentPosition.split(" ")[1] === "w" ? "white" : "black";

  // Determine game result for current user
  let gameResult: "win" | "loss" | "draw" = "draw";
  if (gameInfo.result !== "ongoing" && playerColor) {
    if (gameInfo.result === "draw") {
      gameResult = "draw";
    } else if (
      (playerColor === "white" && gameInfo.result === "white-wins") ||
      (playerColor === "black" && gameInfo.result === "black-wins")
    ) {
      gameResult = "win";
    } else {
      gameResult = "loss";
    }
  }

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#111714] dark group/design-root overflow-x-hidden"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />
        <div className="border-b border-[#29382f] px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white text-xl font-bold">
                {currentGame.roomId || "Chess Game"}
              </h1>
              <p className="text-[#9eb7a8] text-sm">Room ID: {roomId}</p>
            </div>
            <div className="flex items-center gap-4">
              <div
                className={`text-sm font-medium ${
                  gameInfo.result === "ongoing"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {gameInfo.result === "ongoing"
                  ? `${
                      currentTurn === "white"
                        ? players.white.username
                        : players.black.username
                    }'s turn`
                  : "Game Over"}
              </div>

              {/* Game Actions */}
              {!isSpectator && gameInfo.result === "ongoing" && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleOfferDraw}
                    className="text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-black"
                  >
                    <Handshake className="w-4 h-4 mr-1" />
                    Draw
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResign}
                    className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                  >
                    <Flag className="w-4 h-4 mr-1" />
                    Resign
                  </Button>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleLeaveRoom}
                className="text-gray-400 border-gray-400 hover:bg-gray-400 hover:text-black"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Leave
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            {/* Left Panel - Player Info */}
            <div className="lg:col-span-3">
              <PlayerPanel
                player1={{
                  id: players.white.userId,
                  name: players.white.username,
                  rating: players.white.rating,
                  color: "white",
                  timeRemaining: Math.floor(timers.white / 1000), // Convert to seconds
                }}
                player2={{
                  id: players.black.userId,
                  name: players.black.username,
                  rating: players.black.rating,
                  color: "black",
                  timeRemaining: Math.floor(timers.black / 1000), // Convert to seconds
                }}
                currentTurn={currentTurn}
              />
            </div>

            {/* Center Panel - Chess Board */}
            <div className="lg:col-span-6">
              <ChessBoard
                onMove={handleMove}
                playerColor={playerColor || "white"}
                disabled={
                  isSpectator || !isMyTurn || gameInfo.result !== "ongoing"
                }
              />
              {/* Debug info */}
              <div className="mt-2 text-xs text-gray-500">
                <div>Player Color: {playerColor}</div>
                <div>Is Spectator: {isSpectator.toString()}</div>
                <div>Is My Turn: {isMyTurn?.toString() || "null"}</div>
                <div>Game Result: {gameInfo.result}</div>
                <div>Current Position: {currentGame?.currentPosition}</div>
                <div>
                  Turn from FEN: {currentGame?.currentPosition?.split(" ")[1]}
                </div>
                <div>Current Turn: {currentTurn}</div>
                <div>
                  Chess Board Disabled:{" "}
                  {(
                    isSpectator ||
                    !isMyTurn ||
                    gameInfo.result !== "ongoing"
                  ).toString()}
                </div>
                <div>
                  Socket Connected:{" "}
                  {socketManager.getSocket()?.connected?.toString() || "false"}
                </div>
                <div>
                  Disabled:{" "}
                  {(
                    isSpectator ||
                    !isMyTurn ||
                    gameInfo.result !== "ongoing"
                  ).toString()}
                </div>
                <div>White Timer: {Math.floor(timers.white / 1000)}s</div>
                <div>Black Timer: {Math.floor(timers.black / 1000)}s</div>
                <div>Timer Countdown For: {currentTurn}</div>
              </div>
            </div>

            {/* Right Panel - Chat & Move History */}
            <div className="lg:col-span-3">
              <ChatPanel roomId={roomId} />
            </div>
          </div>
        </div>
      </div>

      <GameOverModal
        open={isGameOverModalOpen}
        onOpenChange={setIsGameOverModalOpen}
        result={gameResult}
        winner={
          gameInfo.result === "white-wins"
            ? players.white.username
            : gameInfo.result === "black-wins"
            ? players.black.username
            : undefined
        }
        onRematch={handleRematch}
      />
    </div>
  );
}
