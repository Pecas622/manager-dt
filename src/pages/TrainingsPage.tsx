import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Plus } from "lucide-react"
import { useTrainingSessions } from "@/hooks/useTrainingSessions"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TrainingCard } from "@/components/trainings/TrainingCard"
import { TrainingCalendar } from "@/components/trainings/TrainingCalendar"

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
]

export function TrainingsPage() {
  const { data: sessions, isLoading } = useTrainingSessions()
  const [month, setMonth] = useState("all")
  const [year, setYear] = useState("all")

  const years = useMemo(() => {
    if (!sessions) return []
    const set = new Set(sessions.map((s) => s.date.slice(0, 4)))
    return Array.from(set).sort().reverse()
  }, [sessions])

  const filtered = useMemo(() => {
    if (!sessions) return []
    return sessions.filter((s) => {
      const [y, m] = s.date.split("-")
      if (year !== "all" && y !== year) return false
      if (month !== "all" && Number(m) !== Number(month)) return false
      return true
    })
  }, [sessions, month, year])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Entrenamientos</h1>
        <Button render={<Link to="/trainings/new" />} className="h-10">
          <Plus /> Nuevo entrenamiento
        </Button>
      </div>

      <Tabs defaultValue="lista">
        <TabsList>
          <TabsTrigger value="lista">Lista</TabsTrigger>
          <TabsTrigger value="calendario">Calendario</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="mt-4 flex flex-col gap-3">
          <div className="flex gap-2">
            <Select value={month} onValueChange={(v) => setMonth(v ?? "all")}>
              <SelectTrigger className="h-10 flex-1">
                <SelectValue placeholder="Mes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los meses</SelectItem>
                {MONTHS.map((m, i) => (
                  <SelectItem key={m} value={(i + 1).toString()}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={year} onValueChange={(v) => setYear(v ?? "all")}>
              <SelectTrigger className="h-10 w-28">
                <SelectValue placeholder="Año" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {years.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading && (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No hay entrenamientos con estos filtros.
            </p>
          )}

          <div className="flex flex-col gap-2">
            {filtered.map((session) => (
              <TrainingCard
                key={session.id}
                session={session}
                exerciseCount={session.session_exercises.length}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendario" className="mt-4">
          <TrainingCalendar sessions={sessions ?? []} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
