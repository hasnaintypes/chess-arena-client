"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Trophy, RotateCcw, Home, Eye } from "lucide-react"
import Link from "next/link"

interface GameOverModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  result: "win" | "loss" | "draw"
  winner?: string
  onRematch: () => void
  gameRecord?: { id: string }
}

export function GameOverModal({ open, onOpenChange, result, winner, onRematch, gameRecord }: GameOverModalProps) {
  const getResultInfo = () => {
    switch (result) {
      case "win":
        return {
          title: "Victory! 🎉",
          description: "Congratulations! You won the game.",
          color: "text-green-400",
        }
      case "loss":
        return {
          title: "Defeat",
          description: `${winner} won the game. Better luck next time!`,
          color: "text-red-400",
        }
      case "draw":
        return {
          title: "Draw",
          description: "The game ended in a draw. Well played!",
          color: "text-yellow-400",
        }
    }
  }

  const resultInfo = getResultInfo()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#111714] border border-[#3d5245] text-white">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-[#1c2620] rounded-full">
              <Trophy className={`h-8 w-8 ${resultInfo.color}`} />
            </div>
          </div>
          <DialogTitle className={`text-2xl ${resultInfo.color}`}>{resultInfo.title}</DialogTitle>
          <DialogDescription className="text-[#9eb7a8] text-center">{resultInfo.description}</DialogDescription>
        </DialogHeader>

        <div className="bg-[#1c2620] rounded-lg p-4 my-4">
          <div className="text-center">
            <div className="text-[#9eb7a8] text-sm mb-2">Game Statistics</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-white font-medium">Moves</div>
                <div className="text-[#9eb7a8]">42</div>
              </div>
              <div>
                <div className="text-white font-medium">Duration</div>
                <div className="text-[#9eb7a8]">15:32</div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2">
          <div className="flex gap-2 w-full">
            <Button onClick={onRematch} className="flex-1 bg-[#38e07b] text-[#111714] hover:bg-[#2bc464]">
              <RotateCcw className="h-4 w-4 mr-2" />
              Rematch
            </Button>
            <Link href={`/replay/${gameRecord?.id || "current"}`}>
              <Button variant="outline" className="flex-1 bg-[#29382f] border-[#3d5245] text-white hover:bg-[#3d5245]">
                <Eye className="h-4 w-4 mr-2" />
                View Replay
              </Button>
            </Link>
          </div>
          <Link href="/lobby" className="w-full">
            <Button variant="ghost" className="w-full text-[#9eb7a8] hover:text-white hover:bg-[#29382f]">
              <Home className="h-4 w-4 mr-2" />
              Exit to Lobby
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
