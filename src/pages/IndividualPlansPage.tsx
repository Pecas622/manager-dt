import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Archive, ArchiveRestore, Copy, Pencil, Plus, Search } from "lucide-react"
import { toast } from "sonner"
import {
  useDuplicateIndividualPlan,
  useIndividualPlans,
  useUpdateIndividualPlan,
} from "@/hooks/useIndividualPlans"
import { INDIVIDUAL_PLAN_FOCUS_AREAS, INDIVIDUAL_PLAN_TYPES } from "@/types/domain"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IndividualPlanCard } from "@/components/individual-plans/IndividualPlanCard"

export function IndividualPlansPage() {
  const { data: plans, isLoading } = useIndividualPlans()
  const duplicatePlan = useDuplicateIndividualPlan()
  const updatePlan = useUpdateIndividualPlan()
  const [search, setSearch] = useState("")
  const [type, setType] = useState("all")
  const [focusArea, setFocusArea] = useState("all")
  const [showArchived, setShowArchived] = useState(false)

  const filtered = useMemo(() => {
    if (!plans) return []
    const term = search.trim().toLowerCase()
    return plans.filter((p) => {
      if (!showArchived && p.status === "Archivada") return false
      if (type !== "all" && p.type !== type) return false
      if (focusArea !== "all" && p.focus_area !== focusArea) return false
      if (!term) return true
      const haystack = `${p.name} ${p.player?.first_name ?? ""} ${p.player?.last_name ?? ""}`.toLowerCase()
      return haystack.includes(term)
    })
  }, [plans, search, type, focusArea, showArchived])

  async function handleDuplicate(id: string) {
    try {
      await duplicatePlan.mutateAsync(id)
      toast.success("Plan duplicado")
    } catch {
      toast.error("No se pudo duplicar")
    }
  }

  async function handleToggleArchive(id: string, status: "Activa" | "Archivada") {
    try {
      await updatePlan.mutateAsync({
        id,
        input: { status: status === "Activa" ? "Archivada" : "Activa" },
      })
      toast.success(status === "Activa" ? "Plan archivado" : "Plan reactivado")
    } catch {
      toast.error("No se pudo actualizar")
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Planes individuales</h1>
        <Button render={<Link to="/planes/new" />} className="h-10">
          <Plus /> Nuevo plan
        </Button>
      </div>
      <p className="-mt-2 text-sm text-muted-foreground">
        Programas físicos individuales por jugador (fuerza, movilidad,
        rehabilitación, resistencia), en paralelo al entrenamiento grupal.
      </p>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o jugador..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={type} onValueChange={(v) => setType(v ?? "all")}>
            <SelectTrigger className="h-11 flex-1 sm:w-40">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              {INDIVIDUAL_PLAN_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={focusArea} onValueChange={(v) => setFocusArea(v ?? "all")}>
            <SelectTrigger className="h-11 flex-1 sm:w-40">
              <SelectValue placeholder="Zona" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las zonas</SelectItem>
              {INDIVIDUAL_PLAN_FOCUS_AREAS.map((z) => (
                <SelectItem key={z} value={z}>
                  {z}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          checked={showArchived}
          onChange={(e) => setShowArchived(e.target.checked)}
          className="size-4 rounded border-input accent-primary"
        />
        Mostrar archivadas
      </label>

      {isLoading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No se encontraron planes con estos filtros.
        </p>
      )}

      <div className="flex flex-col gap-2">
        {filtered.map((plan) => (
          <IndividualPlanCard
            key={plan.id}
            plan={plan}
            exerciseCount={plan.individual_plan_exercises.length}
            action={
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="icon" render={<Link to={`/planes/${plan.id}/edit`} aria-label="Editar" />}>
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDuplicate(plan.id)}
                  aria-label="Duplicar"
                >
                  <Copy className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleToggleArchive(plan.id, plan.status)}
                  aria-label={plan.status === "Activa" ? "Archivar" : "Reactivar"}
                >
                  {plan.status === "Activa" ? (
                    <Archive className="size-4" />
                  ) : (
                    <ArchiveRestore className="size-4" />
                  )}
                </Button>
              </div>
            }
          />
        ))}
      </div>
    </div>
  )
}
