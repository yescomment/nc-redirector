import { NextRequest, NextResponse } from 'next/server'
import parseTpl from './parse-template-literal';
import { log } from 'next-axiom';
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
        WBM_10YEARSAGO: `${new Date().getFullYear() - 10}${new Date().toISOString().slice(4,10).replaceAll('-','')}`,
        WBM_20YEARSAGO: `${new Date().getFullYear() - 20}${new Date().toISOString().slice(4,10).replaceAll('-','')}`
      })
    }
    // log to Axiom
    const logData = {
      from: req.url,
      to: localRedirect.destination,
      request: req
    }
    log.info(`Request for ${req.url} redirected to ${localRedirect.destination}`, logData)
    return NextResponse.redirect(localRedirect.destination)
  } else {
    return NextResponse.next()
  }
}
