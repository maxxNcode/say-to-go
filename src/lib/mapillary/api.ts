async function findSingleImage(lat: number, lon: number, radiusMeters: number): Promise<string | null> {
  const res = await fetch(`/api/mapillary?lat=${lat}&lng=${lon}&radius=${radiusMeters}`)
  if (!res.ok) return null
  const data = await res.json()
  return data.id ?? null
}

export async function checkMapillaryCoverage(lat: number, lon: number): Promise<boolean> {
  for (const radius of [50, 100, 250, 500, 1000]) {
    const id = await findSingleImage(lat, lon, radius)
    if (id) return true
  }
  return false
}

export async function findImage(lat: number, lon: number): Promise<{ id: string; lat: number; lon: number } | null> {
  for (const radius of [50, 100, 250, 500, 1000]) {
    const id = await findSingleImage(lat, lon, radius)
    if (id) return { id, lat, lon }
  }
  return null
}

export async function findNearestCityWithImagery(
  lat: number, lon: number, originalName: string,
): Promise<{ lat: number; lon: number; name: string } | null> {
  for (const radius of [0.1, 0.2, 0.5, 1.0, 2.0]) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=city&bounded=1` +
        `&viewbox=${lon - radius},${lat - radius},${lon + radius},${lat + radius}&limit=5`,
        { headers: { 'User-Agent': 'SAY TO GO App/2.0' } },
      )
      if (!res.ok) continue
      const cities = await res.json()
      for (const city of cities) {
        const cLat = parseFloat(city.lat)
        const cLon = parseFloat(city.lon)
        const id = await findSingleImage(cLat, cLon, 500)
        if (id) {
          return { lat: cLat, lon: cLon, name: `${city.display_name} (near ${originalName})` }
        }
      }
    } catch {
      /* ignore */
    }
  }
  return null
}

export async function findNearbyAreaWith360View(
  lat: number, lon: number, originalName: string,
): Promise<{ lat: number; lon: number; name: string } | null> {
  const offsets = [
    [0.001, 0.001], [-0.001, -0.001], [0.001, -0.001], [-0.001, 0.001],
    [0.002, 0.002], [-0.002, -0.002], [0.002, -0.002], [-0.002, 0.002],
    [0.003, 0.003], [-0.003, -0.003],
  ]

  for (const [dLat, dLon] of offsets) {
    const nLat = lat + dLat
    const nLon = lon + dLon
    try {
      const id = await findSingleImage(nLat, nLon, 100)
      if (!id) continue

      try {
        const rev = await fetch(
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
