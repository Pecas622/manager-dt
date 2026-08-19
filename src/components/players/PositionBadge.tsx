import { Badge } from "@/components/ui/badge"
import type { Position } from "@/types/domain"
import { cn } from "@/lib/utils"

const POSITION_STYLES: Record<Position, string> = {
  Arquero: "bg-chart-4/15 text-chart-4",
  Cierre: "bg-chart-5/15 text-chart-5",
  Ala: "bg-chart-1/15 text-chart-1",
  Pivot: "bg-chart-3/15 text-chart-3",
  Universal: "bg-chart-2/15 text-chart-2",
  "Poste-ala": "bg-violet-400/15 text-violet-600 dark:text-violet-400",
  "Sin definir": "bg-muted text-muted-foreground",
}

export function PositionBadge({ position }: { position: Position }) {
  return (
    <Badge
      variant="outline"
      className={cn("border-transparent font-semibold", POSITION_STYLES[position])}
    >
      {position}
    </Badge>
  )
}
