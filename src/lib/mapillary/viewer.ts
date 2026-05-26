import { getAccessToken } from '../env'
import { setViewer, destroyViewer, setCurrentLocation } from '../state'

interface MapillaryViewer {
  on: (event: string, cb: (...args: unknown[]) => void) => void
  remove: () => void
  getComponent: (name: string) => { activate: () => void; isActive: () => boolean } | null
}
import { showViewerScreen, showMainScreen, showMapillaryLoading, hideMapillaryLoading, addViewerButtons, showError, setStatus, resetUI } from '../ui/controller'
import { findImage, findNearestCityWithImagery, findNearbyAreaWith360View } from './api'

let sdkLoaded = false
let sdkPromise: Promise<void> | null = null

function loadMapillarySDK(): Promise<void> {
  if (sdkLoaded) return Promise.resolve()
  if (sdkPromise) return sdkPromise

  sdkPromise = new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/mapillary-js@4.0.0/dist/mapillary.css'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.src = 'https://unpkg.com/mapillary-js@4.0.0/dist/mapillary.js'
    script.onload = () => { sdkLoaded = true; resolve() }
    script.onerror = () => { sdkPromise = null; reject(new Error('Failed to load Mapillary SDK.')) }
    document.head.appendChild(script)
  })

  return sdkPromise
}

function initViewer(imageId: string, accessToken: string, _locationName: string): void {
  try {
    destroyViewer()

    if (typeof (window as unknown as Record<string, unknown>).mapillary === 'undefined') {
      throw new Error('Mapillary SDK not loaded.')
    }

    const container = document.getElementById('mapillary')
    if (!container) throw new Error('Mapillary container not found')
    container.style.display = 'block'
    container.style.width = '100vw'
    container.style.height = '100vh'

    setTimeout(() => {
      const ViewerCtor = (window as unknown as { mapillary: { Viewer: new (config: Record<string, unknown>) => MapillaryViewer } }).mapillary.Viewer

      const viewer = new ViewerCtor({
        accessToken,
        container: 'mapillary',
        imageId,
        component: { cover: false, sequence: true, direction: true, zoom: true },
      })
      setViewer(viewer)

      viewer.on('load', () => {
        container.style.backgroundColor = '#000'
        hideMapillaryLoading()
        activateComponents(viewer)
        setupViewerControls(viewer)
      })

      viewer.on('error', (...args: unknown[]) => {
        const err = args[0] as Error
        showError(`Failed to load 360° viewer. ${err.message}`)
        hideMapillaryLoading()
      })
    }, 200)
  } catch (error) {
    showError(`Failed to initialize viewer. ${error instanceof Error ? error.message : String(error)}`)
    hideMapillaryLoading()
    showMainScreen()
    resetUI()
  }
}

function activateComponents(viewer: { getComponent: (name: string) => { activate: () => void } | null }): void {
  ['sequence', 'direction', 'zoom'].forEach((name) => {
    try { viewer.getComponent(name)?.activate() } catch { /* ignore */ }
  })
}

function setupViewerControls(viewer: { getComponent: (name: string) => { isActive: () => boolean; activate: () => void } | null }): void {
  const mapillaryContainer = document.getElementById('mapillary-container')
  if (!viewer || !mapillaryContainer) return

  const events = ['mousedown', 'mousemove', 'wheel', 'touchstart', 'touchmove', 'keydown']
  const onInteraction = () => {
    ['sequence', 'direction', 'zoom'].forEach((name) => {
      try {
        const c = viewer.getComponent(name)
        if (c && !c.isActive()) c.activate()
      } catch { /* ignore */ }
    })
  }
  events.forEach((ev) => mapillaryContainer.addEventListener(ev, onInteraction, { passive: true }))
}

export async function showMapillaryView(lat: number, lon: number, locationName: string): Promise<void> {
  setStatus(`Loading experience for "${locationName}"...`)

  try {
    setCurrentLocation(lat, lon, locationName)
    showMapillaryLoading(`Loading experience for "${locationName}"...`)
    showViewerScreen()

    await loadMapillarySDK()

    const mapillaryContainer = document.getElementById('mapillary-container')
    const container = document.getElementById('mapillary')
    if (mapillaryContainer) mapillaryContainer.style.display = 'block'
    if (container) { container.style.width = '100%'; container.style.height = '100%' }

    await new Promise((r) => setTimeout(r, 100))

    const token = getAccessToken()
    const image = await findImage(lat, lon)
    if (!image) {
      setStatus(`No imagery at "${locationName}", searching nearby...`)
      const nearby = await findNearestCityWithImagery(lat, lon, locationName)
      if (nearby) {
        hideMapillaryLoading()
        await showMapillaryView(nearby.lat, nearby.lon, nearby.name)
        return
      }
      throw new Error(`No Mapillary images found near "${locationName}". Try a more specific location.`)
    }

    initViewer(image.id, token, locationName)
    setStatus(`Showing 360° view for "${locationName}"`)
    addViewerButtons({
      onNearby: async (loc) => {
        const result = await findNearbyAreaWith360View(loc.lat, loc.lon, loc.name ?? locationName)
        if (result) return { lat: result.lat, lon: result.lon, displayName: result.name }
        return null
      },
      showMapillaryView,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    hideMapillaryLoading()
    showMainScreen()
    showError(
      msg.includes('token') || msg.includes('OAuth')
        ? msg
        : `360° view not available for "${locationName}". ${msg}`,
    )
    resetUI()
  }
}
