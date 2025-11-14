import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  const caller = String(req.headers['x-user-id'] || '')
  if (caller !== process.env.OWNER_ID)
    return res.status(403).json({ error: 'only owner allowed' })

  const { user_id } = req.body || {}
  if (!user_id) return res.status(400).json({ error: 'user_id missing' })

  const { error } = await sb.from('admins').delete().eq('user_id', user_id)
  if (error) return res.status(500).json({ error: error.message })

  res.json({ ok: true })
}
