import { useMemo, useState } from "react"
import { Pencil, Plus, Search, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useDeleteExercise, useExercises } from "@/hooks/useExercises"
import { EXERCISE_CATEGORIES } from "@/types/domain"
import type { TrainingExercise } from "@/types/database"
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
import { ExerciseCard } from "@/components/exercises/ExerciseCard"
import { ExerciseFormDialog } from "@/components/exercises/ExerciseFormDialog"

export function ExerciseLibraryPage() {
  const { data: exercises, isLoading } = useExercises()
  const deleteExercise = useDeleteExercise()
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingExercise, setEditingExercise] = useState<TrainingExercise | undefined>()

  const filtered = useMemo(() => {
    if (!exercises) return []
    const term = search.trim().toLowerCase()
    return exercises.filter((e) => {
      if (category !== "all" && e.category !== category) return false
      if (!term) return true
      return e.name.toLowerCase().includes(term)
    })
  }, [exercises, search, category])

  function openCreate() {
    setEditingExercise(undefined)
    setDialogOpen(true)
  }

  function openEdit(exercise: TrainingExercise) {
    setEditingExercise(exercise)
    setDialogOpen(true)
  }

  async function handleDelete(exercise: TrainingExercise) {
    if (!confirm(`¿Eliminar "${exercise.name}" de la biblioteca?`)) return
    try {
      await deleteExercise.mutateAsync(exercise.id)
      toast.success("Ejercicio eliminado")
    } catch {
      toast.error("No se pudo eliminar. Puede estar usado en algún entrenamiento.")
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Biblioteca de ejercicios</h1>
        <Button onClick={openCreate} className="h-10">
          <Plus /> Nuevo ejercicio
        </Button>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar ejercicio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 pl-9"
          />
        </div>
        <Select value={category} onValueChange={(v) => setCategory(v ?? "all")}>
          <SelectTrigger className="h-11 sm:w-48">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {EXERCISE_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No se encontraron ejercicios con estos filtros.
        </p>
      )}

      <div className="flex flex-col gap-2">
        {filtered.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            action={
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(exercise)} aria-label="Editar">
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(exercise)}
                  aria-label="Eliminar"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            }
          />
        ))}
      </div>

      <ExerciseFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        exercise={editingExercise}
      />
    </div>
  )
}
