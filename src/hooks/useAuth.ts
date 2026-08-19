import { useEffect, useState } from "react"
import type { Session } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabaseClient"
import type { UserRole } from "@/types/domain"

interface AuthState {
  session: Session | null
  loading: boolean
  role: UserRole | null
  playerId: string | null
}

async function loadProfile(userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("role, player_id")
    .eq("id", userId)
    .maybeSingle()
  return data
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    session: null,
    loading: true,
    role: null,
    playerId: null,
  })

  useEffect(() => {
    let active = true

    async function bootstrap() {
      const { data } = await supabase.auth.getSession()
      const session = data.session
      const profile = session ? await loadProfile(session.user.id) : null
      if (!active) return
      setState({
        session,
        loading: false,
        role: (profile?.role as UserRole | undefined) ?? null,
        playerId: profile?.player_id ?? null,
      })
    }

    bootstrap()

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        const profile = newSession ? await loadProfile(newSession.user.id) : null
        if (!active) return
        setState({
          session: newSession,
          loading: false,
          role: (profile?.role as UserRole | undefined) ?? null,
          playerId: profile?.player_id ?? null,
        })
      }
    )

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  return {
    session: state.session,
    loading: state.loading,
    isAuthenticated: Boolean(state.session),
    role: state.role,
    playerId: state.playerId,
  }
}
