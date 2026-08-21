import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft, Database, Mail, Plus, Trash2, UserPlus } from "lucide-react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import {
  useCreateProfile,
  useDeleteProfile,
  useProfiles,
  useSetProfileCategories,
} from "@/hooks/useProfiles"
import { usePlayersAllCategories } from "@/hooks/usePlayers"
import { useCleanupDemoData, useSeedDemoData } from "@/hooks/useDemoData"
import { supabase } from "@/lib/supabaseClient"
import { CATEGORIES, USER_ROLES, USER_ROLE_LABELS, type Category, type UserRole } from "@/types/domain"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
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
  categories: z.array(z.enum(CATEGORIES)),
})

type LinkFormValues = z.infer<typeof linkSchema>

const inviteSchema = z.object({
  email: z.string().email("Tiene que ser un email válido"),
  full_name: z.string().optional(),
  role: z.enum(USER_ROLES, { message: "Seleccioná un rol" }),
  player_id: z.string().optional(),
  categories: z.array(z.enum(CATEGORIES)),
})

type InviteFormValues = z.infer<typeof inviteSchema>

function CategoryCheckboxes({
  selected,
  onToggle,
}: {
  selected: Category[]
  onToggle: (category: Category) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>Categorías</Label>
      <div className="flex flex-col gap-1 rounded-lg border border-input p-2">
        {CATEGORIES.map((c) => (
          <label key={c} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent/40">
            <Checkbox checked={selected.includes(c)} onCheckedChange={() => onToggle(c)} />
            {c}
          </label>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        A qué categorías tiene acceso esta cuenta. El DT ve todas siempre, esto
        solo aplica a Profesor.
      </p>
    </div>
  )
}

export function UsersPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: profiles, isLoading } = useProfiles()
  const { data: players } = usePlayersAllCategories()
  const createProfile = useCreateProfile()
  const deleteProfile = useDeleteProfile()
  const setProfileCategories = useSetProfileCategories()
  const seedDemoData = useSeedDemoData()
  const cleanupDemoData = useCleanupDemoData()
  const [open, setOpen] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviting, setInviting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: { id: "", full_name: "", role: "jugador", player_id: "", categories: [] },
  })

  const role = watch("role")
  const linkCategories = watch("categories")

  function toggleLinkCategory(category: Category) {
    const current = watch("categories")
    setValue(
      "categories",
      current.includes(category) ? current.filter((c) => c !== category) : [...current, category]
    )
  }

  const {
    register: registerInvite,
    handleSubmit: handleSubmitInvite,
    watch: watchInvite,
    setValue: setInviteValue,
    reset: resetInvite,
    formState: { errors: inviteErrors },
  } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: "", full_name: "", role: "jugador", player_id: "", categories: [] },
  })

  const inviteRole = watchInvite("role")

  function toggleInviteCategory(category: Category) {
    const current = watchInvite("categories")
    setInviteValue(
      "categories",
      current.includes(category) ? current.filter((c) => c !== category) : [...current, category]
    )
  }

  async function onSubmit(values: LinkFormValues) {
    try {
      await createProfile.mutateAsync({
        id: values.id,
        full_name: values.full_name || null,
        role: values.role,
        player_id: values.role === "jugador" ? values.player_id || null : null,
      })
      if (values.role === "profesor" && values.categories.length > 0) {
        await setProfileCategories.mutateAsync({
          profileId: values.id,
          categories: values.categories,
        })
      }
      toast.success("Cuenta vinculada")
      reset({ id: "", full_name: "", role: "jugador", player_id: "", categories: [] })
      setOpen(false)
    } catch {
      toast.error("No se pudo vincular. Verificá que el UUID exista en Authentication → Users.")
    }
  }

  async function onSubmitInvite(values: InviteFormValues) {
    setInviting(true)
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const res = await fetch("/api/invite-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token ?? ""}`,
        },
        body: JSON.stringify({
          email: values.email,
          full_name: values.full_name || null,
          role: values.role,
          playerId: values.role === "jugador" ? values.player_id || null : null,
          categories: values.role === "profesor" ? values.categories : [],
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error ?? "No se pudo invitar")
      }
      toast.success("Invitación enviada")
      resetInvite({ email: "", full_name: "", role: "jugador", player_id: "", categories: [] })
      setInviteOpen(false)
      // La función invite-user inserta el profile directo por service role,
      // sin pasar por useCreateProfile — hay que invalidar a mano.
      queryClient.invalidateQueries({ queryKey: ["profiles"] })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo invitar")
    } finally {
      setInviting(false)
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
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(true)} className="h-10">
            <UserPlus /> Vincular por UUID
          </Button>
          <Button onClick={() => setInviteOpen(true)} className="h-10">
            <Mail /> Invitar por email
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="text-sm text-muted-foreground">
          <strong className="text-foreground">Invitar por email</strong> es la
          forma normal de dar acceso a un Profesor o Jugador: cargás su email y
          rol, le llega un mail para que ponga su propia contraseña, y queda
          vinculado solo. <strong className="text-foreground">Vincular por UUID</strong>{" "}
          es el flujo manual — creás vos el usuario en el dashboard de Supabase
          (Authentication → Users → Add user) y pegás acá el UUID que te
          muestra; usalo solo si necesitás vincular una cuenta que ya existe.
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
                  {profile.role === "profesor" &&
                    (profile.profile_categories ?? []).map(({ category }) => (
                      <Badge key={category} variant="secondary">
                        {category}
                      </Badge>
                    ))}
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
                        {p.first_name} {p.last_name} · {p.category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {role === "profesor" && (
              <CategoryCheckboxes selected={linkCategories} onToggle={toggleLinkCategory} />
            )}

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="h-11">
                <Plus /> Vincular
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invitar por email</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitInvite(onSubmitInvite)} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                type="email"
                className="h-11"
                {...registerInvite("email")}
              />
              {inviteErrors.email && (
                <p className="text-xs text-destructive">{inviteErrors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="invite-full_name">Nombre</Label>
              <Input id="invite-full_name" className="h-11" {...registerInvite("full_name")} />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Rol</Label>
              <Select
                value={inviteRole}
                onValueChange={(v) => v && setInviteValue("role", v as UserRole)}
              >
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

            {inviteRole === "jugador" && (
              <div className="flex flex-col gap-1.5">
                <Label>Jugador</Label>
                <Select
                  value={watchInvite("player_id") || undefined}
                  onValueChange={(v) => setInviteValue("player_id", v ?? "")}
                >
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Seleccionar jugador" />
                  </SelectTrigger>
                  <SelectContent>
                    {players?.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.first_name} {p.last_name} · {p.category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {inviteRole === "profesor" && (
              <CategoryCheckboxes
                selected={watchInvite("categories")}
                onToggle={toggleInviteCategory}
              />
            )}

            <DialogFooter>
              <Button type="submit" disabled={inviting} className="h-11">
                <Mail /> {inviting ? "Enviando..." : "Invitar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
