"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Player {
  id: string;
  name: string;
  rating: number;
  avatar?: string;
  color: "white" | "black";
  timeRemaining: number;
}

interface PlayerPanelProps {
  player1: Player;
  player2: Player | null;
  currentTurn: "white" | "black";
}

export function PlayerPanel({
  player1,
  player2,
  currentTurn,
}: PlayerPanelProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimeStyle = (seconds: number, isActive: boolean) => {
    if (seconds <= 30) {
      return isActive
        ? "bg-red-500 text-white animate-pulse"
        : "bg-red-600 text-white";
    }
    if (seconds <= 60) {
      return isActive ? "bg-orange-500 text-white" : "bg-orange-600 text-white";
    }
    return isActive ? "bg-[#38e07b] text-[#111714]" : "bg-[#29382f] text-white";
  };

  const PlayerCard = ({
    player,
    isActive,
  }: {
    player: Player;
    isActive: boolean;
  }) => (
    <div
      className={`bg-[#1c2620] rounded-lg p-4 border-2 transition-colors ${
        isActive ? "border-[#38e07b]" : "border-[#29382f]"
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={player.avatar} />
          <AvatarFallback className="bg-[#29382f] text-white">
            {player.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-white font-medium">{player.name}</h3>
            <Badge
              variant="secondary"
              className="bg-[#29382f] text-[#9eb7a8] text-xs"
            >
              {player.rating}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div
              className={`w-3 h-3 rounded-full ${
                player.color === "white"
                  ? "bg-white"
                  : "bg-gray-800 border border-gray-600"
              }`}
            />
            <span className="text-[#9eb7a8] text-sm capitalize">
              {player.color}
            </span>
          </div>
        </div>
      </div>
      <div
        className={`text-center p-3 rounded-lg ${getTimeStyle(
          player.timeRemaining,
          isActive
        )}`}
      >
        <div className="text-2xl font-bold font-mono">
          {formatTime(player.timeRemaining)}
        </div>
        <div className="text-xs opacity-75">
          {player.timeRemaining <= 30 && isActive
            ? "TIME!"
            : isActive
            ? "Your Turn"
            : "Waiting"}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <PlayerCard player={player1} isActive={currentTurn === player1.color} />
      {player2 ? (
        <PlayerCard player={player2} isActive={currentTurn === player2.color} />
      ) : (
        <div className="bg-[#1c2620] rounded-lg p-4 border-2 border-dashed border-[#29382f]">
          <div className="text-center text-[#9eb7a8] py-8">
            <div className="text-lg font-medium mb-2">
              Waiting for opponent...
            </div>
            <div className="text-sm">Share the room ID to invite a player</div>
          </div>
        </div>
      )}
    </div>
  );
}
