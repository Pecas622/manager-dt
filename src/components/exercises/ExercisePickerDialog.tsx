import { useMemo, useState } from "react"
import { Plus, Search } from "lucide-react"
import { useExercises } from "@/hooks/useExercises"
import { EXERCISE_CATEGORIES } from "@/types/domain"
import type { TrainingExercise } from "@/types/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ExerciseCard } from "@/components/exercises/ExerciseCard"
import { ExerciseFormDialog } from "@/components/exercises/ExerciseFormDialog"

export function ExercisePickerDialog({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (exercise: TrainingExercise) => void
}) {
  const { data: exercises } = useExercises()
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [createOpen, setCreateOpen] = useState(false)

  const filtered = useMemo(() => {
    if (!exercises) return []
    const term = search.trim().toLowerCase()
    return exercises.filter((e) => {
      if (category !== "all" && e.category !== category) return false
      if (!term) return true
      return e.name.toLowerCase().includes(term)
    })
  }, [exercises, search, category])

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[85vh] overflow-hidden sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Agregar ejercicio</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-11 pl-9"
                />
              </div>
              <Select value={category} onValueChange={(v) => setCategory(v ?? "all")}>
                <SelectTrigger className="h-11 w-32">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {EXERCISE_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" className="h-11" onClick={() => setCreateOpen(true)}>
              <Plus /> Crear ejercicio nuevo
            </Button>

            <ScrollArea className="h-[45vh]">
              <div className="flex flex-col gap-2 pr-2">
                {filtered.map((exercise) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    onClick={() => {
                      onSelect(exercise)
                      onOpenChange(false)
                    }}
                  />
                ))}
                {filtered.length === 0 && (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No hay ejercicios que coincidan.
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      <ExerciseFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSaved={(exercise) => {
          onSelect(exercise)
          onOpenChange(false)
        }}
      />
    </>
  )
}
