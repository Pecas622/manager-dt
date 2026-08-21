import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import {
  CalendarDays,
  Clock,
  Dumbbell,
  MessageCircle,
  MoreHorizontal,
  Moon,
  Plane,
  Target,
  Trophy,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react"
import { useCreateNationalActivity, useUpdateNationalActivity } from "@/hooks/useNationals"
import { useCreateMatch } from "@/hooks/useMatches"
import { useCreateRoutine, useRoutines } from "@/hooks/useRoutines"
import { useActiveCategory } from "@/hooks/useActiveCategory"
import {
  NATIONAL_ACTIVITY_LABELS,
  NATIONAL_ACTIVITY_TYPES,
  type NationalActivityType,
} from "@/types/domain"
import type { NationalActivity } from "@/types/database"
import { cn } from "@/lib/utils"
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

const NEW_ROUTINE_VALUE = "__new__"

const ACTIVITY_ICONS: Record<NationalActivityType, LucideIcon> = {
  viaje: Plane,
  partido: Trophy,
  rutina: Dumbbell,
  entrenamiento: Target,
  comida: UtensilsCrossed,
  charla: MessageCircle,
  descanso: Moon,
  otro: MoreHorizontal,
}

const ACTIVITY_COLORS: Record<NationalActivityType, string> = {
  viaje: "bg-chart-2/15 text-chart-2",
  partido: "bg-primary/15 text-primary",
  rutina: "bg-chart-3/15 text-chart-3",
  entrenamiento: "bg-chart-1/15 text-chart-1",
  comida: "bg-chart-4/15 text-chart-4",
  charla: "bg-chart-5/15 text-chart-5",
  descanso: "bg-muted text-muted-foreground",
  otro: "bg-muted text-muted-foreground",
}

function ActivityTypeIcon({ type, className }: { type: NationalActivityType; className?: string }) {
  const Icon = ACTIVITY_ICONS[type]
  return (
    <div
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-lg",
        ACTIVITY_COLORS[type],
        className
      )}
    >
      <Icon className="size-4" />
    </div>
  )
}

