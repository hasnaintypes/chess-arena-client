"use client"

import { RoomCard } from "./room-card"

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

interface RoomGridProps {
  rooms: GameRoom[]
  onJoinRoom: (roomId: string) => void
}

export function RoomGrid({ rooms, onJoinRoom }: RoomGridProps) {
  if (rooms.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center">
          <div className="text-4xl">♟️</div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No rooms found</h3>
        <p className="text-gray-600 mb-6">Be the first to create a room and start playing!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} onJoinRoom={onJoinRoom} />
      ))}
    </div>
  )
}
