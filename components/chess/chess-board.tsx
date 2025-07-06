"use client";

import { useState, useCallback, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Button } from "@/components/ui/button";
import { Flag, Handshake, RotateCcw } from "lucide-react";
import { useChessBoard } from "@/hooks/use-chess-board";
import { useGameStore } from "@/stores/game-store";
import type { Square } from "chess.js";

interface ChessBoardProps {
  onMove?: (move: any) => void;
  onGameEnd?: (result: string) => void;
  playerColor?: "white" | "black";
  disabled?: boolean;
  initialPosition?: string;
}

export function ChessBoard({
  onMove,
  onGameEnd,
  playerColor = "white",
  disabled = false,
  initialPosition,
}: ChessBoardProps) {
  const {
    position,
    makeMove,
    undoMove,
    resetGame,
    getPossibleMoves,
    isGameOver,
    isCheckmate,
    isDraw,
    loadPosition,
  } = useChessBoard(initialPosition);
  const { currentGame } = useGameStore();
  const [moveFrom, setMoveFrom] = useState<Square | null>(null);
  const [moveTo, setMoveTo] = useState<Square | null>(null);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [optionSquares, setOptionSquares] = useState<Record<string, any>>({});

  // Sync board position with game state
  useEffect(() => {
    if (
      currentGame?.currentPosition &&
      currentGame.currentPosition !== position
    ) {
      loadPosition(currentGame.currentPosition);
    }
  }, [currentGame?.currentPosition, position, loadPosition]);

  const onSquareClick = useCallback(
    (square: Square) => {
      if (disabled) return;

      setMoveFrom(square);

      // Get possible moves for this square
      const moves = getPossibleMoves(square);
      const newSquares: Record<string, any> = {};

      moves.forEach((move: any) => {
        newSquares[move.to] = {
          background:
            "radial-gradient(circle, rgba(56, 224, 123, 0.3) 36%, transparent 40%)",
          borderRadius: "50%",
        };
      });

      newSquares[square] = {
        backgroundColor: "rgba(56, 224, 123, 0.4)",
      };

      setOptionSquares(newSquares);
    },
    [disabled, getPossibleMoves]
  );

  const onPieceDrop = useCallback(
    (sourceSquare: Square, targetSquare: Square) => {
      if (disabled) return false;

      const result = makeMove(sourceSquare, targetSquare);

      if (result.success) {
        setOptionSquares({});
        onMove?.(result.move);

        if (result.isGameOver) {
          let gameResult = "draw";
          if (result.isCheckmate) {
            gameResult =
              result.move.color === "w" ? "white-wins" : "black-wins";
          }
          onGameEnd?.(gameResult);
        }

        return true;
      }

      return false;
    },
    [disabled, makeMove, onMove, onGameEnd]
  );

  const handleResign = () => {
    const result = playerColor === "white" ? "black-wins" : "white-wins";
    onGameEnd?.(result);
  };

  const handleOfferDraw = () => {
    // In a real game, this would send a draw offer to the opponent
    onGameEnd?.("draw");
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#1c2620] rounded-lg p-4">
        <Chessboard
          position={position}
          onSquareClick={onSquareClick}
          onPieceDrop={onPieceDrop}
          customSquareStyles={optionSquares}
          boardOrientation={playerColor}
          arePiecesDraggable={!disabled}
          customBoardStyle={{
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
          customDarkSquareStyle={{ backgroundColor: "#29382f" }}
          customLightSquareStyle={{ backgroundColor: "#3d5245" }}
        />
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1 bg-[#29382f] border-[#3d5245] text-white hover:bg-[#3d5245]"
          onClick={handleResign}
          disabled={disabled || isGameOver}
        >
          <Flag className="h-4 w-4 mr-2" />
          Resign
        </Button>
        <Button
          variant="outline"
          className="flex-1 bg-[#29382f] border-[#3d5245] text-white hover:bg-[#3d5245]"
          onClick={handleOfferDraw}
          disabled={disabled || isGameOver}
        >
          <Handshake className="h-4 w-4 mr-2" />
          Offer Draw
        </Button>
        <Button
          variant="outline"
          className="bg-[#29382f] border-[#3d5245] text-white hover:bg-[#3d5245]"
          onClick={undoMove}
          disabled={disabled}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {isGameOver && (
        <div className="bg-[#1c2620] rounded-lg p-4 text-center">
          <div className="text-white font-medium mb-2">
            {isCheckmate ? "Checkmate!" : isDraw ? "Draw!" : "Game Over"}
          </div>
          <div className="text-[#9eb7a8] text-sm">
            {isCheckmate
              ? `${position.includes(" w ") ? "Black" : "White"} wins!`
              : "The game ended in a draw."}
          </div>
        </div>
      )}
    </div>
  );
}
