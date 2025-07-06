"use client"

import { useEffect } from "react"
import { Navbar } from "@/components/layout/navbar"
import { useLeaderboardStore } from "@/stores/leaderboard-store"

// Import new leaderboard components
import { LeaderboardFilters } from "@/components/leaderboard/LeaderboardFilters"
import { LeaderboardPodium } from "@/components/leaderboard/LeaderboardPodium"
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable"
import { Trophy } from "lucide-react"

export default function LeaderboardPage() {
  const { leaderboard, loading, filters, fetchLeaderboard, setFilters } = useLeaderboardStore()

  useEffect(() => {
    fetchLeaderboard()
  }, [fetchLeaderboard, filters]) // Re-fetch when filters change

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters({ [filterName]: value })
  }

  const topThree = leaderboard.slice(0, 3)
  const restOfLeaderboard = leaderboard.slice(3)

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-[#e2e8f0] dark group/design-root overflow-x-hidden"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />

        <div className="px-4 md:px-8 lg:px-16 xl:px-20 flex flex-1 justify-center py-8">
          <div className="layout-content-container flex flex-col max-w-5xl flex-1 w-full">
            {/* Header and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">Leaderboard</h1>
                <p className="text-[#9eb7a8]">Top players in Chess Arena</p>
              </div>
              <LeaderboardFilters filters={filters} onFilterChange={handleFilterChange} />
            </div>

            {loading ? (
              <div className="text-center py-16">
                <div className="text-white text-lg animate-pulse">Loading leaderboard...</div>
                {/* You could add a spinner icon here */}
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="text-center py-16 bg-[#1c2620] border border-[#29382f] rounded-lg">
                <Trophy className="h-12 w-12 text-[#38e07b] mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">No Rankings Yet</h2>
                <p className="text-[#9eb7a8]">It looks like there are no players in this leaderboard category. <br/>Try adjusting the filters or check back later!</p>
              </div>
            ) : (
              <>
                <LeaderboardPodium topThree={topThree} />
                <LeaderboardTable players={restOfLeaderboard} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
