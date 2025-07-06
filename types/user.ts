export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  rating: number
  gamesPlayed: number
  gamesWon: number
  gamesLost: number
  gamesDrawn: number
  joinDate: Date
  lastActive: Date
  country?: string
  title?: string
}

export interface LeaderboardEntry {
  rank: number
  user: User
  ratingChange: number
  streak: number
}
