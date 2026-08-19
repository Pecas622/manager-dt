import {
  CalendarDays,
  ClipboardList,
  Dumbbell,
  IdCard,
  Library,
  LayoutDashboard,
  Ruler,
  Swords,
  Trophy,
  UserCog,
  Users,
  UserSquare2,
} from "lucide-react"
import type { UserRole } from "@/types/domain"

export interface NavItem {
  to: string
  label: string
  icon: typeof LayoutDashboard
  end?: boolean
  roles: UserRole[]
  desktopOnly?: boolean
  // Agrupa los ítems en el sidebar de escritorio (BottomNav los ignora,
  // siempre queda plano). Sin group = suelto, arriba de todo (Dashboard).
  group?: string
}

// Orden del array = orden en BottomNav (mobile, solo los !desktopOnly).
// El agrupamiento visual del sidebar de escritorio usa GROUP_ORDER más abajo,
// independiente de este orden — así no se toca el bottom nav mobile.
export const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true, roles: ["dt", "profesor"] },
  { to: "/calendar", label: "Calendario", icon: CalendarDays, roles: ["dt", "profesor"], group: "Competencia" },
  { to: "/players", label: "Jugadores", icon: Users, roles: ["dt", "profesor"], group: "Plantel" },
  { to: "/routines", label: "Rutinas", icon: Dumbbell, roles: ["dt", "profesor"], group: "Entrenamiento" },
  { to: "/planes", label: "Planes", icon: UserSquare2, roles: ["dt", "profesor"], desktopOnly: true, group: "Entrenamiento" },
  { to: "/torneos", label: "Partidos", icon: Swords, roles: ["dt", "profesor"], desktopOnly: true, group: "Competencia" },
  { to: "/evaluations", label: "Evaluaciones", icon: ClipboardList, roles: ["dt"], group: "Plantel" },
  { to: "/exercises", label: "Ejercicios", icon: Library, roles: ["dt", "profesor"], desktopOnly: true, group: "Entrenamiento" },
  { to: "/physical-tests", label: "Tests físicos", icon: Ruler, roles: ["dt", "profesor"], desktopOnly: true, group: "Plantel" },
  { to: "/nationals", label: "Nacional", icon: Trophy, roles: ["dt"], desktopOnly: true, group: "Competencia" },
  { to: "/becados", label: "Ingreso", icon: IdCard, roles: ["dt"], desktopOnly: true, group: "Club" },
  { to: "/users", label: "Usuarios", icon: UserCog, roles: ["dt"], desktopOnly: true, group: "Club" },
]

// Orden de los grupos en el sidebar de escritorio.
export const NAV_GROUP_ORDER = ["Plantel", "Entrenamiento", "Competencia", "Club"] as const
