// ============================================================
// Speech — Web Speech API recognition
// ============================================================

import { showListening, hideListening, showError, resetUI, setStatus, setRecognized } from './ui.js';
import { saveSearch, renderRecentSearches } from './history.js';
import { processLocation } from './geocoding.js';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

/** @type {SpeechRecognition | null} */
let recognition = null;

/** Whether the browser supports the Web Speech API */
export const isSupported = !!SpeechRecognition;

// --- Error messages by error code ---
const ERROR_MESSAGES = {
    'network':              'Network connection issue. Try: 1) Mobile hotspot, 2) Disable VPN/firewall, 3) Different network.',
    'not-allowed':          'Microphone access denied. Click the mic icon in your address bar and select "Allow".',
    'service-not-allowed':  'Speech service not allowed. Try clearing cache or incognito window.',
    'no-speech':            'No speech detected. Please speak clearly into your microphone.',
    'audio-capture':        'Audio capture error. Check your microphone connection.',
    'bad-grammar':          'Please try speaking more clearly.',
    'language-not-supported':'Language not supported. Please try English.',
};

/**
 * Initialise speech recognition.
 * Must be called once on page load.
 * @param {(term: string) => void} onSearchCallback
 */
export function initSpeech(onSearchCallback) {
    if (!SpeechRecognition) return;

    recognition = new SpeechRecognition();
    recognition.continuous      = false;
    recognition.lang            = 'en-US';
    recognition.interimResults  = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
        console.log('Speech recognition started');
        showListening();
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Recognized:', transcript);
        setRecognized(transcript);
        setStatus('Processing your request...');
        saveSearch(transcript);
        onSearchCallback(transcript);
        processLocation(transcript);
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error', event);
        showError(ERROR_MESSAGES[event.error] || `Speech error: ${event.error}. Please try again.`);
        resetUI();
    };

    recognition.onend = () => {
        console.log('Speech recognition ended');
        hideListening();
    };
}

/**
 * Start listening.
 * Shows an error if not on a secure context.
 */
export function startListening() {
    if (!recognition) return;
    try {
        if (!window.isSecureContext &&
            window.location.hostname !== 'localhost' &&
            window.location.hostname !== '127.0.0.1') {
            showError('Speech recognition requires a secure connection (HTTPS).');
            return;
        }
        recognition.start();
    } catch (error) {
        console.error('Error starting recognition:', error);
        showError('Error starting voice recognition. ' + error.message);
    }
}
