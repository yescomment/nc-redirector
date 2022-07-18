import type { NextRequest } from 'next/server'
import redirects from '../lib/redirects'
import { withAxiom } from 'next-axiom';

async function middleware(req: NextRequest) {
  return await redirects(req)
}

export default withAxiom(middleware)
