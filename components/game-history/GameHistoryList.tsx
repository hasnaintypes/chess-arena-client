"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Calendar, Clock, Trophy, Target } from "lucide-react"
import { Game } from "@/stores/game-store" // Assuming Game type is exported from game-store
import { User } from "@/types/user" // Assuming User type is exported

interface GameHistoryListProps {
  games: Game[]
  currentUser: User | null
  loading: boolean
}

const getResultColor = (result: string, isWhite: boolean) => {
  if (result === "draw") return "text-yellow-400 bg-yellow-400/10"
  const userWon = (result === "white-wins" && isWhite) || (result === "black-wins" && !isWhite)
  return userWon ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10"
}

const getResultIcon = (result: string, isWhite: boolean) => {
  if (result === "draw") {
    return <div className="w-4 h-4 rounded-full border-2 border-current" />
  }
  const userWon = (result === "white-wins" && isWhite) || (result === "black-wins" && !isWhite)
  return userWon ? <Trophy className="h-4 w-4" /> : <Target className="h-4 w-4" />
}

const getGameTypeColor = (type: string) => {
  switch (type) {
    case "ranked":
      return "bg-yellow-600 text-white"
    case "tournament":
      return "bg-purple-600 text-white"
    case "casual":
      return "bg-green-600 text-white"
    default:
      return "bg-[#29382f] text-[#9eb7a8]"
  }
}

const formatDuration = (start: string | Date, end?: string | Date) => {
  if (!end) return "Ongoing"
  const duration = new Date(end).getTime() - new Date(start).getTime()
  const minutes = Math.floor(duration / 60000)
  const seconds = Math.floor((duration % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export function GameHistoryList({ games, currentUser, loading }: GameHistoryListProps) {
  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="text-white text-lg">Loading game history...</div>
      </div>
    )
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-[#9eb7a8] text-lg">No games found</div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {games.map((game) => {
        const isWhite = game.players.white.userId === currentUser?.id
        const opponent = isWhite ? game.players.black : game.players.white
        // const userResult =
        //   game.gameInfo.result === "draw"
        //     ? "draw"
        //     : (game.gameInfo.result === "white-wins" && isWhite) ||
        //         (game.gameInfo.result === "black-wins" && !isWhite)
        //       ? "win"
        //       : "loss"

        return (
          <div
            key={game.id}
            className="flex items-center gap-4 p-4 rounded-lg bg-[#29382f] hover:bg-[#3d5245] transition-colors"
          >
            {/* Result */}
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-full ${getResultColor(
                game.gameInfo.result,
                isWhite
              )}`}
            >
              {getResultIcon(game.gameInfo.result, isWhite)}
            </div>

            {/* Game Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-white truncate">
                  vs <span className="font-semibold">{opponent.username}</span>
                </p>
                <Badge variant="secondary" className={`${getGameTypeColor(game.gameInfo.gameType)} px-2 py-0.5 text-xs`}>
                  {game.gameInfo.gameType}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#9eb7a8]">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(game.gameInfo.startTime).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatDuration(game.gameInfo.startTime, game.gameInfo.endTime)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <Link href={`/replay/${game.id}`}>
              <Button variant="outline" size="sm" className="bg-[#3d5245] border-[#4a6153] text-white hover:bg-[#4a6153]">
                <Play className="h-4 w-4 mr-2" />
                Replay
              </Button>
            </Link>
          </div>
        )
      })}
    </div>
  )
}