import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

/**
 * Extracts and verifies the Bearer JWT from the Authorization header.
 * Returns the authenticated Supabase user or throws a 401 response.
 */
export async function getAuthUser(req, res) {
  const authHeader = req.headers['authorization'] ?? ''
  const token = authHeader.replace('Bearer ', '').trim()

  if (!token) {
    res.status(401).json({ error: 'Missing authorization token' })
    return null
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token)

  if (error || !data?.user) {
    res.status(401).json({ error: 'Invalid or expired token' })
    return null
  }

  return data.user
}
