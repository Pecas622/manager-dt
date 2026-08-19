import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { PositionBadge } from "@/components/players/PositionBadge"
import type { Player } from "@/types/database"

function initials(player: Player) {
  return `${player.first_name[0] ?? ""}${player.last_name[0] ?? ""}`.toUpperCase()
}

export function PlayerCard({ player }: { player: Player }) {
  return (
    <Link to={`/players/${player.id}`}>
      <Card className="transition-colors hover:bg-accent/40">
        <CardContent className="flex items-center gap-3">
          <Avatar size="lg">
            {player.photo_url && <AvatarImage src={player.photo_url} alt="" />}
            <AvatarFallback>{initials(player)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate font-medium">
                {player.first_name} {player.last_name}
              </p>
              {player.status === "Inactivo" && (
                <Badge variant="secondary" className="shrink-0">
                  Inactivo
                </Badge>
              )}
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-mono">#{player.jersey_number ?? "-"}</span>
              <PositionBadge position={player.position} />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
