import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Pencil, Plus, Search, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  useDeletePhysicalExercise,
  useDeleteRoutine,
  usePhysicalExercises,
  useRoutines,
} from "@/hooks/useRoutines"
import type { PhysicalExercise } from "@/types/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PhysicalExerciseCard } from "@/components/routines/PhysicalExerciseCard"
import { PhysicalExerciseFormDialog } from "@/components/routines/PhysicalExerciseFormDialog"

export function RoutinesPage() {
  const { data: routines, isLoading: routinesLoading } = useRoutines()
  const deleteRoutine = useDeleteRoutine()
  const { data: exercises, isLoading: exercisesLoading } = usePhysicalExercises()
  const deleteExercise = useDeletePhysicalExercise()
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingExercise, setEditingExercise] = useState<PhysicalExercise | undefined>()

  const filteredExercises = useMemo(() => {
    if (!exercises) return []
    const term = search.trim().toLowerCase()
    if (!term) return exercises
    return exercises.filter((e) => e.name.toLowerCase().includes(term))
  }, [exercises, search])

  async function handleDeleteRoutine(id: string, name: string) {
    if (!confirm(`¿Eliminar la rutina "${name}"?`)) return
    try {
      await deleteRoutine.mutateAsync(id)
      toast.success("Rutina eliminada")
    } catch {
      toast.error("No se pudo eliminar")
    }
  }

  async function handleDeleteExercise(exercise: PhysicalExercise) {
    if (!confirm(`¿Eliminar "${exercise.name}" de la biblioteca?`)) return
    try {
      await deleteExercise.mutateAsync(exercise.id)
      toast.success("Ejercicio eliminado")
    } catch {
      toast.error("No se pudo eliminar. Puede estar usado en alguna rutina.")
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Rutinas</h1>

      <Tabs defaultValue="rutinas">
        <TabsList>
          <TabsTrigger value="rutinas">Rutinas</TabsTrigger>
          <TabsTrigger value="ejercicios">Ejercicios físicos</TabsTrigger>
        </TabsList>

        <TabsContent value="rutinas" className="mt-4 flex flex-col gap-3">
          <Button render={<Link to="/routines/new" />} className="h-10 self-start">
            <Plus /> Nueva rutina
          </Button>

          {routinesLoading && (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          )}

          {!routinesLoading && routines?.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Todavía no creaste ninguna rutina.
            </p>
          )}

          <div className="flex flex-col gap-2">
            {routines?.map((routine) => (
              <Card key={routine.id}>
                <CardContent className="flex items-center justify-between gap-3">
                  <Link to={`/routines/${routine.id}`} className="min-w-0 flex-1">
                    <p className="font-medium">{routine.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {routine.routine_exercises.length} ejercicios
                    </p>
                  </Link>
                  <div className="flex shrink-0 gap-1">
                    <Button variant="ghost" size="icon" render={<Link to={`/routines/${routine.id}`} />} aria-label="Editar">
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteRoutine(routine.id, routine.name)}
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
        </TabsContent>

        <TabsContent value="ejercicios" className="mt-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar ejercicio..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 pl-9"
              />
            </div>
            <Button
              className="h-11"
              onClick={() => {
                setEditingExercise(undefined)
                setDialogOpen(true)
              }}
            >
              <Plus />
            </Button>
          </div>

          {exercisesLoading && (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          )}

          <div className="flex flex-col gap-2">
            {filteredExercises.map((exercise) => (
              <PhysicalExerciseCard
                key={exercise.id}
                exercise={exercise}
                action={
                  <div className="flex shrink-0 gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingExercise(exercise)
                        setDialogOpen(true)
                      }}
                      aria-label="Editar"
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteExercise(exercise)}
                      className="text-destructive hover:text-destructive"
                      aria-label="Eliminar"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                }
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <PhysicalExerciseFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        exercise={editingExercise}
      />
    </div>
  )
}
