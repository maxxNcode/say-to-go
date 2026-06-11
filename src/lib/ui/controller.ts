import { createIcons, ArrowLeft } from 'lucide'
import { $ } from './dom'
import { destroyViewer, getCurrentLocation } from '../state'

export function setStatus(msg: string): void {
  if ($.status) $.status.textContent = msg
}

export function setRecognized(msg: string): void {
  if ($.recognizedText) $.recognizedText.textContent = msg
}

export function showListening(): void {
  if ($.micButton) $.micButton.classList.add('listening')
  setStatus('Listening... Speak now')
  if ($.loading) $.loading.classList.remove('hidden')
  if ($.errorMessage) $.errorMessage.classList.add('hidden')
}

export function hideListening(): void {
  if ($.micButton) $.micButton.classList.remove('listening')
  if ($.loading) $.loading.classList.add('hidden')
}

export function resetUI(): void {
  hideListening()
  setRecognized('')
}

let errorTimeout: ReturnType<typeof setTimeout> | null = null

export function showError(message: string): void {
  if (message.toLowerCase().includes('network')) {
    message += '\n\nTips: Try a mobile hotspot, disable VPN, or switch networks.'
  }
  if ($.errorMessage) {
    $.errorMessage.textContent = message
    $.errorMessage.classList.remove('hidden')
  }
  if (errorTimeout) clearTimeout(errorTimeout)
  errorTimeout = setTimeout(() => {
    if ($.errorMessage) $.errorMessage.classList.add('hidden')
  }, 12000)
}

export function showViewerScreen(): void {
  $.mainContent?.classList.add('hidden')
  $.mapillaryContainer?.classList.remove('hidden')
  $.appHeader?.classList.add('hidden')
}

export function showMainScreen(): void {
  destroyViewer()
  $.mapillaryContainer?.classList.add('hidden')
  $.mainContent?.classList.remove('hidden')
  $.appHeader?.classList.remove('hidden')
}

export function showMapillaryLoading(text: string): void {
  const el = $.mapillaryLoading
  if (!el) return
  const p = el.querySelector('p')
  if (p) p.textContent = text
  el.classList.remove('hidden')
}

export function hideMapillaryLoading(): void {
  const el = $.mapillaryLoading
  if (el) el.classList.add('hidden')
}

export interface NearbyResult {
  lat: number
  lon: number
  displayName?: string
}

export interface ViewerButtonsOptions {
  onNearby: (loc: { lat: number; lon: number; name: string | null }) => Promise<NearbyResult | null>
  showMapillaryView: (lat: number, lon: number, name: string) => Promise<void>
}

export function addViewerButtons(opts: ViewerButtonsOptions): void {
  const existing = document.getElementById('back-button-container')
  if (existing) existing.remove()

  const wrapper = document.createElement('div')
  wrapper.id = 'back-button-container'
  wrapper.className = 'viewer-controls'

  const backBtn = document.createElement('button')
  backBtn.id = 'back-button'
  backBtn.className = 'viewer-btn viewer-btn--back'
  backBtn.innerHTML = '<i data-lucide="arrow-left" class="arrow-icon"></i> Back to Search'
  backBtn.setAttribute('aria-label', 'Return to search')
  backBtn.addEventListener('click', () => {
    showMainScreen()
    setRecognized('')
    setStatus('Click the button and say a location')
    wrapper.remove()
    destroyViewer()
  })

  const nearBtn = document.createElement('button')
  nearBtn.id = 'next-near-area-button'
  nearBtn.className = 'viewer-btn viewer-btn--near'
  nearBtn.textContent = 'Near Area'
  nearBtn.setAttribute('aria-label', 'Explore nearby area')
  nearBtn.addEventListener('click', async () => {
    const loc = getCurrentLocation()
    if (loc.lat === null || loc.lon === null) {
      showError('No current location. Go back and search again.')
      return
    }
    try {
      showMapillaryLoading(`Searching nearby "${loc.name}"...`)
      const nearbyArea = await opts.onNearby(loc as { lat: number; lon: number; name: string | null })
      if (nearbyArea) {
        destroyViewer()
        await opts.showMapillaryView(nearbyArea.lat, nearbyArea.lon, nearbyArea.displayName ?? 'Nearby area')
      } else {
        hideMapillaryLoading()
        showError('No nearby areas with 360° views found.')
      }
    } catch (error) {
      hideMapillaryLoading()
      showError(`Error: ${error instanceof Error ? error.message : String(error)}`)
    }
  })

  wrapper.appendChild(backBtn)
  wrapper.appendChild(nearBtn)
  document.body.appendChild(wrapper)
  createIcons({ icons: { ArrowLeft } })
}
