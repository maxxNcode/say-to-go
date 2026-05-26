const STORAGE_KEY = 'stg_history'
const MAX_ITEMS = 8

export function saveSearch(term: string): void {
  const history = getHistory().filter((entry: string) => entry !== term)
  history.unshift(term)
  if (history.length > MAX_ITEMS) history.length = MAX_ITEMS
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}

export function getHistory(): string[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}
