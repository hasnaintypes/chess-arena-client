"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Pause, SkipForward, ChevronLeft, ChevronRight, RotateCcw, Download, Share } from "lucide-react"
import type { GameRecord } from "@/types/chess"
import { useGameReplay } from "@/hooks/use-game-replay"

interface GameReplayViewerProps {
  gameRecord: GameRecord
}

export function GameReplayViewer({ gameRecord }: GameReplayViewerProps) {
  const {
    currentMoveIndex,
    totalMoves,
    isPlaying,
    playbackSpeed,
    getCurrentMoveInfo,
    goToMove,
    nextMove,
    previousMove,
    goToStart,
    goToEnd,
    togglePlayback,
    setPlaybackSpeed,
  } = useGameReplay(gameRecord)

  const currentMoveInfo = getCurrentMoveInfo()

  const formatGameResult = (result: string, termination: string) => {
    const resultMap = {
      "white-wins": "1-0",
      "black-wins": "0-1",
      draw: "½-½",
      ongoing: "*",
    }
    return `${resultMap[result as keyof typeof resultMap]} (${termination})`
  }

  const formatDuration = (start: Date, end?: Date) => {
    const duration = (end ? end.getTime() : Date.now()) - start.getTime()
    const minutes = Math.floor(duration / 60000)
    const seconds = Math.floor((duration % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const exportPGN = () => {
    let pgn = `[Event "Chess Arena Game"]
[Site "Chess Arena"]
[Date "${gameRecord.gameInfo.startTime.toISOString().split("T")[0]}"]
[Round "1"]
[White "${gameRecord.players.white.name}"]
[Black "${gameRecord.players.black.name}"]
[Result "${formatGameResult(gameRecord.gameInfo.result, gameRecord.gameInfo.termination).split(" ")[0]}"]
[TimeControl "${gameRecord.gameInfo.timeControl}"]

`

    gameRecord.moves.forEach((move) => {
      if (move.white && move.black) {
        pgn += `${move.moveNumber}. ${move.white.san} ${move.black.san} `
      } else if (move.white) {
        pgn += `${move.moveNumber}. ${move.white.san} `
      }
    })

    pgn += formatGameResult(gameRecord.gameInfo.result, gameRecord.gameInfo.termination).split(" ")[0]

    const blob = new Blob([pgn], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `chess-game-${gameRecord.id}.pgn`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Game Info Header */}
      <Card className="bg-[#1c2620] border-[#29382f]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Game Replay</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportPGN}
                className="bg-[#29382f] border-[#3d5245] text-white hover:bg-[#3d5245]"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PGN
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-[#29382f] border-[#3d5245] text-white hover:bg-[#3d5245]"
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Players */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-[#29382f] rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback className="bg-[#3d5245] text-white">
                    {gameRecord.players.white.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{gameRecord.players.white.name}</span>
                    <Badge variant="secondary" className="bg-[#3d5245] text-[#9eb7a8]">
                      {gameRecord.players.white.rating}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-white rounded-full" />
                    <span className="text-[#9eb7a8] text-sm">White</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#29382f] rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback className="bg-[#3d5245] text-white">
                    {gameRecord.players.black.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{gameRecord.players.black.name}</span>
                    <Badge variant="secondary" className="bg-[#3d5245] text-[#9eb7a8]">
                      {gameRecord.players.black.rating}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-800 border border-gray-600 rounded-full" />
                    <span className="text-[#9eb7a8] text-sm">Black</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Game Details */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[#9eb7a8]">Result:</span>
                <span className="text-white font-medium">
                  {formatGameResult(gameRecord.gameInfo.result, gameRecord.gameInfo.termination)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9eb7a8]">Time Control:</span>
                <span className="text-white">{gameRecord.gameInfo.timeControl}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9eb7a8]">Game Type:</span>
                <span className="text-white capitalize">{gameRecord.gameInfo.gameType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9eb7a8]">Duration:</span>
                <span className="text-white">
                  {formatDuration(gameRecord.gameInfo.startTime, gameRecord.gameInfo.endTime)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9eb7a8]">Total Moves:</span>
                <span className="text-white">{Math.ceil(totalMoves / 2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chess Board */}
        <div className="lg:col-span-8">
          <Card className="bg-[#1c2620] border-[#29382f]">
            <CardContent className="p-6">
              <div className="aspect-square bg-[#29382f] rounded-lg flex items-center justify-center mb-4">
                <div className="text-center text-[#9eb7a8]">
                  <div className="text-6xl mb-4">♟️</div>
                  <div className="text-lg font-medium">Chess Board</div>
                  <div className="text-sm">
                    {currentMoveInfo
                      ? `Move ${Math.ceil((currentMoveIndex + 1) / 2)}: ${currentMoveInfo.move.san}`
                      : "Starting Position"}
                  </div>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToStart}
                    className="bg-[#29382f] border-[#3d5245] text-white hover:bg-[#3d5245]"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={previousMove}
                    disabled={currentMoveIndex <= -1}
                    className="bg-[#29382f] border-[#3d5245] text-white hover:bg-[#3d5245] disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={togglePlayback}
                    className="bg-[#29382f] border-[#3d5245] text-white hover:bg-[#3d5245]"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextMove}
                    disabled={currentMoveIndex >= totalMoves - 1}
                    className="bg-[#29382f] border-[#3d5245] text-white hover:bg-[#3d5245] disabled:opacity-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToEnd}
                    className="bg-[#29382f] border-[#3d5245] text-white hover:bg-[#3d5245]"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-[#9eb7a8] text-sm">Speed:</span>
                    <Select value={playbackSpeed.toString()} onValueChange={(value) => setPlaybackSpeed(Number(value))}>
                      <SelectTrigger className="w-20 bg-[#29382f] border-[#3d5245] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#29382f] border-[#3d5245] text-white">
                        <SelectItem value="0.5">0.5x</SelectItem>
                        <SelectItem value="1">1x</SelectItem>
                        <SelectItem value="2">2x</SelectItem>
                        <SelectItem value="4">4x</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#9eb7a8]">
                      Move {currentMoveIndex + 1} of {totalMoves}
                    </span>
                    <span className="text-[#9eb7a8]">
                      {currentMoveInfo ? `${currentMoveInfo.color} plays ${currentMoveInfo.move.san}` : "Game start"}
                    </span>
                  </div>
                  <Slider
                    value={[currentMoveIndex + 1]}
                    onValueChange={([value]) => goToMove(value - 1)}
                    max={totalMoves}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Move History */}
        <div className="lg:col-span-4">
          <Card className="bg-[#1c2620] border-[#29382f]">
            <CardHeader>
              <CardTitle className="text-white text-lg">Move History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {gameRecord.moves.map((move, index) => (
                  <div
                    key={move.id}
                    className={`p-2 rounded cursor-pointer transition-colors ${
                      Math.floor(currentMoveIndex / 2) === index
                        ? "bg-[#38e07b] text-[#111714]"
                        : "hover:bg-[#29382f] text-[#9eb7a8]"
                    }`}
                    onClick={() => goToMove(index * 2 + (move.black ? 1 : 0))}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm w-8">{move.moveNumber}.</span>
                      <div className="flex gap-4 flex-1">
                        {move.white && (
                          <span
                            className={`font-mono cursor-pointer ${currentMoveIndex === index * 2 ? "font-bold" : ""}`}
                            onClick={(e) => {
                              e.stopPropagation()
                              goToMove(index * 2)
                            }}
                          >
                            {move.white.san}
                          </span>
                        )}
                        {move.black && (
                          <span
                            className={`font-mono cursor-pointer ${
                              currentMoveIndex === index * 2 + 1 ? "font-bold" : ""
                            }`}
                            onClick={(e) => {
                              e.stopPropagation()
                              goToMove(index * 2 + 1)
                            }}
                          >
                            {move.black.san}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
