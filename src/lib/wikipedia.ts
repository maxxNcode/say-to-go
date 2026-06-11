const WIKIPEDIA_API = 'https://en.wikipedia.org/api/rest_v1/page/summary'

const summaryCache = new Map<string, WikipediaResult>()

export interface WikipediaResult {
  title: string
  extract: string
  thumbnail?: { source: string; width: number; height: number }
  content_urls?: { desktop: { page: string } }
}

export async function fetchSummary(locationName: string): Promise<WikipediaResult | null> {
  // Extract the first meaningful part of the location name
  const parts = locationName.split(',')
  const searchTerm = parts[0].trim()
  const cacheKey = searchTerm.toLowerCase()

  if (summaryCache.has(cacheKey)) {
    return summaryCache.get(cacheKey)!
  }

  try {
    const url = `${WIKIPEDIA_API}/${encodeURIComponent(searchTerm)}`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'SAY TO GO App/2.0', 'Accept': 'application/json' },
    })
    if (!res.ok) return null

    const data = await res.json() as WikipediaResult
    if (!data.extract || data.extract.length < 20) return null

    // Truncate to a short, digestible paragraph
    const truncated = truncateExtract(data.extract)
    const result: WikipediaResult = {
      ...data,
      extract: truncated,
    }

    summaryCache.set(cacheKey, result)
    return result
  } catch {
    return null
  }
}

function truncateExtract(text: string): string {
  // Try to get first 2 sentences or first ~200 chars
  const sentences = text.match(/[^.!?\n]+[.!?]+/g)
  if (sentences && sentences.length >= 2) {
    return sentences.slice(0, 2).join(' ').trim()
  }
  if (text.length > 250) {
    return text.slice(0, text.lastIndexOf(' ', 247)) + '...'
  }
  return text
}
