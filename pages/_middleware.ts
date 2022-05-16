import type { NextRequest } from 'next/server'
import redirects from '@lib/redirects'

export async function middleware(req: NextRequest) {
  console.info('Incoming request for', req.nextUrl.hostname)
  return await redirects(req)
}
