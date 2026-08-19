import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft, Database, Plus, Trash2, UserPlus } from "lucide-react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { useCreateProfile, useDeleteProfile, useProfiles } from "@/hooks/useProfiles"
import { usePlayers } from "@/hooks/usePlayers"
import { useCleanupDemoData, useSeedDemoData } from "@/hooks/useDemoData"
import { USER_ROLES, USER_ROLE_LABELS, type UserRole } from "@/types/domain"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

const linkSchema = z.object({
  id: z.string().uuid("Tiene que ser un UUID válido"),
  full_name: z.string().optional(),
  role: z.enum(USER_ROLES, { message: "Seleccioná un rol" }),
  player_id: z.string().optional(),
})

type LinkFormValues = z.infer<typeof linkSchema>

export function UsersPage() {
  const navigate = useNavigate()
  const { data: profiles, isLoading } = useProfiles()
  const { data: players } = usePlayers()
  const createProfile = useCreateProfile()
  const deleteProfile = useDeleteProfile()
  const seedDemoData = useSeedDemoData()
  const cleanupDemoData = useCleanupDemoData()
  const [open, setOpen] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: { id: "", full_name: "", role: "jugador", player_id: "" },
  })

  const role = watch("role")

  async function onSubmit(values: LinkFormValues) {
    try {
      await createProfile.mutateAsync({
        id: values.id,
        full_name: values.full_name || null,
        role: values.role,
        player_id: values.role === "jugador" ? values.player_id || null : null,
      })
      toast.success("Cuenta vinculada")
      reset({ id: "", full_name: "", role: "jugador", player_id: "" })
      setOpen(false)
    } catch {
      toast.error("No se pudo vincular. Verificá que el UUID exista en Authentication → Users.")
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Desvincular esta cuenta? La persona ya no va a poder entrar a la app.")) return
    try {
      await deleteProfile.mutateAsync(id)
      toast.success("Cuenta desvinculada")
    } catch {
      toast.error("No se pudo desvincular")
    }
  }

  async function handleSeedDemo() {
    if (
      !confirm(
        "¿Cargar el plantel demo de Regatas C15 (18 jugadores, entrenamientos, rutinas, un partido y un Nacional de ejemplo)?"
      )
    )
      return
    try {
      await seedDemoData.mutateAsync()
      toast.success("Datos demo cargados")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudieron cargar los datos demo")
    }
  }

  async function handleCleanupDemo() {
    if (!confirm("¿Borrar todos los datos demo de Regatas C15? No afecta datos reales cargados después.")) return
    try {
      await cleanupDemoData.mutateAsync()
      toast.success("Datos demo eliminados")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudieron borrar los datos demo")
    }
  }

  return (
    <div className="flex flex-col gap-4 pb-6">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Volver">
            <ArrowLeft />
          </Button>
          <h1 className="text-xl font-semibold">Usuarios</h1>
        </div>
        <Button onClick={() => setOpen(true)} className="h-10">
          <UserPlus /> Vincular cuenta
        </Button>
      </div>

      <Card>
        <CardContent className="text-sm text-muted-foreground">
          Para dar acceso a un Profesor o Jugador, primero creá su usuario en el
          dashboard de Supabase (Authentication → Users → Add user) con su email
          y una contraseña provisoria. Copiá el UUID que te muestra ahí y
          vinculalo acá con su rol.
        </CardContent>
      </Card>

      {isLoading && <p className="text-sm text-muted-foreground">Cargando...</p>}

      <div className="flex flex-col gap-2">
        {profiles?.map((profile) => (
          <Card key={profile.id}>
            <CardContent className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium">
                    {profile.full_name ||
                      (profile.player
                        ? `${profile.player.first_name} ${profile.player.last_name}`
                        : "Sin nombre")}
                  </p>
                  <Badge variant="outline">{USER_ROLE_LABELS[profile.role]}</Badge>
                </div>
                <p className="truncate font-mono text-xs text-muted-foreground">
                  {profile.id}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(profile.id)}
                aria-label="Desvincular"
                className="shrink-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
        {!isLoading && profiles?.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Todavía no vinculaste ninguna cuenta de Profesor o Jugador.
          </p>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Database className="size-4.5" /> Datos demo
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            Carga o borra el plantel ficticio de "Regatas C15" (18 jugadores,
            entrenamientos, ejercicios, rutinas, evaluaciones, un partido y un
            Nacional de ejemplo) para probar la app. Se puede volver a correr
            sin duplicar y no afecta datos reales.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              onClick={handleSeedDemo}
              disabled={seedDemoData.isPending}
              className="h-11"
            >
              <Database /> {seedDemoData.isPending ? "Cargando..." : "Cargar datos demo"}
            </Button>
            <Button
              variant="outline"
              onClick={handleCleanupDemo}
              disabled={cleanupDemoData.isPending}
              className="h-11 text-destructive hover:text-destructive"
            >
              <Trash2 /> {cleanupDemoData.isPending ? "Borrando..." : "Borrar datos demo"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Vincular cuenta</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="id">UUID del usuario (Supabase Auth)</Label>
              <Input id="id" className="h-11 font-mono text-xs" {...register("id")} />
              {errors.id && <p className="text-xs text-destructive">{errors.id.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="full_name">Nombre</Label>
              <Input id="full_name" className="h-11" {...register("full_name")} />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Rol</Label>
              <Select value={role} onValueChange={(v) => v && setValue("role", v as UserRole)}>
                <SelectTrigger className="h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {USER_ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {USER_ROLE_LABELS[r]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {role === "jugador" && (
              <div className="flex flex-col gap-1.5">
                <Label>Jugador</Label>
                <Select
                  value={watch("player_id") || undefined}
                  onValueChange={(v) => setValue("player_id", v ?? "")}
                >
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Seleccionar jugador" />
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

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="h-11">
                <Plus /> Vincular
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
