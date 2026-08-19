import { useMemo, useState } from "react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Plus, Ruler, Search, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { summarizeReps, useDeletePhysicalTest, usePhysicalTests } from "@/hooks/usePhysicalTests"
import { JUMP_MS_UNIT } from "@/types/domain"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PhysicalTestFormDialog } from "@/components/physical-tests/PhysicalTestFormDialog"

export function PhysicalTestsPage() {
  const { data: tests, isLoading } = usePhysicalTests()
  const deleteTest = useDeletePhysicalTest()
  const [search, setSearch] = useState("")
  const [testName, setTestName] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)

  const testNames = useMemo(() => {
    const set = new Set((tests ?? []).map((t) => t.test_name))
    return Array.from(set).sort()
  }, [tests])

  const filtered = useMemo(() => {
    if (!tests) return []
    const term = search.trim().toLowerCase()
    return tests.filter((t) => {
      if (testName !== "all" && t.test_name !== testName) return false
      if (!term) return true
      return `${t.player?.first_name} ${t.player?.last_name}`.toLowerCase().includes(term)
    })
  }, [tests, search, testName])

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este registro?")) return
    try {
      await deleteTest.mutateAsync(id)
      toast.success("Registro eliminado")
    } catch {
      toast.error("No se pudo eliminar")
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Tests físicos</h1>
        <Button onClick={() => setDialogOpen(true)} className="h-10">
          <Plus /> Nuevo registro
        </Button>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por jugador..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 pl-9"
          />
        </div>
        <Select value={testName} onValueChange={(v) => setTestName(v ?? "all")}>
          <SelectTrigger className="h-11 sm:w-56">
            <SelectValue placeholder="Test" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tests</SelectItem>
            {testNames.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
          Todavía no hay tests registrados.
        </p>
      )}

      <div className="flex flex-col gap-2">
        {filtered.map((test) => (
          <Card key={test.id}>
            <CardContent className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Ruler className="size-4.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">
                    {test.player?.first_name} {test.player?.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {test.test_name} · {format(parseISO(test.date), "d MMM yyyy", { locale: es })}
                    {test.reps && test.reps.length > 0 ? ` · ${test.reps.length} rep.` : ""}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <div className="text-right">
                  <p className="text-base font-semibold leading-tight">
                    {test.value}
                    {test.unit ? ` ${test.unit}` : ""}
                  </p>
                  {test.reps && test.reps.length > 0 && (() => {
                    const { bestMs } = summarizeReps(test.reps)
                    return bestMs != null ? (
                      <p className="text-xs leading-tight text-muted-foreground">
                        {bestMs.toFixed(0)} {JUMP_MS_UNIT}
                      </p>
                    ) : null
                  })()}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(test.id)}
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

      <PhysicalTestFormDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
