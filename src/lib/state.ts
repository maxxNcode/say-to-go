import type { Location } from '../types'

interface InternalState {
  viewer: unknown | null
  currentLocation: { lat: number | null; lon: number | null; name: string | null }
  isListening: boolean
}

const state: InternalState = {
  viewer: null,
  currentLocation: { lat: null, lon: null, name: null },
  isListening: false,
}

export function getState() {
  return state
}

export function setViewer(v: unknown) {
  state.viewer = v
}

export function getViewer(): unknown | null {
  return state.viewer
}

export function destroyViewer() {
  if (state.viewer && typeof (state.viewer as Record<string, () => void>).remove === 'function') {
    ;(state.viewer as Record<string, () => void>).remove()
  }
  state.viewer = null
}

export function setCurrentLocation(lat: number | null, lon: number | null, name: string | null) {
  state.currentLocation = { lat, lon, name }
}

export function getCurrentLocation() {
  return state.currentLocation
}

export function setListening(val: boolean) {
  state.isListening = val
}
