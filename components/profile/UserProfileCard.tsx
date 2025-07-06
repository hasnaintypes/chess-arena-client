"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import type { User } from "@/types/user"

interface UserProfileCardProps {
  user: User
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader className="items-center text-center">
        <Avatar className="h-24 w-24 mb-4 border-2 border-primary">
          <AvatarImage src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${user.username}`} alt={user.username} />
          <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <CardTitle className="text-2xl font-bold">{user.username}</CardTitle>
        {user.title && (
          <Badge variant="secondary" className="mt-1">{user.title}</Badge>
        )}
        <p className="text-muted-foreground">Rating: {user.rating}</p>
      </CardHeader>
      <CardContent className="text-center">
        <div className="flex items-center justify-center text-sm text-muted-foreground mb-2">
          <Calendar className="mr-2 h-4 w-4" />
          Joined: {new Date(user.joinDate).toLocaleDateString()}
        </div>
        {user.country && (
          <p className="text-sm text-muted-foreground">Country: {user.country}</p>
        )}
        {/* Add other relevant user info here if needed */}
      </CardContent>
    </Card>
  )
}