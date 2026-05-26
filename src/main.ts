import './style.css'
import { initSpeech, isSupported, startListening, onSpeechError, onSpeechStart, onSpeechEnd } from './lib/speech'
import { processLocation } from './lib/geocoding'
import { saveSearch, renderRecentSearches } from './lib/history'
import { setStatus, setRecognized, showError, hideListening } from './lib/ui/controller'
import { showMapillaryView } from './lib/mapillary/viewer'

const searchInput = document.getElementById('search-input') as HTMLInputElement | null
const mapillaryContainer = document.getElementById('mapillary-container')

function handleTextSearch(query: string): void {
  const trimmed = query.trim()
  if (!trimmed) return
  setRecognized(trimmed)
  setStatus('Processing your request...')
  processLocation(trimmed)
    .then((location) => {
      saveSearch(trimmed)
      renderRecentSearches(handleTextSearch)
      return showMapillaryView(location.lat, location.lon, location.displayName)
    })
    .catch((err: Error) => {
      showError(err.message)
      setStatus('')
    })
}

document.getElementById('mic-button')?.addEventListener('click', () => startListening())
document.getElementById('search-input')?.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    handleTextSearch((e.target as HTMLInputElement).value)
  }
})
document.getElementById('search-submit')?.addEventListener('click', () => {
  handleTextSearch(searchInput?.value ?? '')
})

document.querySelectorAll('.popular-tag').forEach((tag) => {
  tag.addEventListener('click', () => {
    const loc = (tag as HTMLElement).dataset.location
    if (loc) {
      if (searchInput) searchInput.value = loc
      handleTextSearch(loc)
    }
  })
})

document.getElementById('about-btn')?.addEventListener('click', () => {
  window.location.href = 'about.html'
})

document.addEventListener('keydown', (e: KeyboardEvent) => {
  if (
    e.code === 'Space' &&
    document.activeElement !== searchInput &&
    document.activeElement?.tagName !== 'INPUT' &&
    document.activeElement?.tagName !== 'TEXTAREA' &&
    mapillaryContainer?.classList.contains('hidden') !== false
  ) {
    e.preventDefault()
    startListening()
  }
})

window.addEventListener('error', (_event: ErrorEvent) => {
  showError(`An unexpected error occurred`)
})

window.addEventListener('unhandledrejection', (_event: PromiseRejectionEvent) => {
  showError(`An async operation failed. Please check your connection.`)
})

document.addEventListener('DOMContentLoaded', () => {
  setStatus('Click the button and say a location')

  onSpeechStart(() => {
    setStatus('Listening... Speak now')
  })

  onSpeechEnd(() => {
    hideListening()
    setStatus('Click the button and say a location')
  })

  onSpeechError((msg) => {
    showError(msg)
  })

  initSpeech((term) => {
    setRecognized(term)
    handleTextSearch(term)
  })

  if (!isSupported) {
    showError('Speech recognition is not supported. Please try Chrome or Edge.')
  }

  renderRecentSearches(handleTextSearch)
})
