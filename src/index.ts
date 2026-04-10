import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import type { D1Database } from '@cloudflare/workers-types'

export type Env = {
  Bindings: {
    DB: D1Database;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
  }
}

const app = new Hono<Env>()

app.get('/', (c) => {
  const db = drizzle(c.env.DB)
  return c.text('Hello Hono!')
})

export default app
