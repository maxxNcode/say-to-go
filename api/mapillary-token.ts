import type { IncomingMessage, ServerResponse } from 'http'

export default async function handler(_req: IncomingMessage, res: ServerResponse) {
  const token = process.env.MAPILLARY_TOKEN ?? process.env.VITE_MAPILLARY_TOKEN
  if (!token) {
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Mapillary token not configured' }))
    return
  }
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ token }))
}
