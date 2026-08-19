import { NavLink } from "react-router-dom"
import { LogOut, ShieldCheck } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"
import { NAV_GROUP_ORDER, NAV_ITEMS, type NavItem } from "@/components/layout/navItems"

function NavItemLink({ item }: { item: NavItem }) {
  return (
    <NavLink
      to={item.to}
      end={item.end ?? false}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
        )
      }
    >
      <item.icon className="size-4.5" />
      {item.label}
    </NavLink>
  )
}

export function Sidebar() {
  const { role } = useAuth()
  const items = NAV_ITEMS.filter((item) => !role || item.roles.includes(role))
  const ungrouped = items.filter((item) => !item.group)
  const groups = NAV_GROUP_ORDER.map((group) => ({
    group,
    items: items.filter((item) => item.group === group),
  })).filter((g) => g.items.length > 0)

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex print:hidden">
      <div className="flex items-center gap-2.5 px-5 py-6">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <ShieldCheck className="size-5" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight">C15 Manager</p>
          <p className="text-xs text-muted-foreground">Regatas C15</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {ungrouped.map((item) => (
          <NavItemLink key={item.to} item={item} />
        ))}

        {groups.map(({ group, items: groupItems }) => (
          <div key={group} className="mt-3 flex flex-col gap-1">
            <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">
              {group}
            </p>
            {groupItems.map((item) => (
              <NavItemLink key={item.to} item={item} />
            ))}
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border px-3 py-3">
        <button
          onClick={() => supabase.auth.signOut()}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
        >
          <LogOut className="size-4.5" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
