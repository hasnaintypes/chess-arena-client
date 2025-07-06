"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface CreateRoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateRoom: (roomData: {
    name: string
    timeControl: string
    gameType: "casual" | "ranked" | "tournament"
    maxPlayers: number
  }) => void
}

export function CreateRoomDialog({ open, onOpenChange, onCreateRoom }: CreateRoomDialogProps) {
  const [roomName, setRoomName] = useState("")
  const [timeControl, setTimeControl] = useState("5+3")
  const [gameType, setGameType] = useState<"casual" | "ranked" | "tournament">("casual")
  const [maxPlayers, setMaxPlayers] = useState(2)

  const handleSubmit = () => {
    if (!roomName.trim()) return
    onCreateRoom({ name: roomName, timeControl, gameType, maxPlayers })
    setRoomName("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#111714] border border-[#3d5245] text-white">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Create New Room</DialogTitle>
          <DialogDescription className="text-[#9eb7a8]">
            Set up your chess game and wait for opponents to join
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="room-name" className="text-white text-sm font-medium">
              Room Name
            </Label>
            <Input
              id="room-name"
              placeholder="Enter room name..."
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="bg-[#29382f] border-[#3d5245] text-white placeholder:text-[#9eb7a8] focus:border-[#38e07b]"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white text-sm font-medium">Time Control</Label>
            <Select value={timeControl} onValueChange={setTimeControl}>
              <SelectTrigger className="bg-[#29382f] border-[#3d5245] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#29382f] border-[#3d5245] text-white">
                <SelectItem value="1+0">Bullet (1+0)</SelectItem>
                <SelectItem value="3+0">Blitz (3+0)</SelectItem>
                <SelectItem value="5+3">Blitz (5+3)</SelectItem>
                <SelectItem value="10+0">Rapid (10+0)</SelectItem>
                <SelectItem value="15+10">Rapid (15+10)</SelectItem>
                <SelectItem value="30+0">Classical (30+0)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-white text-sm font-medium">Game Type</Label>
            <Select value={gameType} onValueChange={(value: "casual" | "ranked" | "tournament") => setGameType(value)}>
              <SelectTrigger className="bg-[#29382f] border-[#3d5245] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#29382f] border-[#3d5245] text-white">
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="ranked">Ranked</SelectItem>
                <SelectItem value="tournament">Tournament</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-white text-sm font-medium">Max Players</Label>
            <Select value={maxPlayers.toString()} onValueChange={(value) => setMaxPlayers(Number.parseInt(value))}>
              <SelectTrigger className="bg-[#29382f] border-[#3d5245] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#29382f] border-[#3d5245] text-white">
                <SelectItem value="2">2 Players</SelectItem>
                <SelectItem value="4">4 Players</SelectItem>
                <SelectItem value="8">8 Players</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} className="w-full bg-[#38e07b] text-[#111714] hover:bg-[#2bc464] font-bold">
            Create Room
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
