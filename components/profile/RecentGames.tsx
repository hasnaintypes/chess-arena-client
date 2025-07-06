"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

interface Game {
  id: string
  opponent: string
  opponentRating: number
  result: "win" | "loss" | "draw"
  rating: number
  ratingChange: number
  timeControl: string
  gameType: string
  date: Date
  moves: number
  duration: string
}

interface RecentGamesProps {
  games: Game[]
}

export function RecentGames({ games }: RecentGamesProps) {
  const getResultColor = (result: string) => {
    switch (result) {
      case "win":
        return "bg-green-500 hover:bg-green-600"
      case "loss":
        return "bg-red-500 hover:bg-red-600"
      case "draw":
        return "bg-yellow-500 hover:bg-yellow-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="mr-2 h-5 w-5" /> Recent Games
        </CardTitle>
      </CardHeader>
      <CardContent>
        {games.length === 0 ? (
          <p className="text-muted-foreground">No recent games to display.</p>
        ) : (
          <ul className="space-y-3">
            {games.map((game) => (
              <li key={game.id} className="p-3 rounded-md border flex justify-between items-center">
                <div>
                  <p className="font-semibold">
                    vs {game.opponent} <span className="text-xs text-muted-foreground">({game.opponentRating})</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {game.timeControl} {game.gameType} - {new Date(game.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <Badge className={`${getResultColor(game.result)} text-white`}>{game.result.toUpperCase()}</Badge>
                  <p className={`text-sm font-medium ${game.ratingChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {game.ratingChange >= 0 ? '+' : ''}{game.ratingChange}
                  </p>
                  <p className="text-xs text-muted-foreground">Rating: {game.rating}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}