import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import redirects from './lib/redirects'
import { withAxiom } from 'next-axiom';

function getPreviewGate(req: NextRequest) {
  const url = req.nextUrl
  const hasPreview = url.searchParams.has('preview')
  const hasStaging = url.searchParams.has('staging')
  const gateKey = hasPreview ? 'preview' : 'staging'
  const hasGate = hasPreview || hasStaging
  const gateValue = hasGate ? url.searchParams.get(gateKey) : null

  return {
    gateKey,
    hasGate,
    gateValue
  }
}

function resolveTargetHost(rawValue: string) {
  if (!rawValue) {
    return null
  }

  if (rawValue.includes('://')) {
    try {
      return new URL(rawValue).host
    } catch {
      return null
    }
  }

  if (rawValue.includes('/')) {
    return rawValue.split('/')[0]
  }

  if (rawValue.includes('.')) {
    return rawValue
  }

  return `${rawValue}.vercel.app`
}

async function middleware(req: NextRequest) {
  const isPreview = process.env.VERCEL_ENV === 'preview'
  const { hasGate, gateValue } = getPreviewGate(req)

  if (isPreview && !hasGate) {
    return new NextResponse('Preview deployments require ?preview (or ?staging).', {
      status: 404
    })
  }

  if (hasGate && gateValue) {
    const targetHost = resolveTargetHost(gateValue)
    if (targetHost && targetHost !== req.nextUrl.host) {
      const url = req.nextUrl.clone()
      url.host = targetHost
      return NextResponse.redirect(url)
    }
  }

  return await redirects(req)
}

export default withAxiom(middleware)
