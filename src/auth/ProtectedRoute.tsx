import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import type { UserRole } from "@/types/domain"

export function ProtectedRoute({
  children,
  allow,
}: {
  children: ReactNode
  allow?: UserRole[]
}) {
  const { isAuthenticated, loading, role } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allow && role && !allow.includes(role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
