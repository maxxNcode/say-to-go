// ============================================================
// Config — API token management
// ============================================================

/** Nominatim User-Agent header */
export const NOMINATIM_HEADERS = {
    'User-Agent': 'SAY TO GO App/1.0 (Educational Project)',
};

/**
 * Get the Mapillary access token from `window.MAPILLARY_CONFIG`.
 * Throws if token is missing or placeholder.
 * @returns {string}
 */
export function getAccessToken() {
    // This value is replaced by vercel-build.js during Vercel deployment
    const token = 'YOUR_MAPILLARY_ACCESS_TOKEN_HERE';

    if (!token || token === 'YOUR_MAPILLARY_ACCESS_TOKEN_HERE') {
        const fallback = window.MAPILLARY_CONFIG?.ACCESS_TOKEN;
        if (fallback && fallback !== 'YOUR_MAPILLARY_ACCESS_TOKEN_HERE') {
            return fallback;
        }

        throw new Error(
            'Mapillary API access token is missing or invalid. ' +
            'Please obtain a valid token from https://www.mapillary.com/dashboard/developers'
        );
    }
    return token;
}
