// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'
import parseTpl from './parse-template-literal';
import Client, { datasets } from '@axiomhq/axiom-node';
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
        WBM_20YEARSAGO: `${new Date().getFullYear() - 20}${new Date().toISOString().slice(4,10).replaceAll('-','')}`
        // add more parsable replacements here
      })
    }
    // log to Axiom
    Client.datasets.ingest('nc-redirector',{
      request: req,
      from: req.url,
      to: localRedirect.destination
    })
    console.log(`Request for ${req.url} redirected to ${localRedirect.destination}`)
    return NextResponse.redirect(localRedirect.destination)
  } else {
    return NextResponse.next()
  }
}
