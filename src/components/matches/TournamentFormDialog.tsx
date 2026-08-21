import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"
import {
  useCreateTournament,
  useDeleteTournament,
  useUpdateTournament,
} from "@/hooks/useTournaments"
import { useActiveCategory } from "@/hooks/useActiveCategory"
import type { Tournament } from "@/types/database"
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

const tournamentSchema = z.object({
  name: z.string().min(1, "Requerido"),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  notes: z.string().optional(),
})

type TournamentFormValues = z.infer<typeof tournamentSchema>

export function TournamentFormDialog({
  open,
  onOpenChange,
  tournament,
  onCreated,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  tournament?: Tournament
  onCreated?: (tournament: Tournament) => void
}) {
  const { activeCategory } = useActiveCategory()
  const createTournament = useCreateTournament()
  const updateTournament = useUpdateTournament()
  const deleteTournament = useDeleteTournament()
  const isEditing = Boolean(tournament)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TournamentFormValues>({
    resolver: zodResolver(tournamentSchema),
    defaultValues: { name: "", start_date: "", end_date: "", notes: "" },
  })

  useEffect(() => {
    if (open) {
      reset(
        tournament
          ? {
              name: tournament.name,
              start_date: tournament.start_date ?? "",
              end_date: tournament.end_date ?? "",
              notes: tournament.notes ?? "",
            }
          : { name: "", start_date: "", end_date: "", notes: "" }
      )
    }
  }, [open, tournament, reset])

  async function onSubmit(values: TournamentFormValues) {
    const payload = {
      category: tournament?.category ?? activeCategory,
      name: values.name,
      start_date: values.start_date || null,
      end_date: values.end_date || null,
      notes: values.notes || null,
      created_by: null,
    }
    try {
      if (isEditing && tournament) {
        await updateTournament.mutateAsync({ id: tournament.id, input: payload })
        toast.success("Torneo actualizado")
      } else {
        const created = await createTournament.mutateAsync(payload)
        toast.success("Torneo creado")
        onCreated?.(created)
      }
      onOpenChange(false)
    } catch {
      toast.error("No se pudo guardar el torneo")
    }
  }

  async function handleDelete() {
    if (!tournament) return
    if (!confirm(`¿Eliminar el torneo "${tournament.name}"? Los partidos no se borran, quedan sin torneo asignado.`)) return
    try {
      await deleteTournament.mutateAsync(tournament.id)
      toast.success("Torneo eliminado")
      onOpenChange(false)
    } catch {
      toast.error("No se pudo eliminar")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar torneo" : "Nuevo torneo"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" placeholder="Apertura 2026" className="h-11" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="start_date">Desde</Label>
              <Input id="start_date" type="date" className="h-11" {...register("start_date")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="end_date">Hasta</Label>
              <Input id="end_date" type="date" className="h-11" {...register("end_date")} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">Notas</Label>
            <Textarea id="notes" rows={2} {...register("notes")} />
          </div>

          <DialogFooter className="items-center sm:justify-between">
            {isEditing && (
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
              {isSubmitting ? "Guardando..." : "Guardar torneo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
