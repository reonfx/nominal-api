import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const OWNER_ID = String(process.env.OWNER_ID || '')

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

export default async function handler(req, res) {
  try {
    const { id } = req.query
    const caller = String(req.headers['x-user-id'] || '')

    if (!id) return res.status(400).json({ error: 'id required' })

    if (caller !== OWNER_ID) {
      const { data } = await sb.from('admins').select('user_id').eq('user_id', caller)
      if (!data || data.length === 0)
        return res.status(403).json({ error: 'forbidden' })
    }

    const { data, error } = await sb.from('students').select('*').eq('id', id).single()
    if (error) return res.status(404).json({ error: 'not found' })

    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'internal' })
  }
      }
