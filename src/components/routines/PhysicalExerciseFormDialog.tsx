import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import {
  useCreatePhysicalExercise,
  useUpdatePhysicalExercise,
} from "@/hooks/useRoutines"
import type { PhysicalExercise } from "@/types/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const exerciseSchema = z.object({
  name: z.string().min(1, "Requerido"),
  sets: z.string().optional(),
  reps: z.string().optional(),
  rest_seconds: z.string().optional(),
  video_url: z.string().optional(),
  image_url: z.string().optional(),
  instructions: z.string().optional(),
})

type ExerciseFormValues = z.infer<typeof exerciseSchema>

const emptyValues: ExerciseFormValues = {
  name: "",
  sets: "",
  reps: "",
  rest_seconds: "",
  video_url: "",
  image_url: "",
  instructions: "",
}

export function PhysicalExerciseFormDialog({
  open,
  onOpenChange,
  exercise,
  onSaved,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  exercise?: PhysicalExercise
  onSaved?: (exercise: PhysicalExercise) => void
}) {
  const createExercise = useCreatePhysicalExercise()
  const updateExercise = useUpdatePhysicalExercise()
  const isEditing = Boolean(exercise)

  const {
    register,
    handleSubmit,
    reset,
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
              sets: exercise.sets?.toString() ?? "",
              reps: exercise.reps ?? "",
              rest_seconds: exercise.rest_seconds?.toString() ?? "",
              video_url: exercise.video_url ?? "",
              image_url: exercise.image_url ?? "",
              instructions: exercise.instructions ?? "",
            }
          : emptyValues
      )
    }
  }, [open, exercise, reset])

  async function onSubmit(values: ExerciseFormValues) {
    const payload = {
      name: values.name,
      sets: values.sets ? Number(values.sets) : null,
      reps: values.reps || null,
      rest_seconds: values.rest_seconds ? Number(values.rest_seconds) : null,
      video_url: values.video_url || null,
      image_url: values.image_url || null,
      instructions: values.instructions || null,
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
          <DialogTitle>{isEditing ? "Editar ejercicio" : "Nuevo ejercicio físico"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" placeholder="Sentadilla" className="h-11" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sets">Series</Label>
              <Input id="sets" type="number" placeholder="3" className="h-11" {...register("sets")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="reps">Reps</Label>
              <Input id="reps" placeholder='10 o 30"' className="h-11" {...register("reps")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="rest_seconds">Descanso (s)</Label>
              <Input
                id="rest_seconds"
                type="number"
                placeholder="60"
                className="h-11"
                {...register("rest_seconds")}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="video_url">Video (URL)</Label>
            <Input id="video_url" placeholder="https://..." className="h-11" {...register("video_url")} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="image_url">Imagen (URL)</Label>
            <Input id="image_url" placeholder="https://..." className="h-11" {...register("image_url")} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="instructions">Indicaciones</Label>
            <Textarea id="instructions" rows={3} {...register("instructions")} />
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
