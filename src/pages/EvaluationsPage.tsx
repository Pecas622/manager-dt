import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { ClipboardPlus, Search } from "lucide-react"
import { useEvaluations } from "@/hooks/useEvaluations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function EvaluationsPage() {
  const { data: evaluations, isLoading } = useEvaluations()
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    if (!evaluations) return []
    const term = search.trim().toLowerCase()
    if (!term) return evaluations
    return evaluations.filter((ev) =>
      `${ev.player?.first_name} ${ev.player?.last_name}`.toLowerCase().includes(term)
    )
  }, [evaluations, search])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Evaluaciones</h1>
        <Button render={<Link to="/evaluations/new" />} className="h-10">
          <ClipboardPlus /> Nueva evaluación
        </Button>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por jugador..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 pl-9"
        />
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Todavía no hay evaluaciones cargadas.
        </p>
      )}

      <div className="flex flex-col gap-2">
        {filtered.map((ev) => (
          <Link key={ev.id} to={`/evaluations/${ev.id}`}>
            <Card className="transition-colors hover:bg-accent/40">
              <CardContent className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">
                    {ev.player?.first_name} {ev.player?.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(parseISO(ev.date), "d MMM yyyy", { locale: es })}
                    {ev.coach ? ` · ${ev.coach}` : ""}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
