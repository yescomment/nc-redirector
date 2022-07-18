import type { NextRequest } from 'next/server'
import redirects from '../lib/redirects'
import { log, withAxiom } from 'next-axiom';

async function middleware(req: NextRequest) {
  log.info(`Incoming request for ${req.nextUrl.hostname}`)
  return await redirects(req)
}

export default withAxiom(middleware)
