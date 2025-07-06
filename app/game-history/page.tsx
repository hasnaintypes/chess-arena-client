"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Play, Calendar, Clock, Trophy, Target } from "lucide-react"
import Link from "next/link"
import { useGameStore } from "@/stores/game-store"
import { useAuthStore } from "@/stores/auth-store"

export default function GameHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [resultFilter, setResultFilter] = useState("all")
  const [gameTypeFilter, setGameTypeFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  const { gameHistory, loading, fetchGameHistory } = useGameStore()
  const { user } = useAuthStore()

  useEffect(() => {
    if (user) {
      fetchGameHistory()
    }
  }, [user, fetchGameHistory])

  const filteredGames = gameHistory
    .filter((game) => {
      // Determine opponent name
      const isWhite = game.players.white.userId === user?.id
      const opponent = isWhite ? game.players.black.username : game.players.white.username

      const matchesSearch = opponent.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesResult = resultFilter === "all" || game.gameInfo.result === resultFilter
      const matchesGameType = gameTypeFilter === "all" || game.gameInfo.gameType === gameTypeFilter
      return matchesSearch && matchesResult && matchesGameType
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.gameInfo.startTime).getTime() - new Date(a.gameInfo.startTime).getTime()
        default:
          return 0
      }
    })

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

  const formatDuration = (start: Date, end?: Date) => {
    if (!end) return "Ongoing"
    const duration = end.getTime() - start.getTime()
    const minutes = Math.floor(duration / 60000)
    const seconds = Math.floor((duration % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
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

        <div className="px-4 md:px-20 lg:px-40 flex flex-1 justify-center py-8">
          <div className="layout-content-container flex flex-col max-w-6xl flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Game History</h1>
                <p className="text-[#9eb7a8]">Review your past chess games</p>
              </div>
              <Badge variant="secondary" className="bg-[#29382f] text-[#9eb7a8]">
                {gameHistory.length} games played
              </Badge>
            </div>

            {/* Filters */}
            <Card className="bg-[#1c2620] border-[#29382f] mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9eb7a8] h-4 w-4" />
                    <Input
                      placeholder="Search by opponent name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-[#29382f] border-[#3d5245] text-white placeholder:text-[#9eb7a8]"
                    />
                  </div>

                  <Select value={resultFilter} onValueChange={setResultFilter}>
                    <SelectTrigger className="w-full lg:w-40 bg-[#29382f] border-[#3d5245] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#29382f] border-[#3d5245] text-white">
                      <SelectItem value="all">All Results</SelectItem>
                      <SelectItem value="white-wins">Wins</SelectItem>
                      <SelectItem value="black-wins">Losses</SelectItem>
                      <SelectItem value="draw">Draws</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={gameTypeFilter} onValueChange={setGameTypeFilter}>
                    <SelectTrigger className="w-full lg:w-40 bg-[#29382f] border-[#3d5245] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#29382f] border-[#3d5245] text-white">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="ranked">Ranked</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="tournament">Tournament</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full lg:w-40 bg-[#29382f] border-[#3d5245] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#29382f] border-[#3d5245] text-white">
                      <SelectItem value="date">Sort by Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Games List */}
            <Card className="bg-[#1c2620] border-[#29382f]">
              <CardHeader>
                <CardTitle className="text-white">Your Games</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-16">
                    <div className="text-white text-lg">Loading game history...</div>
                  </div>
                ) : filteredGames.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-[#9eb7a8] text-lg">No games found</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredGames.map((game) => {
                      const isWhite = game.players.white.userId === user?.id
                      const opponent = isWhite ? game.players.black : game.players.white
                      const userResult =
                        game.gameInfo.result === "draw"
                          ? "draw"
                          : (game.gameInfo.result === "white-wins" && isWhite) ||
                              (game.gameInfo.result === "black-wins" && !isWhite)
                            ? "win"
                            : "loss"

                      return (
                        <div
                          key={game.id}
                          className="flex items-center gap-4 p-4 rounded-lg bg-[#29382f] hover:bg-[#3d5245] transition-colors"
                        >
                          {/* Result */}
                          <div
                            className={`flex items-center justify-center w-12 h-12 rounded-full ${getResultColor(game.gameInfo.result, isWhite)}`}
                          >
                            {getResultIcon(game.gameInfo.result, isWhite)}
                          </div>

                          {/* Game Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-white font-medium">vs {opponent.username}</span>
                              <Badge className={`text-xs ${getGameTypeColor(game.gameInfo.gameType)}`}>
                                {game.gameInfo.gameType}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-[#9eb7a8] text-sm">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{game.gameInfo.startTime.toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{game.gameInfo.timeControl}</span>
                              </div>
                              <span>{game.moves.length} moves</span>
                              <span>{formatDuration(game.gameInfo.startTime, game.gameInfo.endTime)}</span>
                            </div>
                          </div>

                          {/* Rating Change */}
                          <div className="text-right">
                            <div className="text-white font-medium capitalize">{userResult}</div>
                            {isWhite && game.players.white.ratingChange !== undefined && (
                              <div
                                className={`text-sm ${game.players.white.ratingChange > 0 ? "text-green-400" : game.players.white.ratingChange < 0 ? "text-red-400" : "text-[#9eb7a8]"}`}
                              >
                                {game.players.white.ratingChange > 0 ? "+" : ""}
                                {game.players.white.ratingChange}
                              </div>
                            )}
                            {!isWhite && game.players.black.ratingChange !== undefined && (
                              <div
                                className={`text-sm ${game.players.black.ratingChange > 0 ? "text-green-400" : game.players.black.ratingChange < 0 ? "text-red-400" : "text-[#9eb7a8]"}`}
                              >
                                {game.players.black.ratingChange > 0 ? "+" : ""}
                                {game.players.black.ratingChange}
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Link href={`/replay/${game.id}`}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-[#1c2620] border-[#3d5245] text-white hover:bg-[#111714]"
                              >
                                <Play className="h-3 w-3 mr-1" />
                                Replay
                              </Button>
                            </Link>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
