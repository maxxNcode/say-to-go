// ============================================================
// UI — Display utilities, error messages, viewer buttons
// ============================================================

import { getViewer, destroyViewer, getCurrentLocation } from './state.js';
import { findNearbyAreaWith360View, showMapillaryView } from './mapillary.js';

// --- Cached DOM refs ---
const statusText      = document.getElementById('status');
const recognizedText  = document.getElementById('recognized-text');
const loadingElement  = document.getElementById('loading');
const errorMessage    = document.getElementById('error-message');
const micButton       = document.getElementById('mic-button');
const appHeader       = document.querySelector('.app-header');
const mapillaryContainer = document.getElementById('mapillary-container');

let errorTimeout = null;

// --- Public helpers ---

/** Update the status message shown below the input area */
export function setStatus(msg) {
    if (statusText) statusText.textContent = msg;
}

/** Update the recognised-text pill */
export function setRecognized(msg) {
    if (recognizedText) recognizedText.textContent = msg;
}

/** Show the "Listening" overlay */
export function showListening() {
    if (micButton) micButton.classList.add('listening');
    setStatus('Listening... Speak now');
    if (loadingElement) loadingElement.classList.remove('hidden');
    if (errorMessage) errorMessage.classList.add('hidden');
}

/** Hide the "Listening" overlay */
export function hideListening() {
    if (micButton) micButton.classList.remove('listening');
    if (loadingElement) loadingElement.classList.add('hidden');
}

/** Reset UI to the default main-screen state */
export function resetUI() {
    hideListening();
    setRecognized('');
}

/** Show an error toast that auto-hides after 12s */
export function showError(message) {
    if (message.includes('network') || message.includes('Network')) {
        message += '\n\nTips: Try a mobile hotspot, disable VPN, or switch networks.';
    }
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }
    if (errorTimeout) clearTimeout(errorTimeout);
    errorTimeout = setTimeout(() => {
        if (errorMessage) errorMessage.classList.add('hidden');
    }, 12000);
}

// --- View transitions ---

/** Switch from main content to the 360° viewer */
export function showViewerScreen() {
    document.querySelector('.main-content')?.classList.add('hidden');
    if (mapillaryContainer) mapillaryContainer.classList.remove('hidden');
    if (appHeader) appHeader.classList.add('hidden');
}

/** Switch from the 360° viewer back to the main content */
export function showMainScreen() {
    if (mapillaryContainer) mapillaryContainer.classList.add('hidden');
    document.querySelector('.main-content')?.classList.remove('hidden');
    if (appHeader) appHeader.classList.remove('hidden');
}

/** Show / hide the Mapillary full-screen loading overlay */
export function showMapillaryLoading(text) {
    const el = document.getElementById('mapillary-loading');
    if (!el) return;
    const p = el.querySelector('p');
    if (p && text) p.textContent = text;
    el.classList.remove('hidden');
}
export function hideMapillaryLoading() {
    const el = document.getElementById('mapillary-loading');
    if (el) el.classList.add('hidden');
}

// --- Viewer overlay buttons ---

/** Create the Back + Near-Area buttons that float over the 360° viewer */
export function addViewerButtons() {
    const existing = document.getElementById('back-button-container');
    if (existing) existing.remove();

    const wrapper = document.createElement('div');
    wrapper.id = 'back-button-container';
    wrapper.className = 'viewer-controls';

    // --- Back ---
    const backBtn = document.createElement('button');
    backBtn.id = 'back-button';
    backBtn.className = 'viewer-btn viewer-btn--back';
    backBtn.textContent = '← Back to Search';
    backBtn.setAttribute('aria-label', 'Return to search');
    backBtn.addEventListener('click', () => {
        showMainScreen();
        setRecognized('');
        setStatus('Click the button and say a location');
        wrapper.remove();
        destroyViewer();
    });

    // --- Near Area ---
    const nearBtn = document.createElement('button');
    nearBtn.id = 'next-near-area-button';
    nearBtn.className = 'viewer-btn viewer-btn--near';
    nearBtn.textContent = 'Near Area';
    nearBtn.setAttribute('aria-label', 'Explore nearby area');
    nearBtn.addEventListener('click', async () => {
        const loc = getCurrentLocation();
        if (loc.lat === null || loc.lon === null) {
            showError('No current location. Go back and search again.');
            return;
        }
        try {
            showMapillaryLoading(`Searching nearby "${loc.name}"...`);
            const nearbyArea = await findNearbyAreaWith360View(loc.lat, loc.lon, loc.name);
            if (nearbyArea) {
                destroyViewer();
                showMapillaryView(nearbyArea.lat, nearbyArea.lon, nearbyArea.name);
            } else {
                hideMapillaryLoading();
                showError('No nearby areas with 360° views found.');
            }
        } catch (error) {
            hideMapillaryLoading();
            showError(`Error: ${error.message}`);
        }
    });

    wrapper.appendChild(backBtn);
    wrapper.appendChild(nearBtn);
    document.body.appendChild(wrapper);
}
