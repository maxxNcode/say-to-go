import { NOMINATIM_HEADERS } from './env'
import { LOCATION_SUGGESTIONS, REGION_TIPS } from '../data/suggestions'
import type { NominatimResult } from '../types'

export interface GeocodeResult {
  lat: number
  lon: number
  displayName: string
}

const geocodeCache = new Map<string, GeocodeResult>()

function normalizeLocation(location: string): string {
  return location.toLowerCase().trim().replace(/\s+/g, ' ')
}

export async function processLocation(location: string): Promise<GeocodeResult> {
  const normalized = normalizeLocation(location)
  const suggestion = LOCATION_SUGGESTIONS[normalized]
  const searchQuery = suggestion ?? location

  const result = await geocodeLocation(searchQuery)
  if (!result) {
    const tip = REGION_TIPS[normalized]
    throw new Error(
      tip ?? `Could not find location: "${location}". Try being more specific.`,
    )
  }
  return result
}

async function geocodeLocation(query: string): Promise<GeocodeResult | null> {
  const cacheKey = query.toLowerCase().trim()
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey)!
  }

  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=10&q=${encodeURIComponent(query)}`

  const res = await fetch(url, { headers: NOMINATIM_HEADERS })
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`)

  const data = (await res.json()) as NominatimResult[]
  if (!data.length) return null

  const sorted = data.sort((a, b) => b.importance - a.importance)
  const best = sorted[0]
  const result: GeocodeResult = {
    displayName: best.display_name,
    lat: parseFloat(best.lat),
    lon: parseFloat(best.lon),
  }

  geocodeCache.set(cacheKey, result)
  return result
}
