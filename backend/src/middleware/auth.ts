import type { MiddlewareHandler } from 'hono'
import { verify } from 'hono/jwt'

const SUPABASE_JWT_SECRET = Bun.env.SUPABASE_JWT_SECRET!

export const supabaseAuth: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header('Authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  try {
    const payload = await verify(token, SUPABASE_JWT_SECRET)
    c.set('user', payload)
    await next()
  } catch {
    return c.json({ error: 'Invalid token' }, 401)
  }
}
