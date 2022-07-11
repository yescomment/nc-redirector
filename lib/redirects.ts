// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'
import parseTpl from './parse-template-literal';
// import { upstashEdge } from './upstash'
const redirectsJson = require('/redirects.json')

type LocalRedirects = {
  [k: string]:
    | {
        destination: string
        parse: boolean
      }
    | undefined
}

export default async function redirects(req: NextRequest) {
  const localRedirect = (redirectsJson as LocalRedirects)[req.nextUrl.hostname]
  if (localRedirect) {
    if (localRedirect.parse) {
      localRedirect.destination = parseTpl(localRedirect.destination, {
        WBM_20YEARSAGO: `${new Date().getFullYear() - 20}${new Date().toISOString().slice(3,10).replaceAll('-','')}`
        // add more parsable replacements here
      })
    }
    return NextResponse.redirect(localRedirect.destination)
  } else {
    return NextResponse.next()
  }
}
