import formidable from 'formidable'
import fs from 'fs'
import { parse } from 'csv-parse/sync'
import { createClient } from '@supabase/supabase-js'

export const config = {
  api: { bodyParser: false }
}

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const API_KEY = process.env.API_KEY

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' })
  if (req.headers['x-api-key'] !== API_KEY) return res.status(401).json({ error: 'invalid api key' })

  const form = formidable({ multiples: false })
  
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ error: 'parse error' })

    const file = files.file
    if (!file) return res.status(400).json({ error: 'file needed' })

    const content = fs.readFileSync(file.filepath, 'utf-8')
    const rows = parse(content, { columns: true, skip_empty_lines: true })

    let ok = 0
    for (const r of rows) {
      await sb.from('students').insert([r])
      ok++
    }

    res.json({ imported: ok })
  })
    }
