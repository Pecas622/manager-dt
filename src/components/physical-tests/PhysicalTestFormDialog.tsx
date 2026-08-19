import { useEffect, useState } from "react"
import { toast } from "sonner"
import { usePlayers } from "@/hooks/usePlayers"
import { useAuth } from "@/hooks/useAuth"
import { useCreatePhysicalTest } from "@/hooks/usePhysicalTests"
import {
  JUMP_TEST_TYPES,
  JUMP_UNIT,
  SPEED_TEST_TYPES,
  SPEED_UNIT,
} from "@/types/domain"
import type { PhysicalTestInsert } from "@/types/database"
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

const emptyState = {
  playerId: "",
  date: new Date().toISOString().slice(0, 10),
  jumpType: JUMP_TEST_TYPES[0] as string,
  jumpCustomName: "",
  jumpValue: "",
  speedType: SPEED_TEST_TYPES[0] as string,
  speedCustomName: "",
  speedValue: "",
  notes: "",
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
  const createTest = useCreatePhysicalTest()

  const [form, setForm] = useState(emptyState)
  const [submitting, setSubmitting] = useState(false)

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

    const rows: PhysicalTestInsert[] = []

    if (form.jumpValue) {
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
        player_id: form.playerId,
        date: form.date,
        test_name: jumpName,
        value: jumpValue,
        unit: JUMP_UNIT,
        notes: form.notes || null,
        created_by: session?.user.id ?? null,
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
        player_id: form.playerId,
        date: form.date,
        test_name: speedName,
        value: speedValue,
        unit: SPEED_UNIT,
        notes: form.notes || null,
        created_by: session?.user.id ?? null,
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
            <div className="grid grid-cols-2 gap-2">
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
              <Input
                type="number"
                step="0.01"
                placeholder={`Valor (${JUMP_UNIT})`}
                className="h-11"
                value={form.jumpValue}
                onChange={(e) => update("jumpValue", e.target.value)}
              />
            </div>
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
