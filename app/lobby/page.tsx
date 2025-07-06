"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SearchSection } from "@/components/lobby/search-section";
import { RoomsTable } from "@/components/lobby/rooms-table";
import { CreateRoomDialog } from "@/components/lobby/create-room-dialog";
import { Navbar } from "@/components/layout/navbar";
import { useLobbyStore } from "@/stores/lobby-store";
import { useAuthStore } from "@/stores/auth-store";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ChessLobby() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const {
    rooms,
    loading,
    filters,
    fetchRooms,
    createRoom,
    joinRoom,
    setFilters,
    joinLobby,
    leaveLobby,
  } = useLobbyStore();

  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Join lobby and fetch initial data
    joinLobby();
    fetchRooms();

    // Cleanup on unmount
    return () => {
      leaveLobby();
    };
  }, [joinLobby, leaveLobby, fetchRooms]);

  const handleCreateRoom = async (roomData: {
    name: string;
    timeControl: string;
    gameType: "casual" | "ranked" | "tournament";
    maxPlayers: number;
  }) => {
    try {
      const roomId = await createRoom(roomData);
      setIsCreateDialogOpen(false);

      // Auto-join the created room
      if (roomId) {
        toast.success("Joining your room...");
        router.push(`/room/${roomId}`);
      }
    } catch (error) {
      // Error is handled in the store
    }
  };

  const handleJoinRoom = async (roomId: string, password?: string) => {
    try {
      const joinedRoomId = await joinRoom(roomId, password);
      if (joinedRoomId) {
        router.push(`/room/${joinedRoomId}`);
      }
    } catch (error) {
      // Error is already handled in the store with toast
    }
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.name
      .toLowerCase()
      .includes(filters.searchTerm.toLowerCase());
    const matchesGameType =
      filters.gameType === "all" || room.gameType === filters.gameType;
    const matchesStatus =
      filters.status === "all" || room.status === filters.status;
    return matchesSearch && matchesGameType && matchesStatus;
  });

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
        <div className="px-4 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-white tracking-light text-[32px] font-bold leading-tight">
                  Game Lobby
                </p>
                <p className="text-[#9eb7a8] text-sm font-normal leading-normal">
                  Browse available game rooms or create your own.
                </p>
              </div>
            </div>

            <SearchSection
              searchTerm={filters.searchTerm}
              onSearchChange={(value) => setFilters({ searchTerm: value })}
              gameTypeFilter={filters.gameType}
              onGameTypeChange={(value) => setFilters({ gameType: value })}
              playersFilter="all"
              onPlayersChange={() => {}}
              statusFilter={filters.status}
              onStatusChange={(value) => setFilters({ status: value })}
            />

            <RoomsTable
              rooms={filteredRooms.map((room) => ({
                id: room.id,
                name: room.name,
                players: room.players,
                maxPlayers: room.maxPlayers,
                status:
                  room.status === "waiting"
                    ? "open"
                    : room.status === "in-progress"
                    ? "in-progress"
                    : "closed",
                timeControl: room.timeControl,
                gameType: room.gameType,
              }))}
              onJoinRoom={handleJoinRoom}
            />

            <div className="flex px-4 py-3 justify-end">
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                disabled={!isAuthenticated}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#38e07b] text-[#111714] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#2bc464] disabled:opacity-50"
              >
                <span className="truncate">Create Room</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <CreateRoomDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateRoom={handleCreateRoom}
      />
    </div>
  );
}
