"use client"

import { Search, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface SearchSectionProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  gameTypeFilter: string
  onGameTypeChange: (value: string) => void
  playersFilter: string
  onPlayersChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
}

export function SearchSection({
  searchTerm,
  onSearchChange,
  gameTypeFilter,
  onGameTypeChange,
  playersFilter,
  onPlayersChange,
  statusFilter,
  onStatusChange,
}: SearchSectionProps) {
  return (
    <div className="space-y-4">
      <div className="px-4 py-3">
        <label className="flex flex-col min-w-40 h-12 w-full">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
            <div className="text-[#9eb7a8] flex border-none bg-[#29382f] items-center justify-center pl-4 rounded-l-lg border-r-0">
              <Search className="h-6 w-6" />
            </div>
            <Input
              placeholder="Search for games"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-[#29382f] focus:border-none h-full placeholder:text-[#9eb7a8] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </label>
      </div>
      <div className="flex gap-3 p-3 flex-wrap pr-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#29382f] pl-4 pr-2 hover:bg-[#3d5245] border-0">
              <p className="text-white text-sm font-medium leading-normal">
                {gameTypeFilter === "all" ? "Game Type" : gameTypeFilter}
              </p>
              <ChevronDown className="h-5 w-5 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#29382f] border-[#3d5245] text-white">
            <DropdownMenuItem onClick={() => onGameTypeChange("all")} className="hover:bg-[#3d5245]">
              All Types
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onGameTypeChange("casual")} className="hover:bg-[#3d5245]">
              Casual
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onGameTypeChange("ranked")} className="hover:bg-[#3d5245]">
              Ranked
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onGameTypeChange("tournament")} className="hover:bg-[#3d5245]">
              Tournament
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#29382f] pl-4 pr-2 hover:bg-[#3d5245] border-0">
              <p className="text-white text-sm font-medium leading-normal">
                {playersFilter === "all" ? "Players" : playersFilter}
              </p>
              <ChevronDown className="h-5 w-5 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#29382f] border-[#3d5245] text-white">
            <DropdownMenuItem onClick={() => onPlayersChange("all")} className="hover:bg-[#3d5245]">
              All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPlayersChange("1v1")} className="hover:bg-[#3d5245]">
              1v1
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPlayersChange("multiplayer")} className="hover:bg-[#3d5245]">
              Multiplayer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#29382f] pl-4 pr-2 hover:bg-[#3d5245] border-0">
              <p className="text-white text-sm font-medium leading-normal">
                {statusFilter === "all" ? "Status" : statusFilter}
              </p>
              <ChevronDown className="h-5 w-5 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#29382f] border-[#3d5245] text-white">
            <DropdownMenuItem onClick={() => onStatusChange("all")} className="hover:bg-[#3d5245]">
              All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange("open")} className="hover:bg-[#3d5245]">
              Open
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange("in-progress")} className="hover:bg-[#3d5245]">
              In Progress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange("closed")} className="hover:bg-[#3d5245]">
              Closed
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
