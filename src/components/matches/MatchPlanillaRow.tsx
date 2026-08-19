import { useState } from "react"
import { Goal, HeartPulse, Plus, Square, X } from "lucide-react"
import { toast } from "sonner"
import {
  MATCH_HALF_MINUTES,
  segmentDisplayParts,
  sumMinutes,
  sumMinutesByHalf,
  useAddSubstitution,
  useDeleteSubstitution,
} from "@/hooks/useMatchSubstitutions"
import { useAddCard, useDeleteCard } from "@/hooks/useMatchCards"
import { useAddGoal, useDeleteGoal } from "@/hooks/useMatchGoals"
import { useSetInjuryNote } from "@/hooks/useMatchInjuryNotes"
import { useUpdatePlayer } from "@/hooks/usePlayers"
import type { MatchCard, MatchGoal, MatchSubstitution, Player } from "@/types/database"
import type { CardType } from "@/types/domain"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const CARD_STYLES: Record<CardType, string> = {
  Amarilla: "bg-amber-400/20 text-amber-600 dark:text-amber-400",
  Azul: "bg-blue-400/20 text-blue-600 dark:text-blue-400",
}

export function MatchPlanillaRow({
  matchId,
  player,
  segments,
  cards,
  goals,
  injuryNote,
}: {
  matchId: string
  player: Player
  segments: MatchSubstitution[]
  cards: MatchCard[]
  goals: MatchGoal[]
  injuryNote: string
}) {
  const addSubstitution = useAddSubstitution()
  const deleteSubstitution = useDeleteSubstitution()
  const addCard = useAddCard()
  const deleteCard = useDeleteCard()
  const addGoal = useAddGoal()
  const deleteGoal = useDeleteGoal()
  const setInjuryNote = useSetInjuryNote()
  const updatePlayer = useUpdatePlayer()
  const [half, setHalf] = useState<1 | 2>(1)
  const [inMinute, setInMinute] = useState("")
  const [outMinute, setOutMinute] = useState("")
  const [cardMinute, setCardMinute] = useState("")
  const [cardType, setCardType] = useState<CardType>("Amarilla")
  const [goalMinute, setGoalMinute] = useState("")
  const [jerseyNumber, setJerseyNumber] = useState(player.jersey_number?.toString() ?? "")
  const [injury, setInjury] = useState(injuryNote)

  const totalMinutes = sumMinutes(segments)
  const halfTotals = sumMinutesByHalf(segments)
  const amarillasCount = cards.filter((c) => c.type === "Amarilla").length
  const azulesCount = cards.filter((c) => c.type === "Azul").length

  async function handleCommitJerseyNumber() {
    const value = jerseyNumber ? Number(jerseyNumber) : null
    if (value === player.jersey_number) return
    try {
      await updatePlayer.mutateAsync({ id: player.id, input: { jersey_number: value } })
    } catch {
      toast.error("No se pudo actualizar el número")
      setJerseyNumber(player.jersey_number?.toString() ?? "")
    }
  }

  async function handleAddSegment() {
    const localIn = Number(inMinute)
    const localOut = Number(outMinute)
    if (!inMinute || !outMinute || !Number.isFinite(localIn) || !Number.isFinite(localOut)) {
      toast.error("Cargá minuto de entrada y salida")
      return
    }
    if (localIn < 0 || localOut > MATCH_HALF_MINUTES) {
      toast.error(`El minuto tiene que estar entre 0 y ${MATCH_HALF_MINUTES}`)
      return
    }
    if (localOut < localIn) {
      toast.error("El minuto de salida no puede ser antes que el de entrada")
      return
    }
    const offset = (half - 1) * MATCH_HALF_MINUTES
    try {
      await addSubstitution.mutateAsync({
        match_id: matchId,
        player_id: player.id,
        in_minute: offset + localIn,
        out_minute: offset + localOut,
      })
      setInMinute("")
      setOutMinute("")
    } catch {
      toast.error("No se pudo cargar el tramo")
    }
  }

  async function handleRemoveSegment(segmentId: string) {
    try {
      await deleteSubstitution.mutateAsync({ id: segmentId, matchId, playerId: player.id })
    } catch {
      toast.error("No se pudo quitar el tramo")
    }
  }

  async function handleAddCard() {
    try {
      await addCard.mutateAsync({
        match_id: matchId,
        player_id: player.id,
        type: cardType,
        minute: cardMinute ? Number(cardMinute) : null,
        notes: null,
      })
      setCardMinute("")
    } catch {
      toast.error("No se pudo cargar la tarjeta")
    }
  }

  async function handleRemoveCard(cardId: string) {
    try {
      await deleteCard.mutateAsync({ id: cardId, matchId, playerId: player.id })
    } catch {
      toast.error("No se pudo quitar la tarjeta")
    }
  }

  async function handleAddGoal() {
    try {
      await addGoal.mutateAsync({
        match_id: matchId,
        player_id: player.id,
        minute: goalMinute ? Number(goalMinute) : null,
        notes: null,
      })
      setGoalMinute("")
    } catch {
      toast.error("No se pudo cargar el gol")
    }
  }

  async function handleRemoveGoal(goalId: string) {
    try {
      await deleteGoal.mutateAsync({ id: goalId, matchId, playerId: player.id })
    } catch {
      toast.error("No se pudo quitar el gol")
    }
  }

  async function handleCommitInjury() {
    if (injury.trim() === injuryNote.trim()) return
    try {
      await setInjuryNote.mutateAsync({ matchId, playerId: player.id, note: injury })
    } catch {
      toast.error("No se pudo guardar la molestia")
      setInjury(injuryNote)
    }
  }

  return (
    <div className="flex flex-col gap-3 py-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <span className="text-xs text-muted-foreground">#</span>
          <Input
            type="number"
            min={0}
            value={jerseyNumber}
            onChange={(e) => setJerseyNumber(e.target.value)}
            onBlur={handleCommitJerseyNumber}
            className="h-7 w-14 shrink-0 px-1 text-center font-mono text-xs"
          />
          <span className="truncate text-sm font-medium">
            {player.first_name} {player.last_name}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-3 text-sm font-semibold tabular-nums">
          <span>{totalMinutes}'</span>
          {goals.length > 0 && (
            <span className="flex items-center gap-1 text-success">
              <Goal className="size-3.5" />
              {goals.length}
            </span>
          )}
          {amarillasCount > 0 && (
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <Square className="size-3 fill-current" />
              {amarillasCount}
            </span>
          )}
          {azulesCount > 0 && (
            <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
              <Square className="size-3 fill-current" />
              {azulesCount}
            </span>
          )}
          {injuryNote && <HeartPulse className="size-3.5 text-destructive" />}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 rounded-lg bg-muted/40 p-2">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium text-muted-foreground">Minutos</p>
          <p className="text-[11px] tabular-nums text-muted-foreground">
            1er T. {halfTotals.firstHalf}' · 2do T. {halfTotals.secondHalf}' · Total {totalMinutes}'
          </p>
        </div>
        {segments.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {segments.map((s) =>
              segmentDisplayParts(s).map((part) => (
                <span
                  key={`${s.id}-${part.half}`}
                  className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs"
                >
                  {part.half === 1 ? "1erT" : "2doT"} {part.from}'–{part.to}'
                  <button
                    onClick={() => handleRemoveSegment(s.id)}
                    aria-label="Quitar tramo"
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))
            )}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex overflow-hidden rounded-md border">
            {([1, 2] as const).map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setHalf(h)}
                className={cn(
                  "px-2 py-1.5 text-xs font-medium transition-colors",
                  half === h
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent"
                )}
              >
                {h === 1 ? "1er T." : "2do T."}
              </button>
            ))}
          </div>
          <Input
            type="number"
            min={0}
            max={MATCH_HALF_MINUTES}
            placeholder="Entró"
            value={inMinute}
            onChange={(e) => setInMinute(e.target.value)}
            className="h-8 w-16 text-center text-xs"
          />
          <span className="text-xs text-muted-foreground">a</span>
          <Input
            type="number"
            min={0}
            max={MATCH_HALF_MINUTES}
            placeholder="Salió"
            value={outMinute}
            onChange={(e) => setOutMinute(e.target.value)}
            className="h-8 w-16 text-center text-xs"
          />
          <Button
            variant="outline"
            size="icon-sm"
            onClick={handleAddSegment}
            disabled={addSubstitution.isPending}
            aria-label="Agregar tramo"
          >
            <Plus className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 rounded-lg bg-muted/40 p-2">
        <p className="text-[11px] font-medium text-muted-foreground">Goles</p>
        {goals.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {goals.map((g) => (
              <span
                key={g.id}
                className="flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-xs text-success"
              >
                <Goal className="size-2.5" />
                {g.minute != null ? `${g.minute}'` : "s/min"}
                <button
                  onClick={() => handleRemoveGoal(g.id)}
                  aria-label="Quitar gol"
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Input
            type="number"
            min={0}
            placeholder="Minuto (opcional)"
            value={goalMinute}
            onChange={(e) => setGoalMinute(e.target.value)}
            className="h-8 w-28 text-center text-xs"
          />
          <Button
            variant="outline"
            size="icon-sm"
            onClick={handleAddGoal}
            disabled={addGoal.isPending}
            aria-label="Agregar gol"
          >
            <Plus className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 rounded-lg bg-muted/40 p-2">
        <p className="text-[11px] font-medium text-muted-foreground">Tarjetas</p>
        {cards.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {cards.map((c) => (
              <span
                key={c.id}
                className={cn(
                  "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs",
                  CARD_STYLES[c.type]
                )}
              >
                <Square className="size-2.5 fill-current" />
                {c.minute != null ? `${c.minute}'` : "s/min"}
                <button
                  onClick={() => handleRemoveCard(c.id)}
                  aria-label="Quitar tarjeta"
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <div className="flex overflow-hidden rounded-md border">
            {(["Amarilla", "Azul"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setCardType(t)}
                className={cn(
                  "px-2 py-1.5 text-xs font-medium transition-colors",
                  cardType === t ? CARD_STYLES[t] : "text-muted-foreground hover:bg-accent"
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <Input
            type="number"
            min={0}
            placeholder="Minuto (opcional)"
            value={cardMinute}
            onChange={(e) => setCardMinute(e.target.value)}
            className="h-8 w-28 text-center text-xs"
          />
          <Button
            variant="outline"
            size="icon-sm"
            onClick={handleAddCard}
            disabled={addCard.isPending}
            aria-label="Agregar tarjeta"
          >
            <Plus className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 rounded-lg bg-muted/40 p-2">
        <p className="text-[11px] font-medium text-muted-foreground">Molestias musculares</p>
        <Input
          placeholder="Sin molestias"
          value={injury}
          onChange={(e) => setInjury(e.target.value)}
          onBlur={handleCommitInjury}
          className="h-8 text-xs"
        />
      </div>
    </div>
  )
}
