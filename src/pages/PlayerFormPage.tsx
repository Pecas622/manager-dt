import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
  usePlayer,
  useCreatePlayer,
  useUpdatePlayer,
} from "@/hooks/usePlayers"
import { useActiveCategory } from "@/hooks/useActiveCategory"
import { CATEGORIES, POSITIONS, PREFERRED_FEET, PLAYER_STATUSES } from "@/types/domain"
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
import { Card, CardContent } from "@/components/ui/card"

const playerSchema = z.object({
  category: z.enum(CATEGORIES, { message: "Seleccioná una categoría" }),
  first_name: z.string().min(1, "Requerido"),
  last_name: z.string().min(1, "Requerido"),
  photo_url: z.string().optional(),
  birth_date: z.string().optional(),
  jersey_number: z.string().optional(),
  position: z.enum(POSITIONS, { message: "Seleccioná una posición" }),
  preferred_foot: z.string().optional(),
  join_date: z.string().optional(),
  status: z.enum(PLAYER_STATUSES),
  weight_kg: z.string().optional(),
  height_cm: z.string().optional(),
  strengths: z.string().optional(),
  weaknesses: z.string().optional(),
  notes: z.string().optional(),
})

type PlayerFormValues = z.infer<typeof playerSchema>

const emptyValues: PlayerFormValues = {
  category: CATEGORIES[0],
  first_name: "",
  last_name: "",
  photo_url: "",
  birth_date: "",
  jersey_number: "",
  position: "Ala",
  preferred_foot: "",
  join_date: "",
  status: "Activo",
  weight_kg: "",
  height_cm: "",
  strengths: "",
  weaknesses: "",
  notes: "",
}

export function PlayerFormPage() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const { activeCategory } = useActiveCategory()
  const { data: player, isLoading } = usePlayer(id)
  const createPlayer = useCreatePlayer()
  const updatePlayer = useUpdatePlayer()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PlayerFormValues>({
    resolver: zodResolver(playerSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    if (!isEditing) {
      setValue("category", activeCategory)
    }
  }, [isEditing, activeCategory, setValue])

  useEffect(() => {
    if (player) {
      reset({
        category: player.category,
        first_name: player.first_name,
        last_name: player.last_name,
        photo_url: player.photo_url ?? "",
        birth_date: player.birth_date ?? "",
        jersey_number: player.jersey_number?.toString() ?? "",
        position: player.position,
        preferred_foot: player.preferred_foot ?? "",
        join_date: player.join_date ?? "",
        status: player.status,
        weight_kg: player.weight_kg?.toString() ?? "",
        height_cm: player.height_cm?.toString() ?? "",
        strengths: player.strengths ?? "",
        weaknesses: player.weaknesses ?? "",
        notes: player.notes ?? "",
      })
    }
  }, [player, reset])

  async function onSubmit(values: PlayerFormValues) {
    const payload = {
      category: values.category,
      first_name: values.first_name,
      last_name: values.last_name,
      photo_url: values.photo_url || null,
      birth_date: values.birth_date || null,
      jersey_number: values.jersey_number ? Number(values.jersey_number) : null,
      position: values.position,
      preferred_foot: values.preferred_foot
        ? (values.preferred_foot as (typeof PREFERRED_FEET)[number])
        : null,
      join_date: values.join_date || null,
      status: values.status,
      weight_kg: values.weight_kg ? Number(values.weight_kg) : null,
      height_cm: values.height_cm ? Number(values.height_cm) : null,
      strengths: values.strengths || null,
      weaknesses: values.weaknesses || null,
      notes: values.notes || null,
    }

    try {
      if (isEditing && id) {
        const updated = await updatePlayer.mutateAsync({ id, input: payload })
        toast.success("Jugador actualizado")
        navigate(`/players/${updated.id}`)
      } else {
        const created = await createPlayer.mutateAsync(payload)
        toast.success("Jugador creado")
        navigate(`/players/${created.id}`)
      }
    } catch {
      toast.error("No se pudo guardar el jugador")
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
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          aria-label="Volver"
        >
          <ArrowLeft />
        </Button>
        <h1 className="text-xl font-semibold">
          {isEditing ? "Editar jugador" : "Nuevo jugador"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Card>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Categoría</Label>
              <Select
                value={watch("category")}
                onValueChange={(v) => v && setValue("category", v as PlayerFormValues["category"])}
              >
                <SelectTrigger className="h-12 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-xs text-destructive">{errors.category.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="first_name">Nombre</Label>
                <Input id="first_name" className="h-12" {...register("first_name")} />
                {errors.first_name && (
                  <p className="text-xs text-destructive">{errors.first_name.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="last_name">Apellido</Label>
                <Input id="last_name" className="h-12" {...register("last_name")} />
                {errors.last_name && (
                  <p className="text-xs text-destructive">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="photo_url">Foto (URL)</Label>
              <Input
                id="photo_url"
                placeholder="https://..."
                className="h-12"
                {...register("photo_url")}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="jersey_number">Dorsal</Label>
                <Input
                  id="jersey_number"
                  type="number"
                  className="h-12"
                  {...register("jersey_number")}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Posición</Label>
                <Select
                  value={watch("position")}
                  onValueChange={(v) => v && setValue("position", v as PlayerFormValues["position"])}
                >
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {POSITIONS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label>Pierna hábil</Label>
                <Select
                  value={watch("preferred_foot") || undefined}
                  onValueChange={(v) => setValue("preferred_foot", v ?? "")}
                >
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {PREFERRED_FEET.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Estado</Label>
                <Select
                  value={watch("status")}
                  onValueChange={(v) => v && setValue("status", v as PlayerFormValues["status"])}
                >
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PLAYER_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="birth_date">Fecha de nacimiento</Label>
                <Input
                  id="birth_date"
                  type="date"
                  className="h-12"
                  {...register("birth_date")}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="join_date">Fecha de incorporación</Label>
                <Input
                  id="join_date"
                  type="date"
                  className="h-12"
                  {...register("join_date")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="weight_kg">Peso (kg)</Label>
                <Input
                  id="weight_kg"
                  type="number"
                  step="0.1"
                  className="h-12"
                  {...register("weight_kg")}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="height_cm">Altura (cm)</Label>
                <Input
                  id="height_cm"
                  type="number"
                  step="0.1"
                  className="h-12"
                  {...register("height_cm")}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="strengths">Fortalezas</Label>
              <Textarea
                id="strengths"
                rows={3}
                placeholder="Buen 1 vs 1, velocidad y buena intensidad defensiva."
                {...register("strengths")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="weaknesses">Aspectos a mejorar</Label>
              <Textarea
                id="weaknesses"
                rows={3}
                placeholder="Mejorar toma de decisiones bajo presión."
                {...register("weaknesses")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="notes">Observaciones</Label>
              <Textarea id="notes" rows={3} {...register("notes")} />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={isSubmitting} className="h-12 text-base">
          {isSubmitting ? "Guardando..." : "Guardar jugador"}
        </Button>
      </form>
    </div>
  )
}
