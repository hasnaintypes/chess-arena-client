"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

interface GameRoom {
  id: string
  name: string
  players: number
  maxPlayers: number
  status: "open" | "in-progress" | "closed"
  timeControl: string
  gameType: "casual" | "ranked" | "tournament"
}

interface RoomsTableProps {
  rooms: GameRoom[]
  onJoinRoom: (roomId: string) => void
}

export function RoomsTable({ rooms, onJoinRoom }: RoomsTableProps) {
  const getStatusButton = (status: GameRoom["status"]) => {
    switch (status) {
      case "open":
        return (
          <Button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#29382f] text-white text-sm font-medium leading-normal w-full hover:bg-[#3d5245] border-0">
            <span className="truncate">Open</span>
          </Button>
        )
      case "in-progress":
        return (
          <Button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#29382f] text-white text-sm font-medium leading-normal w-full hover:bg-[#3d5245] border-0">
            <span className="truncate">In Progress</span>
          </Button>
        )
      case "closed":
        return (
          <Button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#29382f] text-white text-sm font-medium leading-normal w-full hover:bg-[#3d5245] border-0">
            <span className="truncate">Closed</span>
          </Button>
        )
    }
  }

  const getActionButton = (room: GameRoom) => {
    if (room.status === "open") {
      return (
        <Button
          variant="ghost"
          className="text-[#9eb7a8] hover:text-white hover:bg-[#29382f] p-0 h-auto font-bold"
          onClick={() => onJoinRoom(room.id)}
        >
          Join
        </Button>
      )
    } else {
      return (
        <Link href={`/room/${room.id}`}>
          <Button variant="ghost" className="text-[#9eb7a8] hover:text-white hover:bg-[#29382f] p-0 h-auto font-bold">
            View
          </Button>
        </Link>
      )
    }
  }

  return (
    <div className="px-4 py-3">
      <div className="overflow-x-auto">
        <div className="flex overflow-hidden rounded-lg border border-[#3d5245] bg-[#111714] min-w-[600px]">
          <table className="flex-1">
            <thead>
              <tr className="bg-[#1c2620]">
                <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal min-w-[200px]">
                  Game Name
                </th>
                <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal min-w-[100px]">
                  Players
                </th>
                <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal min-w-[120px]">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-white text-[#9eb7a8] text-sm font-medium leading-normal min-w-[100px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id} className="border-t border-t-[#3d5245] hover:bg-[#1a1f1c] transition-colors">
                  <td className="h-[72px] px-4 py-2 text-white text-sm font-normal leading-normal">
                    <div>
                      <div className="font-medium">{room.name}</div>
                      <div className="text-[#9eb7a8] text-xs mt-1">
                        {room.timeControl} • {room.gameType}
                      </div>
                    </div>
                  </td>
                  <td className="h-[72px] px-4 py-2 text-[#9eb7a8] text-sm font-normal leading-normal">
                    {room.players}/{room.maxPlayers}
                  </td>
                  <td className="h-[72px] px-4 py-2 text-sm font-normal leading-normal">
                    {getStatusButton(room.status)}
                  </td>
                  <td className="h-[72px] px-4 py-2 text-[#9eb7a8] text-sm font-bold leading-normal tracking-[0.015em]">
                    {getActionButton(room)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
