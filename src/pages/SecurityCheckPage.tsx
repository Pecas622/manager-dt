import { type FormEvent, useState } from "react"
import { CheckCircle2, ShieldCheck, XCircle } from "lucide-react"
import { useCheckBecado } from "@/hooks/useBecados"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SecurityCheckPage() {
  const [dni, setDni] = useState("")
  const checkBecado = useCheckBecado()

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!dni.trim()) return
    checkBecado.mutate(dni)
  }

  const result = checkBecado.data

  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <ShieldCheck className="size-6" />
          </div>
          <CardTitle className="text-xl">Control de acceso</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
              type="text"
              inputMode="numeric"
              placeholder="Número de DNI"
              value={dni}
              onChange={(e) => {
                setDni(e.target.value)
                checkBecado.reset()
              }}
              autoFocus
              className="h-14 text-center text-xl"
            />
            <Button
              type="submit"
              disabled={checkBecado.isPending || !dni.trim()}
              className="h-14 text-base"
            >
              {checkBecado.isPending ? "Buscando..." : "Buscar"}
            </Button>
          </form>

          {result && (
            <div
              className={
                result.is_becado
                  ? "flex flex-col items-center gap-2 rounded-xl bg-success/15 py-6 text-success"
                  : "flex flex-col items-center gap-2 rounded-xl bg-destructive/15 py-6 text-destructive"
              }
            >
              {result.is_becado ? (
                <CheckCircle2 className="size-10" />
              ) : (
                <XCircle className="size-10" />
              )}
              <p className="text-lg font-semibold">
                {result.is_becado
                  ? result.member_type === "Cuota"
                    ? "Cuota al día"
                    : "Becado"
                  : "No autorizado"}
              </p>
              {result.is_becado && result.first_name && (
                <p className="text-sm">
                  {result.first_name} {result.last_name}
                </p>
              )}
            </div>
          )}

          {checkBecado.isError && (
            <p className="text-center text-sm text-destructive">
              No se pudo consultar. Probá de nuevo.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
