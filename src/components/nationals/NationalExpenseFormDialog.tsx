import { useState } from "react"
import { toast } from "sonner"
import { useCreateNationalExpense } from "@/hooks/useNationals"
import { NATIONAL_EXPENSE_CATEGORIES, type NationalExpenseCategory } from "@/types/domain"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

export function NationalExpenseFormDialog({
  open,
  onOpenChange,
  nationalId,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  nationalId: string
}) {
  const createExpense = useCreateNationalExpense()
  const [category, setCategory] = useState<NationalExpenseCategory>("Vuelos")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit() {
    const value = Number(amount)
    if (!value || value <= 0) {
      toast.error("Ingresá un monto válido")
      return
    }
    setSubmitting(true)
    try {
      await createExpense.mutateAsync({
        national_id: nationalId,
        category,
        description: description || null,
        amount: value,
      })
      toast.success("Gasto agregado")
      onOpenChange(false)
      setCategory("Vuelos")
      setDescription("")
      setAmount("")
    } catch {
      toast.error("No se pudo agregar el gasto")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo gasto</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label>Categoría</Label>
            <Select value={category} onValueChange={(v) => v && setCategory(v as NationalExpenseCategory)}>
              <SelectTrigger className="h-11 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {NATIONAL_EXPENSE_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="expense-description">Descripción</Label>
            <Input
              id="expense-description"
              className="h-11"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="expense-amount">Monto (ARS)</Label>
            <Input
              id="expense-amount"
              type="number"
              className="h-11"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button onClick={handleSubmit} disabled={submitting} className="h-11">
              {submitting ? "Guardando..." : "Agregar gasto"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
