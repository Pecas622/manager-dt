import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useCreateNational, useNational, useUpdateNational } from "@/hooks/useNationals"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

const nationalSchema = z.object({
  name: z.string().min(1, "Requerido"),
  city: z.string().optional(),
  start_date: z.string().min(1, "Requerido"),
  end_date: z.string().min(1, "Requerido"),
  travel_date: z.string().optional(),
  return_date: z.string().optional(),
  info: z.string().optional(),
})

type NationalFormValues = z.infer<typeof nationalSchema>

export function NationalFormPage() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const { data: national, isLoading } = useNational(id)
  const createNational = useCreateNational()
  const updateNational = useUpdateNational()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NationalFormValues>({
    resolver: zodResolver(nationalSchema),
    defaultValues: {
      name: "",
      city: "",
      start_date: "",
      end_date: "",
      travel_date: "",
      return_date: "",
      info: "",
    },
  })

  useEffect(() => {
    if (national) {
      reset({
        name: national.name,
        city: national.city ?? "",
        start_date: national.start_date,
        end_date: national.end_date,
        travel_date: national.travel_date ?? "",
        return_date: national.return_date ?? "",
        info: national.info ?? "",
      })
    }
  }, [national, reset])

  async function onSubmit(values: NationalFormValues) {
    const payload = {
      name: values.name,
      city: values.city || null,
      start_date: values.start_date,
      end_date: values.end_date,
      travel_date: values.travel_date || null,
      return_date: values.return_date || null,
      info: values.info || null,
    }
    try {
      if (isEditing && id) {
        const updated = await updateNational.mutateAsync({ id, input: payload })
        toast.success("Nacional actualizado")
        navigate(`/nationals/${updated.id}`)
      } else {
        const created = await createNational.mutateAsync(payload)
        toast.success("Nacional creado")
        navigate(`/nationals/${created.id}`)
      }
    } catch {
      toast.error("No se pudo guardar")
    }
  }

  if (isEditing && isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 pb-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Volver">
          <ArrowLeft />
        </Button>
        <h1 className="text-xl font-semibold">{isEditing ? "Editar Nacional" : "Nuevo Nacional"}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Card>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Nombre del torneo</Label>
              <Input id="name" placeholder="Nacional 2026 — Córdoba" className="h-12" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="city">Ciudad</Label>
              <Input id="city" className="h-12" {...register("city")} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="start_date">Inicio</Label>
                <Input id="start_date" type="date" className="h-12" {...register("start_date")} />
                {errors.start_date && (
                  <p className="text-xs text-destructive">{errors.start_date.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="end_date">Fin</Label>
                <Input id="end_date" type="date" className="h-12" {...register("end_date")} />
                {errors.end_date && (
                  <p className="text-xs text-destructive">{errors.end_date.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="travel_date">Fecha de viaje</Label>
                <Input id="travel_date" type="date" className="h-12" {...register("travel_date")} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="return_date">Fecha de regreso</Label>
                <Input id="return_date" type="date" className="h-12" {...register("return_date")} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="info">Información general</Label>
              <Textarea id="info" rows={3} {...register("info")} />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={isSubmitting} className="h-12 text-base">
          {isSubmitting ? "Guardando..." : "Guardar Nacional"}
        </Button>
      </form>
    </div>
  )
}
