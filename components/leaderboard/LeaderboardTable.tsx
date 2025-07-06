"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, ChevronUp, ChevronDown, Minus, Crown } from "lucide-react"
import type { LeaderboardEntry } from "@/stores/leaderboard-store"

interface LeaderboardTableProps {
  players: LeaderboardEntry[]
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="h-5 w-5 text-yellow-400" />
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />
    case 3:
      return <Award className="h-5 w-5 text-amber-600" />
    default:
      return <span className="text-[#9eb7a8] font-semibold">#{rank}</span>
  }
}

const getRatingChangeDisplay = (change?: number) => {
  if (change === undefined || change === null) return null;
  if (change > 0) return <ChevronUp className="h-4 w-4 text-green-400" />;
  if (change < 0) return <ChevronDown className="h-4 w-4 text-red-400" />;
  return <Minus className="h-4 w-4 text-gray-500" />;
}

export function LeaderboardTable({ players }: LeaderboardTableProps) {
  if (!players || players.length === 0) {
    return (
      <Card className="bg-[#1c2620] border-[#29382f]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="h-5 w-5 text-[#38e07b]" />
            Full Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-[#9eb7a8] py-8">No players to display in this ranking.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-[#1c2620] border-[#29382f]">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Trophy className="h-5 w-5 text-[#38e07b]" />
          Full Rankings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {/* Table Header */} 
          <div className="hidden md:flex items-center gap-4 px-4 py-2 text-xs text-[#9eb7a8] font-medium border-b border-[#29382f]">
            <div className="w-12 text-center">Rank</div>
            <div className="flex-1">Player</div>
            <div className="w-24 text-right">Rating</div>
            <div className="w-20 text-center">Win %</div>
            <div className="w-20 text-center">Games</div>
            <div className="w-16 text-center">Trend</div>
          </div>

          {players.map((entry) => (
            <Link href={`/profile/${entry.username}`} key={entry.username} legacyBehavior>
              <a className="flex flex-col md:flex-row items-center gap-4 p-3 md:p-4 rounded-lg hover:bg-[#29382f] transition-colors cursor-pointer">
                <div className="w-full md:w-12 text-left md:text-center font-semibold">
                  {getRankIcon(entry.rank)}
                </div>

                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={entry.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${entry.username}`} />
                    <AvatarFallback className="bg-[#29382f] text-white">
                      {entry.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium hover:text-[#38e07b] transition-colors truncate">
                        {entry.username}
                      </span>
                      {entry.title && (
                        <Badge variant="secondary" className="bg-[#29382f] text-[#9eb7a8] text-xs whitespace-nowrap">
                          {entry.title}
                        </Badge>
                      )}
                    </div>
                    <div className="text-[#9eb7a8] text-xs md:hidden">
                        {entry.currentRating} Rating • {entry.winRate}% Win Rate • {entry.totalGames} Games
                    </div>
                  </div>
                </div>

                <div className="hidden md:block w-24 text-right text-lg font-bold text-white">{entry.currentRating}</div>
                <div className="hidden md:block w-20 text-center text-[#9eb7a8]">{entry.winRate}%</div>
                <div className="hidden md:block w-20 text-center text-[#9eb7a8]">{entry.totalGames}</div>
                <div className="hidden md:flex w-16 justify-center items-center">
                  {getRatingChangeDisplay(entry.ratingChange as unknown as number)}
                </div>
              </a>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}