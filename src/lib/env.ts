export const NOMINATIM_HEADERS = {
  'User-Agent': 'SAY TO GO App/2.0',
}

export function getAccessToken(): string {
  const token = import.meta.env.VITE_MAPILLARY_TOKEN as string | undefined
  if (!token || token === 'YOUR_MAPILLARY_ACCESS_TOKEN_HERE') {
    console.warn('Mapillary token not configured. Set VITE_MAPILLARY_TOKEN in .env')
  }
  return token ?? ''
}
