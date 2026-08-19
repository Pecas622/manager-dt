import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { usePlayers } from "@/hooks/usePlayers"
import { useCreateEvaluation } from "@/hooks/useEvaluations"
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

const today = new Date().toISOString().slice(0, 10)

export function EvaluationFormPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { data: players } = usePlayers()
  const createEvaluation = useCreateEvaluation()

  const [playerId, setPlayerId] = useState(searchParams.get("playerId") ?? "")
  const [date, setDate] = useState(today)
  const [coach, setCoach] = useState("")
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit() {
    if (!playerId) {
      toast.error("Seleccioná un jugador")
      return
    }
    setSubmitting(true)
    try {
      const created = await createEvaluation.mutateAsync({
        player_id: playerId,
        date,
        coach: coach || null,
        notes: notes || null,
      })
      toast.success("Evaluación guardada")
      navigate(`/evaluations/${created.id}`)
    } catch {
      toast.error("No se pudo guardar la evaluación")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 pb-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Volver">
          <ArrowLeft />
        </Button>
        <h1 className="text-xl font-semibold">Nueva evaluación</h1>
      </div>

      <p className="text-sm text-muted-foreground">
        Check-in físico del jugador: fecha, quién lo hizo y observaciones. Peso, altura, salto y
        velocidad ya se ven acá mismo tomados de la ficha y de Tests físicos — no hace falta
        cargarlos de nuevo.
      </p>

      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Jugador</Label>
            <Select value={playerId} onValueChange={(v) => setPlayerId(v ?? "")}>
              <SelectTrigger className="h-12 w-full">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {players?.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.first_name} {p.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                className="h-12"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="coach">Entrenador</Label>
              <Input id="coach" className="h-12" value={coach} onChange={(e) => setCoach(e.target.value)} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">Observaciones</Label>
            <Textarea
              id="notes"
              rows={4}
              placeholder="Qué se observó, qué trabajar de acá al próximo check-in..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSubmit} disabled={submitting} className="h-12 text-base">
        {submitting ? "Guardando..." : "Guardar evaluación"}
      </Button>
    </div>
  )
}
