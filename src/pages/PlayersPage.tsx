import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Plus, Search } from "lucide-react"
import { usePlayers } from "@/hooks/usePlayers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PlayerCard } from "@/components/players/PlayerCard"
import { PositionBadge } from "@/components/players/PositionBadge"
import { Badge } from "@/components/ui/badge"
import { POSITIONS, PLAYER_STATUSES } from "@/types/domain"

export function PlayersPage() {
  const navigate = useNavigate()
  const { data: players, isLoading } = usePlayers()
  const [search, setSearch] = useState("")
  const [position, setPosition] = useState<string>("all")
  const [status, setStatus] = useState<string>("all")

  const filtered = useMemo(() => {
    if (!players) return []
    const term = search.trim().toLowerCase()
    return players.filter((p) => {
      if (position !== "all" && p.position !== position) return false
      if (status !== "all" && p.status !== status) return false
      if (!term) return true
      const haystack = `${p.first_name} ${p.last_name} ${p.jersey_number ?? ""}`.toLowerCase()
      return haystack.includes(term)
    })
  }, [players, search, position, status])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Jugadores</h1>
        <Button render={<Link to="/players/new" />} className="h-10">
          <Plus /> Nuevo jugador
        </Button>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o dorsal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={position} onValueChange={(v) => setPosition(v ?? "all")}>
            <SelectTrigger className="h-11 flex-1 sm:w-40">
              <SelectValue placeholder="Posición" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las posiciones</SelectItem>
              {POSITIONS.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v) => setStatus(v ?? "all")}>
            <SelectTrigger className="h-11 flex-1 sm:w-36">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {PLAYER_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-[68px] w-full rounded-xl" />
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No se encontraron jugadores con estos filtros.
        </p>
      )}

      {!isLoading && filtered.length > 0 && (
        <>
          <div className="flex flex-col gap-2 md:hidden">
            {filtered.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-xl ring-1 ring-border md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dorsal</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Posición</TableHead>
                  <TableHead>Pierna hábil</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((player) => (
                  <TableRow
                    key={player.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/players/${player.id}`)}
                  >
                    <TableCell className="font-mono">
                      #{player.jersey_number ?? "-"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {player.first_name} {player.last_name}
                    </TableCell>
                    <TableCell>
                      <PositionBadge position={player.position} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {player.preferred_foot ?? "-"}
                    </TableCell>
                    <TableCell>
                      {player.status === "Activo" ? (
                        <Badge variant="outline" className="border-success/40 text-success">
                          Activo
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Inactivo</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  )
}
