"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Crown, Medal, Award } from "lucide-react"
import type { LeaderboardEntry } from "@/stores/leaderboard-store" // Assuming this type exists

interface LeaderboardPodiumProps {
  topThree: LeaderboardEntry[]
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="h-8 w-8 text-yellow-400" />
    case 2:
      return <Medal className="h-8 w-8 text-gray-400" />
    case 3:
      return <Award className="h-8 w-8 text-amber-600" />
    default:
      return null
  }
}

export function LeaderboardPodium({ topThree }: LeaderboardPodiumProps) {
  if (!topThree || topThree.length === 0) {
    return null // Or some placeholder if needed
  }

  // Ensure we always have 3 items for styling, even if data is less
  const displayEntries = [...topThree]
  while (displayEntries.length < 3) {
    displayEntries.push({
      rank: displayEntries.length + 1, username: `Player ${displayEntries.length + 1}`, currentRating: 0, avatar: '', winRate: 0, totalGames: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      lastActive: new Date,
      createdAt: new Date,
      ratingChange: function (ratingChange: any): import("react").ReactNode {
        throw new Error("Function not implemented.")
      }
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {displayEntries.map((entry, index) => {
        const orderClass = entry.rank === 1 ? "md:order-2" : entry.rank === 2 ? "md:order-1" : "md:order-3";
        const heightClass = entry.rank === 1 ? "md:pt-0" : "md:pt-8"; // Make 2nd and 3rd shorter
        const cardBg = entry.rank === 1 ? "bg-gradient-to-br from-yellow-500/20 to-yellow-700/20 border-yellow-500" : entry.rank === 2 ? "bg-gradient-to-br from-gray-500/20 to-gray-700/20 border-gray-500" : "bg-gradient-to-br from-amber-600/20 to-amber-800/20 border-amber-600";

        return (
          <Card
            key={entry.username || `podium-${index}`}
            className={`bg-[#1c2620] border-[#29382f] ${orderClass} ${heightClass} ${entry.username ? cardBg : 'opacity-50'} transform transition-all hover:scale-105`}
          >
            <CardContent className="p-6 text-center flex flex-col items-center h-full">
              <div className="mb-4">{getRankIcon(entry.rank)}</div>
              {entry.username && entry.currentRating > 0 ? (
                <>
                  <Link href={`/profile/${entry.username}`} className="block mb-4">
                    <Avatar className="h-20 w-20 mx-auto border-2 border-transparent hover:border-[#38e07b] transition-all duration-300">
                      <AvatarImage src={entry.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${entry.username}`} />
                      <AvatarFallback className="bg-[#29382f] text-white text-xl">
                        {entry.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="space-y-1 flex-grow flex flex-col justify-center">
                    <h3 className="font-bold text-xl text-white truncate w-full">{entry.username}</h3>
                    {entry.title && (
                      <Badge className="bg-[#38e07b] text-[#111714] text-xs mx-auto">{entry.title}</Badge>
                    )}
                    <div className="text-3xl font-bold text-[#38e07b]">{entry.currentRating}</div>
                    <div className="text-[#9eb7a8] text-sm">{entry.winRate}% win rate</div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                    <Avatar className="h-20 w-20 mx-auto mb-4 border-2 border-dashed border-gray-600">
                         <AvatarFallback className="bg-[#29382f] text-white text-xl">?</AvatarFallback>
                    </Avatar>
                    <p className="text-gray-500">Position Open</p>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}