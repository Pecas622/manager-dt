import { useMemo, useState } from "react"
import { Plus, Search } from "lucide-react"
import { usePhysicalExercises } from "@/hooks/useRoutines"
import type { PhysicalExercise } from "@/types/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PhysicalExerciseCard } from "@/components/routines/PhysicalExerciseCard"
import { PhysicalExerciseFormDialog } from "@/components/routines/PhysicalExerciseFormDialog"

export function PhysicalExercisePickerDialog({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (exercise: PhysicalExercise) => void
}) {
  const { data: exercises } = usePhysicalExercises()
  const [search, setSearch] = useState("")
  const [createOpen, setCreateOpen] = useState(false)

  const filtered = useMemo(() => {
    if (!exercises) return []
    const term = search.trim().toLowerCase()
    if (!term) return exercises
    return exercises.filter((e) => e.name.toLowerCase().includes(term))
  }, [exercises, search])

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[85vh] overflow-hidden sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Agregar ejercicio</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 pl-9"
              />
            </div>

            <Button variant="outline" className="h-11" onClick={() => setCreateOpen(true)}>
              <Plus /> Crear ejercicio nuevo
            </Button>

            <ScrollArea className="h-[45vh]">
              <div className="flex flex-col gap-2 pr-2">
                {filtered.map((exercise) => (
                  <PhysicalExerciseCard
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

      <PhysicalExerciseFormDialog
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
