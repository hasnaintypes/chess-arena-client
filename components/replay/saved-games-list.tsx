"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Play, Download, Trash2, Calendar, Clock, Trophy } from "lucide-react"
import type { GameRecord } from "@/types/chess"
import Link from "next/link"

export function SavedGamesList() {
  const [savedGames, setSavedGames] = useState<GameRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterResult, setFilterResult] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  useEffect(() => {
    // Load saved games from localStorage
    const games = JSON.parse(localStorage.getItem("chess-games") || "[]")
    setSavedGames(games)
  }, [])

  const filteredAndSortedGames = savedGames
    .filter((game) => {
      const matchesSearch =
        game.players.white.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.players.black.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesResult = filterResult === "all" || game.gameInfo.result === filterResult
      return matchesSearch && matchesResult
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.gameInfo.startTime).getTime() - new Date(a.gameInfo.startTime).getTime()
        case "duration":
          const aDuration = a.gameInfo.endTime ? a.gameInfo.endTime.getTime() - a.gameInfo.startTime.getTime() : 0
          const bDuration = b.gameInfo.endTime ? b.gameInfo.endTime.getTime() - b.gameInfo.startTime.getTime() : 0
          return bDuration - aDuration
        case "moves":
          return b.moves.length - a.moves.length
        default:
          return 0
      }
    })

  const deleteGame = (gameId: string) => {
    const updatedGames = savedGames.filter((game) => game.id !== gameId)
    setSavedGames(updatedGames)
    localStorage.setItem("chess-games", JSON.stringify(updatedGames))
  }

  const exportGame = (game: GameRecord) => {
    let pgn = `[Event "Chess Arena Game"]
[Site "Chess Arena"]
[Date "${game.gameInfo.startTime.toISOString().split("T")[0]}"]
[Round "1"]
[White "${game.players.white.name}"]
[Black "${game.players.black.name}"]
[Result "${game.gameInfo.result === "white-wins" ? "1-0" : game.gameInfo.result === "black-wins" ? "0-1" : game.gameInfo.result === "draw" ? "½-½" : "*"}"]
[TimeControl "${game.gameInfo.timeControl}"]

`

    game.moves.forEach((move) => {
      if (move.white && move.black) {
        pgn += `${move.moveNumber}. ${move.white.san} ${move.black.san} `
      } else if (move.white) {
        pgn += `${move.moveNumber}. ${move.white.san} `
      }
    })

    const blob = new Blob([pgn], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `chess-game-${game.id}.pgn`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatDuration = (start: Date, end?: Date) => {
    if (!end) return "Ongoing"
    const duration = end.getTime() - start.getTime()
    const minutes = Math.floor(duration / 60000)
    const seconds = Math.floor((duration % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const getResultBadge = (result: string) => {
    switch (result) {
      case "white-wins":
        return <Badge className="bg-green-600 text-white">1-0</Badge>
      case "black-wins":
        return <Badge className="bg-red-600 text-white">0-1</Badge>
      case "draw":
        return <Badge className="bg-yellow-600 text-white">½-½</Badge>
      default:
        return <Badge variant="secondary">Ongoing</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Saved Games</h1>
          <p className="text-[#9eb7a8]">Review and replay your chess games</p>
        </div>
        <Badge variant="secondary" className="bg-[#29382f] text-[#9eb7a8]">
          {savedGames.length} games saved
        </Badge>
      </div>

      {/* Filters */}
      <Card className="bg-[#1c2620] border-[#29382f]">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9eb7a8] h-4 w-4" />
              <Input
                placeholder="Search by player name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#29382f] border-[#3d5245] text-white placeholder:text-[#9eb7a8]"
              />
            </div>
            <Select value={filterResult} onValueChange={setFilterResult}>
              <SelectTrigger className="w-full sm:w-48 bg-[#29382f] border-[#3d5245] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#29382f] border-[#3d5245] text-white">
                <SelectItem value="all">All Results</SelectItem>
                <SelectItem value="white-wins">White Wins</SelectItem>
                <SelectItem value="black-wins">Black Wins</SelectItem>
                <SelectItem value="draw">Draws</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48 bg-[#29382f] border-[#3d5245] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#29382f] border-[#3d5245] text-white">
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="duration">Sort by Duration</SelectItem>
                <SelectItem value="moves">Sort by Moves</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Games List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredAndSortedGames.map((game) => (
          <Card key={game.id} className="bg-[#1c2620] border-[#29382f] hover:bg-[#1a1f1c] transition-colors">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Players */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          <AvatarFallback className="bg-[#29382f] text-white text-xs">
                            {game.players.white.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-white font-medium">{game.players.white.name}</div>
                          <div className="text-[#9eb7a8] text-xs">{game.players.white.rating}</div>
                        </div>
                      </div>
                      <span className="text-[#9eb7a8] text-sm">vs</span>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          <AvatarFallback className="bg-[#29382f] text-white text-xs">
                            {game.players.black.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-white font-medium">{game.players.black.name}</div>
                          <div className="text-[#9eb7a8] text-xs">{game.players.black.rating}</div>
                        </div>
                      </div>
                    </div>
                    {getResultBadge(game.gameInfo.result)}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-[#9eb7a8]">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(game.gameInfo.startTime).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#9eb7a8]">
                      <Clock className="h-4 w-4" />
                      <span>
                        {formatDuration(
                          new Date(game.gameInfo.startTime),
                          game.gameInfo.endTime ? new Date(game.gameInfo.endTime) : undefined,
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[#9eb7a8]">
                      <Trophy className="h-4 w-4" />
                      <span className="capitalize">{game.gameInfo.gameType}</span>
                    </div>
                    <div className="text-[#9eb7a8]">{Math.ceil(game.moves.length)} moves</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-row lg:flex-col gap-2">
                  <Link href={`/replay/${game.id}`} className="flex-1 lg:flex-none">
                    <Button className="w-full bg-[#38e07b] text-[#111714] hover:bg-[#2bc464]">
                      <Play className="h-4 w-4 mr-2" />
                      Replay
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => exportGame(game)}
                    className="flex-1 lg:flex-none bg-[#29382f] border-[#3d5245] text-white hover:bg-[#3d5245]"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => deleteGame(game.id)}
                    className="flex-1 lg:flex-none bg-[#29382f] border-[#3d5245] text-red-400 hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAndSortedGames.length === 0 && (
        <Card className="bg-[#1c2620] border-[#29382f]">
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-white mb-2">No games found</h3>
            <p className="text-[#9eb7a8] mb-6">
              {searchTerm || filterResult !== "all"
                ? "Try adjusting your search or filters"
                : "Start playing games to see them here"}
            </p>
            <Link href="/lobby">
              <Button className="bg-[#38e07b] text-[#111714] hover:bg-[#2bc464]">Go to Lobby</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
