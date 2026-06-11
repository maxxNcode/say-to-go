import type { IncomingMessage, ServerResponse } from 'http'

const MAPILLARY_BASE = 'https://graph.mapillary.com'

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url || '/', 'http://localhost')
  const lat = url.searchParams.get('lat')
  const lng = url.searchParams.get('lng')
  const radius = url.searchParams.get('radius') ?? '50'

  const token = process.env.MAPILLARY_TOKEN ?? process.env.VITE_MAPILLARY_TOKEN
  if (!token) {
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Mapillary token not configured' }))
    return
  }

  try {
    const mapUrl = `${MAPILLARY_BASE}/images?access_token=${token}&fields=id&lat=${lat}&lng=${lng}&radius=${radius}&limit=1`
    const mapRes = await fetch(mapUrl)

    if (!mapRes.ok) {
      res.writeHead(mapRes.status, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: `Mapillary API error: ${mapRes.status}` }))
      return
    }

    const data = (await mapRes.json()) as { data?: Array<{ id: string }> }
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ id: data.data?.[0]?.id ?? null }))
  } catch {
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Failed to fetch from Mapillary' }))
  }
}
