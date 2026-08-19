import { type FormEvent, useState } from "react"
import { Navigate } from "react-router-dom"
import { KeyRound, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function AcceptInvitePage() {
  const { isAuthenticated, loading } = useAuth()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  if (done) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (password.length < 6) {
      setError("La contraseña tiene que tener al menos 6 caracteres.")
      return
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.")
      return
    }
    setSubmitting(true)
    setError(null)
    const { error } = await supabase.auth.updateUser({ password })
    setSubmitting(false)
    if (error) {
      setError("No se pudo guardar la contraseña. Puede que el link haya expirado.")
      return
    }
    setDone(true)
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <KeyRound className="size-6" />
          </div>
          <CardTitle className="text-xl">Activá tu cuenta</CardTitle>
          <CardDescription>Elegí una contraseña para entrar a C15 Manager.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : !isAuthenticated ? (
            <p className="text-sm text-muted-foreground">
              Este link de invitación no es válido o ya expiró. Pedile al DT que te
              mande uno nuevo.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="h-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirm-password">Repetir contraseña</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="h-12"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={submitting} className="h-12 text-base">
                {submitting ? "Guardando..." : "Guardar y entrar"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
