import { DatabaseZap } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SupabaseSetupNotice() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <DatabaseZap className="size-6" />
          </div>
          <CardTitle className="text-xl">Configurá Supabase</CardTitle>
          <CardDescription>
            La app todavía no tiene credenciales de Supabase cargadas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
            <li>Creá un proyecto en supabase.com.</li>
            <li>
              Corré, en orden, las 6 migraciones de{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-foreground">
                supabase/migrations/
              </code>{" "}
              (
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-foreground">
                0001
              </code>{" "}
              a{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-foreground">
                0006
              </code>
              ) en el SQL editor.
            </li>
            <li>
              (Opcional) Corré{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-foreground">
                supabase/seed/seed_demo.sql
              </code>{" "}
              para cargar datos de prueba.
            </li>
            <li>Creá tu usuario (DT) en Authentication → Users.</li>
            <li>
              Copiá la Project URL y la anon key a un archivo{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-foreground">
                .env.local
              </code>{" "}
              (mirá{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-foreground">
                .env.example
              </code>
              ).
            </li>
            <li>Reiniciá el servidor de desarrollo.</li>
            <li>
              Entrá y vinculá tu cuenta con rol DT desde <strong>Usuarios</strong>{" "}
              (ver README).
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
