import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns"
import { es } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { TrainingSession } from "@/types/database"

const TRAINING_WEEKDAY_INDEXES = [1, 3, 5] // lunes, miércoles, viernes

export function TrainingCalendar({ sessions }: { sessions: TrainingSession[] }) {
  const navigate = useNavigate()
  const [month, setMonth] = useState(() => startOfMonth(new Date()))

  const sessionsByDate = useMemo(() => {
    const map = new Map<string, TrainingSession>()
    for (const s of sessions) map.set(s.date, s)
    return map
  }, [sessions])

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 })
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [month])

  function handleDayClick(day: Date) {
    const key = format(day, "yyyy-MM-dd")
    const session = sessionsByDate.get(key)
    if (session) {
      navigate(`/trainings/${session.id}`)
    } else if (TRAINING_WEEKDAY_INDEXES.includes(day.getDay())) {
      navigate(`/trainings/new?date=${key}`)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => setMonth((m) => subMonths(m, 1))}>
          <ChevronLeft />
        </Button>
        <p className="text-sm font-semibold capitalize">
          {format(month, "MMMM yyyy", { locale: es })}
        </p>
        <Button variant="ghost" size="icon" onClick={() => setMonth((m) => addMonths(m, 1))}>
          <ChevronRight />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-muted-foreground">
        {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd")
          const session = sessionsByDate.get(key)
          const inMonth = isSameMonth(day, month)
          const isTrainingDay = TRAINING_WEEKDAY_INDEXES.includes(day.getDay())
          const clickable = Boolean(session) || (isTrainingDay && inMonth)

          return (
            <button
              key={key}
              disabled={!clickable}
              onClick={() => handleDayClick(day)}
              className={cn(
                "flex aspect-square flex-col items-center justify-center gap-0.5 rounded-lg text-sm transition-colors",
                inMonth ? "text-foreground" : "text-muted-foreground/40",
                isToday(day) && "ring-1 ring-primary",
                session && "bg-primary/15 font-semibold text-primary",
                !session && isTrainingDay && inMonth && "bg-muted",
                clickable && !session && "hover:bg-accent"
              )}
            >
              {day.getDate()}
              {session && <span className="size-1 rounded-full bg-primary" />}
            </button>
          )
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Entrenamientos: lunes, miércoles y viernes · 18:00 a 19:15
      </p>
    </div>
  )
}
