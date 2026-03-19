// ============================================================
// App — Main entry point (wires all modules together)
// ============================================================

import { initSpeech, isSupported as speechSupported, startListening } from './speech.js';
import { processLocation } from './geocoding.js';
import { saveSearch, renderRecentSearches } from './history.js';
import { setStatus, setRecognized, showError } from './ui.js';

// --- DOM refs ---
const micButton    = document.getElementById('mic-button');
const searchInput  = document.getElementById('search-input');
const searchSubmit = document.getElementById('search-submit');
const aboutButton  = document.getElementById('about-btn');
const mapillaryContainer = document.getElementById('mapillary-container');

// --- Text search handler ---

function handleTextSearch(query) {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecognized(trimmed);
    setStatus('Processing your request...');
    saveSearch(trimmed);
    renderRecentSearches(handleTextSearch);
    processLocation(trimmed);
}

// --- Event wiring ---

// Mic button
if (micButton) {
    micButton.addEventListener('click', () => startListening());
}

// Text input — Enter
if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleTextSearch(searchInput.value);
        }
    });
}

// Submit button
if (searchSubmit) {
    searchSubmit.addEventListener('click', () => handleTextSearch(searchInput?.value || ''));
}

// Popular destination tags
document.querySelectorAll('.popular-tag').forEach(tag => {
    tag.addEventListener('click', () => {
        const loc = tag.dataset.location;
        if (loc) {
            if (searchInput) searchInput.value = loc;
            handleTextSearch(loc);
        }
    });
});

// About button
if (aboutButton) {
    aboutButton.addEventListener('click', () => { window.location.href = 'about.html'; });
}

// Keyboard shortcut — Space to activate mic (when not typing)
document.addEventListener('keydown', (e) => {
    if (
        e.code === 'Space' &&
        document.activeElement !== searchInput &&
        document.activeElement.tagName !== 'INPUT' &&
        document.activeElement.tagName !== 'TEXTAREA' &&
        mapillaryContainer?.classList.contains('hidden') !== false
    ) {
        // Only on main screen
        if (mapillaryContainer && !mapillaryContainer.classList.contains('hidden')) return;
        e.preventDefault();
        startListening();
    }
});

// --- Init ---

document.addEventListener('DOMContentLoaded', () => {
    console.log('SAY TO GO app initialized (modular)');
    setStatus('Click the button and say a location');

    // Speech recognition
    initSpeech((term) => renderRecentSearches(handleTextSearch));

    if (!speechSupported) {
        showError('Speech recognition is not supported. Please try Chrome or Edge.');
    }

    if (!window.isSecureContext &&
        window.location.hostname !== 'localhost' &&
        window.location.hostname !== '127.0.0.1') {
        console.warn('Speech recognition requires HTTPS in production');
    }

    // Recent searches
    renderRecentSearches(handleTextSearch);
});
