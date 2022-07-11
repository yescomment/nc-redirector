// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'
// import { upstashEdge } from './upstash'
const redirectsJson = require('/redirects.json')

type LocalRedirects = {
  [k: string]:
    | {
        destination: string
      }
    | undefined
}

export default async function redirects(req: NextRequest) {
  const localRedirect = (redirectsJson as LocalRedirects)[req.nextUrl.hostname]
  if (localRedirect) {
    return NextResponse.redirect(localRedirect.destination)
  } else {
    return NextResponse.next()
  }
}
