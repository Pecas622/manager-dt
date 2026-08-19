import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { ArrowLeft, Dumbbell, Loader2, Pencil, Plus, Trash2, UserPlus } from "lucide-react"
import { toast } from "sonner"
import {
  useDeleteNational,
  useDeleteNationalActivity,
  useDeleteNationalExpense,
  useNational,
  useNationalActivities,
  useNationalExpenses,
  useNationalPlayerCosts,
} from "@/hooks/useNationals"
import type { NationalActivity } from "@/types/database"
import { usePlayers } from "@/hooks/usePlayers"
import { NATIONAL_ACTIVITY_LABELS } from "@/types/domain"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NationalActivityFormDialog } from "@/components/nationals/NationalActivityFormDialog"
import { NationalExpenseFormDialog } from "@/components/nationals/NationalExpenseFormDialog"
import { NationalPlayerCostRow } from "@/components/nationals/NationalPlayerCostRow"
import { NationalPlayerStatsRow } from "@/components/nationals/NationalPlayerStatsRow"
import { NationalCalendarGrid } from "@/components/nationals/NationalCalendarGrid"
import { NationalAddPlayersDialog } from "@/components/nationals/NationalAddPlayersDialog"
import { NationalDefaultCostCard } from "@/components/nationals/NationalDefaultCostCard"

function fmt(value: number) {
  return value.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 })
}

