import { useAuth } from "@/hooks/useAuth"
import { AppShell } from "@/components/layout/AppShell"
import { PlayerShell } from "@/components/layout/PlayerShell"
import { CoordinadorShell } from "@/components/layout/CoordinadorShell"

export function RootShell() {
  const { role } = useAuth()

  if (role === "jugador") {
    return <PlayerShell />
  }

  if (role === "coordinador") {
    return <CoordinadorShell />
  }

  return <AppShell />
}