export function NationalActivityFormDialog({
  open,
  onOpenChange,
  nationalId,
  defaultDate,
  activity,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  nationalId: string
  defaultDate?: string
  activity?: NationalActivity
}) {
  const navigate = useNavigate()
  const createActivity = useCreateNationalActivity()
  const updateActivity = useUpdateNationalActivity()
  const { activeCategory } = useActiveCategory()
  const createMatch = useCreateMatch()
  const createRoutine = useCreateRoutine()
  const { data: routines } = useRoutines()
  const isEditing = Boolean(activity)

  const [date, setDate] = useState(defaultDate ?? new Date().toISOString().slice(0, 10))
  const [time, setTime] = useState("")
  const [type, setType] = useState<NationalActivityType>("partido")
  const [title, setTitle] = useState("")
  const [notes, setNotes] = useState("")
  const [opponent, setOpponent] = useState("")
  const [routineChoice, setRoutineChoice] = useState<string>(NEW_ROUTINE_VALUE)
  const [newRoutineName, setNewRoutineName] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return
    if (activity) {
      setDate(activity.date)
      setTime(activity.time?.slice(0, 5) ?? "")
      setType(activity.type)
      setTitle(activity.title)
      setNotes(activity.notes ?? "")
      setOpponent("")
      setRoutineChoice(activity.routine_id ?? NEW_ROUTINE_VALUE)
      setNewRoutineName("")
    } else {
      setDate(defaultDate ?? new Date().toISOString().slice(0, 10))
      setTime("")
      setType("partido")
      setTitle("")
      setNotes("")
      setOpponent("")
      setRoutineChoice(NEW_ROUTINE_VALUE)
      setNewRoutineName("")
    }
  }, [open, activity, defaultDate])

  async function handleSubmit() {
    if (type === "partido" && !opponent.trim()) {
      toast.error("Ingresá el rival")
      return
    }
    if (type === "rutina" && routineChoice === NEW_ROUTINE_VALUE && !newRoutineName.trim()) {
      toast.error("Ingresá el nombre de la rutina")
      return
    }
    if (type !== "partido" && type !== "rutina" && !title.trim()) {
      toast.error("Ingresá un título")
      return
    }
    setSubmitting(true)
    try {
      if (isEditing && activity) {
        await updateActivity.mutateAsync({
          id: activity.id,
          nationalId,
          input: { date, time: time || null, title: title.trim(), notes: notes || null },
        })
        toast.success("Actividad actualizada")
        onOpenChange(false)
        return
      }

      let matchId: string | null = null
      let routineId: string | null = null
      let finalTitle = title.trim()

      if (type === "partido") {
        const match = await createMatch.mutateAsync({
          category: activeCategory,
          date,
          start_time: time || null,
          opponent: opponent.trim(),
          location: null,
          is_home: null,
          national_id: nationalId,
          tournament_id: null,
          notes: null,
        })
        matchId = match.id
        finalTitle = `Partido vs. ${opponent.trim()}`
      } else if (type === "rutina") {
        if (routineChoice === NEW_ROUTINE_VALUE) {
          const routine = await createRoutine.mutateAsync({
            category: activeCategory,
            name: newRoutineName.trim(),
            notes: null,
            created_by: null,
          })
          routineId = routine.id
          finalTitle = routine.name
        } else {
          routineId = routineChoice
          finalTitle = routines?.find((r) => r.id === routineChoice)?.name ?? "Rutina"
        }
      }

      await createActivity.mutateAsync({
        national_id: nationalId,
        date,
        time: time || null,
        type,
        title: finalTitle,
        notes: notes || null,
        match_id: matchId,
        routine_id: routineId,
      })
      toast.success("Actividad agregada")
      onOpenChange(false)
    } catch {
      toast.error("No se pudo guardar la actividad")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5">
            <ActivityTypeIcon type={type} />
            {isEditing ? "Editar actividad" : "Agregar actividad"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarDays className="size-3.5" /> Fecha
                </Label>
                <Input
                  type="date"
                  className="h-11 bg-background"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3.5" /> Hora
                </Label>
                <Input
                  type="time"
                  className="h-11 bg-background"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Tipo</Label>
              <Select
                value={type}
                onValueChange={(v) => v && setType(v as NationalActivityType)}
                disabled={isEditing}
              >
                <SelectTrigger className="h-11 w-full bg-background">
                  <SelectValue>
                    <span className="flex items-center gap-2">
                      <ActivityTypeIcon type={type} className="size-6" />
                      {NATIONAL_ACTIVITY_LABELS[type]}
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {NATIONAL_ACTIVITY_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      <span className="flex items-center gap-2">
                        <ActivityTypeIcon type={t} className="size-6" />
                        {NATIONAL_ACTIVITY_LABELS[t]}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {type === "partido" && !isEditing && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="opponent">Rival</Label>
              <Input
                id="opponent"
                className="h-11"
                value={opponent}
                onChange={(e) => setOpponent(e.target.value)}
              />
            </div>
          )}

          {type === "rutina" && !isEditing && (
            <div className="flex flex-col gap-1.5 rounded-xl border border-border p-3">
              <Label>Rutina (movilidad articular + juego)</Label>
              <Select value={routineChoice} onValueChange={(v) => v && setRoutineChoice(v)}>
                <SelectTrigger className="h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NEW_ROUTINE_VALUE}>+ Nueva rutina</SelectItem>
                  {routines?.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {routineChoice === NEW_ROUTINE_VALUE && (
                <Input
                  placeholder="Nombre de la rutina, ej. Activación día 1"
                  className="h-11"
                  value={newRoutineName}
                  onChange={(e) => setNewRoutineName(e.target.value)}
                />
              )}
              <p className="text-xs text-muted-foreground">
                Después de guardar, entrá a la rutina para cargar los ejercicios de movilidad (sin
                límite) y el juego, igual que en Rutinas.
              </p>
            </div>
          )}

          {type === "rutina" && isEditing && activity?.routine_id && (
            <Button
              type="button"
              variant="outline"
              className="h-11"
              onClick={() => navigate(`/routines/${activity.routine_id}`)}
            >
              <Dumbbell className="size-4" /> Ver / editar ejercicios de la rutina
            </Button>
          )}

          {type !== "partido" && type !== "rutina" && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                placeholder={type === "entrenamiento" ? "Qué trabajar hoy en lo táctico" : "Título"}
                className="h-11"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="activity-notes">Notas</Label>
            <Textarea id="activity-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <DialogFooter>
            <Button onClick={handleSubmit} disabled={submitting} className="h-11">
              {submitting ? "Guardando..." : isEditing ? "Guardar cambios" : "Agregar"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
