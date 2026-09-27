import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const token = process.env.VERCEL_TOKEN
const projectId = process.env.VERCEL_PROJECT_ID
const teamId = process.env.VERCEL_ORG_ID

if (!token) {
  throw new Error('VERCEL_TOKEN is required to sync domains from redirects.json')
}

if (!projectId) {
  throw new Error('VERCEL_PROJECT_ID is required to sync domains from redirects.json')
}

const redirectsPath = resolve(process.cwd(), 'redirects.json')
const redirectsRaw = await readFile(redirectsPath, 'utf-8')
const redirects = JSON.parse(redirectsRaw)
const domains = Object.keys(redirects)

if (domains.length === 0) {
  console.log('No redirect domains found in redirects.json; skipping sync.')
  process.exit(0)
}

const baseUrl = new URL(`https://api.vercel.com/v9/projects/${projectId}/domains`)
if (teamId) {
  baseUrl.searchParams.set('teamId', teamId)
}

const headers = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json'
}

async function fetchProjectDomains() {
  const existing = new Set()
  let next = null

  do {
    const url = new URL(baseUrl)
    if (next) {
      url.searchParams.set('from', next)
    }

    const response = await fetch(url, { headers })
    if (!response.ok) {
      const body = await response.text()
      throw new Error(`Failed to fetch domains (${response.status}): ${body}`)
    }

    const data = await response.json()
    for (const domain of data.domains ?? []) {
      if (domain?.name) {
        existing.add(domain.name)
      }
    }

    next = data.pagination?.next ?? null
  } while (next)

  return existing
}

const existingDomains = await fetchProjectDomains()
const missingDomains = domains.filter((domain) => !existingDomains.has(domain))

if (missingDomains.length === 0) {
  console.log('All redirect domains already exist on the Vercel project.')
  process.exit(0)
}

console.log(`Adding ${missingDomains.length} missing domain(s) to the Vercel project...`)

for (const domain of missingDomains) {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({ name: domain })
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Failed to add domain "${domain}" (${response.status}): ${body}`)
  }

  console.log(`Added domain: ${domain}`)
}
