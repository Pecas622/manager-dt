import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"
import { NAV_ITEMS } from "@/components/layout/navItems"

export function BottomNav() {
  const { role } = useAuth()
  const items = NAV_ITEMS.filter(
    (item) => !item.desktopOnly && (!role || item.roles.includes(role))
  )

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-card/95 backdrop-blur pb-[env(safe-area-inset-bottom)] md:hidden print:hidden">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end ?? false}
          className={({ isActive }) =>
            cn(
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
              isActive ? "text-primary" : "text-muted-foreground"
            )
          }
        >
          {({ isActive }) => (
            <>
              <item.icon
                className={cn("size-5.5", isActive && "text-primary")}
              />
              {item.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
