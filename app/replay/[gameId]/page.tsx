"use client"

import { useState, useEffect } from "react"
import { GameReplayViewer } from "@/components/replay/game-replay-viewer"
import type { GameRecord } from "@/types/chess"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"

// Mock game data for demonstration
const createMockGame = (gameId: string): GameRecord => ({
  id: gameId,
  roomId: "room-123",
  players: {
    white: { id: "1", name: "ChessMaster", rating: 1850 },
    black: { id: "2", name: "PawnPusher", rating: 1200 },
  },
  gameInfo: {
    timeControl: "5+3",
    gameType: "ranked",
    startTime: new Date(Date.now() - 900000), // 15 minutes ago
    endTime: new Date(Date.now() - 300000), // 5 minutes ago
    result: "white-wins",
    termination: "checkmate",
  },
  moves: [
    {
      id: "move-1",
      moveNumber: 1,
      white: {
        move: "e2e4",
        san: "e4",
        from: "e2",
        to: "e4",
        piece: "p",
        timestamp: new Date(Date.now() - 890000),
      },
      black: {
        move: "e7e5",
        san: "e5",
        from: "e7",
        to: "e5",
        piece: "p",
        timestamp: new Date(Date.now() - 880000),
      },
    },
    {
      id: "move-2",
      moveNumber: 2,
      white: {
        move: "g1f3",
        san: "Nf3",
        from: "g1",
        to: "f3",
        piece: "n",
        timestamp: new Date(Date.now() - 870000),
      },
      black: {
        move: "b8c6",
        san: "Nc6",
        from: "b8",
        to: "c6",
        piece: "n",
        timestamp: new Date(Date.now() - 860000),
      },
    },
    {
      id: "move-3",
      moveNumber: 3,
      white: {
        move: "f1b5",
        san: "Bb5",
        from: "f1",
        to: "b5",
        piece: "b",
        timestamp: new Date(Date.now() - 850000),
      },
      black: {
        move: "a7a6",
        san: "a6",
        from: "a7",
        to: "a6",
        piece: "p",
        timestamp: new Date(Date.now() - 840000),
      },
    },
    {
      id: "move-4",
      moveNumber: 4,
      white: {
        move: "b5a4",
        san: "Ba4",
        from: "b5",
        to: "a4",
        piece: "b",
        timestamp: new Date(Date.now() - 830000),
      },
      black: {
        move: "g8f6",
        san: "Nf6",
        from: "g8",
        to: "f6",
        piece: "n",
        timestamp: new Date(Date.now() - 820000),
      },
    },
    {
      id: "move-5",
      moveNumber: 5,
      white: {
        move: "e1g1",
        san: "O-O",
        from: "e1",
        to: "g1",
        piece: "k",
        timestamp: new Date(Date.now() - 810000),
      },
      black: {
        move: "f8e7",
        san: "Be7",
        from: "f8",
        to: "e7",
        piece: "b",
        timestamp: new Date(Date.now() - 800000),
      },
    },
  ],
  finalPosition: "r1bqk2r/1pppbppp/p1n2n2/4p3/B3P3/5N2/PPPP1PPP/RNBQ1RK1 w kq - 4 6",
})

export default function GameReplayPage({ params }: { params: { gameId: string } }) {
  const [gameRecord, setGameRecord] = useState<GameRecord | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch from an API or database
    // For now, we'll try to load from localStorage or use mock data
    const savedGames = JSON.parse(localStorage.getItem("chess-games") || "[]")
    const foundGame = savedGames.find((game: GameRecord) => game.id === params.gameId)

    if (foundGame) {
      setGameRecord(foundGame)
    } else {
      // Use mock data for demonstration
      setGameRecord(createMockGame(params.gameId))
    }

    setLoading(false)
  }, [params.gameId])

  if (loading) {
    return (
      <div
        className="relative flex size-full min-h-screen flex-col bg-[#111714] dark group/design-root overflow-x-hidden"
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <div className="flex items-center justify-center h-screen">
          <div className="text-white text-lg">Loading game replay...</div>
        </div>
      </div>
    )
  }

  if (!gameRecord) {
    return (
      <div
        className="relative flex size-full min-h-screen flex-col bg-[#111714] dark group/design-root overflow-x-hidden"
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="text-white text-lg mb-4">Game not found</div>
            <Link href="/replay">
              <Button className="bg-[#38e07b] text-[#111714] hover:bg-[#2bc464]">Back to Saved Games</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#111714] dark group/design-root overflow-x-hidden"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />
        <div className="border-b border-[#29382f] px-4 md:px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/replay">
              <Button variant="ghost" size="sm" className="text-[#9eb7a8] hover:text-white hover:bg-[#29382f] p-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-white text-xl font-bold">Game Replay</h1>
          </div>
        </div>

        <div className="px-4 md:px-6 flex flex-1 justify-center py-6">
          <div className="layout-content-container flex flex-col max-w-7xl flex-1">
            <GameReplayViewer gameRecord={gameRecord} />
          </div>
        </div>
      </div>
    </div>
  )
}
