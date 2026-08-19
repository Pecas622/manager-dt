import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { useCreateExercise, useUpdateExercise } from "@/hooks/useExercises"
import { EXERCISE_CATEGORIES } from "@/types/domain"
import type { TrainingExercise } from "@/types/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const exerciseSchema = z.object({
  name: z.string().min(1, "Requerido"),
  category: z.enum(EXERCISE_CATEGORIES, { message: "Seleccioná una categoría" }),
  duration: z.string().min(1, "Requerido"),
  objective: z.string().optional(),
  description: z.string().optional(),
  players_count: z.string().optional(),
  materials: z.string().optional(),
  notes: z.string().optional(),
})

type ExerciseFormValues = z.infer<typeof exerciseSchema>

const emptyValues: ExerciseFormValues = {
  name: "",
  category: "Técnica",
  duration: "15",
  objective: "",
  description: "",
  players_count: "",
  materials: "",
  notes: "",
}

export function ExerciseFormDialog({
  open,
  onOpenChange,
  exercise,
  onSaved,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  exercise?: TrainingExercise
  onSaved?: (exercise: TrainingExercise) => void
}) {
  const createExercise = useCreateExercise()
  const updateExercise = useUpdateExercise()
  const isEditing = Boolean(exercise)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ExerciseFormValues>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    if (open) {
      reset(
        exercise
          ? {
              name: exercise.name,
              category: exercise.category,
              duration: exercise.duration.toString(),
              objective: exercise.objective ?? "",
              description: exercise.description ?? "",
              players_count: exercise.players_count ?? "",
              materials: exercise.materials ?? "",
              notes: exercise.notes ?? "",
            }
          : emptyValues
      )
    }
  }, [open, exercise, reset])

  async function onSubmit(values: ExerciseFormValues) {
    const payload = {
      name: values.name,
      category: values.category,
      duration: Number(values.duration),
      objective: values.objective || null,
      description: values.description || null,
      players_count: values.players_count || null,
      materials: values.materials || null,
      notes: values.notes || null,
    }
    try {
      if (isEditing && exercise) {
        const updated = await updateExercise.mutateAsync({ id: exercise.id, input: payload })
        toast.success("Ejercicio actualizado")
        onSaved?.(updated)
      } else {
        const created = await createExercise.mutateAsync(payload)
        toast.success("Ejercicio creado")
        onSaved?.(created)
      }
      onOpenChange(false)
    } catch {
      toast.error("No se pudo guardar el ejercicio")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar ejercicio" : "Nuevo ejercicio"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" className="h-11" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Categoría</Label>
              <Select
                value={watch("category")}
                onValueChange={(v) => v && setValue("category", v as ExerciseFormValues["category"])}
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXERCISE_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="duration">Duración (min)</Label>
              <Input id="duration" type="number" className="h-11" {...register("duration")} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="objective">Objetivo</Label>
            <Input id="objective" className="h-11" {...register("objective")} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" rows={3} {...register("description")} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="players_count">Cantidad de jugadores</Label>
              <Input id="players_count" placeholder="4v4" className="h-11" {...register("players_count")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="materials">Materiales</Label>
              <Input id="materials" className="h-11" {...register("materials")} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">Observaciones</Label>
            <Textarea id="notes" rows={2} {...register("notes")} />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} className="h-11">
              {isSubmitting ? "Guardando..." : "Guardar ejercicio"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
