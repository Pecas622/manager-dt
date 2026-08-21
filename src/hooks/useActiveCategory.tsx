import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { CATEGORIES, type Category } from "@/types/domain"

const STORAGE_KEY = "c15manager:activeCategory"

interface ActiveCategoryContextValue {
  activeCategory: Category
  setActiveCategory: (category: Category) => void
  availableCategories: Category[]
}

const ActiveCategoryContext = createContext<ActiveCategoryContextValue | null>(null)

// El DT ve las 4 categorías sin restricción (no depende de
// profile_categories); Profesor/Coordinador quedan a las que tenga
// vinculadas.
function resolveAvailable(role: string | null, categories: Category[]): Category[] {
  if (role === "dt") return [...CATEGORIES]
  return categories
}

export function ActiveCategoryProvider({ children }: { children: ReactNode }) {
  const { role, categories, loading } = useAuth()
  const availableCategories = useMemo(
    () => resolveAvailable(role, categories),
    [role, categories]
  )

  const [activeCategory, setActiveCategoryState] = useState<Category | null>(null)

  useEffect(() => {
    if (loading || availableCategories.length === 0) return
    let stored: string | null = null
    try {
      stored = localStorage.getItem(STORAGE_KEY)
    } catch {
      // localStorage puede fallar (modo privado, etc.) — seguimos sin persistir.
    }
    const initial =
      stored && availableCategories.includes(stored as Category)
        ? (stored as Category)
        : availableCategories[0]
    setActiveCategoryState(initial)
  }, [loading, availableCategories])

  function setActiveCategory(category: Category) {
    setActiveCategoryState(category)
    try {
      localStorage.setItem(STORAGE_KEY, category)
    } catch {
      // ídem — no bloquea el cambio de categoría en memoria.
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!activeCategory) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background p-4 text-center">
        <p className="max-w-sm text-sm text-muted-foreground">
          Tu cuenta todavía no tiene ninguna categoría asignada. Pedile al DT que te
          vincule a una desde Usuarios.
        </p>
      </div>
    )
  }

  return (
    <ActiveCategoryContext.Provider
      value={{ activeCategory, setActiveCategory, availableCategories }}
    >
      {children}
    </ActiveCategoryContext.Provider>
  )
}

export function useActiveCategory() {
  const ctx = useContext(ActiveCategoryContext)
  if (!ctx) {
    throw new Error("useActiveCategory debe usarse dentro de ActiveCategoryProvider")
  }
  return ctx
}
