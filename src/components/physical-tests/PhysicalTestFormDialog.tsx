import { useEffect, useState } from "react"
import { Plus, X } from "lucide-react"
import { toast } from "sonner"
import { usePlayers } from "@/hooks/usePlayers"
import { useAuth } from "@/hooks/useAuth"
import { useCreatePhysicalTestWithReps, summarizeReps } from "@/hooks/usePhysicalTests"
import {
  JUMP_MS_UNIT,
  JUMP_TEST_TYPES,
  JUMP_UNIT,
  REP_JUMP_TEST_TYPES,
  SPEED_TEST_TYPES,
  SPEED_UNIT,
} from "@/types/domain"
import type { PhysicalTestInsert, PhysicalTestRepInsert } from "@/types/database"
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

const OTHER = "Otro"

const emptyJumpReps = [
  { cm: "", ms: "" },
  { cm: "", ms: "" },
]

const emptyState = {
  playerId: "",
  date: new Date().toISOString().slice(0, 10),
  jumpType: JUMP_TEST_TYPES[0] as string,
  jumpCustomName: "",
  jumpValue: "",
  jumpReps: emptyJumpReps as { cm: string; ms: string }[],
  speedType: SPEED_TEST_TYPES[0] as string,
  speedCustomName: "",
  speedValue: "",
  notes: "",
}

function isRepJumpType(type: string): boolean {
  return (REP_JUMP_TEST_TYPES as readonly string[]).includes(type)
}

