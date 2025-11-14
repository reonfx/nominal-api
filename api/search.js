import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

export default async function handler(req, res) {
  try {
    const q = (req.query.name || '').trim()
    if (!q) return res.status(400).json({ error: 'name query required' })

    const { data, error } = await sb
      .from('students')
      .select('id,name,appno,subjects')
      .or(`name.ilike.%${q}%,father.ilike.%${q}%,mother.ilike.%${q}%`)
      .limit(20)

    if (error) throw error

    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'internal' })
  }
}
