// ============================================================
// Mapillary — Viewer, coverage checks, nearby search
// ============================================================

import { getAccessToken, NOMINATIM_HEADERS } from './config.js';
import { setViewer, getViewer, destroyViewer, setCurrentLocation } from './state.js';
import {
    setStatus, showError, resetUI,
    showViewerScreen, showMainScreen,
    showMapillaryLoading, hideMapillaryLoading,
    addViewerButtons,
} from './ui.js';

// --- Coverage check ---

/**
 * Check whether there is Mapillary coverage near (lat, lon).
 * Tries progressively larger bounding boxes.
 * @returns {Promise<boolean>}
 */
export async function checkMapillaryCoverage(lat, lon) {
    try {
        const token = getAccessToken();
        for (const size of [0.001, 0.005, 0.01, 0.02]) {
            try {
                const res = await fetch(
                    `https://graph.mapillary.com/images?access_token=${token}&fields=id` +
                    `&bbox=${lon - size},${lat - size},${lon + size},${lat + size}&limit=1`
                );
                if (res.ok) {
                    const d = await res.json();
                    if (d.data?.length > 0) return true;
                }
            } catch { /* ignore individual bbox failure */ }
        }
        return false;
    } catch {
        return false;
    }
}

// --- Show Mapillary 360° view ---

/**
 * Load and display a 360° view for the given coordinates.
 */
export async function showMapillaryView(lat, lon, locationName) {
    console.log('Showing Mapillary view:', { lat, lon, locationName });
    setStatus(`Loading experience for "${locationName}"...`);

    try {
        setCurrentLocation(lat, lon, locationName);
        showMapillaryLoading(`Loading experience for "${locationName}"...`);
        showViewerScreen();

        // Ensure container is sized
        const container = document.getElementById('mapillary');
        const mapillaryContainer = document.getElementById('mapillary-container');
        if (mapillaryContainer) mapillaryContainer.style.display = 'block';
        if (container) { container.style.width = '100%'; container.style.height = '100%'; }

        await new Promise(r => setTimeout(r, 100));

        const token = getAccessToken();

        // Search with expanding bbox
        let imageId = null;
        for (const size of [0.001, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2]) {
            try {
                const res = await fetch(
                    `https://graph.mapillary.com/images?access_token=${token}` +
                    `&fields=id,computed_geometry` +
                    `&bbox=${lon - size},${lat - size},${lon + size},${lat + size}&limit=1`
                );
                if (res.ok) {
                    const d = await res.json();
                    if (d.data?.length > 0) { imageId = d.data[0].id; break; }
                } else if (res.status === 400) {
                    const t = await res.text();
                    if (t.includes('OAuthException') || t.includes('access_token'))
                        throw new Error('Mapillary API token is invalid or expired.');
                }
            } catch (e) {
                if (e.message.includes('invalid') || e.message.includes('OAuth')) throw e;
            }
        }

        if (!imageId) {
            setStatus(`No imagery at "${locationName}", searching nearby...`);
            const nearby = await findNearestCityWithImagery(lat, lon, locationName);
            if (nearby) {
                hideMapillaryLoading();
                showMapillaryView(nearby.lat, nearby.lon, nearby.name);
                return;
            }
            throw new Error(`No Mapillary images found near "${locationName}". Try a more specific location.`);
        }

        initViewer(imageId, token);
        setStatus(`Showing 360° view for "${locationName}"`);
        addViewerButtons();
    } catch (error) {
        console.error('Mapillary error:', error);
        hideMapillaryLoading();
        showMainScreen();
        showError(
            error.message.includes('token') || error.message.includes('OAuth')
                ? error.message
                : `360° view not available for "${locationName}". ${error.message}`
        );
        resetUI();
    }
}

// --- Viewer init ---

function initViewer(imageId, accessToken) {
    try {
        destroyViewer();

        if (typeof mapillary === 'undefined')
            throw new Error('Mapillary SDK not loaded. Check your internet connection.');

        const container = document.getElementById('mapillary');
        if (!container) throw new Error('Mapillary container not found');
        container.style.display = 'block';
        container.style.width  = '100vw';
        container.style.height = '100vh';

        setTimeout(() => {
            const viewer = new mapillary.Viewer({
                accessToken,
                container: 'mapillary',
                imageId,
                component: { cover: false, sequence: true, direction: true, zoom: true },
            });
            setViewer(viewer);

            viewer.on('load', () => {
                console.log('Mapillary viewer loaded');
                container.style.backgroundColor = '#000';
                hideMapillaryLoading();
                activateComponents(viewer);
                setupViewerControls(viewer);
            });

            viewer.on('error', (err) => {
                console.error('Viewer error:', err);
                showError(`Failed to load 360° viewer. ${err.message}`);
                hideMapillaryLoading();
            });
        }, 200);
    } catch (error) {
        console.error('Viewer init error:', error);
        showError(`Failed to initialize viewer. ${error.message}`);
        hideMapillaryLoading();
        showMainScreen();
        resetUI();
    }
}

