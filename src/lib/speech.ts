type SearchCallback = (location: string) => void

const SpeechRecognitionAPI =
  window.SpeechRecognition ?? (window as unknown as Record<string, unknown>).webkitSpeechRecognition as typeof window.SpeechRecognition | undefined

export const isSupported = !!SpeechRecognitionAPI

const ERROR_MESSAGES: Record<string, string> = {
  'no-speech': 'No speech was detected. Please try again.',
  'aborted': 'Speech recognition was cancelled.',
  'audio-capture': 'No microphone was found. Ensure it is plugged in.',
  'not-allowed': 'Microphone access denied. Please allow microphone access.',
  'network': 'Network error occurred. Check your connection.',
  'service-not-allowed': 'Speech recognition service is not allowed.',
}

let recognition: InstanceType<typeof SpeechRecognitionAPI> | null = null
let onSearch: SearchCallback | null = null
let retryCount = 0
const MAX_RETRIES = 2
let errorHandler: ((msg: string) => void) | null = null
let startHandler: (() => void) | null = null
let endHandler: (() => void) | null = null

export function onSpeechError(handler: (msg: string) => void): void {
  errorHandler = handler
}

export function onSpeechStart(handler: () => void): void {
  startHandler = handler
}

export function onSpeechEnd(handler: () => void): void {
  endHandler = handler
}

export function initSpeech(callback: SearchCallback): void {
  if (!SpeechRecognitionAPI) return
  onSearch = callback

  recognition = new SpeechRecognitionAPI()
  recognition.continuous = false
  recognition.lang = 'en-US'
  recognition.interimResults = false

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const transcript = event.results[0][0].transcript.trim()
    if (transcript) {
      onSearch?.(transcript)
    }
  }

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    if (event.error === 'no-speech' && retryCount < MAX_RETRIES) {
      retryCount++
      setTimeout(() => startListening(), 500)
      return
    }
    retryCount = 0
    const message = ERROR_MESSAGES[event.error] ?? `Speech recognition error: ${event.error}`
    errorHandler?.(message)
  }

  recognition.onend = () => {
    isRecognizing = false
    endHandler?.()
  }
}

let isRecognizing = false

export function startListening(): void {
  if (!recognition) {
    errorHandler?.('Speech recognition is not initialized.')
    return
  }
  if (isRecognizing) return
  if (!window.isSecureContext && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    errorHandler?.('HTTPS is required for voice recognition.')
    return
  }
  retryCount = 0
  isRecognizing = true
  startHandler?.()
  try {
    recognition.start()
  } catch (e) {
    isRecognizing = false
    console.error('Failed to start speech recognition:', e)
  }
}
