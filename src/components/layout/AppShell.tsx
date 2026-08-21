import { Outlet } from "react-router-dom"
import { LogOut, ShieldCheck } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { ActiveCategoryProvider } from "@/hooks/useActiveCategory"
import { Sidebar } from "@/components/layout/Sidebar"
import { BottomNav } from "@/components/layout/BottomNav"
import { CategorySwitcher } from "@/components/layout/CategorySwitcher"

export function AppShell() {
  return (
    <ActiveCategoryProvider>
      <div className="flex min-h-svh bg-background">
        <Sidebar />

        <div className="flex min-h-svh flex-1 flex-col">
          <header className="flex items-center justify-between gap-2 border-b border-border px-4 py-3 md:hidden print:hidden">
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <ShieldCheck className="size-4.5" />
              </div>
              <span className="truncate text-sm font-semibold">C15 Manager</span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <CategorySwitcher className="h-9 w-28" />
              <button
                onClick={() => supabase.auth.signOut()}
                aria-label="Cerrar sesión"
                className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <LogOut className="size-4.5" />
              </button>
            </div>
          </header>

          <main className="flex-1 px-4 pb-24 pt-4 md:px-8 md:pb-8 md:pt-6 print:p-0">
            <div className="mx-auto w-full max-w-5xl">
              <Outlet />
            </div>
          </main>
        </div>

        <BottomNav />
      </div>
    </ActiveCategoryProvider>
  )
}
