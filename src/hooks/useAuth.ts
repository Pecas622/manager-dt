import { useEffect, useState } from "react"
import type { Session } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabaseClient"
import type { Category, UserRole } from "@/types/domain"

interface AuthState {
  session: Session | null
  loading: boolean
  role: UserRole | null
  playerId: string | null
  categories: Category[]
}

// Categorías visibles para el perfil: Jugador la resuelve vía su propio
// jugador vinculado (siempre una sola); el resto sale de
// `profile_categories`. El DT no necesita nada acá — ve todas por su rol
// (ver `useActiveCategory`).
async function loadCategories(role: UserRole, playerId: string | null): Promise<Category[]> {
  if (role === "jugador") {
    if (!playerId) return []
    const { data } = await supabase
      .from("players")
      .select("category")
      .eq("id", playerId)
      .maybeSingle()
    return data?.category ? [data.category as Category] : []
  }
  const { data } = await supabase.from("profile_categories").select("category")
  return (data ?? []).map((row) => row.category as Category)
}

async function loadProfile(userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("role, player_id")
    .eq("id", userId)
    .maybeSingle()
  if (!data) return null
  const categories = await loadCategories(data.role as UserRole, data.player_id)
  return { ...data, categories }
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    session: null,
    loading: true,
    role: null,
    playerId: null,
    categories: [],
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
        categories: profile?.categories ?? [],
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
          categories: profile?.categories ?? [],
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
    categories: state.categories,
  }
}
