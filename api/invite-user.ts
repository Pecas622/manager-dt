// Vercel Function — corre en el servidor, nunca en el navegador. Es el único
// lugar del proyecto donde se usa la service_role key de Supabase (permisos
// totales): la lee de una env var sin prefijo VITE_, así que nunca llega al
// bundle público. Ver README (sección "Invitar usuarios") para las env vars
// que necesita configuradas en Vercel.
import { createClient } from "@supabase/supabase-js"
import type { VercelRequest, VercelResponse } from "@vercel/node"

const VALID_ROLES = ["dt", "profesor", "jugador", "coordinador"]

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const siteUrl = process.env.SITE_URL
  if (!supabaseUrl || !serviceRoleKey || !siteUrl) {
    return res.status(500).json({ error: "Faltan variables de entorno del servidor" })
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

  // 1. Confirmar que quien llama está logueado y es DT.
  const token = (req.headers.authorization || "").replace("Bearer ", "")
  if (!token) return res.status(401).json({ error: "No autenticado" })

  const {
    data: { user: caller },
    error: authError,
  } = await supabaseAdmin.auth.getUser(token)
  if (authError || !caller) return res.status(401).json({ error: "Token inválido" })

  const { data: callerProfile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", caller.id)
    .maybeSingle()

  if (callerProfile?.role !== "dt") {
    return res.status(403).json({ error: "Solo el DT puede invitar usuarios" })
  }

  // 2. Validar body.
  const { email, role, fullName, playerId } = (req.body ?? {}) as {
    email?: string
    role?: string
    fullName?: string
    playerId?: string
  }
  if (!email || !role) return res.status(400).json({ error: "Falta email o rol" })
  if (!VALID_ROLES.includes(role)) return res.status(400).json({ error: "Rol inválido" })

  // 3. Invitar (crea el usuario en estado "invited" y le manda el mail).
  const { data: invited, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
    email,
    { redirectTo: `${siteUrl}/aceptar-invitacion` }
  )
  if (inviteError || !invited.user) {
    return res.status(400).json({ error: inviteError?.message ?? "No se pudo invitar" })
  }

  // 4. Vincular el UUID recién creado con su rol (y con el jugador, si corresponde).
  const { error: linkError } = await supabaseAdmin.from("profiles").insert({
    id: invited.user.id,
    role,
    full_name: fullName || null,
    player_id: role === "jugador" ? (playerId ?? null) : null,
  })
  if (linkError) {
    return res.status(500).json({ error: linkError.message })
  }

  return res.status(200).json({ ok: true, userId: invited.user.id })
}
