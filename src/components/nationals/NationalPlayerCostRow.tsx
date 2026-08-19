import { useState } from "react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Plus, X } from "lucide-react"
import { toast } from "sonner"
import {
  useAddNationalPayment,
  useDeleteNationalPayment,
  useUpdateNationalPlayerCost,
} from "@/hooks/useNationals"
import type { NationalPlayerCost } from "@/types/database"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

function fmt(value: number) {
  return value.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 })
}

export function NationalPlayerCostRow({
  cost,
  nationalId,
}: {
  cost: NationalPlayerCost
  nationalId: string
}) {
  const update = useUpdateNationalPlayerCost()
  const addPayment = useAddNationalPayment()
  const deletePayment = useDeleteNationalPayment()
  const [values, setValues] = useState({
    flight_cost: cost.flight_cost.toString(),
    lodging_cost: cost.lodging_cost.toString(),
    food_cost: cost.food_cost.toString(),
    transport_cost: cost.transport_cost.toString(),
  })
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().slice(0, 10))

  const payments = cost.national_payments ?? []
  const total =
    (Number(values.flight_cost) || 0) +
    (Number(values.lodging_cost) || 0) +
    (Number(values.food_cost) || 0) +
    (Number(values.transport_cost) || 0)
  const paid = payments.reduce((sum, p) => sum + p.amount, 0)
  const status = paid >= total && total > 0 ? "pagado" : paid > 0 ? "parcial" : "pendiente"

  function commit(field: keyof typeof values) {
    const numeric = Number(values[field])
    const original = cost[field as keyof NationalPlayerCost] as number
    if (!Number.isFinite(numeric) || numeric === original) return
    update.mutate({
      id: cost.id,
      nationalId,
      input: { [field]: numeric },
    })
  }

  async function handleAddPayment() {
    const amount = Number(paymentAmount)
    if (!paymentAmount || !Number.isFinite(amount) || amount <= 0) {
      toast.error("Ingresá un monto válido")
      return
    }
    try {
      await addPayment.mutateAsync({
        nationalId,
        input: {
          national_player_cost_id: cost.id,
          amount,
          date: paymentDate,
          notes: null,
        },
      })
      setPaymentAmount("")
    } catch {
      toast.error("No se pudo cargar el pago")
    }
  }

  async function handleRemovePayment(id: string) {
    try {
      await deletePayment.mutateAsync({ id, nationalId })
    } catch {
      toast.error("No se pudo quitar el pago")
    }
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="font-medium">
            {cost.player?.first_name} {cost.player?.last_name}
          </p>
          <Badge
            variant="outline"
            className={
              status === "pagado"
                ? "border-success/40 text-success"
                : status === "parcial"
                  ? "border-warning/40 text-warning"
                  : "border-destructive/40 text-destructive"
            }
          >
            {status === "pagado" ? "Pagado" : status === "parcial" ? `Debe ${fmt(total - paid)}` : "Pendiente"}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(
            [
              ["flight_cost", "Vuelo"],
              ["lodging_cost", "Alojam."],
              ["food_cost", "Comida"],
              ["transport_cost", "Traslado"],
            ] as const
          ).map(([field, label]) => (
            <div key={field} className="flex flex-col gap-1">
              <Label className="text-[11px] text-muted-foreground">{label}</Label>
              <Input
                type="number"
                className="h-9"
                value={values[field]}
                onChange={(e) => setValues((v) => ({ ...v, [field]: e.target.value }))}
                onBlur={() => commit(field)}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 rounded-lg bg-muted p-2.5">
          <div>
            <p className="text-[11px] text-muted-foreground">Total</p>
            <p className="text-sm font-semibold">{fmt(total)}</p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">Pagado</p>
            <p className="text-sm font-semibold">{fmt(paid)}</p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 rounded-lg border border-border p-2.5">
          <p className="text-[11px] font-medium text-muted-foreground">Pagos</p>
          {payments.length > 0 && (
            <div className="flex flex-col divide-y divide-border">
              {payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-1.5 text-sm">
                  <span>
                    {fmt(p.amount)}{" "}
                    <span className="text-xs text-muted-foreground">
                      {format(parseISO(p.date), "d MMM yyyy", { locale: es })}
                    </span>
                  </span>
                  <button
                    onClick={() => handleRemovePayment(p.id)}
                    aria-label="Quitar pago"
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Input
              type="number"
              placeholder="Monto"
              className="h-9"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
            />
            <Input
              type="date"
              className="h-9 w-36 shrink-0"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleAddPayment}
              disabled={addPayment.isPending}
              aria-label="Agregar pago"
              className="shrink-0"
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
