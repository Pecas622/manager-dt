import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { useActiveCategory } from "@/hooks/useActiveCategory"
import { useCreateMatch, useDeleteMatch, useUpdateMatch } from "@/hooks/useMatches"
import type { Match } from "@/types/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const matchSchema = z.object({
  date: z.string().min(1, "Requerido"),
  start_time: z.string().optional(),
  opponent: z.string().min(1, "Requerido"),
  location: z.string().optional(),
  is_home: z.enum(["local", "visitante"]),
  notes: z.string().optional(),
})

type MatchFormValues = z.infer<typeof matchSchema>

export function MatchFormDialog({
  open,
  onOpenChange,
  match,
  defaultDate,
  tournamentId,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  match?: Match
  defaultDate?: string
  tournamentId?: string
}) {
  const { role } = useAuth()
  const { activeCategory } = useActiveCategory()
  const createMatch = useCreateMatch()
  const updateMatch = useUpdateMatch()
  const deleteMatch = useDeleteMatch()
  const isEditing = Boolean(match)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MatchFormValues>({
    resolver: zodResolver(matchSchema),
    defaultValues: {
      date: defaultDate ?? "",
      start_time: "",
      opponent: "",
      location: "",
      is_home: "local",
      notes: "",
    },
  })

  useEffect(() => {
    if (open) {
      reset(
        match
          ? {
              date: match.date,
              start_time: match.start_time?.slice(0, 5) ?? "",
              opponent: match.opponent,
              location: match.location ?? "",
              is_home: match.is_home === false ? "visitante" : "local",
              notes: match.notes ?? "",
            }
          : {
              date: defaultDate ?? "",
              start_time: "",
              opponent: "",
              location: "",
              is_home: "local",
              notes: "",
            }
      )
    }
  }, [open, match, defaultDate, reset])

  async function onSubmit(values: MatchFormValues) {
    const payload = {
      category: match?.category ?? activeCategory,
      date: values.date,
      start_time: values.start_time || null,
      opponent: values.opponent,
      location: values.location || null,
      is_home: values.is_home === "local",
      national_id: match?.national_id ?? null,
      tournament_id: match?.tournament_id ?? tournamentId ?? null,
      notes: values.notes || null,
    }
    try {
      if (isEditing && match) {
        await updateMatch.mutateAsync({ id: match.id, input: payload })
        toast.success("Partido actualizado")
      } else {
        await createMatch.mutateAsync(payload)
        toast.success("Partido creado")
      }
      onOpenChange(false)
    } catch {
      toast.error("No se pudo guardar el partido")
    }
  }

  async function handleDelete() {
    if (!match) return
    if (!confirm(`¿Eliminar el partido vs. ${match.opponent}?`)) return
    try {
      await deleteMatch.mutateAsync(match.id)
      toast.success("Partido eliminado")
      onOpenChange(false)
    } catch {
      toast.error("No se pudo eliminar")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar partido" : "Nuevo partido"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="opponent">Rival</Label>
            <Input id="opponent" className="h-11" {...register("opponent")} />
            {errors.opponent && (
              <p className="text-xs text-destructive">{errors.opponent.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="date">Fecha</Label>
              <Input id="date" type="date" className="h-11" {...register("date")} />
              {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="start_time">Horario</Label>
              <Input id="start_time" type="time" className="h-11" {...register("start_time")} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="location">Lugar / cancha</Label>
            <Input id="location" className="h-11" {...register("location")} />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Condición</Label>
            <RadioGroup
              value={watch("is_home")}
              onValueChange={(v) => v && setValue("is_home", v as MatchFormValues["is_home"])}
              className="flex gap-4"
            >
              <label className="flex items-center gap-2 text-sm">
                <RadioGroupItem value="local" /> Local
              </label>
              <label className="flex items-center gap-2 text-sm">
                <RadioGroupItem value="visitante" /> Visitante
              </label>
            </RadioGroup>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">Notas</Label>
            <Textarea id="notes" rows={2} {...register("notes")} />
          </div>

          <DialogFooter className="items-center sm:justify-between">
            {isEditing && role === "dt" && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleDelete}
                className="h-11 text-destructive hover:text-destructive"
              >
                <Trash2 /> Eliminar
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting} className="h-11">
              {isSubmitting ? "Guardando..." : "Guardar partido"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
