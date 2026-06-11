const MAPILLARY_BASE = 'https://graph.mapillary.com'

export default async function handler(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url)
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  const radius = searchParams.get('radius') ?? '50'

  const token = process.env.MAPILLARY_TOKEN ?? process.env.VITE_MAPILLARY_TOKEN
  if (!token) {
    return Response.json({ error: 'Mapillary token not configured' }, { status: 500 })
  }

  try {
    const url = `${MAPILLARY_BASE}/images?access_token=${token}&fields=id&lat=${lat}&lng=${lng}&radius=${radius}&limit=1`
    const res = await fetch(url)

    if (!res.ok) {
      return Response.json({ error: `Mapillary API error: ${res.status}` }, { status: res.status })
    }

    const data = (await res.json()) as { data?: Array<{ id: string }> }
    return Response.json({ id: data.data?.[0]?.id ?? null })
  } catch {
    return Response.json({ error: 'Failed to fetch from Mapillary' }, { status: 500 })
  }
}
