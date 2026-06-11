export const NOMINATIM_HEADERS = {
  'User-Agent': 'SAY TO GO App/2.0',
}

let cachedToken: string | null = null

export async function getAccessToken(): Promise<string> {
  if (cachedToken) return cachedToken

  try {
    const res = await fetch('/api/mapillary-token')
    if (!res.ok) return ''
    const data = await res.json() as { token: string }
    cachedToken = data.token
    return data.token
  } catch {
    return ''
  }
}
