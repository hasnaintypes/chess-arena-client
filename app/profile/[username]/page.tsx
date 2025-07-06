"use client"

import { useState } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Crown, Zap, Shield, Flame, Target, Clock, Trophy, Users, TrendingUp, Calendar } from "lucide-react"
import type { User } from "@/types/user"

// Import new components
import { UserProfileCard } from "@/components/profile/UserProfileCard"
import { UserStats } from "@/components/profile/UserStats"
import { RecentGames } from "@/components/profile/RecentGames"
import { AchievementsList } from "@/components/profile/AchievementsList"

const mockUser: User = {
  id: "1",
  username: "GrandmasterX",
  email: "gm@example.com",
  rating: 2850,
  gamesPlayed: 1247,
  gamesWon: 892,
  gamesLost: 201,
  gamesDrawn: 154,
  joinDate: new Date("2023-01-15"),
  lastActive: new Date(),
  country: "US",
  title: "GM",
}

const mockRecentGames = [
  {
    id: "1",
    opponent: "ChessMaster",
    opponentRating: 2743,
    result: "win" as "win" | "loss" | "draw", // Added type assertion
    rating: 2845,
    ratingChange: 15,
    timeControl: "5+3",
    gameType: "ranked",
    date: new Date(),
    moves: 42,
    duration: "12:45",
  },
  {
    id: "2",
    opponent: "PawnPusher",
    opponentRating: 2156,
    result: "win" as "win" | "loss" | "draw",
    rating: 2840,
    ratingChange: 12,
    timeControl: "10+0",
    gameType: "casual",
    date: new Date(),
    moves: 56,
    duration: "18:22",
  },
  {
    id: "3",
    opponent: "QueenSlayer",
    opponentRating: 2698,
    result: "draw" as "win" | "loss" | "draw",
    rating: 2838,
    ratingChange: 0,
    timeControl: "15+10",
    gameType: "tournament",
    date: new Date(),
    moves: 78,
    duration: "45:12",
  },
  {
    id: "4",
    opponent: "RookRider",
    opponentRating: 2901,
    result: "loss" as "win" | "loss" | "draw",
    rating: 2850,
    ratingChange: -18,
    timeControl: "3+0",
    gameType: "ranked",
    date: new Date(),
    moves: 28,
    duration: "8:33",
  },
  {
    id: "5",
    opponent: "BishopBeast",
    opponentRating: 2445,
    result: "win" as "win" | "loss" | "draw",
    rating: 2868,
    ratingChange: 22,
    timeControl: "5+3",
    gameType: "casual",
    date: new Date(),
    moves: 48,
    duration: "15:18",
  },
]

const mockAchievements = [
  {
    id: "1",
    name: "Grandmaster",
    description: "Achieved rating above 2500",
    icon: Crown,
    color: "text-yellow-400",
    rarity: "legendary",
    unlockedAt: new Date("2023-06-15"),
  },
  {
    id: "2",
    name: "Centurion",
    description: "Won 100 consecutive games",
    icon: Target,
    color: "text-green-400",
    rarity: "epic",
    unlockedAt: new Date("2023-08-20"),
  },
  {
    id: "3",
    name: "Speed Demon",
    description: "Won 50 bullet games",
    icon: Zap,
    color: "text-blue-400",
    rarity: "rare",
    unlockedAt: new Date("2023-09-10"),
  },
  {
    id: "4",
    name: "Tournament Victor",
    description: "Won 5 tournaments",
    icon: Trophy,
    color: "text-purple-400",
    rarity: "epic",
    unlockedAt: new Date("2023-10-05"),
  },
  {
    id: "5",
    name: "Endgame Master",
    description: "Won 25 endgames with less than 30 seconds",
    icon: Clock,
    color: "text-orange-400",
    rarity: "rare",
    unlockedAt: new Date("2023-11-12"),
  },
  {
    id: "6",
    name: "Streak Master",
    description: "Maintained 20+ win streak",
    icon: Flame,
    color: "text-red-400",
    rarity: "epic",
    unlockedAt: new Date("2023-12-01"),
  },
]

const mockStats = {
  ratingHistory: [
    { date: "Jan", rating: 2650 },
    { date: "Feb", rating: 2680 },
    { date: "Mar", rating: 2720 },
    { date: "Apr", rating: 2750 },
    { date: "May", rating: 2780 },
    { date: "Jun", rating: 2820 },
    { date: "Jul", rating: 2850 },
  ],
  timeControls: {
    bullet: { rating: 2756, games: 234, winRate: 68 },
    blitz: { rating: 2850, games: 567, winRate: 72 },
    rapid: { rating: 2834, games: 345, winRate: 71 },
    classical: { rating: 2798, games: 101, winRate: 69 },
  },
  openings: {
    white: [
      { name: "Ruy Lopez", games: 156, winRate: 74 },
      { name: "Queen's Gambit", games: 134, winRate: 68 },
      { name: "English Opening", games: 89, winRate: 71 },
    ],
    black: [
      { name: "Sicilian Defense", games: 178, winRate: 69 },
      { name: "French Defense", games: 123, winRate: 72 },
      { name: "Caro-Kann", games: 98, winRate: 67 },
    ],
  },
}

export default function ProfilePage({ params }: { params: { username: string } }) {
  const [activeTab, setActiveTab] = useState("overview")

  // Removed getWinRate and getResultColor as they are now in child components

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-[#e2e8f0]">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-1">
            <UserProfileCard user={mockUser} />
          </div>
          <div className="md:col-span-2">
            <UserStats user={mockUser} stats={mockStats} />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[#1e293b] border border-[#334155]">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="games" className="data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white">Game History</TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white">Achievements</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-6">
            {/* Overview can combine parts of stats or other summary info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentGames games={mockRecentGames.slice(0, 3)} /> {/* Show fewer games on overview */}
              <AchievementsList achievements={mockAchievements.slice(0,3)} /> {/* Show fewer achievements on overview */}
            </div>
          </TabsContent>
          <TabsContent value="games" className="mt-6">
            <RecentGames games={mockRecentGames} />
          </TabsContent>
          <TabsContent value="achievements" className="mt-6">
            <AchievementsList achievements={mockAchievements} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
