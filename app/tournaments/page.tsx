"use client"

import { useState } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Users, Clock, Calendar, Star, Award, Crown, Target } from "lucide-react"

interface Tournament {
  id: string
  name: string
  description: string
  status: "upcoming" | "ongoing" | "completed"
  format: "single-elimination" | "double-elimination" | "round-robin" | "swiss"
  timeControl: string
  maxParticipants: number
  currentParticipants: number
  prizePool: number
  startDate: Date
  endDate?: Date
  entryFee: number
  minRating: number
  maxRating?: number
  organizer: string
  rounds: number
  currentRound?: number
}

const mockTournaments: Tournament[] = [
  {
    id: "1",
    name: "Chess Arena Grand Championship",
    description: "The ultimate chess tournament for masters and grandmasters",
    status: "upcoming",
    format: "single-elimination",
    timeControl: "15+10",
    maxParticipants: 64,
    currentParticipants: 42,
    prizePool: 5000,
    startDate: new Date(Date.now() + 86400000 * 3), // 3 days from now
    entryFee: 50,
    minRating: 2000,
    maxRating: 3000,
    organizer: "Chess Arena",
    rounds: 6,
  },
  {
    id: "2",
    name: "Blitz Masters Weekly",
    description: "Fast-paced weekly tournament for blitz enthusiasts",
    status: "ongoing",
    format: "swiss",
    timeControl: "3+2",
    maxParticipants: 32,
    currentParticipants: 32,
    prizePool: 500,
    startDate: new Date(Date.now() - 3600000), // 1 hour ago
    endDate: new Date(Date.now() + 7200000), // 2 hours from now
    entryFee: 10,
    minRating: 1500,
    organizer: "BlitzMaster",
    rounds: 7,
    currentRound: 3,
  },
  {
    id: "3",
    name: "Beginner's Cup",
    description: "Perfect tournament for new players to gain experience",
    status: "upcoming",
    format: "round-robin",
    timeControl: "10+5",
    maxParticipants: 16,
    currentParticipants: 8,
    prizePool: 200,
    startDate: new Date(Date.now() + 86400000), // Tomorrow
    entryFee: 5,
    minRating: 800,
    maxRating: 1400,
    organizer: "ChessAcademy",
    rounds: 15,
  },
  {
    id: "4",
    name: "Rapid Championship",
    description: "Monthly rapid chess championship with substantial prizes",
    status: "completed",
    format: "double-elimination",
    timeControl: "15+10",
    maxParticipants: 128,
    currentParticipants: 128,
    prizePool: 2000,
    startDate: new Date(Date.now() - 86400000 * 7), // 1 week ago
    endDate: new Date(Date.now() - 86400000 * 5), // 5 days ago
    entryFee: 25,
    minRating: 1200,
    organizer: "RapidKings",
    rounds: 8,
  },
]

