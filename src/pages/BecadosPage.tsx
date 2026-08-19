import { useMemo, useState } from "react"
import { Plus, Search, Trash2, UserRoundPen } from "lucide-react"
import { toast } from "sonner"
import { useBecados, useDeleteBecado } from "@/hooks/useBecados"
import type { Becado } from "@/types/database"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { BecadoFormDialog } from "@/components/becados/BecadoFormDialog"

export function BecadosPage() {
  const { data: becados, isLoading } = useBecados()
  const deleteBecado = useDeleteBecado()
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBecado, setEditingBecado] = useState<Becado | undefined>()

  const filtered = useMemo(() => {
    if (!becados) return []
    const term = search.trim().toLowerCase()
    if (!term) return becados
    return becados.filter((b) =>
      `${b.first_name} ${b.last_name} ${b.dni}`.toLowerCase().includes(term)
    )
  }, [becados, search])

  function openCreate() {
    setEditingBecado(undefined)
    setDialogOpen(true)
  }

  function openEdit(becado: Becado) {
    setEditingBecado(becado)
    setDialogOpen(true)
  }

  async function handleDelete(becado: Becado) {
    if (!confirm(`¿Eliminar a ${becado.first_name} ${becado.last_name} de la lista de accesos?`)) return
    try {
      await deleteBecado.mutateAsync(becado.id)
      toast.success("Eliminado")
    } catch {
      toast.error("No se pudo eliminar")
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Ingreso</h1>
        <Button onClick={openCreate} className="h-10">
          <Plus /> Nueva persona
        </Button>
      </div>
      <p className="-mt-2 text-sm text-muted-foreground">
        Becados y socios con cuota — la misma lista que usa seguridad para
        buscar por DNI en la puerta.
      </p>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre o DNI..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 pl-9"
        />
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Todavía no cargaste a nadie.
        </p>
      )}

      <div className="flex flex-col gap-2">
        {filtered.map((becado) => (
          <Card key={becado.id}>
            <CardContent className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium">
                    {becado.first_name} {becado.last_name}
                  </p>
                  <Badge
                    variant="outline"
                    className={
                      becado.type === "Becado"
                        ? "border-chart-1/40 text-chart-1"
                        : "border-chart-3/40 text-chart-3"
                    }
                  >
                    {becado.type}
                  </Badge>
                  {becado.status === "Inactivo" && (
                    <Badge variant="secondary">Inactivo</Badge>
                  )}
                </div>
                <p className="font-mono text-sm text-muted-foreground">{becado.dni}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEdit(becado)}
                  aria-label="Editar"
                >
                  <UserRoundPen className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(becado)}
                  aria-label="Eliminar"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <BecadoFormDialog open={dialogOpen} onOpenChange={setDialogOpen} becado={editingBecado} />
    </div>
  )
}
