import { cn } from "@/lib/utils"

export function WeekSelector({
  durationWeeks,
  selectedWeek,
  onSelect,
}: {
  durationWeeks: number
  selectedWeek: number
  onSelect: (week: number) => void
}) {
  const weeks = Array.from({ length: durationWeeks }, (_, i) => i + 1)

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1">
      {weeks.map((week) => (
        <button
          key={week}
          onClick={() => onSelect(week)}
          className={cn(
            "h-9 shrink-0 rounded-lg px-3 text-sm font-medium transition-colors",
            week === selectedWeek
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-accent"
          )}
        >
          S{week}
        </button>
      ))}
    </div>
  )
}
