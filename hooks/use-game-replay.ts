"use client"

import { useState, useCallback, useEffect } from "react"
import type { GameRecord } from "@/types/chess"

export function useGameReplay(gameRecord: GameRecord) {
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1) // -1 means starting position
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1) // 1x, 2x, 0.5x etc.

  const totalMoves = gameRecord.moves.reduce((total, move) => {
    return total + (move.white ? 1 : 0) + (move.black ? 1 : 0)
  }, 0)

  const getCurrentPosition = useCallback(() => {
    if (currentMoveIndex === -1) {
      return "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" // Starting position
    }

    // In a real implementation, this would calculate the board position
    // based on all moves up to currentMoveIndex
    return gameRecord.finalPosition
  }, [currentMoveIndex, gameRecord.finalPosition])

  const getCurrentMoveInfo = useCallback(() => {
    if (currentMoveIndex === -1) return null

    let moveCount = 0
    for (const move of gameRecord.moves) {
      if (move.white) {
        if (moveCount === currentMoveIndex) {
          return { move: move.white, color: "white" as const, moveNumber: move.moveNumber }
        }
        moveCount++
      }
      if (move.black) {
        if (moveCount === currentMoveIndex) {
          return { move: move.black, color: "black" as const, moveNumber: move.moveNumber }
        }
        moveCount++
      }
    }
    return null
  }, [currentMoveIndex, gameRecord.moves])

  const goToMove = useCallback(
    (moveIndex: number) => {
      setCurrentMoveIndex(Math.max(-1, Math.min(totalMoves - 1, moveIndex)))
    },
    [totalMoves],
  )

  const nextMove = useCallback(() => {
    if (currentMoveIndex < totalMoves - 1) {
      setCurrentMoveIndex((prev) => prev + 1)
    }
  }, [currentMoveIndex, totalMoves])

  const previousMove = useCallback(() => {
    if (currentMoveIndex > -1) {
      setCurrentMoveIndex((prev) => prev - 1)
    }
  }, [currentMoveIndex])

  const goToStart = useCallback(() => {
    setCurrentMoveIndex(-1)
  }, [])

  const goToEnd = useCallback(() => {
    setCurrentMoveIndex(totalMoves - 1)
  }, [totalMoves])

  const togglePlayback = useCallback(() => {
    setIsPlaying((prev) => !prev)
  }, [])

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || currentMoveIndex >= totalMoves - 1) {
      setIsPlaying(false)
      return
    }

    const interval = setInterval(() => {
      setCurrentMoveIndex((prev) => {
        if (prev >= totalMoves - 1) {
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, 1000 / playbackSpeed)

    return () => clearInterval(interval)
  }, [isPlaying, currentMoveIndex, totalMoves, playbackSpeed])

  return {
    currentMoveIndex,
    totalMoves,
    isPlaying,
    playbackSpeed,
    getCurrentPosition,
    getCurrentMoveInfo,
    goToMove,
    nextMove,
    previousMove,
    goToStart,
    goToEnd,
    togglePlayback,
    setPlaybackSpeed,
  }
}
