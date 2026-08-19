import { useMemo, useState } from "react"
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
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

export function CalendarMonthGrid({
  daysWithTraining,
  daysWithRoutine,
  daysWithMatch,
  selectedDay,
  onSelectDay,
}: {
  daysWithTraining: Set<string>
  daysWithRoutine: Set<string>
  daysWithMatch: Set<string>
  selectedDay: Date
  onSelectDay: (day: Date) => void
}) {
  const [month, setMonth] = useState(() => startOfMonth(selectedDay))

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 })
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [month])

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
          const inMonth = isSameMonth(day, month)
          const hasTraining = daysWithTraining.has(key)
          const hasRoutine = daysWithRoutine.has(key)
          const hasMatch = daysWithMatch.has(key)
          const hasAny = hasTraining || hasRoutine || hasMatch

          return (
            <button
              key={key}
              onClick={() => onSelectDay(day)}
              className={cn(
                "flex aspect-square flex-col items-center justify-center gap-1 rounded-lg text-sm transition-colors",
                inMonth ? "text-foreground" : "text-muted-foreground/40",
                isToday(day) && "ring-1 ring-primary",
                isSameDay(day, selectedDay) && "bg-primary/15 font-semibold text-primary",
                !isSameDay(day, selectedDay) && "hover:bg-accent"
              )}
            >
              {day.getDate()}
              {hasAny && (
                <span className="flex items-center gap-0.5">
                  {hasTraining && <span className="size-1 rounded-full bg-green-500" />}
                  {hasRoutine && <span className="size-1 rounded-full bg-purple-500" />}
                  {hasMatch && <span className="size-1 rounded-full bg-primary" />}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
