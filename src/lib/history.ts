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

export function renderRecentSearches(onSelect: (term: string) => void): void {
  const history = getHistory()
  const recentTags = document.getElementById('recent-tags')
  const recentSection = document.getElementById('recent-section')
  if (!recentTags || !recentSection) return

  recentTags.innerHTML = ''

  if (history.length === 0) {
    recentSection.classList.add('hidden')
    return
  }

  recentSection.classList.remove('hidden')
  history.forEach((term) => {
    const tag = document.createElement('button')
    tag.className = 'recent-tag'
    tag.textContent = term
    tag.addEventListener('click', () => onSelect(term))
    recentTags.appendChild(tag)
  })
}
