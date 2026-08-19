import { Link } from "react-router-dom"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Pencil, Plus, Trash2, Trophy } from "lucide-react"
import { toast } from "sonner"
import { useDeleteNational, useNationals } from "@/hooks/useNationals"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function NationalsPage() {
  const { data: nationals, isLoading } = useNationals()
  const deleteNational = useDeleteNational()

  async function handleDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar "${name}"? Se borra todo su cronograma, gastos y pagos.`)) return
    try {
      await deleteNational.mutateAsync(id)
      toast.success("Nacional eliminado")
    } catch {
      toast.error("No se pudo eliminar")
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Nacional</h1>
        <Button render={<Link to="/nationals/new" />} className="h-10">
          <Plus /> Nuevo Nacional
        </Button>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      )}

      {!isLoading && nationals?.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Todavía no cargaste ningún Nacional.
        </p>
      )}

      <div className="flex flex-col gap-2">
        {nationals?.map((n) => (
          <Card key={n.id} className="transition-colors hover:bg-accent/40">
            <CardContent className="flex items-center gap-3">
              <Link to={`/nationals/${n.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Trophy className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{n.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {n.city ? `${n.city} · ` : ""}
                    {format(parseISO(n.start_date), "d MMM", { locale: es })} –{" "}
                    {format(parseISO(n.end_date), "d MMM yyyy", { locale: es })}
                  </p>
                </div>
              </Link>
              <div className="flex shrink-0 gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  render={<Link to={`/nationals/${n.id}/edit`} aria-label="Editar" />}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(n.id, n.name)}
                  className="text-destructive hover:text-destructive"
                  aria-label="Eliminar"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
