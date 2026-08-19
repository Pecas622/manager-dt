import { useState } from "react"
import { Link } from "react-router-dom"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Pencil, Plus, Trash2, Trophy } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { useDeleteTournament, useTournaments } from "@/hooks/useTournaments"
import type { Tournament } from "@/types/database"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TournamentFormDialog } from "@/components/matches/TournamentFormDialog"

export function TournamentsPage() {
  const { role } = useAuth()
  const { data: tournaments, isLoading } = useTournaments()
  const deleteTournament = useDeleteTournament()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Tournament | undefined>(undefined)

  function openCreate() {
    setEditing(undefined)
    setFormOpen(true)
  }

  function openEdit(t: Tournament) {
    setEditing(t)
    setFormOpen(true)
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar el torneo "${name}"? Los partidos no se borran, quedan sin torneo asignado.`)) return
    try {
      await deleteTournament.mutateAsync(id)
      toast.success("Torneo eliminado")
    } catch {
      toast.error("No se pudo eliminar")
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Partidos</h1>
        {role === "dt" && (
          <Button className="h-10" onClick={openCreate}>
            <Plus /> Nuevo torneo
          </Button>
        )}
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      )}

      {!isLoading && tournaments?.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Todavía no cargaste ningún torneo.
        </p>
      )}

      <div className="flex flex-col gap-2">
        {tournaments?.map((t) => (
          <Card key={t.id} className="transition-colors hover:bg-accent/40">
            <CardContent className="flex items-center gap-3">
              <Link to={`/torneos/${t.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Trophy className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{t.name}</p>
                  {(t.start_date || t.end_date) && (
                    <p className="text-sm text-muted-foreground">
                      {t.start_date ? format(parseISO(t.start_date), "d MMM", { locale: es }) : "?"}
                      {" – "}
                      {t.end_date ? format(parseISO(t.end_date), "d MMM yyyy", { locale: es }) : "?"}
                    </p>
                  )}
                </div>
              </Link>
              {role === "dt" && (
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(t)}
                    aria-label="Editar"
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(t.id, t.name)}
                    className="text-destructive hover:text-destructive"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <TournamentFormDialog open={formOpen} onOpenChange={setFormOpen} tournament={editing} />
    </div>
  )
}
