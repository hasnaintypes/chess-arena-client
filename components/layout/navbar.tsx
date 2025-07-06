"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, History, Settings, LogOut } from "lucide-react"
import { useAuthStore } from "@/stores/auth-store"

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#29382f] px-4 md:px-10 py-3">
      <div className="flex items-center gap-4 text-white">
        <div className="size-4">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <Link href="/lobby">
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] hover:text-[#9eb7a8] transition-colors">
            Chess Arena
          </h2>
        </Link>
      </div>

      <div className="flex flex-1 justify-end gap-4 md:gap-8">
        <div className="hidden md:flex items-center gap-9">
          <Link
            href="/leaderboard"
            className="text-white text-sm font-medium leading-normal hover:text-[#9eb7a8] transition-colors"
          >
            Leaderboard
          </Link>
          <Link
            href="/replay"
            className="text-white text-sm font-medium leading-normal hover:text-[#9eb7a8] transition-colors"
          >
            Replays
          </Link>
          <Link
            href="/tournaments"
            className="text-white text-sm font-medium leading-normal hover:text-[#9eb7a8] transition-colors"
          >
            Tournaments
          </Link>
        </div>

        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt="Profile" />
                  <AvatarFallback className="bg-[#29382f] text-white">
                    {user.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#1c2620] border-[#29382f] text-white" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user.username}</p>
                  <p className="w-[200px] truncate text-sm text-[#9eb7a8]">{user.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-[#29382f]" />
              <Link href={`/profile/${user.username}`}>
                <DropdownMenuItem className="hover:bg-[#29382f] focus:bg-[#29382f]">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
              </Link>
              <Link href="/game-history">
                <DropdownMenuItem className="hover:bg-[#29382f] focus:bg-[#29382f]">
                  <History className="mr-2 h-4 w-4" />
                  Game History
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem className="hover:bg-[#29382f] focus:bg-[#29382f]">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#29382f]" />
              <DropdownMenuItem className="hover:bg-[#29382f] focus:bg-[#29382f] text-red-400" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex gap-2">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:text-[#9eb7a8] hover:bg-[#29382f]">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-[#38e07b] text-[#111714] hover:bg-[#2bc464]">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
