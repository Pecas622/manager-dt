import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { addDays, eachDayOfInterval, format, startOfWeek, subDays } from "date-fns"
import { es } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useTrainingSessions } from "@/hooks/useTrainingSessions"
import { useRoutineAssignments } from "@/hooks/useRoutines"
import { useMatches } from "@/hooks/useMatches"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDayCard } from "@/components/calendar/CalendarDayCard"
import { CalendarMonthGrid } from "@/components/calendar/CalendarMonthGrid"
import { MatchFormDialog } from "@/components/matches/MatchFormDialog"
import type { Match } from "@/types/database"

export function CalendarPage() {
  const navigate = useNavigate()
  const { role } = useAuth()
  const { data: sessions } = useTrainingSessions()
  const { data: assignments } = useRoutineAssignments()
  const { data: matches } = useMatches()
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [selectedDay, setSelectedDay] = useState(() => new Date())
  const [matchDialog, setMatchDialog] = useState<{ open: boolean; match?: Match; date?: string }>({
    open: false,
  })

  const days = useMemo(
    () => eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) }),
    [weekStart]
  )

  const daysWithTraining = useMemo(
    () => new Set((sessions ?? []).map((s) => s.date)),
    [sessions]
  )
  const daysWithRoutine = useMemo(
    () => new Set((assignments ?? []).map((a) => a.date)),
    [assignments]
  )
  const daysWithMatch = useMemo(() => new Set((matches ?? []).map((m) => m.date)), [matches])

  function activitiesFor(dateStr: string) {
    return {
      daySessions: (sessions ?? []).filter((s) => s.date === dateStr),
      dayAssignments: (assignments ?? []).filter((a) => a.date === dateStr),
      dayMatches: (matches ?? []).filter((m) => m.date === dateStr),
    }
  }

  const selectedDateStr = format(selectedDay, "yyyy-MM-dd")
  const selectedActivities = activitiesFor(selectedDateStr)

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Calendario</h1>

      <Tabs defaultValue="semana">
        <TabsList>
          <TabsTrigger value="semana">Semana</TabsTrigger>
          <TabsTrigger value="mes">Mes</TabsTrigger>
        </TabsList>

        <TabsContent value="semana" className="mt-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setWeekStart((d) => subDays(d, 7))}>
              <ChevronLeft />
            </Button>
            <div className="flex flex-col items-center">
              <p className="text-sm font-semibold">
                {format(weekStart, "d MMM", { locale: es })} –{" "}
                {format(addDays(weekStart, 6), "d MMM yyyy", { locale: es })}
              </p>
              <button
                className="text-xs text-primary hover:underline"
                onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}
              >
                Ir a hoy
              </button>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setWeekStart((d) => addDays(d, 7))}>
              <ChevronRight />
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            {days.map((day) => {
              const dateStr = format(day, "yyyy-MM-dd")
              const { daySessions, dayAssignments, dayMatches } = activitiesFor(dateStr)

              return (
                <CalendarDayCard
                  key={dateStr}
                  day={day}
                  sessions={daySessions}
                  assignments={dayAssignments}
                  matches={dayMatches}
                  role={role}
                  onOpenTraining={(id) => navigate(`/trainings/${id}`)}
                  onOpenRoutine={(routineId) => navigate(`/routines/${routineId}`)}
                  onOpenMatch={(id) => navigate(`/matches/${id}`)}
                  onNewTraining={() => navigate(`/trainings/new?date=${dateStr}`)}
                  onNewMatch={() => setMatchDialog({ open: true, date: dateStr })}
                  onNewRoutine={() => navigate("/routines")}
                />
              )
            })}
          </div>

          <button
            onClick={() => navigate("/trainings")}
            className="self-center text-sm text-primary hover:underline"
          >
            Ver historial completo de entrenamientos
          </button>
        </TabsContent>

        <TabsContent value="mes" className="mt-4 flex flex-col gap-4">
          <CalendarMonthGrid
            daysWithTraining={daysWithTraining}
            daysWithRoutine={daysWithRoutine}
            daysWithMatch={daysWithMatch}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
          />

          <CalendarDayCard
            day={selectedDay}
            sessions={selectedActivities.daySessions}
            assignments={selectedActivities.dayAssignments}
            matches={selectedActivities.dayMatches}
            role={role}
            onOpenTraining={(id) => navigate(`/trainings/${id}`)}
            onOpenRoutine={(routineId) => navigate(`/routines/${routineId}`)}
            onOpenMatch={(id) => navigate(`/matches/${id}`)}
            onNewTraining={() => navigate(`/trainings/new?date=${selectedDateStr}`)}
            onNewMatch={() => setMatchDialog({ open: true, date: selectedDateStr })}
            onNewRoutine={() => navigate("/routines")}
          />
        </TabsContent>
      </Tabs>

      <MatchFormDialog
        open={matchDialog.open}
        onOpenChange={(open) => setMatchDialog((prev) => ({ ...prev, open }))}
        match={matchDialog.match}
        defaultDate={matchDialog.date}
      />
    </div>
  )
}
