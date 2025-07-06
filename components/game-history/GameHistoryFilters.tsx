"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface GameHistoryFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  resultFilter: string
  setResultFilter: (filter: string) => void
  gameTypeFilter: string
  setGameTypeFilter: (filter: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
}

export function GameHistoryFilters({
  searchTerm,
  setSearchTerm,
  resultFilter,
  setResultFilter,
  gameTypeFilter,
  setGameTypeFilter,
  sortBy,
  setSortBy,
}: GameHistoryFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9eb7a8] h-4 w-4" />
        <Input
          placeholder="Search by opponent name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-[#29382f] border-[#3d5245] text-white placeholder:text-[#9eb7a8]"
        />
      </div>

      <Select value={resultFilter} onValueChange={setResultFilter}>
        <SelectTrigger className="w-full lg:w-40 bg-[#29382f] border-[#3d5245] text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-[#29382f] border-[#3d5245] text-white">
          <SelectItem value="all">All Results</SelectItem>
          <SelectItem value="white-wins">Wins</SelectItem>
          <SelectItem value="black-wins">Losses</SelectItem>
          <SelectItem value="draw">Draws</SelectItem>
        </SelectContent>
      </Select>

      <Select value={gameTypeFilter} onValueChange={setGameTypeFilter}>
        <SelectTrigger className="w-full lg:w-40 bg-[#29382f] border-[#3d5245] text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-[#29382f] border-[#3d5245] text-white">
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="ranked">Ranked</SelectItem>
          <SelectItem value="casual">Casual</SelectItem>
          <SelectItem value="tournament">Tournament</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-full lg:w-40 bg-[#29382f] border-[#3d5245] text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-[#29382f] border-[#3d5245] text-white">
          <SelectItem value="date">Sort by Date</SelectItem>
          {/* Add other sort options if needed */}
        </SelectContent>
      </Select>
    </div>
  )
}