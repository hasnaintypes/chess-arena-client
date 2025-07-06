"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Users, Trophy } from "lucide-react"
import type { User } from "@/types/user"

interface UserStatsProps {
  user: User
  stats: {
    ratingHistory: { date: string; rating: number }[]
    timeControls: {
      [key: string]: { rating: number; games: number; winRate: number }
    }
  }
}

export function UserStats({ user, stats }: UserStatsProps) {
  const getWinRate = () => Math.round((user.gamesWon / user.gamesPlayed) * 100)

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="mr-2 h-5 w-5" /> Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Win Rate</span>
            <span className="text-sm text-muted-foreground">{getWinRate()}%</span>
          </div>
          <Progress value={getWinRate()} className="h-2" />
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Games Played: {user.gamesPlayed}</span>
          </div>
          <div className="flex items-center">
            <Trophy className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Games Won: {user.gamesWon}</span>
          </div>
        </div>
        <div>
          <h4 className="text-md font-semibold mb-2">Performance by Time Control</h4>
          <div className="space-y-2">
            {Object.entries(stats.timeControls).map(([control, data]) => (
              <div key={control} className="p-2 rounded-md border">
                <div className="font-medium capitalize">{control}</div>
                <div className="text-xs text-muted-foreground">
                  Rating: {data.rating} | Games: {data.games} | Win Rate: {data.winRate}%
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Add more stats sections like rating history chart here if needed */}
      </CardContent>
    </Card>
  )
}