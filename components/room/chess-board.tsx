"use client";

import { useEffect } from "react";
import { ChessBoard as ChessBoardComponent } from "@/components/chess/chess-board";
import { useGameStore } from "@/stores/game-store";

interface ChessBoardProps {
  onMove?: (move: any) => void;
  onGameEnd?: (result: string) => void;
  playerColor?: "white" | "black";
  disabled?: boolean;
}

export function ChessBoard({
  onMove,
  onGameEnd,
  playerColor = "white",
  disabled = false,
}: ChessBoardProps) {
  const { currentGame } = useGameStore();

  return (
    <ChessBoardComponent
      onMove={onMove}
      onGameEnd={onGameEnd}
      playerColor={playerColor}
      disabled={disabled}
      initialPosition={currentGame?.currentPosition}
    />
  );
}
