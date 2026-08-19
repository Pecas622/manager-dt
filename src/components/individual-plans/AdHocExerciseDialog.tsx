import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function AdHocExerciseDialog({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (input: { name: string; sets: string; reps: string }) => void
}) {
  const [name, setName] = useState("")
  const [sets, setSets] = useState("")
  const [reps, setReps] = useState("")

  function handleSubmit() {
    if (!name.trim()) {
      toast.error("Ingresá el nombre del ejercicio")
      return
    }
    onAdd({ name: name.trim(), sets, reps })
    setName("")
    setSets("")
    setReps("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Ejercicio suelto</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="adhoc-name">Nombre</Label>
            <Input
              id="adhoc-name"
              className="h-11"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Plancha lateral"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="adhoc-sets">Series base</Label>
              <Input
                id="adhoc-sets"
                type="number"
                className="h-11"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="adhoc-reps">Reps base</Label>
              <Input
                id="adhoc-reps"
                className="h-11"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder='10 o 30"'
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit} className="h-11">
              Agregar
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
