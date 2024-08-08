import { } from 'hono';
import type { PrismaClient } from '@prisma/client';
import type { D1Database } from '@cloudflare/workers-types'

declare module 'hono' {
  // @ts-ignore
  interface Env {
    Variables: {
      prisma: PrismaClient
    }
    Bindings: {
      DB: D1Database
      SECRET_KEY: string
      BINGX_SECRET_KEY: string
    }
  }
}