"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, type LucideIcon } from "lucide-react"

interface Achievement {
  id: string
  name: string
  description: string
  icon: LucideIcon
  color: string
  rarity: string
  unlockedAt: Date
}

interface AchievementsListProps {
  achievements: Achievement[]
}

export function AchievementsList({ achievements }: AchievementsListProps) {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "border-yellow-400 bg-yellow-400/10"
      case "epic":
        return "border-purple-400 bg-purple-400/10"
      case "rare":
        return "border-blue-400 bg-blue-400/10"
      default:
        return "border-gray-400 bg-gray-400/10"
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="mr-2 h-5 w-5" /> Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        {achievements.length === 0 ? (
          <p className="text-muted-foreground">No achievements unlocked yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className={`p-4 rounded-lg border ${getRarityColor(achievement.rarity)} flex items-start space-x-3`}>
                <achievement.icon className={`h-8 w-8 ${achievement.color}`} />
                <div>
                  <h4 className="font-semibold">{achievement.name}</h4>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()} <Badge variant="outline" className="ml-1 capitalize text-xs">{achievement.rarity}</Badge>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}