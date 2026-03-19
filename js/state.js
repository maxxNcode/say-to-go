// ============================================================
// State — Centralized application state
// ============================================================

const state = {
    /** @type {mapillary.Viewer | null} */
    viewer: null,

    /** Current location being displayed */
    currentLocation: { lat: null, lon: null, name: null },

    /** Whether speech recognition is currently active */
    isListening: false,
};

/** Get a shallow copy of the current state */
export function getState() {
    return { ...state };
}

/** Update the Mapillary viewer reference */
export function setViewer(viewer) {
    state.viewer = viewer;
}

/** Get the current viewer (may be null) */
export function getViewer() {
    return state.viewer;
}

/** Destroy the current viewer and clear reference */
export function destroyViewer() {
    if (state.viewer) {
        state.viewer.remove();
        state.viewer = null;
    }
}

/** Set the current location */
export function setCurrentLocation(lat, lon, name) {
    state.currentLocation = { lat, lon, name };
}

/** Get the current location */
export function getCurrentLocation() {
    return { ...state.currentLocation };
}

/** Update listening state */
export function setListening(val) {
    state.isListening = !!val;
}