function activateComponents(viewer) {
    ['sequence', 'direction', 'zoom'].forEach(name => {
        try { viewer.getComponent(name)?.activate(); } catch { /* ignore */ }
    });
}

function setupViewerControls(viewer) {
    const mapillaryContainer = document.getElementById('mapillary-container');
    if (!viewer || !mapillaryContainer) return;

    const events = ['mousedown', 'mousemove', 'wheel', 'touchstart', 'touchmove', 'keydown'];
    const onInteraction = () => {
        if (!viewer?.getComponent) return;
        ['sequence', 'direction', 'zoom'].forEach(name => {
            try {
                const c = viewer.getComponent(name);
                if (c && !c.isActive()) c.activate();
            } catch { /* ignore */ }
        });
    };
    events.forEach(ev => mapillaryContainer.addEventListener(ev, onInteraction, { passive: true }));
}

// --- Nearest city search ---

async function findNearestCityWithImagery(lat, lon, originalName) {
    try {
        const token = getAccessToken();
        for (const radius of [0.1, 0.2, 0.5, 1.0, 2.0]) {
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=city&bounded=1` +
                    `&viewbox=${lon - radius},${lat - radius},${lon + radius},${lat + radius}&limit=5`,
                    { headers: NOMINATIM_HEADERS }
                );
                if (!res.ok) continue;
                const cities = await res.json();
                for (const city of cities) {
                    const cLat = parseFloat(city.lat), cLon = parseFloat(city.lon);
                    const bb = 0.01;
                    const ir = await fetch(
                        `https://graph.mapillary.com/images?access_token=${token}&fields=id` +
                        `&bbox=${cLon - bb},${cLat - bb},${cLon + bb},${cLat + bb}&limit=1`
                    );
                    if (ir.ok) {
                        const id = await ir.json();
                        if (id.data?.length > 0)
                            return { lat: cLat, lon: cLon, name: `${city.display_name} (near ${originalName})` };
                    } else if (ir.status === 400) {
                        const t = await ir.text();
                        if (t.includes('OAuthException')) throw new Error('Mapillary API token is invalid or expired.');
                    }
                }
            } catch (e) {
                if (e.message.includes('invalid') || e.message.includes('OAuth')) throw e;
            }
        }
        return null;
    } catch (error) {
        console.error('findNearestCityWithImagery error:', error);
        throw error;
    }
}

// --- Nearby area for "Near Area" button ---

/**
 * Search small offsets around (lat, lon) for a nearby spot with 360° coverage.
 */
export async function findNearbyAreaWith360View(lat, lon, originalName) {
    try {
        const token = getAccessToken();
        const offsets = [
            [0.001, 0.001], [-0.001, -0.001], [0.001, -0.001], [-0.001, 0.001],
            [0.002, 0.002], [-0.002, -0.002], [0.002, -0.002], [-0.002, 0.002],
            [0.003, 0.003], [-0.003, -0.003],
        ];

        for (const [dLat, dLon] of offsets) {
            const nLat = lat + dLat, nLon = lon + dLon;
            try {
                const res = await fetch(
                    `https://graph.mapillary.com/images?access_token=${token}` +
                    `&fields=id,computed_geometry` +
                    `&bbox=${nLon - 0.001},${nLat - 0.001},${nLon + 0.001},${nLat + 0.001}&limit=1`
                );
                if (!res.ok) continue;
                const d = await res.json();
                if (!d.data?.length) continue;

                // Reverse-geocode for a friendly name
                try {
                    const rev = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${nLat}&lon=${nLon}`,
                        { headers: NOMINATIM_HEADERS }
                    );
                    if (rev.ok) {
                        const rd = await rev.json();
                        if (rd.display_name)
                            return { lat: nLat, lon: nLon, name: `${rd.display_name.split(',')[0]} (near ${originalName})` };
                    }
                } catch { /* ignore */ }
                return { lat: nLat, lon: nLon, name: `Nearby area (${nLat.toFixed(4)}, ${nLon.toFixed(4)})` };
            } catch { /* ignore */ }
        }
        return null;
    } catch (error) {
        console.error('findNearbyAreaWith360View error:', error);
        throw error;
    }
}
