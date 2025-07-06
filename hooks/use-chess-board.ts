"use client"

import { useState, useCallback } from "react"
import { Chess } from "chess.js"

export function useChessBoard(initialFen?: string) {
  const [game] = useState(() => new Chess(initialFen))
  const [position, setPosition] = useState(game.fen())
  const [gameHistory, setGameHistory] = useState<string[]>([])
  const [currentPlayer, setCurrentPlayer] = useState<"w" | "b">("w")

  const makeMove = useCallback(
    (from: string, to: string, promotion?: string) => {
      try {
        const move = game.move({
          from,
          to,
          promotion: promotion || "q",
        })

        if (move) {
          setPosition(game.fen())
          setGameHistory(game.history())
          setCurrentPlayer(game.turn())
          return {
            success: true,
            move: move,
            isCheck: game.isCheck(),
            isCheckmate: game.isCheckmate(),
            isStalemate: game.isStalemate(),
            isDraw: game.isDraw(),
            isGameOver: game.isGameOver(),
          }
        }
        return { success: false, error: "Invalid move" }
      } catch (error) {
        return { success: false, error: "Invalid move" }
      }
    },
    [game],
  )

  const undoMove = useCallback(() => {
    const move = game.undo()
    if (move) {
      setPosition(game.fen())
      setGameHistory(game.history())
      setCurrentPlayer(game.turn())
      return true
    }
    return false
  }, [game])

  const resetGame = useCallback(() => {
    game.reset()
    setPosition(game.fen())
    setGameHistory([])
    setCurrentPlayer("w")
  }, [game])

  const loadPosition = useCallback(
    (fen: string) => {
      try {
        game.load(fen)
        setPosition(game.fen())
        setGameHistory(game.history())
        setCurrentPlayer(game.turn())
        return true
      } catch {
        return false
      }
    },
    [game],
  )

  const getPossibleMoves = useCallback(
    (square: string) => {
      return game.moves({ square, verbose: true })
    },
    [game],
  )

  return {
    position,
    gameHistory,
    currentPlayer,
    makeMove,
    undoMove,
    resetGame,
    loadPosition,
    getPossibleMoves,
    isCheck: game.isCheck(),
    isCheckmate: game.isCheckmate(),
    isStalemate: game.isStalemate(),
    isDraw: game.isDraw(),
    isGameOver: game.isGameOver(),
  }
}
