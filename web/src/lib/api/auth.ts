import { getSiteSettings } from '@/lib/config/site'
import { NextRequest } from 'next/server'

/** Validate Bearer token against the stored api_key setting.
 *  Returns true if valid, false if missing/wrong. */
export async function validateApiKey(req: NextRequest): Promise<boolean> {
  const authHeader = req.headers.get('authorization') || ''
  if (!authHeader.startsWith('Bearer ')) return false
  const token = authHeader.slice(7).trim()
  if (!token) return false

  const settings = await getSiteSettings()
  if (!settings.api_key) return false
  return token === settings.api_key
}

export function unauthorizedResponse() {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  })
}
