"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, RefreshCw } from "lucide-react"

interface SearchAndFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  filterType: "all" | "casual" | "ranked" | "tournament"
  onFilterChange: (value: "all" | "casual" | "ranked" | "tournament") => void
  roomCount: number
}

export function SearchAndFilters({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterChange,
  roomCount,
}: SearchAndFiltersProps) {
  const filters = [
    { value: "all", label: "All Games", color: "bg-gray-100 text-gray-700 hover:bg-gray-200" },
    { value: "casual", label: "Casual", color: "bg-green-100 text-green-700 hover:bg-green-200" },
    { value: "ranked", label: "Ranked", color: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" },
    { value: "tournament", label: "Tournament", color: "bg-purple-100 text-purple-700 hover:bg-purple-200" },
  ]

  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search rooms or players..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl bg-white/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <div className="flex gap-1">
                {filters.map((filter) => (
                  <Badge
                    key={filter.value}
                    variant={filterType === filter.value ? "default" : "secondary"}
                    className={`cursor-pointer transition-all duration-200 ${
                      filterType === filter.value ? "bg-purple-600 text-white hover:bg-purple-700" : filter.color
                    }`}
                    onClick={() => onFilterChange(filter.value as any)}
                  >
                    {filter.label}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-gray-600 border-gray-300">
                {roomCount} rooms
              </Badge>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 rounded-lg">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
