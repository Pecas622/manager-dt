import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { useCreateRoutine } from "@/hooks/useRoutines"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

const routineSchema = z.object({
  name: z.string().min(1, "Requerido"),
  notes: z.string().optional(),
})

type RoutineFormValues = z.infer<typeof routineSchema>

export function RoutineFormPage() {
  const navigate = useNavigate()
  const { session } = useAuth()
  const createRoutine = useCreateRoutine()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RoutineFormValues>({
    resolver: zodResolver(routineSchema),
    defaultValues: { name: "", notes: "" },
  })

  async function onSubmit(values: RoutineFormValues) {
    try {
      const created = await createRoutine.mutateAsync({
        name: values.name,
        notes: values.notes || null,
        created_by: session?.user.id ?? null,
      })
      toast.success("Rutina creada")
      navigate(`/routines/${created.id}`)
    } catch {
      toast.error("No se pudo crear la rutina")
    }
  }

  return (
    <div className="flex flex-col gap-4 pb-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Volver">
          <ArrowLeft />
        </Button>
        <h1 className="text-xl font-semibold">Nueva rutina</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Card>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                placeholder="Fuerza de piernas"
                className="h-12"
                {...register("name")}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="notes">Notas</Label>
              <Textarea id="notes" rows={3} {...register("notes")} />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={isSubmitting} className="h-12 text-base">
          {isSubmitting ? "Guardando..." : "Guardar y agregar ejercicios"}
        </Button>
      </form>
    </div>
  )
}
