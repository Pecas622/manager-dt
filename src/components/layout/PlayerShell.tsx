import { LogOut, ShieldCheck } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { PlayerWeekPage } from "@/pages/PlayerWeekPage"

export function PlayerShell() {
  return (
    <div className="min-h-svh bg-background">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <ShieldCheck className="size-4.5" />
          </div>
          <span className="text-sm font-semibold">C15 Manager</span>
        </div>
        <button
          onClick={() => supabase.auth.signOut()}
          aria-label="Cerrar sesión"
          className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <LogOut className="size-4.5" />
        </button>
      </header>

      <main className="px-4 py-4">
        <div className="mx-auto w-full max-w-lg">
          <PlayerWeekPage />
        </div>
      </main>
    </div>
  )
}
