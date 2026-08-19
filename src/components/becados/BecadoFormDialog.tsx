import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { useCreateBecado, useUpdateBecado } from "@/hooks/useBecados"
import { BECADO_STATUSES, MEMBER_TYPES } from "@/types/domain"
import type { Becado } from "@/types/database"
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

const becadoSchema = z.object({
  first_name: z.string().min(1, "Requerido"),
  last_name: z.string().min(1, "Requerido"),
  dni: z.string().min(6, "DNI inválido"),
  type: z.enum(MEMBER_TYPES),
  status: z.enum(BECADO_STATUSES),
  notes: z.string().optional(),
})

type BecadoFormValues = z.infer<typeof becadoSchema>

const emptyValues: BecadoFormValues = {
  first_name: "",
  last_name: "",
  dni: "",
  type: "Becado",
  status: "Activo",
  notes: "",
}

export function BecadoFormDialog({
  open,
  onOpenChange,
  becado,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  becado?: Becado
}) {
  const createBecado = useCreateBecado()
  const updateBecado = useUpdateBecado()
  const isEditing = Boolean(becado)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BecadoFormValues>({
    resolver: zodResolver(becadoSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    if (open) {
      reset(
        becado
          ? {
              first_name: becado.first_name,
              last_name: becado.last_name,
              dni: becado.dni,
              type: becado.type,
              status: becado.status,
              notes: becado.notes ?? "",
            }
          : emptyValues
      )
    }
  }, [open, becado, reset])

  async function onSubmit(values: BecadoFormValues) {
    const payload = {
      first_name: values.first_name,
      last_name: values.last_name,
      dni: values.dni,
      type: values.type,
      status: values.status,
      notes: values.notes || null,
    }
    try {
      if (isEditing && becado) {
        await updateBecado.mutateAsync({ id: becado.id, input: payload })
        toast.success("Actualizado")
      } else {
        await createBecado.mutateAsync(payload)
        toast.success("Agregado")
      }
      onOpenChange(false)
    } catch (err) {
      const message =
        err instanceof Error && err.message.includes("duplicate")
          ? "Ya existe una persona con ese DNI"
          : "No se pudo guardar"
      toast.error(message)
    }
  }

  const type = watch("type")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar persona" : "Nueva persona"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="first_name">Nombre</Label>
              <Input id="first_name" className="h-11" {...register("first_name")} />
              {errors.first_name && (
                <p className="text-xs text-destructive">{errors.first_name.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="last_name">Apellido</Label>
              <Input id="last_name" className="h-11" {...register("last_name")} />
              {errors.last_name && (
                <p className="text-xs text-destructive">{errors.last_name.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="dni">DNI</Label>
            <Input
              id="dni"
              inputMode="numeric"
              placeholder="12345678"
              className="h-11"
              {...register("dni")}
            />
            {errors.dni && <p className="text-xs text-destructive">{errors.dni.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Tipo</Label>
            <Select
              value={type}
              onValueChange={(v) => v && setValue("type", v as BecadoFormValues["type"])}
            >
              <SelectTrigger className="h-11 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MEMBER_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {type === "Becado" ? "No paga cuota." : "Paga cuota — no se registran montos, solo si está al día."}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Estado</Label>
            <Select
              value={watch("status")}
              onValueChange={(v) => v && setValue("status", v as BecadoFormValues["status"])}
            >
              <SelectTrigger className="h-11 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BECADO_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {type === "Becado"
                ? "Activo = puede entrar. Inactivo = beca vencida/no vigente."
                : "Activo = cuota al día, puede entrar. Inactivo = atrasado."}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">Notas</Label>
            <Textarea id="notes" rows={2} {...register("notes")} />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} className="h-11">
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
