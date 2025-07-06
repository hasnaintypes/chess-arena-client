"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Clock, Play, Trophy, Crown, Zap } from "lucide-react"

interface GameRoom {
  id: string
  name: string
  host: {
    name: string
    avatar?: string
    rating: number
  }
  players: number
  maxPlayers: number
  timeControl: string
  gameType: "casual" | "ranked" | "tournament"
  status: "waiting" | "in-progress" | "finished"
  createdAt: Date
  isPrivate: boolean
}

interface RoomCardProps {
  room: GameRoom
  onJoinRoom: (roomId: string) => void
}

export function RoomCard({ room, onJoinRoom }: RoomCardProps) {
  const getStatusConfig = (status: GameRoom["status"]) => {
    switch (status) {
      case "waiting":
        return { color: "bg-green-400", text: "Waiting", textColor: "text-green-700" }
      case "in-progress":
        return { color: "bg-yellow-400", text: "Playing", textColor: "text-yellow-700" }
      case "finished":
        return { color: "bg-gray-400", text: "Finished", textColor: "text-gray-700" }
    }
  }

  const getTypeConfig = (type: GameRoom["gameType"]) => {
    switch (type) {
      case "casual":
        return { icon: Play, color: "text-green-600", bg: "bg-green-50", border: "border-green-200" }
      case "ranked":
        return { icon: Trophy, color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" }
      case "tournament":
        return { icon: Crown, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" }
    }
  }

  const statusConfig = getStatusConfig(room.status)
  const typeConfig = getTypeConfig(room.gameType)
  const TypeIcon = typeConfig.icon
  const timeAgo = Math.floor((Date.now() - room.createdAt.getTime()) / 60000)

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-[1.02] rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-5 pb-3">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-purple-600 transition-colors">
                {room.name}
              </h3>
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7 border-2 border-white shadow-sm">
                  <AvatarImage src={room.host.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-700">
                    {room.host.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-gray-700 text-sm">{room.host.name}</div>
                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                    {room.host.rating}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${statusConfig.color}`} />
                <span className={`text-xs font-medium ${statusConfig.textColor}`}>{statusConfig.text}</span>
              </div>
              <div className={`p-1.5 rounded-lg ${typeConfig.bg} ${typeConfig.border} border`}>
                <TypeIcon className={`h-4 w-4 ${typeConfig.color}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="px-5 pb-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1 text-gray-500">
                <Users className="h-3 w-3" />
              </div>
              <div className="text-sm font-bold text-gray-900">
                {room.players}/{room.maxPlayers}
              </div>
              <div className="text-xs text-gray-500">Players</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1 text-gray-500">
                <Clock className="h-3 w-3" />
              </div>
              <div className="text-sm font-bold text-gray-900">{room.timeControl}</div>
              <div className="text-xs text-gray-500">Time</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1 text-gray-500">
                <Zap className="h-3 w-3" />
              </div>
              <div className="text-sm font-bold text-gray-900 capitalize">{room.gameType}</div>
              <div className="text-xs text-gray-500">Type</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-500">{timeAgo}m ago</span>
            {room.players === room.maxPlayers && <Badge className="bg-red-100 text-red-700 text-xs">Full</Badge>}
          </div>
          {room.status === "waiting" && room.players < room.maxPlayers ? (
            <Button
              onClick={() => onJoinRoom(room.id)}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl py-2.5 font-medium transition-all duration-200 hover:shadow-lg"
            >
              Join Game
            </Button>
          ) : room.status === "in-progress" ? (
            <Button variant="outline" className="w-full rounded-xl py-2.5" disabled>
              <Play className="h-4 w-4 mr-2" />
              Game in Progress
            </Button>
          ) : (
            <Button variant="outline" className="w-full rounded-xl py-2.5" disabled>
              Room Full
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
