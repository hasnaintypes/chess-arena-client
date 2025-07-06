"use client"

import { useState, useCallback } from "react"
import type { GameRecord } from "@/types/chess"

export function useGameRecorder(gameId: string, roomId: string) {
  const [gameRecord, setGameRecord] = useState<GameRecord>({
    id: gameId,
    roomId: roomId,
    players: {
      white: { id: "1", name: "ChessMaster", rating: 1850 },
      black: { id: "2", name: "PawnPusher", rating: 1200 },
    },
    gameInfo: {
      timeControl: "5+3",
      gameType: "ranked",
      startTime: new Date(),
      result: "ongoing",
      termination: "ongoing",
    },
    moves: [],
    finalPosition: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", // Starting position
  })

  const recordMove = useCallback(
    (
      moveNumber: number,
      color: "white" | "black",
      moveData: {
        move: string
        san: string
        from: string
        to: string
        piece: string
        captured?: string
        promotion?: string
        check?: boolean
        checkmate?: boolean
      },
    ) => {
      setGameRecord((prev) => {
        const moves = [...prev.moves]
        let currentMove = moves.find((m) => m.moveNumber === moveNumber)

        if (!currentMove) {
          currentMove = {
            id: `move-${moveNumber}`,
            moveNumber,
          }
          moves.push(currentMove)
        }

        currentMove[color] = {
          ...moveData,
          timestamp: new Date(),
        }

        return {
          ...prev,
          moves: moves.sort((a, b) => a.moveNumber - b.moveNumber),
        }
      })
    },
    [],
  )

  const endGame = useCallback(
    (
      result: "white-wins" | "black-wins" | "draw",
      termination: "checkmate" | "resignation" | "timeout" | "draw-agreement" | "stalemate",
      finalPosition: string,
    ) => {
      setGameRecord((prev) => ({
        ...prev,
        gameInfo: {
          ...prev.gameInfo,
          endTime: new Date(),
          result,
          termination,
        },
        finalPosition,
      }))
    },
    [],
  )

  const saveGame = useCallback(() => {
    // Save to localStorage for demo purposes
    const savedGames = JSON.parse(localStorage.getItem("chess-games") || "[]")
    const updatedGames = [...savedGames, gameRecord]
    localStorage.setItem("chess-games", JSON.stringify(updatedGames))
    return gameRecord.id
  }, [gameRecord])

  return {
    gameRecord,
    recordMove,
    endGame,
    saveGame,
  }
}
