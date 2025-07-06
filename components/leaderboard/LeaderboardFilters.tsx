"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LeaderboardFiltersProps {
  filters: {
    timeframe: string
    timeControl: string
  }
  onFilterChange: (filterName: string, value: string) => void
}

export function LeaderboardFilters({ filters, onFilterChange }: LeaderboardFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Select value={filters.timeframe} onValueChange={(value) => onFilterChange("timeframe", value)}>
        <SelectTrigger className="w-full sm:w-40 bg-[#29382f] border-[#3d5245] text-white">
          <SelectValue placeholder="Timeframe" />
        </SelectTrigger>
        <SelectContent className="bg-[#29382f] border-[#3d5245] text-white">
          <SelectItem value="all-time">All Time</SelectItem>
          <SelectItem value="monthly">This Month</SelectItem>
          <SelectItem value="weekly">This Week</SelectItem>
          <SelectItem value="daily">Today</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.timeControl} onValueChange={(value) => onFilterChange("timeControl", value)}>
        <SelectTrigger className="w-full sm:w-40 bg-[#29382f] border-[#3d5245] text-white">
          <SelectValue placeholder="Time Control" />
        </SelectTrigger>
        <SelectContent className="bg-[#29382f] border-[#3d5245] text-white">
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="blitz">Blitz</SelectItem>
          <SelectItem value="bullet">Bullet</SelectItem>
          <SelectItem value="rapid">Rapid</SelectItem>
          <SelectItem value="classical">Classical</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}