export function NationalDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: national, isLoading } = useNational(id)
  const { data: activities } = useNationalActivities(id)
  const { data: expenses } = useNationalExpenses(id)
  const { data: playerCosts } = useNationalPlayerCosts(id)
  const { data: players } = usePlayers()
  const deleteNational = useDeleteNational()
  const deleteActivity = useDeleteNationalActivity()
  const deleteExpense = useDeleteNationalExpense()

  const [activityDialog, setActivityDialog] = useState(false)
  const [editingActivity, setEditingActivity] = useState<NationalActivity | undefined>(undefined)
  const [expenseDialog, setExpenseDialog] = useState(false)
  const [addPlayersDialog, setAddPlayersDialog] = useState(false)
  const [selectedDay, setSelectedDay] = useState<Date>(() => new Date())
  const initializedDay = useRef(false)

  useEffect(() => {
    if (national?.start_date && !initializedDay.current) {
      initializedDay.current = true
      setSelectedDay(parseISO(national.start_date))
    }
  }, [national?.start_date])

  function openNewActivity() {
    setEditingActivity(undefined)
    setActivityDialog(true)
  }

  function handleSelectDay(day: Date) {
    setSelectedDay(day)
    setEditingActivity(undefined)
    setActivityDialog(true)
  }

  function openEditActivity(activity: NationalActivity) {
    setEditingActivity(activity)
    setActivityDialog(true)
  }

  const availablePlayers = useMemo(() => {
    const already = new Set((playerCosts ?? []).map((c) => c.player_id))
    return (players ?? []).filter((p) => !already.has(p.id))
  }, [players, playerCosts])

  const totals = useMemo(() => {
    const costTotal = (playerCosts ?? []).reduce((sum, c) => sum + c.total_cost, 0)
    const paidTotal = (playerCosts ?? []).reduce(
      (sum, c) => sum + (c.national_payments ?? []).reduce((s, p) => s + p.amount, 0),
      0
    )
    const expenseTotal = (expenses ?? []).reduce((sum, e) => sum + Number(e.amount), 0)
    return { costTotal, paidTotal, expenseTotal }
  }, [playerCosts, expenses])

  async function handleDeleteNational() {
    if (!national) return
    if (!confirm(`¿Eliminar "${national.name}"? Se borra todo su cronograma, gastos y pagos.`)) return
    try {
      await deleteNational.mutateAsync(national.id)
      toast.success("Nacional eliminado")
      navigate("/nationals")
    } catch {
      toast.error("No se pudo eliminar")
    }
  }

  if (isLoading || !national) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const daysWithActivity = new Set((activities ?? []).map((a) => a.date))
  const selectedDateStr = format(selectedDay, "yyyy-MM-dd")
  const selectedDayActivities = (activities ?? []).filter((a) => a.date === selectedDateStr)

  return (
    <div className="flex flex-col gap-4 pb-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Volver" className="shrink-0">
            <ArrowLeft />
          </Button>
          <h1 className="truncate text-xl font-semibold">{national.name}</h1>
        </div>
        <div className="flex shrink-0 gap-1.5">
          <Button variant="outline" size="icon" render={<Link to={`/nationals/${national.id}/edit`} aria-label="Editar" />}>
            <Pencil />
          </Button>
          <Button variant="destructive" size="icon" onClick={handleDeleteNational} aria-label="Eliminar">
            <Trash2 />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-2 text-sm">
          {national.city && <p className="text-muted-foreground">{national.city}</p>}
          <p>
            {format(parseISO(national.start_date), "d MMM", { locale: es })} –{" "}
            {format(parseISO(national.end_date), "d MMM yyyy", { locale: es })}
          </p>
          {national.travel_date && (
            <p className="text-muted-foreground">
              Viaje: {format(parseISO(national.travel_date), "d MMM", { locale: es })}
              {national.return_date &&
                ` · Regreso: ${format(parseISO(national.return_date), "d MMM", { locale: es })}`}
            </p>
          )}
          {national.info && <p className="text-muted-foreground">{national.info}</p>}
        </CardContent>
      </Card>

      <Tabs defaultValue="calendario">
        <TabsList className="w-full">
          <TabsTrigger value="calendario">Calendario</TabsTrigger>
          <TabsTrigger value="jugadores">Jugadores</TabsTrigger>
          <TabsTrigger value="gastos">Gastos</TabsTrigger>
        </TabsList>

        <TabsContent value="calendario" className="mt-4 flex flex-col gap-3">
          <NationalCalendarGrid
            daysWithActivity={daysWithActivity}
            selectedDay={selectedDay}
            onSelectDay={handleSelectDay}
          />

          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold capitalize text-muted-foreground">
              {format(selectedDay, "EEEE d MMMM", { locale: es })}
            </p>
            <Button size="sm" className="h-9" onClick={openNewActivity}>
              <Plus /> Agregar
            </Button>
          </div>

          {selectedDayActivities.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Sin actividades este día.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {selectedDayActivities.map((a) => (
                <Card key={a.id}>
                  <CardContent className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {a.time && (
                          <span className="font-mono text-xs text-muted-foreground">
                            {a.time.slice(0, 5)}
                          </span>
                        )}
                        <Badge variant="outline">{NATIONAL_ACTIVITY_LABELS[a.type]}</Badge>
                      </div>
                      <p className="text-sm font-medium">{a.title}</p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      {a.type === "rutina" && a.routine_id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          render={
                            <Link to={`/routines/${a.routine_id}`} aria-label="Ver ejercicios de la rutina" />
                          }
                        >
                          <Dumbbell className="size-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditActivity(a)}
                        aria-label="Editar"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteActivity.mutate({ id: a.id, nationalId: national.id })}
                        className="text-destructive hover:text-destructive"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="jugadores" className="mt-4 flex flex-col gap-3">
          <Button
            className="h-11 self-start"
            onClick={() => setAddPlayersDialog(true)}
            disabled={availablePlayers.length === 0}
          >
            <UserPlus /> Agregar jugadores al plantel
          </Button>

          {playerCosts?.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Todavía no agregaste jugadores al plantel de este Nacional.
            </p>
          )}

          <div className="flex flex-col gap-2">
            {playerCosts?.map((cost) => (
              <NationalPlayerStatsRow key={cost.id} cost={cost} nationalId={national.id} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="gastos" className="mt-4 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2 text-center">
            <Card>
              <CardContent className="py-3">
                <p className="text-lg font-semibold">{fmt(totals.costTotal)}</p>
                <p className="text-[11px] text-muted-foreground">Costo total jugadores</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-3">
                <p className="text-lg font-semibold">{fmt(totals.paidTotal)}</p>
                <p className="text-[11px] text-muted-foreground">Pagado</p>
              </CardContent>
            </Card>
          </div>

          <NationalDefaultCostCard national={national} playerCosts={playerCosts ?? []} />

          {playerCosts?.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Todavía no agregaste jugadores al plantel (se hace desde Jugadores).
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {playerCosts?.map((cost) => (
                <NationalPlayerCostRow key={cost.id} cost={cost} nationalId={national.id} />
              ))}
            </div>
          )}

          <Card>
            <CardContent className="text-center">
              <p className="text-lg font-semibold">{fmt(totals.expenseTotal)}</p>
              <p className="text-[11px] text-muted-foreground">Gastos generales</p>
            </CardContent>
          </Card>

          <Button className="h-10 self-start" onClick={() => setExpenseDialog(true)}>
            <Plus /> Nuevo gasto
          </Button>

          {expenses?.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Todavía no cargaste gastos.
            </p>
          )}

          <div className="flex flex-col gap-2">
            {expenses?.map((e) => (
              <Card key={e.id}>
                <CardContent className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{e.category}</Badge>
                      <span className="font-semibold">{fmt(Number(e.amount))}</span>
                    </div>
                    {e.description && (
                      <p className="text-sm text-muted-foreground">{e.description}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteExpense.mutate({ id: e.id, nationalId: national.id })}
                    className="shrink-0 text-destructive hover:text-destructive"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <NationalActivityFormDialog
        open={activityDialog}
        onOpenChange={setActivityDialog}
        nationalId={national.id}
        defaultDate={selectedDateStr}
        activity={editingActivity}
      />
      <NationalExpenseFormDialog
        open={expenseDialog}
        onOpenChange={setExpenseDialog}
        nationalId={national.id}
      />
      <NationalAddPlayersDialog
        open={addPlayersDialog}
        onOpenChange={setAddPlayersDialog}
        national={national}
        availablePlayers={availablePlayers}
      />
    </div>
  )
}