export default function TournamentsPage() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [formatFilter, setFormatFilter] = useState("all")

  const filteredTournaments = mockTournaments.filter((tournament) => {
    const matchesStatus = statusFilter === "all" || tournament.status === statusFilter
    const matchesFormat = formatFilter === "all" || tournament.format === formatFilter
    return matchesStatus && matchesFormat
  })

  const getStatusColor = (status: Tournament["status"]) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-600 text-white"
      case "ongoing":
        return "bg-green-600 text-white"
      case "completed":
        return "bg-gray-600 text-white"
      default:
        return "bg-[#29382f] text-[#9eb7a8]"
    }
  }

  const getFormatIcon = (format: Tournament["format"]) => {
    switch (format) {
      case "single-elimination":
        return <Target className="h-4 w-4" />
      case "double-elimination":
        return <Award className="h-4 w-4" />
      case "round-robin":
        return <Users className="h-4 w-4" />
      case "swiss":
        return <Star className="h-4 w-4" />
      default:
        return <Trophy className="h-4 w-4" />
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const upcomingTournaments = filteredTournaments.filter((t) => t.status === "upcoming")
  const ongoingTournaments = filteredTournaments.filter((t) => t.status === "ongoing")
  const completedTournaments = filteredTournaments.filter((t) => t.status === "completed")

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
                <h1 className="text-3xl font-bold text-white mb-2">Tournaments</h1>
                <p className="text-[#9eb7a8]">Compete in organized chess tournaments</p>
              </div>

              <div className="flex gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40 bg-[#29382f] border-[#3d5245] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#29382f] border-[#3d5245] text-white">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={formatFilter} onValueChange={setFormatFilter}>
                  <SelectTrigger className="w-40 bg-[#29382f] border-[#3d5245] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#29382f] border-[#3d5245] text-white">
                    <SelectItem value="all">All Formats</SelectItem>
                    <SelectItem value="single-elimination">Single Elimination</SelectItem>
                    <SelectItem value="double-elimination">Double Elimination</SelectItem>
                    <SelectItem value="round-robin">Round Robin</SelectItem>
                    <SelectItem value="swiss">Swiss</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Featured Tournament */}
            {upcomingTournaments.length > 0 && (
              <Card className="bg-gradient-to-r from-[#1c2620] to-[#29382f] border-[#38e07b] mb-8">
                <CardContent className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Crown className="h-6 w-6 text-[#38e07b]" />
                    <Badge className="bg-[#38e07b] text-[#111714]">Featured</Badge>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">{upcomingTournaments[0].name}</h2>
                      <p className="text-[#9eb7a8] mb-4">{upcomingTournaments[0].description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-[#9eb7a8]">Prize Pool:</span>
                          <div className="text-[#38e07b] font-bold">${upcomingTournaments[0].prizePool}</div>
                        </div>
                        <div>
                          <span className="text-[#9eb7a8]">Participants:</span>
                          <div className="text-white font-bold">
                            {upcomingTournaments[0].currentParticipants}/{upcomingTournaments[0].maxParticipants}
                          </div>
                        </div>
                        <div>
                          <span className="text-[#9eb7a8]">Time Control:</span>
                          <div className="text-white font-bold">{upcomingTournaments[0].timeControl}</div>
                        </div>
                        <div>
                          <span className="text-[#9eb7a8]">Entry Fee:</span>
                          <div className="text-white font-bold">${upcomingTournaments[0].entryFee}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-center mb-4">
                        <div className="text-[#9eb7a8] text-sm mb-1">Starts in</div>
                        <div className="text-2xl font-bold text-[#38e07b]">
                          {Math.ceil((upcomingTournaments[0].startDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))}{" "}
                          days
                        </div>
                      </div>
                      <Button className="bg-[#38e07b] text-[#111714] hover:bg-[#2bc464] text-lg py-6">
                        Register Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tournament Tabs */}
            <Tabs defaultValue="upcoming" className="space-y-6">
              <TabsList className="bg-[#1c2620] border border-[#29382f]">
                <TabsTrigger
                  value="upcoming"
                  className="data-[state=active]:bg-[#38e07b] data-[state=active]:text-[#111714]"
                >
                  Upcoming ({upcomingTournaments.length})
                </TabsTrigger>
                <TabsTrigger
                  value="ongoing"
                  className="data-[state=active]:bg-[#38e07b] data-[state=active]:text-[#111714]"
                >
                  Live ({ongoingTournaments.length})
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="data-[state=active]:bg-[#38e07b] data-[state=active]:text-[#111714]"
                >
                  Completed ({completedTournaments.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-4">
                {upcomingTournaments.map((tournament) => (
                  <TournamentCard key={tournament.id} tournament={tournament} />
                ))}
              </TabsContent>

              <TabsContent value="ongoing" className="space-y-4">
                {ongoingTournaments.map((tournament) => (
                  <TournamentCard key={tournament.id} tournament={tournament} />
                ))}
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                {completedTournaments.map((tournament) => (
                  <TournamentCard key={tournament.id} tournament={tournament} />
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

function TournamentCard({ tournament }: { tournament: Tournament }) {
  const getStatusColor = (status: Tournament["status"]) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-600 text-white"
      case "ongoing":
        return "bg-green-600 text-white"
      case "completed":
        return "bg-gray-600 text-white"
      default:
        return "bg-[#29382f] text-[#9eb7a8]"
    }
  }

  const getFormatIcon = (format: Tournament["format"]) => {
    switch (format) {
      case "single-elimination":
        return <Target className="h-4 w-4" />
      case "double-elimination":
        return <Award className="h-4 w-4" />
      case "round-robin":
        return <Users className="h-4 w-4" />
      case "swiss":
        return <Star className="h-4 w-4" />
      default:
        return <Trophy className="h-4 w-4" />
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="bg-[#1c2620] border-[#29382f] hover:bg-[#1a1f1c] transition-colors">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-xl font-bold text-white">{tournament.name}</h3>
              <Badge className={getStatusColor(tournament.status)}>{tournament.status}</Badge>
              <div className="flex items-center gap-1 text-[#9eb7a8]">
                {getFormatIcon(tournament.format)}
                <span className="text-sm capitalize">{tournament.format.replace("-", " ")}</span>
              </div>
            </div>

            <p className="text-[#9eb7a8] mb-4">{tournament.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-[#9eb7a8]">Prize Pool</div>
                <div className="text-[#38e07b] font-bold">${tournament.prizePool}</div>
              </div>
              <div>
                <div className="text-[#9eb7a8]">Players</div>
                <div className="text-white font-bold">
                  {tournament.currentParticipants}/{tournament.maxParticipants}
                </div>
              </div>
              <div>
                <div className="text-[#9eb7a8]">Time Control</div>
                <div className="text-white font-bold">{tournament.timeControl}</div>
              </div>
              <div>
                <div className="text-[#9eb7a8]">Entry Fee</div>
                <div className="text-white font-bold">${tournament.entryFee}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4 text-sm text-[#9eb7a8]">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(tournament.startDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{tournament.rounds} rounds</span>
              </div>
              {tournament.currentRound && (
                <div>
                  Round {tournament.currentRound}/{tournament.rounds}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center gap-3 lg:w-48">
            {tournament.status === "upcoming" && (
              <Button className="bg-[#38e07b] text-[#111714] hover:bg-[#2bc464]">Register</Button>
            )}
            {tournament.status === "ongoing" && (
              <Button variant="outline" className="bg-[#29382f] border-[#3d5245] text-white hover:bg-[#3d5245]">
                Watch Live
              </Button>
            )}
            {tournament.status === "completed" && (
              <Button variant="outline" className="bg-[#29382f] border-[#3d5245] text-white hover:bg-[#3d5245]">
                View Results
              </Button>
            )}
            <Button variant="ghost" className="text-[#9eb7a8] hover:text-white hover:bg-[#29382f]">
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
