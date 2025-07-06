"use client"

import { SavedGamesList } from "@/components/replay/saved-games-list"
import { Navbar } from "@/components/layout/navbar"

export default function ReplayPage() {
  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#111714] dark group/design-root overflow-x-hidden"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />

        <div className="px-4 md:px-20 lg:px-40 flex flex-1 justify-center py-8">
          <div className="layout-content-container flex flex-col max-w-6xl flex-1">
            <SavedGamesList />
          </div>
        </div>
      </div>
    </div>
  )
}
