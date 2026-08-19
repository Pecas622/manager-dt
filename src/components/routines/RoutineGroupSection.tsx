import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  useAddRoutineCircuit,
  useDeleteRoutineGroup,
  useUpdateRoutineGroup,
} from "@/hooks/useRoutines"
import type { RoutineCircuit, RoutineExercise, RoutineGroup } from "@/types/database"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RoutineCircuitBlock } from "@/components/routines/RoutineCircuitBlock"

export function RoutineGroupSection({
  routineId,
  group,
  exercises,
}: {
  routineId: string
  group: RoutineGroup & { routine_circuits: RoutineCircuit[] }
  exercises: RoutineExercise[]
}) {
  const updateGroup = useUpdateRoutineGroup()
  const deleteGroup = useDeleteRoutineGroup()
  const addCircuit = useAddRoutineCircuit()
  const [name, setName] = useState(group.name)
  const [focus, setFocus] = useState(group.focus ?? "")

  function commitName() {
    if (name.trim() === group.name) return
    if (!name.trim()) {
      setName(group.name)
      return
    }
    updateGroup.mutate({ id: group.id, routineId, input: { name: name.trim() } })
  }

  function commitFocus() {
    if (focus.trim() === (group.focus ?? "").trim()) return
    updateGroup.mutate({ id: group.id, routineId, input: { focus: focus.trim() || null } })
  }

  async function handleDeleteGroup() {
    if (!confirm(`¿Eliminar "${group.name}"? Se borran sus circuitos y ejercicios.`)) return
    try {
      await deleteGroup.mutateAsync({ id: group.id, routineId })
    } catch {
      toast.error("No se pudo eliminar el grupo")
    }
  }

  function handleAddCircuit() {
    addCircuit.mutate({
      routineId,
      input: { group_id: group.id, order: group.routine_circuits.length },
    })
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={commitName}
              className="h-9 font-semibold print:h-auto print:border-none print:p-0 print:text-base"
              placeholder="Grupo 1"
            />
            <Input
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              onBlur={commitFocus}
              placeholder="Enfoque (opcional, ej. Fuerza & Potencia)"
              className="h-8 text-xs text-muted-foreground print:h-auto print:border-none print:p-0"
            />
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleDeleteGroup}
            className="shrink-0 text-destructive hover:text-destructive print:hidden"
            aria-label="Eliminar grupo"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          {group.routine_circuits.map((circuit, index) => (
            <RoutineCircuitBlock
              key={circuit.id}
              routineId={routineId}
              circuitId={circuit.id}
              index={index}
              items={exercises.filter((e) => e.circuit_id === circuit.id)}
            />
          ))}
        </div>

        {group.routine_circuits.length === 0 && (
          <p className="text-xs text-muted-foreground">Sin circuitos todavía.</p>
        )}

        <Button
          variant="outline"
          size="sm"
          className="h-8 self-start text-xs print:hidden"
          onClick={handleAddCircuit}
        >
          <Plus className="size-3.5" /> Circuito
        </Button>
      </CardContent>
    </Card>
  )
}