export function PhysicalTestFormDialog({
  open,
  onOpenChange,
  defaultPlayerId,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultPlayerId?: string
}) {
  const { session } = useAuth()
  const { data: players } = usePlayers()
  const createTest = useCreatePhysicalTestWithReps()

  const [form, setForm] = useState(emptyState)
  const [submitting, setSubmitting] = useState(false)
  const isRepJump = isRepJumpType(form.jumpType)

  function updateJumpRep(index: number, field: "cm" | "ms", value: string) {
    setForm((prev) => ({
      ...prev,
      jumpReps: prev.jumpReps.map((r, i) => (i === index ? { ...r, [field]: value } : r)),
    }))
  }

  function addJumpRep() {
    setForm((prev) => ({ ...prev, jumpReps: [...prev.jumpReps, { cm: "", ms: "" }] }))
  }

  function removeJumpRep(index: number) {
    setForm((prev) => ({ ...prev, jumpReps: prev.jumpReps.filter((_, i) => i !== index) }))
  }

  useEffect(() => {
    if (open) {
      setForm({ ...emptyState, playerId: defaultPlayerId ?? "" })
    }
  }, [open, defaultPlayerId])

  function update<K extends keyof typeof emptyState>(key: K, value: (typeof emptyState)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit() {
    if (!form.playerId) {
      toast.error("Seleccioná un jugador")
      return
    }

    const rows: { input: PhysicalTestInsert; reps?: Omit<PhysicalTestRepInsert, "test_id">[] }[] = []

    if (isRepJump) {
      const validReps = form.jumpReps
        .map((r, i) => ({
          rep_number: i + 1,
          value_cm: r.cm ? Number(r.cm) : null,
          value_ms: r.ms ? Number(r.ms) : null,
        }))
        .filter((r) => r.value_cm != null || r.value_ms != null)

      if (validReps.length > 0) {
        const { bestCm } = summarizeReps(validReps)
        if (bestCm == null) {
          toast.error("Cargá al menos una repetición de salto con cm")
          return
        }
        rows.push({
          input: {
            player_id: form.playerId,
            date: form.date,
            test_name: form.jumpType,
            value: bestCm,
            unit: JUMP_UNIT,
            notes: form.notes || null,
            created_by: session?.user.id ?? null,
          },
          reps: validReps,
        })
      }
    } else if (form.jumpValue) {
      const jumpValue = Number(form.jumpValue)
      if (!Number.isFinite(jumpValue)) {
        toast.error("El valor de salto no es válido")
        return
      }
      const jumpName = form.jumpType === OTHER ? form.jumpCustomName.trim() : form.jumpType
      if (!jumpName) {
        toast.error("Ingresá el nombre del tipo de salto")
        return
      }
      rows.push({
        input: {
          player_id: form.playerId,
          date: form.date,
          test_name: jumpName,
          value: jumpValue,
          unit: JUMP_UNIT,
          notes: form.notes || null,
          created_by: session?.user.id ?? null,
        },
      })
    }

    if (form.speedValue) {
      const speedValue = Number(form.speedValue)
      if (!Number.isFinite(speedValue)) {
        toast.error("El valor de velocidad no es válido")
        return
      }
      const speedName = form.speedType === OTHER ? form.speedCustomName.trim() : form.speedType
      if (!speedName) {
        toast.error("Ingresá el nombre del test de velocidad")
        return
      }
      rows.push({
        input: {
          player_id: form.playerId,
          date: form.date,
          test_name: speedName,
          value: speedValue,
          unit: SPEED_UNIT,
          notes: form.notes || null,
          created_by: session?.user.id ?? null,
        },
      })
    }

    if (rows.length === 0) {
      toast.error("Cargá al menos un valor de salto o velocidad")
      return
    }

    setSubmitting(true)
    try {
      for (const row of rows) {
        await createTest.mutateAsync(row)
      }
      toast.success(rows.length > 1 ? "Tests registrados" : "Test registrado")
      onOpenChange(false)
    } catch {
      toast.error("No se pudo registrar el test")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo test físico</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {!defaultPlayerId && (
            <div className="flex flex-col gap-1.5">
              <Label>Jugador</Label>
              <Select value={form.playerId} onValueChange={(v) => v && update("playerId", v)}>
                <SelectTrigger className="h-11 w-full">
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
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="test-date">Fecha</Label>
            <Input
              id="test-date"
              type="date"
              className="h-11"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Completá salto, velocidad, o los dos — se guardan juntos al registrar.
          </p>

          <div className="flex flex-col gap-2 rounded-lg border border-border p-3">
            <p className="text-sm font-medium">Salto</p>
            <Select value={form.jumpType} onValueChange={(v) => v && update("jumpType", v)}>
              <SelectTrigger className="h-11 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {JUMP_TEST_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {isRepJump ? (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-muted-foreground">
                  Una fila por repetición — cm, ms o los dos.
                </p>
                {form.jumpReps.map((rep, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="w-5 shrink-0 text-xs text-muted-foreground">{i + 1}.</span>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder={JUMP_UNIT}
                      className="h-10 flex-1"
                      value={rep.cm}
                      onChange={(e) => updateJumpRep(i, "cm", e.target.value)}
                    />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder={JUMP_MS_UNIT}
                      className="h-10 flex-1"
                      value={rep.ms}
                      onChange={(e) => updateJumpRep(i, "ms", e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeJumpRep(i)}
                      disabled={form.jumpReps.length <= 1}
                      aria-label="Quitar repetición"
                      className="shrink-0 text-destructive hover:text-destructive"
                    >
                      <X className="size-3.5" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 self-start text-xs"
                  onClick={addJumpRep}
                >
                  <Plus className="size-3.5" /> Repetición
                </Button>
                {(() => {
                  const { bestCm, avgCm, bestMs, avgMs } = summarizeReps(
                    form.jumpReps.map((r) => ({
                      value_cm: r.cm ? Number(r.cm) : null,
                      value_ms: r.ms ? Number(r.ms) : null,
                    }))
                  )
                  if (bestCm == null && bestMs == null) return null
                  return (
                    <p className="text-xs text-muted-foreground">
                      Mayor: {bestCm != null ? `${bestCm.toFixed(2)} cm` : "-"}
                      {bestMs != null ? ` · ${bestMs.toFixed(0)} ms` : ""} · Promedio:{" "}
                      {avgCm != null ? `${avgCm.toFixed(2)} cm` : "-"}
                      {avgMs != null ? ` · ${avgMs.toFixed(0)} ms` : ""}
                    </p>
                  )
                })()}
              </div>
            ) : (
              <Input
                type="number"
                step="0.01"
                placeholder={`Valor (${JUMP_UNIT})`}
                className="h-11"
                value={form.jumpValue}
                onChange={(e) => update("jumpValue", e.target.value)}
              />
            )}

            {form.jumpType === OTHER && (
              <Input
                placeholder="Nombre del test de salto"
                className="h-11"
                value={form.jumpCustomName}
                onChange={(e) => update("jumpCustomName", e.target.value)}
              />
            )}
          </div>

          <div className="flex flex-col gap-2 rounded-lg border border-border p-3">
            <p className="text-sm font-medium">Velocidad</p>
            <div className="grid grid-cols-2 gap-2">
              <Select value={form.speedType} onValueChange={(v) => v && update("speedType", v)}>
                <SelectTrigger className="h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SPEED_TEST_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                step="0.01"
                placeholder={`Valor (${SPEED_UNIT})`}
                className="h-11"
                value={form.speedValue}
                onChange={(e) => update("speedValue", e.target.value)}
              />
            </div>
            {form.speedType === OTHER && (
              <Input
                placeholder="Nombre del test de velocidad"
                className="h-11"
                value={form.speedCustomName}
                onChange={(e) => update("speedCustomName", e.target.value)}
              />
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="test-notes">Notas</Label>
            <Textarea
              id="test-notes"
              rows={2}
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button onClick={handleSubmit} disabled={submitting} className="h-11">
              {submitting ? "Guardando..." : "Registrar"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
