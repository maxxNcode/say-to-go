import { getAccessToken } from '../env'

const MAPILLARY_BASE = 'https://graph.mapillary.com'
const TIMEOUT_MS = 15000
const MAX_RETRIES = 2

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { ...options, signal: controller.signal })
    return res
  } finally {
    clearTimeout(id)
  }
}

async function fetchMapillary(url: string, retries = MAX_RETRIES): Promise<Response | null> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchWithTimeout(url)
      if (res.ok) return res

      if (res.status === 400) {
        const text = await res.text()
        if (text.includes('OAuthException') || text.includes('access_token')) {
          throw new Error('Mapillary API token is invalid or expired.')
        }
        return null
      }

      if (res.status >= 500) {
        if (attempt < retries) {
          await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)))
          continue
        }
        throw new Error('Mapillary API is temporarily unavailable. Please try again later.')
      }

      return null
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError' && attempt < retries) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)))
        continue
      }
      if (err instanceof Error && (err.message.includes('invalid') || err.message.includes('OAuth'))) throw err
      if (attempt >= retries) return null
    }
  }
  return null
}

async function findSingleImage(lat: number, lon: number, bboxSize: number, token: string): Promise<string | null> {
  const bbox = `${lon - bboxSize},${lat - bboxSize},${lon + bboxSize},${lat + bboxSize}`
  const url = `${MAPILLARY_BASE}/images?access_token=${token}&fields=id&bbox=${bbox}&limit=1`

  const res = await fetchMapillary(url)
  if (!res) return null

  const data = await res.json()
  return data.data?.length > 0 ? data.data[0].id : null
}

export async function checkMapillaryCoverage(lat: number, lon: number): Promise<boolean> {
  try {
    const token = getAccessToken()
    for (const size of [0.001, 0.005, 0.01, 0.02, 0.05, 0.1]) {
      const id = await findSingleImage(lat, lon, size, token)
      if (id) return true
    }
    return false
  } catch {
    return false
  }
}

export async function findImage(lat: number, lon: number): Promise<{ id: string; lat: number; lon: number } | null> {
  const token = getAccessToken()
  if (!token) throw new Error('Mapillary API token is not configured')

  for (const size of [0.001, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2]) {
    const id = await findSingleImage(lat, lon, size, token)
    if (id) return { id, lat, lon }
  }

  return null
}

export async function findNearestCityWithImagery(
  lat: number, lon: number, originalName: string,
): Promise<{ lat: number; lon: number; name: string } | null> {
  const token = getAccessToken()
  if (!token) return null

  for (const radius of [0.1, 0.2, 0.5, 1.0, 2.0]) {
    try {
      const res = await fetchWithTimeout(
        `https://nominatim.openstreetmap.org/search?format=json&q=city&bounded=1` +
        `&viewbox=${lon - radius},${lat - radius},${lon + radius},${lat + radius}&limit=5`,
        { headers: { 'User-Agent': 'SAY TO GO App/2.0' } },
      )
      if (!res.ok) continue
      const cities = await res.json()
      for (const city of cities) {
        const cLat = parseFloat(city.lat)
        const cLon = parseFloat(city.lon)
        const id = await findSingleImage(cLat, cLon, 0.01, token)
        if (id) {
          return { lat: cLat, lon: cLon, name: `${city.display_name} (near ${originalName})` }
        }
      }
    } catch (e) {
      if (e instanceof Error && (e.message.includes('invalid') || e.message.includes('OAuth'))) throw e
    }
  }
  return null
}

export async function findNearbyAreaWith360View(
  lat: number, lon: number, originalName: string,
): Promise<{ lat: number; lon: number; name: string } | null> {
  const token = getAccessToken()
  if (!token) return null

  const offsets = [
    [0.001, 0.001], [-0.001, -0.001], [0.001, -0.001], [-0.001, 0.001],
    [0.002, 0.002], [-0.002, -0.002], [0.002, -0.002], [-0.002, 0.002],
    [0.003, 0.003], [-0.003, -0.003],
  ]

  for (const [dLat, dLon] of offsets) {
    const nLat = lat + dLat
    const nLon = lon + dLon
    try {
      const id = await findSingleImage(nLat, nLon, 0.001, token)
      if (!id) continue

      try {
        const rev = await fetchWithTimeout(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${nLat}&lon=${nLon}`,
          { headers: { 'User-Agent': 'SAY TO GO App/2.0' } },
        )
        if (rev.ok) {
          const rd = await rev.json()
          if (rd.display_name) {
            return { lat: nLat, lon: nLon, name: `${rd.display_name.split(',')[0]} (near ${originalName})` }
          }
        }
      } catch { /* ignore reverse geocode failure */ }
      return { lat: nLat, lon: nLon, name: `Nearby area (${nLat.toFixed(4)}, ${nLon.toFixed(4)})` }
    } catch { /* ignore offset failure */ }
  }
  return null
}
