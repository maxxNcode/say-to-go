export interface Location {
  name: string
  lat: number
  lon: number
}

export interface ImageResult {
  id: string
  lat: number
  lon: number
}

export interface NominatimResult {
  display_name: string
  lat: string
  lon: string
  type: string
  importance: number
}

export interface SearchHistoryEntry {
  term: string
  timestamp: number
}

export interface AppState {
  isListening: boolean
  currentLocation: Location | null
}
