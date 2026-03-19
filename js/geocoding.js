// ============================================================
// Geocoding — Location processing + Nominatim API
// ============================================================

import { NOMINATIM_HEADERS } from './config.js';
import { checkMapillaryCoverage, showMapillaryView } from './mapillary.js';
import { setStatus, showError, resetUI } from './ui.js';

// --- Location suggestion maps ---

const locationSuggestions = {
    'paris':          'Eiffel Tower, Paris',
    'london':         'Big Ben, London',
    'new york':       'Times Square, New York',
    'tokyo':          'Shibuya Crossing, Tokyo',
    'sydney':         'Sydney Opera House, Sydney',
    'africa':         'Cairo, Egypt',
    'asia':           'Tokyo, Japan',
    'europe':         'Paris, France',
    'north america':  'New York, USA',
    'south america':  'Rio de Janeiro, Brazil',
    'australia':      'Sydney, Australia',
    'antarctica':     'McMurdo Station, Antarctica',
    'middle east':    'Dubai, UAE',
    'canada':         'Toronto, Canada',
    'china':          'Great Wall of China, Beijing',
};

const regionTips = {
    'africa':         'Try specific cities like Cairo or Cape Town',
    'asia':           'Try specific cities like Tokyo or Bangkok',
    'europe':         'Try specific cities like Paris or London',
    'north america':  'Try specific cities like New York or Toronto',
    'south america':  'Try Rio de Janeiro or Buenos Aires',
    'australia':      'Try Sydney or Melbourne',
    'middle east':    'Try Dubai or Istanbul',
    'canada':         'Try Toronto, Vancouver, or Montreal',
    'china':          'Try Beijing, Shanghai, or the Great Wall',
};

// --- Public API ---

/**
 * Process a raw location string from speech or text input.
 * Applies suggestion mapping, then geocodes.
 */
export function processLocation(location) {
    if (!location.trim()) {
        showError('No location recognized. Please try again.');
        resetUI();
        return;
    }

    const normalized = location.toLowerCase().trim();
    const suggested  = locationSuggestions[normalized] || location;

    setStatus(
        suggested !== location
            ? `Searching for "${suggested}" (improved search)...`
            : `Searching for "${location}"...`
    );

    if (regionTips[normalized]) {
        setTimeout(() => {
            const el = document.getElementById('status');
            if (el && el.textContent.includes(location)) {
                el.textContent += ` — ${regionTips[normalized]}`;
            }
        }, 1000);
    }

    geocodeLocation(suggested);
}

// --- Nominatim geocoding ---

async function geocodeLocation(location) {
    console.log('Geocoding:', location);
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=5`,
            { headers: NOMINATIM_HEADERS }
        );
        if (!response.ok) throw new Error(`Geocoding failed (status ${response.status}).`);

        const data = await response.json();

        if (data.length > 0) {
            // Try each result for one with Mapillary coverage
            for (const result of data) {
                const lat = parseFloat(result.lat);
                const lon = parseFloat(result.lon);
                const displayName = result.display_name || location;
                setStatus(`Checking availability for "${displayName}"...`);
                if (await checkMapillaryCoverage(lat, lon)) {
                    showMapillaryView(lat, lon, displayName);
                    return;
                }
            }
            // Fallback to first result
            showMapillaryView(
                parseFloat(data[0].lat),
                parseFloat(data[0].lon),
                data[0].display_name || location
            );
        } else {
            // Broader search
            const general = await searchGeneralLocation(location);
            if (general) {
                showMapillaryView(general.lat, general.lon, general.displayName);
                return;
            }
            throw new Error(`No results found for "${location}". Try a more specific name.`);
        }
    } catch (error) {
        console.error('Geocoding error:', error);
        showError(`Could not find location: ${location}. ${error.message}`);
        resetUI();
    }
}

async function searchGeneralLocation(location) {
    try {
        setStatus(`Searching for major cities in "${location}"...`);
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location + ' major city')}&format=json&limit=3`,
            { headers: NOMINATIM_HEADERS }
        );
        if (!response.ok) return null;

        const data = await response.json();
        if (data.length === 0) return null;

        for (const result of data) {
            const lat = parseFloat(result.lat);
            const lon = parseFloat(result.lon);
            if (await checkMapillaryCoverage(lat, lon)) {
                return { lat, lon, displayName: result.display_name || location };
            }
        }
        return {
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon),
            displayName: data[0].display_name || location,
        };
    } catch (error) {
        console.log('General location search error:', error);
        return null;
    }
}
